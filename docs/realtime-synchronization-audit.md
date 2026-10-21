# Geniusphere Real-Time Synchronization & Multi-Session Audit

> **Architecture**: Fastify 5 `@fastify/websocket` Gateway (`/ws`) + Transactional Outbox Worker (`server/services/outboxWorker.ts`)  
> **Runtime Baseline**: PostgreSQL 16 `public.transactional_outbox`  
> **Audit Status**: **VERIFIED FUNCTIONAL**  
> **Test Evidence**: `tests/production-acceptance.test.ts` (Scenario C), `tests/production-integration.test.ts` (Tests 7, 8, 9), `tests/realtime-backend.test.ts` (12 tests)  

---

## 1. Architectural Architecture

Instead of relying on fragile client-to-client broadcasts or local-only storage events, Geniusphere uses the **Transactional Outbox Pattern** combined with an authenticated WebSocket Gateway:

```
[Student Action]
       │
       ▼
[Atomic PostgreSQL Transaction]
   ├── 1. Writes domain change (e.g., profile update, lesson completion)
   └── 2. Writes event to public.transactional_outbox
       │
       ▼ (Transaction Commits)
[Outbox Worker Service (server/services/outboxWorker.ts)]
   ├── Polls unpublished outbox events
   ├── Marks events as processed with timestamps
   └── Dispatches to Realtime WebSocket Gateway (server/services/websocketGateway.ts)
       │
       ▼
[Authenticated WebSocket Gateway (/ws)]
   └── Broadcasts event strictly to target channel (e.g., user:<userId>)
       │
       ▼
[Active Student Sessions in Browser]
   └── Invalidate local query cache and re-render authoritative UI
```

---

## 2. Multi-Session Verification (Scenario C)

In `tests/production-acceptance.test.ts` (Scenario C):
1. **Setup**: Student opens Session A (tab 1) and Session B (tab 2). Both sessions authenticate with the student's JWT and subscribe to `user:<userId>`.
2. **Action**: In Session A, the student updates their profile (modifying full name and avatar settings) via `PATCH /api/users/:userId/profile`.
3. **Execution**: The server executes the update in PostgreSQL, commits the transaction, and enqueues an outbox event.
4. **Broadcast**: The outbox worker dispatches the update over WebSocket.
5. **Assertion**:
   - Session B receives the real-time event within milliseconds.
   - The payload matches the authoritative PostgreSQL record.
   - A subsequent direct read from PostgreSQL confirms that Session B's state matches the database without requiring a manual page reload.
   - Student B on a separate account receives zero events, proving channel segregation.

---

## 3. Channel Isolation & Authorization Boundaries

1. **User Channel (`user:<userId>`)**:
   - Only sockets carrying a valid JWT matching `<userId>` are admitted.
   - Receives personal lesson completion, XP rewards, and private notifications.
2. **Classroom Channel (`classroom:<classroomId>`)**:
   - Only active teachers and enrolled students of `<classroomId>` can subscribe.
   - Receives assignment announcements and class-wide updates.
3. **Reconnection & Disconnection Resilience**:
   - If a client disconnects due to network flapping, the WebSocket automatically attempts reconnection with exponential backoff.
   - Upon reconnecting, the client triggers a lightweight profile/progress sync query to ensure no missed events leave the UI stale.
