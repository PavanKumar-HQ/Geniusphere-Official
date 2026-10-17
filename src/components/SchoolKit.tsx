import React, { useState } from 'react';
import { School, ShieldCheck, Download, FileText, KeyRound, Lock } from 'lucide-react';

interface SchoolKitProps {
  onOpenGradebook: () => void;
}

export const SchoolKit: React.FC<SchoolKitProps> = ({ onOpenGradebook }) => {
  const [downloadBanner, setDownloadBanner] = useState<string | null>(null);

  const handleDownloadPack = () => {
    const pack = {
      title: 'Geniusphere SchoolKit — Institutional Implementation Guide',
      version: '1.0.0',
      compliance: 'DPDP Act 2023 / Digital Personal Data Protection Rules 2025',
      infrastructure: 'PostgreSQL Row-Level Security Scoped Multi-Tenancy',
      curriculum_framework: {
        technology_subjects: 12,
        finance_subjects: 7,
        professional_subjects: 7,
      },
      classroom_protocol: {
        join_code_format: '8-Character High-Entropy Alphanumeric',
        default_expiration_days: 14,
        revocation: 'Instant teacher-initiated invalidation',
      },
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geniusphere-schoolkit-educator-guide.json';
    a.click();
    URL.revokeObjectURL(url);

    setDownloadBanner('SchoolKit Educator Guide package downloaded.');
    setTimeout(() => setDownloadBanner(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <School size={24} color="var(--brand-primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Geniusphere SchoolKit for Educators</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Operational guidelines, classroom onboarding, and safeguarding protocols for schools and colleges
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={handleDownloadPack}>
              <Download size={16} /> Download Educator Pack
            </button>
            <button type="button" className="btn-primary" onClick={onOpenGradebook}>
              Launch Teacher Gradebook
            </button>
          </div>
        </div>
      </div>

      {downloadBanner && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
          {downloadBanner}
        </div>
      )}

      {/* 4 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <KeyRound size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>1. Secure Classroom Enrollment</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            Teachers generate time-bounded 8-character join codes (`SEC2026A`) with automated expiration. Codes can be regenerated or revoked instantly to prevent unauthorized access.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ✓ Cryptographic randomness • ✓ Expiration enforcement • ✓ No duplicate memberships
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lock size={20} color="var(--success)" />
            <h3 style={{ fontSize: '1.1rem' }}>2. Multi-Tenant RLS Scoping</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            Every classroom, assignment, and student record is strictly isolated at the database layer using PostgreSQL Row-Level Security. Independent schools cannot inspect each other's cohorts.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ✓ Zero cross-tenant leakage • ✓ Database trigger verified • ✓ 42501 error rejection
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ShieldCheck size={20} color="#8B5CF6" />
            <h3 style={{ fontSize: '1.1rem' }}>3. DPDP 2023 Child Safeguarding</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            School-age minor accounts operate with verifiable parental consent. Verified guardians have oversight portals with full data export and instant consent revocation capabilities.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ✓ Verifiable consent • ✓ Data minimization • ✓ Account erasure controls
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FileText size={20} color="var(--warning)" />
            <h3 style={{ fontSize: '1.1rem' }}>4. Authoritative Assessments</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            All lab scores, attempts, and certificates are signed and verified server-side with SHA-256 hashes. Browser manipulation cannot forge student grades or completion flags.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ✓ Anti-tamper hashes • ✓ Deterministic grading • ✓ Immutable audit trails
          </div>
        </div>
      </div>
    </div>
  );
};
