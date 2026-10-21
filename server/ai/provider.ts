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

    // Explicit rejection of unknown providers to prevent silent fallback or misconfiguration
    throw new ProviderConfigurationError(
      `Unsupported AI provider '${rawProvider}'. Supported values: 'none', 'gemini'.`
    );
  }
}
