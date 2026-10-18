# 🌌 Geniusphere 2.0 — Production Engineering Rebuild

> **Brand Philosophy:** *Igniting Passion. Inspiring Futures.*  
> **Core Principle:** *Learn it. Apply it. Prove it.*  
> **Mascot Motto:** *Small steps. Big dreams.*  
> **Target Production Domain:** [https://www.geniusphere.tech/](https://www.geniusphere.tech/)  
> **Repository Remote:** [https://github.com/PavanKumar-HQ/Geniusphere-Official.git](https://github.com/PavanKumar-HQ/Geniusphere-Official.git)

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-6E9F18?logo=vitest)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-67%2F67%20Passed-43A85B)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

Geniusphere is a full product educational technology platform engineered for independent learners, educational institutions (schools, PU colleges, universities), educators, and parents. The platform combines interactive simulation engines, code sandboxes, 40 canonical courses across 3 career streams, teacher cohort gradebooks, DPDP Act 2023 minor safeguarding, and cryptographically verifiable HMAC-SHA256 credentials.

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
|  Client-Side Sandboxes    |                     |   Sovereign Storage       |
|  - SQLite-Wasm (sql.js)   |                     |   - Dual-tier IndexedDB   |
|  - CodeMirror 6 Editor    |                     |   - localStorage Bootstrap|
|  - 10 Interactive Engines |                     |   - Zero State Loss       |
|  - Real-time SVG Visuals  |                     |   - Cryptographic Chains  |
+---------------------------+                     +---------------------------+
              |                                                 |
              +------------------------+------------------------+
                                       |
                  +-----------------------------------------+
                  |  DPDP Act 2023 & CERT-In Safeguards     |
                  |  - Age-gating (<18 requires guardian)   |
                  |  - Quiet hours (8:00 PM - 8:00 AM IST)  |
                  |  - 6-hour CERT-In incident trigger      |
                  +-----------------------------------------+
```

### Key Architectural Tenets
1. **Zero Fake Functionality:** Every feature works end-to-end. Labs execute real code/queries in sandboxed Web Workers, progress persists durably, and certificates are cryptographically verified.
2. **Sovereign Dual-Tier Storage (`ISSUE-001`):** `localStorage` (synchronous bootstrap) + `IndexedDB` (`geniusphere_sovereign_db_v2`). Progress, enrollments, and submissions survive browser reboots and offline sessions with zero data loss.
3. **40-Course Canonical Curriculum (Design Board 2):** Exactly 40 courses across 3 core streams:
   - **Technology & Digital Skills (12 Courses)**
   - **Financial Literacy & the Economy (14 Courses)**
   - **Professional & Life Skills (14 Courses)**
4. **Master Botanical Light Design System:**
   - **Fresh Green (`#43A85B`):** Primary brand colour and interactive buttons.
   - **Lime (`#D9F477`):** Highlights, tags, and key badges.
   - **Warm Ivory (`#FAFAF4`):** Main spacious background canvas.
   - **Soft Sage (`#E5F0DF`):** Secondary cards, pill filters, and subtle surfaces.
   - **Charcoal (`#26352A`):** High-contrast typography for optimal readability.
   - Strict rule: Zero blue, zero dark forest-green surfaces, zero neon glows, zero gradients.
5. **Typography:**
   - **Space Grotesk Bold:** Expressive headlines and Geniusphere wordmark.
   - **Inter:** Clean body text, navigation, buttons, and dashboards.
6. **Mascot ("Sphere"):** Vector SVG mascot component with 6 canonical poses: `happy`, `thinking`, `celebrating`, `encouraging`, `guidance`, and `loading`.
7. **Multi-Tenant Row-Level Security:** Institutional cohorts, student submissions, and teacher feedback are strictly isolated by `organization_id`.

---

## 📑 Master Engineering Deliverables & Reports

All mandatory engineering audit reports and architectural specifications are maintained in the repository:

1. [Initial Audit Report](REPORTS/INITIAL_AUDIT.md) — Comprehensive inspection of repository, remotes, dependencies, and risks.
2. [Issue Register](REPORTS/ISSUE_REGISTER.md) — 7 prioritized issues (ISSUE-001 through ISSUE-007) with root causes, fixes, and verification methods.
3. [Architecture Decision Records](REPORTS/ARCHITECTURE_DECISIONS.md) — Formal ADR-001 through ADR-006 documenting technical decisions and trade-offs.
4. [Implementation Plan](REPORTS/IMPLEMENTATION_PLAN.md) — 7-phase roadmap (Phases A through G) from discovery to cloud cutover.
5. [Acceptance Criteria](REPORTS/ACCEPTANCE_CRITERIA.md) — BDD acceptance criteria (AC-001 through AC-009) for all user roles.
6. [Test Verification Report](REPORTS/TEST_RESULTS.md) — 100% passing test results across 8 test suites (67 automated tests).
7. [Security & Privacy Review](REPORTS/SECURITY_REVIEW.md) — Threat matrix, OWASP Top 10 defenses, and DPDP Act 2023 compliance.
8. [Release Readiness Assessment](REPORTS/RELEASE_READINESS.md) — Production readiness sign-off and operational checklist.

---

## 📂 Repository Structure

```
geniuspheregpt/
├── .github/                # CI/CD workflows and automated checks
├── docs/                   # Architectural documentation & technical blueprints
├── public/                 # Static brand assets, favicons, illustrations
├── REPORTS/                # Master audit, decision records, and test reports
│   ├── INITIAL_AUDIT.md
│   ├── ISSUE_REGISTER.md
│   ├── ARCHITECTURE_DECISIONS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ACCEPTANCE_CRITERIA.md
│   ├── TEST_RESULTS.md
│   ├── SECURITY_REVIEW.md
│   └── RELEASE_READINESS.md
├── src/                    # Platform source code
│   ├── components/         # UI components & interactive workspaces
│   │   ├── CourseCatalogue.tsx # 40-course catalogue matching Design Board 2
│   │   ├── CourseDetailView.tsx # Syllabus, lessons, and enrollment details
│   │   ├── LessonPlayer.tsx # Markdown reader, video embeds, and quizzes
│   │   ├── SharedLabWorkspace.tsx # Multi-panel simulation lab runner
│   │   ├── MascotSphere.tsx # Canonical 6-pose vector mascot component
│   │   ├── StudentDashboard.tsx # Learner dashboard matching Design Board 1
│   │   ├── TeacherGradebook.tsx # Student submission grading and analytics
│   │   ├── ClassroomManager.tsx # Cohort management and join codes
│   │   ├── InstitutionAdminWorkspace.tsx # Organization member roster management
│   │   ├── PlatformAdminWorkspace.tsx # Superadmin operations & audit logs
│   │   └── ResourcesHub.tsx # Curated videos, study guides, and whitepapers
│   ├── data/               # Canonical 40-course registry & approved labs
│   │   ├── canonical-curriculum.ts # 40 courses across 3 streams with sandboxes & quizzes
│   │   ├── approved-labs.ts # 10 interactive simulation lab specifications
│   │   └── curriculum.ts   # Baseline detailed course modules
│   ├── db/                 # Sovereign database & persistence engine
│   │   ├── indexed-db.ts   # Dual-tier SovereignIndexedDB implementation
│   │   └── in-memory-db.ts # PostgreSQL 16 emulation with RLS & invariant triggers
│   ├── types/              # TypeScript definitions for entities, roles, and state
│   ├── App.tsx             # Main routing shell, persona switcher, navigation
│   └── index.css           # Master botanical light design tokens & responsive utilities
├── supabase/               # Authoritative database migrations & RLS policies
│   └── migrations/
│       ├── 20261017000001_initial_schema.sql # 10 Core relational tables + audit_events
│       ├── 20261017000002_invariant_triggers.sql # Invariant triggers
│       └── 20261017000003_rls_helpers_and_policies.sql # Hardened RLS policies
└── tests/                  # Automated Vitest test suites (67 tests)
    ├── canonical-curriculum.test.ts # 40 courses, 3 streams, enrollment lifecycle
    ├── curriculum-workflow.test.ts # 27 baseline courses, paths, search & filters
    ├── e2e-workflow.test.ts # End-to-end user navigation & IndexedDB durability
    ├── labs-workflow.test.ts # 10 simulation engines and parameter binding
    ├── migrations.test.ts  # PostgreSQL DDL and constraints verification
    ├── resources-workflow.test.ts # Study guides, videos, and resume builder
    ├── rls-authorization.test.ts # Multi-tenant isolation & privilege hardening
    └── sanity.test.ts      # Engine smoke tests
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/PavanKumar-HQ/Geniusphere-Official.git
cd geniuspheregpt

# 2. Install dependencies
npm install

# 3. Run type check
npx tsc --noEmit

# 4. Run automated test suite (67 tests)
npm test

# 5. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

Production assets will be output to `dist/`, optimized and tree-shaken for CDN deployment.

---

## ⚖️ License & Ownership

Copyright © 2026 Geniusphere. All rights reserved.  
Proprietary educational platform software. Built in compliance with India's DPDP Act 2023.
