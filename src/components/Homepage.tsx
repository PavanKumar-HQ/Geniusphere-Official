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
      {/* ============================================================ */}
      {/* 1. HERO SECTION (2-Column Responsive with Live Sandbox)       */}
      {/* ============================================================ */}
      <section
        className="hero-ambient-mesh"
        style={{
          padding: '48px 24px 64px',
          width: '100%',
          borderBottom: '1px solid rgba(48, 178, 231, 0.15)',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
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
            {/* Status Badge with Live Pulse */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-surface)',
                border: '1px solid var(--brand-border)',
                color: 'var(--brand-forest)',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <span className="pulse-dot pulse-dot-green" />
              <span
                style={{
                  backgroundColor: '#1E6B4E',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                PILOT READY
              </span>
              <span>Evidence-Backed Practical Skills • India 2026</span>
            </div>

            {/* Headline: Clean, Crisp Scholarly Typography */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              <span style={{ color: '#164E3D' }}>Practical skills</span>, taught in class,{' '}
              <span style={{ color: '#1D58A6' }}>measured clearly.</span>
            </h1>

            {/* Supporting summary matching Research Study USP */}
            <p
              style={{
                fontSize: '1.08rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '560px',
              }}
            >
              For schools, PU colleges, universities, and independent learners. An India-first practical skills ecosystem for Technology, Finance, and Professional Skills—with teacher-controlled cohorts, zero-install browser sandboxes, and safeguarding-first analytics.
            </p>

            {/* Gamification Ribbon with Fiery & Cosmic Pills */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="streak-pill">
                <Flame size={16} />
                <span>{userProgress.streak_days}-Day Streak</span>
              </div>
              <div className="xp-pill">
                <Zap size={16} />
                <span>{userProgress.xp.toLocaleString()} XP Points</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                className="rank-pill"
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trophy size={14} />
                <span>Leaderboard</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Micro-Features Colorful Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.76rem', fontWeight: 700 }}>
              <span className="tag-pill tag-pill-sky">⚡ Zero-Install Wasm</span>
              <span className="tag-pill tag-pill-gold">🛡️ Safe for Minors</span>
              <span className="tag-pill tag-pill-emerald">📊 Exportable Outcomes</span>
              <span className="tag-pill tag-pill-indigo">🇮🇳 CBSE & AICTE Ready</span>
            </div>

            {/* Primary Action Buttons with Vibrant Gradients */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPilotModalOpen(true)}
                style={{ height: '46px', padding: '0 24px', fontSize: '0.96rem' }}
              >
                <School size={17} />
                <span>Book a 20-min Pilot Demo</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-quest"
                onClick={() => onNavigate('labs')}
                style={{ height: '46px', padding: '0 22px', fontSize: '0.96rem' }}
              >
                <Terminal size={17} />
                <span>Explore 12 Sandboxes</span>
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue')}
                style={{ height: '46px', padding: '0 20px', fontSize: '0.96rem' }}
              >
                <BookOpen size={17} />
                <span>Browse 27 Courses</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Hero Animation Sandbox with 5 modes */}
          <div style={{ position: 'relative' }}>
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

            {/* Audience Tabs with Dedicated Vibrant Colors */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {[
                {
                  id: 'school',
                  label: 'Schools & PU Colleges (Ages 14–18)',
                  activeBg: '#1E6B4E',
                  color: '#FFFFFF',
                  activeBorder: '#16533C',
                },
                {
                  id: 'college',
                  label: 'Colleges & Universities (Ages 18+)',
                  activeBg: '#1D58A6',
                  color: '#FFFFFF',
                  activeBorder: '#154584',
                },
                {
                  id: 'teacher',
                  label: 'Teachers & Educators',
                  activeBg: '#237A59',
                  color: '#FFFFFF',
                  activeBorder: '#1A6045',
                },
                {
                  id: 'parent',
                  label: 'Parents & Guardians',
                  activeBg: '#B45309',
                  color: '#FFFFFF',
                  activeBorder: '#92400E',
                },
              ].map((tab) => {
                const isActive = audienceTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAudienceTab(tab.id as any)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: isActive ? `1.5px solid ${tab.activeBorder}` : '1.5px solid var(--border-subtle)',
                      backgroundColor: isActive ? tab.activeBg : '#FFFFFF',
                      color: isActive ? tab.color : 'var(--text-secondary)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 1px 3px rgba(20, 38, 28, 0.12)' : 'var(--shadow-xs)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Cards with Distinct Colored Top Bar */}
            <div
              className="card"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
                borderTop:
                  audienceTab === 'school'
                    ? '4px solid #0284C7'
                    : audienceTab === 'college'
                    ? '4px solid #6366F1'
                    : audienceTab === 'teacher'
                    ? '4px solid #FDB913'
                    : '4px solid #75B543',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {audienceTab === 'school' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                  <div>
                    <span className="tag-pill tag-pill-sky" style={{ marginBottom: '10px' }}>
                      GRADES 9–12 & PU COLLEGES
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                      School & PU College Cohorts (Ages 14–18)
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                      Bridging foundational board syllabi with digital hygiene, foundational programming logic, UPI scam awareness, and ethical habits.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#0284C7" />
                      </div>
                      <span><strong>DPDP Act 2023 Compliant:</strong> Verifiable parental consent ledger for all minors.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#D97706" />
                      </div>
                      <span><strong>Quiet-Hours Safeguarding:</strong> Zero intrusive alerts between 9 PM and 8 AM IST.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#15803D" />
                      </div>
                      <span><strong>Low-Bandwidth Friendly:</strong> Runs smoothly on older computer lab machines.</span>
                    </div>
                  </div>
                </div>
              )}

              {audienceTab === 'college' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                  <div>
                    <span className="tag-pill tag-pill-indigo" style={{ marginBottom: '10px' }}>
                      DEGREE, DIPLOMA & UNIVERSITIES
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                      Undergraduate & Professional Campuses (Ages 18+)
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                      Career-aligned engineering sandboxes, real-world FinTech workflows, personal tax/budgeting, and resume-ready credentials.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#4338CA" />
                      </div>
                      <span><strong>Proof of Mastery:</strong> Cryptographically verified completion certificates.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#7E22CE" />
                      </div>
                      <span><strong>Placement Cell Reporting:</strong> Exportable cohort competency matrix.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#15803D" />
                      </div>
                      <span><strong>Applied Sandboxes:</strong> AI models, distributed ledgers, and web security.</span>
                    </div>
                  </div>
                </div>
              )}

              {audienceTab === 'teacher' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                  <div>
                    <span className="tag-pill tag-pill-gold" style={{ marginBottom: '10px' }}>
                      TEACHER COHORT CONTROLS
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                      Teachers & Faculty Champions
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                      Launch practical classes in under 5 minutes without installation or IT department dependencies.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#B45309" />
                      </div>
                      <span><strong>Ready-to-Teach Kits:</strong> Starter slides, discussion guides, and rubrics.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#15803D" />
                      </div>
                      <span><strong>Auto-Graded Checks:</strong> Instant visibility into student attempt quality.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#0284C7" />
                      </div>
                      <span><strong>8-Character Join Codes:</strong> No student signups required for classroom labs.</span>
                    </div>
                  </div>
                </div>
              )}

              {audienceTab === 'parent' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                  <div>
                    <span className="tag-pill tag-pill-emerald" style={{ marginBottom: '10px' }}>
                      SAFEGUARDING FIRST
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                      Parents & Lawful Guardians
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                      Peace of mind through ethical education: zero behavioral ad surveillance, verifiable consent, and progress visibility.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#15803D" />
                      </div>
                      <span><strong>Zero Ad Profiling:</strong> No behavioral tracking or third-party ad pixels.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#0284C7" />
                      </div>
                      <span><strong>Consent Management:</strong> Review or withdraw consent at any time.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 size={16} color="#B45309" />
                      </div>
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
        <section
          className="section-ambient-mesh"
          style={{ padding: '72px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span
              className="tag-pill tag-pill-purple"
              style={{ marginBottom: '10px' }}
            >
              COMPREHENSIVE CURRICULUM TRACKS
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, marginBottom: '10px' }}>
              Three Practical Skill Pillars
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', margin: 0 }}>
              Structured around high-impact competencies needed for India's 21st-century modern economy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Pillar 1: Technology */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderTop: '5px solid #0284C7',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--brand-blue-surface)',
                    color: 'var(--brand-blue)',
                    border: '1px solid var(--brand-blue-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Cpu size={24} />
                </div>
                <span className="tag-pill tag-pill-sky">
                  {getDomainCount('technology') + getDomainCount('coding')} Courses
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Technology & Programming Logic
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Browser-executable coding sandboxes, AI perception fundamentals, distributed blockchain ledgers, and defensive cybersecurity pipelines.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' }}>
                <span className="tag-pill tag-pill-sky">🤖 AI Literacy</span>
                <span className="tag-pill tag-pill-indigo">🛡️ Web Security</span>
                <span className="tag-pill tag-pill-sky">⚡ Algorithms</span>
                <span className="tag-pill tag-pill-emerald">📡 IoT Sensors</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('catalogue', 'technology')}
                style={{ height: '40px', fontSize: '0.88rem', marginTop: 'auto' }}
              >
                <span>Explore Tech Tracks</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Pillar 2: Applied Indian Finance */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderTop: '4px solid #B45309',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--brand-quest-surface)',
                    color: 'var(--brand-quest)',
                    border: '1px solid var(--brand-quest-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={24} />
                </div>
                <span className="tag-pill tag-pill-gold">
                  {getDomainCount('finance')} Courses
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Applied Indian Finance & Safety
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Everyday money management, UPI scam defense, monthly student budgeting, compounding SIP wealth models, and entrepreneurship cash flows.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' }}>
                <span className="tag-pill tag-pill-gold">📱 UPI Fraud Defense</span>
                <span className="tag-pill tag-pill-emerald">📈 Student SIPs</span>
                <span className="tag-pill tag-pill-gold">💳 Monthly Budgeting</span>
                <span className="tag-pill tag-pill-sky">🔒 Ethical Education</span>
              </div>
              <button
                type="button"
                className="btn-quest"
                onClick={() => onNavigate('catalogue', 'finance')}
                style={{ height: '40px', fontSize: '0.88rem', marginTop: 'auto' }}
              >
                <span>Explore Finance Tracks</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Pillar 3: Professional Skills */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderTop: '4px solid #1E6B4E',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--brand-surface)',
                    color: 'var(--brand-forest)',
                    border: '1px solid var(--brand-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={24} />
                </div>
                <span className="tag-pill tag-pill-emerald">
                  {getDomainCount('professional')} Courses
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Professional & Career Readiness
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                High-impact workplace communication, scientific problem-solving, collaboration, ATS resume construction, and team prioritization.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' }}>
                <span className="tag-pill tag-pill-purple">💬 Communication</span>
                <span className="tag-pill tag-pill-indigo">📄 ATS Resume Builder</span>
                <span className="tag-pill tag-pill-emerald">🤝 Team Collaboration</span>
                <span className="tag-pill tag-pill-gold">🎯 Problem Solving</span>
              </div>
              <button
                type="button"
                className="btn-questioning"
                onClick={() => onNavigate('catalogue', 'professional')}
                style={{ height: '40px', fontSize: '0.88rem', marginTop: 'auto' }}
              >
                <span>Explore Career Tracks</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. HOW LEARNING WORKS (4-Step Flow - Section 6 of Research)  */}
        {/* ============================================================ */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '72px 24px',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 44px' }}>
              <span className="tag-pill tag-pill-sky" style={{ marginBottom: '10px' }}>
                PEDAGOGICAL METHODOLOGY
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, marginBottom: '10px' }}>
                How Practical Learning Works in Class
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', margin: 0 }}>
                A 4-step workflow connecting classroom instruction with verifiable evidence of learning.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {/* Step 1 */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderTop: '4px solid #1D58A6',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#1D58A6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 2px 6px rgba(29, 88, 166, 0.25)',
                  }}
                >
                  1
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Teacher Creates Cohort</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Faculty members create a class cohort in under 5 minutes and generate a secure 8-character joining code.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderTop: '4px solid #1E6B4E',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#1E6B4E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 2px 6px rgba(30, 107, 78, 0.25)',
                  }}
                >
                  2
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Students Join Safely</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Learners join using the code. Minors under 18 route through verified parental consent per DPDP Act standards.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderTop: '4px solid #B45309',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#B45309',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)',
                  }}
                >
                  3
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Practice in Sandboxes</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Students complete hands-on parameter simulations, UPI safety checks, and coding tasks directly in the browser.
                </p>
              </div>

              {/* Step 4 */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderTop: '4px solid #164E3D',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#164E3D',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 2px 6px rgba(22, 78, 61, 0.25)',
                  }}
                >
                  4
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Evidence of Learning</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {allLabs.slice(0, 4).map((lab) => {
            const isTech = lab.category === 'technology' || lab.category === 'coding';
            const isFinance = lab.category === 'finance';
            const topColor = isTech ? '#0284C7' : isFinance ? '#FDB913' : '#75B543';
            const tagClass = isTech ? 'tag-pill-sky' : isFinance ? 'tag-pill-gold' : 'tag-pill-emerald';

            return (
              <div
                key={lab.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderTop: `4px solid ${topColor}`,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`tag-pill ${tagClass}`} style={{ textTransform: 'capitalize' }}>
                      {lab.category}
                    </span>
                    <span className="tag-pill tag-pill-indigo" style={{ textTransform: 'capitalize' }}>
                      {lab.interaction_type}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {lab.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {lab.summary}
                  </p>
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Clock size={14} />
                    <span>{lab.duration_minutes} min simulation</span>
                  </span>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ height: '36px', padding: '0 14px', fontSize: '0.82rem' }}
                    onClick={() => onNavigate('lab-workspace', lab.slug)}
                  >
                    <span>Launch Lab</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
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
              padding: '40px',
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(117, 181, 67, 0.4)',
              boxShadow: 'var(--glow-green), var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#1E6B4E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(30, 107, 78, 0.25)',
                  }}
                >
                  <Shield size={20} />
                </div>
                <span className="tag-pill tag-pill-emerald">
                  DPDP ACT 2023 COMPLIANT
                </span>
              </div>
              <h2 style={{ fontSize: 'var(--text-section-title)', fontWeight: 900, marginBottom: '12px', color: 'var(--text-primary)' }}>
                Safeguarding Minors by Design
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 1.6, marginBottom: '22px' }}>
                Geniusphere is engineered specifically for Indian schools and PU colleges under the strict mandate of the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#15803D" strokeWidth={3} />
                  </div>
                  <span><strong>Zero Behavioral Tracking:</strong> No targeted ads, marketing pixels, or commercial profiling of children.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#15803D" strokeWidth={3} />
                  </div>
                  <span><strong>Verifiable Parental Consent:</strong> Transparent parent portal with auditable consent ledgers for under-18 learners.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#15803D" strokeWidth={3} />
                  </div>
                  <span><strong>Quiet-Hours Enforcement:</strong> Educational notifications restricted between 8 PM and 8 AM to protect student rest.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#15803D" strokeWidth={3} />
                  </div>
                  <span><strong>Data Protection Officer:</strong> Designated privacy office contact at <code>dpo@geniusphere.tech</code>.</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #C4E3D4',
                boxShadow: '0 4px 16px rgba(22, 78, 61, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#164E3D', letterSpacing: '0.05em' }}>
                  DPDP ACT 2023 COMPLIANCE LEDGER
                </span>
                <span className="tag-pill tag-pill-emerald" style={{ fontSize: '0.68rem', padding: '1px 7px' }}>
                  VERIFIED
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <strong>Scope:</strong> Classroom-managed cohorts across Karnataka, Maharashtra, Delhi NCR, and pan-India.
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                • <strong>Lawful Basis:</strong> Educational public interest & recorded parental consent<br />
                • <strong>Data Retention:</strong> 1 academic year or until cohort deprovisioning<br />
                • <strong>Hosting:</strong> Indian sovereign server infrastructure with TLS 1.3 encryption
              </div>
              <div style={{ paddingTop: '10px', borderTop: '1px solid #E8E2D6', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('parent')}
                  style={{ height: '34px', fontSize: '0.78rem', padding: '0 14px' }}
                >
                  <span>Open Parent Portal</span>
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('audit')}
                  style={{ height: '34px', fontSize: '0.78rem', padding: '0 14px' }}
                >
                  <span>Inspect Audit Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. INSTITUTIONAL PILOT PROGRAM (Flagship Showcase Card)      */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            padding: '48px 36px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: '#164E3D',
            border: '2px solid #0F382B',
            boxShadow: '0 16px 40px -10px rgba(22, 78, 61, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '28px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FEF7EA', color: '#B45309', border: '1px solid #FCE7C3' }}>
                ⚡ 2026 PILOT ADOPTION COHORTS
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px 0', letterSpacing: '-0.02em', color: '#FAF7F2' }}>
              Join the 4–8 Week Institutional Pilot Program
            </h2>
            <p style={{ color: '#D1E7DD', fontSize: '1.02rem', lineHeight: 1.65, margin: 0 }}>
              Equip your school or college with ready-to-teach curriculum kits, teacher training, zero-install browser sandboxes, and exportable institutional evidence-of-learning reports.
            </p>
          </div>

          {/* Pilot Target Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', width: '100%', maxWidth: '880px', position: 'relative', zIndex: 1 }}>
            <div style={{ padding: '20px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#BAE6FD' }}>≥ 70%</div>
              <div style={{ fontSize: '0.82rem', color: '#FAF7F2', fontWeight: 600, marginTop: '4px' }}>Student Activation</div>
              <div style={{ fontSize: '0.72rem', color: '#A7D7C5', marginTop: '2px' }}>Target Benchmark</div>
            </div>

            <div style={{ padding: '20px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A7F3D0' }}>≥ 60%</div>
              <div style={{ fontSize: '0.82rem', color: '#FAF7F2', fontWeight: 600, marginTop: '4px' }}>Sandbox Completion</div>
              <div style={{ fontSize: '0.72rem', color: '#A7D7C5', marginTop: '2px' }}>Outcome Metric</div>
            </div>

            <div style={{ padding: '20px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FDE68A' }}>4–8 Wks</div>
              <div style={{ fontSize: '0.82rem', color: '#FAF7F2', fontWeight: 600, marginTop: '4px' }}>Cohort Duration</div>
              <div style={{ fontSize: '0.72rem', color: '#A7D7C5', marginTop: '2px' }}>Structured Term</div>
            </div>

            <div style={{ padding: '20px 16px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FECDD3' }}>₹0 Free</div>
              <div style={{ fontSize: '0.82rem', color: '#FAF7F2', fontWeight: 600, marginTop: '4px' }}>Zero-Cost Pilot Phase</div>
              <div style={{ fontSize: '0.72rem', color: '#A7D7C5', marginTop: '2px' }}>Institutional Grant</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <button
              type="button"
              onClick={() => setPilotModalOpen(true)}
              style={{
                height: '48px',
                padding: '0 28px',
                fontSize: '1rem',
                fontWeight: 800,
                backgroundColor: '#FAF7F2',
                color: '#164E3D',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <School size={18} />
              <span>Apply for Pilot Cohort</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('schoolkit')}
              style={{
                height: '48px',
                padding: '0 22px',
                fontSize: '1rem',
                fontWeight: 700,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#FAF7F2',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FileText size={18} />
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
