import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { FeedbackAlert } from './ui/FeedbackAlert';
import {
  School,
  CheckCircle2,
  Shield,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface PilotApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (referenceId: string) => void;
}

export const PilotApplicationModal: React.FC<PilotApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('school');
  const [contactName, setContactName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cohortSize, setCohortSize] = useState('100');
  const [tracks, setTracks] = useState<string[]>(['technology', 'finance']);
  const [includeSafeguardingPack, setIncludeSafeguardingPack] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleTrack = (trackId: string) => {
    setTracks((prev) =>
      prev.includes(trackId) ? prev.filter((t) => t !== trackId) : [...prev, trackId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!institutionName.trim()) {
      setErrorMsg('Please specify your school, college, or institution name.');
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg('Please enter the name of the lead educator or administrator.');
      return;
    }
    if (!officialEmail.trim() || !officialEmail.includes('@')) {
      setErrorMsg('Please provide a valid institutional or professional email address.');
      return;
    }
    if (tracks.length === 0) {
      setErrorMsg('Please select at least one curriculum track for the pilot cohort.');
      return;
    }

    const refId = `PILOT-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refId);
    if (onSuccess) {
      onSuccess(refId);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setInstitutionName('');
    setContactName('');
    setOfficialEmail('');
    setPhoneNumber('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <School size={20} color="var(--brand-primary)" />
          <span>Apply for Institutional Pilot Cohort</span>
        </div>
      }
      description="Zero-cost 4–8 week pilot for Indian schools, PU colleges, and undergraduate institutions."
      maxWidth="620px"
    >
      {submittedRef ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0' }}>
          <FeedbackAlert
            type="success"
            title="Pilot Cohort Application Received!"
          >
            Thank you, {contactName}. Your pilot application has been logged and assigned Reference ID:{' '}
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{submittedRef}</strong>.
          </FeedbackAlert>

          <div
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              What Happens Next (Within 24 Hours):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>20-Minute Coordinator Setup:</strong> We will email you at <code>{officialEmail}</code> to schedule a 20-minute teacher demo.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>8-Character Cohort Join Codes:</strong> Generate zero-install classroom join codes for up to {cohortSize} learners.
                </span>
              </div>

              {includeSafeguardingPack && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Shield size={16} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>
                    <strong>DPDP Act 2023 Consent Pack:</strong> Plain-language parental consent documentation for minors under 18 years.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <FileText size={16} color="var(--brand-secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>Evidence-of-Learning Report:</strong> Outcome report tracking sandbox completion, mastery, and attempt quality.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="primary" onClick={handleReset}>
              Done & Return to Homepage
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <FeedbackAlert type="danger" title="Validation Error">
              {errorMsg}
            </FeedbackAlert>
          )}

          {/* Quick Value Ribbon */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--brand-primary)',
            }}
          >
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Pilot Guarantee:</strong> Zero installation required. Runs inside any modern browser on school desktop labs or student laptops.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                School / College Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Delhi Public School, Bengaluru"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Institution Type *
              </label>
              <select
                className="form-input"
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="school">School (Grades 8–10 / High School)</option>
                <option value="pu_college">PU College / Senior Secondary (Grades 11–12)</option>
                <option value="undergraduate">College / University (Undergraduate)</option>
                <option value="vocational">Polytechnic / Vocational Institute</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Lead Educator / Coordinator Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Dr. Meenakshi Sundaram"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Official Email Address *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="coordinator@institution.edu.in"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Phone / WhatsApp (For Demo Coordination)
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Projected Student Cohort Size
              </label>
              <select
                className="form-input"
                value={cohortSize}
                onChange={(e) => setCohortSize(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="30">1 Classroom (~30 students)</option>
                <option value="60">2 Classrooms (~60 students)</option>
                <option value="120">1 Grade Section (~120 students)</option>
                <option value="300">Entire Stream / Batch (~300 students)</option>
                <option value="500+">Multi-Section (500+ students)</option>
              </select>
            </div>
          </div>

          {/* Desired Tracks */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Focus Curriculum Tracks (Min. 1) *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { id: 'technology', label: 'Technology & Cyber Safety', desc: 'AI, Blockchain, Web Security', color: '#0284C7', bg: 'rgba(48, 178, 231, 0.12)', icon: '🤖' },
                { id: 'finance', label: 'Applied Indian Finance', desc: 'UPI Safety, Budgeting, SIPs', color: '#D97706', bg: 'rgba(253, 185, 19, 0.15)', icon: '💳' },
                { id: 'coding', label: 'Programming Logic', desc: 'Browser Code Sandboxes', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)', icon: '⚡' },
                { id: 'professional', label: 'Professional Skills', desc: 'Communication & Leadership', color: '#15803D', bg: 'rgba(117, 181, 67, 0.15)', icon: '🤝' },
              ].map((trk) => {
                const selected = tracks.includes(trk.id);
                return (
                  <button
                    key={trk.id}
                    type="button"
                    onClick={() => toggleTrack(trk.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      textAlign: 'left',
                      border: selected ? `2px solid ${trk.color}` : '1.5px solid var(--border-subtle)',
                      backgroundColor: selected ? trk.bg : 'var(--bg-canvas)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: selected ? `0 4px 12px ${trk.color}25` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{trk.icon}</span>
                      {selected && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: trk.color, backgroundColor: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: `1px solid ${trk.color}` }}>
                          SELECTED
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: selected ? trk.color : 'var(--text-primary)' }}>
                      {trk.label}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {trk.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safeguarding pack toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={includeSafeguardingPack}
              onChange={(e) => setIncludeSafeguardingPack(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
            />
            <span>
              Include DPDP Act 2023 verifiable parental consent documentation pack for minors
            </span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<ArrowRight size={15} />}>
              Submit Pilot Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
