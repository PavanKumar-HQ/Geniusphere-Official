import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { ParentGuardianLink, Submission } from '../types';
import { ShieldCheck, UserCheck, AlertTriangle, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface ParentPortalProps {
  db: InMemoryDatabase;
  parentUserId: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ db, parentUserId }) => {
  // Find linked students for this parent
  const links: ParentGuardianLink[] = [];
  for (const l of db.parentLinks.values()) {
    if (l.parent_user_id === parentUserId) {
      links.push(l);
    }
  }

  const [activeLinkId, setActiveLinkId] = useState<string>(links[0]?.id || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeLink = links.find((l) => l.id === activeLinkId);
  const student = activeLink ? db.getUser(parentUserId, activeLink.student_id) : null;

  // Student submissions
  const studentSubmissions: Submission[] = [];
  if (student) {
    for (const a of db.assignments.values()) {
      const subs = db.getSubmissions(parentUserId, a.id);
      for (const s of subs) {
        if (s.student_id === student.id) {
          studentSubmissions.push(s);
        }
      }
    }
  }

  const handleRevokeConsent = () => {
    if (!activeLink) return;
    activeLink.consent_status = 'revoked';
    db.parentLinks.set(activeLink.id, activeLink);

    db.logAuditEvent({
      organization_id: 'org-school-1',
      actor_id: parentUserId,
      action_type: 'CONSENT_REVOKED',
      resource_type: 'parent_link',
      resource_id: activeLink.id,
      ip_address: null,
      user_agent: null,
      details: { student_id: activeLink.student_id },
    });

    setStatusMessage('Parental consent has been revoked. Access to minor student records is now restricted.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExportData = () => {
    if (!student) return;
    const exportPayload = {
      minor_student: student,
      consent_record: activeLink,
      academic_submissions: studentSubmissions,
      exported_at: new Date().toISOString(),
      legal_framework: 'DPDP Act 2023 / Digital Personal Data Protection Rules 2025',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geniusphere-minor-data-export-${student.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    db.logAuditEvent({
      organization_id: 'org-school-1',
      actor_id: parentUserId,
      action_type: 'PARENT_DATA_EXPORTED',
      resource_type: 'user',
      resource_id: student.id,
      ip_address: null,
      user_agent: null,
      details: { items_exported: studentSubmissions.length },
    });

    setStatusMessage('Student data package generated and downloaded.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="var(--success)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Parent & Guardian Oversight Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              DPDP Act 2023 Compliant • Verifiable Parental Consent & Student Safeguarding
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          As a verified parent or legal guardian, you have rights to monitor your minor ward's educational progress, inspect collected activity, export records, or withdraw consent at any time.
        </p>
      </div>

      {statusMessage && (
        <div style={{
          backgroundColor: 'var(--brand-surface)',
          color: 'var(--brand-primary)',
          border: '1px solid var(--brand-border)',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          {statusMessage}
        </div>
      )}

      {/* Main Oversight Body */}
      {links.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <AlertTriangle size={32} color="var(--warning)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No Linked Minor Students</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            To link an account, your student's school administrator or student registration must invite your verified guardian email address.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Linked Student Selector */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={20} color="var(--brand-primary)" />
              <span style={{ fontWeight: 600 }}>Linked Ward:</span>
              <select
                value={activeLinkId}
                onChange={(e) => setActiveLinkId(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
              >
                {links.map((l) => (
                  <option key={l.id} value={l.id}>
                    Student ID: {l.student_id} (Consent: {l.consent_status})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className={`badge ${activeLink?.consent_status === 'verified' ? 'badge-success' : 'badge-danger'}`}>
                Consent: {activeLink?.consent_status.toUpperCase()}
              </span>
            </div>
          </div>

          {student ? (
            <div className="card-elevated">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>{student.full_name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    DOB: <strong>{student.date_of_birth}</strong> (Minor: {student.is_minor ? 'Yes' : 'No'}) • Account Status: {student.account_status}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleExportData}
                    style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem' }}
                  >
                    <Download size={15} />
                    <span>Export All Data</span>
                  </button>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={handleRevokeConsent}
                    style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem' }}
                  >
                    <Trash2 size={15} />
                    <span>Revoke Consent</span>
                  </button>
                </div>
              </div>

              {/* Verified Learning Achievements */}
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Completed Practical Labs & Verifications</h4>
              {studentSubmissions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No lab submissions recorded yet.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-surface-subdued)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Lab Assignment</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Attempt</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Evaluated Status</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Score</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSubmissions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>SQL Parameterization & Defense</td>
                          <td style={{ padding: '10px 12px' }}>#{sub.attempt_number}</td>
                          <td style={{ padding: '10px 12px' }}>
                            {sub.passed ? (
                              <span className="badge badge-success">
                                <CheckCircle2 size={12} /> PASSED
                              </span>
                            ) : (
                              <span className="badge badge-warning">INCOMPLETE</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: sub.passed ? 'var(--success)' : 'var(--text-primary)' }}>
                            {sub.score} / 100
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                            {new Date(sub.submitted_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '24px', color: 'var(--danger-text)', backgroundColor: 'var(--danger-bg)' }}>
              <strong>Access Denied:</strong> Parental consent is currently revoked or unverified for this student. Pursuant to DPDP Act 2023, data access is suspended until verifiable consent is re-established.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
