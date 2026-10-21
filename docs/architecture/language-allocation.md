# Geniusphere Language Allocation & Polyglot Architecture

> **Authoritative Specification:** For the complete file inventory, subsystem mapping, and measured benchmarks, see [docs/architecture/language-matrix.md](language-matrix.md) and [docs/architecture/cross-language-contracts.md](cross-language-contracts.md).

---

## Language Specialization Summary

| Language | Layer / Subsystem | Primary Responsibilities | Rationale |
| :--- | :--- | :--- | :--- |
| **TypeScript** | Client (React 19) & Server (Fastify 5) | Component contracts, lab registry, REST routes, WebSocket gateway, auth guards. | Type safety eliminates interface drift and catches refactoring bugs across 15 interactive labs. |
| **JavaScript** | Client Browser Sandbox & Tooling | Dynamic in-browser code runner (`codeSandboxRunner.ts`), build configs, DOM utilities. | Runtime flexibility with zero compile-time abstraction overhead for student script execution. |
| **Python** | AI Evaluation & Educational Analytics | Offline LLM capability benchmarking (`ai_model_evaluator.py`), item psychometrics, mastery curves (`educational_analytics.py`). | Unmatched scientific computing and statistical libraries (`math`, `statistics`, `pytest`). |
| **SQL** | PostgreSQL 16 & Supabase | 11 relational tables, `xp_ledger`, `ai_rate_limits`, foreign keys, invariant triggers, and RLS policies. | Authoritative relational integrity enforcement at the persistence tier. |
| **HTML5 & CSS** | Responsive Layout & Styling | Semantic document hierarchy, Tailwind design tokens, focus indicators, mobile orientation guards. | Declarative styling, GPU-accelerated transitions, and zero JS rendering overhead for static chrome. |
| **Bash & YAML** | Operations & Deployment | Automated logical backups (`backup-db.sh`, `restore-db.sh`), Docker Compose, and Caddy reverse proxy. | Direct, reproducible OS-level orchestration without Node.js wrapper overhead. |
| **Rust / WASM** | Conditional Evaluation | Benchmarked in-browser execution (<1.8ms); conditionally deferred to avoid 2.5–4.2MB bundle overhead. | Adopted only if future workloads identify a measurable CPU bottleneck (see ADR-108). |
