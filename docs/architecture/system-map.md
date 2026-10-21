# Geniusphere — System Architecture & Component Inventory Map

**Document Version:** 1.0.0  
**Status:** Approved Architecture Definition  
**Target Environment:** Node.js (Fastify 5), TypeScript 5.8, React 19, PostgreSQL 15+ (Supabase)

---

## 1. System Overview & Architectural Tiers

Geniusphere is an enterprise-grade digital education, financial literacy, and technology training platform. The system operates on a clean multi-tier architecture with strictly defined boundaries, unidirectional data flows, and clear state ownership.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (React 19)                    │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │   Application Shell   │  │  Lab Workspace  │  │ Orientation Guard│  │
│  │ (Navbar, Drawer, Mod) │  │ (Stage, Drawer) │  │  (Context Dedupe)│  │
│  └───────────┬───────────┘  └────────┬────────┘  └─────────┬────────┘  │
│              │                       │                     │           │
│              └───────────────────────┼─────────────────────┘           │
│                                      ▼                                 │
│                          Shared Lab Registry (15 Labs)                 │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ HTTP / WebSocket (WSS)
┌──────────────────────────────────────▼─────────────────────────────────┐
│                        SERVICE & API TIER (Fastify 5)                  │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │ Authentication & JWT  │  │ Domain Service  │  │ WebSocket Gateway│  │
│  │  (Bcrypt, Sessions)   │  │ (Courses, Labs) │  │ (Multi-tab Sync) │  │
│  └───────────┬───────────┘  └────────┬────────┘  └─────────┬────────┘  │
│              │                       │                     │           │
│              ▼                       ▼                     ▼           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ AI Service Gateway (Gemini 1.5 & Ollama Local Resilience)        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ SQL / Row-Level Security
┌──────────────────────────────────────▼─────────────────────────────────┐
│                      PERSISTENCE TIER (PostgreSQL 15+)                 │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │   Users & Roles (RLS) │  │ Course Progress │  │ Outbox Event Log │  │
│  └───────────────────────┘  └─────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Ownership & State Management Matrix

| Subsystem | Primary Component | State Owned | Dependencies | Failure Mode / Recovery |
| :--- | :--- | :--- | :--- | :--- |
| **Application Shell** | `src/App.tsx` | Active view, current user ID, theme, modal visibilities | `apiClient`, `InMemoryDatabase`, `RealtimeOrchestrator` | Fallback to `home` view on unhandled route; session expiry triggers re-auth modal |
| **Lab Registry** | `src/labs/registry.tsx` | Lab catalog, slug-to-component mappings, metadata | Standalone Lab components | `UnknownLab` fallback UI with error message and "Return to Catalogue" button |
| **Shared Lab Workspace** | `src/components/SharedLabWorkspace.tsx` | Active step, active module, layout focus mode, terminal logs | `getStandaloneLab`, `learningSessionService` | Recovers previous step from session storage; responsive drawer collapse below 1160px |
| **Orientation Guard** | `src/components/lab/LabOrientationGuard.tsx` | Viewport dimensions, portrait bypass preference | `LabOrientationContext`, `sessionStorage` | Parent guard suppresses nested instances; silent catch on `screen.orientation.lock` failures |
| **Interactive AI Lab** | `src/labs/ai-lab/SimulationEngine.tsx` | Mathematical model params (temperature, weights, attention matrix) | `educationalAiMath.ts` | Pure deterministic calculation; zero network dependency; reduced-motion toggle |
| **Realtime Gateway** | `server/services/websocketGateway.ts` | Active socket connections, user channel memberships | Fastify WebSocket server, JWT verification | Auto-reconnect with exponential backoff on client; message replay via Outbox |
| **AI Gateway** | `server/ai/chatHandler.ts` | Rate limits, prompt validation, token usage accounting | `GeminiProvider`, `OllamaProvider` | HTTP 503 on unconfigured provider; HTTP 504 on host timeout; HTTP 429 on rate limit |
| **Persistence Layer** | `server/db.ts` | Connection pool, schema migrations, RLS context | `pg` Pool, PostgreSQL database | Connection retry on startup; transactional rollback on migration failure |

---

## 3. Subsystem Detailed Specifications

### A. Application Shell (`src/App.tsx`)
- **Responsibilities:**
  - Manages primary application routing (`home`, `catalogue`, `course-detail`, `lab-workspace`, `student-dashboard`, `certificates`, `gradebook`, `institution-workspace`, `platform-workspace`).
  - Controls authentication session state (`currentUser`, token persistence, automatic logout on 401).
  - Hosts the responsive platform header, mobile drawer backdrop, notification center, and mobile bottom sheet.
- **Contract:**
  - Does not manage internal lab simulation states (delegated to lab sub-components).
  - Emits navigation events to child components via typed `handleNavigate(view, params)` callback.

### B. Lab Registry & Universal Wrapper (`src/labs/registry.tsx`)
- **Registered Interactive Labs (15 Specialized Suites):**
  1. `ai-lab` — AI Neural Architecture & Decision Engine.
  2. `blockchain-lab` — TrustLink 19-Module Blockchain & Mining Suite.
  3. `cybersecurity-lab` — CyberSphere Junior Attack & Defense Lab.
  4. `iot-lab` — IoT Telemetry, MQTT Packets & Actuator Simulator.
  5. `privacy-lab` — Data Broker Tracking & Digital Footprint Audit.
  6. `banking-lab` — Banking Account Types & Settlement Rails.
  7. `crypto-lab` — How Digital Money Works & Mempool Simulation.
  8. `fintech-lab` — Payment Gateways & ISO 20022 Messaging.
  9. `economics-lab` — Central Bank Monetary Policy & Inflation Simulation.
  10. `intro-finance-lab` — 50/30/20 Budgeting & Compound Growth Engine.
  11. `office-lab` — Microsoft Office Spreadsheet & Formula Sandbox.
  12. `professional-skills-lab` — Eisenhower Matrix & Workplace Conflict Engine.
  13. `social-profile-lab` — Professional Presence & 2FA Identity Audit.
  14. `stock-market-lab` — Order Book Matching & Volatility Modeling.
  15. `communication-lab` — Executive Tone Analyzer & Stakeholder Feedback.
- **Lookup Guarantee:**
  - Exact match on lab slug, course slug, lab ID, or keyword.
  - Case-insensitive, trimmed lookup. Returns `null` safely without runtime throws.

### C. Shared Learning Workspace (`src/components/SharedLabWorkspace.tsx`)
- **Layout Architecture:**
  - Responsive CSS Grid: `310px minmax(0, 1fr) 270px` on desktop.
  - Below 1380px: `270px minmax(0, 1fr) 240px`.
  - Below 1160px: 2-column mode (`250px minmax(0, 1fr)`), automatically tucking criteria into an expandable side-sheet.
  - Below 900px: Single-column tabbed layout (`Instructions`, `Simulation Canvas`, `Criteria`).
- **Safety Boundaries:**
  - All grid children enforce `min-width: 0` to prevent horizontal blowout from diagrams.
  - Embedded canvas height strictly bounded (`height: 100%; min-height: 0; overflow: hidden;`).

### D. Mobile Orientation Guard (`src/components/lab/LabOrientationGuard.tsx`)
- **Deduplication Engine:**
  - Uses `LabOrientationContext`. If an ancestor guard is mounted, child guards immediately render `children` with zero overhead.
- **Persistence Scope:**
  - Bypass stored in `sessionStorage` (`geniusphere_lab_portrait_bypassed`). Survives module navigation within the same session.
- **Graceful Web APIs:**
  - `requestFullscreen` includes WebKit/Blink/Gecko vendor prefixes.
  - `screen.orientation.lock('landscape')` wrapped in `.catch(() => {})` for iOS Safari and uninstalled web apps.
