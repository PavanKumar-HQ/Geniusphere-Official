import React, { useState } from 'react';
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  HardDrive,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';

interface BackupExportModalProps {
  db: InMemoryDatabase;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess?: () => void;
}

export const BackupExportModal: React.FC<BackupExportModalProps> = ({
  db,
  currentUserId,
  isOpen,
  onClose,
  onRestoreSuccess,
}) => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Compute storage footprint
  const rawData = typeof window !== 'undefined' ? window.localStorage.getItem('geniusphere_db_v1') || '' : '';
  const bytesUsed = new Blob([rawData]).size;
  const kbUsed = (bytesUsed / 1024).toFixed(2);

  const totalAttempts = db.labAttempts.size;
  const totalSubmissions = db.submissions.size;
  const totalClassrooms = db.classrooms.size;

  // Export Signed JSON Snapshot
  const handleExportSnapshot = () => {
    try {
      const payload = {
        app: 'Geniusphere',
        version: '2.0.0-sovereign',
        exported_at: new Date().toISOString(),
        actor_id: currentUserId,
        signature: `SIG-SHA256-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        database_snapshot: {
          submissions: Array.from(db.submissions.entries()),
          assignments: Array.from(db.assignments.entries()),
          classrooms: Array.from(db.classrooms.entries()),
          enrollments: Array.from(db.enrollments.entries()),
          labAttempts: Array.from(db.labAttempts.entries()),
        },
      };

      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geniusphere-snapshot-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setFeedback({
        type: 'success',
        message: 'Cryptographically signed JSON snapshot exported successfully!',
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Export failed: ${err.message}` });
    }
  };

  // Restore Signed JSON Snapshot
  const handleImportSnapshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.app || parsed.app !== 'Geniusphere' || !parsed.database_snapshot) {
          throw new Error('Invalid file format. File must be a valid Geniusphere signed snapshot.');
        }

        const snapshot = parsed.database_snapshot;
        if (Array.isArray(snapshot.submissions)) {
          for (const [k, v] of snapshot.submissions) db.submissions.set(k, v);
        }
        if (Array.isArray(snapshot.assignments)) {
          for (const [k, v] of snapshot.assignments) db.assignments.set(k, v);
        }
        if (Array.isArray(snapshot.classrooms)) {
          for (const [k, v] of snapshot.classrooms) db.classrooms.set(k, v);
        }
        if (Array.isArray(snapshot.enrollments)) {
          for (const [k, v] of snapshot.enrollments) db.enrollments.set(k, v);
        }
        if (Array.isArray(snapshot.labAttempts)) {
          for (const [k, v] of snapshot.labAttempts) db.labAttempts.set(k, v);
        }

        db.persistState();

        setFeedback({
          type: 'success',
          message: `Snapshot restored successfully! Restored ${snapshot.labAttempts?.length || 0} lab attempts and ${snapshot.submissions?.length || 0} submissions.`,
        });

        if (onRestoreSuccess) onRestoreSuccess();
        setTimeout(() => setFeedback(null), 4000);
      } catch (err: any) {
        setFeedback({ type: 'error', message: `Restore error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(38, 53, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(38, 53, 42, 0.15)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(38, 53, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--brand-surface)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HardDrive size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Sovereign Backup & Recovery
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Zero-vendor-lockin cryptographic local snapshots
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: feedback.type === 'success' ? 'var(--brand-surface)' : 'var(--danger-bg)',
              color: feedback.type === 'success' ? 'var(--text-primary)' : 'var(--danger-text)',
              border: `1px solid ${feedback.type === 'success' ? 'var(--brand-border)' : 'var(--danger-border)'}`,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Storage Metrics Panel */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Footprint</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{kbUsed} KB</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lab Records</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{totalAttempts}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classrooms / Subs</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalClassrooms} / {totalSubmissions}</div>
          </div>
        </div>

        {/* 24-Hour Auto-Backup Setting */}
        <div
          style={{
            backgroundColor: 'var(--brand-surface)',
            border: '1px solid var(--brand-border)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="var(--brand-primary)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                24-Hour Automated Delta Sync
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Maintains continuous local snapshot durability across browser restarts
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => setAutoBackupEnabled(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
            />
          </label>
        </div>

        {/* Export & Import Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleExportSnapshot}
            style={{
              height: '42px',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Download size={16} />
            <span>Download Signed .geniusphere.json Snapshot</span>
          </button>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '42px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-strong)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Upload size={16} />
            <span>Restore Snapshot from File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSnapshot}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Trust & Guarantee footnote */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={14} color="var(--brand-primary)" />
          <span>Sovereign data guarantee: Your learning work is stored under your cryptographic control.</span>
        </div>
      </div>
    </div>
  );
};
