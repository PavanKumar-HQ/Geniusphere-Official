# Geniusphere — Authoritative Pipeline Inventory

## Overview
This document traces and specifies the 9 core runtime pipelines of Geniusphere: their triggers, execution steps, backend dependencies, failure modes, retry policies, idempotency models, observability, and test coverage.

---

## 1. Authentication & Permission Enforcement Pipeline
- **Trigger**: Client request with credentials (`POST /api/auth/login`) or bearer token (`Authorization: Bearer <token>`).
- **Steps**:
  1. Input validation for non-empty string email and password.
  2. Database lookup against `public.users` and active `public.organization_memberships`.
  3. Verify account status (`account_status != 'suspended'`).
  4. Compare password with `bcrypt.compare` against `password_hash`.
  5. Issue JWT signed with `config.jwtSecret` (HS256) containing `userId`, `email`, `role`, `orgId`, `isSuperadmin`.
  6. Subsequent requests authenticated via `authenticateRequest` hook in [server/auth.ts](file:///Users/pavankumars/Downloads/geniuspheregpt/server/auth.ts).
- **Dependencies**: PostgreSQL `users`, `organization_memberships`, `bcryptjs`, `jsonwebtoken`.
- **Failure Behavior**: Emits 400 (missing input), 401 (invalid credentials / expired token), 403 (suspended account / insufficient privileges).
- **Idempotency**: Stateless token verification.
- **Observability**: Auth failure events logged to stderr with IP and user context (passwords redacted).
- **Tests**: `tests/auth-security-failure-modes.test.ts`.

---

## 2. Course Delivery & Lesson Progress Pipeline
- **Trigger**: Learner completes video playback or submits comprehension quiz (`POST /api/courses/:id/lessons/:lessonId/complete`).
- **Steps**:
  1. Authenticate learner session via JWT.
  2. Verify enrollment in course. If not enrolled, automatically create enrollment record.
  3. Begin PostgreSQL transaction (`withTransaction`).
  4. Set PostgreSQL session variable for RLS: `request.jwt.claim.sub = userId`.
  5. Insert or update `public.lesson_completions`.
  6. Query all course lessons and recalculate `course_enrollments.progress_percent`.
  7. If progress hits 100%, record `completed_at` and generate verified certificate hash (`sha256:`).
  8. Commit transaction.
  9. Enqueue `lesson.completed` event into `public.transactional_outbox`.
- **Dependencies**: PostgreSQL tables: `course_enrollments`, `lesson_completions`, `courses`, `user_progress`, `certificates`, `transactional_outbox`.
- **Failure Behavior**: Any step failure triggers atomic `ROLLBACK`.
- **Idempotency**: Handled via compound primary key `(user_id, course_id, lesson_id)` on `lesson_completions`.
- **Observability**: Logged with completion metrics, execution duration.
- **Tests**: `tests/canonical-curriculum.test.ts`, `tests/production-acceptance.test.ts`.

---

## 3. Lab Session Creation, State Persistence & Reset Pipeline
- **Trigger**: Learner runs code simulation or submits lab challenge (`POST /api/labs/attempt`).
- **Steps**:
  1. Validate `labSlug`, `score` (0-100), and `status` ('completed' | 'failed' | 'in_progress').
  2. Insert record into `public.lab_attempts` with `details` JSONB.
  3. If `status === 'completed'` and `score >= 60`:
     - Attempt award in `public.xp_ledger` with unique reward key `lab_attempt:<userId>:<labSlug>:<attemptId>`.
     - Update user progress aggregate `lab_attempts_count` and `xp`.
  4. Write `lab.completed` event to `public.transactional_outbox`.
  5. Broadcast event to real-time subscribers via `wsGateway.broadcast()`.
- **Dependencies**: PostgreSQL `lab_attempts`, `xp_ledger`, `user_progress`, `transactional_outbox`.
- **Failure Behavior**: Database rollback on insertion error.
- **Idempotency**: Distinct `attemptId` allows progressive attempts while XP ledger constraint prevents duplicate XP exploitation.
- **Observability**: WebSocket broadcast + database audit trail.
- **Tests**: `tests/lab-integration-end-to-end.test.ts`, `tests/canonical-170-labs-deep-audit.test.ts`.

---

## 4. Assessment Submission and Server-Side Scoring Pipeline
- **Trigger**: Student submits assignment (`POST /api/submissions/:id/grade` or client execution sandbox).
- **Steps**:
  1. Student draft created in local IndexedDB or server `submissions` table with `attempt_number`.
  2. Cryptographic submission hash generated (`sha256:`).
  3. Teacher/evaluator verifies code execution and submits grade.
  4. Server validates that caller is authorized teacher for the classroom.
  5. Update `public.submissions` with `score`, `passed`, `feedback`, `graded_at`.
  6. Enqueue `assessment.graded` event in outbox.
- **Dependencies**: PostgreSQL `submissions`, `assignments`, `classrooms`, `organization_memberships`.
- **Failure Behavior**: 403 Forbidden if non-teacher attempts grading; atomic transaction rollback on DB error.
- **Idempotency**: Versioned submission attempts with cryptographic checksums.
- **Observability**: Emits outbox event and logs audit event.
- **Tests**: `tests/production-integration.test.ts`, `tests/curriculum-workflow.test.ts`.

---

## 5. Transactional XP & Concurrency-Safe Ledger Pipeline
- **Trigger**: Lesson completion, lab mastery, daily streak claim.
- **Steps**:
  1. Generate unique deterministic `reward_key` (e.g. `lesson_complete:<userId>:<courseId>:<lessonId>`).
  2. Execute SQL with row-level locking:
     ```sql
     INSERT INTO public.xp_ledger (user_id, amount, reason, reward_key, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (reward_key) DO NOTHING
     RETURNING id;
     ```
  3. If row was inserted (not a conflict):
     - Increment `user_progress.xp = xp + amount`.
     - Award streak bonuses if within valid 24h-48h window.
  4. Reconcile on demand via `SELECT COALESCE(SUM(amount), 0) FROM public.xp_ledger WHERE user_id = $1`.
- **Dependencies**: PostgreSQL `xp_ledger` table with `UNIQUE(reward_key)`.
- **Failure Behavior**: Concurrent calls for same key result in safe `DO NOTHING`; XP is never duplicated.
- **Idempotency**: 100% mathematically idempotent.
- **Observability**: Ledger records are immutable and append-only.
- **Tests**: `tests/production-acceptance.test.ts` (Scenario B concurrent test).

---

## 6. AI Routing, Rate Limiting, Quotas & Provider Fallback Pipeline
- **Trigger**: Client requests AI tutor guidance (`POST /api/v1/ai/chat`).
- **Steps**:
  1. Extract correlation ID `x-request-id` or generate UUID.
  2. Enforce sliding window rate limit: max 20 requests/minute per user (`public.ai_rate_limits`).
  3. Check configured provider (`config.aiProvider` / `AI_ROUTING_POLICY`).
  4. If `aiProvider === 'none'`, immediately respond with HTTP 503 (`status: 'provider_not_configured'`).
  5. If `prefer_local_fallback_hosted`:
     - Attempt local Ollama inference (`http://ollama:11434/api/generate`).
     - On connection failure or timeout (15000ms), fail over to hosted Gemini (`gemini-1.5-flash`).
  6. Apply strict pedagogical prompt templates and PII sanitization.
  7. Return structured JSON with `x-request-id`, latency headers, and token usage.
- **Dependencies**: `aiGateway.ts`, `chatHandler.ts`, `Google GenAI SDK`, `Ollama API`.
- **Failure Behavior**: HTTP 503 if unconfigured; HTTP 504 on timeout; HTTP 429 on rate limit with `Retry-After`.
- **Idempotency**: Non-state-mutating inference.
- **Observability**: `AILogger` records latency, token count, and fallback events (zero PII logged).
- **Tests**: `tests/ai-endpoint.test.ts`, `tests/hybrid-ai-gateway.test.ts`, `tests/python/test_ai_model_evaluator.py`.

---

## 7. Transactional Outbox & Background Event Dispatch Pipeline
- **Trigger**: Domain event recorded in `public.transactional_outbox` during an ACID transaction.
- **Steps**:
  1. `OutboxWorker` polling loop triggers every 2000ms (`server/services/outboxWorker.ts`).
  2. Queries up to 20 pending events using `FOR UPDATE SKIP LOCKED`.
  3. For each event:
     - Dispatches live event to connected clients via `wsGateway.broadcast()`.
     - Checks if event requires user notification (e.g. `assessment.graded`, `quote.accepted`).
     - If so, inserts in `public.notifications` and triggers `pushSender` for Web Push.
     - Updates outbox record `status = 'published'`, `published_at = NOW()`.
  4. On failure: increments `retry_count`. If `retry_count >= 5`, sets `status = 'failed'` and logs to dead-letter queue.
- **Dependencies**: PostgreSQL `transactional_outbox`, `notifications`, `push_subscriptions`, Node.js `ws` gateway.
- **Failure Behavior**: Automatic exponential backoff up to 5 retries; unhandled failures dead-lettered.
- **Idempotency**: Events have unique UUIDs; clients deduplicate by `event_id`.
- **Observability**: Telemetry reports pending, published, and failed queue depth.
- **Tests**: `tests/production-integration.test.ts`, `tests/realtime-backend.test.ts`.

---

## 8. Database Migrations & Row-Level Security Pipeline
- **Trigger**: Server startup (`startServer()` in `server/index.ts`) or CI migration check.
- **Steps**:
  1. Connect to PostgreSQL pool.
  2. Create `public._migrations` tracking table if not exists.
  3. Read `supabase/migrations/*.sql` in lexicographical timestamp order.
  4. Apply unapplied migrations sequentially in transactions.
  5. Bootstrap core roles: `geniusphere_app`, `geniusphere_authenticated`, `geniusphere_admin`.
  6. Enable RLS on all 19 domain tables and attach granular security policies.
- **Dependencies**: Node `pg` Pool, `supabase/migrations` SQL scripts.
- **Failure Behavior**: Halts server boot with nonzero exit code on migration failure.
- **Idempotency**: Checked against `_migrations` table hashes.
- **Observability**: Migration names and durations logged to console.
- **Tests**: `tests/migrations.test.ts`, `tests/rls-authorization.test.ts`.

---

## 9. Deployment, Health Checks & Telemetry Pipeline
- **Trigger**: Container orchestrator (Docker/Kubernetes) or monitoring service polling.
- **Steps**:
  1. `GET /health/liveness`: Checks process event loop responsiveness and draining state.
  2. `GET /health/readiness`: Executes `SELECT 1` ping on PostgreSQL pool, verifies outbox worker state.
  3. `GET /health`: Returns connected WebSocket users, lifecycle state, and server timestamp.
  4. `GET /api/control-plane/telemetry`: Exposes process memory, pool usage, and AI provider status to administrators.
  5. Coordinated graceful shutdown: On `SIGTERM` or `SIGINT`, transitions state to `draining`, closes WebSocket connections cleanly, drains DB pool, and exits.
- **Dependencies**: `server/controlPlane.ts`.
- **Failure Behavior**: Returns HTTP 503 if DB is unreachable or system is draining.
- **Observability**: Structured metrics and status probes.
- **Tests**: `tests/control-plane-lifecycle.test.ts`.
