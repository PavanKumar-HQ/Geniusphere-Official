// ====================================================================
// Geniusphere 2.0 — Privacy Policy & Terms of Service (DPDP Act 2023 & COPPA)
// Formal Institutional Safeguards, Sovereign Data Ownership & Legal Rights
// ====================================================================

import React, { useState } from 'react';
import {
  Scale,
  ArrowLeft,
} from 'lucide-react';

interface LegalPrivacyTermsViewProps {
  initialTab?: 'privacy' | 'terms';
  onNavigateHome: () => void;
}

export const LegalPrivacyTermsView: React.FC<LegalPrivacyTermsViewProps> = ({
  initialTab = 'privacy',
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px', width: '100%' }}>
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
          {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
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
              <Scale size={22} />
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Legal & Safeguarding Charter
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Official regulatory commitments under the Digital Personal Data Protection (DPDP) Act 2023, COPPA, and FERPA standards.
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
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: activeTab === 'privacy' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'privacy' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: activeTab === 'terms' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'terms' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {activeTab === 'privacy' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>VERIFIED OCTOBER 2026</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DPDP Act 2023 · COPPA · FERPA</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Geniusphere Data Protection & Privacy Policy
              </h2>
            </div>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                1. Principles of Sovereign Data Minimization
              </h3>
              <p style={{ margin: 0 }}>
                Geniusphere adheres strictly to the principle of purpose specification and data minimization. We only collect the minimal verifiable attributes necessary to deliver accredited computer science, finance, and professional learning. Interactive simulations and coding sandboxes execute client-side via in-browser WebAssembly runtimes with zero third-party telemetry beacons.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                2. Protection of Minor Learners (&lt; 18 Years)
              </h3>
              <p style={{ margin: 0, marginBottom: '12px' }}>
                In compliance with Section 9 of the DPDP Act 2023 and COPPA provisions:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>No targeted commercial advertising, profiling, or behavioral tracking is ever conducted on student accounts.</li>
                <li>Verifiable parental or legal guardian consent is cryptographically recorded before unblocking community participation.</li>
                <li>Guardians retain real-time access to inspect, export, or revoke consent via the sovereign Parent Portal.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                3. Client-Side Cryptographic Evidence Retention
              </h3>
              <p style={{ margin: 0 }}>
                Student lab completions, unit tests, and Cambridge International (CIE) evidence submissions are hashed using SHA-256 and chained into tamper-evident local audit records. Institutional examiners can verify authentic competence without requiring persistent storage of sensitive biometrics or private files on external commercial clouds.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                4. Your Rights under Data Protection Regulations
              </h3>
              <p style={{ margin: 0, marginBottom: '10px' }}>
                Learners, educators, and guardians have the absolute right to:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Right to Access</div>
                  <div style={{ fontSize: '0.84rem' }}>Export your entire learning ledger, code snippets, and certificates in 1-click JSON or CSV.</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Right to Erasure</div>
                  <div style={{ fontSize: '0.84rem' }}>Permanent deletion of local database records with zero ghost retention or dark patterns.</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Right to Grievance</div>
                  <div style={{ fontSize: '0.84rem' }}>Direct contact with our designated Data Protection Officer at privacy@geniusphere.tech.</div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>ENTERPRISE & ACADEMIC</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Effective October 2026</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Geniusphere Institutional Terms of Service
              </h2>
            </div>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                1. Institutional Software License & Deployment
              </h3>
              <p style={{ margin: 0 }}>
                Geniusphere licenses its interactive educational curriculum, deterministic simulation runtimes, and educator gradebook software to verified institutions, colleges, and independent students. Users agree to access the software through authorized client interfaces without reverse-engineering automated grading rubrics.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                2. Academic Integrity & Cryptographic Verifications
              </h3>
              <p style={{ margin: 0, marginBottom: '8px' }}>
                Certificates and verifiable CIE achievements issued by Geniusphere represent genuine hands-on mastery. Attempting to tamper with client hashes, bypass unit tests, or falsify educator inspection records constitutes a material violation of academic honor codes and results in immediate credential revocation.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                3. Service Availability & Offline Operation Guarantee
              </h3>
              <p style={{ margin: 0 }}>
                Geniusphere is engineered with offline-first client persistence. While cloud-assisted synchronization is provided during network availability, core simulations, code sandboxes, and reading modules are guaranteed to operate client-side without dependency on centralized server uptime.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                4. Institutional Governance & Contact
              </h3>
              <p style={{ margin: 0 }}>
                Geniusphere is developed under academic incubation at PES University Centre for Innovation &amp; Entrepreneurship (CIE), Bengaluru, Karnataka, India. Legal and administrative notices should be addressed to legal@geniusphere.tech.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
