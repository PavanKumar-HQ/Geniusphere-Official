import { describe, it, expect } from 'vitest';
import { HybridAIGateway } from '../server/services/aiGateway';

describe('Hybrid AI Gateway & Data Privacy Verification', () => {
  // Test 1: Data Privacy & PII Redaction Guardrail
  it('1. Redacts sensitive student PII (emails, passwords, UUIDs) before payload delivery', () => {
    const gateway = new HybridAIGateway({ enforcePrivacyRedaction: true });
    
    const inputWithPii = 'Student student.name@geniusphere.tech with password: SuperSecretPassword123 and id 12345678-1234-1234-1234-123456789abc asked a question.';
    const redacted = gateway.redactPrivateData(inputWithPii);

    expect(redacted).not.toContain('student.name@geniusphere.tech');
    expect(redacted).toContain('[REDACTED_EMAIL]');
    expect(redacted).not.toContain('SuperSecretPassword123');
    expect(redacted).toContain('[REDACTED]');
    expect(redacted).not.toContain('12345678-1234-1234-1234-123456789abc');
    expect(redacted).toContain('[REDACTED_UUID]');
  });

  // Test 2: Truthful Status & Configuration Reporting
  it('2. Truthfully reports operational status, active concurrency, and configured routing policy', () => {
    const gateway = new HybridAIGateway({
      policy: 'prefer_local_fallback_hosted',
      maxConcurrency: 8,
      localModel: 'llama3:8b',
    });

    const status = gateway.getStatus();
    expect(status.status).toBe('operational');
    expect(status.policy).toBe('prefer_local_fallback_hosted');
    expect(status.maxConcurrency).toBe(8);
    expect(status.activeRequests).toBe(0);
    expect(status.local.model).toBe('llama3:8b');
  });

  // Test 3: Local Only Policy Failure Handling
  it('3. Returns truthful error status when local provider is offline and policy is local_only', async () => {
    const gateway = new HybridAIGateway({
      policy: 'local_only',
      localEndpoint: 'http://127.0.0.1:59999', // Non-existent offline port
      timeoutMs: 1500,
    });

    await expect(
      gateway.generateCompletion({
        userId: 'test-user',
        userPrompt: 'Explain how compound interest works',
      })
    ).rejects.toThrow();
  });

  // Test 4: Hosted Only Policy Missing Key Handling
  it('4. Rejects request with truthful error when hosted provider API key is missing', async () => {
    const gateway = new HybridAIGateway({
      policy: 'hosted_only',
      hostedProvider: 'gemini',
      hostedApiKey: '', // Explicitly missing key
    });

    await expect(
      gateway.generateCompletion({
        userId: 'test-user',
        userPrompt: 'What is a stock order book?',
      })
    ).rejects.toThrow(/Hosted AI API key is not configured/);
  });
});
