# Geniusphere — Security, Privacy & Child Safety Architecture (`SECURITY_PRIVACY.md`)

*Document Version:* 1.4.0  
*Status:* Specification Corrected (Pre-Implementation) — Awaiting Runtime Evidence  
*Statutory Jurisdiction:* India (DPDP Act 2023, IT Act 2000, CERT-In Directions 2022)  
*Review Phase:* Phase 0.4 Final Blocker Review  

---

## 1. Statutory Compliance & Legal Boundaries (India)

### 1.1. Separation of Verified Statutory Facts, Product Safeguards, and Legal Questions

#### A. Verified Statutory Facts (Primary Sources)
1. **DPDP Act Phased Commencement:** Under MeitY commencement notifications, Section 9 (children's data processing, verifiable parental consent, tracking prohibition) and Section 33 statutory penalties (up to ₹200–₹250 Crore) come into force in **Phase 3 on May 14, 2027**.
2. **Definition of Child:** Section 2(f) of the Digital Personal Data Protection Act, 2023 defines a child as any individual under 18 years of age.
3. **CERT-In Directions (28 April 2022) & FAQs (May 2022):** 
   - *Statutory Authority:* Issued under Section 70B(6) of the Information Technology Act, 2000 (Directions No. 20(3)/2022-CERT-In).
   - *Applicability:* Applies to all service providers, intermediaries, data centres, and commercial body corporates operating in India.
   - *Mandatory 6-Hour Reporting Trigger:* Section 5(i) mandates that cyber incidents must be reported to CERT-In **within six (6) hours of noticing such incidents or being brought to notice about such incidents**.
   - *Initial Reporting Procedure:* The six-hour clock starts at the moment of *noticing*, **NOT** after root-cause confirmation or forensic finalization. The organization MUST dispatch an initial report with available details to `incident@cert-in.org.in` or via the CERT-In incident portal within 6 hours, followed by subsequent investigative updates.

#### B. Product Safeguards (Adopted by Geniusphere)
1. **Age-Gate on Registration:** Every user provides a Date of Birth during signup. If calculated `age < 18`, account status is set to `pending_parent_consent`.
2. **Pending-Consent Restrictions:** While in `pending_parent_consent` status:
   - Student CAN log in and view public educational curriculum lessons.
   - Student **CANNOT** join classrooms, submit lab assignments, participate in collaborative features, receive public achievements, or display personal profile details to other users.
3. **Parent Consent Evidence & Verification Token:**
   - A single-use cryptographic token (256-bit entropy, hashed via SHA-256) is dispatched to the parent/guardian's email.
   - Token expires in **72 hours**.
   - Upon verification click, `parent_guardian_links` records `consent_status = 'verified'`, `consent_granted_at = NOW()`, verification IP address, user-agent, and consent method.
4. **Consent Revocation & Account Lifecycle:**
   - A parent can revoke consent at any time via a dedicated parent portal or email link.
   - Upon revocation, `consent_status` changes to `'revoked'`, student account transitions to `'suspended'`, and active classroom enrollments are disabled.
   - *Data Retention / Purge Policy:* Minor profiles that remain in `pending_parent_consent` for >30 days without parent verification are scheduled for automated soft-deletion and subsequent database purge.
5. **Data Minimization:** The platform collects only `email`, `full_name`, and `date_of_birth`. Zero collection of government national IDs, biometrics, financial cardholder data, or geolocation.
6. **Zero Commercial Advertising or Tracking SDKs:** Absolute prohibition of third-party advertising trackers, behavioral profiling, or commercial marketing pixels (e.g. Google Ads, Meta Pixel) in accordance with DPDP Section 9(3).

#### C. Questions Requiring Qualified Indian Legal Counsel (Untested Legal Assumptions)
1. **Guardian Identity Proof:** Email confirmation links verify access to an email inbox, but **do not legally prove biological parenthood or lawful guardianship** (a minor could enter an alternate email address they control). Formal legal counsel must advise on whether email-based consent satisfies the forthcoming DPDP Rules or if government-backed identity tokens (e.g. DigiLocker, Aadhaar-based tokens) will be required.
2. **School Proxy Consent Authority:** Section 9(4) allows exemptions from parental consent *only when specifically notified by the Central Government*. Because no general exemption has been notified for private EdTech platforms, claiming schools can legally act as proxy guardians is an **unverified legal assumption** requiring formal legal opinion before institutional scaling.
3. **Statutory Compliance Disclaimer:** **Geniusphere does not claim statutory compliance merely because controls are planned.** Compliance status remains *Awaiting Legal Review & Runtime Verification*.

---

### 1.2. CERT-In Incident Reporting Matrix & Categorization

To avoid alert fatigue while maintaining statutory compliance, the platform distinguishes between routine application errors and reportable cyber security incidents:

| Incident Classification | Examples in Geniusphere | Statutory Action & Timeline | Responsible Officer |
|---|---|---|---|
| **Ordinary Application Errors** *(Non-Reportable)* | Student SQL syntax error, failed lab assertions, 400 Bad Request, 401 Unauthorized, routine rate-limit triggers (429), client-side network disconnects. | Internal application logging (`audit_events`); standard debugging; **NO report to CERT-In**. | Application Engineering Team |
| **Annexure I Cyber Incidents** *(Mandatory Reportable)* | Unauthorized access to user database; SQL injection compromising server infrastructure; cross-tenant data leak affecting student PII; ransomware on backend runners; DDoS attacks exceeding WAF capacity. | **Initial report dispatched to `incident@cert-in.org.in` within 6 hours of noticing.** Follow-up updates provided within 24 hours. | Designated Incident Response Officer / Security Architect |

---

## 2. Multi-Tenant Authorization & Privilege Hardening

### 2.1. Prevention of Self-Promotion & Column-Level Privilege Hardening
- **Decoupled Roles:** The `users` table stores user identity only. Institutional roles (`learner`, `teacher`, `institution_admin`) exist exclusively in `organization_memberships`.
- **Protected Columns:** `date_of_birth`, `is_minor`, `is_superadmin`, and `account_status` cannot be altered by standard users.
- **Database Column Permissions:**
  ```sql
  REVOKE UPDATE ON public.users FROM PUBLIC, anon, authenticated;
  GRANT UPDATE (full_name) ON public.users TO authenticated;
  -- date_of_birth, is_minor, is_superadmin, account_status cannot be updated by users
  ```
- **Registration Trigger:** User profiles are created exclusively via an internal database trigger on `auth.users` (`handle_new_user()`). Direct client inserts into `public.users` are denied.

### 2.2. Hardened Non-Recursive RLS Helper Functions
To prevent infinite policy recursion and execution escalation in PostgreSQL, all authorization helper functions adhere to strict security constraints:
1. **Explicit Function Ownership:** Owned by `postgres` (or trusted database migration role).
2. **Restricted Search Path:** `SET search_path = public` to prevent schema search path injection.
3. **Revoked Public Execute:** `REVOKE ALL ON FUNCTION ... FROM PUBLIC; GRANT EXECUTE ... TO authenticated, service_role;`
4. **Authenticated Caller Guard:** Explicit check: `IF auth.uid() IS NULL THEN RETURN FALSE; END IF;`
5. **Active Status Verification:** Invariant checks verify that organizations (`is_active = true`) and accounts (`account_status = 'active'`) are active.

---

## 3. Threat Model & Mitigations (STRIDE Framework)

| STRIDE Threat Category | Attack Vector in Geniusphere | Architectural Mitigation | Status |
|---|---|---|:---:|
| **Spoofing** | Student impersonating another student or teacher via forged tokens. | Cryptographically signed, short-lived JWT tokens managed by Supabase Auth with secure HTTP-only cookies and cryptographic signature verification. | Specified (Awaiting Test) |
| **Tampering** | Student altering client-side code evaluation in DevTools or faking submission hashes/scores. | **Server-Authoritative Grader:** Client submissions contain only query template and assignment ID. The Edge Function computes hash, runs assertions in isolated Deno worker, and writes scores via `service_role`. | Specified (Awaiting Test) |
| **Repudiation** | User denying assignment submission, grade modification, or admin changes. | Structured append-only `audit_events` table logging actor ID, action type, IP address, user-agent, and timestamp. | Specified (Awaiting Test) |
| **Information Disclosure** | School A accessing School B's confidential gradebook, student roster, or submissions. | PostgreSQL **Row-Level Security (RLS)** strictly enforcing `organization_id` boundary checks via hardened helper functions. | Specified (Awaiting Test) |
| **Denial of Service** | Student submitting runaway recursive queries (`WITH RECURSIVE`), multi-statement drops, or oversized payloads in SQL lab. | Max query length: 300 chars. AST validation rejects multi-statements, comments, and DDL/DML. Host Edge Function terminates worker after 1.0s. Result buffer capped at 25 rows / 32KB. | Specified (Awaiting Test) |
| **Elevation of Privilege** | Student exploiting SQL injection to gain database administrative privileges. | Complete separation: Student code runs against an isolated, in-memory SQLite database (`:memory:`) containing synthetic challenge tables. The platform PostgreSQL database is never exposed to user SQL execution. | Specified (Awaiting Test) |

---

## 4. Audit Logging Boundaries & Tamper-Resistance Realities

### 4.1. Separation of Logging Tiers
To avoid conflating application events with infrastructure telemetry:
1. **Application Business Audit Logs (`audit_events`):** High-level business events (login, enrollment, submission, grade issuance, consent grant/revocation, role changes). Retained in PostgreSQL Mumbai for 180 days.
2. **Authentication Logs:** Supabase Auth (GoTrue) internal audit logs (password resets, token issuance, auth failures). Retained in Supabase Pro dashboard for 7 days.
3. **HTTP Gateway / Edge Logs:** Cloudflare Pages & WAF access logs (raw IP, TLS version, URI, edge status).
4. **PostgreSQL Engine Logs:** AWS RDS / Supabase database logs (WAL replication, connection pooler, slow queries).

### 4.2. Tamper Resistance Honest Disclosure
- An in-database RLS policy (`FOR INSERT WITH CHECK (false)`) prevents regular `authenticated` or `anon` users from inserting, updating, or deleting audit records.
- **Honest Limitation:** An in-database table does **NOT** provide WORM (Write Once Read Many) hardware tamper-proofing against a compromised `postgres` superuser or compromised Supabase `service_role` key. Full regulatory immutability would require an external write-only log drain (e.g. AWS S3 Object Lock), which is deferred post-pilot due to budget constraints.

---

## 5. Regional Data Residency & Provider Evidence Requirements

- **Diagnostic Evidence:** Response headers (such as `x-sb-edge-region: ap-south-1`) provide **diagnostic runtime verification**, but do not constitute legal proof of complete data residency.
- **Provider-Level Evidence Requirements:**
  1. *Supabase Project Dashboard:* Verification of primary AWS region selection (`ap-south-1` Mumbai).
  2. *Vendor Data Processing Agreements (DPAs):* Formal DPAs executed with Supabase and Cloudflare confirming regional data processing terms.
  3. *Cloudflare Pages Configuration:* Asset routing configured with Indian edge caching and zero international data transfers of student personal records.

---

## 6. Mandatory Cross-Tenant Security CI Test Gates

Prior to any deployment, automated integration tests MUST assert the following negative test cases:
1. **Self-Promotion Denial:** Attacker attempting to insert into `organization_memberships` receives `42501 Insufficient Privilege` or RLS policy denial.
2. **Protected Column Tampering:** User attempting `UPDATE users SET account_status = 'active'` receives column privilege denial.
3. **Cross-Tenant Reads (SELECT):** User A (Student in School 1) querying classrooms or assignments in School 2 receives `0 rows`.
4. **Cross-Tenant Writes (INSERT):** Teacher A attempting to insert an assignment into a classroom in School 2 receives RLS policy violation.
5. **Grade Tampering Denial:** Student attempting direct SQL update `submissions.score = 100` receives RLS denial.
6. **Audit Log Immutability:** Any user attempting `UPDATE` or `DELETE` on `audit_events` receives RLS denial.
7. **Guardian Scope Enforcement:** Unverified parent receives 0 rows when querying student submissions; verified parent sees only their linked student's records; revoked parent receives 0 rows.
