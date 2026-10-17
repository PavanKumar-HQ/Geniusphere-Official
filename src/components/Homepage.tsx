import React from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Shield,
  ArrowRight,
  BookOpen,
  Terminal,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  Award,
  School,
  Cpu,
  TrendingUp,
  Code,
  Briefcase,
} from 'lucide-react';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, slug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate, currentUserId }) => {
  const publishedCourses = db.getCourses({ publishedOnly: true });
  const allLabs = db.getLabDefinitions();
  const userProgress = db.getUserProgress(currentUserId);

  const getDomainCount = (domain: string) => {
    return publishedCourses.filter((c) => c.domain === domain).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Section 2 - Exact Specification Copy)        */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '64px 24px 56px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
              color: 'var(--brand-primary)',
              fontSize: 'var(--text-meta)',
              fontWeight: 700,
            }}
          >
            <Shield size={14} />
            <span>Geniusphere Learning Platform</span>
          </div>

          {/* Headline (Exact specification copy) */}
          <h1
            style={{
              fontSize: 'var(--text-display)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Learn by doing. Build real skills.
          </h1>

          {/* Supporting sentence (Exact specification copy) */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: '640px',
            }}
          >
            Explore technology, finance, professional skills, and programming through practical lessons and interactive experiences.
          </p>

          {/* Actions (Exact specification actions) */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('catalogue')}
              style={{ height: '44px', padding: '0 22px', fontSize: 'var(--text-body)' }}
            >
              <BookOpen size={16} />
              <span>Explore Courses</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate('labs')}
              style={{ height: '44px', padding: '0 22px', fontSize: 'var(--text-body)' }}
            >
              <Terminal size={16} />
              <span>Explore Labs</span>
            </button>
          </div>

          {/* Streak & XP Ribbon */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="streak-pill">
              <Flame size={14} />
              <span>{userProgress.streak_days}-Day Streak</span>
            </div>
            <div className="xp-pill">
              <Zap size={14} />
              <span>{userProgress.xp.toLocaleString()} XP Points</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FEATURED LEARNING PATHS                                   */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '56px 24px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
              Four Core Educational Disciplines
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              Curated curricula designed to build real-world capability across modern fields.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Technology */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: '3px solid var(--brand-primary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)' }}>
                  <Cpu size={20} />
                </div>
                <span className="badge badge-brand">{getDomainCount('technology')} Courses</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Technology</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Artificial intelligence, blockchain ledgers, IoT edge computing, and defensive cybersecurity.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'technology')}
                style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
              >
                <span>Browse Technology</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Coding & Programming */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: '3px solid var(--brand-accent)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)' }}>
                  <Code size={20} />
                </div>
                <span className="badge badge-accent">{getDomainCount('coding')} Courses</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Coding & Programming</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                From computational logic and algorithms to full-stack web applications and debugging.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'coding')}
                style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
              >
                <span>Browse Coding</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Finance */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: '3px solid var(--warning)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
                  <TrendingUp size={20} />
                </div>
                <span className="badge badge-warning">{getDomainCount('finance')} Courses</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Finance</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Financial markets, algorithmic trading models, cryptocurrency risk, and FinTech systems.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'finance')}
                style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
              >
                <span>Browse Finance</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Professional Skills */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: '3px solid var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subdued)', color: 'var(--text-primary)' }}>
                  <Briefcase size={20} />
                </div>
                <span className="badge badge-neutral">{getDomainCount('professional')} Courses</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Professional Skills</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Executive prioritization, high-impact communication, and technical leadership.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'professional')}
                style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
              >
                <span>Browse Skills</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE LABS PREVIEW (Section 2 Order)                 */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '6px' }}>
              <Terminal size={14} />
              <span>HANDS-ON ENVIRONMENTS</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, margin: 0 }}>
              Interactive Simulations & Sandboxes
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', marginTop: '4px', margin: 0 }}>
              Test theories with live inputs, browser cryptographic hashing, sensor telemetry, and isolated code runners.
            </p>
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={() => onNavigate('labs')}
            style={{ height: '38px', padding: '0 16px', fontSize: 'var(--text-meta)' }}
          >
            <span>View All {allLabs.length} Labs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {allLabs.slice(0, 4).map((lab) => (
            <div
              key={lab.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-brand" style={{ textTransform: 'capitalize' }}>
                    {lab.category}
                  </span>
                  <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                    {lab.interaction_type}
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {lab.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {lab.summary}
                </p>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  <span>{lab.duration_minutes} min</span>
                </span>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ height: '34px', padding: '0 12px', fontSize: 'var(--text-meta)' }}
                  onClick={() => onNavigate('lab-workspace', lab.slug)}
                >
                  <span>Launch Lab</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOW LEARNING WORKS (3 Visual Steps - Section 2 Order)     */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
              How Learning Works on Geniusphere
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              A structured 3-step learning cycle connecting fundamental theory to verifiable capability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Step 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-surface)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Master Core Concepts</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Explore 27 approved curricular subjects organized into modular lessons, video instruction, and curated study notes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-accent-surface)',
                  color: 'var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Practice in Interactive Labs</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Test models in bounded simulations, compute cryptographic SHA-256 hashes, and run code in isolated sandboxes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-bg)',
                  color: 'var(--warning-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Earn Verifiable Credentials</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Track database-recorded progress and generate authentic completion certificates with unique serial hashes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. VERIFIED ACHIEVEMENTS PREVIEW (Section 2 Order)            */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div
          className="card"
          style={{
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-accent)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '8px' }}>
              <Award size={14} />
              <span>VERIFIED CREDENTIALS</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '12px' }}>
              Evidence-Backed Certificates
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
              Every completed course unlocks an authentic, verifiable certificate with unique SHA-256 verification hashes, recorded grade, and specific learning outcomes for student portfolios.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Zero fabricated metrics or automated unearned claims</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Verifiable digital credentials exported directly to resumes</span>
              </div>
            </div>
          </div>

          {/* Certificate Mockup Card */}
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--warning-border)',
              backgroundColor: 'var(--bg-canvas)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning-text)', letterSpacing: '0.06em' }}>
              GENIUSPHERE CERTIFICATE OF COMPLETION
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Cybersecurity & Defensive Web Security
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Awarded to Aarav Patel • Score: 100% • Verified
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              HASH: 8f9b2a...e7c41d
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CONCISE SCHOOL & EDUCATOR SECTION (Section 2 Order)        */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '56px 24px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '6px' }}>
              <School size={14} />
              <span>CLASSROOM DEPLOYMENT</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
              Built for Schools, Teachers & Cohorts
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              Structured educator tools with 8-character join codes, submission evaluation, and minor privacy compliance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Classroom Join Codes</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Teachers generate 8-character alphanumeric join codes for cohorts with configurable expiration windows.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Row-Level Gradebooks</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Review real student lab attempts, assignment submissions, test results, and timestamped progress.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700 }}>Minor Privacy Safeguards</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Strict compliance with DPDP Act 2023 with verifiable parental consent workflows for learners under 18.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. COMPACT FOOTER (Section 2 Order)                           */}
      {/* ============================================================ */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '36px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: 'var(--text-meta)', color: 'var(--text-muted)' }}>
          <div>© 2026 Geniusphere. Evidence-Backed Educational Platform.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button type="button" onClick={() => onNavigate('catalogue')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>Courses</button>
            <button type="button" onClick={() => onNavigate('labs')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>Labs</button>
            <button type="button" onClick={() => onNavigate('resources')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>Resources</button>
            <button type="button" onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>About</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
