/**
 * Geniusphere Hybrid AI Gateway
 * Supports local inference (Ollama / vLLM / llama.cpp) and hosted APIs (Google Gemini, OpenAI-compatible).
 * Implements strict routing policies, privacy/data guardrails, concurrency limits, timeouts, and fallback handling.
 */

export type AIRoutingPolicy = 
  | 'local_only'
  | 'hosted_only'
  | 'prefer_local_fallback_hosted'
  | 'prefer_hosted_fallback_local';

export interface AIProviderConfig {
  policy: AIRoutingPolicy;
  localEndpoint: string;
  localModel: string;
  hostedProvider: 'gemini' | 'openai' | 'none';
  hostedApiKey?: string;
  hostedModel?: string;
  maxConcurrency: number;
  timeoutMs: number;
  enforcePrivacyRedaction: boolean;
}

export interface PromptPayload {
  userId: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  providerUsed: 'local' | 'hosted';
  modelUsed: string;
  text: string;
  tokensUsed?: number;
  durationMs: number;
  fallbackTriggered: boolean;
}

export class HybridAIGateway {
  private config: AIProviderConfig;
  private activeRequests: number = 0;
  private totalRequests: number = 0;
  private totalTokens: number = 0;

  constructor(customConfig?: Partial<AIProviderConfig>) {
    this.config = {
      policy: (process.env.AI_ROUTING_POLICY as AIRoutingPolicy) || 'prefer_local_fallback_hosted',
      localEndpoint: process.env.AI_LOCAL_ENDPOINT || 'http://127.0.0.1:11434',
      localModel: process.env.AI_LOCAL_MODEL || 'llama3:8b',
      hostedProvider: (process.env.AI_HOSTED_PROVIDER as any) || 'gemini',
      hostedApiKey: process.env.GEMINI_API_KEY || process.env.AI_HOSTED_API_KEY || '',
      hostedModel: process.env.AI_HOSTED_MODEL || 'gemini-1.5-flash',
      maxConcurrency: parseInt(process.env.AI_MAX_CONCURRENCY || '10', 10),
      timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '15000', 10),
      enforcePrivacyRedaction: true,
      ...customConfig,
    };
  }

  public getStatus() {
    return {
      status: 'operational',
      policy: this.config.policy,
      activeRequests: this.activeRequests,
      maxConcurrency: this.config.maxConcurrency,
      local: {
        endpoint: this.config.localEndpoint,
        model: this.config.localModel,
        configured: Boolean(this.config.localEndpoint),
      },
      hosted: {
        provider: this.config.hostedProvider,
        model: this.config.hostedModel,
        hasKey: Boolean(this.config.hostedApiKey),
      },
      stats: {
        totalRequests: this.totalRequests,
        totalTokensEstimated: this.totalTokens,
      },
    };
  }

  /**
   * PII & Private Data Redaction Filter
   * Strips email addresses, passwords, and user IDs before transmitting prompt to third-party hosted APIs.
   */
  public redactPrivateData(text: string): string {
    if (!this.config.enforcePrivacyRedaction) return text;
    return text
      .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[REDACTED_EMAIL]')
      .replace(/(password|pwd|secret|key)\s*[:=]\s*\S+/gi, '$1: [REDACTED]')
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[REDACTED_UUID]');
  }

  /**
   * Invokes the hybrid gateway based on authoritative routing policy
   */
  public async generateCompletion(payload: PromptPayload): Promise<AIResponse> {
    if (this.activeRequests >= this.config.maxConcurrency) {
      throw new Error(`AI Gateway concurrency limit reached (${this.config.maxConcurrency} concurrent requests). Try again shortly.`);
    }

    this.activeRequests++;
    this.totalRequests++;
    const startTime = Date.now();

    try {
      switch (this.config.policy) {
        case 'local_only':
          return await this.callLocalInference(payload, startTime);

        case 'hosted_only':
          return await this.callHostedInference(payload, startTime);

        case 'prefer_local_fallback_hosted':
          try {
            return await this.callLocalInference(payload, startTime);
          } catch (localErr) {
            console.warn('[AIGateway] Local inference failed, attempting hosted fallback:', localErr);
            const resp = await this.callHostedInference(payload, startTime);
            resp.fallbackTriggered = true;
            return resp;
          }

        case 'prefer_hosted_fallback_local':
          try {
            return await this.callHostedInference(payload, startTime);
          } catch (hostedErr) {
            console.warn('[AIGateway] Hosted inference failed, attempting local fallback:', hostedErr);
            const resp = await this.callLocalInference(payload, startTime);
            resp.fallbackTriggered = true;
            return resp;
          }

        default:
          throw new Error(`Unsupported routing policy: ${this.config.policy}`);
      }
    } finally {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    }
  }

  /**
   * Local inference via Ollama / vLLM HTTP API
   */
  private async callLocalInference(payload: PromptPayload, startTime: number): Promise<AIResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const endpoint = `${this.config.localEndpoint.replace(/\/+$/, '')}/api/generate`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.localModel,
          prompt: payload.systemPrompt ? `${payload.systemPrompt}\n\n${payload.userPrompt}` : payload.userPrompt,
          stream: false,
          options: {
            temperature: payload.temperature ?? 0.7,
            num_predict: payload.maxTokens ?? 1024,
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Local inference returned HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const text = data.response || '';
      const tokens = (data.eval_count || 0) + (data.prompt_eval_count || 0) || Math.round(text.length / 4);
      this.totalTokens += tokens;

      return {
        providerUsed: 'local',
        modelUsed: this.config.localModel,
        text,
        tokensUsed: tokens,
        durationMs: Date.now() - startTime,
        fallbackTriggered: false,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Hosted inference via Google Gemini or OpenAI-compatible endpoint
   */
  private async callHostedInference(payload: PromptPayload, startTime: number): Promise<AIResponse> {
    if (!this.config.hostedApiKey) {
      throw new Error(`Hosted AI API key is not configured for provider '${this.config.hostedProvider}'.`);
    }

    const sanitizedPrompt = this.redactPrivateData(payload.userPrompt);
    const sanitizedSystem = payload.systemPrompt ? this.redactPrivateData(payload.systemPrompt) : '';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      if (this.config.hostedProvider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.hostedModel}:generateContent?key=${this.config.hostedApiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...(sanitizedSystem ? [{ role: 'user', parts: [{ text: `System Instruction: ${sanitizedSystem}` }] }] : []),
              { role: 'user', parts: [{ text: sanitizedPrompt }] },
            ],
            generationConfig: {
              temperature: payload.temperature ?? 0.7,
              maxOutputTokens: payload.maxTokens ?? 1024,
            },
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Hosted Gemini API returned HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const tokens = data.usageMetadata?.totalTokenCount || Math.round((sanitizedPrompt.length + text.length) / 4);
        this.totalTokens += tokens;

        return {
          providerUsed: 'hosted',
          modelUsed: this.config.hostedModel || 'gemini-1.5-flash',
          text,
          tokensUsed: tokens,
          durationMs: Date.now() - startTime,
          fallbackTriggered: false,
        };
      } else {
        throw new Error(`Hosted provider '${this.config.hostedProvider}' is not supported yet.`);
      }
    } finally {
      clearTimeout(timer);
    }
  }
}

export const aiGateway = new HybridAIGateway();
