# GENIUSPHERE — ARCHITECTURE PROPOSAL & SPECIFICATION

**Date:** 2026-10-20  
**Version:** 3.0.0  
**Architecture Pattern:** Modular Monolith (Fastify + React) with Local-First Resilient Persistence  

---

## 1. System Topology & Boundaries

```
 +-----------------------------------------------------------------------+
 |                     STUDENT BROWSER ENVIRONMENT                       |
 |                                                                       |
 |  +--------------------+  +---------------------+  +----------------+  |
 |  | React 19 UI Views  |  | CurriculumLabRunner |  | Local-First    |  |
 |  | (Catalog, Progress)|  | (170 SVG Labs)      |  | Store (IDB)    |  |
 |  +---------+----------+  +----------+----------+  +-------+--------+  |
 +------------|------------------------|---------------------|-----------+
              | HTTPS (REST)           | WebSocket (Auth)    | Offline Sync
              v                        v                     v
 +-----------------------------------------------------------------------+
 |                  GENIUSPHERE BACKEND SERVER (Fastify 5)               |
 |                                                                       |
 |  +--------------------+  +---------------------+  +----------------+  |
 |  | Auth & Security    |  | Domain Services     |  | WebSocket      |  |
 |  | (JWT, RBAC Guards) |  | (Enroll, Complete)  |  | Gateway        |  |
 |  +---------+----------+  +----------+----------+  +-------+--------+  |
 |            |                        |                     |           |
 |            +------------+-----------+---------------------+           |
 |                         |                                             |
 |                         v (ACID Transactions & Row-Level Locking)     |
 |  +-----------------------------------------------------------------+  |
 |  | Transactional Outbox Worker (`SELECT ... FOR UPDATE SKIP LOCKED`)|  |
 |  +-----------------------------------------------------------------+  |
 +-------------------------|---------------------------------------------+
                           v
 +-----------------------------------------------------------------------+
 |                POSTGRESQL RELATIONAL DATABASE (19 Tables)             |
 |  users | orgs | courses | enrollments | completions | labs | outbox   |
 +-----------------------------------------------------------------------+
```

---

## 2. Key Architectural Decisions

### ADR-001: Fastify 5 Modular Monolith vs. Distributed Microservices
- **Decision:** Build Geniusphere as a cohesive modular monolith in Fastify 5 rather than separate microservices.
- **Rationale:** An EdTech platform serving school students does not suffer from high independent scaling needs across subdomains. A modular monolith eliminates distributed network latency, simplifies transactions across enrollments and completions, drastically reduces cloud hosting costs ($5–$20/month vs $200+/month), and keeps CI test suites fast (<1 second).

### ADR-002: Client-Driven SVG Simulation Engine (`CurriculumLabRunner`)
- **Decision:** Execute all 170 simulation algorithms directly in the student's browser via React state and pure mathematical functions, rendering real-time SVG diagrams.
- **Rationale:** 
  - Zero round-trip latency: Sliders update smoothly at 60 FPS without network lag.
  - Unlimited concurrency: 1,000 students in a school auditorium run simulations simultaneously without placing CPU load on the server.
  - Complete offline support: Labs run even when school internet drops.

### ADR-003: Deterministic Progression Calculation
- **Decision:** Never store hardcoded, mutable streak or XP counters without an underlying immutable log of timestamped lesson and lab completions.
- **Rationale:** Eliminates fabricated mock data. Streak is calculated as the consecutive sequence of distinct calendar dates with at least one verified completion event. XP is calculated as:
  $$\text{XP} = (\text{Completed Lessons} \times 50) + (\text{Completed Labs} \times 100)$$

---

## 3. Security & Privacy Blueprint

1. **Child Privacy (DPDP & COPPA Compliance):**
   - Minors (age < 18) are flagged via `is_minor = true`.
   - Parental consent links are tracked with verification hashes (`parent_guardian_links`).
   - Student profiles are strictly isolated within their assigned classroom and school organization.
2. **Authentication & Token Management:**
   - Cryptographic JWT with HS256 algorithm and 24-hour expiration.
   - Passwords hashed with `bcryptjs` (cost factor 10).
3. **SVG Safety & Content Security Policy:**
   - All SVG visualizations are rendered using declarative React JSX elements, preventing arbitrary `<script>` injection or malicious DOM manipulation.
