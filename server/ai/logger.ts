/**
 * Geniusphere AI Service — Structured Server-Side Logger
 * Produces structured JSON log events with automatic redaction of sensitive credentials,
 * tokens, passwords, and student PII.
 */

export interface LogPayload {
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  durationMs?: number;
  provider?: string;
  error?: string;
  [key: string]: unknown;
}

export class AILogger {
  private static redact(val: unknown): unknown {
    if (typeof val === 'string') {
      return val
        .replace(/(bearer\s+)[a-zA-Z0-9._-]+/gi, '$1[REDACTED_TOKEN]')
        .replace(/(api[_-]?key|secret|password|pwd)\s*[:=]\s*\S+/gi, '$1: [REDACTED]')
        .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[REDACTED_EMAIL]');
    }
    if (val && typeof val === 'object') {
      if (Array.isArray(val)) {
        return val.map((item) => this.redact(item));
      }
      return this.redactObject(val as LogPayload);
    }
    return val;
  }

  private static redactObject(obj: LogPayload): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const lower = k.toLowerCase();
      if (
        lower.includes('password') ||
        lower.includes('secret') ||
        lower.includes('token') ||
        lower.includes('apikey') ||
        lower.includes('authorization')
      ) {
        cleaned[k] = '[REDACTED]';
      } else {
        cleaned[k] = this.redact(v);
      }
    }
    return cleaned;
  }

  public static info(message: string, meta: LogPayload = {}): void {
    if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TEST_LOGS) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      service: 'geniusphere-ai',
      message,
      ...this.redactObject(meta),
    };
    console.log(JSON.stringify(entry));
  }

  public static warn(message: string, meta: LogPayload = {}): void {
    if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TEST_LOGS) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      service: 'geniusphere-ai',
      message,
      ...this.redactObject(meta),
    };
    console.warn(JSON.stringify(entry));
  }

  public static error(message: string, meta: LogPayload = {}): void {
    if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TEST_LOGS) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      service: 'geniusphere-ai',
      message,
      ...this.redactObject(meta),
    };
    console.error(JSON.stringify(entry));
  }
}
