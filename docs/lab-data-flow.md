# Geniusphere Practical Lab Data Flow & Completion Lifecycle

> **Component References**: `src/components/SharedLabWorkspace.tsx`, `src/components/LessonPlayer.tsx`, `src/labs/registry.tsx`  
> **API Endpoint**: `POST /api/labs/attempt` (`server/index.ts`)  
> **Backend Service**: `server/services/domainService.ts` (`recordLabAttempt`)  
> **Verification Status**: **VERIFIED COMPLETE**  
> **Test Evidence**: `tests/lab-integration-end-to-end.test.ts` (4/4 tests), `tests/production-acceptance.test.ts` (Scenario D)  

---

## 1. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant LabUI as SharedLabWorkspace / StandaloneLab (React)
    participant Client as apiClient (HTTP)
    participant Server as Fastify API (/api/labs/attempt)
    participant Domain as domainService.recordLabAttempt
    participant DB as PostgreSQL (lab_attempts, xp_ledger)
    participant Outbox as transactional_outbox
    participant WS as WebSocket Gateway (/ws)
    actor StudentSessionB as Student Session B (Second Tab)

    Student->>LabUI: Interacts with controls (sliders, code, inputs)
    LabUI->>LabUI: Evaluates practical model against validation criteria
    Student->>LabUI: Clicks "Submit Attempt" / Solves Challenge
    LabUI->>LabUI: Set saveStatus='SAVED', show diagnostic feedback
    LabUI->>Client: recordLabAttempt(labSlug, score, 'completed', details)
    Client->>Server: POST /api/labs/attempt (Bearer JWT)
    Server->>Server: Authenticate JWT (request.user!.userId)
    Server->>Domain: recordLabAttempt(userId, labSlug, score, 'completed', details)
    
    rect rgb(240, 248, 255)
        Note over Domain,DB: Atomic PostgreSQL Transaction
        Domain->>DB: INSERT INTO public.lab_attempts (user_id, lab_slug, score, status, details)
        alt Score >= 60 and First Eligible Completion
            Domain->>DB: INSERT INTO public.xp_ledger (reward_key='lab_complete:...') ON CONFLICT DO NOTHING
            Domain->>DB: UPDATE public.user_progress SET xp=SUM(xp_ledger)
            Domain->>Outbox: INSERT INTO transactional_outbox ('lab.completed')
        else Replayed Lab Attempt
            Domain->>DB: Record new attempt row in lab_attempts (0 XP duplicate award)
        end
    end
    
    DB-->>Domain: Transaction Committed
    Domain-->>Server: Return attempt record & authoritative XP
    Server->>WS: wsGateway.broadcast('lab.completed', target_user_id=userId)
    Server-->>Client: HTTP 200 OK { id, score, status, ... }
    
    WS->>StudentSessionB: Dispatches 'lab.completed' event
    StudentSessionB->>StudentSessionB: In-memory reconciliation (db.recordLabAttempt)
    StudentSessionB->>StudentSessionB: Re-renders lab badge and updated progress
```

---

## 2. Idempotency & Reward Ledger Guarantees

1. **Stable Reward Key**:
   - `reward_key = 'lab_complete:<userId>:<labSlug>'`.
   - Guaranteed unique in PostgreSQL:
     ```sql
     CREATE TABLE public.xp_ledger (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         user_id UUID NOT NULL REFERENCES public.users(id),
         reward_key VARCHAR(255) NOT NULL UNIQUE,
         amount INTEGER NOT NULL CHECK (amount >= 0),
         ...
     );
     ```
2. **Replay Semantics**:
   - Students can freely replay interactive simulations, adjust parameters, and test edge cases.
   - Every run is logged in `public.lab_attempts` with full diagnostic parameters.
   - However, practical completion XP (75 XP) is awarded **strictly once**. Subsequent runs return success but award 0 additional XP.

---

## 3. Disconnection & Error Recovery

If network disruption prevents the completion payload from reaching the server:
1. The UI catches the rejection and warns the user: `"Failed to persist lab attempt to PostgreSQL backend"`.
2. Local draft state is preserved in local storage (`savedState`).
3. When connectivity is restored, the student re-triggers submission without losing progress.
