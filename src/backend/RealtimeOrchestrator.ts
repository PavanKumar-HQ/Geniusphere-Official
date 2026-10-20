// ====================================================================
// Geniusphere 2.0 — Real-Time Backend Orchestrator
// Master facade for pub/sub, presence, notifications, gradebook, audit,
// transactional outbox, durable job queue, and activity tracking
// ====================================================================

import { realtimeBus, RealtimeBus } from './RealtimeBus';
import { notificationEngine, NotificationEngine } from './services/NotificationEngine';
import { presenceEngine, PresenceEngine } from './services/PresenceEngine';
import { liveGradebookEngine, LiveGradebookEngine } from './services/LiveGradebookEngine';
import { auditStreamEngine, AuditStreamEngine } from './services/AuditStreamEngine';
import { transactionalOutbox, TransactionalOutbox } from './TransactionalOutbox';
import { durableJobQueue, DurableJobQueue } from './services/DurableJobQueue';
import { activityTrackerEngine, ActivityTrackerEngine } from './services/ActivityTrackerEngine';
import { webPushService, WebPushService } from '../services/WebPushService';
import { RealtimeTelemetry } from './types';

export class RealtimeOrchestrator {
  public readonly bus: RealtimeBus = realtimeBus;
  public readonly notifications: NotificationEngine = notificationEngine;
  public readonly presence: PresenceEngine = presenceEngine;
  public readonly gradebook: LiveGradebookEngine = liveGradebookEngine;
  public readonly audit: AuditStreamEngine = auditStreamEngine;
  public readonly outbox: TransactionalOutbox = transactionalOutbox;
  public readonly jobs: DurableJobQueue = durableJobQueue;
  public readonly tracker: ActivityTrackerEngine = activityTrackerEngine;
  public readonly push: WebPushService = webPushService;

  private isInitialized: boolean = false;

  public initialize(currentUserId: string, currentUserName: string, currentRole: string): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Connect Web Push dispatcher to notifications engine
    this.notifications.registerPushDispatcher((userId, notif) => {
      this.push.dispatchPush(userId, notif);
    });

    // Send initial presence ping
    this.presence.sendHeartbeat(
      currentUserId,
      currentUserName,
      currentRole,
      'dashboard',
      'System Initialized'
    );

    // Flush any pending outbox events
    this.outbox.flushPending();

    // Start background job queue processing
    this.jobs.startWorker(4000);
  }

  public getTelemetry(): RealtimeTelemetry {
    return this.bus.getTelemetry();
  }
}

export const backendEngine = new RealtimeOrchestrator();
