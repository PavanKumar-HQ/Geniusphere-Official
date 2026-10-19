/**
 * GENIUSPHERE LEARNING SESSION SERVICE (Gate 3 Contract)
 *
 * Provides a clean data-access boundary separating:
 * 1. Session-event telemetry & deduplication
 * 2. Assessment evidence collection
 * 3. Local draft persistence (resume behaviour)
 * 4. Completion state verification & audit logging
 *
 * Current Storage Adapter: Local InMemory with SovereignDB (IndexedDB) & localStorage draft cache.
 * Note: Server-authoritative remote persistence is marked as PLANNED until a dedicated remote backend is deployed.
 */

import { InMemoryDatabase } from '../db/in-memory-db';

export type SessionEventType =
  | 'SESSION_START'
  | 'PREDICTION_SUBMITTED'
  | 'SIMULATION_EXECUTED'
  | 'DIAGNOSTIC_COMPLETED'
  | 'EXPLANATION_VERIFIED'
  | 'LAB_COMPLETED';

export interface LearningSessionEvent {
  id: string;
  sessionId: string;
  userId: string;
  labId: string;
  eventType: SessionEventType;
  payload: Record<string, any>;
  timestamp: string;
  idempotencyKey: string;
}

export interface WebDefenseDraftState {
  sessionId: string;
  labId: string;
  userId: string;
  predictionAnswer: string | null;
  predictionSubmitted: boolean;
  secQueryInput: string;
  secParamQueries: boolean;
  secOutputEncoding: boolean;
  secCsp: boolean;
  diagnosticAnswer: string | null;
  diagnosticSubmitted: boolean;
  explanationAnswer: string | null;
  explanationSubmitted: boolean;
  lastSaved: string;
}

export interface WebDefenseEvidence {
  prediction: {
    answer: string;
    isCorrect: boolean;
    timestamp: string;
  };
  simulation: {
    paramQueries: boolean;
    outputEncoding: boolean;
    strictCsp: boolean;
    payloadTested: string;
    defensePassRate: number;
    timestamp: string;
  };
  diagnostic: {
    codeFixId: string;
    isCorrect: boolean;
    timestamp: string;
  };
  explanation: {
    reasoningId: string;
    isCorrect: boolean;
    timestamp: string;
  };
}

export interface ILearningSessionService {
  readonly adapterType: 'local-in-memory' | 'server-authoritative';
  startSession(userId: string, labId: string): string;
  emitEvent(event: Omit<LearningSessionEvent, 'id' | 'timestamp'>): Promise<LearningSessionEvent>;
  getEvents(sessionId: string): LearningSessionEvent[];
  saveDraft(userId: string, labId: string, state: WebDefenseDraftState): void;
  loadDraft(userId: string, labId: string): WebDefenseDraftState | null;
  clearDraft(userId: string, labId: string): void;
  submitAttempt(
    userId: string,
    labId: string,
    sessionId: string,
    attemptData: {
      passed: boolean;
      score: number;
      diagnostics: string;
      evidence: WebDefenseEvidence;
      idempotencyKey?: string;
    }
  ): Promise<{ record: any; alreadyProcessed: boolean }>;
}

export class LocalLearningSessionService implements ILearningSessionService {
  public readonly adapterType = 'local-in-memory' as const;

  private events: Map<string, LearningSessionEvent> = new Map();
  private processedSubmissions: Map<string, any> = new Map();
  private memoryDrafts: Map<string, WebDefenseDraftState> = new Map();
  private db: InMemoryDatabase | null = null;

  constructor(dbInstance?: InMemoryDatabase) {
    if (dbInstance) {
      this.db = dbInstance;
    }
  }

  setDatabase(dbInstance: InMemoryDatabase): void {
    this.db = dbInstance;
  }

  getDatabase(): InMemoryDatabase {
    if (!this.db) {
      this.db = new InMemoryDatabase();
    }
    return this.db;
  }

  startSession(userId: string, labId: string): string {
    const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const idempotencyKey = `${userId}:${labId}:${sessionId}:SESSION_START`;
    this.emitEvent({
      sessionId,
      userId,
      labId,
      eventType: 'SESSION_START',
      payload: { startedAt: new Date().toISOString() },
      idempotencyKey,
    }).catch(() => {});

    return sessionId;
  }

  async emitEvent(
    eventData: Omit<LearningSessionEvent, 'id' | 'timestamp'>
  ): Promise<LearningSessionEvent> {
    // Check for deduplication key
    const existing = Array.from(this.events.values()).find(
      (e) => e.idempotencyKey === eventData.idempotencyKey
    );
    if (existing) {
      return existing;
    }

    const event: LearningSessionEvent = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...eventData,
    };

    this.events.set(event.id, event);

    // Audit log this pedagogical event with chaining
    try {
      this.getDatabase().logAuditEvent({
        action_type: `LEARNING_SESSION_${event.eventType}`,
        actor_id: event.userId,
        organization_id: null,
        resource_type: 'lab_session',
        resource_id: `${event.labId}:${event.sessionId}`,
        ip_address: '127.0.0.1',
        user_agent: 'Geniusphere-WebDefense-Engine/2.0',
        details: {
          sessionId: event.sessionId,
          labId: event.labId,
          payload: event.payload,
          idempotencyKey: event.idempotencyKey,
        },
      });
    } catch {
      // Continue gracefully
    }

    return event;
  }

  getEvents(sessionId: string): LearningSessionEvent[] {
    return Array.from(this.events.values()).filter((e) => e.sessionId === sessionId);
  }

  private getDraftStorageKey(userId: string, labId: string): string {
    return `geniusphere_draft:${userId}:${labId}`;
  }

  saveDraft(userId: string, labId: string, state: WebDefenseDraftState): void {
    const key = this.getDraftStorageKey(userId, labId);
    this.memoryDrafts.set(key, state);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(state));
      } else if (typeof localStorage !== 'undefined' && localStorage.setItem) {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // Memory fallback in place
    }
  }

  loadDraft(userId: string, labId: string): WebDefenseDraftState | null {
    const key = this.getDraftStorageKey(userId, labId);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem) {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // Memory fallback in place
    }
    return this.memoryDrafts.get(key) || null;
  }

  clearDraft(userId: string, labId: string): void {
    const key = this.getDraftStorageKey(userId, labId);
    this.memoryDrafts.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      } else if (typeof localStorage !== 'undefined' && localStorage.removeItem) {
        localStorage.removeItem(key);
      }
    } catch {
      // Memory fallback in place
    }
  }

  async submitAttempt(
    userId: string,
    labId: string,
    sessionId: string,
    attemptData: {
      passed: boolean;
      score: number;
      diagnostics: string;
      evidence: WebDefenseEvidence;
      idempotencyKey?: string;
    }
  ): Promise<{ record: any; alreadyProcessed: boolean }> {
    const key = attemptData.idempotencyKey || `${userId}:${labId}:${sessionId}:FINAL_SUBMISSION`;

    // Deduplication check
    if (this.processedSubmissions.has(key)) {
      return {
        record: this.processedSubmissions.get(key),
        alreadyProcessed: true,
      };
    }

    // Record through database engine
    const record = this.getDatabase().recordLabAttempt(userId, labId, {
      passed: attemptData.passed,
      score: attemptData.score,
      diagnostics: attemptData.diagnostics,
      savedState: {
        sessionId,
        evidence: attemptData.evidence,
        submittedAt: new Date().toISOString(),
      },
    });

    this.processedSubmissions.set(key, record);

    // Emit final verified event
    await this.emitEvent({
      sessionId,
      userId,
      labId,
      eventType: 'LAB_COMPLETED',
      payload: {
        score: attemptData.score,
        passed: attemptData.passed,
        diagnostics: attemptData.diagnostics,
        recordId: record.id,
      },
      idempotencyKey: key,
    });

    // Clear draft on successful completion
    if (attemptData.passed) {
      this.clearDraft(userId, labId);
    }

    return { record, alreadyProcessed: false };
  }
}

// Global singleton instance for use in UI components
export const learningSessionService = new LocalLearningSessionService();
