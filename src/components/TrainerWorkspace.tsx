import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle,
  FileText,
  Users,
  Send,
  Building,
} from 'lucide-react';

interface TrainerWorkspaceProps {
  db: InMemoryDatabase;
  currentUserId: string;
}

export const TrainerWorkspace: React.FC<TrainerWorkspaceProps> = ({ db, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'sessions' | 'earnings' | 'safeguarding'>('assignments');
  const [version, setVersion] = useState(0);

  // Delivery check-in modal state
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [attendanceInput, setAttendanceInput] = useState<string>('30');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Safeguarding report state
  const [incidentCategory, setIncidentCategory] = useState('Unsupervised Student Contact');
  const [incidentSeverity, setIncidentSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [incidentDesc, setIncidentDesc] = useState('');

  // Fetch or resolve trainer profile
  let trainer = db.getTrainerByUserId(currentUserId);
  if (!trainer) {
    // If logged in as trainer without profile, provide default verified profile
    trainer = db.trainers.get('trainer-1');
  }

  const trainerId = trainer?.id || 'trainer-1';
  const assignments = db.getAssignmentsForTrainer(trainerId);
  const sessions = db.getSessionsForTrainer(trainerId);
  const payouts = db.getPayoutsForTrainer(trainerId);

  // Total earnings calculation (stored in integer paise)
  const totalSettledPaise = payouts
    .filter((p) => p.status === 'settled')
    .reduce((sum, p) => sum + p.amount_paise, 0);
  const totalAccruedPaise = payouts
    .filter((p) => p.status === 'accrued' || p.status === 'approved')
    .reduce((sum, p) => sum + p.amount_paise, 0);

  const formatRupees = (paise: number) => {
    return '₹' + (paise / 100).toLocaleString('en-IN');
  };

  const handleRespondAssignment = (assignmentId: string, accept: boolean) => {
    try {
      db.respondToAssignmentOffer(currentUserId, assignmentId, accept);
      setVersion((v) => v + 1);
      setActionMsg({
        text: accept ? 'Assignment confirmed! Payout accrued to your ledger.' : 'Assignment declined.',
        type: 'success',
      });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleLogDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) return;
    try {
      const count = parseInt(attendanceInput, 10) || 0;
      db.logSessionDelivery(currentUserId, selectedSessionId, count, deliveryNotes);
      setSelectedSessionId(null);
      setDeliveryNotes('');
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Session delivery logged! Awaiting school attendance confirmation.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleReportSafeguarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDesc.trim()) return;
    try {
      db.reportSafeguardingIncident(
        currentUserId,
        'org-school-1',
        incidentCategory,
        incidentSeverity,
        incidentDesc
      );
      setIncidentDesc('');
      setActionMsg({ text: 'Safeguarding incident logged to platform compliance queue.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Trainer Profile & Verification Banner */}
      <div className="card-elevated" style={{ borderLeft: '5px solid var(--brand-primary)', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">VERIFIED TRAINER PORTAL</span>
              {trainer?.verification_status === 'verified' ? (
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} />
                  <span>IDENTITY & SUBJECT VERIFIED</span>
                </span>
              ) : (
                <span className="badge badge-warning">VERIFICATION PENDING</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 6px' }}>
              {trainer?.user_name || 'Trainer Workspace'}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {trainer?.headline} • Standard Rate: <strong>{formatRupees(trainer?.daily_rate_paise || 500000)}/day</strong> • Completed:{' '}
              <strong>{trainer?.completed_assignments_count || 0} programmes</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {trainer?.competencies?.map((comp, idx) => (
              <span key={idx} className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {actionMsg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '8px',
            backgroundColor: actionMsg.type === 'success' ? 'var(--success-bg)' : 'rgba(239, 68, 68, 0.12)',
            color: actionMsg.type === 'success' ? 'var(--brand-primary)' : 'var(--danger-text)',
            border: `1px solid ${actionMsg.type === 'success' ? 'var(--brand-border)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{actionMsg.text}</span>
          <button
            type="button"
            onClick={() => setActionMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('assignments')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontWeight: activeTab === 'assignments' ? 800 : 500,
            color: activeTab === 'assignments' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'assignments' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Award size={16} />
          <span>Offered Assignments ({assignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontWeight: activeTab === 'sessions' ? 800 : 500,
            color: activeTab === 'sessions' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'sessions' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Calendar size={16} />
          <span>Workshop Sessions ({sessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontWeight: activeTab === 'earnings' ? 800 : 500,
            color: activeTab === 'earnings' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'earnings' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <DollarSign size={16} />
          <span>Earnings & Payout Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safeguarding')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontWeight: activeTab === 'safeguarding' ? 800 : 500,
            color: activeTab === 'safeguarding' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'safeguarding' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={16} />
          <span>Minor Safeguarding</span>
        </button>
      </div>

      {/* TAB 1: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assignments.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>No training assignments currently assigned.</p>
            </div>
          ) : (
            assignments.map((a) => {
              const req = db.trainingRequests.get(a.request_id);
              return (
                <div key={a.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${a.status === 'confirmed' ? 'badge-success' : a.status === 'offered' ? 'badge-warning' : 'badge-neutral'}`}>
                          {a.status.toUpperCase()}
                        </span>
                        <span className="badge badge-accent">{req?.target_grade_range || 'Grade 9-12'}</span>
                        <span className="badge badge-brand">{req?.preferred_format?.toUpperCase() || 'IN-PERSON'}</span>
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800 }}>
                        {req?.title || 'Training Programme'}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        School: <strong>{req?.organization_name || 'Partner School'}</strong> • Cohort Size: <strong>{req?.approx_cohort_size || 40} students</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                        {formatRupees(a.agreed_compensation_paise)}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Agreed Compensation</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <strong>Objectives:</strong> {req?.learning_objectives}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} />
                      <span>{req?.location_address}</span>
                    </div>

                    {a.status === 'offered' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => handleRespondAssignment(a.id, false)}
                          style={{ height: '36px', fontSize: '0.82rem', padding: '0 14px' }}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleRespondAssignment(a.id, true)}
                          style={{ height: '36px', fontSize: '0.82rem', padding: '0 18px', fontWeight: 700 }}
                        >
                          Accept Assignment
                        </button>
                      </div>
                    )}

                    {a.status === 'confirmed' && (
                      <span style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Assignment Active & Confirmed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: WORKSHOP SESSIONS */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>No training sessions scheduled yet.</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-brand">SESSION {s.session_number}</span>
                    <span className={`badge ${s.delivery_status === 'delivered' ? 'badge-success' : 'badge-neutral'}`}>
                      {s.delivery_status.toUpperCase()}
                    </span>
                    {s.verified_by_school && (
                      <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} />
                        <span>ATTENDANCE VERIFIED BY SCHOOL</span>
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(s.scheduled_start).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{s.topic}</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Location / Room: <strong>{s.meeting_or_room}</strong>
                  {s.classroom_name && ` • Linked LMS Cohort: ${s.classroom_name}`}
                </p>

                {s.delivery_status === 'delivered' && (
                  <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem' }}>
                    <strong>Attendance Logged:</strong> {s.attendance_count} students
                    {s.delivery_notes && ` • Notes: ${s.delivery_notes}`}
                  </div>
                )}

                {s.delivery_status === 'scheduled' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setSelectedSessionId(s.id)}
                      style={{ height: '36px', fontSize: '0.82rem', padding: '0 16px', fontWeight: 700 }}
                    >
                      Check-in & Log Delivery
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: EARNINGS & PAYOUT LEDGER */}
      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>SETTLED EARNINGS</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
                {formatRupees(totalSettledPaise)}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Disbursed to registered bank account
              </div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCRUED & APPROVED</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {formatRupees(totalAccruedPaise)}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Awaiting scheduled settlement cycle
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1.1rem', fontWeight: 800 }}>Auditable Payout Records</h3>
            {payouts.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>No payout records currently accrued.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        Assignment Payout • <code>{p.idempotency_key}</code>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Created: {new Date(p.created_at).toLocaleDateString('en-IN')}
                        {p.settled_at && ` • Settled: ${new Date(p.settled_at).toLocaleDateString('en-IN')}`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${p.status === 'settled' ? 'badge-success' : p.status === 'approved' ? 'badge-accent' : 'badge-warning'}`}>
                        {p.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                        {formatRupees(p.amount_paise)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MINOR SAFEGUARDING */}
      {activeTab === 'safeguarding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '22px', borderLeft: '4px solid var(--brand-primary)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--brand-primary)" />
              <span>Trainer Code of Conduct & Safeguarding Obligations</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Under the Digital Personal Data Protection (DPDP) Act 2023 and Geniusphere Minor Protection Constitution, trainers are strictly prohibited from soliciting minor phone numbers, personal emails, or private social profiles. All workshop sessions must be conducted in verified school premises or authorized institution video links under school teacher oversight.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1.1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} color="#F59E0B" />
              <span>Report Safeguarding Concern or Incident</span>
            </h3>

            <form onSubmit={handleReportSafeguarding} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select
                    className="input-field"
                    value={incidentCategory}
                    onChange={(e) => setIncidentCategory(e.target.value)}
                    style={{ width: '100%', height: '38px' }}
                  >
                    <option value="Unsupervised Student Contact">Unsupervised Student Contact</option>
                    <option value="Inappropriate Classroom Behavior">Inappropriate Classroom Behavior</option>
                    <option value="Safety or Facility Issue">Safety or Facility Issue</option>
                    <option value="Other Safeguarding Concern">Other Safeguarding Concern</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Severity</label>
                  <select
                    className="input-field"
                    value={incidentSeverity}
                    onChange={(e) => setIncidentSeverity(e.target.value as any)}
                    style={{ width: '100%', height: '38px' }}
                  >
                    <option value="low">Low (Procedural notice)</option>
                    <option value="medium">Medium (Requires review)</option>
                    <option value="high">High (Urgent investigation)</option>
                    <option value="critical">Critical (Immediate escalation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Incident Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="Provide factual details of the incident or safety concern observed during the training session..."
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ height: '38px', padding: '0 18px', fontWeight: 700 }}>
                  <Send size={14} />
                  <span>Submit Confidential Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SESSION CHECK-IN MODAL */}
      {selectedSessionId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card-elevated" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem', fontWeight: 800 }}>Log Session Delivery</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Confirm verified student attendance and record completion notes for this session.
            </p>

            <form onSubmit={handleLogDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Verified Attendance Count</label>
                <input
                  type="number"
                  className="input-field"
                  value={attendanceInput}
                  onChange={(e) => setAttendanceInput(e.target.value)}
                  min="1"
                  max="500"
                  required
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Delivery Notes (Topics covered, student engagement)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Conducted SQL parameterization hands-on lab with all 30 students. All completed initial exercises successfully."
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setSelectedSessionId(null)}
                  style={{ height: '38px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ height: '38px', padding: '0 18px', fontWeight: 700 }}>
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
