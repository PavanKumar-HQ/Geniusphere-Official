# Geniusphere Cross-Language Communication Contracts

This document formalizes the runtime schemas, transport protocols, validation requirements, and failure envelopes governing communication across language boundaries.

---

## 1. Boundary 1: Client (React / TypeScript) $\leftrightarrow$ Backend (Fastify / TypeScript)

### Endpoint: `POST /api/v1/ai/chat`

#### Transport & Network:
- Protocol: HTTPS
- Headers:
  - `Content-Type: application/json` (Mandatory, 415 rejected otherwise)
  - `Authorization: Bearer <jwt_token>` (Mandatory, 401 rejected otherwise)
  - `x-request-id: <string>` (Optional client correlation ID, max 128 chars `[a-zA-Z0-9_-]+`; generated if missing)
- Payload Limit: 64 KB (413 Payload Too Large)
- Rate Limit: 20 requests per minute per user (429 Too Many Requests, returns `Retry-After` header)
- Timeout: 15,000ms (504 Gateway Timeout on expiry)

#### Request Schema:
```json
{
  "message": "string (1 - 4000 chars, required)",
  "conversationId": "string (optional, alphanumeric, max 100 chars)",
  "context": {
    "subject": "string (optional, max 100 chars)",
    "gradeLevel": "string (optional, max 100 chars)",
    "topicId": "string (optional, max 100 chars)",
    "courseId": "string (optional, max 100 chars)",
    "lessonId": "string (optional, max 100 chars)"
  },
  "history": [
    {
      "role": "'user' | 'assistant' (required)",
      "content": "string (1 - 4000 chars, max 20 messages)"
    }
  ]
}
```

#### Success Response Schema (`200 OK`):
```json
{
  "requestId": "uuid-string",
  "status": "success",
  "data": {
    "message": "string (the generated educational response)",
    "conversationId": "string | null",
    "model": "string (e.g. 'gemini-1.5-flash' or 'llama3.2')",
    "provider": "'gemini' | 'ollama'",
    "tokensUsed": "number (optional)"
  }
}
```

#### Standard Error Envelope (All 4xx / 5xx codes):
```json
{
  "requestId": "uuid-string",
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | RATE_LIMIT_EXCEEDED | PROVIDER_NOT_CONFIGURED | BAD_GATEWAY | GATEWAY_TIMEOUT | INTERNAL_SERVER_ERROR",
    "message": "Human-readable description without stack traces",
    "details": "optional structured metadata"
  }
}
```

---

## 2. Boundary 2: Backend (Fastify) $\leftrightarrow$ AI Providers (Ollama / Gemini)

### Ollama Private HTTP Contract:
- Host: `process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'` (Private internal Docker or local daemon network)
- Security: Never exposed to public internet.

#### A. Health Probe (`GET /api/tags`):
- Timeout: 2,500ms
- Response Parsing: `{ "models": [{ "name": "llama3.2" }] }`
- Failure Behavior: Returns `{ "available": false, "error": "..." }`; never throws uncaught exceptions.

#### B. Chat Generation (`POST /api/chat`):
- Timeout: Configurable via `AI_REQUEST_TIMEOUT_MS` (default 30,000ms for local Ollama, 15,000ms for Gemini)
- Payload:
```json
{
  "model": "llama3.2",
  "messages": [
    { "role": "system", "content": "Pedagogical tutor instructions..." },
    { "role": "user", "content": "..." }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7
  }
}
```
- Failure Behavior: Returns HTTP 502 Bad Gateway if Ollama daemon returns error; returns HTTP 504 Gateway Timeout if request times out. Strictly zero mock or fake text returned.

---

## 3. Boundary 3: Backend (Fastify) $\leftrightarrow$ Database (PostgreSQL / SQL)

### Security & Invariant Rules:
1. **Parameterized Queries:** Every dynamic parameter passed to `server/db.ts:query(text, params)` must use positional parameters (`$1, $2, ...`). Direct string concatenation into SQL statements is prohibited.
2. **Transaction Scopes:** Multi-table mutations (e.g., student course completion with XP award and outbox event) must execute via `withTransaction(async (client) => { ... })`. If any statement fails, the entire transaction rolls back atomically.
3. **Database Grants & RLS:**
   - Web application roles connect as `geniusphere_app` without superuser privileges.
   - Row-level security (RLS) is enabled on `public.courses`, `public.enrollments`, `public.user_progress`, `public.submissions`, and `public.audit_events`.
   - Learners can only SELECT and UPDATE their own records (`auth.uid() = user_id`).
   - Teachers can only inspect records of students enrolled in their assigned classrooms.

---

## 4. Boundary 4: Analytical Tooling (Python) $\leftrightarrow$ Application & Telemetry Records

### Module: `tools/polyglot/educational_analytics.py`

#### A. Psychometric Item Analysis Contract:
```python
def calculate_item_analysis(
    item_id: str,
    student_scores: List[Tuple[float, bool]]
) -> ItemAnalysisResult
```
- Inputs:
  - `item_id`: Unique identifier of the quiz item.
  - `student_scores`: List of `(total_quiz_percentage, item_answered_correctly)`.
- Output Dataclass:
  - `difficulty_index`: $p$-value ($0.0 \le p \le 1.0$).
  - `discrimination_index`: $D$-index ($-1.0 \le D \le 1.0$).
  - `classification`: Evaluated against Kelley's 27% upper/lower group standard.
  - `flagged_for_review`: Boolean trigger if $D < 0.15$ or $p < 0.20$.

#### B. Student Mastery Curve Fit Contract:
```python
def fit_mastery_curve(session_scores: List[float]) -> MasteryCurveFit
```
- Model: $M(t) = 1 - e^{-k \cdot t}$ (exponential learning curve).
- Clamping: Scores strictly clamped within $[0.01, 0.99]$ to avoid logarithmic singularity.
- Output Dataclass:
  - `learning_rate_k`: Fitted rate constant $k$.
  - `projected_sessions_to_mastery`: Integer count of sessions to achieve $\ge 90\%$ mastery.
  - `r_squared`: Goodness of fit ($R^2$).
  - `current_estimated_mastery`: Estimated mastery percentage.

---

## 5. Boundary 5: AI Capability Evaluator (Python) $\leftrightarrow$ Model Auditing

### Module: `tools/polyglot/ai_model_evaluator.py`

#### Evaluation Pipeline:
```python
def evaluate_inference_sample(
    model_name: str,
    provider: str,
    response_text: str,
    latency_ms: float,
    target_grade_level: str = "8"
) -> ModelEvaluationReport
```

#### Security Guardrail Enforcement:
1. **System Prompt & Credential Protection:** Regex scanning for `DATABASE_URL`, `JWT_SECRET`, PostgreSQL connection strings, and API keys. If detected, `injection_defense_passed` evaluates to `False`.
2. **PII Redaction Audit:** Scans for unredacted email addresses, SSN numbers, or credit card formats. If detected, `pii_leakage_detected` evaluates to `True`.
3. **Pedagogical Rubric:** Evaluates clarity (average sentence length), conciseness (40–250 words optimal), and supportive tone.
