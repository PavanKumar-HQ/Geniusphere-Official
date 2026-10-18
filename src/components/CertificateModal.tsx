import React from 'react';
import { Certificate } from '../types';
import {
  X,
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MascotSphere } from './MascotSphere';

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
        style={{
          maxWidth: '780px',
          backgroundColor: '#FAFAF4',
          border: '1.5px solid #E5F0DF',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#43A85B' }}>
            <Award size={22} />
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#26352A', fontFamily: 'var(--font-heading)' }}>
              VERIFIED COURSE COMPLETION CERTIFICATE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5F0DF',
              color: '#26352A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Celebrating Mascot Banner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <MascotSphere
            pose="celebrating"
            size={76}
            speechBubble="Milestone Unlocked! Official verified credential earned! 🎉"
          />
        </div>

        {/* Certificate Printable Area */}
        <div className="certificate-container" style={{ margin: '0 auto', maxWidth: '720px', backgroundColor: '#FFFFFF', border: '3px solid #43A85B' }}>
          <div className="certificate-border-inner" style={{ border: '1.5px dashed #D5CCC0' }}>
            {/* Header Brand */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#43A85B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <ShieldCheck size={22} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#26352A', fontFamily: 'var(--font-heading)' }}>
                GENIUSPHERE
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', color: '#43A85B', textTransform: 'uppercase', marginBottom: '14px' }}>
              CERTIFICATE OF ACCOMPLISHMENT &amp; MASTERY
            </div>

            <p style={{ fontSize: '0.9rem', color: '#6B7C72', marginBottom: '16px' }}>
              This certifies that
            </p>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#26352A', marginBottom: '16px', letterSpacing: '-0.01em', fontFamily: 'var(--font-heading)' }}>
              {certificate.student_name}
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#6B7C72', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              has successfully completed all 10 modules, interactive concept visualizers, sandbox simulations, and assessments for
            </p>

            <div style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#E5F0DF', border: '1.5px solid #D5CCC0', display: 'inline-block', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#26352A', fontFamily: 'var(--font-heading)' }}>
                {certificate.course_title}
              </span>
            </div>

            {/* Skills Tags */}
            {certificate.skills_acquired && certificate.skills_acquired.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {certificate.skills_acquired.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#E5F0DF',
                      border: '1px solid #D5CCC0',
                      color: '#26352A',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid #E5F0DF', flexWrap: 'wrap', gap: '16px', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#6B7C72', fontWeight: 600 }}>Issue Date</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#26352A' }}>{certificate.issue_date}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7C72', marginTop: '6px', fontWeight: 600 }}>Certificate ID</div>
                <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#43A85B', fontWeight: 700 }}>{certificate.id}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#6B7C72', fontWeight: 600 }}>Cryptographic Verification Hash</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#26352A', maxWidth: '280px', wordBreak: 'break-all', fontWeight: 600 }}>
                  {certificate.verification_hash}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#43A85B', fontSize: '0.75rem', marginTop: '6px', fontWeight: 700 }}>
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
            className="btn-primary"
            style={{ height: '42px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
