/**
 * Geniusphere AI Service — Centralized Request Handler
 * Framework-agnostic controller for POST /api/v1/ai/chat.
 * Can be executed by Fastify routes, Vercel Serverless Functions, or test runners.
 */

import crypto from 'crypto';
import { verifyToken, UserSessionPayload } from '../auth';
import {
  AIChatRequestBody,
  AIChatContext,
  AIChatMessage,
  AI_LIMITS,
} from './types';
import { AIProviderRegistry, ProviderConfigurationError } from './provider';
import { AIRateLimiter } from './rateLimiter';
import { AILogger } from './logger';

export interface HandlerRequest {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  rawBodyLength?: number;
  ip?: string;
  user?: UserSessionPayload;
}

export interface HandlerResponse {
  status: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

function getHeader(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const direct = headers[name] || headers[name.toLowerCase()];
  if (Array.isArray(direct)) return direct[0];
  return direct;
}

export async function handleAIChat(req: HandlerRequest): Promise<HandlerResponse> {
  const startTime = Date.now();

  // 1. Extract or generate Request Correlation ID
  const incomingReqId = getHeader(req.headers, 'x-request-id');
  const requestId =
    incomingReqId &&
    typeof incomingReqId === 'string' &&
    incomingReqId.length <= 128 &&
    /^[a-zA-Z0-9_-]+$/.test(incomingReqId)
      ? incomingReqId
      : crypto.randomUUID();

  const responseHeaders: Record<string, string> = {
    'x-request-id': requestId,
    'Content-Type': 'application/json',
  };

  // Helper response builder
  const reply = (statusCode: number, payload: Record<string, unknown>, extraHeaders: Record<string, string> = {}): HandlerResponse => {
    const durationMs = Date.now() - startTime;
    if (statusCode >= 400 && statusCode < 500) {
      AILogger.warn('Client error during AI chat request', {
        requestId,
        userId: req.user?.userId,
        statusCode,
        durationMs,
        error: (payload.error as any)?.code,
      });
    } else if (statusCode >= 500 && statusCode !== 503) {
      AILogger.error('Server error during AI chat request', {
        requestId,
        userId: req.user?.userId,
        statusCode,
        durationMs,
        error: (payload.error as any)?.code,
      });
    } else {
      AILogger.info('AI chat request completed', {
        requestId,
        userId: req.user?.userId,
        statusCode,
        durationMs,
      });
    }

    return {
      status: statusCode,
      headers: { ...responseHeaders, ...extraHeaders },
      body: { requestId, ...payload },
    };
  };

  try {
    // 2. Validate Content-Type
    const contentType = getHeader(req.headers, 'content-type');
    if (contentType && !contentType.toLowerCase().includes('application/json')) {
      return reply(415, {
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: "Content-Type must be 'application/json'.",
        },
      });
    }

    // 3. Validate Request Size Limit (64 KB)
    if (req.rawBodyLength !== undefined && req.rawBodyLength > AI_LIMITS.MAX_PAYLOAD_BYTES) {
      return reply(413, {
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: `Request payload exceeds size limit of ${AI_LIMITS.MAX_PAYLOAD_BYTES} bytes.`,
        },
      });
    }

    // 4. Authenticate Request
    let user = req.user;
    if (!user) {
      const authHeader = getHeader(req.headers, 'authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply(401, {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required. Missing or malformed Bearer token.',
          },
        });
      }
      const token = authHeader.substring(7).trim();
      const payload = verifyToken(token);
      if (!payload) {
        return reply(401, {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired authorization token.',
          },
        });
      }
      user = payload;
    }

    // 5. Authorize User
    if (user.role === 'suspended') {
      return reply(403, {
        error: {
          code: 'FORBIDDEN',
          message: 'Account is suspended. Access to AI services is denied.',
        },
      });
    }

    // 6. Validate Request Body
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return reply(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request body must be a valid JSON object.',
        },
      });
    }

    const { message, conversationId, context, history } = body as AIChatRequestBody;

    // Validate 'message'
    if (typeof message !== 'string') {
      return reply(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: "Field 'message' is required and must be a string.",
        },
      });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < AI_LIMITS.MIN_MESSAGE_LENGTH) {
      return reply(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: "Field 'message' cannot be empty.",
        },
      });
    }

    if (trimmedMessage.length > AI_LIMITS.MAX_MESSAGE_LENGTH) {
      return reply(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: `Field 'message' exceeds maximum length of ${AI_LIMITS.MAX_MESSAGE_LENGTH} characters.`,
        },
      });
    }

    // Validate 'conversationId'
    if (conversationId !== undefined && conversationId !== null) {
      if (
        typeof conversationId !== 'string' ||
        conversationId.length > AI_LIMITS.MAX_CONVERSATION_ID_LENGTH ||
        !/^[a-zA-Z0-9_-]+$/.test(conversationId)
      ) {
        return reply(400, {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Field 'conversationId' must be an alphanumeric string of up to ${AI_LIMITS.MAX_CONVERSATION_ID_LENGTH} characters.`,
          },
        });
      }
    }

    // Validate 'context'
    let sanitizedContext: AIChatContext | undefined;
    if (context !== undefined && context !== null) {
      if (typeof context !== 'object' || Array.isArray(context)) {
        return reply(400, {
          error: {
            code: 'VALIDATION_ERROR',
            message: "Field 'context' must be a valid object.",
          },
        });
      }

      sanitizedContext = {};
      const allowedKeys = ['subject', 'gradeLevel', 'topicId', 'courseId', 'lessonId'] as const;
      for (const [k, v] of Object.entries(context)) {
        if (!allowedKeys.includes(k as any)) {
          return reply(400, {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Unknown context field '${k}'. Allowed fields: ${allowedKeys.join(', ')}.`,
            },
          });
        }
        if (typeof v !== 'string' || v.length > AI_LIMITS.MAX_CONTEXT_STRING_LENGTH) {
          return reply(400, {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Context field '${k}' must be a string of up to ${AI_LIMITS.MAX_CONTEXT_STRING_LENGTH} characters.`,
            },
          });
        }
        (sanitizedContext as any)[k] = v.trim();
      }
    }

    // Validate 'history'
    let validatedHistory: AIChatMessage[] | undefined;
    if (history !== undefined && history !== null) {
      if (!Array.isArray(history)) {
        return reply(400, {
          error: {
            code: 'VALIDATION_ERROR',
            message: "Field 'history' must be an array of messages.",
          },
        });
      }

      if (history.length > AI_LIMITS.MAX_HISTORY_LENGTH) {
        return reply(400, {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Field 'history' cannot exceed ${AI_LIMITS.MAX_HISTORY_LENGTH} messages.`,
          },
        });
      }

      validatedHistory = [];
      for (const item of history) {
        if (!item || typeof item !== 'object' || !item.role || typeof item.content !== 'string') {
          return reply(400, {
            error: {
              code: 'VALIDATION_ERROR',
              message: "Each message in 'history' must have 'role' ('user' | 'assistant') and string 'content'.",
            },
          });
        }
        if (item.role !== 'user' && item.role !== 'assistant') {
          return reply(400, {
            error: {
              code: 'VALIDATION_ERROR',
              message: "Invalid history role. Must be 'user' or 'assistant'.",
            },
          });
        }
        if (item.content.length > AI_LIMITS.MAX_MESSAGE_LENGTH) {
          return reply(400, {
            error: {
              code: 'VALIDATION_ERROR',
              message: `History message content exceeds ${AI_LIMITS.MAX_MESSAGE_LENGTH} characters.`,
            },
          });
        }
        validatedHistory.push({
          role: item.role,
          content: item.content.trim(),
        });
      }
    }

    // 7. Rate Limiting Check (by user ID)
    const rateLimitKey = `ai_user:${user.userId}`;
    const rateCheck = await AIRateLimiter.checkRateLimit(rateLimitKey);
    responseHeaders['X-RateLimit-Limit'] = String(rateCheck.limit);
    responseHeaders['X-RateLimit-Remaining'] = String(rateCheck.remaining);
    responseHeaders['X-RateLimit-Reset'] = String(rateCheck.resetSeconds);

    if (!rateCheck.allowed) {
      return reply(
        429,
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit of ${rateCheck.limit} requests per minute exceeded. Please try again in ${rateCheck.resetSeconds} seconds.`,
          },
        },
        { 'Retry-After': String(rateCheck.resetSeconds) }
      );
    }

    // 8. Resolve Provider
    let provider;
    try {
      provider = AIProviderRegistry.getProvider();
    } catch (cfgErr: any) {
      AILogger.error('AI provider configuration error', {
        requestId,
        error: cfgErr.message,
      });
      return reply(500, {
        error: {
          code: 'PROVIDER_CONFIGURATION_ERROR',
          message: 'The AI provider is misconfigured on the server.',
        },
      });
    }

    // 9. Handle Unconfigured State (Documented 503 Service Unavailable)
    if (!provider || !provider.isConfigured) {
      return reply(503, {
        status: 'provider_not_configured',
        message: 'The AI service is not configured yet.',
        error: {
          code: 'PROVIDER_NOT_CONFIGURED',
          message: 'The AI service is not configured yet.',
        },
      });
    }

    // 10. Execute Provider
    const timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '15000', 10);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await provider.generateChat({
        requestId,
        userId: user.userId,
        message: trimmedMessage,
        conversationId,
        context: sanitizedContext,
        history: validatedHistory,
        signal: controller.signal,
      });

      return reply(200, {
        status: 'success',
        data: {
          message: result.message,
          conversationId: conversationId || null,
          model: result.model,
          provider: result.provider,
          tokensUsed: result.tokensUsed,
        },
      });
    } catch (execErr: any) {
      if (controller.signal.aborted || execErr.name === 'AbortError') {
        return reply(504, {
          error: {
            code: 'GATEWAY_TIMEOUT',
            message: `AI service request timed out after ${timeoutMs}ms.`,
          },
        });
      }

      AILogger.error('Provider execution failed', {
        requestId,
        error: execErr.message,
      });

      return reply(502, {
        error: {
          code: 'BAD_GATEWAY',
          message: 'Upstream AI provider failed to process the request.',
        },
      });
    } finally {
      clearTimeout(timer);
    }
  } catch (unexpectedErr: any) {
    // 11. Protect against secret leakage and stack traces
    AILogger.error('Unexpected internal error during AI request handling', {
      requestId,
      error: unexpectedErr?.message || 'Unknown internal error',
    });

    return reply(500, {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal error occurred while processing the request.',
      },
    });
  }
}
