# GENIUSPHERE — TECHNICAL RESEARCH, ARCHITECTURE DISCOVERY & PRODUCT BRAINSTORMING

**Date:** 2026-10-20  
**Authors:** Principal Software Architect, Senior Full-Stack Engineer, Learning Experience Designer  
**Status:** Approved Architectural Blueprint  

---

## 1. Language & Runtime Strategy (Workload Matrix)

Geniusphere intentionally avoids "technology proliferation for its own sake." Every chosen language and runtime satisfies an explicit, defensible operational requirement:

| Workload | Candidate Technologies | Recommended Choice | Rationale & Evidence |
|---|---|---|---|
| **Web Frontend & UI** | React 19, Vue 3, Svelte 5, Vanilla JS | **React 19 + TypeScript + Vite** | React 19 provides concurrent rendering, seamless state transitions, and first-class SVG manipulation. TypeScript provides end-to-end type safety across the 170-lab contracts. |
| **Interactive Simulation SVG Rendering** | Canvas, WebGL, SVG, CSS DOM | **Declarative Inline SVG in React** | SVG elements are inspectable, scalable to arbitrary DPI school displays, accessible to screen readers, and declaratively driven by mathematical state without external canvas engine overhead. |
| **REST & WebSocket API Gateway** | Fastify (Node.js), Express, Go, Rust Actix | **Fastify 5 (Node.js 25) + TypeScript** | Fastify offers industry-leading throughput (up to 75,000 req/sec), native schema validation, built-in `@fastify/websocket`, and shares TypeScript interfaces directly with the client. |
| **Relational Data Persistence** | PostgreSQL, SQLite, MongoDB, Supabase | **PostgreSQL (v16+) via `pg.Pool`** | Relational integrity, foreign key constraints, atomic transactions, row-level locking (`FOR UPDATE SKIP LOCKED`), and JSONB support for simulation manifests. |
| **Student In-Browser Code Execution** | Remote Server Execution, Web Worker Sandbox, Pyodide (Wasm) | **Client Web Worker Sandbox + SQL.js (Wasm)** | Zero server infrastructure cost; zero server security attack surface; works offline on school laptops; enforces strict 2,000ms CPU execution limits. |

### Key Architectural Answers:
1. **Language for Web Interface:** TypeScript + React 19.
2. **Language for API:** TypeScript + Fastify 5 on Node.js 25.
3. **Curriculum Languages Taught:** Python, JavaScript/TypeScript, SQL, C++, Java, Bash, Rust (via interactive sandboxes and conceptual state visualizers).
4. **Browser-Executed Workloads:** All 170 interactive SVG simulations, client code sandboxes, video playback, and local offline progress caching.
5. **Server-Executed Workloads:** Central user authentication, cryptographic JWT verification, organization boundaries, persistent progress synchronization, and transactional outbox processing.

---

## 2. Database & Persistence Strategy

### Evaluation: Supabase vs. PostgreSQL Custom Service
- **Supabase (Managed Platform):**
  - *Strengths:* Rapid initial setup, built-in GoTrue auth, automatic PostgREST endpoints.
  - *Weaknesses:* Tight vendor coupling; RLS policies alone are difficult to test in CI without cloud dependency; connection pooling nuances with WebSockets and background workers.
- **Custom Fastify API + Managed PostgreSQL:**
  - *Strengths:* Full control over business logic, zero vendor lock-in, portable across AWS RDS, Railway, Render, Fly.io, or on-premise school servers; atomic transactions across multiple domain tables (`withTransaction`).
  - *Selected Decision:* **Dedicated Fastify 5 API + PostgreSQL 16+**. This allows seamless local development, isolated CI testing via `vitest` / `pg-mem`, and enterprise deployment to any standard PostgreSQL host.

---

## 3. Curriculum Architecture: 17 Topics, 170 Lessons, 170 Labs

Delivering 170 lessons and 170 interactive labs without writing 340 repetitive, disconnected components requires a **typed simulation lifecycle contract**.

### The Unified Simulation Contract (`SimulationLab`)
Each lab conforms to the strict interface defined in `src/curriculum/types.ts`:
```typescript
export interface SimulationLab {
  id: string;
  topicId: string;
  orderIndex: number; // 1 to 10
  slug: string;
  title: string;
  summary: string;
  learningObjective: string;
  conceptModelled: string;
  initialState: Record<string, any>;
  controls: LabControl[];
  algorithmDescription: string;
  formula: string;
  reflectionQuestion: string;
  completionCriteria: string[];
  modelLimitations: string;
}
```

### Representative Cross-Domain Implementations
1. **Topic 1: AI (Lab 1 - Perceptron & Linear Decision Boundary):**
   - *Inputs:* Weight $w_1$, Weight $w_2$, Bias $b$.
   - *Algorithm:* Linear combination $z = w_1 x_1 + w_2 x_2 + b$. Activation $y = \text{step}(z)$.
   - *Visualization:* 2D coordinate plane with rotating and translating decision boundary line and colored classification regions.
2. **Topic 2: Blockchain (Lab 1 - SHA-256 Block Hashing):**
   - *Inputs:* Block Index, Timestamp, Nonce, Transaction Data.
   - *Algorithm:* Deterministic cryptographic hash $H = \text{SHA256}(\text{Index} + \text{PrevHash} + \text{Nonce} + \text{Data})$.
   - *Visualization:* Block header visualizer turning emerald when hash satisfies difficulty target ($0000...$), or red on tamper.
3. **Topic 7: Finance (Lab 1 - Compound Interest & Inflation Erosion):**
   - *Inputs:* Principal $P$, Annual Interest Rate $r$, Years $t$, Compounding Frequency $n$, Inflation Rate $i$.
   - *Algorithm:* Nominal $A = P (1 + r/n)^{nt}$, Real Value $A_{\text{real}} = A / (1 + i)^t$.
   - *Visualization:* Dual exponential curve comparing nominal balance against inflation-adjusted purchasing power.
4. **Topic 14: Time Management (Lab 1 - Eisenhower Decision Matrix):**
   - *Inputs:* Task Urgency (1–5), Task Importance (1–5), Task Duration (Hours).
   - *Algorithm:* Matrix Quadrant Assignment: Q1 (Do), Q2 (Schedule), Q3 (Delegate), Q4 (Eliminate).
   - *Visualization:* 4-quadrant dynamic grid repositioning task items based on urgency/importance coordinates.
5. **Topic 16: Startup Ideation (Lab 3 - Unit Economics & LTV/CAC):**
   - *Inputs:* ARPU, Gross Margin %, Monthly Churn %, CAC $.
   - *Algorithm:* $\text{LTV} = (\text{ARPU} \times \text{GM}) / \text{Churn}$. Sustainability Ratio $= \text{LTV} / \text{CAC}$.
   - *Visualization:* Bar chart comparing acquisition spend against cumulative customer cash contribution and payback month marker.

---

## 4. Product Brainstorming: Eliminating the "Mockup Illusion"

### The Problem
Educational platforms frequently fall into the trap of presenting superficial mockups: hardcoded student names, pre-filled fake streaks (e.g. "Good morning, Aarav! 12 lessons completed"), disabled buttons, and decorative SVG animations that do not respond to student input.

### The Geniusphere Solution
1. **Zero-Fabrication Learner Workspace:**
   - A fresh learner starts with clean, honest numbers: 0 enrolled courses, 0 completed lessons, 0 XP, and a clear invitation to begin their journey.
   - Learner identity is authentic: customizable via user profile or derived from authenticated account.
2. **Verified Completion Tracking:**
   - Watching a video triggers real, persistent state progression.
   - Interacting with a simulation and meeting its completion criteria unlocks real verifiable XP.
3. **Resilient Local-First Synchronization:**
   - Even if the central backend database is temporarily offline or school Wi-Fi is spotty, state saves immediately to client `localStorage` and `IndexedDB`.
   - Upon reconnecting, the client syncs state via `POST /api/domain/lesson-completion` and `POST /api/domain/lab-attempt`.
4. **Interactive Simulation Lab Runner (`CurriculumLabRunner.tsx`):**
   - A universal, highly polished interactive lab studio supporting all 170 labs.
   - Features dynamic sliders, toggles, formula displays, mathematical calculation results, reactive SVG rendering, reset/replay controls, reflection prompts, and an interactive "Mark Lab Completed" action that updates real user progress.
