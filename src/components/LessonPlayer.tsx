import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Lesson, CourseEnrollment, Certificate } from '../types';
import { EmbeddedLabRenderer } from './EmbeddedLabRenderer';
import { CourseSubmoduleLabStudio } from './CourseSubmoduleLabStudio';
import { LessonCodingSandbox } from './LessonCodingSandbox';
import { CertificateModal } from './CertificateModal';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Clock,
  Play,
  Zap,
  Flame,
  Award,
  Video as VideoIcon,
  Terminal as TerminalIcon,
  BookOpen,
  RotateCcw,
  FlaskConical,
} from 'lucide-react';

import { SupportedLanguage } from '../utils/codeSandboxRunner';
import { CODING_CONCEPTS } from '../data/codingConcepts';
import { backendEngine } from '../backend/RealtimeOrchestrator';

interface LessonPlayerProps {
  db: InMemoryDatabase;
  courseId: string;
  initialLessonId: string;
  initialTab?: 'video' | 'lab' | 'sandbox' | 'animation' | 'concepts';
  currentUserId: string;
  onBackToCourse: () => void;
  onLaunchLab?: (courseSlug: string) => void;
}

const renderFormattedInline = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.85em',
            padding: '2px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--editor-bg, #111827)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--brand-primary)',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

const renderMarkdownNotes = (markdown: string): React.ReactNode => {
  if (!markdown) return null;

  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let codeBlockBuffer: string[] | null = null;
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let elemKey = 0;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type;
    const items = listBuffer.items;
    elements.push(
      <ListTag
        key={elemKey++}
        style={{
          paddingLeft: '24px',
          margin: '4px 0 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {items.map((it, idx) => (
          <li key={idx} style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {renderFormattedInline(it)}
          </li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      flushList();
      if (codeBlockBuffer !== null) {
        const codeText = codeBlockBuffer.join('\n');
        elements.push(
          <pre
            key={elemKey++}
            style={{
              backgroundColor: 'var(--editor-bg, #111827)',
              color: '#E5E7EB',
              padding: '16px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              border: '1px solid var(--border-subtle)',
              margin: '8px 0 14px',
              lineHeight: 1.5,
            }}
          >
            <code>{codeText}</code>
          </pre>
        );
        codeBlockBuffer = null;
      } else {
        codeBlockBuffer = [];
      }
      continue;
    }

    if (codeBlockBuffer !== null) {
      codeBlockBuffer.push(rawLine);
      continue;
    }

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={elemKey++}
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            marginTop: '16px',
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}
        >
          {trimmed.replace('### ', '')}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4
          key={elemKey++}
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginTop: '16px',
            marginBottom: '6px',
            color: 'var(--brand-primary)',
          }}
        >
          {trimmed.replace('#### ', '')}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={elemKey++}
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginTop: '20px',
            marginBottom: '10px',
            color: 'var(--text-primary)',
          }}
        >
          {trimmed.replace('## ', '')}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1
          key={elemKey++}
          style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            marginTop: '24px',
            marginBottom: '12px',
            color: 'var(--text-primary)',
          }}
        >
          {trimmed.replace('# ', '')}
        </h1>
      );
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(ulMatch[1]);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(olMatch[1]);
      continue;
    }

    flushList();
    elements.push(
      <p
        key={elemKey++}
        style={{
          margin: '0 0 10px',
          color: 'var(--text-primary)',
          lineHeight: 1.7,
          fontSize: '0.95rem',
        }}
      >
        {renderFormattedInline(trimmed)}
      </p>
    );
  }

  flushList();

  if (codeBlockBuffer !== null) {
    elements.push(
      <pre
        key={elemKey++}
        style={{
          backgroundColor: 'var(--editor-bg, #111827)',
          color: '#E5E7EB',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.85rem',
          border: '1px solid var(--border-subtle)',
          margin: '8px 0 14px',
        }}
      >
        <code>{codeBlockBuffer.join('\n')}</code>
      </pre>
    );
  }

  return elements;
};

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  db,
  courseId,
  initialLessonId,
  initialTab,
  currentUserId,
  onBackToCourse,
  onLaunchLab,
}) => {
  const course = db.getCourseById(courseId);
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId);
  const [activeTab, setActiveTab] = useState<'video' | 'lab' | 'sandbox'>(() => {
    if (initialTab === 'animation' || initialTab === 'lab') return 'lab';
    if (initialTab === 'sandbox') return 'sandbox';
    return 'video';
  });
  const [electedLanguage, setElectedLanguage] = useState<SupportedLanguage>('python');
  const [enrollment, setEnrollment] = useState<CourseEnrollment>(
    db.getCourseEnrollment(currentUserId, courseId) || db.enrollInCourse(currentUserId, courseId)
  );
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);

  const [overrideVideoId, setOverrideVideoId] = useState<string | null>(null);
  const videoLessons = useMemo(() => db.getVideoLessons(), [db]);

  // Quiz submission state for current lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  if (!course) {
    return <div>Course not found.</div>;
  }

  // Find active lesson and module
  let activeLesson: Lesson | null = null;
  let activeModuleTitle = '';
  const allLessons: Lesson[] = [];

  for (const mod of course.modules) {
    for (const les of mod.lessons) {
      allLessons.push(les);
      if (les.id === currentLessonId) {
        activeLesson = les;
        activeModuleTitle = mod.title;
      }
    }
  }

  if (!activeLesson && allLessons.length > 0) {
    activeLesson = allLessons[0];
  }

  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const nextLesson = allLessons[currentIdx + 1];
  const isCompleted = enrollment.completed_lessons.includes(activeLesson?.id || '');

  // Fallback domain-appropriate educational video mapping
  const fallbackVideoId = useMemo(() => {
    const domainVideos: Record<string, string[]> = {
      technology: ['0mCsluv5FXA', 'wjZofJX0v4M', 'b4b8ktEV4Bg', 'Q3TzZzLzDqw'],
      coding: ['8mAITcNt710', 'eWRfhZUzrAc', 'wjZofJX0v4M'],
      finance: ['PHe0bXAIuk0', 'Rm6p-o4uQ_g', 'X1u3K-z5S2A'],
      professional: ['D5phvOX_t-U', 'X1u3K-z5S2A', '0mCsluv5FXA'],
    };
    const list = domainVideos[course?.domain || 'technology'] || ['0mCsluv5FXA', '8mAITcNt710', 'PHe0bXAIuk0'];
    return list[Math.max(0, currentIdx) % list.length];
  }, [course?.domain, currentIdx]);

  const activeVideoId =
    overrideVideoId ||
    (activeLesson?.video_id && activeLesson.video_id !== 'dQw4w9WgXcQ'
      ? activeLesson.video_id
      : fallbackVideoId);

  const matchedConcept = useMemo(() => {
    const title = (activeLesson?.title || '').toLowerCase();
    const courseTitle = (course?.title || '').toLowerCase();
    const combined = `${title} ${courseTitle}`;
    if (combined.includes('function') || combined.includes('method') || combined.includes('scope')) {
      return CODING_CONCEPTS.find((c) => c.id === 'functions') || CODING_CONCEPTS[0];
    }
    if (combined.includes('loop') || combined.includes('iterat')) {
      return CODING_CONCEPTS.find((c) => c.id === 'loops') || CODING_CONCEPTS[0];
    }
    if (combined.includes('condition') || combined.includes('logic') || combined.includes('if')) {
      return CODING_CONCEPTS.find((c) => c.id === 'conditionals') || CODING_CONCEPTS[0];
    }
    if (combined.includes('hash') || combined.includes('dict') || combined.includes('map') || combined.includes('collection')) {
      return CODING_CONCEPTS.find((c) => c.id === 'hashmaps') || CODING_CONCEPTS[0];
    }
    if (combined.includes('class') || combined.includes('object') || combined.includes('oop') || combined.includes('struct')) {
      return CODING_CONCEPTS.find((c) => c.id === 'oop_classes') || CODING_CONCEPTS[0];
    }
    if (combined.includes('error') || combined.includes('exception') || combined.includes('defense') || combined.includes('security') || combined.includes('inject')) {
      return CODING_CONCEPTS.find((c) => c.id === 'error_handling') || CODING_CONCEPTS[0];
    }
    return CODING_CONCEPTS.find((c) => c.id === 'variables_types') || CODING_CONCEPTS[0];
  }, [activeLesson, course]);

  const activeVideoMeta = useMemo(() => {
    return videoLessons.find((v) => v.youtube_id === activeVideoId);
  }, [videoLessons, activeVideoId]);

  const handleCompleteAndNext = () => {
    if (!activeLesson) return;
    const updated = db.completeLesson(currentUserId, courseId, activeLesson.id);
    setEnrollment({ ...updated });

    // Realtime notification for lesson completion
    backendEngine.notifications.dispatch(
      currentUserId,
      `Module Completed: ${activeLesson.title}`,
      `Total progress: ${updated.progress_percent}%. You earned +50 XP and advanced your daily streak!`,
      'medium',
      'assignment',
      'course-detail',
      course.slug,
      'View Course'
    );

    if (updated.progress_percent >= 100) {
      const certs = db.getCertificates(currentUserId);
      const match = certs.find((c) => c.course_id === courseId);
      if (match) {
        setEarnedCertificate(match);
      }
      backendEngine.notifications.dispatch(
        currentUserId,
        `🎓 Certificate Unlocked: ${course.title}`,
        `Congratulations! You finished all 10 modules with 100% completion and unlocked your verified certificate.`,
        'urgent',
        'certificate',
        'certificates',
        undefined,
        'View Certificate'
      );
    }

    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLesson?.quiz) return;

    let correctCount = 0;
    for (const q of activeLesson.quiz.questions) {
      if (selectedAnswers[q.id] === q.correct_option_index) {
        correctCount++;
      }
    }

    const pct = Math.round((correctCount / activeLesson.quiz.questions.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);

    if (pct >= 50) {
      backendEngine.notifications.dispatch(
        currentUserId,
        `Quiz Passed (${pct}%)!`,
        `Knowledge check passed for ${activeLesson.title}. +50 XP awarded!`,
        'high',
        'grade',
        'course-detail',
        course.slug,
        'Next Module'
      );

      const updated = db.completeLesson(currentUserId, courseId, activeLesson.id);
      setEnrollment({ ...updated });
      if (updated.progress_percent >= 100) {
        const certs = db.getCertificates(currentUserId);
        const match = certs.find((c) => c.course_id === courseId);
        if (match) setEarnedCertificate(match);
      }
    }
  };

  const userProgress = db.getUserProgress(currentUserId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Sidebar: Course Outline & Progress */}
      <div className="card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToCourse}
          style={{ width: '100%', height: '38px', fontSize: '0.82rem', marginBottom: '14px' }}
        >
          <ArrowLeft size={14} /> Back to Course Syllabus
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
            {course.domain.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 Modules</span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px', lineHeight: 1.3 }}>
          {course.title}
        </h3>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          {course.subject}
        </div>

        {/* Gamification Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--brand-lime)', color: 'var(--brand-lime-text)', fontWeight: 800, fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px' }}>
            <Flame size={13} color="var(--brand-lime-text)" />
            <span>{userProgress.streak_days}-Day Streak</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface-subdued)', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <Zap size={13} color="var(--brand-primary)" />
            <span>{userProgress.xp} XP</span>
          </div>
        </div>

        {/* Course Progress */}
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-surface-subdued)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>
            <span>Course Progress</span>
            <span style={{ color: 'var(--brand-primary)' }}>{enrollment.progress_percent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-canvas)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${enrollment.progress_percent}%`,
                height: '100%',
                backgroundColor: 'var(--brand-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {enrollment.completed_lessons.length} of {allLessons.length} modules completed
          </div>
        </div>

        {/* Claim Certificate Button if Completed */}
        {enrollment.progress_percent >= 100 && (
          <button
            type="button"
            className="btn-accent"
            onClick={() => {
              const certs = db.getCertificates(currentUserId);
              const match = certs.find((c) => c.course_id === courseId);
              if (match) setEarnedCertificate(match);
            }}
            style={{ width: '100%', height: '40px', fontSize: '0.82rem', marginBottom: '16px', fontWeight: 700 }}
          >
            <Award size={16} /> View Verified Certificate
          </button>
        )}

        {/* Modules & Lessons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                Module {mIdx + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mod.lessons.map((l, lIdx) => {
                  const isActive = l.id === activeLesson?.id;
                  const isDone = enrollment.completed_lessons.includes(l.id);

                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setCurrentLessonId(l.id);
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(null);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? 'var(--brand-surface)' : 'transparent',
                        color: isActive ? 'var(--brand-primary)' : 'var(--text-primary)',
                        border: isActive ? '1px solid var(--brand-border)' : '1px solid transparent',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '16px' }}>
                          {lIdx + 1}.
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {l.title}
                        </span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 size={14} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                      ) : (
                        <Clock size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Lesson Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeLesson && (
          <>
            {/* Header with Title & Modality Switcher */}
            <div className="card-elevated" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeModuleTitle}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    <Clock size={12} /> {activeLesson.duration_minutes} min duration
                  </span>
                  {isCompleted && (
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  )}
                </div>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {activeLesson.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {activeLesson.summary}
              </p>

              {/* 3-MODALITY INTEGRATED LEARNING TABS */}
              <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: 'var(--bg-canvas)', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'video' ? 'var(--brand-primary)' : 'transparent',
                    color: activeTab === 'video' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <VideoIcon size={15} />
                  <span>1. Video Lectures & Notes (10 Sub-Videos)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('lab')}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'lab' ? 'var(--brand-primary)' : 'transparent',
                    color: activeTab === 'lab' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FlaskConical size={15} />
                  <span>2. Integrated Course Lab</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sandbox')}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'sandbox' ? 'var(--brand-primary)' : 'transparent',
                    color: activeTab === 'sandbox' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <TerminalIcon size={15} />
                  <span>3. Hands-On Code Sandbox (+100 XP)</span>
                </button>

                {onLaunchLab && (
                  <button
                    type="button"
                    onClick={() => onLaunchLab(course.slug)}
                    style={{
                      height: '38px',
                      padding: '0 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-surface)',
                      color: 'var(--brand-primary)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid var(--brand-border)',
                      cursor: 'pointer',
                    }}
                    title="Open lab in full screen workspace"
                  >
                    <FlaskConical size={14} />
                    <span>Open Full-Screen Lab</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: VIDEO LESSON & NOTES */}
            {activeTab === 'video' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 16:9 YouTube Video Embed with Curated Educational Masterclasses */}
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={18} color="var(--brand-primary)" />
                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                        {activeVideoMeta?.title || activeLesson.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeVideoMeta?.instructor_name && (
                        <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                          {activeVideoMeta.instructor_name}
                        </span>
                      )}
                      <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                        HD 1080p
                      </span>
                    </div>
                  </div>

                  <div className="video-responsive-wrapper">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0`}
                      title={activeVideoMeta?.title || activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* All 10 Course Sub-Videos Selector */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <VideoIcon size={16} color="var(--brand-primary)" />
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            Course Sub-Videos & Lectures ({allLessons.length} Sub-Videos Inside)
                          </span>
                        </div>
                        <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          All 10 sub-videos are integrated inside this course. Click any video below to switch lecture stream, notes, and quiz immediately.
                        </p>
                      </div>

                      {overrideVideoId && (
                        <button
                          type="button"
                          onClick={() => setOverrideVideoId(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: 'var(--brand-primary)',
                            backgroundColor: 'var(--brand-surface)',
                            border: '1px solid var(--brand-border)',
                            borderRadius: '100px',
                            padding: '4px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw size={12} />
                          Reset to Current Lesson Video
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                        gap: '12px',
                        padding: '4px 2px',
                      }}
                    >
                      {allLessons.map((les, lesIdx) => {
                        const isCurrent = les.id === activeLesson?.id;
                        const isDone = enrollment.completed_lessons.includes(les.id);
                        return (
                          <button
                            key={les.id}
                            type="button"
                            onClick={() => {
                              setCurrentLessonId(les.id);
                              setOverrideVideoId(null);
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                              setQuizScore(null);
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                              justifyContent: 'space-between',
                              textAlign: 'left',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              backgroundColor: isCurrent ? 'var(--brand-surface)' : 'var(--bg-canvas)',
                              border: isCurrent ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              gap: '8px',
                              minHeight: '105px',
                              width: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              boxShadow: isCurrent ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span
                                style={{
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  backgroundColor: isCurrent ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                                  color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {isCurrent ? '▶ NOW PLAYING' : `VIDEO ${lesIdx + 1}`}
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                {les.duration_minutes}m
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: isCurrent ? 'var(--brand-primary)' : 'var(--text-primary)',
                                lineHeight: 1.35,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                              }}
                              title={les.title}
                            >
                              {les.title}
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: 'auto',
                              }}
                            >
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                Module {lesIdx + 1}
                              </span>
                              {isDone ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                                  <CheckCircle2 size={12} /> Done
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  Incomplete
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Elected Programming Language Banner & Live Tailored Concept */}
                <div
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <TerminalIcon size={20} color="var(--brand-primary)" />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          Elected Language:{' '}
                          <span style={{ textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                            {electedLanguage}
                          </span>
                        </h4>
                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Showing computational logic and syntax tailored to your chosen language.
                        </p>
                      </div>
                    </div>

                    {/* Quick Language Switcher Pills */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(
                        [
                          { id: 'python', label: 'Python', icon: '🐍' },
                          { id: 'javascript', label: 'JavaScript', icon: '⚡' },
                          { id: 'typescript', label: 'TypeScript', icon: '🔷' },
                          { id: 'cpp', label: 'C++', icon: '⚙️' },
                          { id: 'java', label: 'Java', icon: '☕' },
                          { id: 'c', label: 'C', icon: '🔧' },
                          { id: 'sql', label: 'SQL', icon: '🗄️' },
                        ] as const
                      ).map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setElectedLanguage(lang.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: electedLanguage === lang.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                            backgroundColor: electedLanguage === lang.id ? 'var(--bg-surface-subdued)' : 'var(--bg-canvas)',
                            color: electedLanguage === lang.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{lang.icon}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tailored Code Snippet and Mental Model for Elected Language */}
                  {matchedConcept && matchedConcept.languages[electedLanguage] && (
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface-subdued)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                          💻 {matchedConcept.title} Implementation in{' '}
                          <span style={{ textTransform: 'capitalize' }}>{electedLanguage}</span>
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setActiveTab('sandbox')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '100px',
                              backgroundColor: 'var(--brand-primary)',
                              border: 'none',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Play size={12} /> Run in Sandbox
                          </button>
                        </div>
                      </div>

                      <pre
                        style={{
                          margin: 0,
                          padding: '12px 14px',
                          backgroundColor: 'var(--editor-bg, #111827)',
                          borderRadius: '8px',
                          color: '#E5E7EB',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          overflowX: 'auto',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <code>{matchedConcept.languages[electedLanguage].code}</code>
                      </pre>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>Computational Model:</strong> {matchedConcept.computationalModel}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>Explanation:</strong> {matchedConcept.languages[electedLanguage].explanation}
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        {matchedConcept.languages[electedLanguage].syntaxStyle && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--brand-primary)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-subtle)',
                              fontWeight: 700,
                            }}
                          >
                            Syntax: {matchedConcept.languages[electedLanguage].syntaxStyle}
                          </span>
                        )}
                        {matchedConcept.languages[electedLanguage].proTip && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-muted)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            💡 Pro Tip: {matchedConcept.languages[electedLanguage].proTip}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Markdown Notes */}
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <BookOpen size={18} color="var(--brand-primary)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Lesson Reading Notes</h3>
                  </div>

                  <div
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {renderMarkdownNotes(activeLesson.content_markdown)}
                  </div>
                </div>

                {/* Knowledge Check Quiz */}
                {activeLesson.quiz && (
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <HelpCircle size={20} color="var(--brand-primary)" />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Module Knowledge Check</h3>
                    </div>

                    <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {activeLesson.quiz.questions.map((q, qIdx) => (
                        <div key={q.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '10px' }}>
                            {qIdx + 1}. {q.prompt}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: selectedAnswers[q.id] === optIdx ? 'rgba(0, 245, 160, 0.12)' : 'var(--bg-canvas)',
                                  border: `1px solid ${selectedAnswers[q.id] === optIdx ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                }}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={optIdx}
                                  checked={selectedAnswers[q.id] === optIdx}
                                  onChange={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                                  disabled={quizSubmitted}
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>

                          {quizSubmitted && (
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: selectedAnswers[q.id] === q.correct_option_index ? 'var(--brand-primary)' : 'var(--danger-text)' }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={quizSubmitted}
                          style={{ height: '40px', padding: '0 20px' }}
                        >
                          Submit Answers
                        </button>

                        {quizSubmitted && quizScore !== null && (
                          <span className={`badge ${quizScore >= 50 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                            Quiz Result: {quizScore}% {quizScore >= 50 ? '✓ Passed (+50 XP)' : 'Needs Review'}
                          </span>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTEGRATED COURSE LAB — Real animated lab apps */}
            {activeTab === 'lab' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Real-time progress hint bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'linear-gradient(135deg, rgba(0,245,160,0.05) 0%, rgba(0,210,135,0.03) 100%)',
                    border: '1px solid rgba(0,245,160,0.15)',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#00F5A0', boxShadow: '0 0 8px #00F5A0',
                      animation: 'liveGlow 2s ease-in-out infinite',
                    }} />
                    <style>{`@keyframes liveGlow { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      🔬 {course.title} — Interactive Lab
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                      {enrollment.progress_percent}% Complete • {enrollment.completed_lessons.length} of {allLessons.length} modules done
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab('video')}
                    style={{ height: '34px', fontSize: '0.78rem' }}
                  >
                    <ArrowLeft size={13} /> Video Lectures
                  </button>
                </div>

                {/* Real progress bar */}
                <div style={{ height: '5px', borderRadius: '4px', background: 'var(--bg-canvas)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${enrollment.progress_percent}%`,
                    background: 'linear-gradient(90deg, #00F5A0 0%, #00D287 100%)',
                    boxShadow: '0 0 8px rgba(0,245,160,0.4)',
                    transition: 'width 0.5s ease',
                    borderRadius: '4px',
                  }} />
                </div>

                {/* Dedicated Sub-Module Interactive Laboratory & Gamified Pathway */}
                <CourseSubmoduleLabStudio
                  course={course}
                  currentLessonId={currentLessonId}
                  onSelectLesson={(lessonId) => {
                    setCurrentLessonId(lessonId);
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  db={db}
                  currentUserId={currentUserId}
                  enrollment={enrollment}
                  onCompleteSubmoduleLab={(_lessonId, _xp) => {
                    const updated = db.getCourseEnrollment(currentUserId, courseId) || db.enrollInCourse(currentUserId, courseId);
                    setEnrollment({ ...updated });
                  }}
                  onClose={() => setActiveTab('video')}
                />
              </div>
            )}

            {/* TAB 3: HANDS-ON CODE SANDBOX */}
            {activeTab === 'sandbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Language Switcher Toolbar for Lessons */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Elected Sandbox Language:
                    </span>
                    <span
                      style={{
                        backgroundColor: 'var(--bg-surface-subdued)',
                        color: 'var(--brand-primary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {electedLanguage}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {(
                      [
                        { id: 'python', label: 'Python', icon: '🐍' },
                        { id: 'javascript', label: 'JS', icon: '⚡' },
                        { id: 'typescript', label: 'TS', icon: '🔷' },
                        { id: 'cpp', label: 'C++', icon: '⚙️' },
                        { id: 'java', label: 'Java', icon: '☕' },
                        { id: 'c', label: 'C', icon: '🔧' },
                        { id: 'sql', label: 'SQL', icon: '🗄️' },
                      ] as const
                    ).map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setElectedLanguage(lang.id)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '100px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: electedLanguage === lang.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: electedLanguage === lang.id ? 'var(--bg-surface-subdued)' : 'var(--bg-surface)',
                          color: electedLanguage === lang.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <span>{lang.icon}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <LessonCodingSandbox
                  config={activeLesson.sandbox_config || {
                    title: 'Defensive SQL Sandbox',
                    type: 'sql_runner',
                    prompt: 'Formulate a read-only query using parameter binding.',
                    explanation: 'Prepared statements eliminate SQL injection vulnerabilities by separating user input from syntax.',
                    defaultInput: '-- Enter defensive SQL query or logic statement:\nSELECT id, name, category FROM courses WHERE is_published = ?;',
                    expectedOutput: 'Query executed cleanly.',
                    hints: ['Ensure queries are read-only SELECT statements.', 'Use ? for parameter binding.'],
                  }}
                  lessonTitle={activeLesson.title}
                  onComplete={() => {
                    db.awardXp(currentUserId, 100);
                    const updated = db.completeLesson(currentUserId, courseId, activeLesson.id);
                    setEnrollment({ ...updated });
                    backendEngine.notifications.dispatch(
                      currentUserId,
                      `Sandbox Challenge Solved (+100 XP)!`,
                      `Executed validated code for ${activeLesson.title}. XP awarded and streak maintained!`,
                      'high',
                      'grade'
                    );
                  }}
                />
              </div>
            )}

            {/* Next / Completion Action Bar */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '16px 20px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Current Status: <strong style={{ color: isCompleted ? 'var(--brand-primary)' : 'var(--text-primary)' }}>{isCompleted ? '✓ Completed' : 'In Progress'}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {enrollment.progress_percent >= 100 && (
                  <button
                    type="button"
                    className="btn-accent"
                    onClick={() => {
                      const certs = db.getCertificates(currentUserId);
                      const match = certs.find((c) => c.course_id === courseId);
                      if (match) setEarnedCertificate(match);
                    }}
                    style={{ height: '42px', padding: '0 16px' }}
                  >
                    <Award size={16} />
                    <span>View Certificate</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCompleteAndNext}
                  style={{ height: '42px', padding: '0 22px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{nextLesson ? 'Complete & Continue Next' : 'Finish Course'}</span>
                  {nextLesson && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={earnedCertificate}
        onClose={() => setEarnedCertificate(null)}
      />
    </div>
  );
};

