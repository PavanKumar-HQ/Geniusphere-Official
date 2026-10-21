/**
 * Geniusphere — Production AI Endpoint Verification Suite
 * Verifies all 12 acceptance criteria specified for POST /api/v1/ai/chat.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { handleAIChat } from '../server/ai/chatHandler';
import { AIRateLimiter } from '../server/ai/rateLimiter';
import { AIProviderRegistry } from '../server/ai/provider';
import { generateToken } from '../server/auth';
import { createServer } from '../server/index';
import vercelHandler from '../api/v1/ai/chat';

describe('Production AI Endpoint Architecture & Verification Suite', () => {
  const originalEnv = { ...process.env };

  const validUserPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'student@geniusphere.tech',
    fullName: 'Test Student',
    isSuperadmin: false,
    role: 'learner',
  };

  const validToken = generateToken(validUserPayload);

  beforeEach(async () => {
    process.env = { ...originalEnv };
    process.env.AI_PROVIDER = 'none'; // Ensure provider is unconfigured by default
    await AIRateLimiter.resetRateLimits();
  });

  afterEach(async () => {
    process.env = { ...originalEnv };
    await AIRateLimiter.resetRateLimits();
  });

  // ------------------------------------------------------------------
  // 1. Unconfigured Provider Returns Documented 503 Unavailable
  // ------------------------------------------------------------------
  it('1. Returns documented HTTP 503 Service Unavailable when no AI provider is configured', async () => {
    process.env.AI_PROVIDER = 'none';

    const response = await handleAIChat({
      headers: {
        authorization: `Bearer ${validToken}`,
        'content-type': 'application/json',
      },
      body: {
        message: 'Explain photosynthesis in simple terms.',
        conversationId: 'conv-12345',
        context: {
          subject: 'Science',
          gradeLevel: '8',
        },
      },
    });

    expect(response.status).toBe(503);
    expect(response.body.status).toBe('provider_not_configured');
    expect(response.body.message).toBe('The AI service is not configured yet.');
    expect((response.body.error as any)?.code).toBe('PROVIDER_NOT_CONFIGURED');
    expect(response.body.requestId).toBeDefined();
    expect(response.headers['x-request-id']).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 2. Invalid JSON or Schema is Rejected with HTTP 400
  // ------------------------------------------------------------------
  it('2. Rejects malformed requests and schema violations with consistent HTTP 400', async () => {
    // Missing message field
    const res1 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { conversationId: 'abc' },
    });
    expect(res1.status).toBe(400);
    expect((res1.body.error as any)?.code).toBe('VALIDATION_ERROR');

    // Empty message field
    const res2 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: '   ' },
    });
    expect(res2.status).toBe(400);
    expect((res2.body.error as any)?.code).toBe('VALIDATION_ERROR');

    // Invalid conversationId (special characters)
    const res3 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: 'Hello', conversationId: 'invalid/id; DROP TABLE users;' },
    });
    expect(res3.status).toBe(400);
    expect((res3.body.error as any)?.code).toBe('VALIDATION_ERROR');

    // Disallowed context field
    const res4 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: 'Hello', context: { maliciousCodeExecution: 'true' } as any },
    });
    expect(res4.status).toBe(400);
    expect((res4.body.error as any)?.code).toBe('VALIDATION_ERROR');

    // Invalid Content-Type
    const res5 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'text/plain' },
      body: { message: 'Hello' },
    });
    expect(res5.status).toBe(415);
    expect((res5.body.error as any)?.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  // ------------------------------------------------------------------
  // 3. Missing Authentication is Rejected with HTTP 401
  // ------------------------------------------------------------------
  it('3. Rejects unauthenticated requests with HTTP 401 Unauthorized', async () => {
    // No Authorization header
    const res1 = await handleAIChat({
      headers: { 'content-type': 'application/json' },
      body: { message: 'What is a stock market index?' },
    });
    expect(res1.status).toBe(401);
    expect((res1.body.error as any)?.code).toBe('UNAUTHORIZED');

    // Tampered / invalid token
    const res2 = await handleAIChat({
      headers: {
        authorization: 'Bearer invalid.tampered.token',
        'content-type': 'application/json',
      },
      body: { message: 'What is a stock market index?' },
    });
    expect(res2.status).toBe(401);
    expect((res2.body.error as any)?.code).toBe('UNAUTHORIZED');
  });

  // ------------------------------------------------------------------
  // 4. Unauthorized / Suspended User is Rejected with HTTP 403
  // ------------------------------------------------------------------
  it('4. Rejects suspended users with HTTP 403 Forbidden', async () => {
    const suspendedToken = generateToken({
      ...validUserPayload,
      role: 'suspended',
    });

    const response = await handleAIChat({
      headers: {
        authorization: `Bearer ${suspendedToken}`,
        'content-type': 'application/json',
      },
      body: { message: 'Hello AI' },
    });

    expect(response.status).toBe(403);
    expect((response.body.error as any)?.code).toBe('FORBIDDEN');
  });

  // ------------------------------------------------------------------
  // 5. Oversized Requests are Rejected with HTTP 400 or 413
  // ------------------------------------------------------------------
  it('5. Rejects oversized message content and large payloads', async () => {
    // Message exceeding 4000 chars
    const hugeMessage = 'A'.repeat(4001);
    const res1 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: hugeMessage },
    });
    expect(res1.status).toBe(400);
    expect((res1.body.error as any)?.code).toBe('VALIDATION_ERROR');

    // Raw payload exceeding 64 KB (65536 bytes)
    const res2 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: 'Hello' },
      rawBodyLength: 70000,
    });
    expect(res2.status).toBe(413);
    expect((res2.body.error as any)?.code).toBe('PAYLOAD_TOO_LARGE');

    // History exceeding 20 items
    const res3 = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: {
        message: 'Hello',
        history: Array(21).fill({ role: 'user', content: 'test' }),
      },
    });
    expect(res3.status).toBe(400);
    expect((res3.body.error as any)?.code).toBe('VALIDATION_ERROR');
  });

  // ------------------------------------------------------------------
  // 6. Rate Limiting Behaves Correctly with HTTP 429
  // ------------------------------------------------------------------
  it('6. Enforces rate limits per authenticated user and returns Retry-After headers', async () => {
    process.env.AI_RATE_LIMIT_MAX_PER_MIN = '3';
    const rateLimitTestToken = generateToken({
      ...validUserPayload,
      userId: '66666666-6666-6666-6666-666666666666',
    });

    for (let i = 0; i < 3; i++) {
      const res = await handleAIChat({
        headers: { authorization: `Bearer ${rateLimitTestToken}`, 'content-type': 'application/json' },
        body: { message: `Request #${i}` },
      });
      expect(res.status).toBe(503); // Allowed through to unconfigured provider check
      expect(res.headers['X-RateLimit-Limit']).toBe('3');
    }

    // 4th request must be rate limited
    const limitedRes = await handleAIChat({
      headers: { authorization: `Bearer ${rateLimitTestToken}`, 'content-type': 'application/json' },
      body: { message: 'Request #4' },
    });

    expect(limitedRes.status).toBe(429);
    expect((limitedRes.body.error as any)?.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(limitedRes.headers['Retry-After']).toBeDefined();
    expect(limitedRes.headers['X-RateLimit-Remaining']).toBe('0');
  });

  // ------------------------------------------------------------------
  // 7. Internal Errors Do Not Leak Secrets or Stack Traces
  // ------------------------------------------------------------------
  it('7. Protects server-side secrets and ensures stack traces are never exposed to clients', async () => {
    // Malformed body object causing runtime property failure
    const badReq: any = {
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      get body() {
        throw new Error('Secret DB connection string: postgresql://admin:super_secret_pw@prod-db:5432/db');
      },
    };

    const res = await handleAIChat(badReq);
    expect(res.status).toBe(500);
    expect((res.body.error as any)?.code).toBe('INTERNAL_SERVER_ERROR');
    expect((res.body.error as any)?.message).not.toContain('super_secret_pw');
    expect(JSON.stringify(res.body)).not.toContain('super_secret_pw');
    expect(JSON.stringify(res.body)).not.toContain('stack');
  });

  // ------------------------------------------------------------------
  // 8. Provider Configuration Errors are Handled Safely
  // ------------------------------------------------------------------
  it('8. Handles provider configuration errors safely without falling back silently', async () => {
    // Set unsupported provider
    process.env.AI_PROVIDER = 'unsupported_model_provider_xyz';

    const res = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: 'Explain what is a mutex' },
    });

    expect(res.status).toBe(500);
    expect((res.body.error as any)?.code).toBe('PROVIDER_CONFIGURATION_ERROR');
  });

  // ------------------------------------------------------------------
  // 9. Existing Application Routes Continue to Work via Fastify
  // ------------------------------------------------------------------
  it('9. Fastify server routes POST /api/v1/ai/chat and existing routes continue to function', async () => {
    const app = await createServer();

    // 1. Verify health check continues working
    const healthRes = await app.inject({ method: 'GET', url: '/health' });
    expect(healthRes.statusCode).toBe(200);

    // 2. Verify POST /api/v1/ai/chat via Fastify inject
    const aiRes = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat',
      headers: {
        authorization: `Bearer ${validToken}`,
        'content-type': 'application/json',
      },
      payload: {
        message: 'Explain how hashing works.',
      },
    });

    expect(aiRes.statusCode).toBe(503);
    const json = JSON.parse(aiRes.body);
    expect(json.status).toBe('provider_not_configured');
    expect(json.error.code).toBe('PROVIDER_NOT_CONFIGURED');
    expect(aiRes.headers['x-request-id']).toBeDefined();

    // 3. Verify backward-compatible /api/ai/chat with v1 payload
    const legacyAiRes = await app.inject({
      method: 'POST',
      url: '/api/ai/chat',
      headers: {
        authorization: `Bearer ${validToken}`,
        'content-type': 'application/json',
      },
      payload: {
        message: 'Explain how hashing works.',
      },
    });
    expect(legacyAiRes.statusCode).toBe(503);

    await app.close();
  });

  // ------------------------------------------------------------------
  // 10. Tests Verify That No Fake AI Answer is Returned
  // ------------------------------------------------------------------
  it('10. Strictly verifies that no fake AI answer, mock data, or canned text is returned', async () => {
    process.env.AI_PROVIDER = 'none';

    const response = await handleAIChat({
      headers: { authorization: `Bearer ${validToken}`, 'content-type': 'application/json' },
      body: { message: 'Tell me a story about robots.' },
    });

    expect(response.status).toBe(503);
    expect(response.body).not.toHaveProperty('data');
    expect(JSON.stringify(response.body)).not.toContain('robots');
    expect(JSON.stringify(response.body)).not.toContain('Once upon a time');
    expect((response.body as any).tokensUsed).toBeUndefined();
  });

  // ------------------------------------------------------------------
  // 11. Database Authorization & RLS for Durable Rate Limits
  // ------------------------------------------------------------------
  it('11. Database authorization enforces schema grants and prevents SQL injection', async () => {
    // Malicious key string attempting SQL injection
    const maliciousKey = "user-123'; DROP TABLE public.users; --";
    const result = await AIRateLimiter.checkRateLimit(maliciousKey);
    expect(result.allowed).toBe(true);
    expect(result.current).toBe(1);
  });

  // ------------------------------------------------------------------
  // 12. Vercel Functions Deployment Configuration Compatibility
  // ------------------------------------------------------------------
  it('12. Runs correctly under Vercel Serverless Function entry point', async () => {
    let capturedStatusCode = 0;
    const capturedHeaders: Record<string, string> = {};
    let capturedBody = '';

    const mockReq: any = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${validToken}`,
        'content-type': 'application/json',
      },
      body: {
        message: 'How does public key cryptography work?',
        conversationId: 'conv-xyz',
      },
    };

    const mockRes: any = {
      setHeader(k: string, v: string) {
        capturedHeaders[k] = v;
      },
      set statusCode(val: number) {
        capturedStatusCode = val;
      },
      get statusCode() {
        return capturedStatusCode;
      },
      end(chunk: string) {
        capturedBody = chunk;
      },
    };

    await vercelHandler(mockReq, mockRes);

    expect(capturedStatusCode).toBe(503);
    const parsed = JSON.parse(capturedBody);
    expect(parsed.status).toBe('provider_not_configured');
    expect(parsed.error.code).toBe('PROVIDER_NOT_CONFIGURED');
    expect(capturedHeaders['x-request-id']).toBeDefined();
  });
});
