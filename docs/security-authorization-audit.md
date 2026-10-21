# Geniusphere Security & Authorization Audit

> **Target Release Environment**: Production Multi-Tenant STEM Learning Platform  
> **Security Boundaries**: Cryptographic JWT Authentication, Strict IDOR Defenses, PostgreSQL Row Level Security (RLS)  
> **Audit Status**: **VERIFIED SECURE**  
> **Test Evidence**: `tests/rls-authorization.test.ts`, `tests/production-acceptance.test.ts` (Scenario A, E), `tests/production-integration.test.ts` (Test 2, 5, 6)  

---

## 1. Authentication & Session Security

### 1.1 Cryptographic Identity Derivation
- All protected endpoints verify an HMAC-SHA256 JSON Web Token (`Bearer <token>`) via `server/auth.ts`.
- The token payload strictly defines:
  ```ts
  export interface UserSessionPayload {
    userId: string;
    email: string;
    fullName: string;
    isSuperadmin: boolean;
    role: 'learner' | 'teacher' | 'institution_admin' | 'parent';
  }
  ```
- Identity is derived server-side from `request.user!.userId`. Client-supplied user identifiers in headers or request bodies are strictly rejected or ignored.

### 1.2 Tamper Resistance & Signature Verification
- In `tests/production-integration.test.ts` (Test 2), token tampering (altering payload or signature bytes) was subjected to cryptographic verification.
- Tampered tokens are immediately rejected with `HTTP 401 Unauthorized`.
- In `tests/production-acceptance.test.ts` (Scenario E), unauthenticated or forged requests fail before reaching domain logic.

---

## 2. Authorization & Multi-Tenant IDOR Defenses

### 2.1 Insecure Direct Object Reference (IDOR) Protection
A common vulnerability in educational software is when Student A alters an account parameter or URL from `/api/progress/student-a` to `/api/progress/student-b` to inspect another student's grades or personal info.

In Geniusphere:
1. `/api/progress/:userId` explicitly validates:
   ```ts
   if (request.user!.userId !== userId && !request.user!.isSuperadmin) {
     return reply.status(403).send({
       error: 'Forbidden',
       message: 'You are not authorized to access progress records for another student.'
     });
   }
   ```
2. In `tests/production-acceptance.test.ts` (Scenario A), an authenticated learner attempting to query another learner's progress receives an explicit `HTTP 403 Forbidden` response.

### 2.2 Role-Based Access Control (RBAC) & Teacher Boundaries
1. **Assignment Grading Authorization**:
   - `/api/submissions/:id/grade` requires the caller to hold the role of `teacher` or `superadmin`.
   - In `tests/production-integration.test.ts` (Test 5), a learner attempting to call `gradeSubmission` throws an unauthorized error.
   - In Test 6, an authorized teacher assigned to the classroom grades the submission successfully and emits an authenticated outbox event.

---

## 3. Defense-in-Depth: PostgreSQL Row Level Security (RLS)

Even if application-layer checks were bypassed, PostgreSQL enforces isolation at the database engine level via RLS policies (`supabase/migrations/20261017000003_rls_helpers_and_policies.sql`):

```sql
CREATE POLICY "Users can only view their own progress" 
ON public.user_progress FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can only view their own completions" 
ON public.lesson_completions FOR SELECT 
USING (user_id = auth.uid());
```

In `tests/rls-authorization.test.ts`, 22 unit tests verify that queries executed with a student's session cannot see rows belonging to any other user.
