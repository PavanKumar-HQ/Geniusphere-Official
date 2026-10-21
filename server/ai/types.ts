/**
 * Geniusphere AI Service — Type Definitions & Contracts
 * Defines request/response shapes, provider interfaces, and error schemas.
 */

export interface AIChatContext {
  subject?: string;
  gradeLevel?: string;
  topicId?: string;
  courseId?: string;
  lessonId?: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatRequestBody {
  message: string;
  conversationId?: string | null;
  context?: AIChatContext;
  history?: AIChatMessage[];
}

export interface APIErrorEnvelope {
  code: string;
  message: string;
  details?: unknown;
}

export interface AIChatErrorResponse {
  requestId: string;
  status?: string;
  error: APIErrorEnvelope;
}

export interface AIChatSuccessResponse {
  requestId: string;
  status: 'success';
  data: {
    message: string;
    conversationId?: string | null;
    model: string;
    provider: string;
    tokensUsed?: number;
  };
}

export interface AIChatUnconfiguredResponse {
  requestId: string;
  status: 'provider_not_configured';
  message: string;
  error: APIErrorEnvelope;
}

export type AIChatResponse = AIChatSuccessResponse | AIChatUnconfiguredResponse | AIChatErrorResponse;

// Provider Integration Abstraction
export interface AIProviderRequest {
  requestId: string;
  userId: string;
  message: string;
  conversationId?: string | null;
  context?: AIChatContext;
  history?: AIChatMessage[];
  signal?: AbortSignal;
}

export interface AIProviderResponse {
  message: string;
  model: string;
  provider: string;
  tokensUsed?: number;
}

export interface AIProvider {
  readonly id: string;
  readonly isConfigured: boolean;
  generateChat(request: AIProviderRequest): Promise<AIProviderResponse>;
}

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export const AI_LIMITS = {
  MAX_MESSAGE_LENGTH: 4000,
  MIN_MESSAGE_LENGTH: 1,
  MAX_HISTORY_LENGTH: 20,
  MAX_CONVERSATION_ID_LENGTH: 100,
  MAX_CONTEXT_STRING_LENGTH: 100,
  MAX_PAYLOAD_BYTES: 65536, // 64 KB
  DEFAULT_TIMEOUT_MS: 15000,
  DEFAULT_RATE_LIMIT_PER_MINUTE: 20,
} as const;
