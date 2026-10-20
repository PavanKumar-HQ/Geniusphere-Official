// ====================================================================
// Geniusphere — Server-Authoritative Domain Event Model & Schema Contracts
// Strict event schemas, idempotency keys, and recipient scoping
// ====================================================================

export type DomainEventType =
  | 'course.published'
  | 'course.updated'
  | 'enrollment.created'
  | 'lesson.completed'
  | 'assessment.submitted'
  | 'assessment.graded'
  | 'assignment.published'
  | 'assignment.due_soon'
  | 'session.scheduled'
  | 'session.updated'
  | 'announcement.published'
  | 'notification.created'
  | 'notification.read'
  | 'activity.heartbeat';

export type EventScope = 'public' | 'classroom' | 'user' | 'system';

export type OutboxEventStatus = 'pending' | 'dispatched' | 'acknowledged' | 'failed';

export interface DomainEvent<T = any> {
  id: string; // Unique: `evt_${timestamp}_${randomId}`
  event_type: DomainEventType;
  version: '1.0';
  timestamp: string; // ISO 8601 UTC
  entity_id: string; // ID of target course, lesson, submission, etc.
  recipient_id?: string; // Target user ID for user-scoped events
  classroom_id?: string; // Target classroom ID for classroom-scoped events
  scope: EventScope;
  payload: T;
  idempotency_key: string;
  status: OutboxEventStatus;
  retry_count: number;
  last_error?: string;
  processed_at?: string;
}

export function createDomainEvent<T = any>(
  eventType: DomainEventType,
  entityId: string,
  payload: T,
  options?: {
    recipientId?: string;
    classroomId?: string;
    scope?: EventScope;
    idempotencyKey?: string;
  }
): DomainEvent<T> {
  const timestamp = new Date().toISOString();
  const rand = Math.random().toString(36).substring(2, 9);
  const id = `evt_${Date.now()}_${rand}`;
  const scope = options?.scope || (options?.recipientId ? 'user' : options?.classroomId ? 'classroom' : 'public');
  const idempotencyKey = options?.idempotencyKey || `${eventType}:${entityId}:${options?.recipientId || 'global'}:${timestamp.slice(0, 10)}`;

  return {
    id,
    event_type: eventType,
    version: '1.0',
    timestamp,
    entity_id: entityId,
    recipient_id: options?.recipientId,
    classroom_id: options?.classroomId,
    scope,
    payload,
    idempotency_key: idempotencyKey,
    status: 'pending',
    retry_count: 0,
  };
}
