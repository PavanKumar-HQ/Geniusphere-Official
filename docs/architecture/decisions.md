# Geniusphere Architecture Decision Records (ADRs)

This document records the foundational architectural decisions, rationale, trade-offs, and alternatives considered for the Geniusphere platform.

---

## Index of Architectural Decisions

- [ADR-101: Authoritative Centralized Lab Registry & Identifier Resolution](#adr-101-authoritative-centralized-lab-registry--identifier-resolution)
- [ADR-102: Consolidated PostCSS Pipeline & Responsive Layout Grid Tokens](#adr-102-consolidated-postcss-pipeline--responsive-layout-grid-tokens)
- [ADR-103: Deduplicated Mobile Orientation Policy via React Context & Session Storage](#adr-103-deduplicated-mobile-orientation-policy-via-react-context--session-storage)
- [ADR-104: Dual-Engine AI Architecture: Strict Separation of Simulations from Production LLMs](#adr-104-dual-engine-ai-architecture-strict-separation-of-simulations-from-production-llms)
- [ADR-105: Local Ollama Resilience, Health Probing, and Zero-Mock Policy](#adr-105-local-ollama-resilience-health-probing-and-zero-mock-policy)
- [ADR-106: Granular Lab Error Boundaries & Recoverable Runtime Degradation](#adr-106-granular-lab-error-boundaries--recoverable-runtime-degradation)

---

## ADR-101: Authoritative Centralized Lab Registry & Identifier Resolution

### Status
Accepted & Implemented

### Context
Previously, labs were referenced across different views using varying identifiers (e.g., topic IDs, course slugs, standalone lab IDs, or legacy module titles). Several components duplicated slug matching logic, which led to missing registrations, incorrect lab lookups, and fragile keyword fallbacks.

### Decision
Establish `src/labs/registry.tsx` as the single authoritative source of truth for all 15 interactive standalone labs.
Implement a tiered, deterministic resolution strategy in `getStandaloneLab(identifier: string)`:
1. Null/empty string guard (including trimmed whitespace).
2. Direct exact match on lab `id`.
3. Exact match against `courseSlugs`.
4. Exact match against `labSlugs`.
5. Exact keyword match.
6. Substring containment match on course or lab slugs.
7. Longest matching keyword substring match (prioritizing specific multi-word phrases such as `'financial institutions'` over short words).

### Consequences
- **Positive:** Centralized metadata eliminates duplicated switch-case logic in `LabCatalogue`, `SharedLabWorkspace`, `LessonPlayer`, and `EmbeddedLabRenderer`.
- **Positive:** Guaranteed recovery UI when an identifier does not match (`UnknownLab` or fallback renderer).
- **Negative:** New standalone labs must be explicitly registered in `STANDALONE_LABS`.

---

## ADR-102: Consolidated PostCSS Pipeline & Responsive Layout Grid Tokens

### Status
Accepted & Implemented

### Context
Build tools previously had competing PostCSS configurations (inline in `vite.config.ts` vs `postcss.config.js`), resulting in build warnings. Furthermore, an overly aggressive global CSS reset rule (`button { background: transparent !important; }`) stripped intentional background styles from sidebars, toggles, and modals. In addition, nested grid layouts without `min-w-0` suffered horizontal content overflow on small screens.

### Decision
1. Consolidate Tailwind CSS and Autoprefixer entirely into `postcss.config.js`, removing inline Vite PostCSS duplication.
2. Remove the global `!important` button override from `src/index.css`.
3. Replace rigid viewport units (`100vw`, `100vh`) inside embedded labs with `w-full`, `h-full`, `min-w-0`, and flexible grid tracks (`grid-cols-1 md:grid-cols-12`).

### Consequences
- **Positive:** Clean, predictable Vite build pipeline with zero PostCSS warnings.
- **Positive:** Button component styling across sidebars, bottom sheets, and action bars respects intentional design tokens.
- **Positive:** Responsive layouts remain bounded within viewport boundaries on phones (~360–390px) and tablets without horizontal scrollbar blowout.

---

## ADR-103: Deduplicated Mobile Orientation Policy via React Context & Session Storage

### Status
Accepted & Implemented

### Context
`LabOrientationGuard` was being instantiated at multiple levels of the component hierarchy (e.g. outer workspace shell, embedded renderer, and inner lab component). On mobile devices, this created stacked, duplicate orientation overlays and trapped students in repetitive modals even after dismissing the recommendation.

### Decision
1. Introduce `LabOrientationContext` (`isGuardActive`, `isBypassed`, `setBypassed`).
2. If an outer `LabOrientationGuard` is already active in the tree, descendant guards detect `parentGuard.isGuardActive === true` and bypass their own overlay completely.
3. Persist deliberate user dismissal in `sessionStorage` (`geniusphere_lab_portrait_bypassed`) with a fallback for restricted browser storage environments.
4. Always provide an explicit "Continue in Portrait" option so students are never blocked if device orientation lock or fullscreen API is unavailable or rejected.

### Consequences
- **Positive:** Exactly one orientation modal can ever appear at a time.
- **Positive:** Dismissing the prompt persists for the user's active session without nagging on subsequent lab switches.
- **Positive:** Full graceful degradation on browsers lacking `screen.orientation.lock()` support (e.g. iOS Safari).

---

## ADR-104: Dual-Engine AI Architecture: Strict Separation of Simulations from Production LLMs

### Status
Accepted & Implemented

### Context
A platform risk existed where educational simulations demonstrating neural network mathematics (forward pass, weights, attention matrix, temperature sliders) could be conflated with real AI inference calls to external APIs.

### Decision
Strictly decouple the two systems into distinct layers:
1. **Educational Simulation Engine:** Implemented in `src/labs/ai-lab/` (`educationalAiMath.ts`, `AILabFull.tsx`). Runs 100% deterministically in the client browser. Clearly and honestly labeled as an illustrative teaching model.
2. **Production AI Service:** Implemented in `server/ai/` (`chatHandler.ts`, `provider.ts`). Authenticated Fastify endpoint (`POST /api/v1/ai/chat`) with JWT validation, token-bucket rate limiting, correlation IDs, and outbound API calls to configured LLMs.
3. **No Direct Writes:** Neither AI engine is ever permitted to directly modify student XP, course completion, certificates, or role permissions in PostgreSQL.

### Consequences
- **Positive:** Compliance with Rule 3 of the Engineering Constitution (truth-in-reporting, no fake AI presented as live inference).
- **Positive:** Zero latency, zero external API costs, and full offline usability for educational math simulations.
- **Positive:** Robust security boundary around production AI endpoints.

---

## ADR-105: Local Ollama Resilience, Health Probing, and Zero-Mock Policy

### Status
Accepted & Implemented

### Context
When running in local/self-hosted development environments, local Ollama may be intermittently available. If Ollama is offline or unconfigured, returning canned or fake mock answers violates the Engineering Constitution.

### Decision
1. Implement `OllamaProvider` in `server/ai/provider.ts` alongside `GeminiProvider`.
2. Connect to private Ollama endpoint (`process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'`).
3. Include an explicit health check probe (`checkAvailability`) querying `/api/tags` with a short timeout.
4. When Ollama is offline, return honest HTTP 502/504 errors (`Ollama service unavailable at host. Ensure local Ollama daemon is running.`). Never fabricate mock responses.
5. In `AIProviderRegistry`, reject unknown provider names with `ProviderConfigurationError` to prevent silent misconfiguration.

### Consequences
- **Positive:** Reliable local LLM support for self-hosted instances.
- **Positive:** Strict adherence to zero-mock principles.
- **Positive:** Immediate visibility into local infrastructure health.

---

## ADR-106: Granular Lab Error Boundaries & Recoverable Runtime Degradation

### Status
Accepted & Implemented

### Context
Interactive labs use complex Canvas, WebGL, CodeMirror, and SVG engines. An uncaught rendering or script exception in one lab module previously risked collapsing the entire application page.

### Decision
1. Create `LabErrorBoundary` in `src/components/LabErrorBoundary.tsx`.
2. Wrap standalone and embedded lab mount points (`EmbeddedLabRenderer`, `SharedLabWorkspace`, `LessonPlayer`) in `LabErrorBoundary`.
3. Catch render exceptions, log diagnostics in development, and present an accessible recovery card with "Reload Lab" and "Return to Course" controls.

### Consequences
- **Positive:** Prevents student white-screen crashes.
- **Positive:** Preserves overall application navigation and learning progress state.
- **Positive:** Provides immediate self-healing action for transient WebGL context loss.
