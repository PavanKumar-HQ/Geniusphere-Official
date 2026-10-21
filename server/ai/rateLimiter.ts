/**
 * Geniusphere AI Service — Durable Rate Limiter
 * Implements a distributed sliding window rate limiter backed by PostgreSQL / Supabase,
 * with an in-memory fallback for offline test environments.
 */

import { query } from '../db';
import { RateLimitResult, AI_LIMITS } from './types';

// In-memory fallback bucket for test environments or DB disconnections
interface MemoryBucket {
  count: number;
  windowStart: number;
}
const memoryBuckets = new Map<string, MemoryBucket>();

export class AIRateLimiter {
  private static readonly WINDOW_MS = 60 * 1000; // 1-minute window

  public static getMaxPerMinute(): number {
    return parseInt(
      process.env.AI_RATE_LIMIT_MAX_PER_MIN ||
        String(AI_LIMITS.DEFAULT_RATE_LIMIT_PER_MINUTE),
      10
    );
  }

  /**
   * Checks and increments rate limit counter for a given identifier (user ID or IP).
   */
  public static async checkRateLimit(key: string): Promise<RateLimitResult> {
    const limit = this.getMaxPerMinute();
    const now = Date.now();
    const windowStartMs = now - this.WINDOW_MS;
    const windowStartDate = new Date(windowStartMs);

    // Try durable PostgreSQL rate limit tracking
    try {
      const result = await query(
        `INSERT INTO public.ai_rate_limits (key, window_start, request_count, updated_at)
         VALUES ($1, NOW(), 1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET request_count = CASE 
               WHEN public.ai_rate_limits.window_start < $2 THEN 1 
               ELSE public.ai_rate_limits.request_count + 1 
             END,
             window_start = CASE 
               WHEN public.ai_rate_limits.window_start < $2 THEN NOW() 
               ELSE public.ai_rate_limits.window_start 
             END,
             updated_at = NOW()
         RETURNING request_count, window_start;`,
        [key, windowStartDate]
      );

      if (result.rowCount && result.rows[0]) {
        const count = result.rows[0].request_count;
        const currentWindowStart = new Date(result.rows[0].window_start).getTime();
        const elapsed = now - currentWindowStart;
        const resetSeconds = Math.max(1, Math.ceil((this.WINDOW_MS - elapsed) / 1000));
        const remaining = Math.max(0, limit - count);

        return {
          allowed: count <= limit,
          current: count,
          limit,
          remaining,
          resetSeconds,
        };
      }
    } catch (dbErr) {
      // Fallback gracefully to memory buckets if PostgreSQL table is not ready or connection is absent
    }

    // In-memory sliding window fallback
    const bucket = memoryBuckets.get(key);
    if (!bucket || bucket.windowStart < windowStartMs) {
      memoryBuckets.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        current: 1,
        limit,
        remaining: limit - 1,
        resetSeconds: 60,
      };
    }

    bucket.count += 1;
    const elapsed = now - bucket.windowStart;
    const resetSeconds = Math.max(1, Math.ceil((this.WINDOW_MS - elapsed) / 1000));
    const remaining = Math.max(0, limit - bucket.count);

    return {
      allowed: bucket.count <= limit,
      current: bucket.count,
      limit,
      remaining,
      resetSeconds,
    };
  }

  /**
   * Reset rate limiter for tests (both memory and DB)
   */
  public static async resetRateLimits(key?: string): Promise<void> {
    memoryBuckets.clear();
    try {
      if (key) {
        await query('DELETE FROM public.ai_rate_limits WHERE key = $1', [key]);
      } else {
        await query('DELETE FROM public.ai_rate_limits');
      }
    } catch {
      // ignore in test or if table not present
    }
  }

  public static resetMemoryBuckets(): void {
    memoryBuckets.clear();
  }
}
