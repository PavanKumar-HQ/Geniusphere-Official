# Phase 0.4 Final Blocker Review & Specification Corrections

*Date:* 2026-10-17  
*Report Reference:* `REPORTS/2026-10-17_PHASE_0_4_FINAL_BLOCKER_REVIEW.md`  
*Phase:* Phase 0.4 Governance, Architecture Validation & Final Pre-Implementation Gate  
*Author:* Lead Product & Engineering Architect  
*Status:* Specification Corrected — Awaiting Stakeholder Sign-Off (Zero Code Implemented)  
*Authoritative Register:* [docs/MASTER_COVERAGE_REGISTER.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/MASTER_COVERAGE_REGISTER.md)  
*Operational Handoff:* [READY.md](file:///Users/pavankumars/Downloads/geniuspheregpt/READY.md) (v1.5.0)  

---

## 1. Executive Summary & Review Scope

This report records the explicit resolution of all six critical blockers (Blockers A through F) and eight technical issues raised in the Phase 0.4 governance review.

In strict compliance with the **Mandatory Engineering Constitution**:
- **Zero Implementation Executed:** No application code has been scaffolded, no dependencies installed, no database modified, and no cloud resources created. The workspace (`/Users/pavankumars/Downloads/geniuspheregpt`) remains 100% clean of premature implementation.
- **Evidence-Based Status Labeling:** Every architectural claim and requirement is strictly classified as **`Corrected`** (in specification), **`Unresolved`** (requiring external counsel/approval), or **`Awaiting Runtime Evidence`** (to be proven in local Milestone 1). No specification design is represented as a tested reality.

---

## 2. Itemized Resolution of the 8 Governance Issues

### Issue 1: CERT-In Reporting Trigger, Initial Report Procedure & Official Citations
- **Previous Finding:** Claimed the 6-hour clock began only after forensic "incident confirmation," and conflated routine application bugs with reportable incidents.
- **Correction Applied:**
  1. *Statutory Trigger:* Under Section 5(i) of the Cyber Security Directions issued under Section 70B(6) of the Information Technology Act, 2000 (**Directions No. 20(3)/2022-CERT-In dated 28 April 2022**) and the official **CERT-In FAQs dated May 2022**, covered cyber incidents must be reported **within six (6) hours of noticing such incidents or being brought to notice about such incidents**.
  2. *Initial Report Procedure:* The statutory clock starts upon *noticing*, NOT after root-cause analysis or forensic finalization. The organization MUST submit an initial report with available facts to `incident@cert-in.org.in` or the CERT-In portal within 6 hours, followed by periodic updates as the investigation progresses.
  3. *Error Differentiation:* Clearly distinguished ordinary application errors (SQL syntax errors, failed test assertions, 400/401/403/429 HTTP statuses, routine network drops) from reportable Annexure I cyber incidents (unauthorized access to IT systems/DBs, compromised backend runners, DDoS attacks, ransomware).
- **Supporting Documentation:** [SECURITY_PRIVACY.md:§1.1,§1.2](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/SECURITY_PRIVACY.md#L13), [DECISIONS.md:ADR-05](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L30), [RISK_REGISTER.md:RSK-05](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/RISK_REGISTER.md#L47).
- **Status:** **Corrected in Specification**; operational runbook drill *Awaiting Runtime Evidence* in Milestone 4.

---

### Issue 2: Executable RLS Policies, Hardened Helpers & Invariant Triggers (Blocker A)
- **Previous Finding:** The authorization matrix described intended access rules, but lacked complete executable `USING` and `WITH CHECK` clauses. `SECURITY DEFINER` helpers lacked function owners, caller checks, and execution privilege revokes. Roles like `platform_superadmin` were undefined. Invariant relationships (last admin removal, teacher-org binding, parent profile reading) were unverified.
- **Correction Applied:**
  1. *Complete Executable Policies:* Documented fully executable SQL policies with both `USING` and `WITH CHECK` clauses across all 11 tables in [docs/TECHNICAL_BLUEPRINT.md:§6](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L341).
  2. *Hardened Helper Architecture:* All helper functions (`has_org_role`, `is_classroom_teacher`, `is_enrolled_student`, `is_verified_parent`, `is_teacher_of_student`, `is_platform_superadmin`) enforce:
     - Function ownership: `ALTER FUNCTION ... OWNER TO postgres;`
     - Fixed search path: `SET search_path = public;`
     - Execution restrictions: `REVOKE ALL FROM PUBLIC; GRANT EXECUTE TO authenticated, service_role;`
     - Authenticated caller guard: `IF auth.uid() IS NULL THEN RETURN FALSE; END IF;`
     - Active entity checks: Verifies `organizations.is_active = TRUE` and `classrooms.is_active = TRUE`.
  3. *Platform Superadmin Role:* Explicitly defined `users.is_superadmin BOOLEAN NOT NULL DEFAULT FALSE` with strict column-level revocation: `REVOKE UPDATE (is_superadmin) FROM PUBLIC, authenticated;`.
  4. *Invariant Triggers:*
     - `trg_prevent_last_admin_removal`: Database trigger prevents deleting or deactivating the last active `institution_admin` of an organization (`ERRCODE 23514`).
     - `trg_verify_classroom_teacher`: Database trigger asserts that a classroom's `teacher_id` belongs to the classroom's `organization_id` with role `'teacher'` or `'institution_admin'`.
  5. *Parent Profile Access:* Defined `users` `SELECT` policy allowing verified parents to query their linked minor's profile via `is_verified_parent(id)`.
- **Supporting Documentation:** [TECHNICAL_BLUEPRINT.md:§4,§5,§6](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L156).
- **Status:** **Corrected in Specification**; *Awaiting Runtime Evidence* in Milestone 1 test execution.

---

### Issue 3: Precise SQL Grader Contract, Sandbox Watchdogs & Submission Integrity (Blockers B & C)
- **Previous Finding:** The `submissions` table allowed clients to supply `submission_hash`, `verification_log`, and `sync_status`. Grader lacked exact JSON contracts, conflated lexical tokens with AST grammar, lacked timeout host isolation, and claimed an unverified 16MB worker heap.
- **Correction Applied:**
  1. *Submission Schema Hardening:* Client updates to `submissions` are strictly denied (`USING FALSE`). Column grants on `INSERT` restrict authenticated students strictly to `assignment_id`, `submitted_query`, and `attempt_number`. All grading fields (`passed`, `score`, `submission_hash`, `verification_log`, `sync_status`) are computed and written exclusively by the Edge Function via `service_role`.
  2. *Attempt Lifecycle & Replay Caching:* Defined `attempt_number` tracking (capped at `max_attempts = 10`). Replay hash `SHA256(student_id + ":" + assignment_id + ":" + trimmed_sql)` returns cached grades on duplicate submissions without re-executing grading.
  3. *Exact Grader JSON Contract:* Defined formal JSON schemas for `POST /functions/v1/grade-sql-lab` (input: `assignment_id`, `sql_query`; output: `submission_id`, `passed`, `score`, `attempt_number`, `execution_time_ms`, `test_results[]`).
  4. *Demonstrated Parameter Binding:* Documented the exact SQLite mechanism in `deno.land/x/sqlite`:
     `const stmt = db.prepare(studentQuery); const rows = stmt.all(attackPayload);`
     Explained why parameter binding causes `' OR '1'='1` to return 0 rows (treated as literal string data rather than SQL syntax), distinguishing statement rejections (syntax errors, multi-statements) from successful zero-row injection defenses.
  5. *Parser vs Lexical Distinction:* Clarified that lexical tokenization checks forbidden tokens (`--`, `/* */`), while SQLite `prepare()` validates grammar. Explicitly added trailing non-whitespace checks to prevent uncompiled trailing statement execution.
  6. *Host Process Watchdog:* The 1.0s timeout timer runs in the **parent Edge Function process** (`setTimeout` calling `worker.terminate()`), ensuring blocked worker threads are reliably killed.
  7. *Honest Memory Limit Disclosure:* Acknowledged that Supabase Edge Functions / Deno Deploy do not expose custom V8 memory flags (`--max-old-space-size`). The 16MB worker heap limit is formally marked **UNVERIFIED**. Memory safety relies on query length caps (300 chars), single-statement rules, result buffer caps (25 rows / 32KB), and host watchdog termination.
- **Supporting Documentation:** [TECHNICAL_BLUEPRINT.md:§7](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L457), [DECISIONS.md:ADR-11](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L45).
- **Status:** **Corrected in Specification**; *Awaiting Runtime Evidence* in Milestone 1 test execution.

---

### Issue 4: Audit Logging Boundaries, Tamper Resistance & Logging Tiers (Blocker E)
- **Previous Finding:** Conflated in-database application audit logs with infrastructure logs, and claimed an RLS policy provided complete tamper-proofing.
- **Correction Applied:**
  1. *Four-Tier Logging Inventory:* Formally separated:
     - Tier 1: Application Business Audit Logs (`audit_events` in PostgreSQL Mumbai; 180-day retention).
     - Tier 2: Authentication Logs (Supabase Auth / GoTrue; 7-day retention).
     - Tier 3: HTTP Gateway / Edge Logs (Cloudflare Pages / WAF).
     - Tier 4: Database Engine Logs (AWS RDS / Supabase WAL & connection logs).
  2. *Tamper Resistance Honest Disclosure:* Explicitly documented that while RLS prevents standard application users from altering `audit_events`, an in-database table does **NOT** provide WORM hardware immutability against compromised database superusers or service-role credentials. External S3 Object Lock is deferred post-pilot.
  3. *Clock Synchronization:* Documented hypervisor NTP synchronization to national standard time (`time.nplindia.org` / `samay.nic.in`).
- **Supporting Documentation:** [SECURITY_PRIVACY.md:§4](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/SECURITY_PRIVACY.md#L77), [TECHNICAL_BLUEPRINT.md:§4,§8](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L255), [DECISIONS.md:ADR-12](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L55).
- **Status:** **Corrected in Specification**.

---

### Issue 5: Child Safety, Consent Lifecycle & Legal Disclaimers
- **Previous Finding:** Lacked detailed pending-consent restrictions, consent revocation lifecycle, and failed to clearly separate product safeguards from untested legal assumptions.
- **Correction Applied:**
  1. *Pending-Consent Restrictions:* Students with `account_status = 'pending_parent_consent'` can read public curriculum lessons, but **CANNOT** join classrooms, submit lab assignments, participate in collaborative features, receive public achievements, or display personal profile details.
  2. *Consent Evidence & Revocation Lifecycle:* Cryptographic parent verification token expires in 72 hours. Parent can revoke consent at any time via portal/link, transitioning student account to `'suspended'`. Unverified minor profiles without verified consent are scheduled for automated purge after 30 days.
  3. *Legal Assumptions Formally Labeled:*
     - Email verification proves inbox control, **not legal parenthood or lawful guardianship**.
     - School proxy consent under DPDP Section 9(4) is an **unverified legal assumption** requiring qualified Indian data protection counsel before onboarding institutional minors.
     - Formally stated: *Geniusphere does not claim statutory compliance merely because controls are planned.*
- **Supporting Documentation:** [SECURITY_PRIVACY.md:§1.1](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/SECURITY_PRIVACY.md#L18), [DECISIONS.md:ADR-05](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L30), [RISK_REGISTER.md:RSK-07](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/RISK_REGISTER.md#L49).
- **Status:** **Corrected in Specification**; Legal Advisory logged as **Unresolved (Requires Counsel)**.

---

### Issue 6: Regional Residency Evidence & Recovery Objectives
- **Previous Finding:** Treated HTTP response headers as complete proof of data residency, and conflated automated backup configuration with verified recovery.
- **Correction Applied:**
  1. *Diagnostic vs Provider Residency Evidence:* The HTTP header `x-sb-edge-region: ap-south-1` is explicitly classified as **diagnostic runtime evidence**. Complete proof of data residency requires provider-level evidence: primary Supabase AWS region selection (`ap-south-1` Mumbai), signed vendor Data Processing Agreements (DPAs), and Cloudflare Indian edge routing configurations.
  2. *Recovery Objectives:* RPO (24 hours) and RTO (2 hours) are explicitly labeled as **design targets** until physically measured and validated through a restore drill into an isolated staging database in Milestone 4.
- **Supporting Documentation:** [SECURITY_PRIVACY.md:§5](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/SECURITY_PRIVACY.md#L92), [DECISIONS.md:ADR-10](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L40), [TECHNICAL_BLUEPRINT.md:§1,§8](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L13).
- **Status:** **Corrected in Specification**; Physical restore drill *Awaiting Runtime Evidence* in Milestone 4.

---

### Issue 7: Expanded 9-Group Test Strategy & Status Distinctions (Blocker G)
- **Previous Finding:** Milestone 1 test plan was too narrow (5 RLS tests) and conflated database error codes with API HTTP status codes.
- **Correction Applied:**
  1. *Error Code vs HTTP Status Differentiation:* Explicitly mapped expected PostgreSQL error codes (`42501 Insufficient Privilege`, `23514 check_violation`, `23505 unique_violation`) against corresponding API HTTP responses (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `408 Request Timeout`).
  2. *Expanded 9 Test Groups (35 Test Cases Specified):*
     - Group 1: Identity and Roles (self-promotion, protected-field updates, inactive accounts).
     - Group 2: Tenant Isolation (cross-tenant SELECT, INSERT, UPDATE, DELETE).
     - Group 3: Institutional Invariants (teacher-org assignment, last admin removal, join-code expiry).
     - Group 4: Guardian Access (unverified, verified, unlinked, and revoked guardian queries).
     - Group 5: Submissions & Grades (forged scores, forged hashes, unauthorized assignments, retries).
     - Group 6: SQL Execution Sandbox (comments, multi-statements, malformed SQL, injection defense, host timeout).
     - Group 7: Audit & Privacy (unauthorized audit reads, mutation attempts, tenant scoping).
     - Group 8: Database Lifecycle (clean migration, repeatability, foreign key cascades).
     - Group 9: Regression Protection (full re-execution on updated schema).
  3. *Strict Status Labeling:* Formally recorded that all 35 test cases are currently **`Specified`** (0 Implemented, 0 Executed, 0 Passed). Conflation of specified tests with passed tests is strictly prohibited.
- **Supporting Documentation:** [ROADMAP.md:§3](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/ROADMAP.md#L49), [READY.md:§2,§4](file:///Users/pavankumars/Downloads/geniuspheregpt/READY.md#L35).
- **Status:** **Corrected in Specification**; *Awaiting Runtime Evidence* upon Milestone 1 execution.

---

### Issue 8: Cost Model Governance, Consistency & Table Reconciliations (Blocker F)
- **Previous Finding:** Costs were labeled as "verified estimates," and the external logging option ($102.37/mo) exceeded the approved $35/mo operating budget.
- **Correction Applied:**
  1. *Budget Spending Ceiling Enforced:* Re-labeled all financial figures as **planning estimates based on October 2026 pricing, subject to measured usage validation**. External S3 Log Drains ($60/mo) are **strictly DISABLED** during the pilot, keeping baseline operating costs at **~$30.98/month (~₹2,600 INR)** ($25 Supabase Pro + 18% GST). The Supabase spending cap is locked at **$35.00/month**.
  2. *Table Count & Invariants:* Definitively reconciled: **10 core relational tables plus `audit_events`** (total 11 tables).
  3. *Local Development Boundary:* Milestone 1 is strictly restricted to local Docker and Supabase CLI development. Zero paid cloud resources will be provisioned without explicit approval.
- **Supporting Documentation:** [TECHNICAL_BLUEPRINT.md:§8](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L535), [DECISIONS.md:ADR-12](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/DECISIONS.md#L55), [RISK_REGISTER.md:RSK-08](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/RISK_REGISTER.md#L50).
- **Status:** **Corrected in Specification & Budget Gate Enforced**.

---

## 3. Product Data Model Scope Classification (Blocker D)

To ensure the relational schema supports the actual learning platform rather than a disconnected database demo, product entities have been explicitly mapped in [docs/TECHNICAL_BLUEPRINT.md:§3](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md#L141):

- **Pilot Core Scope:** Independent learner registration, join-code classroom provisioning, Foundations of Web Security & SQL Defense (Lesson 1 & Lab 101), SQLite-Wasm local execution, server-authoritative Deno Edge Grader, "Defense Initiate" badge, responsive mobile PWA (CodeMirror 6).
- **Post-Pilot Release Scope:** Finance & Math modules, Professional Skills curriculum, CSV roster imports, DigiLocker/Aadhaar guardian tokens, verifiable PDF certificates, institutional recurring billing.
- **Explicit Exclusions:** Unsandboxed client code execution against production DB, commercial gaming clones (PUBG/Free Fire assets), paywalled hearts, native app store binary builds.

---

## 4. Itemized Finding & Blocker Status Matrix

| Finding / Blocker ID | Core Subject Area | Resolution Summary | Current Verification Status |
|---|---|---|:---:|
| **BLK-A** | Executable Authorization & Invariants | Complete `USING`/`WITH CHECK` policies for all 11 tables; function owners (`postgres`); caller checks; last admin & teacher invariant triggers; superadmin role defined. | **Corrected in Specification** *(Awaiting Runtime Evidence in M1)* |
| **BLK-B** | Submission Integrity & Attempt Lifecycle | Client writes to score/passed/verification_log denied; server computes hash; attempt tracking (max 10); duplicate replay caching. | **Corrected in Specification** *(Awaiting Runtime Evidence in M1)* |
| **BLK-C** | Grader Sandbox & Host Watchdog | Exact JSON schemas; parameter binding demonstrated; host `setTimeout` worker termination; memory ceiling marked unverified. | **Corrected in Specification** *(Awaiting Runtime Evidence in M1)* |
| **BLK-D** | Learning Product Scope Classification | Mapped all curriculum, credentials, and institutional features across Pilot Core, Post-Pilot, and Excluded. | **Corrected in Specification** |
| **BLK-E** | Logging Boundaries & CERT-In Clock | 4-tier logging inventory; in-DB logs acknowledged as not superuser tamper-proof; CERT-In trigger: 6h from *noticing*. | **Corrected in Specification** *(Legal Advisory Unresolved)* |
| **BLK-F** | Budget Ceiling & Logging Add-on | S3 Log Drain ($60/mo) disabled for pilot; spend cap locked at $35/mo; costs labeled as planning estimates. | **Corrected in Specification & Enforced** |
| **BLK-G** | Layered Testing & Error Differentiation | 9 test groups (35 test cases specified); DB error codes (`42501`, `23514`) distinguished from API HTTP statuses (`400`, `403`). | **Corrected in Specification** *(All 35 Tests Specified)* |

---

## 5. Executive Decision Section & Exact Milestone 1 Scope

### 5.1. Readiness Assessment
**The specification is ARCHITECTURALLY SOUND and READY for local-only Milestone 1 implementation.**  
All 6 governance blockers have been resolved in the specification. In accordance with governance instructions, **implementation remains completely paused pending explicit stakeholder sign-off.**

### 5.2. Exact Scope of Milestone 1 (Local Development Only)
- **Environment:** Initialize Git repository and local Supabase stack (`supabase init`, `supabase start` via Docker).
- **Migrations:** Version-controlled SQL migration scripts for all 10 core tables plus `audit_events` with column-level grants and invariant triggers.
- **Policies:** Complete executable RLS policies across all 11 tables with hardened `SECURITY DEFINER` helpers.
- **Automated Vitest Security Suite:** Implementation and execution of specified test cases in Groups 1–5 and Group 7 (asserting database error codes and API HTTP statuses).
- **Standalone Deno Grader Suite:** Implementation and execution of specified test cases in Group 6 (validating AST single `SELECT` enforcement, 5 challenge assertions via native parameter binding, and host watchdog termination within <= 1.0s).

### 5.3. Milestone 1 Definition of Done (Exit Gates)
1. Clean reproducible migration execution (`supabase db reset` exits 0).
2. Explicit grants and complete RLS policy coverage across all 11 tables.
3. 100% pass rate across all 35 specified test cases in the 9 test groups.
4. Demonstrated SQL grader statement restriction, native parameter binding, and host-level termination in Deno runtime.
5. Deterministic CI execution logs retained.
6. Zero service-role keys exposed in client-facing code.
7. Zero cloud resources created or paid expenditures incurred.
