# Architecture Decision Record (ADR-001)
## Backend Platform Architecture Selection: Fastify + Authoritative PostgreSQL vs. Managed Supabase

**Status:** APPROVED  
**Date:** 2026-10-20  
**Deciders:** Principal Software Architect, Application Security Lead, Engineering Lead  
**Technical Area:** Backend Architecture, Persistent Data Ownership, Authentication, Multi-Tenant Security  

---

## 1. Context & Problem Statement

Geniusphere was initially developed as a browser-centric application (React 19 + TypeScript + Vite 6) utilizing an in-memory database (`InMemoryDatabase`), IndexedDB, and localStorage. While functional for single-tab demonstrations, it lacks centralized persistence, server-verifiable authentication, multi-tenant student/school isolation, and durable operational data across devices.

We must select one coherent backend platform architecture to serve as the authoritative foundation for all shared operational data (user accounts, course publication, student enrollments, lesson completions, mathematical streaks, submissions, teacher grading, and audit events).

---

## 2. Options Evaluated

### Option A: Managed Backend (Supabase Platform)
- **Components:** Hosted PostgreSQL, Supabase Auth (GoTrue), PostgREST automated API, Supabase Realtime (Phoenix Channels), Supabase Storage.
- **Business Logic Delivery:** PostgreSQL Stored Procedures (`SECURITY DEFINER` plpgsql functions) and/or Deno Edge Functions.

### Option B: Custom Backend (Fastify + TypeScript + PostgreSQL) [SELECTED]
- **Components:** Fastify 5 HTTP/WebSocket application server, standard PostgreSQL 16+ via `pg.Pool`, cryptographic JWT session validation (`jsonwebtoken`, `bcryptjs`), version-controlled SQL migrations, and explicit service-layer domain operations.

---

## 3. Comprehensive Evaluation Against the 10 Constitutional Criteria

| # | Architectural Question | Option A: Supabase Managed Backend | Option B: Custom Fastify + PostgreSQL [Selected] |
|---|------------------------|------------------------------------|--------------------------------------------------|
| **1** | **Who operates database & responds to incidents?** | Supabase managed infrastructure team. Incident response governed by SLA of chosen tier (Pro/Enterprise). | Engineering team operates or delegates to managed DBaaS (AWS RDS, GCP Cloud SQL, Railway, Neon). Fastify server operated directly. |
| **2** | **Who manages backups, recovery, upgrades, monitoring?** | Supabase automated daily backups and point-in-time recovery (PITR on paid tiers). | Database provider manages storage backups; team manages application-level monitoring, structured logging, and migration execution. |
| **3** | **What does current team know how to deploy/maintain?** | Team has deep TypeScript / React / Node experience. GoTrue internals and Supabase CLI orchestration are less familiar. | 100% standard TypeScript and Node.js. High velocity, zero proprietary SDK learning curve, standard debugging tools. |
| **4** | **What custom server workflows are genuinely required?** | Mathematical streak algorithms, code sandbox grading, DPDP minor consent link tokens, transactional outbox batching. | Implemented cleanly in idiomatic TypeScript domain services with atomic database transactions (`withTransaction`). |
| **5** | **Provider limits and realistic costs at expected usage?** | Free tier pauses after 1 week of inactivity (unacceptable for school pilot). Pro tier starts at $25/mo + compute add-ons + egress costs. | Server runs on standard low-cost container (e.g. $5-$10/mo on Railway/Fly/Render/VPS) + managed Postgres ($5-$15/mo). Predictable pricing. |
| **6** | **Authentication & RLS responsibilities owned?** | Client interacts directly with Supabase PostgREST. Team must write complex plpgsql RLS policies to prevent student data leaks. | Server owns authentication boundary. Token verified at HTTP middleware. Server enforces RBAC + parameterized SQL queries. |
| **7** | **Vendor lock-in & practical migration options?** | Moderate-to-high lock-in: dependencies on GoTrue auth schema, Supabase JS SDK, Realtime broadcast protocol, and plpgsql functions. | Near-zero lock-in: standard PostgreSQL SQL scripts, standard Fastify HTTP endpoints, standard JWTs. Portable to any cloud or on-prem. |
| **8** | **Environment separation (Local, CI, Staging, Prod)?** | Requires running local Supabase Docker stack (12 containers) in dev/CI. High resource overhead on dev laptops. | Extremely lightweight: runs against local PostgreSQL directly or disposable CI Postgres container in seconds. |
| **9** | **Management of secrets, access policies, migrations?** | Secrets managed via Supabase Dashboard / CLI; migrations deployed via Supabase migration CLI. | Secrets managed via standard environment variables (`.env`, Vault, or Cloud Secrets). Standard SQL migration runner. |
| **10**| **Smallest architecture meeting needs without blocking future?** | Heavy initial overhead for an existing Vite frontend that needs simple, reliable REST and WebSockets. | **Minimal, modular, and robust.** Clean separation: Frontend (Vite) <-> API (Fastify) <-> Database (PostgreSQL). |

---

## 4. Decision & Rationale

**Selected Architecture: Option B (Custom Fastify Backend + PostgreSQL)**

### Key Rationale:
1. **Single Language & Execution Model:** Keeps the entire product in TypeScript across both frontend and backend. Prevents splitting domain logic between TypeScript Edge functions and plpgsql stored procedures.
2. **Deterministic Transactional Control:** Geniusphere requires atomic operations (e.g. lesson completion + streak interval calculation + transactional outbox insertion in one database transaction). Fastify's service layer executes `withTransaction()` cleanly with row-level locks (`FOR UPDATE`).
3. **No Vendor Lock-In & Portability:** Can be deployed to any cloud provider, container orchestrator (Docker/Kubernetes), or dedicated educational server for institutional school networks without internet access.
4. **Lightweight Local & CI Workflow:** Does not require running 12 Docker containers just to run integration tests. Vitest executes integration tests against PostgreSQL in under 1 second.

---

## 5. Security & Authorization Model

1. **Authentication:**
   - Cryptographically signed JSON Web Tokens (`HS256`, minimum 32-character secret in production).
   - Tokens contain verified claims: `userId`, `email`, `role` (`learner`, `teacher`, `institution_admin`, `superadmin`), and `orgId`.
   - Passwords hashed using `bcrypt` (10 rounds).
2. **Authorization Boundary:**
   - **Server-Side Enforcement (Primary):** Fastify preHandler `authenticateRequest` validates signatures, expiry, and tenant claims. Domain services verify resource ownership before querying or updating records.
   - **Database-Side Enforcement (Secondary / Defense-in-Depth):** Session variable `SET LOCAL request.jwt.claim.sub` is populated, allowing PostgreSQL Row Level Security (RLS) policies to block unauthorized reads/writes even in the event of an application bug.
3. **Multi-Tenant Scoping:**
   - Students can only view and update their own enrollments, completions, and submissions.
   - Teachers can only view and grade students enrolled in classrooms assigned to them.
   - Cross-school access is strictly denied by default.

---

## 6. Environment Separation Strategy

- **Development (`NODE_ENV=development`):**
  - Database: `postgresql://localhost:5432/geniusphere_dev`
  - Server: `http://localhost:3001`
  - Frontend: `http://localhost:5173`
- **Testing & CI (`NODE_ENV=test`):**
  - Isolated test database with automated setup/cleanup before test runs.
- **Production (`NODE_ENV=production`):**
  - Dedicated managed PostgreSQL cluster (AWS RDS / GCP Cloud SQL / Neon / Supabase DB connection).
  - Explicit non-default `DATABASE_URL` and `JWT_SECRET` mandatory. Fail-fast validation prevents boot if missing.

---

## 7. Conditions for Revisiting

This decision will be formally revisited if:
1. Operational burden of hosting Fastify exceeds team capacity, and a managed backend offers superior TCO.
2. Direct client-to-database real-time replication becomes a mandatory requirement that Fastify WebSockets cannot support.
3. Institutional clients mandate enterprise SSO (SAML/Okta) where a managed identity provider is explicitly contracted.
