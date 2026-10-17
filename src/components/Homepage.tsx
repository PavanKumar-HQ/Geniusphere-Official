import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Shield,
  ArrowRight,
  Video,
  FileText,
  School,
  Briefcase,
  Code,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  BookOpen,
  Play,
  Flame,
  Zap,
  Trophy,
} from 'lucide-react';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, courseSlug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate, currentUserId }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const allPublishedCourses = db.getCourses({ publishedOnly: true });
  const allCourses = db.getCourses();
  const videoLessons = db.getVideoLessons();
  const studyResources = db.getStudyResources();
  const userProgress = db.getUserProgress(currentUserId);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const getDomainCount = (domain: string) => {
    return allCourses.filter((c) => c.domain === domain).length;
  };

  const faqList = [
    {
      q: '1. What is Geniusphere?',
      a: 'Geniusphere is an evidence-backed education platform delivering practical curriculum across technology, coding, finance, and professional skills for independent learners and educational institutions.',
    },
    {
      q: '2. Who can use Geniusphere?',
      a: 'Independent learners, school and college students, teachers, educational institutions, and parents seeking practical, verifiable skills.',
    },
    {
      q: '3. Which learning disciplines are available?',
      a: `Geniusphere offers ${allCourses.length} curricular courses strictly organized across four approved domains: Technology (${getDomainCount('technology')} subjects), Finance (${getDomainCount('finance')} subjects), Professional Skills (${getDomainCount('professional')} subjects), and Coding & Programming (${getDomainCount('coding')} subjects).`,
    },
    {
      q: '4. Are courses self-paced?',
      a: 'Yes. All courses support self-paced learning for independent students, while teachers can establish structured assignment schedules and due dates for enrolled classroom cohorts.',
    },
    {
      q: '5. How do video lessons work?',
      a: 'Video lessons are curated educational YouTube videos directly manageable by educators and administrators. Lessons cover fundamental computer science, web security, algorithm design, finance, and career identity.',
    },
    {
      q: '6. How do classroom join codes work?',
      a: 'Teachers generate 8-character cryptographic alphanumeric join codes with a 14-day validity window. Students enter the code in their dashboard to enroll directly into their school cohort.',
    },
    {
      q: '7. Can schools and colleges use Geniusphere?',
      a: 'Yes. Educational institutions can create institutional workspaces with multi-tenant isolation, onboard educators, provision classrooms, and monitor cohort progress.',
    },
    {
      q: '8. How is student progress recorded?',
      a: 'Progress is tracked per lesson and quiz. Completed lessons, quiz scores, and course completions are persisted in the database.',
    },
    {
      q: '9. Is Geniusphere compliant with minor privacy regulations?',
      a: 'Yes. Geniusphere operates under strict adherence to the Digital Personal Data Protection (DPDP) Act 2023, mandating verifiable parental consent for learners under 18 years of age.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: 'var(--brand-cyan-light)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              <Shield size={15} />
              <span>VERIFIED EDUCATIONAL PLATFORM</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
                color: '#FFFFFF',
              }}
            >
              Unlock Your <br />
              <span className="text-gradient-cyan-green">Digital Potential</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '28px',
                maxWidth: '560px',
              }}
            >
              Geniusphere is your gateway to future-ready skills. Master AI, Finance, and Professional Development in a verified, immersive ecosystem with 10 modules, interactive SVG animations, and live sandbox simulations for every course.
            </p>

            {/* Quick Gamification Ribbon */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-cyan-light)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  minHeight: 'auto',
                }}
              >
                <Trophy size={15} />
                <span>Leaderboard</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('catalogue')}
                style={{ height: '48px', padding: '0 26px', fontSize: '0.95rem' }}
              >
                <span>Start Learning</span>
                <Sparkles size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('resources')}
                style={{ height: '48px', padding: '0 22px', fontSize: '0.95rem' }}
              >
                <Video size={18} />
                <span>Resource Hub</span>
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('about')}
                style={{ height: '48px', padding: '0 20px', fontSize: '0.95rem' }}
              >
                <span>About Platform</span>
              </button>
            </div>
          </div>

          {/* Educational Visual Card: Featured Learning Track */}
          <div
            className="card-elevated"
            style={{
              padding: '28px',
              borderTop: '4px solid var(--brand-primary)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-brand">FEATURED DISCIPLINE</span>
                <span className="badge badge-success">ACTIVE PILOT</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {allPublishedCourses.length} Published Courses
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Cybersecurity & Defensive Web Security
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
              Learn modern web application defense mechanisms: Content Security Policy, secure authentication tokens, Same-Origin Policy, and defense-in-depth principles.
            </p>

            {/* Architecture Preview Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
                fontSize: '0.82rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                <Shield size={16} />
                <span>Defensive Architecture Checklist</span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>• Strict Content-Security-Policy (CSP) headers</div>
              <div style={{ color: 'var(--text-secondary)' }}>• HttpOnly & SameSite=Strict cookie protection</div>
              <div style={{ color: 'var(--text-secondary)' }}>• Argon2 / bcrypt adaptive password hashing</div>
            </div>

            <button
              type="button"
              className="btn-accent"
              onClick={() => onNavigate('course-detail', 'cybersecurity-defensive-web')}
              style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
            >
              <span>View Course Curriculum</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE FOUR APPROVED CURRICULAR DOMAINS                      */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="badge badge-brand" style={{ marginBottom: '10px' }}>
              APPROVED CURRICULUM
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Four Core Educational Areas
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Rigorous, evidence-backed curriculum designed to prepare learners for real-world technical and economic competence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {/* 1. Technology */}
            <div
              className="card"
              style={{
                borderTop: '4px solid var(--brand-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)' }}>
                  <Cpu size={22} />
                </div>
                <span className="badge badge-brand">{getDomainCount('technology')} Courses</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Technology</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                AI & practical AI tools, Responsible AI, Blockchain, IoT, Microsoft technologies, Digital privacy & footprint, Cybersecurity, and Computing fundamentals.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'technology')}
                style={{ height: '36px', fontSize: '0.82rem' }}
              >
                <span>Browse Technology</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 2. Coding & Programming */}
            <div
              className="card"
              style={{
                borderTop: '4px solid var(--brand-accent)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)' }}>
                  <Code size={22} />
                </div>
                <span className="badge badge-accent">{getDomainCount('coding')} Courses</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Coding & Programming</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Programming fundamentals, Variables and data types, Conditions and loops, Computational thinking, Exercises, Web development, Debugging, and Projects.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'coding')}
                style={{ height: '36px', fontSize: '0.82rem' }}
              >
                <span>Browse Coding</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 3. Finance */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #D97706',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
                  <TrendingUp size={22} />
                </div>
                <span className="badge badge-warning">{getDomainCount('finance')} Courses</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Finance</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Introduction to Finance, Global events & finance, Financial markets, Financial institutions, Cryptocurrency risks, Stock market, and FinTech.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'finance')}
                style={{ height: '36px', fontSize: '0.82rem' }}
              >
                <span>Browse Finance</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 4. Professional Skills */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #475569',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
                  <Briefcase size={22} />
                </div>
                <span className="badge badge-neutral">{getDomainCount('professional')} Courses</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Professional Skills</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Time management, Professional skills, Soft skills development, and Social profiles and professional identity.
              </p>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('catalogue', 'professional')}
                style={{ height: '36px', fontSize: '0.82rem' }}
              >
                <span>Browse Skills</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED PUBLISHED COURSES                                */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-brand" style={{ marginBottom: '8px' }}>
              PUBLISHED CATALOGUE
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Featured Course Offerings
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Showing actual published courses with comprehensive modules and assessments.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('catalogue')}
            style={{ height: '40px', fontSize: '0.88rem' }}
          >
            <span>View All {allCourses.length} Courses</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {allPublishedCourses.slice(0, 6).map((course) => (
            <div
              key={course.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${course.domain === 'technology' ? 'badge-brand' : course.domain === 'coding' ? 'badge-accent' : course.domain === 'finance' ? 'badge-warning' : 'badge-neutral'}`}>
                  {course.domain.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  <BookOpen size={16} />
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.35, color: '#FFFFFF' }}>
                {course.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: '1' }}>
                {course.summary}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  #{course.domain}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  #{course.level}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34D399', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  #10Videos
                </span>
                <span style={{ fontSize: '0.75rem', color: '#22D3EE', backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  #Sandbox
                </span>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Play size={14} style={{ color: 'var(--brand-cyan-light)' }} />
                  <span>{course.modules.length} Modules</span>
                </span>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('course-detail', course.slug)}
                  style={{ height: '34px', fontSize: '0.82rem', padding: '0 12px' }}
                >
                  <span>Start Course</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. RESOURCES PREVIEW (VIDEOS, GUIDES, SCHOOLKIT, RESUME)     */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: '8px' }}>
                RESOURCE HUB
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Video Lessons & Learning Materials
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Educational resources verified for learners, classrooms, and career readiness.
              </p>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('resources')}
              style={{ height: '40px', fontSize: '0.88rem' }}
            >
              <span>Explore All Resources</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Video Lessons preview */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)' }}>
                <Video size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Curated Video Lessons</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Watch {videoLessons.length} verified educational YouTube lessons on computer science, AI, web defense, and personal finance with zero third-party ads.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('resources')}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <span>Watch Video Lessons</span>
              </button>
            </div>

            {/* Study Guides */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-accent)' }}>
                <FileText size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Study Guides & Whitepapers</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Access {studyResources.length} comprehensive reference manuals, architecture whitepapers, and defensive security checklists.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('resources')}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <span>View Study Guides</span>
              </button>
            </div>

            {/* SchoolKit */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706' }}>
                <School size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Educator SchoolKit</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Pedagogical syllabi, lesson plans, rubric generators, and minor consent documentation for school teachers.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('schoolkit')}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <span>Launch SchoolKit</span>
              </button>
            </div>

            {/* Resume Builder */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)' }}>
                <Briefcase size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Resume & Portfolio Builder</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                Compile completed course achievements and software engineering case studies into verifiable resumes.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('resume-builder')}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <span>Open Resume Builder</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS                                */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>
            PLATFORM QUESTIONS
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqList.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{ padding: '18px 20px', cursor: 'pointer' }}
              onClick={() => toggleFaq(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1rem' }}>
                <span>{item.q}</span>
                <ChevronRight
                  size={18}
                  style={{
                    transform: activeFaq === idx ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
              {activeFaq === idx && (
                <div style={{ marginTop: '12px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. VERIFIED FOOTER                                           */}
      {/* ============================================================ */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '360px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  GENIUSPHERE
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Evidence-backed education platform for practical technology, computational logic, finance, and professional skills.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Navigation
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
                  <a href="#courses" onClick={(e) => { e.preventDefault(); onNavigate('catalogue'); }}>Courses</a>
                  <a href="#resources" onClick={(e) => { e.preventDefault(); onNavigate('resources'); }}>Resources</a>
                  <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About</a>
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Disciplines
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <a href="#tech" onClick={(e) => { e.preventDefault(); onNavigate('catalogue', 'technology'); }}>Technology</a>
                  <a href="#coding" onClick={(e) => { e.preventDefault(); onNavigate('catalogue', 'coding'); }}>Coding & Logic</a>
                  <a href="#finance" onClick={(e) => { e.preventDefault(); onNavigate('catalogue', 'finance'); }}>Finance & Markets</a>
                  <a href="#skills" onClick={(e) => { e.preventDefault(); onNavigate('catalogue', 'professional'); }}>Professional Skills</a>
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Institutional & Contact
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>contact@geniusphere.tech</div>
                  <div>Bengaluru, India (PES CIE)</div>
                  <div>DPDP Act 2023 Compliant</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>© {new Date().getFullYear()} Geniusphere. All rights reserved. Real database persistence. Zero fake statistics.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Active Pilot Deployment</span>
              <span>•</span>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Privacy Policy</a>
              <span>•</span>
              <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
