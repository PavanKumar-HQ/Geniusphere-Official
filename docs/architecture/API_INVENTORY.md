# Geniusphere — Authoritative API Inventory

## Executive Summary
This document provides an evidence-based inventory of every API route, client request, serverless handler, and WebSocket event in Geniusphere.
All findings are derived directly from the active codebase:
- **Backend Router**: Fastify 5 server ([server/index.ts](file:///Users/pavankumars/Downloads/geniuspheregpt/server/index.ts))
- **Frontend API Client**: [src/services/apiClient.ts](file:///Users/pavankumars/Downloads/geniuspheregpt/src/services/apiClient.ts)
- **Vercel Serverless Function**: [api/v1/ai/chat.ts](file:///Users/pavankumars/Downloads/geniuspheregpt/api/v1/ai/chat.ts)
- **Total Backend Endpoints**: **68** HTTP endpoints + 1 WebSocket gateway (`/ws`)
- **Total Frontend Client Methods**: **38** distinct API calls mapped in `apiClient.ts`

---

## Endpoint Classification Legend
- **IMPLEMENTED**: Fully implemented in both frontend and backend with PostgreSQL persistence and schema validation.
- **PARTIAL**: Implemented in backend with working logic, but client integration is simulated locally via in-memory DB or lacks direct UI wiring.
- **UNUSED**: Implemented in backend but no active caller currently exists in the frontend UI or apiClient.
- **DUPLICATE**: Legacy or backward-compatibility alias pointing to an authoritative endpoint.
- **UNVERIFIED**: Defined in route definitions or tests but requires external live database/services to execute.

---

## 1. System Health, Readiness & Control Plane Telemetry

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/health` | `server/index.ts:39` | Public | None | `{ status: string, server: string, state: string, timestamp: string, connectedWebSocketUsers: number }` | `SELECT NOW()` on `public.users` | IMPLEMENTED | `tests/ai-endpoint.test.ts` |
| `GET` | `/health/liveness` | `server/index.ts:50` | Public | None | `{ status: 'alive' \| 'draining', state: string, timestamp: string }` | None (Process level) | IMPLEMENTED | `tests/control-plane-lifecycle.test.ts` |
| `GET` | `/health/readiness` | `server/index.ts:54` | Public | None | `{ ready: boolean, state: string, subsystems: SubsystemStatus[], timestamp: string }` | `SELECT 1` ping | IMPLEMENTED | `tests/control-plane-lifecycle.test.ts` |
| `GET` | `/api/control-plane/telemetry` | `server/index.ts:62` | Bearer JWT (Superadmin or Teacher) | None | Full telemetry JSON: process, memory, database pool, outbox queue, WebSocket clients, AI status | Memory + `pool` metrics | IMPLEMENTED | `tests/control-plane-lifecycle.test.ts` |

---

## 2. Authentication, Sessions & User Profiles

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | `server/index.ts:77` | Public (Rate-limited) | `{ email: string, password: string }` | `{ token: string, user: ApiUserSession }` | `public.users`, `public.organization_memberships` | IMPLEMENTED | `tests/auth-security-failure-modes.test.ts` |
| `GET` | `/api/auth/me` | `server/index.ts:136` | Bearer JWT (Any authenticated user) | None | `{ user: ApiUserSession, progress: UserProgress, completions: LessonCompletion[] }` | `public.users`, `public.user_progress`, `public.lesson_completions` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `GET` | `/api/profile` | `server/index.ts:147` | Bearer JWT (Any authenticated user) | None | `{ personalInfo: {...}, learningStats: {...} }` | `public.users`, `public.user_progress`, `public.lesson_completions`, `public.lab_attempts` | IMPLEMENTED | `tests/student-profile-and-sync.test.ts` |
| `PATCH` | `/api/profile` | `server/index.ts:155` | Bearer JWT (Self only) | `{ fullName: string }` | `{ success: true, user: UserRecord }` | `public.users` UPDATE + `public.transactional_outbox` | IMPLEMENTED | `tests/production-acceptance.test.ts` |
| `GET` | `/api/progress/:userId` | `server/index.ts:304` | Bearer JWT (Self, Linked Parent, Teacher, or Superadmin) | Path param: `userId` | `{ progress: UserProgress, completions: LessonCompletion[], labAttempts: LabAttempt[] }` | `public.user_progress`, `public.lesson_completions`, `public.parent_guardian_links` | IMPLEMENTED | `tests/production-acceptance.test.ts` |

---

## 3. Courses, Lessons, Playback & Enrollments

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/courses` | `server/index.ts:177` | Bearer JWT (Authenticated) | Query: `?publishedOnly=true` | `Course[]` | `public.courses` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `GET` | `/api/courses/:identifier` | `server/index.ts:186` | Public | Path param: `id` or `slug` | `Course` | `public.courses` | IMPLEMENTED | `tests/canonical-curriculum.test.ts` |
| `POST` | `/api/courses/:id/enroll` | `server/index.ts:195` | Bearer JWT (Learner) | Path param: `id` | `CourseEnrollment` | `public.course_enrollments` + outbox event | IMPLEMENTED | `tests/production-integration.test.ts` |
| `GET` | `/api/my/enrollments` | `server/index.ts:200` | Bearer JWT (Learner) | None | `CourseEnrollment[]` | `public.course_enrollments` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/courses/:id/lessons/:lessonId/complete` | `server/index.ts:204` | Bearer JWT (Enrolled Learner) | `{ score?: number, answers?: object, watchTimeSeconds?: number }` | `{ success: true, completion: LessonCompletion, xpAwarded: number, streak: StreakState }` | `public.lesson_completions`, `public.xp_ledger`, `public.user_progress`, `public.transactional_outbox` | IMPLEMENTED | `tests/production-acceptance.test.ts` |
| `POST` | `/api/courses/:id/lessons/:lessonId/playback` | `server/index.ts:266` | Bearer JWT (Learner) | `{ watchTimeSeconds: number, videoCompleted?: boolean }` | `{ success: true, timeRecordedSeconds: number, totalTimeSpentSeconds: number }` | `public.user_progress` | IMPLEMENTED | `tests/youtube-video-learning-flow.test.tsx` |

---

## 4. Labs, Simulations & Assessments

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/api/labs/attempt` | `server/index.ts:327` | Bearer JWT (Learner) | `{ labSlug: string, score: number, status: 'completed' \| 'failed', details?: object }` | `{ success: true, attempt: LabAttempt, xpAwarded: number }` | `public.lab_attempts`, `public.xp_ledger`, `public.user_progress`, `public.transactional_outbox` | IMPLEMENTED | `tests/lab-integration-end-to-end.test.ts` |
| `GET` | `/api/classrooms` | `server/index.ts:355` | Bearer JWT (Teacher / Student) | Query: `?orgId=...` | `Classroom[]` | `public.classrooms`, `public.classroom_enrollments` | IMPLEMENTED | `tests/curriculum-workflow.test.ts` |
| `POST` | `/api/submissions/:id/grade` | `server/index.ts:380` | Bearer JWT (Assigned Teacher or Superadmin) | `{ score: number, passed: boolean, notes?: string }` | `Submission` | `public.submissions`, `public.assignments`, `public.classrooms`, `public.transactional_outbox` | IMPLEMENTED | `tests/production-integration.test.ts` |

---

## 5. Gamification, XP Ledger & Certificates

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/leaderboard` | `server/index.ts:284` | Public | Query: `?timeframe=all_time\|weekly\|daily&limit=50` | `{ timeframe: string, entries: LeaderboardEntry[], totalParticipants: number }` | `public.user_progress`, `public.users` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `GET` | `/api/certificates` | `server/index.ts:291` | Bearer JWT (Self) | None | `Certificate[]` | `public.certificates` | IMPLEMENTED | `tests/canonical-curriculum.test.ts` |
| `GET` | `/api/certificates/verify/:code` | `server/index.ts:295` | Public | Path param: `code` | `{ valid: boolean, certificate: Certificate, studentName: string }` | `public.certificates`, `public.users`, `public.courses` | IMPLEMENTED | `tests/canonical-curriculum.test.ts` |

---

## 6. Real-Time Events, Push Notifications & Outbox

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `WS` | `/ws?token=...` | `server/index.ts:71` | Query parameter JWT token | Subscriptions: `{ action: 'SUBSCRIBE', channel: string }` | Stream of `{ event_id, event_type, payload, timestamp }` | In-memory `wsGateway` | IMPLEMENTED | `tests/realtime-backend.test.ts` |
| `GET` | `/api/notifications` | `server/index.ts:387` | Bearer JWT (Recipient) | None | `{ notifications: Notification[], unreadCount: number }` | `public.notifications` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `PATCH` | `/api/notifications/:id/read` | `server/index.ts:393` | Bearer JWT (Recipient) | Path param: `id` | `{ success: true }` | `public.notifications` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/notifications/mark-all-read` | `server/index.ts:399` | Bearer JWT (Recipient) | None | `{ success: true, count: number }` | `public.notifications` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/push/subscribe` | `server/index.ts:404` | Bearer JWT (User) | `PushSubscriptionJSON` | `{ success: true }` | `public.push_subscriptions` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/push/unsubscribe` | `server/index.ts:410` | Bearer JWT (User) | `{ endpoint: string }` | `{ success: true }` | `public.push_subscriptions` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/push/test` | `server/index.ts:416` | Bearer JWT (User) | None | `{ success: boolean, deliveredCount: number }` | `public.push_subscriptions` | IMPLEMENTED | `tests/production-integration.test.ts` |
| `POST` | `/api/test/broadcast` | `server/index.ts:426` | Test/Internal (Local only) | `{ eventType: string, payload: object, targetUserId?: string }` | `{ broadcast: true }` | None | UNUSED | Manual |

---

## 7. Institutional Marketplace, Trainer Network & Safeguarding

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/trainers` | `server/index.ts:435` | Public | None | `Trainer[]` (Verified only) | `public.trainers` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/trainers/me` | `server/index.ts:440` | Bearer JWT (Trainer) | None | `Trainer` | `public.trainers` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/trainers/register` | `server/index.ts:448` | Bearer JWT (Any user) | `{ headline, bio, domains, yearsExperience, ... }` | `Trainer` (Status: pending) | `public.trainers` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `PATCH` | `/api/trainers/:id/verify` | `server/index.ts:458` | Bearer JWT (Superadmin) | `{ status: 'verified' \| 'rejected', notes?: string }` | `Trainer` | `public.trainers` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/marketplace/requests` | `server/index.ts:471` | Bearer JWT (School Admin / Superadmin / Trainer) | None | `TrainingRequest[]` | `public.training_requests` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/requests` | `server/index.ts:477` | Bearer JWT (School Admin or Superadmin) | Request specification JSON | `TrainingRequest` | `public.training_requests` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `PATCH` | `/api/marketplace/requests/:id/status` | `server/index.ts:491` | Bearer JWT (Superadmin) | `{ status: string }` | `TrainingRequest` | `public.training_requests` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/requests/:id/quote` | `server/index.ts:501` | Bearer JWT (Superadmin) | `{ grossAmountPaise, trainerFeePaise, termsMarkdown }` | `TrainingQuote` | `public.training_quotes` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/quotes/:id/accept` | `server/index.ts:514` | Bearer JWT (School Admin) | None | `TrainingQuote` (Status: accepted) | `public.training_quotes`, `public.training_requests` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/requests/:id/assign` | `server/index.ts:523` | Bearer JWT (Superadmin) | `{ trainerId, quoteId, sessionPlan }` | `TrainingAssignment` | `public.training_assignments` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/assignments/:id/respond` | `server/index.ts:536` | Bearer JWT (Assigned Trainer) | `{ status: 'accepted' \| 'declined', notes?: string }` | `TrainingAssignment` | `public.training_assignments` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/marketplace/sessions` | `server/index.ts:546` | Bearer JWT (Authorized) | None | `TrainingSession[]` | `public.training_sessions` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/sessions/:id/deliver` | `server/index.ts:551` | Bearer JWT (Trainer) | `{ attendanceCount: number, notes?: string }` | `TrainingSession` | `public.training_sessions` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/sessions/:id/verify` | `server/index.ts:561` | Bearer JWT (School Admin) | None | `TrainingSession` (Status: verified) | `public.training_sessions` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/marketplace/invoices` | `server/index.ts:570` | Bearer JWT (School Admin / Superadmin) | None | `TrainingInvoice[]` | `public.training_invoices` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/invoices/:id/pay` | `server/index.ts:575` | Bearer JWT (School Admin) | None | `TrainingInvoice` (Status: paid) | `public.training_invoices` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/marketplace/payouts` | `server/index.ts:584` | Bearer JWT (Trainer / Superadmin) | None | `TrainerPayout[]` | `public.trainer_payouts` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/payouts/:id/approve` | `server/index.ts:590` | Bearer JWT (Superadmin) | None | `TrainerPayout` | `public.trainer_payouts` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/payouts/:id/settle` | `server/index.ts:602` | Bearer JWT (Superadmin) | `{ payoutRef: string }` | `TrainerPayout` | `public.trainer_payouts` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `POST` | `/api/marketplace/safeguarding` | `server/index.ts:614` | Bearer JWT (Any authenticated user) | `{ category, severity, description, subjectUserId? }` | `SafeguardingReport` | `public.safeguarding_reports` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `GET` | `/api/marketplace/safeguarding` | `server/index.ts:628` | Bearer JWT (School Admin / Superadmin) | None | `SafeguardingReport[]` | `public.safeguarding_reports` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |
| `PATCH` | `/api/marketplace/safeguarding/:id/resolve` | `server/index.ts:633` | Bearer JWT (Superadmin) | `{ resolutionNotes: string }` | `SafeguardingReport` | `public.safeguarding_reports` | IMPLEMENTED | `tests/school-training-marketplace.test.ts` |

---

## 8. Revenue Marketplace, Direct Bookings & Financial Ledger

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/marketplace/packages` | `server/index.ts:647` | Public / Optional Auth | None | `MarketplacePackage[]` | `public.marketplace_packages` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/marketplace/packages` | `server/index.ts:652` | Bearer JWT (Superadmin) | Package DTO | `MarketplacePackage` | `public.marketplace_packages` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/marketplace/materials` | `server/index.ts:664` | Public | None | `MarketplaceMaterial[]` | `public.marketplace_materials` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/marketplace/materials` | `server/index.ts:668` | Bearer JWT (Superadmin) | Material DTO | `MarketplaceMaterial` | `public.marketplace_materials` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/marketplace/requests/:id/proposals` | `server/index.ts:681` | Bearer JWT (Trainer) | `{ proposedDailyRatePaise, coverNote, availabilityDates }` | `TrainerProposal` | `public.trainer_proposals` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/marketplace/requests/:id/proposals` | `server/index.ts:691` | Bearer JWT (Owner / Superadmin) | Path param: `id` | `TrainerProposal[]` | `public.trainer_proposals` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/marketplace/quotes/:id/book` | `server/index.ts:700` | Bearer JWT (School Admin) | `{ selectedMaterials?: string[] }` | `TrainingBooking` + Generated `TrainingInvoice` | `public.training_bookings`, `public.training_invoices` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/marketplace/bookings` | `server/index.ts:711` | Bearer JWT (School Admin / Superadmin) | None | `TrainingBooking[]` | `public.training_bookings` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/finance/payments` | `server/index.ts:717` | Bearer JWT (Finance Admin) | `{ payerOrgId, amountPaise, paymentMethod, referenceNumber }` | `RecordedPayment` | `public.recorded_payments` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/finance/payments` | `server/index.ts:729` | Bearer JWT (School Admin / Finance Admin) | None | `RecordedPayment[]` | `public.recorded_payments` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/finance/payments/:id/allocate` | `server/index.ts:734` | Bearer JWT (Finance Admin) | `{ invoiceId, amountPaise }` | `PaymentAllocation` | `public.payment_allocations`, `public.training_invoices` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/finance/payments/:id/reconcile` | `server/index.ts:748` | Bearer JWT (Finance Admin) | Path param: `id` | `RecordedPayment` (Reconciled) + Double-Entry Ledger Posting | `public.recorded_payments`, `public.financial_ledger` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/finance/ledger` | `server/index.ts:760` | Bearer JWT (Finance Admin) | None | `FinancialLedgerEntry[]` | `public.financial_ledger` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `GET` | `/api/finance/revenue-metrics` | `server/index.ts:771` | Bearer JWT (Finance Admin) | None | `RevenueMetricsSummary` | `public.financial_ledger`, `public.training_invoices`, `public.trainer_payouts` | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |
| `POST` | `/api/v1/payments/webhook` | `server/index.ts:783` | Public Webhook (Header signature verified) | Webhook payload | `{ received: true }` | None (Contract-ready boundary) | IMPLEMENTED | `tests/revenue-marketplace-integration.test.ts` |

---

## 9. AI Service & Tutoring Endpoints

| Method | Path | Source File | Auth / Roles | Request Schema | Response Schema | DB Dependency | Status | Tests |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/ai/status` | `server/index.ts:796` | Public | None | `{ activeProvider: string, localAvailable: boolean, hostedAvailable: boolean }` | None | IMPLEMENTED | `tests/hybrid-ai-gateway.test.ts` |
| `POST` | `/api/v1/ai/chat` | `server/index.ts:817` & `api/v1/ai/chat.ts` | Bearer JWT (Optional/Enforced based on route config) | `AIChatRequestBody` (`{ message: string, conversationId?, context?, history? }`) | `{ status: 'success' \| 'provider_not_configured', data?: {...}, error?: {...} }` | `public.ai_rate_limits` | IMPLEMENTED | `tests/ai-endpoint.test.ts` |
| `POST` | `/api/ai/chat` | `server/index.ts:820` | Bearer JWT | Backward-compatible alias for v1 format or legacy `{ prompt: string }` | Same as v1 or legacy `{ text: string }` | `aiGateway` | DUPLICATE | `tests/ai-endpoint.test.ts` |
