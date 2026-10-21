# 🌌 Geniusphere 2.0 — Production Engineering Rebuild

> **Brand Philosophy:** *Igniting Passion. Inspiring Futures.*  
> **Core Principle:** *Learn it. Apply it. Prove it.*  
> **Mascot Motto:** *Small steps. Big dreams.*  
> **Target Production Domain:** [https://www.geniusphere.tech/](https://www.geniusphere.tech/)  
> **Repository Remote:** [https://github.com/PavanKumar-HQ/Geniusphere-Official.git](https://github.com/PavanKumar-HQ/Geniusphere-Official.git)

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python)](https://python.org/)
[![Tests](https://img.shields.io/badge/Tests-444%2F444%20Passed-43A85B)](#)
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

## 📑 Master Engineering Architecture & Polyglot Deliverables

The production engineering blueprints, system maps, and test matrices are maintained under `docs/`:

1. [System Architecture Map](docs/architecture/system-map.md) — Multi-tier boundaries, state ownership matrix, and 15 interactive standalone labs.
2. [Language & Responsibility Matrix](docs/architecture/language-matrix.md) — Polyglot engineering allocation, layer boundaries, and duplication resolution.
3. [Cross-Language Communication Contracts](docs/architecture/cross-language-contracts.md) — Runtime schemas, headers, timeouts, and failure envelopes across TS, Python, SQL, and Fastify.
4. [Data Flow & Integration Pipelines](docs/architecture/data-flow.md) — Authentication, learning persistence, real-time WebSocket sync, and AI request flows.
5. [Architecture Decisions Log](docs/architecture/decisions.md) — Formal records (ADR-101 through ADR-108) on registry resolution, CSS grids, orientation guards, AI resilience, polyglot specialization, and WASM evaluation.
6. [Cross-System Regression Matrix](docs/testing/regression-matrix.md) — 24 edge-case scenarios, expected behaviors, and automated verification suites.
7. [Production Deployment & Operations Guide](docs/operations/deployment.md) — Topology, environment variables, health checks, and safe rollback protocols.
8. [Testing Strategy & Test Registry](docs/testing/TESTING_STRATEGY.md) — 444 automated tests (431 Vitest + 13 Pytest) with zero mock data.

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

## 🤖 Production AI Endpoint Architecture

Geniusphere features a versioned, secure AI endpoint architecture designed for seamless deployment across Vercel Functions and containerized Fastify backends.

### 1. Endpoint Contract
* **Route:** `POST /api/v1/ai/chat` (with backward-compatible alias at `POST /api/ai/chat`)
* **Transport:** HTTPS JSON, max payload size `64 KB`
* **Authentication:** Mandatory HTTP `Authorization: Bearer <jwt_token>`

#### Request Payload
```json
{
  "message": "Explain photosynthesis in simple terms.",
  "conversationId": "conv-sci-89",
  "context": {
    "subject": "Science",
    "gradeLevel": "8"
  },
  "history": [
    { "role": "user", "content": "What is chlorophyll?" },
    { "role": "assistant", "content": "Chlorophyll is the green pigment in plants..." }
  ]
}
```

#### Response Envelope (Unconfigured State — Current Phase)
When no AI provider has been configured (`AI_PROVIDER=none`), the endpoint returns **HTTP 503 Service Unavailable** with zero fabricated answers or mock tokens:
```json
{
  "requestId": "f83a45c2-8491-4e92-ba78-2d2bc27d1101",
  "status": "provider_not_configured",
  "message": "The AI service is not configured yet.",
  "error": {
    "code": "PROVIDER_NOT_CONFIGURED",
    "message": "The AI service is not configured yet."
  }
}
```

#### HTTP Status Codes & Error Dictionary
| HTTP Status | Error Code | Trigger Condition |
|---|---|---|
| **200 OK** | `null` | Successful completion from configured provider |
| **400 Bad Request** | `VALIDATION_ERROR` | Empty message, length > 4000 chars, invalid conversation ID, unknown context fields |
| **401 Unauthorized** | `UNAUTHORIZED` | Missing or invalid Bearer token |
| **403 Forbidden** | `FORBIDDEN` | Suspended account status |
| **413 Payload Too Large** | `PAYLOAD_TOO_LARGE` | Request body exceeds 64 KB |
| **415 Unsupported Media** | `UNSUPPORTED_MEDIA_TYPE` | Non-JSON `Content-Type` header |
| **429 Too Many Requests** | `RATE_LIMIT_EXCEEDED` | Exceeds 20 requests/min (returns `Retry-After` header) |
| **500 Server Error** | `INTERNAL_SERVER_ERROR` | Sanitized server error (stack traces/secrets redacted) |
| **503 Unavailable** | `PROVIDER_NOT_CONFIGURED` | Truthful notification that AI provider is not connected |
| **504 Gateway Timeout** | `GATEWAY_TIMEOUT` | Provider request exceeded configured timeout |

### 2. Provider Abstraction & Later Connection
The endpoint isolates provider logic through the `AIProvider` boundary in `server/ai/provider.ts`. 

To connect a provider in Phase 2:
1. Set server environment variables:
   ```env
   AI_PROVIDER=gemini
   AI_API_KEY=your_production_api_key
   AI_MODEL=gemini-1.5-flash
   AI_REQUEST_TIMEOUT_MS=15000
   ```
2. Zero code changes required in API route or frontend client.

### 3. Rate Limiting & Abuse Prevention
* **Durable PostgreSQL Store:** Sliding window counts are stored in `public.ai_rate_limits` table (`supabase/migrations/20261021000007_ai_rate_limits.sql`), ensuring strict rate enforcement across multiple Vercel Function instances.
* **In-Memory Fallback:** Automated test suites and offline local environments automatically use in-memory sliding window buckets.
* **Privacy & Secret Redaction:** `AILogger` strips JWTs, passwords, API keys, and student email addresses from server logs.

### 4. Deployment Topology
* **Frontend:** Vercel Static Hosting (`dist/`).
* **API on Vercel:** Serverless function entry point at `api/v1/ai/chat.ts` with routing specified in `vercel.json`.
* **API on Container / Local:** Fastify router at `server/index.ts` listening on port `3001`.
* **Database:** Supabase PostgreSQL with automated idempotent migration execution.

---

## ⚖️ License & Ownership

Copyright © 2026 Geniusphere. All rights reserved.  
Proprietary educational platform software. Built in compliance with India's DPDP Act 2023.
