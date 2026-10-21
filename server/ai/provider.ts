/**
 * Geniusphere AI Service — Provider Abstraction & Registry
 * Provides a clean interface boundary between the API endpoint and concrete AI providers.
 * Real AI providers will be integrated in later phases.
 */

import {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from './types';

export class ProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderConfigurationError';
  }
}

/**
 * Concrete implementation for Google Gemini provider.
 * Will be fully activated when AI_PROVIDER=gemini and AI_API_KEY is supplied.
 */
export class GeminiProvider implements AIProvider {
  public readonly id = 'gemini';
  private apiKey: string;
  private model: string;
  private timeoutMs: number;

  constructor() {
    this.apiKey = (process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
    this.model = (process.env.AI_MODEL || 'gemini-1.5-flash').trim();
    this.timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '15000', 10);

    if (!this.apiKey) {
      throw new ProviderConfigurationError(
        "Provider 'gemini' selected but AI_API_KEY is not configured."
      );
    }
  }

  public get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  public async generateChat(request: AIProviderRequest): Promise<AIProviderResponse> {
    if (!this.isConfigured) {
      throw new ProviderConfigurationError('Gemini provider is not properly configured.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const signal = request.signal || controller.signal;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        this.model
      )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

      const contents = [
        ...(request.history || []).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [
            ...(request.context
              ? [
                  {
                    text: `[Context: Subject: ${request.context.subject || 'General'}, GradeLevel: ${
                      request.context.gradeLevel || 'Standard'
                    }]`,
                  },
                ]
              : []),
            { text: request.message },
          ],
        },
      ];

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
        signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`Gemini API returned status ${res.status}: ${errorText.slice(0, 200)}`);
      }

      const json = await res.json();
      const candidate = json.candidates?.[0];
      const answer = candidate?.content?.parts?.[0]?.text;

      if (!answer) {
        throw new Error('Gemini API returned empty candidate response.');
      }

      return {
        message: answer,
        model: this.model,
        provider: 'gemini',
        tokensUsed: json.usageMetadata?.totalTokenCount,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Concrete implementation for local Ollama provider.
 * Activated when AI_PROVIDER=ollama. Communicates with local private Ollama host.
 * Never fabricates mock responses when offline.
 */
export class OllamaProvider implements AIProvider {
  public readonly id = 'ollama';
  public readonly host: string;
  public readonly model: string;
  public readonly timeoutMs: number;

  constructor() {
    this.host = (process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').trim().replace(/\/+$/, '');
    this.model = (process.env.AI_MODEL || 'llama3.2').trim();
    this.timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10);
  }

  public get isConfigured(): boolean {
    return Boolean(this.host && this.model);
  }

  /**
   * Health and connectivity probe for Ollama host.
   * Can be used by health checks and diagnostics without triggering full model generation.
   */
  public async checkAvailability(timeoutMs = 2500): Promise<{ available: boolean; error?: string; models?: string[] }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${this.host}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });

      if (!res.ok) {
        return {
          available: false,
          error: `Ollama host returned HTTP status ${res.status}`,
        };
      }

      const data = (await res.json()) as { models?: Array<{ name: string }> };
      const models = (data.models || []).map((m) => m.name);
      return { available: true, models };
    } catch (err: any) {
      return {
        available: false,
        error:
          err.name === 'AbortError'
            ? `Connection to Ollama host at ${this.host} timed out after ${timeoutMs}ms.`
            : `Failed to connect to Ollama host at ${this.host}: ${err.message}`,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  public async generateChat(request: AIProviderRequest): Promise<AIProviderResponse> {
    if (!this.isConfigured) {
      throw new ProviderConfigurationError('Ollama provider is not properly configured.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const signal = request.signal || controller.signal;

    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

      if (request.context) {
        messages.push({
          role: 'system',
          content: `You are an educational AI tutor on the Geniusphere platform. Subject: ${
            request.context.subject || 'General'
          }, GradeLevel: ${
            request.context.gradeLevel || 'Standard'
          }. Provide concise, accurate pedagogical explanations.`,
        });
      }

      for (const msg of request.history || []) {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        });
      }

      messages.push({
        role: 'user',
        content: request.message,
      });

      let res: Response;
      try {
        res = await fetch(`${this.host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            messages,
            stream: false,
            options: {
              temperature: 0.7,
            },
          }),
          signal,
        });
      } catch (networkErr: any) {
        if (signal.aborted || networkErr.name === 'AbortError') {
          throw networkErr;
        }
        throw new Error(
          `Ollama service unavailable at ${this.host}: ${networkErr.message}. Ensure local Ollama daemon is running.`
        );
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`Ollama API returned status ${res.status}: ${errorText.slice(0, 200)}`);
      }

      const json = (await res.json()) as any;
      const answer = json.message?.content;

      if (!answer) {
        throw new Error('Ollama API returned empty message content.');
      }

      const totalTokens =
        json.eval_count || json.prompt_eval_count
          ? (json.prompt_eval_count || 0) + (json.eval_count || 0)
          : undefined;

      return {
        message: answer,
        model: this.model,
        provider: 'ollama',
        tokensUsed: totalTokens,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Provider Registry & Factory
 * Reads server-side environment variables and instantiates configured provider.
 */
export class AIProviderRegistry {
  public static getProvider(): AIProvider | null {
    const rawProvider = (process.env.AI_PROVIDER || '').trim().toLowerCase();

    // Default state: unconfigured / none
    if (!rawProvider || rawProvider === 'none' || rawProvider === 'unconfigured') {
      return null;
    }

    if (rawProvider === 'gemini') {
      return new GeminiProvider();
    }

    if (rawProvider === 'ollama') {
      return new OllamaProvider();
    }

    // Explicit rejection of unknown providers to prevent silent fallback or misconfiguration
    throw new ProviderConfigurationError(
      `Unsupported AI provider '${rawProvider}'. Supported values: 'none', 'gemini', 'ollama'.`
    );
  }
}
