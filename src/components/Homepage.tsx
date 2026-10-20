import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { GamifiedLearningRoadmap } from './GamifiedLearningRoadmap';
import { PilotApplicationModal } from './PilotApplicationModal';
import {
  ShieldCheck,
  ArrowRight,
  Terminal,
  School,
  Cpu,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code2,
  FlaskConical,
  TrendingUp,
  Users,
  Award,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface HomepageProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, slug?: string) => void;
  currentUserId: string;
}

export const Homepage: React.FC<HomepageProps> = ({ db, onNavigate, currentUserId: _currentUserId }) => {
  const publishedCourses = db.getCanonicalCourses();
  const allLabs = db.getLabDefinitions();

  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [selectedDomainTab, setSelectedDomainTab] = useState<'all' | 'technology' | 'finance' | 'professional'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const filteredCourses = publishedCourses.filter((c) => {
    if (selectedDomainTab === 'all') return true;
    return c.domain === selectedDomainTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION (NotebookLM Style: Clean, Centered & Living) */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '64px 24px 80px',
          width: '100%',
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '420px',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.08), rgba(67, 168, 91, 0.04), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow Live Indicator Pill */}
          <div
            className="animate-pulse-glow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                boxShadow: '0 0 10px var(--brand-primary)',
              }}
            />
            <span>GENIUSPHERE V2.0 • INTERACTIVE LEARNING ENGINE</span>
          </div>

          {/* Main Headline (Space Grotesk, Editorial High-Impact) */}
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
              maxWidth: '920px',
            }}
          >
            Turn complex concepts into{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, #2563EB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              hands-on mastery
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: '680px',
              fontWeight: 500,
            }}
          >
            The educational platform with <strong>18 canonical courses</strong>,{' '}
            <strong>180 interactive sub-module simulation labs</strong>, and an{' '}
            <strong>in-browser multi-language code sandbox</strong>. Zero cloud costs, 100% deterministic.
          </p>

          {/* Primary CTA: "Try Geniusphere" (NotebookLM Pill Style) */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              className="btn-shimmer"
              onClick={() => onNavigate('catalogue')}
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                padding: '16px 36px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2), 0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.2)';
              }}
            >
              <span>Try Geniusphere</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('labs')}
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '15px 28px',
                borderRadius: '100px',
                border: '1.5px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <Terminal size={17} color="var(--brand-primary)" />
              <span>Explore 14 Labs</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('code-sandbox')}
              style={{
                backgroundColor: 'var(--bg-canvas)',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '14px 24px',
                borderRadius: '100px',
                border: '1.5px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <Code2 size={17} color="var(--brand-primary)" />
              <span>Open Code Sandbox</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* GAMIFIED STEPPED LEARNING PATH & INTERACTIVE LAB ROADMAP     */}
          {/* ============================================================ */}
          <div style={{ width: '100%', marginTop: '24px' }}>
            <GamifiedLearningRoadmap
              onLaunchLab={(slug) => onNavigate('lab-workspace', slug)}
              onLaunchCourse={(slug) => onNavigate('course-detail', slug)}
              onNavigateCatalogue={() => onNavigate('catalogue')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. KEY METRICS & TRUST STRIP                                  */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '24px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>18</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Canonical Courses</div>
            </div>
          </div>

          <div className="card-interactive-lift" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', borderRadius: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <Terminal size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>180</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sub-Module Labs</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>In-Browser Deterministic</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>Cambridge CIE</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Evidence-Based Standards</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INSIDE THE SOFTWARE: THE TRIAD OF COURSES, LABS & SANDBOX */}
      {/* ============================================================ */}
      <section style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.06em' }}>
            INSIDE THE SOFTWARE
          </span>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '8px 0 16px',
            }}
          >
            Everything you need in one focused workspace
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            No cluttered feeds or passive video watching. When you enter Geniusphere, your screen transforms into a productive studio with three integrated tools:
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Pillar 1: Canonical Courses */}
          <div
            className="card-interactive-lift"
            style={{
              padding: '32px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(67, 168, 91, 0.1)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={24} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              1. Canonical Courses
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Curated, peer-reviewed curriculum organized into bite-sized concept lessons, real-world case studies, and interactive knowledge checks.
            </p>

            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>12 comprehensive technology and finance courses</li>
              <li>Structured learning roadmaps with progressive depth</li>
              <li>Integrated syllabus and lesson navigation</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              style={{
                marginTop: 'auto',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Explore Curriculum</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 2: Interactive Simulation Labs */}
          <div
            style={{
              padding: '32px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={24} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              2. Interactive Simulation Labs
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Manipulate variables in real time. Simulate neural network weights, mine cryptographic blocks, trace telemetry packets, and match stock orders.
            </p>

            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>14 standalone interactive simulations</li>
              <li>Step-by-step guidance with live visual feedback</li>
              <li>Instant verification and criteria rubrics</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('labs')}
              style={{
                marginTop: 'auto',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Launch Lab Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 3: In-Browser Code Sandbox */}
          <div
            style={{
              padding: '32px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Code2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              3. In-Browser Code Sandbox
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Write, compile, and execute code in Python, C, SQL, and JavaScript client-side with zero installation and instant execution.
            </p>

            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Multi-language compilation directly in the browser</li>
              <li>Built-in test assertions and diagnostic consoles</li>
              <li>Syntax highlighting with CodeMirror editor</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('code-sandbox')}
              style={{
                marginTop: 'auto',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Launch Code Sandbox</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CURRICULUM EXPLORER (With Domain Filter Tabs)             */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--bg-canvas)',
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.06em' }}>
                CANONICAL CURRICULUM
              </span>
              <h2
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: '6px 0 0',
                }}
              >
                Explore All 18 Authoritative Courses
              </h2>
            </div>

            {/* Domain Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Courses (18)' },
                { id: 'technology', label: 'Technology & AI (7)' },
                { id: 'finance', label: 'Finance & Markets (6)' },
                { id: 'professional', label: 'Professional Skills (5)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedDomainTab(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    backgroundColor: selectedDomainTab === tab.id ? 'var(--brand-primary)' : 'var(--bg-surface)',
                    borderColor: selectedDomainTab === tab.id ? 'var(--brand-primary)' : 'var(--border-subtle)',
                    color: selectedDomainTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredCourses.map((c) => {
              const domainColor =
                c.domain === 'technology'
                  ? '#059669'
                  : c.domain === 'finance'
                  ? '#D97706'
                  : '#7C3AED';
              const DomainIcon =
                c.domain === 'technology'
                  ? Cpu
                  : c.domain === 'finance'
                  ? TrendingUp
                  : Users;

              return (
                <div
                  key={c.id}
                  className="card-interactive-lift"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: `${domainColor}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: domainColor,
                        }}
                      >
                        <DomainIcon size={16} />
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          backgroundColor: `${domainColor}12`,
                          color: domainColor,
                          border: `1px solid ${domainColor}30`,
                        }}
                      >
                        {c.domain}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {c.duration_hours} hrs • {c.level}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {c.title}
                  </h4>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                    {c.summary}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Play size={12} color="var(--brand-primary)" />
                      10 Modules
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FlaskConical size={12} color="#059669" />
                      10 Sub-Module Labs
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-subtle)',
                      gap: '10px',
                    }}
                  >
                    <button
                      type="button"
                      className="btn-shimmer"
                      onClick={() => onNavigate('course-detail', c.slug)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(36, 76, 58, 0.25)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>Explore Course</span>
                      <ArrowRight size={14} />
                    </button>

                    {(() => {
                      const linkedLab = allLabs.find((l) => l.course_slug === c.slug || l.slug === (c as any).linked_lab_slug || l.slug === c.slug);
                      if (!linkedLab) return null;
                      return (
                        <button
                          type="button"
                          onClick={() => onNavigate('lab-workspace', linkedLab.slug)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--brand-surface)',
                            border: '1px solid var(--brand-border)',
                            color: 'var(--brand-primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                          title={`Launch ${linkedLab.title}`}
                        >
                          <FlaskConical size={13} color="var(--brand-primary)" />
                          <span>Interactive Lab</span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (Comprehensive Accordion)      */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.06em' }}>
              CLEAR & EVIDENCE-BACKED ANSWERS
            </span>
            <h2
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '8px 0',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
              Learn how Geniusphere operates, how the in-browser labs work, and how we protect student privacy.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: 'What makes Geniusphere different from traditional video-based platforms?',
                a: 'Traditional platforms rely on passive video lectures that result in low retention. Geniusphere combines bite-sized conceptual lessons with 14 deterministic interactive simulation labs and an in-browser code editor. Students must physically interact with variables, test hypotheses, and pass objective automated criteria before earning verified credentials.',
              },
              {
                q: 'How do the interactive simulation labs run without server costs or API keys?',
                a: 'Every simulation in Geniusphere is built using pure mathematical modeling, deterministic state machines, and browser-native cryptographic algorithms (such as the Web Cryptography API for SHA-256). Everything executes client-side on the user’s computer, which guarantees zero latency, zero cloud bills, and 100% offline-ready reliability.',
              },
              {
                q: 'Can students write and run Python, C, and SQL code without installing anything?',
                a: 'Yes. Geniusphere integrates a multi-language in-browser coding sandbox. For SQL, it uses an in-memory SQLite WASM engine. For Python and C, code is executed and validated in isolated, sandboxed browser runtimes with real test assertions and instant terminal output—no compiler installations or administrative privileges required.',
              },
              {
                q: 'How does Geniusphere align with Cambridge International (CIE) standards?',
                a: 'Geniusphere incorporates an Evidence-Based Assessment Matrix modeled after Cambridge International Education (CIE) rubric criteria. Every lab attempt logs an immutable, tamper-evident audit trail with exact input parameters, calculated states, and timestamps, allowing teachers and external examiners to verify genuine student competence.',
              },
              {
                q: 'Is student data private and secure for minors and schools?',
                a: 'Geniusphere adheres strictly to the Digital Personal Data Protection (DPDP) Act 2023 and COPPA/FERPA international benchmarks. There is zero commercial advertising, zero third-party marketing tracking, and verifiable parental consent ledgers for learners under 18 years. Data stays within sovereign boundaries.',
              },
              {
                q: 'How do teachers and institutions manage classrooms and view student gradebooks?',
                a: 'Institutions can create managed cohorts with 8-character join codes. Teachers gain access to a dedicated Gradebook view with real-time completion percentages, objective rubric scores, and one-click PDF/CSV evidence export for school records and inspection audits.',
              },
              {
                q: 'What devices and system requirements are needed to run Geniusphere?',
                a: 'Geniusphere is engineered to run seamlessly on any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari) on laptops, desktops, Chromebooks, and tablets. It is optimized for low-bandwidth school lab environments.',
              },
              {
                q: 'How are certificates earned and verified?',
                a: 'Certificates are issued only when a student demonstrates 100% completion across course lessons, hands-on simulation checkpoints, and passing unit tests. Each certificate includes a unique verification code and cryptographic hash that can be independently audited by universities or employers.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    color: 'var(--text-primary)',
                    gap: '12px',
                  }}
                >
                  <span>{faq.q}</span>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {openFaq === idx && (
                  <div
                    style={{
                      padding: '0 22px 20px 22px',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '14px',
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

      {/* ============================================================ */}
      {/* 6. FINAL HIGH-IMPACT CALL TO ACTION (Try Geniusphere)        */}
      {/* ============================================================ */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--bg-canvas)',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(67, 168, 91, 0.35)',
            }}
          >
            <Award size={28} />
          </div>

          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Ready to turn curiosity into verifiable mastery?
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Join thousands of students and teachers exploring modern technology, finance, and programming in an interactive browser workspace.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                padding: '16px 38px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Try Geniusphere Now</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setPilotModalOpen(true)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '15px 28px',
                borderRadius: '100px',
                border: '1.5px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <School size={17} />
              <span>For Schools & Institutions</span>
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            ✓ 100% Free Access • ✓ No Credit Card Required • ✓ Runs in Browser
          </div>
        </div>
      </section>

      {/* Institutional Pilot Modal */}
      <PilotApplicationModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
      />
    </div>
  );
};
