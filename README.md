# 🌌 Geniusphere 2.0 — Platform Foundation

> **Production-Grade, India-First Practical Skills Platform for Technology, Finance, and Professional Skills**

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-6E9F18?logo=vitest)](https://vitest.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

Geniusphere 2.0 is an evidence-backed educational platform engineered for independent learners, schools, and colleges across India. The platform combines interactive simulation engines, hands-on code and query sandboxes, teacher cohort controls, safeguarding-first parent oversight, and verifiable learning records.

---

## 🏛️ Platform Architecture

```
                  +-----------------------------------------+
                  |  Cloudflare Edge / Static CDN Hosting   |
                  |  (React 19 + Vite 6 + PWA ServiceWorker)|
                  +-----------------------------------------+
                                       |
              +------------------------+------------------------+
              |                                                 |
+---------------------------+                     +---------------------------+
|  Client-Side Sandboxes    |                     |   Transactional Backend   |
|  - SQLite-Wasm (sql.js)   |                     |   - PostgreSQL 16 (Mumbai)|
|  - CodeMirror 6 Editor    |                     |   - Row-Level Security    |
|  - 12 Interactive Engines |                     |   - Invariant Triggers    |
|  - Real-time SVG Dynamics |                     |   - Append-Only Audit Logs|
+---------------------------+                     +---------------------------+
              |                                                 |
              +------------------------+------------------------+
                                       |
                  +-----------------------------------------+
                  |  DPDP Act 2023 & CERT-In Safeguards     |
                  |  - Age-gating (<18 requires guardian)   |
                  |  - Quiet hours (9:00 PM - 8:00 AM IST)  |
                  |  - 6-hour CERT-In incident trigger      |
                  +-----------------------------------------+
```

### Key Architectural Tenets
1. **Zero Fake Simulations:** All 12 simulation engines execute real mathematical models, cryptographic hashes, network protocol state machines, and parameter bindings.
2. **Multi-Tenant Row-Level Security:** Institutional data is strictly isolated between tenants at the database engine level via PostgreSQL RLS policies.
3. **Bandwidth-Conscious for India:** CodeMirror 6 (~250KB) and SQLite-Wasm (~1.1MB) ensure smooth execution on budget Android mobile devices (1–2GB RAM) over cellular 4G connections.
4. **Decoupled Identity & Non-Escalatable Roles:** User profiles (`users`) are strictly separated from institutional roles (`organization_memberships`). Users cannot self-escalate privileges via client requests.
5. **Brand Design System (2026):** Built with official brand typography (**Mikado Black** display headers, **Causten Round** headings and UI copy, **IBM Plex Mono** telemetry) and palette (**#FBF9F5** warm canvas, **#30B2E7** Qurious Sky, **#FDB913** Joy of Quest, **#75B543** Always Questioning, **#172B4D** Midnight Navy).

---

## 📂 Repository Structure

```
geniuspheregpt/
├── .github/                # CI/CD workflows and automated checks
├── docs/                   # Architectural documentation & registers
│   ├── architecture/       # Architecture Decision Records (ADRs)
│   ├── DECISIONS.md        # Architectural decisions register
│   ├── MASTER_COVERAGE_REGISTER.md # Comprehensive test & requirement traceability
│   ├── PRODUCT_SPEC.md     # Product specification & user personas
│   ├── RISK_REGISTER.md    # Active technical and operational risks
│   ├── ROADMAP.md          # Phased delivery roadmap
│   ├── SECURITY_PRIVACY.md # DPDP Act 2023 & CERT-In compliance specifications
│   └── TECHNICAL_BLUEPRINT.md # System architecture & database entity relationships
├── public/                 # Static assets, fonts, icons, manifest
│   └── fonts/              # Mikado and Causten Round typography files
├── REPORTS/                # Dated audit reports and verification reviews
├── src/                    # Platform source code
│   ├── components/         # UI components & interactive workspaces
│   │   ├── ui/             # Reusable design system primitives (Button, Card, Modal, etc.)
│   │   ├── CourseCatalogue.tsx # 27-subject course catalogue
│   │   ├── CourseDetailView.tsx # Syllabus, lessons, and enrollment details
│   │   ├── LessonPlayer.tsx # Markdown reader, video embeds, and quizzes
│   │   ├── LessonCodingSandbox.tsx # CodeMirror 6 interactive coding sandbox
│   │   ├── SharedLabWorkspace.tsx # Consolidated 3-panel simulation lab runner
│   │   ├── LabSvgVisualizers.tsx # 8 state-driven SVG simulation visualizers
│   │   ├── HeroAnimationSandbox.tsx # Live interactive 5-mode hero demonstration
│   │   ├── ClassroomManager.tsx # Teacher cohort controls and 8-char join codes
│   │   ├── TeacherGradebook.tsx # Student submission grading and analytics
│   │   ├── StudentDashboard.tsx # Enrolled courses, lab progress, and certificates
│   │   ├── ParentPortal.tsx # DPDP guardian oversight and consent management
│   │   ├── InstitutionAdminWorkspace.tsx # Organization member roster management
│   │   ├── PlatformAdminWorkspace.tsx # Superadmin operations and audit log viewer
│   │   ├── ResourcesHub.tsx # Curated videos, study guides, and whitepapers
│   │   ├── ResumeBuilder.tsx # Student portfolio and resume generator
│   │   └── SchoolKit.tsx   # Educator lesson plans and workshop slide kits
│   ├── data/               # Canonical curriculum (27 courses) & approved labs (12)
│   │   ├── approved-labs.ts # Specification for 12 interactive simulation engines
│   │   └── curriculum.ts   # 27 comprehensive courses across 4 domains
│   ├── db/                 # Authoritative in-memory database & RLS engine
│   │   └── in-memory-db.ts # PostgreSQL 16 emulation with foreign keys & check constraints
│   ├── types/              # TypeScript definitions for entities, roles, and state
│   ├── App.tsx             # Main routing, persona switcher, and application shell
│   ├── index.css           # 2026 Brand design tokens and responsive utilities
│   └── main.tsx            # Vite React 19 application entry point
├── supabase/               # Authoritative database migrations & RLS policies
│   └── migrations/
│       ├── 20261017000001_initial_schema.sql # 10 Core relational tables + audit_events
│       ├── 20261017000002_invariant_triggers.sql # Invariant triggers (last-admin, teacher-org)
│       └── 20261017000003_rls_helpers_and_policies.sql # Hardened RLS policies
├── tests/                  # Automated Vitest test suites (60 tests)
│   ├── curriculum-workflow.test.ts # Course, module, and certificate workflows (9 tests)
│   ├── e2e-workflow.test.ts # End-to-end user navigation flows (4 tests)
│   ├── labs-workflow.test.ts # 12 simulation engines and parameter binding (16 tests)
│   ├── migrations.test.ts  # PostgreSQL DDL and constraints verification via pg-mem (2 tests)
│   ├── resources-workflow.test.ts # Study guides, videos, and resume builder (7 tests)
│   ├── rls-authorization.test.ts # Multi-tenant isolation & privilege hardening (21 tests)
│   └── sanity.test.ts      # Core environment sanity check (1 test)
├── package.json            # Node.js dependencies and lifecycle scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and test configuration
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**: v9.x or v10.x+

### 2. Installation
```bash
git clone https://github.com/PavanKumar-HQ/Geniusphere.git
cd Geniusphere
npm install
```

### 3. Verification Commands
Run the complete automated quality verification suite:

```bash
# 1. TypeScript Static Type Check (0 errors expected)
npx tsc --noEmit

# 2. Automated Test Suite (60 passing tests across 7 suites)
npm test

# 3. Production Bundle Build (built in ~1.2s)
npm run build
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Simulation Engines & Approved Labs

Geniusphere provides **12 canonical, fully functional simulation engines** (`SharedLabWorkspace.tsx` and `LabSvgVisualizers.tsx`):

| Code | Domain | Lab Engine Name | Real Mathematical / Execution Model |
|---|---|---|---|
| **T1** | Technology | AI Classification Playground | Real Euclidean distance classifier over 2D feature coordinates with dynamic boundary calculation. |
| **T2** | Technology | Blockchain Ledger Explorer | Cryptographic SHA-256 block hashing with proof-of-work nonce mining and immutable chain verification. |
| **T3** | Technology | IoT Sensor Telemetry & Cooling Fan | Dynamic thermal model with real-time PID cooling fan response, threshold alerts, and SVG dial animation. |
| **T4** | Technology | Network Defense Pipeline | State-machine inspection pipeline evaluating IP CIDR blocks, port authorization, and attack payload signatures. |
| **T5** | Technology | Privacy Sandbox & Tracking Radar | Third-party cookie, canvas fingerprinting, and tracker blocking simulator with privacy scoring. |
| **T6** | Technology | Cloud Resiliency & Multi-AZ Failover | Active-passive regional failover simulator with heartbeat health checks, circuit breakers, and RTO/RPO calculation. |
| **F1** | Finance | Compound Interest Wealth Engine | Exact compound interest formula $A = P(1 + r/n)^{nt}$ with real-time SVG growth curves and monthly breakdown. |
| **F2** | Finance | Market Order & Volatility Terminal | Real-time bid-ask order book matching engine with slippage calculation and volatility envelope simulation. |
| **F3** | Finance | Payment Settlement & UPI Lifecycle | Multi-stage banking settlement simulator tracking UPI PSP, NPCI switch, issuing bank debit, and beneficiary credit. |
| **C1** | Coding | Defensive SQL Injection Sandbox | Genuine AST parser rejecting tautologies (`' OR '1'='1`) and verifying positional parameter binding (`?`). |
| **C2** | Coding | Logic Gate Circuit Workbench | Interactive Boolean logic evaluator supporting AND, OR, NOT, NAND, NOR, and XOR gates with truth tables. |
| **C3** | Coding | Algorithmic Sorting Comparator | Step-by-step visual comparator for Bubble Sort, Selection Sort, and Insertion Sort with swap and comparison counts. |

---

## 🔐 Multi-Tenant Authorization & Security

The platform enforces multi-tenancy and data isolation through 5 distinct actor roles:

1. **Learner (`learner`):** Access to enrolled courses, interactive labs, progress tracking, and verifiable certificates. Minors are restricted until guardian consent is verified.
2. **Teacher (`teacher`):** Classroom creation, 8-character join code generation, student roster oversight, assignment distribution, and submission grading.
3. **Institution Admin (`institution_admin`):** Institutional cohort oversight, teacher assignments, roster imports, and audit log inspection. Invariant triggers prevent deleting the last active admin.
4. **Guardian / Parent (`guardian`):** Minor consent verification, quiet-hours policy management, and academic progress oversight.
5. **Platform Superadmin (`superadmin`):** Global course publishing, institutional onboarding, system health monitoring, and security event analysis.

### Column-Level Security & Privilege Hardening
- Users cannot modify `is_superadmin`, `account_status`, `is_minor`, or `date_of_birth` via client requests.
- All RLS functions run with `SET search_path = public` and check `auth.uid() IS NOT NULL`.
- Audit logs (`audit_events`) are strictly **append-only** (`REVOKE UPDATE, DELETE`).

---

## 🛡️ Statutory Compliance (India)

### Digital Personal Data Protection (DPDP) Act, 2023
- **Child Safeguarding (Section 9):** Every user specifies a Date of Birth during signup. If `age < 18`, account status is set to `pending_parent_consent`. Minors cannot join classrooms or submit public work without verified consent.
- **Parental Consent Tokens:** Single-use 256-bit cryptographic tokens dispatched to guardian emails, expiring in 72 hours.
- **Quiet Hours Policy:** Notifications are strictly silenced between **9:00 PM and 8:00 AM IST** to protect students' well-being.
- **Data Minimization:** No collection of Aadhaar, biometric data, financial payment cards, or location coordinates.

### CERT-In Cybersecurity Directives (2022)
- Mandatory **6-hour reporting clock** triggered upon noticing reportable cybersecurity incidents.
- Structured 180-day domestic audit logging retained directly in the Mumbai AWS (`ap-south-1`) database.

---

## 🎨 Brand Design System (2026)

| Token Name | Value | Purpose |
|---|---|---|
| `--brand-primary` | `#30B2E7` | **Qurious Sky** — Primary brand color, key interaction highlights |
| `--brand-primary-hover` | `#1282B2` | Accessible Deep Sky for hover states and high-contrast text |
| `--brand-secondary` | `#FDB913` | **Joy of Quest** — Warm quest gold, streak counters, badges |
| `--brand-accent` | `#75B543` | **Always Questioning** — Active green verification and success states |
| `--bg-canvas` | `#FBF9F5` | Educational warm canvas background |
| `--text-primary` | `#172B4D` | Midnight Navy / Mikado Charcoal for primary readability |
| `--font-heading` | `'Mikado', system-ui, sans-serif` | Display headers (`h1`) |
| `--font-sans` | `'Causten Round', system-ui, sans-serif` | Secondary headings (`h2-h6`) and body UI copy |
| `--font-mono` | `'IBM Plex Mono', monospace` | Code snippets, queries, and telemetry |

---

## ⚙️ Environment Configuration

| Variable | Description | Secret? |
|---|---|---|
| `VITE_APP_ENV` | Application environment (`development`, `staging`, `production`) | No |
| `VITE_SUPABASE_URL` | Supabase project API gateway endpoint | No |
| `VITE_SUPABASE_ANON_KEY` | Public anonymous client key (RLS-restricted) | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side administrative key (serverless edge functions only) | **YES (Never expose to client)** |
| `DATABASE_URL` | Direct PostgreSQL connection string for migrations | **YES (Never commit to git)** |

---

## 📄 Documentation Index

- [READY.md](file:///Users/pavankumars/Downloads/geniuspheregpt/READY.md) — Live readiness status, capabilities, and blockers
- [docs/architecture/ADR_PLATFORM_FOUNDATION.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/architecture/ADR_PLATFORM_FOUNDATION.md) — Architectural decision record for the platform foundation
- [docs/MASTER_COVERAGE_REGISTER.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/MASTER_COVERAGE_REGISTER.md) — Comprehensive requirement-to-test traceability matrix
- [docs/SECURITY_PRIVACY.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/SECURITY_PRIVACY.md) — DPDP Act 2023 & CERT-In security architecture
- [docs/TECHNICAL_BLUEPRINT.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/TECHNICAL_BLUEPRINT.md) — Relational schema & entity relationship diagrams
- [docs/ROADMAP.md](file:///Users/pavankumars/Downloads/geniuspheregpt/docs/ROADMAP.md) — Pilot release milestones and future modules
- [REPORTS/](file:///Users/pavankumars/Downloads/geniuspheregpt/REPORTS) — Complete dated technical audits and verification reports
