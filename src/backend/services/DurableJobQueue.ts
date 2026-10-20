// ====================================================================
// Geniusphere — Durable Background Job Processing Queue
// Persistent job state, exponential retry backoff, and dead-letter handling
// ====================================================================

import { notificationEngine } from './NotificationEngine';
import { transactionalOutbox } from '../TransactionalOutbox';
import { activityTrackerEngine } from './ActivityTrackerEngine';

export type JobType =
  | 'ASSIGNMENT_DUE_REMINDER'
  | 'STREAK_PRESERVATION_REMINDER'
  | 'EVENT_OUTBOX_FLUSH'
  | 'DATA_RETENTION_CLEANUP';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'exhausted';

export interface BackgroundJob<T = any> {
  id: string;
  type: JobType;
  payload: T;
  status: JobStatus;
  run_at: string; // ISO 8601 UTC
  created_at: string;
  attempts: number;
  max_attempts: number;
  last_error?: string;
  completed_at?: string;
  dedup_key?: string;
}

export interface JobQueueMetrics {
  total_jobs: number;
  pending_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  exhausted_dead_letter_jobs: number;
}

const JOBS_STORAGE_KEY = 'geniusphere_durable_jobs_v2';
const DEFAULT_MAX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 1000;

export class DurableJobQueue {
  private jobs: Map<string, BackgroundJob> = new Map();
  private isProcessing: boolean = false;
  private timer: any = null;

  constructor() {
    this.hydrateFromStorage();
    this.startWorker();
  }

  /**
   * Enqueues a durable background job with optional delay and deduplication
   */
  public enqueue<T = any>(
    type: JobType,
    payload: T,
    options?: { delayMs?: number; maxAttempts?: number; dedupKey?: string }
  ): BackgroundJob<T> {
    const dedupKey = options?.dedupKey;
    if (dedupKey) {
      // Check if job with this dedup key is already pending/running
      const existing = Array.from(this.jobs.values()).find(
        (j) => j.dedup_key === dedupKey && (j.status === 'pending' || j.status === 'running')
      );
      if (existing) {
        return existing as BackgroundJob<T>;
      }
    }

    const runAt = new Date(Date.now() + (options?.delayMs || 0)).toISOString();
    const job: BackgroundJob<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      status: 'pending',
      run_at: runAt,
      created_at: new Date().toISOString(),
      attempts: 0,
      max_attempts: options?.maxAttempts || DEFAULT_MAX_ATTEMPTS,
      dedup_key: dedupKey,
    };

    this.jobs.set(job.id, job);
    this.persistToStorage();
    return job;
  }

  /**
   * Starts the background worker cycle
   */
  public startWorker(intervalMs: number = 3000): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.processPendingJobs();
    }, intervalMs);
  }

  public stopWorker(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Processes all ready jobs
   */
  public async processPendingJobs(): Promise<{ executed: number; failed: number }> {
    if (this.isProcessing) return { executed: 0, failed: 0 };
    this.isProcessing = true;

    const nowIso = new Date().toISOString();
    let executed = 0;
    let failed = 0;

    for (const job of this.jobs.values()) {
      if (job.status === 'pending' && job.run_at <= nowIso) {
        job.status = 'running';
        job.attempts++;

        try {
          await this.executeJobHandler(job);
          job.status = 'completed';
          job.completed_at = new Date().toISOString();
          executed++;
        } catch (err: any) {
          job.last_error = err?.message || 'Execution error';
          if (job.attempts >= job.max_attempts) {
            job.status = 'exhausted'; // Dead-letter
          } else {
            job.status = 'pending';
            // Exponential backoff
            const backoff = BASE_BACKOFF_MS * Math.pow(2, job.attempts - 1);
            job.run_at = new Date(Date.now() + backoff).toISOString();
          }
          failed++;
        }
      }
    }

    this.persistToStorage();
    this.isProcessing = false;
    return { executed, failed };
  }

  /**
   * Job handler router
   */
  private async executeJobHandler(job: BackgroundJob): Promise<void> {
    switch (job.type) {
      case 'ASSIGNMENT_DUE_REMINDER': {
        const { userId, assignmentTitle, hoursLeft } = job.payload;
        notificationEngine.dispatch(
          userId,
          `Assignment Due in ${hoursLeft} Hours`,
          `Reminder: Complete "${assignmentTitle}" to maintain your course progression.`,
          'high',
          'assignment',
          'assignments',
          undefined,
          'View Assignment',
          { dedup_key: `assign_due_${job.payload.assignmentId}_${userId}` }
        );
        break;
      }

      case 'STREAK_PRESERVATION_REMINDER': {
        const { userId } = job.payload;
        const metrics = activityTrackerEngine.getUserMetrics(userId);
        const today = new Date().toISOString().slice(0, 10);
        if (metrics.last_active_date !== today && metrics.current_streak_days > 0) {
          notificationEngine.dispatch(
            userId,
            'Keep Your Streak Alive!',
            `You have an active ${metrics.current_streak_days}-day streak. Complete a quick lab or lesson today to protect it!`,
            'medium',
            'system',
            'student-dashboard',
            undefined,
            'Resume Learning',
            { dedup_key: `streak_preserve_${userId}_${today}` }
          );
        }
        break;
      }

      case 'EVENT_OUTBOX_FLUSH': {
        transactionalOutbox.flushPending();
        break;
      }

      case 'DATA_RETENTION_CLEANUP': {
        // Prune completed jobs older than 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        for (const [id, j] of this.jobs.entries()) {
          if (j.status === 'completed' && j.completed_at && j.completed_at < sevenDaysAgo) {
            this.jobs.delete(id);
          }
        }
        break;
      }

      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  public getMetrics(): JobQueueMetrics {
    let pending = 0;
    let completed = 0;
    let failed = 0;
    let exhausted = 0;

    for (const j of this.jobs.values()) {
      if (j.status === 'pending') pending++;
      if (j.status === 'completed') completed++;
      if (j.status === 'failed') failed++;
      if (j.status === 'exhausted') exhausted++;
    }

    return {
      total_jobs: this.jobs.size,
      pending_jobs: pending,
      completed_jobs: completed,
      failed_jobs: failed,
      exhausted_dead_letter_jobs: exhausted,
    };
  }

  public getPendingJobs(): BackgroundJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === 'pending');
  }

  public getDeadLetterJobs(): BackgroundJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === 'exhausted');
  }

  public clear(): void {
    this.jobs.clear();
    this.persistToStorage();
  }

  private persistToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const list = Array.from(this.jobs.values()).slice(-100);
      window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  private hydrateFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const raw = window.localStorage.getItem(JOBS_STORAGE_KEY);
      if (raw) {
        const list: BackgroundJob[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const j of list) {
            this.jobs.set(j.id, j);
          }
        }
      }
    } catch {
      // ignore
    }
  }
}

export const durableJobQueue = new DurableJobQueue();
