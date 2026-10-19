import React, { Suspense, lazy, useCallback } from 'react';

// Lazy-import all real lab apps
const AILab = lazy(() => import('../../Geniusphere-main/labs/geniusphere-ai-lab/App'));
const BlockchainLab = lazy(() => import('../../Geniusphere-main/labs/trustlink-blockchain-lab/App'));
const IoTLab = lazy(() => import('../../Geniusphere-main/labs/iot-cybersecurity-lab/App'));
const PrivacyLab = lazy(() => import('../../Geniusphere-main/labs/digital-privacy-&-footprint-lab/App'));
const CybersecurityLab = lazy(() => import('../../Geniusphere-main/Cybersecurity-For-Students-main/App'));
const MicrosoftOfficeLab = lazy(() => import('../../Geniusphere-main/labs/microsoft-office---real-world-skills-lab/App'));
const IntroFinanceLab = lazy(() => import('../../Geniusphere-main/labs/introduction-to-finance-lab/App'));
const StockMarketLab = lazy(() => import('../../Geniusphere-main/labs/stock-market-basics---interactive-lab/App'));
const CryptoLab = lazy(() => import('../../Geniusphere-main/labs/cryptolab_-how-digital-money-works/App'));
const FintechLab = lazy(() => import('../../Geniusphere-main/labs/fintech-discovery-lab/App'));
const GlobalEconomicsLab = lazy(() => import('../../Geniusphere-main/labs/global-economics-simulation-lab/App'));
const BankingLab = lazy(() => import('../../Geniusphere-main/labs/banking-accounts-lab/App'));
const CommunicationLab = lazy(() => import('../../Geniusphere-main/labs/communication-pro_-interactive-lab/App'));
const ProfessionalSkillsLab = lazy(() => import('../../Geniusphere-main/labs/professional-skills-lab_-how-success-really-works/App'));
const SocialProfileLab = lazy(() => import('../../Geniusphere-main/labs/social-profile-development-lab/App'));

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

type LabFC = React.LazyExoticComponent<React.ComponentType<{ onClose?: () => void }>>;

// All slugs from canonical-curriculum.ts → real lab app
const LAB_SLUG_MAP: Record<string, LabFC> = {
  // Technology
  'ai-classification-playground':    AILab as LabFC,
  'blockchain-block-builder':         BlockchainLab as LabFC,
  'microsoft-productivity-exercise':  MicrosoftOfficeLab as LabFC,
  'defensive-web-security-lab':       CybersecurityLab as LabFC,
  'programming-fundamentals-sandbox': AILab as LabFC,
  'iot-sensor-threshold-engine':      IoTLab as LabFC,
  'digital-privacy-decision-lab':     PrivacyLab as LabFC,
  // Finance
  'financial-market-explorer':        IntroFinanceLab as LabFC,
  'portfolio-risk-analyzer':          StockMarketLab as LabFC,
  'crypto-ledger-simulator':          CryptoLab as LabFC,
  'fintech-discovery-lab':            FintechLab as LabFC,
  'global-economics-policy-simulator':GlobalEconomicsLab as LabFC,
  'financial-institution-flow':       BankingLab as LabFC,
  // Professional Skills
  'workplace-communication-simulator':CommunicationLab as LabFC,
  'professional-skills-lab':          ProfessionalSkillsLab as LabFC,
  'workplace-conflict-simulator':     ProfessionalSkillsLab as LabFC,
  'system-architecture-designer':     AILab as LabFC,
  'social-profile-lab':               SocialProfileLab as LabFC,
};

const LAB_NAMES: Record<string, string> = {
  'ai-classification-playground':    'AI Simulation Engine v2.1',
  'blockchain-block-builder':         'TrustLink Blockchain Lab',
  'microsoft-productivity-exercise':  'Microsoft Office Skills Lab',
  'defensive-web-security-lab':       'Cybersecurity Defense Lab',
  'programming-fundamentals-sandbox': 'Programming Fundamentals Lab',
  'iot-sensor-threshold-engine':      'IoT Sensor Threshold Lab',
  'digital-privacy-decision-lab':     'Digital Privacy & Footprint Lab',
  'financial-market-explorer':        'Introduction to Finance Lab',
  'portfolio-risk-analyzer':          'Stock Market Interactive Lab',
  'crypto-ledger-simulator':          'CryptoLab — Digital Money Works',
  'fintech-discovery-lab':            'FinTech Discovery Lab',
  'global-economics-policy-simulator':'Global Economics Simulation',
  'financial-institution-flow':       'Banking Accounts Lab',
  'workplace-communication-simulator':'Communication Pro Lab',
  'professional-skills-lab':          'Professional Skills Lab',
  'workplace-conflict-simulator':     'Professional Skills Lab',
  'system-architecture-designer':     'Startup Ideation & Architecture Lab',
  'social-profile-lab':               'Social Profile Development Lab',
};

export interface EmbeddedLabRendererProps {
  labSlug: string;
  onClose: () => void;
  courseTitle?: string;
}

export const EmbeddedLabRenderer: React.FC<EmbeddedLabRendererProps> = ({ labSlug, onClose, courseTitle }) => {
  const LabApp = LAB_SLUG_MAP[labSlug];
  const labDisplayName = LAB_NAMES[labSlug] || courseTitle || labSlug;
  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  if (!LabApp) {
    return <UnknownLab slug={labSlug} onClose={handleClose} />;
  }

  return (
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
      <div style={{ position: 'relative', minHeight: '570px' }}>
        <Suspense fallback={<LabLoadingSpinner labName={labDisplayName} />}>
          <LabApp onClose={handleClose} />
        </Suspense>
      </div>
    </div>
  );
};

export default EmbeddedLabRenderer;
