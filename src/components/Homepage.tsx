import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Shield,
  Terminal,
  ArrowRight,
  Coins,
  Briefcase,
  CheckCircle2,
  Award,
  ChevronRight,
  School,
  Play,
  Code,
  Sparkles,
  Search,
  GraduationCap,
} from 'lucide-react';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, courseSlug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [homeSearch, setHomeSearch] = useState<string>('');
  const [homeDomain, setHomeDomain] = useState<string>('all');
  const [homeDifficulty, setHomeDifficulty] = useState<string>('all');

  const allPublishedCourses = db.getCourses({ publishedOnly: true });
  const learningPaths = db.getLearningPaths();

  // Filter courses for in-page course discovery
  const filteredCourses = allPublishedCourses.filter((course) => {
    const matchesSearch =
      !homeSearch.trim() ||
      course.title.toLowerCase().includes(homeSearch.toLowerCase()) ||
      course.summary.toLowerCase().includes(homeSearch.toLowerCase()) ||
      course.subject.toLowerCase().includes(homeSearch.toLowerCase());
    const matchesDomain = homeDomain === 'all' || course.domain === homeDomain;
    const matchesDifficulty = homeDifficulty === 'all' || course.level === homeDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const formatModules = (count: number) => {
    return `${count} ${count === 1 ? 'module' : 'modules'}`;
  };

  // 21 Canonical Frequently Asked Questions
  const faqList = [
    {
      q: '1. What is Geniusphere?',
      a: 'Geniusphere is an evidence-backed education platform delivering practical curriculum in technology, coding, finance, and professional skills for independent learners and educational institutions.',
    },
    {
      q: '2. Who can use Geniusphere?',
      a: 'Independent learners, school and college students, teachers, educational institutions, and parents/guardians seeking practical, verifiable skills.',
    },
    {
      q: '3. Which subjects are available?',
      a: '27 reconciled curricular subjects across four core domains: Technology (8 subjects), Coding & Programming (7 subjects), Finance (7 subjects), and Professional Skills (5 subjects).',
    },
    {
      q: '4. Are courses self-paced?',
      a: 'Yes. All courses support self-paced learning for independent students, while teachers can establish structured assignment schedules and due dates for classroom cohorts.',
    },
    {
      q: '5. How do interactive labs work?',
      a: 'Labs execute in lightweight WebAssembly sandboxes (such as SQLite-WASM) in your browser for responsive experimentation, and evaluate queries against server-side test suites for authoritative grading.',
    },
    {
      q: '6. How does SQL Lab 101 work?',
      a: 'Lab 101 demonstrates SQL injection defense. Learners replace vulnerable string concatenation with parameterized prepared statements (?), and submit queries to a 5-assertion challenge evaluation.',
    },
    {
      q: '7. How do classroom join codes work?',
      a: 'Teachers generate 8-character cryptographic alphanumeric join codes with a 14-day validity window. Students enter the code to enroll directly into their school cohort, and teachers can revoke codes at any time.',
    },
    {
      q: '8. Can schools and colleges use Geniusphere?',
      a: 'Yes. Educational institutions can create institutional workspaces with multi-tenant isolation, onboard educators, provision classrooms, and monitor cohort progress.',
    },
    {
      q: '9. How do teachers assign work?',
      a: 'Teachers select courses or interactive labs from the curriculum, set due dates and instructions in the Teacher Workspace, and distribute assignments directly to enrolled classrooms.',
    },
    {
      q: '10. How is student progress recorded?',
      a: 'Progress is recorded per lesson, quiz, and lab attempt. Completed lessons, quiz scores, and lab submission hashes are persisted in the database.',
    },
    {
      q: '11. How are quizzes and assignments graded?',
      a: 'Quizzes are evaluated against server-side answer keys, and lab challenges execute in isolated test environments. Clients cannot forge or manipulate scores.',
    },
    {
      q: '12. How are achievements and certificates earned?',
      a: 'Achievements are awarded only after achieving qualifying scores on verified lab challenges and completing course modules. Completed submissions generate cryptographic SHA-256 validation hashes.',
    },
    {
      q: '13. Can students use Geniusphere on mobile devices?',
      a: 'Yes. The platform is built as a responsive progressive web app (PWA) with touch-safe controls (>=44px), optimized layout down to 360px viewports, and lightweight CodeMirror 6 editors.',
    },
    {
      q: '14. Can learners resume their progress on another device?',
      a: 'Yes. Authenticated learner progress, enrolled courses, and earned lab submissions synchronize with the database.',
    },
    {
      q: '15. What is SchoolKit?',
      a: 'SchoolKit is an educator resource pack providing operational guidelines, classroom onboarding instructions, curriculum resources, and student safety guidance for schools and colleges.',
    },
    {
      q: '16. What is the Resume Builder?',
      a: 'The Resume Builder is a student tool that formats technical resumes and automatically integrates verified course completions and lab achievement scores (with SHA-256 hashes) into exportable JSON and print documents.',
    },
    {
      q: '17. How is student information protected?',
      a: 'Student information is protected through strict database authorization boundaries, tenant-isolated schemas, column-level update restrictions, and immutable audit logs.',
    },
    {
      q: '18. How does guardian consent work where required?',
      a: 'For minor accounts, accounts are placed in pending consent status until verified by a parent or guardian via email verification and consent confirmation.',
    },
    {
      q: '19. How can an institution get started?',
      a: 'Institutions can access the Educator SchoolKit, review the deployment guidelines, establish an institutional tenant, and onboard verified teachers.',
    },
    {
      q: '20. How can a user contact Geniusphere?',
      a: 'Users and educational partners can reach out via the institutional support portal or email support@geniusphere.tech for pilot onboarding and technical support.',
    },
    {
      q: '21. What features are currently available?',
      a: 'Currently available: the complete 27-subject course catalogue, interactive lesson player with quizzes, SQL Defense Lab 101 with server grading, Classroom Manager with join codes, Teacher Gradebook, Technical Resume Builder, Educator SchoolKit, Parent Consent Portal, and Audit Trail.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* ============================================================ */}
      {/* 1. CLEAN, COMPACT SUB-HEADER & QUICK NAVIGATION              */}
      {/* ============================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Quick Links:</span>
            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}
            >
              Explore 27 Courses
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              Interactive SQL Lab
            </button>
            <button
              type="button"
              onClick={() => onNavigate('classrooms')}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}
            >
              Classroom & Join Codes
            </button>
            <button
              type="button"
              onClick={() => onNavigate('resume-builder')}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}
            >
              Resume Builder
            </button>
            <button
              type="button"
              onClick={() => onNavigate('schoolkit')}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}
            >
              Educator SchoolKit
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
              Four Core Disciplines
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              27 Reconciled Subjects
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SECTION 1: HERO                                           */}
      {/* ============================================================ */}
      <section style={{ padding: '72px 24px 64px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}>
              <Sparkles size={15} />
              <span>EVIDENCE-BACKED EDUCATION PLATFORM</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
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
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '540px',
              }}
            >
              Explore practical technology, understand how money works, build professional skills, and strengthen your coding abilities through hands-on learning.
            </p>

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
                className="btn-outline"
                onClick={() => onNavigate('lab')}
                style={{ height: '48px', padding: '0 22px', fontSize: '0.95rem' }}
              >
                <Terminal size={18} />
                <span>Try SQL Lab 101</span>
              </button>
            </div>
          </div>

          {/* Real Visual Preview Card */}
          <div className="card-elevated" style={{ padding: '24px', borderTop: '4px solid var(--brand-primary)', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-brand">FEATURED LEARNING LAB</span>
                <span className="badge badge-success">READY TO RUN</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lab 101</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              SQL Parameterization & Defense
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Learn why concatenating untrusted strings into queries creates injection vulnerabilities, and write parameterized queries using positional placeholders.
            </p>

            {/* Code Snippet Preview */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-subdued)',
                borderRadius: '8px',
                padding: '14px 16px',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '18px',
                overflowX: 'auto',
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>-- Defended parameterized query structure:</div>
              <div>SELECT id, username, role</div>
              <div>FROM challenge_users</div>
              <div style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>WHERE username = ? AND account_status = 'active';</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Target: <strong>challenge_users</strong> • Score: <strong>100 pts</strong>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('lab')}
                style={{ height: '36px', padding: '0 16px', fontSize: '0.82rem' }}
              >
                Launch Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SECTION 2: FOUR CLEAR LEARNING AREAS                      */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>
              Four Essential Learning Areas
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
              A coherent curriculum designed for modern students, covering emerging technology, practical coding, financial foundations, and professional skills.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {/* Card 1: Technology */}
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => onNavigate('catalogue', 'technology')}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Shield size={24} color="var(--brand-primary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Technology</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Artificial intelligence, responsible AI, blockchain fundamentals, Internet of Things (IoT), Microsoft enterprise tools, digital privacy, cybersecurity, and computing systems.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>8 Subjects</span>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Technology <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 2: Coding & Programming */}
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => onNavigate('catalogue', 'coding')}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Code size={24} color="var(--success)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Coding & Programming</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Programming fundamentals, variables, data types, conditions, loops, algorithmic problem-solving, relational databases and SQL, web development, and debugging exercises.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7 Subjects</span>
                <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Coding <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 3: Finance */}
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => onNavigate('catalogue', 'finance')}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Coins size={24} color="var(--warning)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Finance</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Introduction to finance, global economic events, financial markets, banking institutions, cryptocurrency education and risks, stock market fundamentals, and fintech.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7 Subjects</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Finance <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Card 4: Professional Skills */}
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => onNavigate('catalogue', 'professional')}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Briefcase size={24} color="#4F46E5" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Professional Skills</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Time management, workplace professional etiquette, soft skills development, social profiles and professional identity, and evidence-backed portfolio building.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5 Subjects</span>
                <span style={{ color: '#4F46E5', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Skills <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SECTION 3: LEARNING METHOD                                */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Pedagogical Architecture
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Learn → Experiment → Solve → Prove</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Education is not passive video consumption. Every subject follows a clear progression from structured concept to working proof.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>01</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Learn Through Lessons</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Read structured lessons, analyze technical threat models, and study architectural trade-offs without unnecessary jargon.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginBottom: '8px' }}>02</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Experiment in Labs</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Interact with real client-side WebAssembly sandboxes (SQLite, Python) to test hypotheses with zero installation friction.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)', marginBottom: '8px' }}>03</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Solve Challenges</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Apply defensive patterns, write parameterized templates, and solve practical challenges against adversarial payloads.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #4F46E5' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4F46E5', marginBottom: '8px' }}>04</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Prove Verified Skills</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Receive authoritative server grading and build an evidence-backed portfolio with cryptographic completion records.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SECTION 4: COURSE DISCOVERY                               */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Find your next learning challenge.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Explore published courses with structured modules, real lesson content, and hands-on exercises.
              </p>
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue')}
            >
              <span>View All 27 Courses</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* In-Page Course Filters & Search */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ flex: '1 1 260px', position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="Search courses by keyword (e.g. SQL, AI, Finance, Loops)..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Subjects' },
                { id: 'technology', label: 'Technology' },
                { id: 'coding', label: 'Coding' },
                { id: 'finance', label: 'Finance' },
                { id: 'professional', label: 'Professional' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setHomeDomain(tab.id)}
                  className={homeDomain === tab.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ height: '36px', padding: '0 14px', fontSize: '0.82rem' }}
                >
                  {tab.label}
                </button>
              ))}

              <select
                value={homeDifficulty}
                onChange={(e) => setHomeDifficulty(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  fontSize: '0.82rem',
                }}
                aria-label="Filter difficulty"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Filtered Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredCourses.slice(0, 6).map((course) => (
              <div key={course.id} className="card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge badge-brand">
                      {course.domain === 'coding' ? 'CODING & PROGRAMMING' : course.domain.toUpperCase()}
                    </span>
                    {course.availability_status === 'verified_functional' ? (
                      <span className="badge badge-success">AVAILABLE NOW</span>
                    ) : course.availability_status === 'implemented_in_build' ? (
                      <span className="badge badge-brand">AVAILABLE NOW</span>
                    ) : (
                      <span className="badge badge-neutral">CURRICULUM ROADMAP</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {course.summary}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    <div>Subject: <strong>{course.subject}</strong></div>
                    <div>Curriculum: <strong>{formatModules(course.modules.length)}</strong> • Est. Duration: <strong>{course.duration_hours} hrs</strong></div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onNavigate('course-detail', course.slug)}
                  style={{ width: '100%', height: '40px', fontSize: '0.875rem' }}
                >
                  View Syllabus & Enroll
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue')}
              style={{ padding: '0 24px', height: '42px', fontSize: '0.9rem' }}
            >
              <span>Explore All 27 Curricular Subjects in Full Catalogue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SECTION 5: INTERACTIVE LABS (FEATURING LAB 101)           */}
      {/* ============================================================ */}
      <section id="labs" style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hands-On Laboratories
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Interactive Learning Sandboxes</h2>
          </div>
          <span className="badge badge-brand">SQLite-WASM Sandbox</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-brand">WEB DEFENSE</span>
                <span className="badge badge-success">OPERATIONAL NOW</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Lab 101: SQL Parameterization & Injection Defense
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Defeat authentication bypass vulnerabilities by implementing native positional parameter placeholders (?) and testing against 5 attack payloads.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Runtime: <strong>Client-side SQLite-WASM Sandbox</strong> • Evaluation: <strong>Server-Authoritative (100 pts)</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('lab')}
              style={{ width: '100%', height: '40px' }}
            >
              <Play size={16} />
              <span>Launch Lab 101 Workspace</span>
            </button>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-neutral">NETWORK SECURITY</span>
                <span className="badge badge-neutral">PLANNED LAB</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Lab 102: Network Packet Inspection & TLS Handshake
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Trace cryptographic key exchange, cipher suites, and certificate validation in simulated browser connections.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Runtime: <strong>Interactive Protocol Visualizer</strong> • Score: <strong>100 pts</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              disabled
              style={{ width: '100%', height: '40px', cursor: 'not-allowed' }}
            >
              Curriculum Roadmap
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. SECTION 6: CONCISE LEARNING PATHS                         */}
      {/* ============================================================ */}
      <section id="paths" style={{ backgroundColor: 'var(--bg-surface)', padding: '60px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Structured Learning Paths</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Sequential progressions linking foundational concepts to practical challenges and verified mastery.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {learningPaths.map((path) => (
              <div key={path.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-neutral">
                      {path.domain === 'coding' ? 'CODING' : path.domain.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{path.course_ids.length} Courses</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{path.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {path.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onNavigate('catalogue', path.domain)}
                  style={{ height: '36px', fontSize: '0.8rem', width: '100%' }}
                >
                  Explore Path Courses
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. SECTION 7: SCHOOLS AND COLLEGES                           */}
      {/* ============================================================ */}
      <section id="schools" style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Institutional Workflows
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
              Bring structured, practical learning into the classroom.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Geniusphere empowers educational institutions to organize cohorts, distribute structured labs, review authentic submissions, and track class mastery with robust multi-tenant isolation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Classroom Creation & Join Codes:</strong> Unpredictable random alphanumeric codes with 14-day expiration and teacher revocation.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Lab & Course Assignments:</strong> Teachers distribute structured challenges with due dates directly to class cohorts.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Assessment & Progress Feedback:</strong> Review student attempt counts, server-verified scores, and tamper-evident submission hashes.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('classrooms')}
                style={{ height: '44px', padding: '0 20px', fontSize: '0.9rem' }}
              >
                <School size={16} />
                <span>Explore School Programs</span>
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>The Institutional Lifecycle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>1.</span>
                <span>Institution establishes workspace and adds verified faculty.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>2.</span>
                <span>Teacher provisions classroom section and generates secure Crockford Base32 join code.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>3.</span>
                <span>Students enroll using join code; single-membership rules prevent duplicates.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>4.</span>
                <span>Teacher assigns labs and reviews student progress in live gradebook.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. SECTION 8: EDUCATORS                                      */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Faculty Resources
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Tools for educators.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Classroom management, assignment distribution, server-side grading, and SchoolKit guidelines.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('gradebook')}
              style={{ height: '42px', fontSize: '0.9rem' }}
            >
              <GraduationCap size={16} />
              <span>Explore Educator Tools</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Classroom Management</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Generate, revoke, or expire classroom join codes in real time. Manage student rosters with zero duplicate enrollments.
              </p>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Assignment Distribution</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Assign Lab 101 or specific curriculum modules with due dates and rubric criteria to entire student cohorts.
              </p>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Live Teacher Gradebook</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Inspect student submission timestamps, passed assertion counts, and SHA-256 integrity hashes from server evaluations.
              </p>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>SchoolKit Guidelines</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Downloadable implementation handbook covering multi-tenant architecture, student safety, and curriculum standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. SECTION 9: STUDENT TOOLS                                 */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Practical Tools</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Functional utilities to help learners prove their skills and build verifiable career assets.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Tool 1: Resume Builder */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={22} color="var(--brand-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Technical Resume Builder</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Build structured technical resumes with auto-discovered verified achievements from completed labs (including integrity hashes) and export clean JSON or print-ready versions.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('resume-builder')}
              style={{ height: '40px', fontSize: '0.875rem' }}
            >
              Open Resume Builder
            </button>
          </div>

          {/* Tool 2: Student Portfolio */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Briefcase size={22} color="#4F46E5" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Student Portfolio</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Curate evidence-backed project artifacts, deployment links, and code repositories into a professional technical showcase.
              </p>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('resume-builder')}
              style={{ height: '40px', fontSize: '0.875rem' }}
            >
              View Portfolio Assets
            </button>
          </div>

          {/* Tool 3: Verified Achievements */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={22} color="var(--warning)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Verified Learning Achievements</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Tamper-evident achievement records backed by server-authoritative challenge assertions and immutable database submissions.
              </p>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('lab')}
              style={{ height: '40px', fontSize: '0.875rem' }}
            >
              Verify Achievements
            </button>
          </div>

          {/* Tool 4: SchoolKit for Educators */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <School size={22} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>SchoolKit for Educators</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Operational guidelines, safeguarding protocols, and a downloadable JSON Educator Pack covering multi-tenant architecture and join-code policies.
              </p>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('schoolkit')}
              style={{ height: '40px', fontSize: '0.875rem' }}
            >
              Open SchoolKit Guide
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. SECTION 10: ABOUT GENIUSPHERE                            */}
      {/* ============================================================ */}
      <section id="about" style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Educational Mission
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '18px' }}>
            About Geniusphere
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Geniusphere was founded on a simple conviction: modern students need practical, hands-on understanding of technology, computing, money, and professional communication that traditional textbooks do not adequately cover.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Evidence-Based Pedagogy</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                We believe mastery is proven through writing real code, executing queries, solving real challenges, and defending systems against adversarial inputs.
              </p>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Accessible & Safe</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Engineered with zero commercial advertising trackers, respectful minor safeguarding, warm light visual aesthetics, and responsive layout across mobile and desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. SECTION 11: 21 FREQUENTLY ASKED QUESTIONS                */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Accurate answers about our curriculum, interactive laboratories, and platform policies.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqList.map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{faq.q}</span>
                <ChevronRight size={18} color="var(--text-muted)" style={{ transform: activeFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              {activeFaq === idx && (
                <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. SECTION 12: FINAL CTA & FUNCTIONAL FOOTER                */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--brand-primary)', color: '#FFF', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>
            Ready to build practical skills?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#E0E7FF', lineHeight: 1.6, marginBottom: '28px' }}>
            Explore the courses, try an interactive lab, and turn your completed work into evidence of what you can do.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              style={{
                backgroundColor: '#FFF',
                color: 'var(--brand-primary)',
                fontWeight: 700,
                padding: '0 24px',
                height: '46px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Explore Courses
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              style={{
                backgroundColor: 'transparent',
                color: '#FFF',
                fontWeight: 600,
                padding: '0 22px',
                height: '46px',
                borderRadius: '8px',
                border: '2px solid #FFF',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Try Lab 101
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer style={{ backgroundColor: '#18181B', color: '#D4D4D8', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Shield size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFF' }}>GENIUSPHERE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.5 }}>
              Accessible, hands-on learning across technology, coding, finance, and professional development.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>Curriculum Areas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('catalogue', 'technology')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Technology (8 Subjects)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalogue', 'coding')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Coding & Programming (7 Subjects)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalogue', 'finance')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Finance (7 Subjects)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalogue', 'professional')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Professional Skills (5 Subjects)
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>Workspaces & Tools</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Interactive SQL Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate('classrooms')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Classroom Manager
              </button>
              <button
                type="button"
                onClick={() => onNavigate('resume-builder')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Resume Builder
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schoolkit')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                SchoolKit Guide
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>Platform Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Home Overview
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalogue')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Explore Courses
              </button>
              <button
                type="button"
                onClick={() => onNavigate('paths')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Learning Paths
              </button>
              <button
                type="button"
                onClick={() => onNavigate('classrooms')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                For Schools & Colleges
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schoolkit')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                For Educators
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid #27272A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: '#71717A' }}>
          <span>© 2026 Geniusphere. Evidence-Backed Education.</span>
          <span>Four Authorized Learning Areas • 27 Substantive Curricular Subjects</span>
        </div>
      </footer>
    </div>
  );
};
