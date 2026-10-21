# Geniusphere Real-Time Architecture & Event Synchronization Specification

> **Transport Architecture**: Fastify 5 (`@fastify/websocket`) Gateway on `/ws` + Transactional Outbox Pattern  
> **Database Engine**: PostgreSQL 16 (`geniusphere_dev`)  
> **Frontend Integration**: Authenticated WebSocket client (`src/services/apiClient.ts`) + Authoritative In-Memory Reconciliation (`src/App.tsx`)  
> **Verification Status**: **VERIFIED COMPLETE**  
> **Test Evidence**: `tests/production-acceptance.test.ts` (Scenario C), `tests/production-integration.test.ts` (Tests 7, 8, 9), `tests/realtime-backend.test.ts` (12 tests)  

---

## 1. End-to-End Architectural Data Flow

Geniusphere strictly rejects client-side optimistic fabrication or unverified broadcast events. Real-time updates follow this authoritative lifecycle:

```
[Student Action (Session A)]
       │
       ▼
[Authenticated REST Request (Bearer JWT)]
       │
       ▼
[Fastify Server Validation & Authorization]
       │
       ▼
[Atomic PostgreSQL Transaction]
   ├── 1. Inserts/updates domain state (e.g. lesson_completions, lab_attempts)
   ├── 2. Atomically records XP in public.xp_ledger with UNIQUE(reward_key)
   ├── 3. Reconciles total XP and streak in public.user_progress
   └── 4. Enqueues event in public.transactional_outbox
       │
       ▼ (Transaction Commits Authoritatively in PostgreSQL)
[Real-Time Dual Dispatch]
   ├── A. Instant WebSocket Push via wsGateway.broadcast(target_user_id)
   └── B. Durable Outbox Worker (server/services/outboxWorker.ts) -> WebPush & Notifications
       │
       ▼
[Authenticated WebSocket Gateway (/ws)]
   └── Encapsulates DOMAIN_EVENT strictly to target user sockets
       │
       ▼
[Connected Student Session B (e.g. Second Tab / Second Device)]
   ├── 1. Receives DOMAIN_EVENT payload
   ├── 2. Reconciles local database state (db.completeLesson, db.recordLabAttempt)
   └── 3. Re-renders UI immediately without requiring a manual page refresh
```

---

## 2. Channel Design & Multi-Tenant Security Boundaries

| Channel Name | Authorization Rule | Payload Scope | Disallowed Subscribers |
|---|---|---|---|
| `user:<userId>` | Only connections bearing a valid JWT where `token.userId === <userId>` | Personal lesson completions, streak updates, lab attempts, notifications | Rejected for any other student (`SUBSCRIPTION_DENIED`) |
| `org:<orgId>` | Valid JWT where `token.orgId === <orgId>` | Institution-wide announcements, policy updates | Rejected for external organization users |
| `classroom:<classroomId>` | Active teachers or enrolled students of classroom | Assignment releases, class announcements | Rejected for students not in classroom |
| `system:broadcast` | Authenticated users | Platform maintenance alerts, system-wide alerts | Unauthenticated connections rejected (`4001`) |

### 2.1 Connection Lifecycle & Security Controls
1. **Token Authentication at Handshake**:
   - WebSocket URL format: `ws://localhost:3001/ws?token=<JWT>`.
   - Missing token $\rightarrow$ Socket closed with code `4001` (`Authentication token required`).
   - Tampered/expired token $\rightarrow$ Socket closed with code `4002` (`Invalid or expired token`).
2. **Channel Subscription Guard**:
   - `wsGateway.canSubscribe(user, channel)` checks permissions before adding socket to channel.
   - Unauthorized subscription attempts emit `{ type: 'SUBSCRIPTION_DENIED', channel: msg.channel, error: 'Unauthorized channel access' }`.
3. **Automatic Cleanup**:
   - Socket `close` and `error` events automatically unregister socket from `this.clients.get(userId)`.
   - When all sockets for a user close, the user set is deleted to prevent memory leaks.

---

## 3. Disconnection Resilience & Missed-Event Recovery

1. **Client Reconnection Strategy**:
   - `src/services/apiClient.ts` listens to `ws.onclose` and triggers exponential backoff reconnects after 3000ms.
2. **State Reconciliation on Reconnect**:
   - When a client reconnects after temporary network loss, `apiClient.getMe()` and `apiClient.getProfile()` are invoked.
   - The authoritative PostgreSQL database records replace any stale cache, ensuring zero lost updates.
3. **Idempotent Duplicate Event Handling**:
   - If network duplicates deliver the same `lesson.completed` or `lab.completed` event twice:
     - `db.completeLesson` performs a set-based check (`completed_lessons.includes(lessonId)`).
     - Local progress percentage and XP remain strictly deterministic and do not duplicate.

---

## 4. Supported Real-Time Synchronized Features

1. **Lesson Completion & YouTube Progress**:
   - Session A marks lesson complete $\rightarrow$ Session B updates syllabus checkmark and progress bar in real time.
2. **Interactive Simulation Labs**:
   - Session A solves lab challenge $\rightarrow$ Session B receives `lab.completed` event, updates lab attempt records, and unlocks next stage.
3. **XP, Streaks & Gamification**:
   - Server-authoritative calculations broadcast updated XP and streak without trusting client arithmetic.
4. **Student Profile Updates**:
   - Session A edits student profile $\rightarrow$ Session B updates name, avatar, and settings in real time.
5. **In-App Notifications & Web Push**:
   - Outbox worker generates persistent notification rows in `public.notifications` with delivery tracking.
