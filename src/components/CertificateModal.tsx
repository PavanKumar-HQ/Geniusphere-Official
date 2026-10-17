import React from 'react';
import { Certificate } from '../types';
import {
  X,
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', backgroundColor: '#070D1F', padding: '32px' }}
      >
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
            <Award size={22} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>VERIFIED COURSE COMPLETION CERTIFICATE</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Printable Area */}
        <div className="certificate-container" style={{ margin: '0 auto', maxWidth: '720px' }}>
          <div className="certificate-border-inner">
            {/* Header Brand */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <ShieldCheck size={22} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                GENIUSPHERE
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--brand-joy-of-quest)', textTransform: 'uppercase', marginBottom: '14px' }}>
              CERTIFICATE OF ACCOMPLISHMENT & MASTERY
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              This certifies that
            </p>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.01em' }}>
              {certificate.student_name}
            </h2>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              has successfully completed all 10 modules, interactive concept visualizers, sandbox simulations, and assessments for
            </p>

            <div style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'inline-block', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA' }}>
                {certificate.course_title}
              </span>
            </div>

            {/* Skills Tags */}
            {certificate.skills_acquired && certificate.skills_acquired.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {certificate.skills_acquired.map((s, idx) => (
                  <span key={idx} className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid rgba(245, 158, 11, 0.25)', flexWrap: 'wrap', gap: '16px', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Issue Date</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>{certificate.issue_date}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Certificate ID</div>
                <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#22D3EE' }}>{certificate.id}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cryptographic Verification Hash</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34D399', maxWidth: '280px', wordBreak: 'break-all' }}>
                  {certificate.verification_hash}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#10B981', fontSize: '0.75rem', marginTop: '4px', fontWeight: 700 }}>
                  <CheckCircle2 size={13} />
                  <span>Authoritative Server Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-accent"
            style={{ height: '42px', padding: '0 24px' }}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
