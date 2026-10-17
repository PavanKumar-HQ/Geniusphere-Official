# Geniusphere — Comprehensive Risk Register (`RISK_REGISTER.md`)

*Document Version:* 1.3.0  
*Status:* Validated Risk Management Matrix  
*Review Cadence:* Bi-weekly during Sprints  

---

## 1. Risk Evaluation Matrix

Risks are scored based on **Impact (1–5)** and **Probability (1–5)**:
- **Critical (Score 16–25):** Immediate architectural mitigation mandatory before deployment.
- **High (Score 10–15):** Strict mitigation controls implemented and monitored continuously.
- **Medium (Score 5–9):** Tracked with defined contingency playbooks.
- **Low (Score 1–4):** Accepted operational risk with minimal monitoring.

```mermaid
quadrantChart
    title Validated Risk Severity Assessment
    x-axis Low Probability --> High Probability
    y-axis Low Impact --> High Impact
    quadrant-1 High Impact / High Probability: Immediate Mitigations
    quadrant-2 High Impact / Low Probability: Catastrophic Contingencies
    quadrant-3 Low Impact / Low Probability: Acceptable Residuals
    quadrant-4 Low Impact / High Probability: Operational Friction
    "Client-Side Grading Spoofing": [0.70, 0.85]
    "Mobile Browser RAM Crash (2GB devices)": [0.60, 0.80]
    "Slow 4G Mobile Cellular Latency": [0.85, 0.45]
    "Institutional Cross-Tenant Leak": [0.15, 0.95]
    "CERT-In 6-Hour Reporting Miss": [0.20, 0.70]
    "Supabase Platform Coupling": [0.40, 0.40]
    "Log Drain Add-On Cost Overrun": [0.35, 0.60]
    "Unverified Parental Identity": [0.75, 0.40]
    "Synchronous WASM Worker Lockup": [0.30, 0.75]
```

---

## 2. Risk Register & Mitigation Controls

| Risk ID | Category | Risk Description | Prob (1-5) | Imp (1-5) | Score | Mitigation Strategy & Preventive Controls | Contingency Playbook | Owner |
|---|---|---|:---:|:---:|:---:|---|---|---|
| **RSK-01** | **Security / Academic** | Students manipulate browser DevTools or tamper with client-side Wasm assertions to fake a 100% grade. | 4 | 4 | **16 (Critical)** | - **Server-Authoritative Grader:** Client test results ignored. Raw SQL template re-executed in isolated Deno worker against 5 challenge cases before persisting score via `service_role`. | Revoke tampered submission; return diagnostic failure notice to student. | Lead Security & Backend Eng |
| **RSK-02** | **Mobile / UX** | Heavy editor or Wasm runtime causes high memory pressure and crashes browser tabs on budget Android phones (1–2GB RAM). | 3 | 4 | **12 (High)** | - Reject heavy Monaco Editor (~4MB) in favor of **CodeMirror 6 (~250KB)**.<br>- Reject heavy Pyodide (~18MB) for pilot in favor of **SQLite-Wasm (~1.1MB)**.<br>- Strict memory watchdog in Web Worker. | If Wasm fails to initialize, fallback to server-side query execution mode. | Lead Frontend / Mobile Eng |
| **RSK-03** | **Security / Multi-Tenancy** | School A inadvertently accesses School B's confidential gradebook, student roster, or exam papers. | 1 | 5 | **5 (High)** | - PostgreSQL **Row-Level Security (RLS)** strictly enforced on all tables via hardened `SECURITY DEFINER` helpers.<br>- Automated CI integration tests simulating cross-tenant SQL queries on every build. | Immediate session token revocation; incident disclosure to affected school admins within 6 hours. | Lead Backend Eng |
| **RSK-04** | **Performance / UX** | Irreducible mobile cellular network latency (100–250ms RTT on Indian 4G) causes perception of slowness. | 4 | 2 | **8 (Med)** | - Run interactive SQL queries locally in the browser via SQLite-Wasm (0ms network round-trip).<br>- Provide optimistic UI feedback on lesson reads.<br>- Pre-fetch adjacent lessons in the background. | Render animated skeleton loaders on all network-bound actions. | Lead Frontend Eng |
| **RSK-05** | **Compliance** | Failure to notify CERT-In within statutory 6-hour window upon **noticing or being brought to notice** of an Annexure I cyber incident. | 1 | 4 | **4 (Low-Med)** | - Clock starts upon *noticing*, not confirming.<br>- Automated PagerDuty escalation upon detection of database anomaly or service outage.<br>- Initial report dispatched within 6 hours with available facts per Directions No. 20(3)/2022-CERT-In. | Direct statutory notification via designated emergency escalation officer to `incident@cert-in.org.in`. | Lead Security Architect |
| **RSK-06** | **Vendor / Lock-In** | Over-reliance on proprietary Supabase features complicates future migration to standard AWS RDS. | 2 | 3 | **6 (Med)** | - All tables, RLS policies, views, and functions written in 100% standard ANSI PostgreSQL 16 SQL.<br>- Use standard PostgreSQL migration tools rather than proprietary dashboard mutations. | Dump schema and data via standard `pg_dump`; deploy to standard AWS RDS instance in <2 hours. | DevOps & Data Architect |
| **RSK-07** | **Regulatory (Untested Assumption)** | Unverified assumption that email confirmation proves legal parenthood or that schools can act as proxy guardians without legal advice. | 4 | 3 | **12 (High)** | - Label email verification as a product safeguard, not statutory proof.<br>- Retain qualified Indian data protection counsel to draft formal school delegation DPA template. | Revert entirely to direct parent verification if school proxy delegation is deemed legally uncertain. | Lead Compliance Officer |
| **RSK-08** | **Financial / Infra** | Enabling Supabase Log Drains add-on ($60/mo) triples monthly operating costs beyond the pilot budget cap ($35/mo). | 2 | 3 | **6 (Med)** | - External Log Drains **strictly DISABLED** during pilot.<br>- Use in-database 180-day audit logging (`audit_events` table in PostgreSQL Mumbai) at **$0 extra cost**.<br>- Keep Supabase spend cap locked at $35/month. | Downgrade or pause non-essential logging drains if enabled accidentally. | Project Manager |
| **RSK-09** | **Data Integrity** | Offline sync race conditions when student completes lab offline and reconnects from an alternate device. | 2 | 3 | **6 (Med)** | - Explicit 4-state sync machine (`LOCAL_UNSYNCED`, `SYNCING`, `SERVER_CONFIRMED`, `SYNC_CONFLICT`).<br>- Server-authoritative idempotency key based on SHA256 hash. | Server rejects stale conflicting attempts; preserves submission history in audit table. | Fullstack Sync Eng |
| **RSK-10** | **Execution Sandbox (Untested)** | Synchronous SQLite WASM execution locks worker thread or exceeds memory; V8 heap limits unverified in Deno Deploy. | 2 | 4 | **8 (Med)** | - AST pre-filtering rejects `WITH RECURSIVE`, `PRAGMA`, and multi-statement queries before execution.<br>- Dedicated host process timer terminates worker via `worker.terminate()` after 1.0s.<br>- Memory limit marked unverified; mitigated via 300-char query cap and 25-row buffer. | Unit test execution watchdog against infinite recursive queries in Milestone 1. | Lead Backend Eng |

---

## 3. Risk Review & Escalation Workflow

1. **Sprint Risk Audits:** Risks are re-assessed at the end of each sprint.
2. **Immediate Escalation:** Any trigger of RSK-01 (grading spoofing) or RSK-03 (cross-tenant leak) halts deployment and triggers an emergency security review within 60 minutes.
3. **Legal Checkpoints:** Prior to opening the platform to public minors, legal counsel must review the parent consent workflow and DPA agreements.
