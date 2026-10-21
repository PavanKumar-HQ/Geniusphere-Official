import React, { Suspense, useCallback } from 'react';
import { getStandaloneLab } from '../labs/registry';
import { LabOrientationGuard } from './lab/LabOrientationGuard';

const LabLoadingSpinner: React.FC<{ labName: string }> = ({ labName }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '500px', gap: '20px',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1535 50%, #0a0f1e 100%)',
    borderRadius: '0 0 16px 16px',
  }}>
    <div style={{
      width: '56px', height: '56px',
      border: '3px solid rgba(59,240,255,0.12)', borderTop: '3px solid #3BF0FF',
      borderRadius: '50%', animation: 'labspin 0.9s linear infinite',
    }} />
    <style>{`@keyframes labspin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#3BF0FF', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>
        INITIALISING LAB ENVIRONMENT
      </div>
      <div style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>
        {labName}
      </div>
    </div>
  </div>
);

const UnknownLab: React.FC<{ slug: string; onClose: () => void }> = ({ slug, onClose }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '400px', gap: '16px', padding: '48px',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 100%)',
    borderRadius: '16px', border: '1px solid rgba(124,107,255,0.2)', textAlign: 'center',
  }}>
    <div style={{ fontSize: '3rem' }}>🔬</div>
    <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Lab Not Found</h3>
    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', maxWidth: '400px', lineHeight: 1.6, margin: 0 }}>
      No lab is registered for slug: <code style={{ color: '#7c6bff' }}>{slug}</code>
    </p>
    <button onClick={onClose} style={{
      padding: '10px 24px', background: 'linear-gradient(135deg, #7c6bff, #a78bfa)',
      color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
    }}>
      Back to Course
    </button>
  </div>
);

export interface EmbeddedLabRendererProps {
  labSlug: string;
  onClose: () => void;
  courseTitle?: string;
}

export const EmbeddedLabRenderer: React.FC<EmbeddedLabRendererProps> = ({ labSlug, onClose, courseTitle }) => {
  const labMeta = getStandaloneLab(labSlug);
  const LabApp = labMeta?.component;
  const labDisplayName = labMeta?.name || courseTitle || labSlug;
  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  if (!LabApp) {
    return <UnknownLab slug={labSlug} onClose={handleClose} />;
  }

  return (
    <LabOrientationGuard labTitle={labDisplayName}>
      <div style={{
        position: 'relative', width: '100%', minHeight: '620px',
      borderRadius: '14px', overflow: 'hidden',
      border: '1px solid rgba(59,240,255,0.14)',
      boxShadow: '0 0 50px rgba(59,240,255,0.07), 0 25px 70px rgba(0,0,0,0.5)',
    }}>
      {/* Lab header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 18px',
        background: 'linear-gradient(135deg, #06091a 0%, #0c1235 100%)',
        borderBottom: '1px solid rgba(59,240,255,0.13)',
        position: 'relative', zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 9px', background: 'rgba(59,240,255,0.08)',
            border: '1px solid rgba(59,240,255,0.22)', borderRadius: '5px',
            fontSize: '0.62rem', fontFamily: 'monospace', color: '#3BF0FF',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            🔬 INTERACTIVE LAB
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.02em' }}>
            {labDisplayName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
            background: '#00FFA3', boxShadow: '0 0 7px #00FFA3',
            animation: 'labPulse 2s ease-in-out infinite',
          }} />
          <style>{`@keyframes labPulse { 0%, 100% { opacity:1; } 50% { opacity:0.35; } }`}</style>
          <span style={{ fontSize: '0.63rem', fontFamily: 'monospace', color: '#00FFA3', fontWeight: 700, letterSpacing: '0.15em' }}>
            LIVE
          </span>
          <button
            onClick={handleClose}
            title="Exit lab and return to video lectures"
            style={{
              marginLeft: '10px', padding: '4px 12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: 'rgba(255,255,255,0.55)',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'all 0.18s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.14)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.28)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            ✕ Exit Lab
          </button>
        </div>
      </div>

      {/* The real animated lab app rendered inline */}
      <div style={{ position: 'relative', height: '650px', minHeight: '650px', width: '100%' }}>
        <Suspense fallback={<LabLoadingSpinner labName={labDisplayName} />}>
          <LabApp onClose={handleClose} />
        </Suspense>
      </div>
    </div>
    </LabOrientationGuard>
  );
};

export default EmbeddedLabRenderer;
