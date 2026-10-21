# Geniusphere Architecture: End-to-End Data Flow

This document details the lifecycle, validation boundaries, and persistence pipelines of data across the Geniusphere platform.

---

## 1. High-Level Communication Architecture

```mermaid
flowchart TD
    Client["Client Browser\n(React 19 + TypeScript + Vite)"]
    Fastify["Fastify 5 Backend API\n(Port 3001)"]
    VercelFn["Vercel Serverless Function\n(/api/v1/ai/chat)"]
    WSS["Fastify WebSocket Gateway\n(/api/ws)"]
    Postgres["PostgreSQL Database\n(Authoritative Store)"]
    AIProvider["AI Service Providers\n(Gemini API / Local Ollama)"]

    Client -->|"HTTP/JSON with JWT Bearer"| Fastify
    Client -->|"Direct Serverless Invocation"| VercelFn
    Client <-->|"Full-Duplex WS (JSON Action/Event)"| WSS
    Fastify -->|"Parameterized Queries / RLS"| Postgres
    Fastify -->|"Private Outbound HTTPS/HTTP"| AIProvider
    VercelFn -->|"Private Outbound HTTPS/HTTP"| AIProvider
```

---

## 2. Authentication & Session Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / Learner
    participant UI as Browser (React App)
    participant Auth as Fastify Auth API (/api/auth)
    participant DB as PostgreSQL (users table)
    participant WSS as WebSocket Gateway

    Student->>UI: Enters Email & Password
    UI->>Auth: POST /api/auth/login { email, password }
    Auth->>DB: SELECT * FROM users WHERE email = $1
    DB-->>Auth: User record (bcrypt hash, role, suspension status)
    Note over Auth: Verify bcrypt password hash.<br/>Verify is_suspended = false.
    Auth-->>UI: 200 OK { token: JWT, user: { userId, email, role, isSuperadmin } }
    UI->>UI: Store token in secure client memory/storage
    UI->>WSS: Connect ws://localhost:3001/api/ws?token=JWT
    WSS->>WSS: verifyToken(JWT) -> Bind session to user_{userId} channel
    WSS-->>UI: { type: 'authenticated', userId }
```

### Authorization Boundaries:
1. **Bearer Token Verification:** All protected Fastify routes execute `verifyToken(token)` before reaching controller handlers.
2. **Suspension Check:** Suspended accounts are immediately rejected with `HTTP 403 Forbidden` (`ACCOUNT_SUSPENDED`).
3. **Role-Based Guards:** Administrative operations (`isSuperadmin: true`) are verified server-side; hiding client UI controls is never considered sufficient authorization.

---

## 3. Learning Progress & Real-Time Sync Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner (Browser Tab 1)
    participant UI1 as Tab 1 (LessonPlayer / SharedWorkspace)
    participant API as Fastify API (/api/progress)
    participant DB as PostgreSQL (enrollments, user_progress)
    participant WSS as WebSocket Hub
    participant UI2 as Tab 2 / Mobile Device (Browser Tab 2)

    Learner->>UI1: Completes Lab Step / Lesson Quiz
    UI1->>UI1: Optimistic UI update (progress meter, achievement preview)
    UI1->>API: POST /api/progress/complete-lesson { courseId, lessonId, xpGained }
    Note over API: Authenticate JWT; validate lessonId exists in course.<br/>Idempotent write check.
    API->>DB: INSERT / UPDATE user_progress ON CONFLICT DO UPDATE
    DB-->>API: Confirmed persisted progress record
    API->>WSS: Broadcast to channel `user_${userId}`: { type: 'LESSON_COMPLETED', lessonId, xp }
    API-->>UI1: 200 OK { status: 'success', progressPercent, xp }
    WSS-->>UI2: { type: 'LESSON_COMPLETED', lessonId, xp }
    UI2->>UI2: Re-render state synchronously across devices
```

### Integrity Controls:
- **Idempotency:** Repeated clicks or network retries check for existing completed state before awarding XP or certificates.
- **Offline / Disconnect Behavior:** If the network drops during save, the client marks progress as `pending_sync`, displays an honest warning badge, and retries with backoff. It **never** displays a false "Server Confirmed" indicator while unconfirmed.

---

## 4. Production AI Service Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Learner / Educator
    participant UI as Chat Assistant UI
    participant Handler as Centralized AI Handler (chatHandler.ts)
    participant RateLimiter as In-Memory Token Bucket Limiter
    participant Registry as AIProviderRegistry
    participant Ollama as Local Ollama / Gemini API

    User->>UI: Types Question & Clicks Send
    UI->>Handler: POST /api/v1/ai/chat { message, conversationId, context, history }
    Handler->>Handler: Generate / Validate X-Request-ID correlation header
    Handler->>Handler: Validate Content-Type: application/json
    Handler->>Handler: Authenticate Bearer JWT & Check User Status
    Handler->>Handler: Validate Schema (Length bounds, context keys, history depth)
    Handler->>RateLimiter: Check rate limit for user (20 req/min)
    alt Rate Limit Exceeded
        RateLimiter-->>UI: 429 Too Many Requests (Retry-After header)
    else Rate Limit OK
        Handler->>Registry: AIProviderRegistry.getProvider()
        alt Provider is 'none' / Unconfigured
            Registry-->>UI: 503 Service Unavailable (PROVIDER_NOT_CONFIGURED)
        else Provider is 'ollama' or 'gemini'
            Handler->>Ollama: POST /api/chat with timeout AbortController (15s/30s)
            alt Connection Timeout / Offline
                Ollama-->>UI: 504 Gateway Timeout or 502 Bad Gateway
            else Successful Inference
                Ollama-->>Handler: { message, model, tokensUsed }
                Handler-->>UI: 200 OK { status: 'success', data: { message, model, provider } }
            end
        end
    end
```

### Educational Simulator vs. Real AI Boundary
| Capability | Educational AI Simulator (`AILabFull.tsx`) | Production AI Service (`/api/v1/ai/chat`) |
| :--- | :--- | :--- |
| **Execution Realm** | 100% Client-Side In-Browser Engine | Server-Side Fastify / Vercel API Gateway |
| **Underlying Logic** | Deterministic illustrative math (`educationalAiMath.ts`) | Real configured LLM (Google Gemini or Local Ollama) |
| **Truth-in-Labeling** | Explicitly labeled as an educational simulator | Real LLM responses with provider/model metadata |
| **Failure Mode** | Safe UI fallback via `LabErrorBoundary` | HTTP 502/503/504 with structured error envelope |
| **Database Access** | None | Read-only context; no direct write to user XP or grades |

---

## 5. Mobile Orientation & Layout Data Flow

```mermaid
flowchart TD
    Mount["Lab Component Mounts"]
    CheckParent{"Enclosed in existing\nLabOrientationGuard?"}
    Mount --> CheckParent

    CheckParent -->|"Yes (isGuardActive=true)"| Bypass["Delegate to Parent Guard\n(Do not render nested duplicate overlay)"]
    CheckParent -->|"No (Root Guard)"| CheckSession{"sessionStorage portrait\nbypass active for session?"}

    CheckSession -->|"Yes"| Render["Render Lab Interface directly in Portrait Fallback"]
    CheckSession -->|"No"| Listen["Register resize & orientationchange listeners"]

    Listen --> Evaluate{"Viewport < 768px\nAND Height > Width?"}
    Evaluate -->|"No (Landscape or Tablet/Desktop)"| Render
    Evaluate -->|"Yes (Constrained Phone Portrait)"| Modal["Display Orientation Guidance Modal"]

    Modal --> Action{"Student Action"}
    Action -->|"Clicks 'Rotate & Fullscreen'"| Fullscreen["Invoke requestFullscreen() + screen.orientation.lock('landscape')"]
    Action -->|"Clicks 'Continue in Portrait'"| SaveBypass["Save to sessionStorage & bypass for session"]
    Action -->|"Physically Rotates Device"| AutoDismiss["Listener detects width > height -> Auto-dismiss modal"]
```
