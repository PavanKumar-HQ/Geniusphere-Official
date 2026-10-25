import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import { MascotSphere, MascotExpression } from './MascotSphere';

interface SoftwareUserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTeacher?: boolean;
  onNavigate?: (view: string) => void;
}

interface GuideChapter {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  mascotPose: MascotExpression;
  speechText: string;
  content: string[];
  actionLabel?: string;
  actionView?: string;
}

export const SoftwareUserGuideModal: React.FC<SoftwareUserGuideModalProps> = ({
  isOpen,
  onClose,
  isTeacher = false,
  onNavigate,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!isOpen) return null;

  const chapters: GuideChapter[] = [
    {
      id: 'architecture',
      tabLabel: '1. Overview',
      title: 'Geniusphere Software Overview',
      subtitle: 'Local-first architecture and deterministic learning',
      mascotPose: 'happy',
      speechText: 'Hello! I am Sphere, your Geniusphere guide. Welcome to the suite!',
      content: [
        'Geniusphere is engineered as a local-first academic platform powered by high-performance in-memory databases and client-side SQL execution.',
        'All student progress, lesson evaluations, code submissions, and certificates persist deterministically on your device.',
        'Zero tracking cookies or external ad networks are permitted, adhering strictly to student privacy and DPDP standards.',
      ],
      actionLabel: 'Explore Courses',
      actionView: 'catalogue',
    },
    {
      id: 'curriculum',
      tabLabel: '2. 40 Canonical Courses',
      title: '40 Canonical Standard Courses',
      subtitle: 'Structured across 3 approved foundational streams',
      mascotPose: 'guidance',
      speechText: 'Choose from 40 verified courses across Technology, Finance, and Life Skills!',
      content: [
        'Technology & Digital Skills (12 Courses): From Artificial Intelligence Literacy, Generative AI, and Prompting to Blockchain, IoT, and Cybersecurity.',
        'Financial Literacy & Economy (14 Courses): Practical personal finance, 50/30/20 budgeting, banking systems, UPI payment safety, and investment math.',
        'Professional & Life Skills (14 Courses): Time management, executive communication, public speaking, teamwork, and leadership decision-making.',
        'Every course features bite-sized interactive modules with knowledge checkpoints and practical sandboxes.',
      ],
      actionLabel: 'Open Course Catalogue',
      actionView: 'catalogue',
    },
    {
      id: 'labs',
      tabLabel: '3. Interactive Labs',
      title: 'Interactive Labs & Coding Sandboxes',
      subtitle: 'Execute real code, parameter sweeps, and threat defense',
      mascotPose: 'coding',
      speechText: 'I love writing code here! Test real SQL, Python, and cybersecurity tasks.',
      content: [
        'Interactive SQL Workbench: Run genuine SQLite / SQL.js queries against in-memory schemas with instant tabular results.',
        'Python & Algorithm Execution: Test parameter variations and machine learning classification boundaries in real time.',
        'Cybersecurity Defense Sandbox: Analyze suspicious payloads, inspect headers, and sanitize inputs to defend against vulnerabilities.',
        'Prompt Engineering Arena: Evaluate structured AI system prompts with deterministic consistency metrics.',
      ],
      actionLabel: 'Launch Labs & Projects',
      actionView: 'labs',
    },
    {
      id: 'teacher',
      tabLabel: '4. Educator & Classes',
      title: 'Educator & Classroom Management',
      subtitle: 'Dedicated portal for teachers, cohorts, and gradebooks',
      mascotPose: 'teaching',
      speechText: 'Educators have complete tools to manage cohorts, assignments, and reviews!',
      content: [
        'Classroom Management: Create cohorts (e.g., Grade 10 - Section A) and generate cryptographic 14-day student join codes.',
        'Live Gradebook: Monitor student lab submissions, audit attempts, assign scores (0-100), and write direct feedback.',
        'Curriculum Assignment: Assign specific canonical courses or labs to individual cohorts with custom deadlines.',
        'Evidence of Learning: Export verified outcome reports displaying student completion rates and skill mastery.',
      ],
      actionLabel: isTeacher ? 'Open Gradebook' : 'View Manage Classes',
      actionView: isTeacher ? 'gradebook' : 'classrooms',
    },
    {
      id: 'certificates',
      tabLabel: '5. Certificates Vault',
      title: 'Cryptographic Verifiable Credentials',
      subtitle: 'SHA-256 integrity hashes for verifiable achievement',
      mascotPose: 'celebrating_certificate',
      speechText: 'Complete courses to earn verifiable certificates with cryptographic hashes!',
      content: [
        'When you complete 100% of a course lessons and quizzes, a formal certificate is automatically issued.',
        'Every certificate includes a tamper-proof SHA-256 cryptographic verification hash linking student identity, course ID, and issue timestamp.',
        'Institutional reviewers and recruiters can independently verify credential provenance without centralized dependencies.',
      ],
      actionLabel: 'View Certificates Vault',
      actionView: 'certificates',
    },
  ];

  const currentChapter = chapters[activeChapterIndex];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.28)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            backgroundColor: 'var(--bg-surface-subdued)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Geniusphere Interactive Software Guide
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Guided Tour with Sphere Mascot • Chapter {activeChapterIndex + 1} of {chapters.length}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            aria-label="Close guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chapter Stepper Dots / Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 28px',
            backgroundColor: 'var(--bg-canvas)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
          }}
        >
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChapterIndex(idx)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: '1px solid',
                borderColor: idx === activeChapterIndex ? 'var(--brand-primary)' : 'var(--border-subtle)',
                backgroundColor: idx === activeChapterIndex ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: idx === activeChapterIndex ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {ch.tabLabel}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '32px 32px',
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '32px',
            alignItems: 'center',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Left Column: Animated Mascot with Custom Pose */}
          <div style={{ textAlign: 'center' }}>
            <MascotSphere
              expression={currentChapter.mascotPose}
              size={140}
              speechBubble={currentChapter.speechText}
            />
          </div>

          {/* Right Column: Chapter Content */}
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {currentChapter.title}
            </h3>
            <p
              style={{
                margin: '4px 0 18px',
                fontSize: '0.86rem',
                color: 'var(--brand-primary)',
                fontWeight: 600,
              }}
            >
              {currentChapter.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentChapter.content.map((point, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{point}</span>
                </div>
              ))}
            </div>

            {currentChapter.actionLabel && onNavigate && currentChapter.actionView && (
              <button
                type="button"
                onClick={() => {
                  onNavigate(currentChapter.actionView!);
                  onClose();
                }}
                style={{
                  marginTop: '22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  padding: '9px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>{currentChapter.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '18px 28px',
            backgroundColor: 'var(--bg-surface-subdued)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
            disabled={activeChapterIndex === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 18px',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: activeChapterIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: activeChapterIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: activeChapterIndex === 0 ? 0.5 : 1,
            }}
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {activeChapterIndex + 1} / {chapters.length}
          </span>

          {activeChapterIndex < chapters.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveChapterIndex(activeChapterIndex + 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <span>Next Chapter</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <span>Get Started</span>
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
