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
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Cpu,
  BookOpen,
  Play,
  Flame,
  Zap,
  Trophy,
  CheckCircle2,
  Award,
  Users,
  Clock,
  Calendar,
  Gift,
  Crown,
  Brain,
  Sparkles,
  Check,
  Bug,
  HardDrive,
  Megaphone,
} from 'lucide-react';
import { SimulationLabModal } from './SimulationLabModal';
import { EventRegisterModal } from './EventRegisterModal';
import { AmbassadorModal } from './AmbassadorModal';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, courseSlug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate, currentUserId }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [simLabOpen, setSimLabOpen] = useState(false);
  const [simLabCourseTitle, setSimLabCourseTitle] = useState('Cybersecurity & Defensive Web Security');
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<{
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
  } | null>(null);
  const [ambassadorModalOpen, setAmbassadorModalOpen] = useState(false);
  const [funZoneQuestDone, setFunZoneQuestDone] = useState(false);
  const [brainTeaserSelected, setBrainTeaserSelected] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  const wordOfTheDayList = [
    {
      word: 'Arbitrage',
      domain: 'Finance',
      definition: 'Buying in one market and simultaneously selling in another to profit from price differences.',
    },
    {
      word: 'Parameterization',
      domain: 'Coding & Logic',
      definition: 'Abstracting concrete values into variable inputs so procedures become reusable across different data.',
    },
    {
      word: 'Consensus',
      domain: 'Technology',
      definition: 'Fault-tolerant agreement mechanism among distributed nodes to commit transactions without a central authority.',
    },
    {
      word: 'Cold Storage',
      domain: 'Cybersecurity',
      definition: 'Keeping private cryptographic keys completely disconnected from the internet to eliminate remote exploits.',
    },
  ];

  const upcomingEvents = [
    {
      id: 'event-ai-hackathon',
      title: 'Global AI Hackathon',
      date: 'Oct 16 - Oct 17',
      category: 'Tech',
      description: 'Build the future of GenAI in 48 hours with structured evaluation.',
    },
    {
      id: 'event-wallst-challenge',
      title: 'Wall St. Finance Challenge',
      date: 'Nov 01',
      category: 'Finance',
      description: 'Simulated trading competition with real algorithmic price feeds.',
    },
    {
      id: 'event-cert-week',
      title: 'Certification Week',
      date: 'Nov 20 - Nov 27',
      category: 'Career',
      description: 'Double XP and free certification exams across all approved disciplines.',
    },
    {
      id: 'event-web-ctf',
      title: 'Web Security Defense CTF',
      date: 'Dec 05 - Dec 07',
      category: 'Tech',
      description: 'Interactive capture-the-flag defending against CSRF, SQLi, and prototype pollution.',
    },
  ];

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
                backgroundColor: 'var(--brand-surface)',
                border: '1px solid var(--brand-border)',
                color: 'var(--brand-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              <Shield size={15} />
              <span>Inspiring Futures & Igniting Passion • Evidence-Backed Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.4vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              Learn what school doesn't always teach you.
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
              Geniusphere is a student-focused educational platform helping independent learners and school classrooms gain practical competence in modern technology, applied finance, professional skills, and coding logic through structured, hands-on learning.
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
                  color: 'var(--brand-primary)',
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
                style={{ height: '48px', padding: '0 24px', fontSize: '0.95rem' }}
              >
                <span>Explore Courses</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate('resources')}
                style={{ height: '48px', padding: '0 20px', fontSize: '0.95rem' }}
              >
                <Video size={18} />
                <span>Browse Resources</span>
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
              className="course-card"
              onClick={() => onNavigate('course-detail', course.slug)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="category-tag-pill">
                  {course.domain.toUpperCase()}
                </span>
                <button
                  type="button"
                  className="syllabus-circle-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('course-detail', course.slug);
                  }}
                  title="View Course Syllabus"
                >
                  <BookOpen size={17} />
                </button>
              </div>

              <h3>{course.title}</h3>

              <p>{course.summary}</p>

              {/* Tags matching Image 1 */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="topic-hashtag-pill">
                  #{course.domain === 'technology' ? 'Tech' : course.domain === 'coding' ? 'Programming' : course.domain === 'finance' ? 'Finance' : 'Career'}
                </span>
                <span className="topic-hashtag-pill">
                  #{course.slug.split('-')[0].charAt(0).toUpperCase() + course.slug.split('-')[0].slice(1)}
                </span>
                <span className="topic-hashtag-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                  #10Sims
                </span>
              </div>

              <div className="course-card-footer">
                <span className="modules-badge">
                  <Clock size={16} />
                  <span>10 Modules</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="play-sim-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSimLabCourseTitle(course.title);
                      setSimLabOpen(true);
                    }}
                    title="Launch Interactive Simulation Lab (10 SVG Sims)"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <button
                    type="button"
                    className="arrow-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('course-detail', course.slug);
                    }}
                    title="Open Course Details"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FUN ZONE: LEVEL UP YOUR KNOWLEDGE (REFERENCE IMAGE 2)     */}
      {/* ============================================================ */}
      <section className="cosmic-section" style={{ padding: '64px 24px 72px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              className="funzone-pill"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00F0FF',
                margin: '0 auto 12px',
              }}
            >
              FUN ZONE
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              Level Up Your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #00F0FF 0%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Knowledge
              </span>
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
              Bite-sized daily challenges, historical tech trivia, and real domain concepts to sharpen your skills.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Card 1: Daily Quest */}
            <div className="funzone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    DAILY QUEST
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Resets in 12h</span>
                </div>
                <Trophy size={26} color="rgba(255, 255, 255, 0.25)" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                Micro-Learner
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '24px' }}>
                Watch 1 Finance Video today
              </p>

              <div style={{ marginTop: 'auto' }}>
                {!funZoneQuestDone ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFunZoneQuestDone(true);
                      db.logAuditEvent({
                        organization_id: null,
                        actor_id: currentUserId,
                        action_type: 'gamification.daily_quest_completed',
                        resource_type: 'gamification_quest',
                        resource_id: 'micro-learner',
                        ip_address: null,
                        user_agent: null,
                        details: { xp: 25, title: 'Micro-Learner' },
                      });
                    }}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    }}
                  >
                    Complete Challenge
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10B981',
                      color: '#10B981',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Check size={16} />
                    <span>Challenge Completed! +25 XP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Tech & Finance Facts */}
            <div className="funzone-card">
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: '#F472B6',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} />
                  <span>TECH & FINANCE FACTS</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.84rem',
                    color: '#CBD5E1',
                    lineHeight: 1.45,
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <Bug size={16} color="#F472B6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>1947:</strong> Grace Hopper's team logged the first actual computer bug — a real moth found in a relay.
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.84rem',
                    color: '#CBD5E1',
                    lineHeight: 1.45,
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <HardDrive size={16} color="#00F0FF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Data Explosion:</strong> 90% of the world's total stored data was generated in just the last two years.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Brain Teaser */}
            <div className="funzone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34D399',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  BRAIN TEASER
                </span>
                <Brain size={24} color="rgba(255, 255, 255, 0.25)" />
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                What does 'HTTP' stand for?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { text: 'HyperText Transfer Protocol', correct: true },
                  { text: 'High Transfer Text Protocol', correct: false },
                  { text: 'HyperText Transmission Process', correct: false },
                ].map((option, idx) => {
                  const isSelected = brainTeaserSelected === idx;
                  let bg = 'rgba(255, 255, 255, 0.04)';
                  let borderColor = 'rgba(255, 255, 255, 0.1)';
                  let textColor = '#CBD5E1';

                  if (brainTeaserSelected !== null) {
                    if (option.correct) {
                      bg = 'rgba(16, 185, 129, 0.2)';
                      borderColor = '#10B981';
                      textColor = '#6EE7B7';
                    } else if (isSelected && !option.correct) {
                      bg = 'rgba(239, 68, 68, 0.2)';
                      borderColor = '#EF4444';
                      textColor = '#FCA5A5';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBrainTeaserSelected(idx)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: bg,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {brainTeaserSelected !== null && (
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: brainTeaserSelected === 0 ? '#34D399' : '#94A3B8', lineHeight: 1.4 }}>
                  {brainTeaserSelected === 0 ? '✓ Correct! HTTP is the foundational client-server communication protocol for the web.' : 'Explanation: HTTP stands for HyperText Transfer Protocol, defined in RFC 2616.'}
                </div>
              )}
            </div>

            {/* Card 4: Word of the Day */}
            <div className="funzone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34D399',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} />
                  <span>WORD OF THE DAY</span>
                </span>
                <BookOpen size={24} color="rgba(255, 255, 255, 0.25)" />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                {wordOfTheDayList[wordIndex].word}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '16px' }}>
                {wordOfTheDayList[wordIndex].definition}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00F0FF' }} />
                  {wordOfTheDayList[wordIndex].domain}
                </span>

                <button
                  type="button"
                  onClick={() => setWordIndex((prev) => (prev + 1) % wordOfTheDayList.length)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00F0FF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                  }}
                >
                  <span>Next Word</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. HOW LEARNING WORKS (THE 5-STEP JOURNEY)                   */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className="badge badge-brand" style={{ marginBottom: '10px' }}>
            LEARNING METHODOLOGY
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            How Learning Works on Geniusphere
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            A structured, evidence-backed pedagogical journey that connects foundational concepts to verifiable capability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Step 1 */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Explore Curriculum</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
              Browse 27 approved subject areas across Technology, Coding, Finance, and Professional Skills with defined learning objectives.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Structured Lessons</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
              Work through 10 comprehensive modules per course combining theory reading notes, video instruction, and animated SVG visualizers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interactive Sandboxes</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
              Experiment with real code, logic conditions, and financial market parameters in live, sandboxed simulations.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              4
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Knowledge Checks</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
              Test first-principles understanding through formative quizzes with immediate feedback and explanation of concepts.
            </p>
          </div>

          {/* Step 5 */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              5
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Verifiable Progress</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
              Build a real, database-recorded achievement record and earn verifiable completion certificates backed by genuine mastery.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5A. UPCOMING EVENTS & HACKATHONS (REFERENCE IMAGE 4)          */}
      {/* ============================================================ */}
      <section className="cosmic-section" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.3rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Upcoming Events & Hackathons
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                Join competitions, workshops, and exclusive webinars.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => onNavigate('catalogue')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                VIEW ALL
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Previous Events"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Next Events"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className="event-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: evt.category === 'Tech' ? '#00F0FF' : evt.category === 'Finance' ? '#34D399' : '#A855F7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {evt.category === 'Tech' ? <Code size={20} /> : evt.category === 'Finance' ? <TrendingUp size={20} /> : <Award size={20} />}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    {evt.category}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B', marginBottom: '6px' }}>
                    <Calendar size={13} />
                    <span>{evt.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                    {evt.title}
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5 }}>
                    {evt.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedEventForRegister(evt)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00F0FF';
                      e.currentTarget.style.borderColor = '#00F0FF';
                      e.currentTarget.style.color = '#020617';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================ */}
          {/* 5B. BECOME A GENIUS REPRESENTATIVE (REFERENCE IMAGE 5)       */}
          {/* ============================================================ */}
          <div className="ambassador-container" style={{ marginTop: '48px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Left Column */}
              <div>
                <div
                  className="funzone-pill"
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    color: '#00F0FF',
                    marginBottom: '18px',
                  }}
                >
                  <Megaphone size={13} />
                  <span>RECRUITMENT OPEN</span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(2rem, 3.6vw, 2.7rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                    marginBottom: '16px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Become a{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #00F0FF 0%, #38BDF8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Genius Representative
                  </span>
                </h2>

                <p
                  style={{
                    color: '#94A3B8',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    marginBottom: '28px',
                    maxWidth: '520px',
                  }}
                >
                  Join an elite network of student leaders. Promote Geniusphere, organize tech workshops at your campus, and unlock exclusive perks.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setAmbassadorModalOpen(true)}
                    style={{
                      height: '46px',
                      padding: '0 24px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      color: '#0B132B',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('leaderboard')}
                    style={{
                      height: '46px',
                      padding: '0 20px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Crown size={16} color="#FBBF24" />
                    <span>View Leaderboard</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 2x2 Perk Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}
              >
                <div className="perk-tile">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(244, 114, 182, 0.15)',
                      color: '#F472B6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Gift size={18} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>Exclusive Rewards</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                    Earn branded swag, gadgets, and pro-access for your milestones.
                  </p>
                </div>

                <div className="perk-tile">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={18} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>Host Events</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                    Get funding and support to host workshops at your college.
                  </p>
                </div>

                <div className="perk-tile">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(251, 191, 36, 0.15)',
                      color: '#FBBF24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trophy size={18} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>Recognition</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                    Certificate of leadership and recommendation letters.
                  </p>
                </div>

                <div className="perk-tile">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      color: '#34D399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Code size={18} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>14+ Labs</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                    Interactive hands-on sandbox labs for campus workshops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. LEARNING RESOURCES (VIDEOS, GUIDES, SCHOOLKIT, RESUME)    */}
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
      {/* 7. INDEPENDENT LEARNING AND INSTITUTIONAL LEARNING           */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className="badge badge-brand" style={{ marginBottom: '10px' }}>
            DUAL AUDIENCE PLATFORM
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Built for Independent Learners and Educational Institutions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Supporting self-directed exploration while empowering teachers and institutions with structured classroom delivery.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Column 1: Independent Learners */}
          <div className="card-elevated" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '4px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Independent Learners</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Self-Paced • Practical Exploration</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              For students and curious minds who want to explore subjects outside traditional school boundaries. Learn at your own pace without arbitrary gatekeeping.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Access all 27 approved curricular subjects freely</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Hands-on sandbox coding and financial simulators</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Verified course certificates and resume portfolio export</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('catalogue')}
                style={{ width: '100%', height: '44px', fontSize: '0.92rem' }}
              >
                <span>Explore Course Catalogue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Column 2: Educational Institutions */}
          <div className="card-elevated" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '4px solid var(--brand-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <School size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Educational Institutions</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Classrooms • Teachers & Academic Admins</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              For schools, colleges, and training institutes looking for structured curriculum deployment, join-code roster access, and real submission analytics.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Teacher workspaces with custom classroom join codes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Row-level gradebooks and lab assessment evaluation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-accent)" />
                <span>Full DPDP Act 2023 compliance for minor data protection</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn-accent"
                onClick={() => onNavigate('about')}
                style={{ width: '100%', height: '44px', fontSize: '0.92rem' }}
              >
                <span>About Institutional Programs</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7A. CONNECT & COLLABORATE: DIGITAL UNIVERSE (IMAGE 3)        */}
      {/* ============================================================ */}
      <section className="cosmic-section" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            className="funzone-pill"
            style={{
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00F0FF',
              margin: '0 auto 12px',
            }}
          >
            CONNECT & COLLABORATE
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '36px',
            }}
          >
            Join Our{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Digital Universe
            </span>
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {/* 1. Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Follow Geniusphere on Instagram"
            >
              <div style={{ color: '#E1306C' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Instagram</span>
            </a>

            {/* 2. Discord */}
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Join Geniusphere Discord Community"
            >
              <div style={{ color: '#5865F2' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Discord</span>
            </a>

            {/* 3. X (Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Follow Geniusphere on X (Twitter)"
            >
              <div style={{ color: '#FFFFFF' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>X (Twitter)</span>
            </a>

            {/* 4. Reddit */}
            <a
              href="https://reddit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Join Geniusphere on Reddit"
            >
              <div style={{ color: '#FF4500' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15"/>
                  <path d="M14.25 14.5c-.5.45-1.3.7-2.25.7s-1.75-.25-2.25-.7a.5.5 0 0 0-.7.7c.65.6 1.7.9 2.95.9s2.3-.3 2.95-.9a.5.5 0 0 0-.7-.7z"/>
                  <circle cx="9" cy="12" r="1.25"/>
                  <circle cx="15" cy="12" r="1.25"/>
                  <path d="M19.5 11c0-.83-.67-1.5-1.5-1.5-.4 0-.76.16-1.03.41C15.7 9.17 14 8.7 12.13 8.65l.68-3.23 2.25.48c.03.68.59 1.23 1.28 1.23.71 0 1.28-.58 1.28-1.28s-.57-1.28-1.28-1.28c-.5 0-.93.29-1.14.71l-2.58-.55a.36.36 0 0 0-.42.27l-.8 3.8C8.38 8.74 6.66 9.22 5.4 9.93A1.5 1.5 0 0 0 4.5 9.5C3.67 9.5 3 10.17 3 11c0 .54.29 1.01.72 1.27-.05.24-.07.48-.07.73 0 2.62 3.13 4.75 7 4.75s7-2.13 7-4.75c0-.25-.03-.49-.07-.73.43-.26.72-.73.72-1.27z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Reddit</span>
            </a>

            {/* 5. WhatsApp */}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Join Geniusphere WhatsApp Community"
            >
              <div style={{ color: '#25D366' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>WhatsApp</span>
            </a>

            {/* 6. YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Subscribe to Geniusphere YouTube Channel"
            >
              <div style={{ color: '#FF0000' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>YouTube</span>
            </a>

            {/* 7. LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              title="Connect with Geniusphere on LinkedIn"
            >
              <div style={{ color: '#0A66C2' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FINAL CALL TO ACTION                                      */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={26} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', maxWidth: '680px' }}>
            Ready to build demonstrable, practical capabilities?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Join independent students and partner school classrooms across India learning real technology, finance, coding, and professional skills with Geniusphere.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('catalogue')}
              style={{ height: '46px', padding: '0 26px', fontSize: '0.95rem' }}
            >
              <span>Explore Course Catalogue</span>
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate('resources')}
              style={{ height: '46px', padding: '0 22px', fontSize: '0.95rem' }}
            >
              <span>Browse Learning Resources</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FREQUENTLY ASKED QUESTIONS                                */}
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

          {/* Mid-bar divider (Image 1) */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div>© 2026 Geniusphere. All rights reserved. Real database persistence. Zero fake statistics.</div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Active Pilot Deployment</span>
              <span>•</span>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Privacy Policy</a>
              <span>•</span>
              <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Terms of Service</a>
            </div>
          </div>

          {/* Sub-footer dual bar (Image 1) */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div>© 2026 Geniusphere. Evidence-Backed Education Platform.</div>
            <div>Four Core Disciplines • 27 Approved Curricular Courses • Zero Fabricated Data</div>
          </div>
        </div>
      </footer>

      {/* Interactive Simulation Lab Modal (Cyber Lab Reference Image 2) */}
      <SimulationLabModal
        isOpen={simLabOpen}
        onClose={() => setSimLabOpen(false)}
        courseTitle={simLabCourseTitle}
      />

      {/* Interactive Event Registration Modal (Hackathons Reference Image 4) */}
      <EventRegisterModal
        isOpen={!!selectedEventForRegister}
        onClose={() => setSelectedEventForRegister(null)}
        event={selectedEventForRegister}
      />

      {/* Interactive Campus Ambassador Modal (Representative Reference Image 5) */}
      <AmbassadorModal
        isOpen={ambassadorModalOpen}
        onClose={() => setAmbassadorModalOpen(false)}
      />
    </div>
  );
};
