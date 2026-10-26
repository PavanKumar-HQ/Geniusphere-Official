import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { DomainType } from '../types';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  DollarSign,
  PlusCircle,
  Clock,
  MapPin,
  Building,
  ShieldCheck,
  Send,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'educators' | 'classrooms' | 'privacy'>('marketplace');
  const [version, setVersion] = useState(0);

  // New Training Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDomain, setReqDomain] = useState<DomainType>('technology');
  const [reqGradeRange, setReqGradeRange] = useState('Grade 10-12');
  const [reqCohortSize, setReqCohortSize] = useState('40');
  const [reqObjectives, setReqObjectives] = useState('');
  const [reqFormat, setReqFormat] = useState<'in_person' | 'online' | 'hybrid'>('in_person');
  const [reqStartDate, setReqStartDate] = useState('');
  const [reqEndDate, setReqEndDate] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqBudgetRupees, setReqBudgetRupees] = useState('50000');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  // Marketplace records for this organization
  const trainingRequests = db.getTrainingRequests(orgId, false);
  const invoices = db.getInvoicesForOrg(orgId);

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

  const formatRupees = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqObjectives.trim()) return;
    try {
      const budgetPaise = (parseInt(reqBudgetRupees, 10) || 50000) * 100;
      db.createTrainingRequest(currentUserId, orgId, {
        title: reqTitle.trim(),
        domain: reqDomain,
        target_grade_range: reqGradeRange,
        approx_cohort_size: parseInt(reqCohortSize, 10) || 30,
        learning_objectives: reqObjectives.trim(),
        preferred_format: reqFormat,
        preferred_start_date: reqStartDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        preferred_end_date: reqEndDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        location_address: reqLocation.trim() || (org?.name + ' Campus'),
        budget_max_paise: budgetPaise,
      });

      setIsRequestModalOpen(false);
      setReqTitle('');
      setReqObjectives('');
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Training engagement request submitted! Platform operators are reviewing availability.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleAcceptQuote = (quoteId: string) => {
    try {
      db.createBookingFromQuote(currentUserId, quoteId);
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Commercial quote accepted! Engagement booked, contract snapshot sealed, and invoice issued.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handlePayInvoice = (invoiceId: string) => {
    try {
      db.payInvoice(currentUserId, invoiceId);
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Invoice marked as paid! Receipt recorded in audit trail.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleVerifyAttendance = (sessionId: string) => {
    try {
      db.verifySessionAttendance(currentUserId, sessionId);
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Session student attendance officially verified by school.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

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
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsRequestModalOpen(true)}
              style={{ height: '40px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={16} />
              <span>Request Training Programme</span>
            </button>

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
      <div className="mobile-pill-strip" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontWeight: activeTab === 'marketplace' ? 700 : 500,
            color: activeTab === 'marketplace' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'marketplace' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Award size={16} />
          <span>Training Marketplace ({trainingRequests.length})</span>
        </button>
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
            whiteSpace: 'nowrap',
            flexShrink: 0,
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
            whiteSpace: 'nowrap',
            flexShrink: 0,
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
            whiteSpace: 'nowrap',
            flexShrink: 0,
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
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Safeguarding & Data Scope
        </button>
      </div>

      {/* TAB 0: TRAINING MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Metric Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>REQUESTED PROGRAMMES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
                {trainingRequests.length}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Workshops & Multi-session cohorts</div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONFIRMED ENGAGEMENTS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                {trainingRequests.filter((r) => r.status === 'confirmed' || r.status === 'in_progress').length}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Trainers assigned & scheduled</div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>INSTITUTIONAL INVOICES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {invoices.length}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {invoices.filter((i) => i.status === 'paid').length} paid • {invoices.filter((i) => i.status === 'issued').length} pending
              </div>
            </div>
          </div>

          {/* Training Requests Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>School Training Engagements</h2>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsRequestModalOpen(true)}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <PlusCircle size={15} />
                <span>New Request</span>
              </button>
            </div>

            {trainingRequests.length === 0 ? (
              <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
                <Building size={32} color="var(--brand-primary)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem' }}>No Training Programmes Requested Yet</h3>
                <p style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  Submit a training request for on-demand workshops delivered by verified industry trainers at your campus or online.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsRequestModalOpen(true)}
                  style={{ height: '38px', padding: '0 20px', fontSize: '0.85rem' }}
                >
                  Create First Request
                </button>
              </div>
            ) : (
              trainingRequests.map((req) => {
                const quote = db.getQuoteForRequest(req.id, orgId, false);
                const reqSessions = db.getSessionsForRequest(req.id);
                const reqInvoices = invoices.filter((i) => i.request_id === req.id);

                return (
                  <div key={req.id} className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span className={`badge ${
                            req.status === 'confirmed' ? 'badge-success' :
                            req.status === 'awaiting_school_confirmation' ? 'badge-warning' :
                            req.status === 'submitted' ? 'badge-brand' : 'badge-neutral'
                          }`}>
                            {req.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className="badge badge-accent">{req.target_grade_range}</span>
                          <span className="badge badge-neutral">{req.preferred_format.toUpperCase()}</span>
                        </div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800 }}>{req.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Cohort Size: <strong>{req.approx_cohort_size} students</strong> • Budget Limit: <strong>{formatRupees(req.budget_max_paise)}</strong> • Dates: <strong>{req.preferred_start_date} to {req.preferred_end_date}</strong>
                        </p>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={14} />
                        <span>{req.location_address}</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      <strong>Pedagogical Objectives:</strong> {req.learning_objectives}
                    </div>

                    {/* Commercial Quote Box */}
                    {quote && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-canvas)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                              COMMERCIAL PRICE QUOTE
                            </span>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                              {formatRupees(quote.gross_amount_paise)}{' '}
                              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                (incl. {formatRupees(quote.tax_amount_paise)} GST)
                              </span>
                            </div>
                          </div>

                          {quote.status === 'issued' && req.status === 'awaiting_school_confirmation' && (
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleAcceptQuote(quote.id)}
                              style={{ height: '38px', padding: '0 20px', fontWeight: 700, fontSize: '0.84rem' }}
                            >
                              Accept Quote & Confirm Booking
                            </button>
                          )}

                          {quote.status === 'accepted' && (
                            <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={16} /> Quote Accepted & Confirmed
                            </span>
                          )}
                        </div>

                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <strong>Terms:</strong> {quote.terms_markdown}
                        </p>
                      </div>
                    )}

                    {/* Scheduled Sessions & LMS Cohort Integration */}
                    {reqSessions.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 800 }}>
                          Scheduled Workshop Sessions ({reqSessions.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {reqSessions.map((s) => (
                            <div
                              key={s.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--bg-surface-subdued)',
                                border: '1px solid var(--border-subtle)',
                                flexWrap: 'wrap',
                                gap: '8px',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                  Session {s.session_number}: {s.topic}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                  {new Date(s.scheduled_start).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  • Room: {s.meeting_or_room}
                                  {s.attendance_count > 0 && ` • Logged Attendance: ${s.attendance_count} students`}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={`badge ${s.delivery_status === 'delivered' ? 'badge-success' : 'badge-neutral'}`}>
                                  {s.delivery_status.toUpperCase()}
                                </span>

                                {s.delivery_status === 'delivered' && !s.verified_by_school && (
                                  <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => handleVerifyAttendance(s.id)}
                                    style={{ height: '30px', fontSize: '0.74rem', padding: '0 10px' }}
                                  >
                                    Verify Attendance
                                  </button>
                                )}

                                {s.verified_by_school && (
                                  <span style={{ fontSize: '0.76rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <CheckCircle2 size={13} /> Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Invoices List */}
                    {reqInvoices.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                              Invoice: <code>{reqInvoices[0].invoice_number}</code>
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                              Due: {new Date(reqInvoices[0].due_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className={`badge ${reqInvoices[0].status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                              {reqInvoices[0].status.toUpperCase()}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                              {formatRupees(reqInvoices[0].total_paise)}
                            </span>

                            {reqInvoices[0].status === 'issued' && (
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={() => handlePayInvoice(reqInvoices[0].id)}
                                style={{ height: '32px', fontSize: '0.76rem', padding: '0 12px' }}
                              >
                                Settle Invoice
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* REQUEST TRAINING MODAL */}
      {isRequestModalOpen && (
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
          <div className="card-elevated" style={{ width: '100%', maxWidth: '580px', padding: '26px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Request Training Programme</h3>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Specify your school cohort, pedagogical objectives, and delivery format. Platform coordinators match verified trainers and issue transparent price quotes.
            </p>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Programme Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Hands-on Cybersecurity & Ethical Web Defense Workshop"
                  required
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Subject Domain</label>
                  <select
                    className="input-field"
                    value={reqDomain}
                    onChange={(e) => setReqDomain(e.target.value as any)}
                    style={{ width: '100%', height: '38px' }}
                  >
                    <option value="technology">Technology & AI</option>
                    <option value="coding">Practical Coding & Wasm</option>
                    <option value="finance">Financial Literacy & FinTech</option>
                    <option value="professional">Professional Development</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Target Grade Level</label>
                  <select
                    className="input-field"
                    value={reqGradeRange}
                    onChange={(e) => setReqGradeRange(e.target.value)}
                    style={{ width: '100%', height: '38px' }}
                  >
                    <option value="Grade 6-8">Grade 6-8 (Middle School)</option>
                    <option value="Grade 9-10">Grade 9-10 (Secondary)</option>
                    <option value="Grade 11-12">Grade 11-12 (Higher Secondary)</option>
                    <option value="College/Undergrad">College / Polytechnic</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Approx. Cohort Size</label>
                  <input
                    type="number"
                    className="input-field"
                    value={reqCohortSize}
                    onChange={(e) => setReqCohortSize(e.target.value)}
                    min="10"
                    max="500"
                    required
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Delivery Format</label>
                  <select
                    className="input-field"
                    value={reqFormat}
                    onChange={(e) => setReqFormat(e.target.value as any)}
                    style={{ width: '100%', height: '38px' }}
                  >
                    <option value="in_person">In-Person (On-Campus)</option>
                    <option value="online">Interactive Online (Live)</option>
                    <option value="hybrid">Hybrid (Lab + Online)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Learning Objectives & Syllabus Scope</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={reqObjectives}
                  onChange={(e) => setReqObjectives(e.target.value)}
                  placeholder="Describe practical skills your students need to demonstrate..."
                  required
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Preferred Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={reqStartDate}
                    onChange={(e) => setReqStartDate(e.target.value)}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Preferred End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={reqEndDate}
                    onChange={(e) => setReqEndDate(e.target.value)}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Campus Location / Facility Address</label>
                <input
                  type="text"
                  className="input-field"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  placeholder="e.g. DPTS Main Auditorium, Mathura Road, New Delhi"
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Budget Ceiling (INR ₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={reqBudgetRupees}
                  onChange={(e) => setReqBudgetRupees(e.target.value)}
                  min="5000"
                  step="1000"
                  style={{ width: '100%', height: '38px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsRequestModalOpen(false)}
                  style={{ height: '38px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ height: '38px', padding: '0 20px', fontWeight: 700 }}>
                  <Send size={14} />
                  <span>Submit Training Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
