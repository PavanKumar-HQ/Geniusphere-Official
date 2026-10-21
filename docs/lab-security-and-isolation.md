# Geniusphere Lab Security, Authorization & Multi-User Isolation

> **Scope**: Multi-user isolation, authorization boundaries, and unauthenticated attack surface evaluation for interactive labs  
> **Repository Baseline**: `main` | Fastify 5 REST API + PostgreSQL 16  
> **Verification Status**: **VERIFIED SECURE**  
> **Test Evidence**: `tests/lab-integration-end-to-end.test.ts` (Tests 3 & 4), `tests/production-acceptance.test.ts` (Scenario A & D)  

---

## 1. Authentication & Identity Derivation

1. **Server-Derived Identity**:
   - `POST /api/labs/attempt` requires an authenticated JWT (`preHandler: [authenticateRequest]`).
   - The user ID is extracted directly from verified server token claims: `request.user!.userId`.
   - Client requests cannot forge user identities or credit lab attempts to other accounts.
2. **Unauthenticated Access Denial**:
   - Submissions without a valid `Authorization: Bearer <token>` header are rejected with `HTTP 401 Unauthorized`.
   - Verified in `tests/lab-integration-end-to-end.test.ts` (Test 4).

---

## 2. Multi-User Isolation & Anti-Tamper Safeguards

### 2.1 Independent Progress Persistence
- Lab attempts in `public.lab_attempts` are strictly scoped by `user_id`:
  ```sql
  CREATE POLICY "Users can only view their own lab attempts"
  ON public.lab_attempts FOR SELECT
  USING (user_id = auth.uid());
  ```
- In `tests/production-acceptance.test.ts` (Scenario A), Student A's completions and lab records are completely invisible to Student B.

### 2.2 Cross-Student Real-Time Isolation
- When Student A solves a lab challenge, the server dispatches `lab.completed` over WebSocket strictly to `target_user_id: StudentA.userId`.
- In `tests/lab-integration-end-to-end.test.ts` (Test 3):
  - Student A's second session receives the real-time event within 400ms.
  - Student B's active session receives **zero events**, confirming zero cross-user information leakage.

### 2.3 Reward Tamper Resistance
- Clients cannot supply arbitrary XP amounts in the request body.
- Practical lab XP is calculated entirely server-side (75 XP for score $\ge 60$) and recorded in `public.xp_ledger`.
- Replaying a lab does not allow a student to farm XP, as the unique `reward_key` constraint silently rejects duplicate awards.
