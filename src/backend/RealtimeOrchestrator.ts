// ====================================================================
// Geniusphere 2.0 — Real-Time Backend Orchestrator
// Master facade for pub/sub, presence, notifications, gradebook, audit
// ====================================================================

import { realtimeBus, RealtimeBus } from './RealtimeBus';
import { notificationEngine, NotificationEngine } from './services/NotificationEngine';
import { presenceEngine, PresenceEngine } from './services/PresenceEngine';
import { liveGradebookEngine, LiveGradebookEngine } from './services/LiveGradebookEngine';
import { auditStreamEngine, AuditStreamEngine } from './services/AuditStreamEngine';
import { RealtimeTelemetry } from './types';

export class RealtimeOrchestrator {
  public readonly bus: RealtimeBus = realtimeBus;
  public readonly notifications: NotificationEngine = notificationEngine;
  public readonly presence: PresenceEngine = presenceEngine;
  public readonly gradebook: LiveGradebookEngine = liveGradebookEngine;
  public readonly audit: AuditStreamEngine = auditStreamEngine;

  private isInitialized: boolean = false;

  public initialize(currentUserId: string, currentUserName: string, currentRole: string): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Send initial presence ping
    this.presence.sendHeartbeat(
      currentUserId,
      currentUserName,
      currentRole,
      'dashboard',
      'System Initialized'
    );
  }

  public getTelemetry(): RealtimeTelemetry {
    return this.bus.getTelemetry();
  }
}

export const backendEngine = new RealtimeOrchestrator();
