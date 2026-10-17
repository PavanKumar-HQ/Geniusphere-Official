# Geniusphere — Engineering Roadmap & Deliverables (`ROADMAP.md`)

*Document Version:* 1.4.0  
*Status:* Corrected Specification (Pre-Implementation) — Awaiting Runtime Verification  
*Target Pilot Cohort:* 1 Partner School (150 students, 3 teachers) + 100 Independent Learners = 250 Total Enrolled  
*Review Phase:* Phase 0.4 Final Blocker Review  

---

## 1. Roadmap Overview & Timeline

The implementation plan is structured into **4 focused sprints (4–5 weeks total)**, with Milestone 1 defined as the exact first implementation step. Production cloud provisioning and public deployment remain strictly behind explicit stakeholder approval.

```mermaid
gantt
    title Streamlined Phase 1 Pilot Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Governance & Validation
    Phase 0.4: Master Coverage & Final Blocker Review :done, p0_4, 2026-10-17, 2026-10-18
    Stakeholder Sign-Off on Milestone 1 Scope :active, p0_gate, 2026-10-18, 2026-10-20
    section Phase 1: Pilot Platform (4 Sprints)
    Milestone 1: Local Migrations, Complete RLS Test Suite & SQL Grader :p1_1, 2026-10-21, 2026-10-28
    Milestone 2: CodeMirror 6, SQLite-Wasm & Edge Pinning :p1_2, 2026-10-29, 2026-11-06
    Milestone 3: Join Codes, Lesson 1 & Teacher Gradebook :p1_3, 2026-11-07, 2026-11-15
    Milestone 4: Cohort A Smoke Test & Pilot Rollout :p1_4, 2026-11-16, 2026-11-23
```

---

## 2. The Exact First Implementation Milestone

### Milestone 1: Local Multi-Tenant Database Migrations, RLS Security Test Suite & SQL Grader
*(Scope: 100% Local Development via Docker & Supabase CLI — No Cloud Deployments or Production Changes).*

#### 1. Local Development Environment Setup
- Initialize Git repository with strict `biome` linting and formatting rules.
- Initialize local Supabase development environment via Supabase CLI and Docker (PostgreSQL 16, Auth emulator, Deno Edge Function runner).

#### 2. Database Migrations (PostgreSQL 16)
- Create version-controlled SQL migration scripts for all 10 core tables plus `audit_events`:
  `organizations`, `users`, `organization_memberships`, `parent_guardian_links`, `classrooms`, `classroom_enrollments`, `courses`, `labs`, `assignments`, `submissions`, `audit_events`.
- Enforce column-level `GRANT` rules on `users` (`UPDATE` restricted strictly to `full_name`).
- Enforce column-level `GRANT` rules on `submissions` (student can only insert `assignment_id`, `submitted_query`, `attempt_number`; `score` and `passed` writes denied).
- Implement invariant triggers:
  - `check_last_admin_removal`: Prevents deleting or deactivating the last active `institution_admin` of an organization.
  - `check_teacher_org_membership`: Prevents assigning a teacher to a classroom outside their organization.
- Implement `auth.users` new user creation trigger calculating `is_minor` and `account_status`.

#### 3. Complete RLS Policy Deployment
- Apply hardened `SECURITY DEFINER` authorization helpers owned by `postgres` with fixed `search_path = public`:
  `has_org_role`, `is_classroom_teacher`, `is_enrolled_student`, `is_verified_parent`, `is_teacher_of_student`, `is_platform_superadmin`.
- Deploy RLS policies across all 11 tables with explicit `USING` and `WITH CHECK` clauses.

---

## 3. Comprehensive Milestone 1 Test Strategy (9 Mandatory Test Groups)

Automated tests running through Vitest and Deno CLI MUST assert both the **underlying PostgreSQL database error code** and the **application/API HTTP status code**, ensuring neither layer is conflated:

### Status Tracking Legend:
- **`Specified`**: Test case and exact assertions formally documented.
- **`Implemented`**: Test code written in test file.
- **`Executed`**: Test run triggered against local runtime.
- **`Passed`**: All assertions verified with 100% pass rate.
*(All tests below are currently **`Specified`**; implementation begins upon Milestone 1 authorization).*

```
┌────────────────────────────────────────────────────────────────────────┐
│ TEST STATUS SUMMARY:                                                   │
│ Total Specified Test Cases: 35 | Implemented: 0 | Executed: 0 | Passed: 0│
└────────────────────────────────────────────────────────────────────────┘
```

| Group ID | Test Group Name | Target Threat / Requirement | Underlying DB Error Code | API HTTP Status | Current Status |
|---|---|---|---|---|:---:|
| **TG-1** | **Identity and Roles** | Attacker executes `UPDATE users SET is_superadmin = true` | `42501 Insufficient Privilege` | `403 Forbidden` | Specified |
| | | User executes `UPDATE users SET account_status = 'active'` | `42501 Insufficient Privilege` | `403 Forbidden` | Specified |
| | | Attacker inserts into `organization_memberships` directly | `42501` / RLS Policy Denied | `403 Forbidden` | Specified |
| | | Inactive user attempts classroom actions | Helper returns `FALSE` | `403 Forbidden` | Specified |
| **TG-2** | **Tenant Isolation** | Student in Org 1 executes `SELECT * FROM classrooms WHERE organization_id = 'org-2'` | Returns `0 rows` | `200 OK` (Empty array) | Specified |
| | | Teacher in Org 1 attempts `INSERT` into Org 2 classroom | RLS Policy Violation | `403 Forbidden` | Specified |
| | | User in Org 1 attempts `UPDATE` on Org 2 organization record | RLS Policy Violation | `403 Forbidden` | Specified |
| | | User in Org 1 attempts `DELETE` on Org 2 course assignments | RLS Policy Violation | `403 Forbidden` | Specified |
| **TG-3** | **Institutional Invariants**| Assign teacher to classroom in another organization | Trigger `23514 check_violation` | `400 Bad Request` | Specified |
| | | Remove the sole `institution_admin` of an organization | Trigger `23514 check_violation` | `400 Bad Request` | Specified |
| | | Classroom join-code expiration validation | Helper returns `FALSE` | `403 Forbidden` | Specified |
| **TG-4** | **Guardian Access** | Unverified parent queries student submissions | Helper returns `FALSE` (0 rows) | `200 OK` (Empty array) | Specified |
| | | Verified parent queries linked student submissions | Allowed by RLS (`is_verified_parent`) | `200 OK` (Rows returned)| Specified |
| | | Parent queries unlinked student submissions | Helper returns `FALSE` (0 rows) | `200 OK` (Empty array) | Specified |
| | | Revoked parent queries student submissions | Helper returns `FALSE` (0 rows) | `200 OK` (Empty array) | Specified |
| **TG-5** | **Submissions & Grades** | Student attempts direct SQL update `submissions.score = 100` | RLS Policy Violation (`USING FALSE`) | `403 Forbidden` | Specified |
| | | Student attempts direct SQL insert with `passed = true` | `42501 Insufficient Privilege` | `403 Forbidden` | Specified |
| | | Student submits to assignment outside their enrolled class | Edge Grader RPC denial | `403 Forbidden` | Specified |
| | | Duplicate submission within 60s returns cached result | Replay detection via hash | `200 OK` (Cached result)| Specified |
| | | Exceeding `max_attempts` (10 attempts) rejects new submission | Attempt count check in RPC | `400 Bad Request` | Specified |
| **TG-6** | **SQL Execution Sandbox** | Query with stacked statement: `SELECT 1; DROP TABLE challenge_users;` | Pre-execution AST rejection | `400 Bad Request` | Specified |
| | | Query with SQL comments: `SELECT * -- comment` | AST / Lexical rejection | `400 Bad Request` | Specified |
| | | Malformed SQL syntax | Parser rejection | `400 Bad Request` | Specified |
| | | Injection attempt `' OR '1'='1` with parameter binding | Returns exactly `0 rows` | `200 OK` (Graded: PASS)| Specified |
| | | Valid lookup with `'alice'` parameter binding | Returns exactly `1 row` | `200 OK` (Graded: PASS)| Specified |
| | | Recursive query: `WITH RECURSIVE t AS (...)` | AST rejection | `400 Bad Request` | Specified |
| | | Runaway query execution time > 1,000ms | Host `setTimeout` worker termination | `408 Request Timeout` | Specified |
| **TG-7** | **Audit & Privacy** | Regular user attempts `SELECT` on `audit_events` | RLS Policy Denied (0 rows) | `200 OK` (Empty array) | Specified |
| | | Regular user attempts `UPDATE` or `DELETE` on `audit_events` | `42501 Insufficient Privilege` | `403 Forbidden` | Specified |
| | | Org Admin queries `audit_events` belonging to their own org | Allowed by RLS | `200 OK` (Rows returned)| Specified |
| | | Org Admin queries `audit_events` belonging to another org | Returns `0 rows` | `200 OK` (Empty array) | Specified |
| **TG-8** | **Database Lifecycle** | Fresh environment migration execution | Clean execution (`Exit 0`) | N/A (CLI Test) | Specified |
| | | Migration idempotency / repeatability test | Clean re-execution | N/A (CLI Test) | Specified |
| | | Foreign key cascade deletions (deleting org cascades) | All child rows removed cleanly | N/A (DB Test) | Specified |
| **TG-9** | **Regression Protection**| Re-execution of all test suites on post-migration state | 100% assertions satisfied | N/A (CI Gate) | Specified |

---

## 4. Subsequent Sprint Milestones

### Milestone 2: CodeMirror 6, SQLite-Wasm Client & Regional Edge Pinning (Week 2)
- Integrate CodeMirror 6 editor (~250KB) with touch-keyboard optimization.
- Implement SQLite-Wasm (~1.1MB) client runner for instant local feedback.
- Wire client submission to Edge Function explicitly pinned to `ap-south-1` (Mumbai) and assert `x-sb-edge-region` header.

### Milestone 3: High-Entropy Join Codes, Lesson 1 & Teacher Gradebook (Week 3)
- Implement Crockford Base32 8-character join code generation with 14-day expiry and rate limiting.
- Build Lesson 1 Reader with responsive SVGs and age-gated registration flow.
- Build live Teacher Gradebook matrix displaying student pass/fail status, submission timestamps, and code diffs.

### Milestone 4: Cohort A Smoke Test, Backup Drills & Controlled Pilot Rollout (Week 4)
- **Cohort A Usability Smoke Test:** Preliminary test with **10–15 students and 1 teacher** to validate UX, CodeMirror mobile typing, and grade synchronization.
- **Disaster Recovery Drill:** Execute restore drill from automated daily snapshot into staging DB, verifying full recovery in <30 minutes.
- **Controlled Rollout:** Upon Cohort A sign-off, open platform to the remaining pilot cohort.

---

## 5. Milestone 1 Exit Criteria (Definition of Done)

Implementation of Milestone 1 will be considered complete ONLY when all of the following criteria are satisfied:

1. **Clean Reproducible Migrations:** Version-controlled migrations create the approved 11-table schema from a clean local Docker environment (`supabase db reset`) with zero errors.
2. **Explicit Grants & Policy Coverage:** Every table has explicit column grants, RLS policies, and passes negative authorization tests.
3. **Automated Security Tests:** 100% pass rate across all 35 specified test cases in the 9 test groups (zero cross-tenant leaks, zero privilege self-promotions, zero grade tampering).
4. **Demonstrated SQL Grader Runtime:** The SQL grader demonstrates single `SELECT` enforcement, native parameter binding against all 5 challenge cases, and host-level worker termination within <= 1.0s.
5. **Deterministic Test Output:** Tests execute in CI with reproducible commands and retained execution logs.
6. **Risk Register Alignment:** All known architectural limitations (e.g. unverified memory limit, email parenthood limitations) are recorded in `RISK_REGISTER.md`.
7. **Handoff Consistency:** `READY.md`, `MASTER_COVERAGE_REGISTER.md`, and dated phase reports match the actual repository state.
