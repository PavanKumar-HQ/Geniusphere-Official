# Geniusphere — Architectural Decisions & Assumptions (`DECISIONS.md`)

*Document Version:* 1.3.0  
*Status:* Corrected Specification (Pre-Implementation) — Awaiting Runtime Verification  
*Review Phase:* Phase 0.4 Final Blocker Review  

---

## 1. Decision Register Summary

| ADR ID | Decision Title | Status | Primary Rationale & Supporting Evidence |
|---|---|---|---|
| **ADR-01** | Managed PaaS Architecture (Cloudflare + Supabase) | Confirmed | Eliminates 4+ weeks of auth/database plumbing; reduces pilot failure risk; maintains low pilot operating cost (~$30.98/mo). |
| **ADR-02** | PostgreSQL 16 with Row-Level Security in AWS Mumbai | Confirmed | Native RLS enforces multi-tenancy at database engine layer; AWS Mumbai (`ap-south-1`) guarantees domestic database residency. |
| **ADR-03** | Interactive Lab Execution Strategy (SQLite-Wasm) | Confirmed | Pyodide (~18MB) causes mobile RAM crashes and 4G download delays; gVisor is premature for introductory labs. SQLite-Wasm is 15x smaller (~1.1MB), loads in <400ms, and enables genuine SQL defense labs. |
| **ADR-04** | PWA & Streamlined Offline Sync | Confirmed | Workbox Service Worker caching + IndexedDB mutation queue with explicit sync states (`LOCAL_UNSYNCED`, `SYNCING`, `SERVER_CONFIRMED`, `SYNC_CONFLICT`). Acknowledges browser closed limitations. |
| **ADR-05** | Child Privacy, DPDP Act & CERT-In Reporting | **Updated & Refined** | Statutory enforcement of DPDP Section 9 takes effect **May 14, 2027**. Email verification confirms inbox access, not legal parenthood. School proxy consent requires qualified legal counsel. CERT-In 6-hour reporting clock begins within 6 hours of **noticing or being brought to notice** (Directions No. 20(3)/2022-CERT-In & FAQs May 2022). |
| **ADR-06** | Static Asset & Media Delivery via Cloudflare Pages and R2 | Confirmed | **$0 Egress fees** eliminate bandwidth shock from educational media and Wasm files. |
| **ADR-07** | Deferral of Monetization in Pilot | Confirmed | Strict focus on pedagogical quality, system stability, and compliance during initial pilot cohort. Zero payment gateways. |
| **ADR-08** | In-Browser Code Editor: CodeMirror 6 | Confirmed | Monaco is ~4MB, lacks touch responsiveness, and breaks on budget mobile screens. CodeMirror 6 is ~250KB, touch-native, and highly accessible. |
| **ADR-09** | Elimination of Redis for Pilot Phase | Confirmed | For a pilot cohort of 50 peak concurrent users, Redis is unnecessary infrastructure overhead. PostgreSQL handles token revocation effortlessly. |
| **ADR-10** | Regional Edge Function Pinning & Residency Evidence | **Updated & Refined** | Supabase Edge Functions run globally by default unless pinned to **`ap-south-1` (Mumbai)**. Response headers (`x-sb-edge-region`) are diagnostic runtime evidence; provider contracts, dashboard configs, and DPAs establish formal residency. |
| **ADR-11** | SQL Execution Sandbox, Host Watchdog & Memory Limits | **Updated & Refined** | Primary-source research proved `deno.land/x/sqlite` lacks C authorizers. Enforce safety via AST validation, single `SELECT` enforcement, 300-char cap, positional parameter binding (`?`), and a host process watchdog timer calling `worker.terminate()` after 1.0s. Worker memory limits marked unverified. |
| **ADR-12** | Logging Architecture & Budget Spending Ceiling | **Updated & Refined** | Native Supabase log retention is 7 days. Official Log Drains add-on costs $60/month. For Phase 1 Pilot, capture structured 180-day audit events directly inside the Mumbai PostgreSQL database (`audit_events` table) at $0 extra cost. External S3 Log Drains are **disabled** to honor the $35/mo cap. In-DB logs disclosed as not superuser tamper-proof. |
| **ADR-13** | Reconciliation of GS-ENG-2026-V1 Baseline & Deferred Technologies | Confirmed | PostgreSQL 16 sole transactional database; MongoDB and Redis deferred; CodeMirror 6 over Monaco; accessible SVG visualizers over heavy WebGL. |
| **ADR-14** | Framework Selection: Retaining React 19 + Vite 6 SPA with Edge PWA | **Confirmed & Selected** | Evaluated against Next.js, Astro, SvelteKit, and React Router v7. React 19 + Vite 6 delivers sub-second builds (890ms), 198KB gzipped bundle, seamless browser Wasm (sql.js) and CodeMirror 6 integration, zero server runtime maintenance, and avoids catastrophic rewrite of 60+ green tests and 12 working lab engines. |

---

## 2. Detailed Architectural Decision Records (ADRs)

### ADR-05 (Refined): Child Privacy, Statutory Timelines & CERT-In Directives
- **Context:** Previous revisions claimed parental consent was legally proven via email links, assumed schools could consent as proxies without legal review, and claimed the CERT-In 6-hour clock started only after full forensic incident confirmation.
- **Decision:**
  1. *DPDP Act 2023 Runway:* Official MeitY phased commencement roadmap establishes that Section 9 (children's data processing and parental consent) and Section 33 statutory penalties come into force in **Phase 3 on May 14, 2027**.
  2. *Parental Identity Proof:* Acknowledge that an email verification link proves access to an email inbox, but **is not legal proof of biological parenthood or lawful guardianship**. Labeled as a product safeguard. Formal legal advice is required before institutional onboarding.
  3. *School Proxy Consent:* Section 9(4) exemptions have not been notified by the Central Government. Claiming schools can act as proxy guardians is an unverified assumption requiring qualified Indian legal advice.
  4. *CERT-In Reporting (28 April 2022 & FAQs May 2022):* Section 5(i) of Directions No. 20(3)/2022-CERT-In mandates reporting covered cyber incidents **within six (6) hours of noticing such incidents or being brought to notice about such incidents**. The organization MUST submit an initial report with available information to `incident@cert-in.org.in` within 6 hours of noticing, without waiting for forensic confirmation. Ordinary application errors are distinguished from reportable Annexure I incidents.
- **Status:** **Approved for Implementation**.

---

### ADR-10 (Refined): Regional Edge Function Pinning & Residency Evidence
- **Context:** Supabase Edge Functions execute globally across Deno Deploy edge locations by default. Grading payloads must execute within Indian borders.
- **Decision:** 
  1. The grading Edge Function invocation MUST explicitly declare `region: FunctionRegion.ApSouth1` or pass `x-region: ap-south-1`.
  2. The function runtime inspects `Deno.env.get('SB_REGION') === 'ap-south-1'`.
  3. The client and test suites inspect `x-sb-edge-region: ap-south-1` as **diagnostic runtime evidence**.
  4. Complete proof of data residency requires provider-level evidence: primary Supabase AWS region configured in `ap-south-1` (Mumbai), signed vendor Data Processing Agreement (DPA), and Cloudflare Indian edge routing configuration.
- **Status:** **Approved for Implementation**.

---

### ADR-11 (Refined): SQL Execution Sandbox, Host Watchdog & Memory Limits
- **Context:** Students submit SQL query templates to solve Lab 101. An Edge Function does not automatically sandbox SQL execution. Primary source inspection revealed `deno.land/x/sqlite` does not expose native C authorizers or progress hooks.
- **Decision:**
  1. **Strict Grammar Restriction:** Lab 101 accepts **strictly single `SELECT` statements**. Multi-statement semicolons, SQL comments (`--`, `/* */`), and keywords (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `ATTACH`, `DETACH`, `PRAGMA`, `WITH RECURSIVE`) are rejected before execution.
  2. **Bounds & Host Watchdog:** Max query length: **300 characters**. Max execution time: **1.0 second**. The watchdog timer runs in the **host Edge Function process** (`setTimeout` calling `worker.terminate()`), ensuring blocked worker threads are reliably terminated.
  3. **Memory Limits Reality (Unverified):** Supabase Edge Functions / Deno Deploy do not expose custom V8 memory flags (`--max-old-space-size`). A 16MB worker heap memory ceiling **cannot be strictly guaranteed and is marked UNVERIFIED**. Memory safety is enforced via query length caps, single-statement rules, result buffer caps (25 rows / 32KB), and watchdog termination.
  4. **Genuine Parameter Binding:** The student submits a query template (`... WHERE username = ? ...`). The grader prepares the statement (`db.prepare()`) and executes it with authoritative test values (`stmt.all(input)`), evaluating native parameter binding.
- **Status:** **Approved for Implementation**.

---

### ADR-12 (Refined): Logging Architecture & Budget Spending Ceiling
- **Context:** CERT-In directions mandate 180-day domestic log retention. Supabase dashboard logs are retained for only **7 days**. Enabling external Log Drains to S3 costs a flat **$60/month add-on fee**, pushing total monthly operating costs to ~$102.37/mo, which exceeds the approved $35/month operating cap.
- **Decision:**
  1. **Phase 1 Pilot Implementation:** Implement in-database structured audit logging (`audit_events` table) in the primary Mumbai PostgreSQL database. Retain high-level business events for 180 days at **$0 extra infrastructure cost**.
  2. **External Log Drain Status:** The $60/mo Log Drain add-on is **strictly DISABLED** during the pilot to honor the $35/mo budget cap.
  3. **Tamper-Resistance Reality:** In-database RLS policies (`FOR INSERT WITH CHECK (false)`) prevent standard application users from altering or deleting logs. However, an in-database table does **NOT** provide WORM hardware tamper-proofing against privileged superuser or service-role direct database access.
  4. **Cost Transparency:** Costs are documented as planning estimates based on October 2026 pricing, subject to measured usage validation.
- **Status:** **Approved for Implementation**.

---

### ADR-13: Reconciliation of `GS-ENG-2026-V1` Baseline & Deferred Technologies
- **Context:** The `GS-ENG-2026-V1` specification proposes a multi-database, microservice, API-gateway architecture (PostgreSQL + MongoDB + Redis + Kong + gRPC + Monaco + Ed25519 W3C VC). Implementing all technologies at once creates immense operational tax, cloud cost overruns, and mobile device crashes before pilot demand is proven.
- **Decision:**
  1. **PostgreSQL 16 (Keep P0):** Sole authoritative transactional database. Handles multi-tenancy, RLS, assessments, progress, and audit logs cleanly.
  2. **MongoDB (Deferred):** Curriculum modules and quizzes are stored directly in PostgreSQL with JSONB columns. Eliminates dual-database synchronization drift and saves ~$30/mo.
  3. **Redis (Deferred to Post-Pilot):** Pilot concurrency (50–250 users) is handled efficiently by PostgreSQL. Redis will be introduced if post-pilot demand requires high-volume caching.
  4. **Kong API Gateway (Deferred):** Routing, edge rate limiting (60 req/min), and SSL termination are handled by Cloudflare Pages and Edge WAF at $0 extra cost.
  5. **gRPC & Service Mesh (Deferred):** Adds serialization and proxy overhead without improving student learning. Standard REST / RPC over HTTP is maintained.
  6. **CodeMirror 6 over Monaco:** Monaco (~4MB) breaks on budget Android mobile browsers with Low-Memory Killers (LMK). CodeMirror 6 (~250KB) is touch-native, accessible, and fast.
  7. **Ed25519 W3C Verifiable Credentials (Staged for Phase 4):** Deterministic SHA-256 verification hash and public certificate modal are implemented now; formal W3C VC JSON-LD signing with Ed25519 keys will be connected once pilot completion requirements are validated.
  8. **Targeted Offline Sync:** Built incrementally using IndexedDB mutation queues and Service Worker CacheStorage (`LOCAL_UNSYNCED` -> `SYNCING` -> `SERVER_CONFIRMED`). Acknowledges iOS Safari lacks Background Sync.
  9. **Zero Mascots / Heavy WebGL:** All visual animations are accessible SVG components respecting `prefers-reduced-motion` and loading in <10ms.
- **Status:** **Approved & Reconciled**.

---

### ADR-14: Framework Selection — Retaining React 19 + Vite 6 Single Page Architecture with Edge PWA

- **Context:** A formal architecture review was conducted evaluating the current architecture against Next.js 15 (App Router), Astro 5, SvelteKit 2, and React Router v7 across 10 critical product dimensions (Public SEO, Multi-tenant Workspaces, RLS Authorization, Database Integration, Interactive SVGs, CodeMirror Editor, In-Browser Wasm Execution, Offline Sync, Modest Mobile Performance, and Migration Burden).
- **Decision:**
  1. **Primary Selection:** Retain **React 19.0.0** with **Vite 6.2.0**.
  2. **Empirical Evidence:** Vite delivers sub-second production builds (890 ms) and a lean ~198 KB gzipped JavaScript payload. Vitest executes all 60 tests in 180 ms.
  3. **Wasm & DOM Compatibility:** CodeMirror 6, `sql.js` (WebAssembly SQLite), Web Workers, and stateful SVG simulation engines require synchronous DOM access and `SharedArrayBuffer` support. Next.js Server Components introduce severe serialization hurdles, hydration errors, and unnecessary server runtime maintenance costs.
  4. **Avoid Catastrophic Rewrite:** Migrating to SvelteKit would require discarding 100,000+ lines of working, tested React code and 12 simulation engines. Migrating to Astro would force artificial client-only islands (`client:only="react"`) around every workspace without delivering SSR benefits for authenticated users.
  5. **No Secondary Frontend Framework:** A secondary framework will NOT be introduced for marketing pages. Public landing page SEO is handled via semantic HTML, OpenGraph meta tags, and structured JSON-LD schemas.
- **Supporting Documentation:** Full evaluation scorecard and benchmarks recorded in [`REPORTS/2026-10-17_FRAMEWORK_SELECTION_AND_ARCHITECTURE_REVIEW.md`](../REPORTS/2026-10-17_FRAMEWORK_SELECTION_AND_ARCHITECTURE_REVIEW.md).
- **Status:** **Approved & Confirmed**.


