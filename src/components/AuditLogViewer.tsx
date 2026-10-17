import React from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { ShieldAlert, Lock } from 'lucide-react';

interface AuditLogViewerProps {
  db: InMemoryDatabase;
  currentUserId: string;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ db, currentUserId }) => {
  const events = db.getAuditEvents(currentUserId, 'org-school-1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ borderLeft: '4px solid var(--text-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={22} color="var(--text-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Append-Only Security Audit Log</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Immutable audit events strictly restricted to Institution Administrators & Superadmins
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-brand" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
              SHA-256 Chained
            </span>
            <span className="badge badge-neutral">
              <Lock size={12} /> Append-Only (RLS Protected)
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Recorded Security & Learning Events</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Tamper-Evident Ledger • DPDP Act 2023 Compliant
          </span>
        </div>
        {events.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            No audit events recorded yet. Run a lab or make an administrative change to generate events.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subdued)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Timestamp</th>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Action Type</th>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Actor ID</th>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Resource</th>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Hash Digest Chain</th>
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(ev.created_at).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-brand">{ev.action_type}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{ev.actor_id}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>
                      {ev.resource_type}{ev.resource_id ? `:${ev.resource_id}` : ''}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#3b82f6' }}>
                      {ev.row_hash ? `${ev.row_hash.slice(0, 8)}...` : 'unhashed'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {JSON.stringify(ev.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
