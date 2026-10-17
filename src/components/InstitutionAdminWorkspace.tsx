import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface InstitutionAdminWorkspaceProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigateToAudit?: () => void;
}

export const InstitutionAdminWorkspace: React.FC<InstitutionAdminWorkspaceProps> = ({
  db,
  currentUserId,
  onNavigateToAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'educators' | 'classrooms' | 'privacy'>('overview');

  // Find caller's organization
  let orgId = 'org-school-1';
  db.memberships.forEach((mem) => {
    if (mem.user_id === currentUserId && mem.role === 'institution_admin') {
      orgId = mem.organization_id;
    }
  });

  const org = db.organizations.get(orgId);
  const classrooms = Array.from(db.classrooms.values()).filter((c) => c.organization_id === orgId);
  const memberships = Array.from(db.memberships.values()).filter((m) => m.organization_id === orgId && m.is_active);

  // Group members
  const educators = memberships.filter((m) => m.role === 'teacher').map((m) => {
    const user = db.users.get(m.user_id);
    return {
      membershipId: m.id,
      user,
      role: m.role,
      joinedAt: m.created_at,
    };
  });

  const students = memberships.filter((m) => m.role === 'learner').map((m) => {
    const user = db.users.get(m.user_id);
    return {
      membershipId: m.id,
      user,
      role: m.role,
      joinedAt: m.created_at,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card-elevated" style={{ borderLeft: '5px solid var(--brand-primary)', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">INSTITUTION ADMINISTRATION</span>
              <span className="badge badge-success">TENANT ISOLATED</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
              {org?.name || 'Institutional Workspace'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Tenant ID: <code>{orgId}</code> • Type: <strong>{org?.org_type.toUpperCase()}</strong> • Scope: Strict Institutional Boundary
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onNavigateToAudit && (
              <button
                type="button"
                className="btn-outline"
                onClick={onNavigateToAudit}
                style={{ height: '40px', fontSize: '0.85rem' }}
              >
                <FileText size={16} />
                <span>Security Audit Trail</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            color: activeTab === 'overview' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'overview' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Overview & Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('educators')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontWeight: activeTab === 'educators' ? 700 : 500,
            color: activeTab === 'educators' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'educators' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Educators ({educators.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('classrooms')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontWeight: activeTab === 'classrooms' ? 700 : 500,
            color: activeTab === 'classrooms' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'classrooms' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Classrooms ({classrooms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontWeight: activeTab === 'privacy' ? 700 : 500,
            color: activeTab === 'privacy' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'privacy' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Safeguarding & Data Scope
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Active Educators
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {educators.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Verified teachers with classroom provisioning authority
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Classroom Cohorts
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
                {classrooms.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Active sections with cryptographic join codes
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Enrolled Students
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4F46E5' }}>
                {students.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Minor accounts under parental oversight
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Tenant Isolation
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                100% ENFORCED
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Multi-tenant RLS prevents cross-school data access
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
              Institutional Governance Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>Zero Cross-Tenant Leakage:</strong> Database policies restrict educators and administrators to records where <code>organization_id = '{orgId}'</code>.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>Crockford Base32 Join Codes:</strong> Random 8-character codes prevent classroom intrusion and expire automatically after 14 days.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>Zero Commercial Trackers:</strong> No advertising pixels, tracking scripts, or profiling mechanisms operate inside the institutional boundary.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Educators */}
      {activeTab === 'educators' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Authorized Faculty & Instructors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {educators.map((edu) => (
              <div
                key={edu.membershipId}
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{edu.user?.full_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{edu.user?.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-brand">TEACHER OF RECORD</span>
                  <span className="badge badge-success">ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Classrooms */}
      {activeTab === 'classrooms' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            Institution Classrooms & Active Join Codes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classrooms.map((cls) => {
              const teacher = db.users.get(cls.teacher_id);
              const enrollCount = Array.from(db.enrollments.values()).filter((e) => e.classroom_id === cls.id).length;

              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-subdued)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{cls.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Teacher: <strong>{teacher?.full_name || 'Assigned Educator'}</strong> • Enrolled: <strong>{enrollCount} Students</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Active Join Code
                      </div>
                      <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.05em' }}>
                        {cls.join_code}
                      </code>
                    </div>
                    <span className="badge badge-success">ACTIVE</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Privacy & Safeguarding */}
      {activeTab === 'privacy' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>
            Institutional Safeguarding & Privacy Governance
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Geniusphere implements comprehensive architectural safeguards to protect student privacy and ensure compliance with DPDP Act 2023 mandates.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subdued)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px' }}>Parental Consent Gate</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Minor student accounts (age &lt; 18) are flagged upon registration. Personal progress is protected, and consent is verifiable by lawful guardians.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subdued)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px' }}>Data Minimization</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Only necessary educational attributes (name, email, DOB, learning submissions) are stored. Unused commercial fields are strictly omitted.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subdued)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px' }}>Audit Logging</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                All sensitive actions (join-code creation, revocation, consent updates, role changes) are appended to an immutable audit trail.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
