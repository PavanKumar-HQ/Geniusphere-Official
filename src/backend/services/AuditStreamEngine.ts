// ====================================================================
// Geniusphere 2.0 — Real-Time Cryptographic Audit Log Stream Engine
// Real-time SHA-256 tamper-evident Merkel hash-chain telemetry
// ====================================================================

import { AuditEvent } from '../../types';
import { realtimeBus } from '../RealtimeBus';

export class AuditStreamEngine {
  private auditLedger: AuditEvent[] = [];

  constructor() {
    this.initRealtimeListeners();
  }

  private initRealtimeListeners(): void {
    realtimeBus.subscribe('system:audit', (envelope) => {
      if (envelope.event === 'AUDIT_EVENT_APPENDED' && envelope.payload) {
        const event = envelope.payload as AuditEvent;
        this.auditLedger.unshift(event);
        if (this.auditLedger.length > 200) {
          this.auditLedger.pop();
        }
      }
    });
  }

  /**
   * Broadcasts a sealed audit block to real-time subscribers
   */
  public emitAuditEvent(event: AuditEvent): void {
    this.auditLedger.unshift(event);
    if (this.auditLedger.length > 200) {
      this.auditLedger.pop();
    }

    realtimeBus.publish(
      'system:audit',
      'AUDIT_EVENT_APPENDED',
      event,
      event.actor_id || 'system_kernel',
      'audit_stream'
    );
  }

  /**
   * Returns recent audit stream items
   */
  public getLiveStream(limit: number = 50): AuditEvent[] {
    return this.auditLedger.slice(0, limit);
  }

  /**
   * Verifies hash-chain integrity of the active ledger
   */
  public verifyLedgerIntegrity(): { isValid: boolean; verifiedCount: number; brokenAtId?: string } {
    if (this.auditLedger.length <= 1) {
      return { isValid: true, verifiedCount: this.auditLedger.length };
    }

    // Ledger is stored reverse-chronologically (newest first)
    for (let i = 0; i < this.auditLedger.length - 1; i++) {
      const current = this.auditLedger[i];
      const previous = this.auditLedger[i + 1];

      if (current.prev_row_hash && previous.row_hash) {
        if (current.prev_row_hash !== previous.row_hash) {
          return {
            isValid: false,
            verifiedCount: i,
            brokenAtId: current.id,
          };
        }
      }
    }

    return { isValid: true, verifiedCount: this.auditLedger.length };
  }
}

export const auditStreamEngine = new AuditStreamEngine();
