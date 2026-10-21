# Geniusphere Master Directive Compliance & Architecture Governance Index

This index provides direct cross-references, file locations, and executive summaries for all **18 mandatory governance documents** required by Section 19 of the **Geniusphere — Master Engineering, Architecture & Whole-System Operations Directive**.

---

## Master Document Directory (18 Required Specifications)

| # | Required Specification Domain | Primary Document Path | Scope & Core Authority |
| :-: | :--- | :--- | :--- |
| **1** | **System Overview & Architecture Diagrams** | [docs/architecture/system-map.md](architecture/system-map.md) | Multi-tier presentation, API, domain, database, and operational boundaries with Mermaid diagrams. |
| **2** | **Repository and Module Map** | [README.md](../README.md#📂-repository-structure) | Complete directory tree, module boundaries, entry points, and component locations. |
| **3** | **Domain & Service Ownership Matrix** | [docs/architecture/domain-ownership.md](architecture/domain-ownership.md) | Authoritative state ownership, business invariants, failure semantics across 7 domains. |
| **4** | **Programming-Language & Decision Records** | [docs/architecture/language-allocation.md](architecture/language-allocation.md) & [docs/architecture/decisions.md](architecture/decisions.md) | Polyglot technology selection, ADR-101 through ADR-108, and WASM deferral benchmarks. |
| **5** | **Database Schema & Migration Guide** | [docs/database/schema-and-integrity.md](database/schema-and-integrity.md) | 11 relational schemas, foreign keys, cascade rules, `xp_ledger`, transaction blocks, and RLS. |
| **6** | **API & Integration Contracts** | [docs/architecture/cross-language-contracts.md](architecture/cross-language-contracts.md) & [docs/architecture/data-flow.md](architecture/data-flow.md) | Fastify REST endpoints, WebSocket frames, Python schemas, headers, timeouts, and error envelopes. |
| **7** | **Authentication & Authorization Model** | [docs/security/access-control-matrix.md](security/access-control-matrix.md) | CRUD permissions across all 6 system roles (`anonymous` to `superadmin`), account status checks. |
| **8** | **Threat Model & Security Controls** | [docs/security/threat-model.md](security/threat-model.md) | OWASP ASVS-adapted threat analysis, trust boundaries, injection defenses, and rate limiting. |
| **9** | **AI Architecture & Provider Config** | [docs/architecture/data-flow.md](architecture/data-flow.md#4-ai-request--streaming-inference-pipeline) | Dual-engine AI gateway, `OllamaProvider`, health checks (`/api/tags`), and zero-mock policy. |
| **10** | **Lab Lifecycle & Learning Integrity** | [docs/reliability/failure-modes.md](reliability/failure-modes.md) & [src/labs/registry.tsx](../src/labs/registry.tsx) | 15-lab catalog resolution, `LabErrorBoundary` recovery, unmount cleanup, and state isolation. |
| **11** | **Deployment & Environment Setup** | [docs/operations/deployment.md](operations/deployment.md) & [docker-compose.yml](../docker-compose.yml) | Multi-container Docker Compose setup, Caddy reverse proxy, environment variable contracts. |
| **12** | **Configuration & Secret-Management Guide** | [docs/operations/deployment-and-recovery.md](operations/deployment-and-recovery.md#2-environment-configuration--security-tiers) | Separation of public vs secret variables (`DATABASE_URL`, `JWT_SECRET`), no VITE exposure. |
| **13** | **Monitoring, Alerting & Incident Runbooks** | [docs/operations/operational-control-plane.md](operations/operational-control-plane.md) | Liveness (`/health/liveness`), readiness (`/health/readiness`), telemetry API, and incident runbooks. |
| **14** | **Backup, Restore, DR & Rollback** | [docs/operations/deployment-and-recovery.md](operations/deployment-and-recovery.md#4-disaster-recovery--backup-verification-drill) | Tested logical backups (`backup-db.sh`, `restore-db.sh`), PITR, and code rollback procedures. |
| **15** | **Capacity Assumptions & Performance Reports** | [docs/architecture/scale-architecture.md](architecture/scale-architecture.md) | 1k–10k MAU capacity model, resource budgets, and empirical benchmarks from `scale-capacity.test.ts`. |
| **16** | **Known Issues, Technical Debt & Limitations** | [docs/production-readiness.md](production-readiness.md#3-release-blockers--risk-resolution-status) & [docs/testing/verification-matrix.md](testing/verification-matrix.md#3-disclosed-verification-boundaries--remaining-limitations) | Full disclosure of physical browser orientation limits, third-party video streaming bounds. |
| **17** | **Testing Instructions & Release Checklist** | [docs/testing/TESTING_STRATEGY.md](testing/TESTING_STRATEGY.md) & [docs/production-readiness.md](production-readiness.md#4-final-operational-sign-off) | 454 automated test specifications (441 Vitest + 13 Pytest), execution commands, build checks. |
| **18** | **Decision Log & Change History** | [docs/architecture/decision-log.md](architecture/decision-log.md) & Git Commit History | Chronological architectural decisions, evidence, trade-offs, and Git commit trail. |

---

## Summary of Verification Evidence

* **Automated Unit, Integration, & Security Tests:** **454 / 454 Passing** (441 Vitest + 13 Pytest).
* **TypeScript Compilation:** Zero errors (`tsc --noEmit`).
* **Production Build:** Clean bundle in `dist/` in 4.74s.
* **Working Tree:** Clean, synchronized with `origin/main`.
