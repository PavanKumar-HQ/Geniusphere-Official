import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { FunZoneSection } from './FunZoneSection';
import { HeroAnimationSandbox } from './HeroAnimationSandbox';
import { PilotApplicationModal } from './PilotApplicationModal';
import {
  Shield,
  ArrowRight,
  BookOpen,
  Terminal,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  School,
  Cpu,
  TrendingUp,
  Briefcase,
  Trophy,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
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

  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [audienceTab, setAudienceTab] = useState<'school' | 'college' | 'teacher' | 'parent'>('school');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getDomainCount = (domain: string) => {
    return publishedCourses.filter((c) => c.domain === domain).length;
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION (2-Column Responsive with Live Sandbox)       */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '48px 24px 56px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Mission, Value Prop, CTAs */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
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
              <span>Evidence-Backed Education Platform • India Pilot Ready</span>
            </div>

            {/* Headline matching Research Study Section 6 */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Practical skills, taught in class, measured clearly.
            </h1>

            {/* Supporting summary matching Research Study USP */}
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '560px',
              }}
            >
              For schools, PU colleges, colleges, and independent learners. An India-first practical skills platform for Technology, Finance, and Professional Skills—with teacher-controlled cohorts, zero-install browser sandboxes, and safeguarding-first analytics.
            </p>

            {/* Gamification Ribbon */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="streak-pill">
                <Flame size={14} />
                <span>{userProgress.streak_days}-Day Streak</span>
              </div>
              <div className="xp-pill">
                <Zap size={14} />
                <span>{userProgress.xp.toLocaleString()} XP Points</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <Trophy size={14} />
                <span>Leaderboard</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPilotModalOpen(true)}
                style={{ height: '44px', padding: '0 22px', fontSize: 'var(--text-body)' }}
              >
                <School size={16} />
                <span>Book a 20-min Pilot Demo</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('labs')}
                style={{ height: '44px', padding: '0 20px', fontSize: 'var(--text-body)' }}
              >
                <Terminal size={16} />
                <span>Explore 12 Sandboxes</span>
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue')}
                style={{ height: '44px', padding: '0 18px', fontSize: 'var(--text-body)' }}
              >
                <BookOpen size={16} />
                <span>Browse 27 Courses</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Hero Animation Sandbox with 5 modes */}
          <div>
            <HeroAnimationSandbox
              onLaunchLab={(slug) => onNavigate('lab-workspace', slug)}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. WHO WE SERVE (Dual Segment & Role Clarity - Section 6)    */}
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
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '6px' }}>
              <Users size={14} />
              <span>WHO IT SERVES</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
              Tailored for Indian Schools, PU Colleges & Universities
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              Practical learning pathways structured with clear age-appropriate boundaries, teacher oversight, and privacy governance.
            </p>
          </div>

          {/* Audience Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'school', label: 'Schools & PU Colleges (Ages 14–18)' },
              { id: 'college', label: 'Colleges & Universities (Ages 18+)' },
              { id: 'teacher', label: 'Teachers & Educators' },
              { id: 'parent', label: 'Parents & Guardians' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceTab(tab.id as any)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: audienceTab === tab.id ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  backgroundColor: audienceTab === tab.id ? 'var(--brand-surface)' : 'var(--bg-canvas)',
                  color: audienceTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: audienceTab === tab.id ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Cards */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-canvas)' }}>
            {audienceTab === 'school' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    School & PU College Cohorts (Grades 9–12)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Bridging foundational board syllabi with digital hygiene, foundational programming logic, UPI scam awareness, and ethical habits.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>DPDP Act 2023 Compliant:</strong> Verifiable parental consent ledger for all minors.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Quiet-Hours Safeguarding:</strong> Zero intrusive alerts between 8 PM and 8 AM.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Low-Bandwidth Friendly:</strong> Runs smoothly on older computer lab machines.</span>
                  </div>
                </div>
              </div>
            )}

            {audienceTab === 'college' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Undergraduate & Professional Campuses
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Career-aligned engineering sandboxes, real-world FinTech workflows, personal tax/budgeting, and resume-ready credentials.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Proof of Mastery:</strong> Cryptographically verified completion certificates.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Placement Cell Reporting:</strong> Exportable cohort competency matrix.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Applied Sandboxes:</strong> AI models, distributed ledgers, and web security.</span>
                  </div>
                </div>
              </div>
            )}

            {audienceTab === 'teacher' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Teachers & Faculty Champions
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Launch practical classes in under 5 minutes without installation or IT department dependencies.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Ready-to-Teach Kits:</strong> Starter slides, discussion guides, and rubrics.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Auto-Graded Checks:</strong> Instant visibility into student attempt quality.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>8-Character Join Codes:</strong> No student signups required for classroom labs.</span>
                  </div>
                </div>
              </div>
            )}

            {audienceTab === 'parent' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Parents & Lawful Guardians
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Peace of mind through ethical education: zero behavioral ad surveillance, verifiable consent, and progress visibility.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Zero Ad Profiling:</strong> No behavioral tracking or third-party ad pixels.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Consent Management:</strong> Review or withdraw consent at any time.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span><strong>Transparent Milestones:</strong> Real skills learned instead of game addiction.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. THREE CORE SKILL PILLARS (Section 4 & 6 of Research)      */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
            Three Core Practical Skill Pillars
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
            Structured around high-impact competencies needed for the 21st-century Indian economy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Pillar 1: Technology */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '4px solid var(--brand-primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)' }}>
                <Cpu size={22} />
              </div>
              <span className="badge badge-brand">{getDomainCount('technology') + getDomainCount('coding')} Courses</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>
              Technology & Programming Logic
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Browser-executable coding sandboxes, AI perception fundamentals, distributed blockchain ledgers, and defensive cybersecurity pipelines.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {['AI Literacy', 'Web Security', 'Algorithms', 'IoT Sensors'].map((tag) => (
                <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue', 'technology')}
              style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
            >
              <span>Explore Tech Tracks</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Pillar 2: Applied Indian Finance */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '4px solid var(--warning)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
                <TrendingUp size={22} />
              </div>
              <span className="badge badge-warning">{getDomainCount('finance')} Courses</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>
              Applied Indian Finance & Safety
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Everyday money management, UPI scam defense, monthly student budgeting, compounding SIP wealth models, and entrepreneurship cash flows.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {['UPI Safety', 'Student SIPs', 'Budgeting', 'No Personalized Advice'].map((tag) => (
                <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue', 'finance')}
              style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
            >
              <span>Explore Finance Tracks</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Pillar 3: Professional Skills */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '4px solid var(--brand-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(117, 181, 67, 0.12)', color: 'var(--brand-secondary)' }}>
                <Briefcase size={22} />
              </div>
              <span className="badge badge-neutral">{getDomainCount('professional')} Courses</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>
              Professional & Career Readiness
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              High-impact communication, scientific problem-solving, collaboration, resume construction, and executive workplace prioritization.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {['Communication', 'Resume Builder', 'Collaboration', 'Problem Solving'].map((tag) => (
                <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue', 'professional')}
              style={{ height: '36px', fontSize: 'var(--text-meta)', marginTop: 'auto' }}
            >
              <span>Explore Professional Skills</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOW LEARNING WORKS (4-Step Flow - Section 6 of Research)  */}
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
              How Practical Learning Works in Class
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              A 4-step workflow connecting classroom instruction with verifiable evidence of learning.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Step 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>Teacher Creates Cohort</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Faculty members create a class cohort in under 5 minutes and generate a secure 8-character joining code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>Students Join Safely</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Learners join using the code. Minors under 18 route through verified parental consent per DPDP Act standards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>Practice in Browser Sandboxes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Students complete hands-on parameter simulations, UPI safety checks, and coding tasks directly in the browser.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(117, 181, 67, 0.15)',
                  color: 'var(--brand-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, margin: 0 }}>Evidence of Learning</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Teachers and institutions receive exportable outcome reports tracking completion, attempt quality, and skill mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE LABS SHOWCASE (12 Approved Labs)               */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '6px' }}>
              <Terminal size={14} />
              <span>HANDS-ON SIMULATION ENGINES</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, margin: 0 }}>
              12 State-Driven Browser Sandboxes
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', marginTop: '4px', margin: 0 }}>
              Zero-install execution: live neural weights, SHA-256 blockchain mining, IoT telemetry dials, and settlement flows.
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
      {/* 6. INTERACTIVE FUN ZONE (Auto-Scrolling & Uniform Cards)     */}
      {/* ============================================================ */}
      <FunZoneSection
        db={db}
        currentUserId={currentUserId}
        onNavigate={onNavigate}
      />

      {/* ============================================================ */}
      {/* 7. SAFEGUARDING & DPDP ACT COMPLIANCE (Section 11)           */}
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
          <div
            className="card"
            style={{
              padding: '36px',
              backgroundColor: 'var(--bg-canvas)',
              border: '2px solid var(--brand-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '8px' }}>
                <Shield size={16} />
                <span>DATA PROTECTION & SAFEGUARDING</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '12px' }}>
                Safeguarding Minors by Design
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                Geniusphere is engineered specifically for Indian schools and PU colleges under the mandate of the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="var(--success)" />
                  <span><strong>Zero Behavioral Tracking:</strong> No targeted ads, marketing pixels, or commercial profiling of children.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="var(--success)" />
                  <span><strong>Verifiable Parental Consent:</strong> Transparent parent portal with auditable consent ledgers for under-18 learners.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="var(--success)" />
                  <span><strong>Quiet-Hours Enforcement:</strong> Educational notifications are restricted between 8 PM and 8 AM to protect student rest.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="var(--success)" />
                  <span><strong>Data Protection Officer:</strong> Designated privacy office contact at <code>dpo@geniusphere.tech</code>.</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--editor-bg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.04em' }}>
                DPDP ACT 2023 COMPLIANCE SUMMARY
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                <strong>Scope:</strong> Classroom-managed cohorts across Karnataka, Maharashtra, Delhi NCR, and pan-India.
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                • Lawful Basis: Educational public interest & recorded parental consent<br />
                • Data Retention: 1 academic year or until cohort deprovisioning<br />
                • Hosting: Indian server infrastructure with encrypted transit (TLS 1.3)
              </div>
              <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('parent')}
                  style={{ height: '32px', fontSize: '0.75rem', padding: '0 12px' }}
                >
                  <span>Open Parent Portal</span>
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('audit')}
                  style={{ height: '32px', fontSize: '0.75rem', padding: '0 12px' }}
                >
                  <span>Inspect Audit Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. INSTITUTIONAL PILOT PROGRAM (Section 14 & 17)             */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '8px' }}>
              <School size={16} />
              <span>PILOT ADOPTION COHORTS</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, margin: '0 0 10px 0' }}>
              Join the 4–8 Week Institutional Pilot Program
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
              Equip your school or college with ready-to-teach curriculum kits, teacher training, zero-install browser sandboxes, and an institutional evidence-of-learning report.
            </p>
          </div>

          {/* Pilot Target Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', width: '100%', maxWidth: '840px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>≥ 70%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Student Activation Target</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>≥ 60%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Sandbox Completion Target</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>4–8 Wks</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Cohort Duration</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹0</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Zero-Cost Pilot Phase</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setPilotModalOpen(true)}
              style={{ height: '46px', padding: '0 24px', fontSize: 'var(--text-body)' }}
            >
              <School size={16} />
              <span>Apply for Pilot Cohort</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('schoolkit')}
              style={{ height: '46px', padding: '0 20px', fontSize: 'var(--text-body)' }}
            >
              <FileText size={16} />
              <span>Inspect School Kit</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ)                          */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 800, marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0 }}>
              Clear answers regarding curriculum fit, DPDP compliance, and pilot adoption.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'Who is Geniusphere designed for?',
                a: 'Geniusphere is built for Indian schools (Grades 8–10), Pre-University (PU) colleges (Grades 11–12), undergraduate degree programs, and independent learners. It bridges academic theory with practical, browser-executable capability in Technology, Applied Finance, and Professional Skills.',
              },
              {
                q: 'Does Geniusphere comply with India’s DPDP Act 2023 for minors?',
                a: 'Yes. For learners under 18 years, Geniusphere implements verifiable parental/guardian consent workflows, records auditable consent ledgers, strictly prohibits targeted advertising or cross-app behavioral tracking, and enforces quiet-hours notification limits (8 PM to 8 AM).',
              },
              {
                q: 'Do students or schools need to install software or have high-end computers?',
                a: 'No software installation is required. Every simulation, code editor, and interactive exercise runs directly in any modern web browser (Chrome, Edge, Firefox, Safari) and is optimized for low-bandwidth school lab environments.',
              },
              {
                q: 'How does an institution run a pilot cohort?',
                a: 'Institutions can book a 20-minute onboarding demo. Approved schools receive ready-to-teach kits and 8-character cohort join codes for their teachers. At the end of the 4–8 week pilot, administrators receive an Evidence-of-Learning Outcome Report showing student activation, completion, and skill mastery.',
              },
              {
                q: 'Does Geniusphere provide financial investment advice?',
                a: 'No. Geniusphere’s finance modules are purely educational simulations designed to build financial literacy—such as understanding UPI safety rules, compounding mathematics (SIPs), monthly budgeting, and scam defense. It does not provide personalized investment advice or commercial financial products.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === idx && (
                  <div
                    style={{
                      padding: '0 20px 16px 20px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Pilot Application Modal */}
      <PilotApplicationModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
      />
    </div>
  );
};
