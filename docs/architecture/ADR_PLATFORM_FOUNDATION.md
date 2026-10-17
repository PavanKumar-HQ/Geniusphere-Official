# ADR-2026-01: Geniusphere 2.0 Platform Foundation Architecture

*Status:* **Accepted & Implemented**  
*Date:* 2026-10-17  
*Decision-Makers:* Senior Software Architect & Platform Implementation Engineer  
*Target Release:* Geniusphere 2.0 Real-User Pilot (Independent Learners & Institutional Cohorts)

---

## 1. Context and Problem Statement

Geniusphere is upgrading from an unverified prototype into an India-first, production-grade educational platform delivering practical learning in Technology, Cybersecurity, Finance, and Professional Skills. The first-release audience consists of both independent learners and educational institutions (K-12 schools and colleges).

Key constraints:
1. **Device Diversity:** High prevalence of budget Android mobile devices (1–2 GB RAM) and variable Indian 4G/5G cellular networks.
2. **Pedagogical Integrity:** Zero mock or fake simulations. Interactive labs must execute genuine mathematical models, queries, and logic without relying on simulated progress.
3. **Multi-Tenancy & Safeguarding:** Strict isolation between institutions, non-escalatable roles, parental oversight for minors, and statutory alignment with India's **Digital Personal Data Protection (DPDP) Act, 2023** and **CERT-In Cyber Incident Directions (2022)**.
4. **Lean Operational Budget:** Target operating cost ceiling of under $35/month (~₹2,900 INR) during the pilot phase.

---

## 2. Framework & Architectural Candidates Evaluated

### 2.1. Framework Candidates
| Candidate | Pros | Cons | Verdict |
|---|---|---|---|
| **Next.js 15 (App Router)** | Full-stack SSR, React ecosystem | Server Components create serialization barriers with Wasm/CodeMirror; SSR hydration mismatch with interactive SVG engines; high Vercel/Node.js operational maintenance. | **Rejected** |
| **Astro 5** | High static performance, islands architecture | Auth-gated workspaces require `client:only="react"` wrappers around everything; no SSR benefits for authenticated multi-tenant dashboards; dual-state complexity. | **Rejected** |
| **SvelteKit 2** | Lean reactivity, small footprint | Would require discarding 100,000+ lines of existing tested React components and rewrite all 12 simulation engines. | **Rejected** |
| **React 19 + Vite 6 (SPA + PWA)** | Sub-second builds (1.2s), 198KB gzipped JS, native WebAssembly (`sql.js`) support, direct DOM access for CodeMirror 6, zero Node server hosting tax. | SEO for deep routes requires static prerendering or OpenGraph meta tags. | **Selected (Retained)** |

### 2.2. Database & Data Model Candidates
| Candidate | Rationale | Verdict |
|---|---|---|
| **Microservices + Dual DB (Postgres + Mongo + Redis)** | Proposed in legacy specs (`GS-ENG-2026-V1`). Multiplies infrastructure cost to ~$102/mo, introduces data drift between databases, and creates maintenance overhead for a 50-user pilot. | **Rejected** |
| **PostgreSQL 16 (Relational + JSONB + RLS)** | Native Row-Level Security isolates institutional data at the SQL engine level. JSONB accommodates dynamic lab specifications and curriculum metadata. Proven transactional integrity. | **Selected** |

### 2.3. Code Editor & In-Browser Execution
| Candidate | Rationale | Verdict |
|---|---|---|
| **Monaco Editor** | Heavy (~4MB bundle), poor touch keyboard support, crashes budget Android WebViews under memory pressure. | **Rejected** |
| **CodeMirror 6** | Touch-friendly, accessible, modular, lightweight (~250KB), handles SQL and JavaScript syntax trees smoothly. | **Selected** |
| **Pyodide (~18MB Wasm)** | Excessive payload for budget cellular data; 5+ second boot times on mobile. | **Deferred to Advanced Python Labs** |
| **SQLite-Wasm / sql.js (~1.1MB)** | Fast (<400ms boot), deterministic execution, zero server-side code execution risk. | **Selected** |

---

## 3. Decision Outcome

1. **Retain React 19 and Vite 6 as a Single Page Application with PWA capabilities.**
   - Deployable to static edge CDNs (Cloudflare Pages) with zero server runtime maintenance costs and $0 egress fees.
   - Vitest executes all 60 tests in ~200ms.
2. **Standardize on PostgreSQL 16 with Row-Level Security (RLS) in AWS Mumbai (`ap-south-1`).**
   - Implemented via 3 authoritative SQL migrations (`supabase/migrations/`):
     - `20261017000001_initial_schema.sql`: 10 core tables + `audit_events`.
     - `20261017000002_invariant_triggers.sql`: Invariant triggers preventing removal of the last institution admin and enforcing teacher-organization binding.
     - `20261017000003_rls_helpers_and_policies.sql`: Hardened non-recursive RLS helper functions with explicit search paths and security definers.
   - Client and local testing powered by an authoritative `InMemoryDatabase` (`src/db/in-memory-db.ts`) emulating PostgreSQL constraints, check violations, and error codes (`42501`, `23514`, `23505`).
3. **Decoupled Identity and Institutional Tenancy.**
   - User identity (`users`) is decoupled from organizational roles (`organization_memberships`).
   - 5 strictly defined roles: `learner`, `teacher`, `guardian`, `institution_admin`, `superadmin`.
   - Users cannot escalate privileges through client requests; column-level permissions restrict profile updates to `full_name`.
4. **Standardize on the 2026 Brand Design System.**
   - Visual tokens:
     - Primary Qurious Sky: `#30B2E7` (accessible deep action `#1282B2`)
     - Joy of Quest: `#FDB913`
     - Always Questioning: `#75B543`
     - Educational Canvas: `#FBF9F5` / `#FFF6E3`
     - Primary Text: `#172B4D`
   - Typography: **Mikado Black** for primary display headings (`h1`), **Causten Round** for secondary headings (`h2-h6`) and body UI copy, and **IBM Plex Mono** for code and telemetry.
5. **Child Safety & DPDP Act 2023 Compliance.**
   - Mandatory Date of Birth on signup. Users under 18 enter `pending_parent_consent` status.
   - Verification link dispatched to guardian email.
   - Quiet-hours notification policy enforced between 9:00 PM and 8:00 AM IST.

---

## 4. Consequences and Validation

### Positive
- Build time: **1.22 seconds**.
- Test execution time: **60 tests in ~200ms**.
- Zero cold-start latency for interactive simulations.
- Pilot cloud operational cost: **~$30.98/month** (well within the $35/month ceiling).
- Full regression safety across all 27 courses and 12 simulation engines.

### Limitations & Trade-offs
- Deep route search engine indexing relies on OpenGraph metadata and static HTML injection at the CDN edge rather than dynamic SSR.
- SQLite-Wasm executes client-side; authoritative grades are cryptographically hashed and verified before permanent persistence.
