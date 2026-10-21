// ====================================================================
// Geniusphere 2.0 — Contact & Community Portal
// Direct Institutional Inquiries, Educator Consultations & Community Guidelines
// ====================================================================

import React, { useState } from 'react';
import {
  Mail,
  Building,
  Send,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';

interface ContactCommunityViewProps {
  db: InMemoryDatabase;
  initialTab?: 'contact' | 'community';
  onNavigateHome: () => void;
  onNavigateCatalogue: () => void;
}

export const ContactCommunityView: React.FC<ContactCommunityViewProps> = ({
  db,
  initialTab = 'contact',
  onNavigateHome,
  onNavigateCatalogue,
}) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'community'>(initialTab);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [inquiryType, setInquiryType] = useState<'institution' | 'educator' | 'student' | 'technical'>('institution');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields before submitting.');
      return;
    }
    setErrorMsg(null);

    // Record submission into in-memory audit log for genuine operational traceability
    try {
      db.logAuditEvent({
        organization_id: null,
        actor_id: 'anonymous-contact',
        action_type: 'CONTACT_SUBMISSION',
        resource_type: 'institutional_inquiry',
        resource_id: `inq-${Date.now()}`,
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
        details: {
          name,
          email,
          organization,
          inquiry_type: inquiryType,
          message_length: message.length,
        },
      });
    } catch {
      // safe fallback
    }

    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px', width: '100%' }}>
      {/* Navigation Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={onNavigateHome}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem' }}>
          {activeTab === 'contact' ? 'Contact & Inquiries' : 'Community Standards'}
        </span>
      </div>

      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'contact' ? <Mail size={22} /> : <Users size={22} />}
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {activeTab === 'contact' ? 'Contact & Institutional Relations' : 'Student & Educator Community'}
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Connect with the academic incubation team at PES University CIE, Bengaluru.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-canvas)',
            padding: '4px',
            borderRadius: '100px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveTab('contact'); setSubmitted(false); }}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: activeTab === 'contact' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'contact' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Contact Team
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('community')}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: activeTab === 'community' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'community' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Community Standards
          </button>
        </div>
      </div>

      {activeTab === 'contact' ? (
        <div
          className="contact-community-grid"
        >
          {/* Left Column: Direct Institutional Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building size={20} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Incubation Headquarters
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Centre for Innovation &amp; Entrepreneurship (CIE),<br />
                PES University 13th Floor, BE Block,<br />
                100 Feet Ring Road, BSK III Stage,<br />
                Bengaluru, Karnataka 560085, India
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Official Pilot Inquiries: contact@geniusphere.tech
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Curriculum Pilot Desk
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Schools and universities can request managed institution onboarding with custom classroom join codes and Cambridge CIE evidence audit exports.
              </p>
              <button
                type="button"
                onClick={onNavigateCatalogue}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Explore 40 Canonical Courses →
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(67, 168, 91, 0.1)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Inquiry Dispatched Successfully
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Thank you, <strong>{name}</strong>. Your inquiry has been registered in the platform audit queue. Our academic engineering team will respond to <strong>{email}</strong> within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Direct Message to Platform Operations
                </h3>

                {errorMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Sharma"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@institution.ac.in"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Institution / School Name
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Delhi Public Technical School"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Inquiry Category *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="institution">Institutional Pilot Deployment</option>
                      <option value="educator">Educator Gradebook &amp; Curriculum</option>
                      <option value="student">Student Learner Support</option>
                      <option value="technical">Technical Verification &amp; Audits</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your student cohort size, curriculum interest, or partnership question..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-canvas)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    height: '44px',
                    borderRadius: '100px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Send size={16} />
                  <span>Send Institutional Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Community Tab */
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>COLLEGIAL STANDARDS</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Safe Academic Discourse</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Geniusphere Community Principles
            </h2>
          </div>

          <p style={{ margin: 0 }}>
            Geniusphere connects secondary students, university learners, and technical educators across India and global academic hubs. Our community is founded on genuine peer review, evidence-backed problem solving, and zero harassment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                1. Respect Academic Work &amp; Attribution
              </h4>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>
                Share code samples, SQL queries, and simulation observations with appropriate context. Credit fellow students and open-source contributors when adapting logic.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                2. Safeguarding Minor Learners
              </h4>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>
                Soliciting personal offline contact information, social handles, or unverified external links from minor learners is strictly prohibited and results in immediate account suspension.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                3. Constructive Peer Grading
              </h4>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>
                When reviewing code and system designs in classrooms, provide constructive feedback that highlights architectural strengths and verifiable improvements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
