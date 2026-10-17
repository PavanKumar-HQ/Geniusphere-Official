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
} from 'lucide-react';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, courseSlug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuredCourses = db.getCourses({ publishedOnly: true });
  const learningPaths = db.getLearningPaths();

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const formatModules = (count: number) => {
    return `${count} ${count === 1 ? 'module' : 'modules'}`;
  };

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
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STRONG HERO SECTION                                       */}
      {/* ============================================================ */}
      <section style={{ padding: '72px 24px 64px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}>
              <Sparkles size={15} />
              <span>PRACTICAL EDUCATION PLATFORM</span>
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
              Master modern technology, write real code, understand the mechanics of money, and build practical professional skills through hands-on challenges and evidence-backed achievements.
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
                <span>Try Interactive Lab</span>
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
      {/* 3. FOUR CLEAR LEARNING-AREA CARDS                            */}
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
      {/* 4. LEARNING BY DOING (THE 4-STEP CYCLE)                      */}
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Learn Concepts</h3>
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
              Apply defensive patterns, write parameterized templates, and test against adversarial attack payloads.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #4F46E5' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4F46E5', marginBottom: '8px' }}>04</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Prove Competency</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Receive authoritative server grading and build an evidence-backed portfolio with verifiable completion records.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DISCOVERABLE FEATURED COURSES                             */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Curriculum</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Flagship courses with interactive modules, lesson quizzes, and practical exercises.
              </p>
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('catalogue')}
            >
              <span>Explore All 27 Courses</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {featuredCourses.map((course) => (
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

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{course.title}</h3>
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
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. INTERACTIVE LAB SECTION FEATURING LAB 101                 */}
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
                <span className="badge badge-success">AVAILABLE NOW</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Lab 101: SQL Parameterization & Injection Defense
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Defeat authentication bypass vulnerabilities by implementing native parameter placeholders and testing against 5 attack payloads.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Runtime: <strong>Client-side SQLite-WASM Sandbox</strong> • Score: <strong>100 pts</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('lab')}
              style={{ width: '100%', height: '40px' }}
            >
              <Play size={16} />
              <span>Launch Lab Workspace</span>
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
      {/* 7. CONCISE SECTION FOR LEARNING PATHS                        */}
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
      {/* 8. FOR SCHOOLS, TEACHERS & CLASSROOMS                        */}
      {/* ============================================================ */}
      <section id="schools" style={{ padding: '64px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Classroom & Institutional Management
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
              Engineered for Real Schools & Colleges
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Geniusphere empowers educators to organize cohorts, distribute structured labs, review authentic submissions, and track class mastery with robust multi-tenant isolation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Cryptographic Join Codes:</strong> Unpredictable random alphanumeric codes with 14-day expiration and teacher revocation.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Gradebook Review:</strong> Real teacher dashboard displaying submission timestamps, attempt counts, and server scores.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Parental Oversight:</strong> Verifiable consent mechanisms and minor data protections.
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
                <span>Classroom Manager</span>
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => onNavigate('schoolkit')}
                style={{ height: '44px', padding: '0 20px', fontSize: '0.9rem' }}
              >
                <span>Educator SchoolKit</span>
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>The Institutional Flow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>1.</span>
                <span>Institution establishes workspace and adds verified teachers.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>2.</span>
                <span>Teacher provisions course section and generates secure join code.</span>
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
      {/* 9. STUDENT TOOLS: RESUME BUILDER & SCHOOLKIT                 */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Practical Learning Tools</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Functional utilities to help learners prove their skills and help institutions deploy coursework.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
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

            {/* Tool 2: SchoolKit */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <School size={22} color="var(--success)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Educator SchoolKit</h3>
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
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. COMPACT FAQ, FINAL CTA & CLEAN FOOTER                    */}
      {/* ============================================================ */}
      <section style={{ padding: '64px 24px', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Straightforward answers about our courses, interactive labs, and platform functionality.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              q: 'Who can use Geniusphere?',
              a: 'Geniusphere is built for independent students, teachers, schools, and colleges seeking practical education in technology, coding, finance, and career skills.',
            },
            {
              q: 'Are the courses self-paced?',
              a: 'Yes. Independent learners can explore courses and complete lessons at their own speed. In classroom mode, teachers can configure assignment schedules and deadlines.',
            },
            {
              q: 'How do the interactive labs work?',
              a: 'Labs run in lightweight WebAssembly environments (like SQLite-WASM) in your browser for instant experimentation, while evaluations are sent to the server for authoritative grading.',
            },
            {
              q: 'How do classroom join codes work?',
              a: 'Teachers generate 8-character cryptographic join codes with a 14-day validity period. Students enter the code to enroll directly into their school cohort.',
            },
            {
              q: 'How are achievements verified?',
              a: 'Achievements are earned only by passing defined automated test assertions. Completed lab submissions generate cryptographic hashes that prevent client-side score forgery.',
            },
            {
              q: 'How is learner privacy protected?',
              a: 'Minor accounts require parental consent verification, and personal progress is protected through strict database authorization boundaries.',
            },
          ].map((faq, idx) => (
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

      {/* Final Call to Action */}
      <section style={{ backgroundColor: 'var(--brand-primary)', color: '#FFF', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>
            Ready to explore real learning?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#E0E7FF', lineHeight: 1.6, marginBottom: '28px' }}>
            Discover our complete 27-subject curriculum or test your skills in the interactive SQL defense lab.
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
              Browse Course Catalogue
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
              Launch Lab 101
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
                Course Catalogue
              </button>
              <button
                type="button"
                onClick={() => onNavigate('paths')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                Learning Paths
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
