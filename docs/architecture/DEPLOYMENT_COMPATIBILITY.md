# Geniusphere — Deployment Compatibility & Target Environment Matrix

## 1. Executive Summary & Target Topology
The deployment target requires running Geniusphere with:
- **Frontend**: React 19 + Vite deployed to **Vercel Web Analytics / Edge CDN**.
- **Database**: **Supabase Managed PostgreSQL 16** with existing schema and RLS policies.
- **API Workloads**:
  - Stateless request/response endpoints compatible with **Vercel Node.js Serverless Functions** (`api/**/*.ts`).
  - Persistent stateful workloads (WebSockets, Background Outbox Workers, Local Python Evaluation, Ollama AI) running in a **Dedicated Node/Docker Container** (e.g. Supabase Edge Functions, Fly.io, Railway, AWS ECS, or DigitalOcean Droplet).

---

## 2. Component-by-Component Compatibility Breakdown

| Component | Target: Vercel Serverless | Target: Supabase / Container | Compatibility Verdict & Recommendations |
|---|---|---|---|
| **React 19 Frontend (SPA)** | Compatible | Compatible | **Fully Compatible with Vercel**: `npm run build` compiles `dist/` bundle (Vite + React 19). Configured in `vercel.json` with route rewrite to `/index.html`. |
| **Fastify 5 Server Core** | Incompatible directly | Fully Compatible | Fastify manages a long-running process with stateful in-memory registry, WebSocket gateway, and outbox worker. **Recommendation**: Run `server/index.ts` in container/VPS or wrap individual handlers as Vercel functions where stateless. |
| **WebSocket Gateway (`/ws`)** | Incompatible (Vercel kills sockets after maxDuration) | Fully Compatible | **Requires Container / VPS or Supabase Realtime**: Vercel Serverless Functions cannot hold persistent bi-directional TCP sockets. Frontend gracefully falls back to local IndexedDB polling if WebSocket is offline. |
| **Transactional Outbox Worker** | Incompatible (No persistent interval loops) | Fully Compatible | `setInterval(..., 2000)` requires continuous background runtime. **Recommendation**: Run as a containerized worker or trigger via scheduled cron jobs (`vercel.json` crons or Supabase pg_cron). |
| **PostgreSQL Connection Pool** | Caution (Serverless connection exhaustion) | Fully Compatible | Vercel Serverless functions can exhaust PostgreSQL connections if `pg.Pool` is instantiated per invocation. **Recommendation**: In serverless mode, point `DATABASE_URL` to Supabase Transaction Pooler (Port 6543 via PgBouncer/Supavisor) with `max: 1` connection. In container mode, standard connection pool (port 5432, max 20) is optimal. |
| **AI Service (`api/v1/ai/chat.ts`)** | Fully Compatible | Fully Compatible | **Already adapted**: [api/v1/ai/chat.ts](file:///Users/pavankumars/Downloads/geniuspheregpt/api/v1/ai/chat.ts) is already an official Vercel Serverless Function that delegates to framework-agnostic `handleAIChat()`. Hosted Gemini works seamlessly; local Ollama requires container network access. |
| **Python Evaluation Suite (`tools/polyglot`)** | Incompatible on standard Node.js runtime | Fully Compatible | Python psychometrics (`educational_analytics.py`) and model evaluator (`ai_model_evaluator.py`) require `python3` runtime with pytest. **Recommendation**: Run in CI/CD pipeline and containerized backend services, or compile core algorithms to TypeScript for serverless edge. |
| **Interactive Labs & SVG Visualizers** | Fully Compatible | Fully Compatible | 100% frontend client-side React components and SVG math algorithms. Zero server-side rendering blockers. |

---

## 3. Minimal Safe Architectural Adaptation Plan

To achieve seamless deployment across Vercel and Supabase:

1. **Option A: Hybrid Dual-Target Architecture (Recommended)**:
   - **Frontend**: Deploy Vite SPA to Vercel. In `vercel.json`, route `/api/v1/ai/chat` to Vercel Serverless Function, and proxy or point `VITE_API_BASE_URL` to the Fastify container on Fly.io / Railway / VPS.
   - **Backend Container**: Deploy `Dockerfile` containing Node 22 + Python 3.14 to run Fastify 5 (`server/index.ts`), outbox worker, WebSocket gateway, and PostgreSQL connections.
   - **Database**: Supabase PostgreSQL with `supabase/migrations/` applied.

2. **Option B: Pure Vercel + Supabase Managed Services**:
   - Replace `/ws` Fastify WebSocket with **Supabase Realtime Broadcast Channels** (using `@supabase/supabase-js`).
   - Move `outboxWorker.ts` into a Supabase Edge Function or trigger via `pg_cron`.
   - Convert all Fastify route handlers into Vercel Serverless endpoints under `api/`.
