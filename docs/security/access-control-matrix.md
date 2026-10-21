# Geniusphere Role-Based & Resource Access Control Matrix

This document defines the formal permissions, boundary conditions, and enforcement mechanisms for all user roles across every system resource in the Geniusphere platform.

---

## 1. System Role Definitions

| Role Identifier | Description & Authority Level |
| :--- | :--- |
| `anonymous` | Unauthenticated public visitor. Can browse landing page and view published course summaries. |
| `learner` | Authenticated student. Can enroll in published courses, complete lessons, run labs, view personal progress. |
| `teacher` | Authenticated educator. Manages assigned classrooms, creates assignments, grades student submissions. |
| `guardian` | Verified parent or legal guardian under DPDP Act 2023. Can monitor assigned ward's progress and consent. |
| `institution_admin` | School or university administrator. Manages institutional rosters and organization-level classrooms. |
| `superadmin` | Platform operator (`is_superadmin = TRUE`). Full authority over all organizations, users, and audit logs. |

---

## 2. Resource-by-Role Access Control Matrix

| Resource | Operation | `anonymous` | `learner` | `teacher` | `guardian` | `institution_admin` | `superadmin` | Enforcement Mechanism |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`public.users`** | SELECT | ❌ Denied | Own record | Assigned students | Linked ward | Org members | All records | RLS `Users can view own profile` + helper functions |
| | UPDATE | ❌ Denied | Own profile* | Own profile | Own profile | Org members | All records | *Column guard: `password_hash` & `is_superadmin` forbidden |
| | DELETE | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | Allowed | Soft delete / RLS policy |
| **`public.courses`** | SELECT | Published only | Published only | Published only | Published only | Published only | All (including draft) | RLS `is_published = TRUE OR is_platform_superadmin()` |
| | INSERT/UPDATE | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | Allowed | Fastify auth middleware + RLS policy |
| **`public.enrollments`**| SELECT | ❌ Denied | Own enrollments | Assigned students | Linked ward | Org students | All | RLS `auth.uid() = user_id OR is_teacher_of_student(...)` |
| | INSERT | ❌ Denied | Self (`auth.uid()`) | Self | ❌ Denied | Assigned students | All | Transactional API `DomainService.enrollInCourse` |
| **`public.lesson_completions`** | SELECT | ❌ Denied | Own records | Assigned students | Linked ward | Org students | All | RLS policy + Fastify `/api/progress/:userId` check |
| | INSERT | ❌ Denied | Self (`auth.uid()`) | ❌ Denied | ❌ Denied | ❌ Denied | Allowed | Fastify `POST /api/courses/:id/lessons/:lessonId/complete` |
| **`public.xp_ledger`** | SELECT | ❌ Denied | Own records | ❌ Denied | ❌ Denied | ❌ Denied | All | RLS `auth.uid() = user_id` |
| | INSERT | ❌ Denied | App backend only | App backend only | ❌ Denied | ❌ Denied | Allowed | Database transactional execution with unique `reward_key` |
| | UPDATE/DELETE | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | Immutable financial ledger; direct mutations rejected |
| **`public.lab_attempts`**| SELECT | ❌ Denied | Own attempts | Assigned students | Linked ward | Org students | All | RLS policy + Fastify `/api/labs/attempt` |
| | INSERT | ❌ Denied | Self (`auth.uid()`) | ❌ Denied | ❌ Denied | ❌ Denied | Allowed | Fastify `POST /api/labs/attempt` |
| **`public.classrooms`**| SELECT | ❌ Denied | Enrolled only | Owned classrooms | Enrolled ward | Org classrooms | All | RLS `is_classroom_teacher(id) OR is_enrolled_student(id)` |
| | INSERT/UPDATE | ❌ Denied | ❌ Denied | Owned only | ❌ Denied | Org classrooms | All | Teacher ownership validation in `DomainService` |
| **`public.submissions`**| SELECT | ❌ Denied | Own submissions | Assigned students | Linked ward | Org students | All | RLS `auth.uid() = student_id OR is_classroom_teacher(...)` |
| | GRADE (UPDATE) | ❌ Denied | ❌ Denied | Assigned teacher*| ❌ Denied | ❌ Denied | Allowed | *Fastify `POST /api/submissions/:id/grade` verifies ownership |
| **`public.audit_events`**| SELECT | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | Allowed | RLS `is_platform_superadmin()` |
| | INSERT | ❌ Denied | System trigger | System trigger | System trigger | System trigger | System trigger | Immutable audit log; direct client INSERT rejected |
| **`POST /api/v1/ai/chat`** | EXECUTE | ❌ Denied | 20 req/min limit | 20 req/min limit | ❌ Denied | 20 req/min limit | Uncapped | Fastify JWT middleware + sliding window rate limiter |

---

## 3. Negative Security Verification Test Matrix

All boundary conditions above are verified through automated negative tests in Vitest:

| Test Identifier | Test File | Target Boundary | Assertion |
| :--- | :--- | :--- | :--- |
| **`SEC-001`** | `tests/rls-authorization.test.ts` | Cross-student progress access | Learner A querying `/api/progress/:studentB_id` is rejected with `HTTP 403 Forbidden`. |
| **`SEC-002`** | `tests/production-integration.test.ts` | Unauthorized submission grading | Learner attempting `POST /api/submissions/:id/grade` throws unauthorized error. |
| **`SEC-003`** | `tests/ai-endpoint.test.ts` | Suspended account access | User with `account_status = 'suspended'` is rejected with `HTTP 403 Forbidden`. |
| **`SEC-004`** | `tests/ai-endpoint.test.ts` | Unauthenticated AI chat access | Missing or invalid Bearer token is rejected with `HTTP 401 Unauthorized`. |
| **`SEC-005`** | `tests/ai-endpoint.test.ts` | Request rate limit enforcement | 21st request within 60s window receives `HTTP 429 Too Many Requests`. |
| **`SEC-006`** | `tests/first-api-slice.test.tsx` | Password hash update prevention | Client attempting direct update to `password_hash` column is rejected by SQL grant. |
| **`SEC-007`** | `tests/lab-integration-end-to-end.test.ts`| Real-time WebSocket isolation | Completion event for Student A is broadcast only to `user_A` channel and never leaks to `user_B`. |
