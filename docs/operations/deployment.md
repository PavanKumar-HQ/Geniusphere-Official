# Geniusphere Production Operations & Deployment Guide

This guide details configuration, deployment pipelines, environment variables, diagnostic health checks, and rollback procedures for the Geniusphere platform.

---

## 1. System Architecture & Deployment Topology

Geniusphere consists of three deployment surfaces:

1. **Frontend Client Application (Vite / React 19 / TypeScript):**
   - Built to static assets via `npm run build` (`dist/`).
   - Hosted on Vercel, Netlify, Cloudflare Pages, or Nginx.
2. **Backend API & Real-Time Gateway (Fastify 5 / TypeScript):**
   - Deployed as a Node.js process (Port 3001) via Docker or container runtime.
   - Hosts REST endpoints, WebSocket hub (`/api/ws`), authentication, and PostgreSQL connection pool.
3. **Serverless AI Function (Vercel Serverless Function):**
   - Endpoint: `/api/v1/ai/chat` (implemented via `api/v1/ai/chat.ts` importing centralized `server/ai/chatHandler.ts`).
   - Operates statelessly with token-bucket rate limiting and upstream LLM proxying.

---

## 2. Environment Variables Specification

| Variable Name | Required | Default | Purpose / Allowed Values | Security Tier |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `development` | `development`, `production`, `test` | Public |
| `PORT` | No | `3001` | Fastify HTTP port | Internal |
| `HOST` | No | `0.0.0.0` | Fastify bind interface | Internal |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (`postgresql://...`) | **Secret** |
| `JWT_SECRET` | Yes | — | Min 32-character secret for signing student session tokens | **Secret** |
| `AI_PROVIDER` | No | `none` | `none`, `gemini`, `ollama` | Internal |
| `AI_API_KEY` | Conditional | — | API key when `AI_PROVIDER=gemini` | **Secret** |
| `AI_MODEL` | No | `gemini-1.5-flash` / `llama3.2` | Target LLM model name | Internal |
| `OLLAMA_HOST` | Conditional | `http://127.0.0.1:11434` | Private internal host when `AI_PROVIDER=ollama` | Internal |
| `AI_REQUEST_TIMEOUT_MS` | No | `15000` | In-flight AI request timeout limit in milliseconds | Internal |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed origin header for API requests | Internal |

> [!CAUTION]
> Never prefix server secrets (`DATABASE_URL`, `JWT_SECRET`, `AI_API_KEY`) with `VITE_`. Doing so will bake secrets directly into client-side JavaScript bundles.

---

## 3. Database Migration & Initialization

Geniusphere uses standard idempotent SQL migration scripts located in `server/migrations/`.

### Running Migrations:
```bash
# Execute migrations using Node tsx runner
npm run server
```
During server startup, `server/db/index.ts` automatically verifies schema constraints, table grants, and indexes inside atomic PostgreSQL transactions.

### Verifying Migrations in Vitest:
```bash
npx vitest run tests/migrations.test.ts
```

---

## 4. Production Build & Validation Workflow

Execute the full build pipeline locally or in CI/CD:

```bash
# 1. Typecheck and build frontend bundle
npm run build

# 2. Run comprehensive test suite (431 tests)
npm test

# 3. Verify AI endpoint contract and rate limiting
npx vitest run tests/ai-endpoint.test.ts

# 4. Verify cross-system edge cases
npx vitest run tests/cross-system-edge-cases.test.tsx
```

---

## 5. Health Checks & Diagnostic Probing

### 1. General System Health
- **Endpoint:** `GET /api/health`
- **Expected Status:** `200 OK`
- **Payload:**
```json
{
  "status": "healthy",
  "database": "connected",
  "uptimeSeconds": 3412,
  "timestamp": "2026-10-21T10:30:00.000Z"
}
```

### 2. AI Service Health & Connectivity
- When `AI_PROVIDER=none`: POST `/api/v1/ai/chat` returns documented `HTTP 503` (`PROVIDER_NOT_CONFIGURED`).
- When `AI_PROVIDER=ollama`: `OllamaProvider.checkAvailability()` performs a fast probe against `${OLLAMA_HOST}/api/tags` to verify connectivity without consuming model tokens.
- When `AI_PROVIDER=gemini`: Reaches Google Gemini API securely via server-side fetch with `AI_API_KEY`.

---

## 6. Observability, Logging, and Redaction

- **Structured Logs:** All incoming AI requests log a unique `x-request-id` correlation token, user ID, status code, and latency in milliseconds.
- **PII & Token Masking:** Passwords, JWT tokens, email addresses, and student UUIDs are automatically scrubbed by `AILogger` and `HybridAIGateway.redactPrivateData()`.
- **Zero Stack Traces in Production:** When exceptions occur in server handlers, the response returns standard JSON error envelopes (`INTERNAL_SERVER_ERROR`, `BAD_GATEWAY`). Raw internal stack traces are suppressed.

---

## 7. Rollback & Disaster Recovery Procedures

1. **Frontend Rollback:**
   - On Vercel / Netlify / Cloudflare Pages: Instant deployment revert to the previous verified commit SHA.
2. **Database Rollback:**
   - Database migrations use non-destructive column additions and backward-compatible constraints.
   - If a migration fails during deployment, the enclosing transaction rolls back automatically without partial schema corruption.
3. **AI Fallback:**
   - If upstream AI provider degrades or is unreachable, setting `AI_PROVIDER=none` cleanly disables the endpoint with documented HTTP 503 messages, preventing downstream gateway timeouts. Educational simulations continue running smoothly on the client.
