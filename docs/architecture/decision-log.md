# Geniusphere Architecture Decision Log

> **Authoritative Specification:** For full context, trade-offs, and consequences of each architectural decision, see [docs/architecture/decisions.md](decisions.md).

---

## Architectural Decision Records (ADRs) Index

- **[ADR-101: Authoritative Centralized Lab Registry & Identifier Resolution](decisions.md#adr-101-authoritative-centralized-lab-registry--identifier-resolution)**
  *Established single source of truth in `src/labs/registry.tsx` with deterministic priority matching.*
- **[ADR-102: Consolidated PostCSS Pipeline & Responsive Layout Grid Tokens](decisions.md#adr-102-consolidated-postcss-pipeline--responsive-layout-grid-tokens)**
  *Consolidated PostCSS pipeline in `postcss.config.js`, removed global !important button override, and enforced `min-w-0` responsive grid sizing.*
- **[ADR-103: Deduplicated Mobile Orientation Policy via React Context & Session Storage](decisions.md#adr-103-deduplicated-mobile-orientation-policy-via-react-context--session-storage)**
  *Introduced `LabOrientationContext` to suppress duplicate nested overlays and persisted portrait bypass in sessionStorage.*
- **[ADR-104: Dual-Engine AI Architecture: Strict Separation of Simulations from Production LLMs](decisions.md#adr-104-dual-engine-ai-architecture-strict-separation-of-simulations-from-production-llms)**
  *Strictly decoupled deterministic educational math simulations from real server-side LLM inference endpoints.*
- **[ADR-105: Local Ollama Resilience, Health Probing, and Zero-Mock Policy](decisions.md#adr-105-local-ollama-resilience-health-probing-and-zero-mock-policy)**
  *Implemented `OllamaProvider` with `/api/tags` health check, timeouts, and honest HTTP 502/504 errors when offline.*
- **[ADR-106: Granular Lab Error Boundaries & Recoverable Runtime Degradation](decisions.md#adr-106-granular-lab-error-boundaries--recoverable-runtime-degradation)**
  *Introduced `LabErrorBoundary` to catch WebGL/Canvas rendering exceptions without collapsing the application.*
- **[ADR-107: Polyglot Specialization Policy & Python AI/Analytics Allocation](decisions.md#adr-107-polyglot-specialization-policy--python-aianalytics-allocation)**
  *Assigned offline AI benchmarking and educational psychometrics to Python 3.14 while preserving Fastify for Node.js I/O.*
- **[ADR-108: WebAssembly and Rust Conditional Deferral Analysis](decisions.md#adr-108-webassembly-and-rust-conditional-deferral-analysis)**
  *Measured in-browser sandbox (<1.8ms per run) and deferred WASM compilation to avoid 2.5–4.2MB binary download overhead.*
