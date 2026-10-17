import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Lesson, CourseEnrollment, Certificate } from '../types';
import { ConceptSvgAnimation } from './ConceptSvgAnimation';
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
  Cpu,
  Terminal as TerminalIcon,
  BookOpen,
} from 'lucide-react';

interface LessonPlayerProps {
  db: InMemoryDatabase;
  courseId: string;
  initialLessonId: string;
  currentUserId: string;
  onBackToCourse: () => void;
  onLaunchLab?: (courseSlug: string) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  db,
  courseId,
  initialLessonId,
  currentUserId,
  onBackToCourse,
  onLaunchLab,
}) => {
  const course = db.getCourseById(courseId);
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId);
  const [activeTab, setActiveTab] = useState<'video' | 'animation' | 'sandbox'>('video');
  const [enrollment, setEnrollment] = useState<CourseEnrollment>(
    db.getCourseEnrollment(currentUserId, courseId) || db.enrollInCourse(currentUserId, courseId)
  );
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);

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

  const handleCompleteAndNext = () => {
    if (!activeLesson) return;
    const updated = db.completeLesson(currentUserId, courseId, activeLesson.id);
    setEnrollment({ ...updated });

    if (updated.progress_percent >= 100) {
      const certs = db.getCertificates(currentUserId);
      const match = certs.find((c) => c.course_id === courseId);
      if (match) {
        setEarnedCertificate(match);
      }
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
          <div className="streak-pill" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
            <Flame size={13} color="#F97316" />
            <span>{userProgress.streak_days}-Day Streak</span>
          </div>
          <div className="xp-pill" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
            <Zap size={13} color="#00F5A0" />
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

              {/* 3-MODALITY LEARNING TABS */}
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
                  <span>1. Video & Theory</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('animation')}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'animation' ? 'var(--brand-primary)' : 'transparent',
                    color: activeTab === 'animation' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Cpu size={15} />
                  <span>2. Interactive SVG Visualizer</span>
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
                  <span>3. Sandbox Simulation (+100 XP)</span>
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
                    title="Launch associated interactive concept lab"
                  >
                    <TerminalIcon size={14} />
                    <span>Launch Full Lab</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: VIDEO LESSON & NOTES */}
            {activeTab === 'video' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 16:9 YouTube Video Embed */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={18} color="var(--brand-primary)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Curated Educational Video</span>
                    </div>
                    <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                      High Definition 1080p
                    </span>
                  </div>
                  <div className="video-responsive-wrapper">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeLesson.video_id || 'dQw4w9WgXcQ'}?rel=0`}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
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
                      gap: '14px',
                    }}
                  >
                    {activeLesson.content_markdown.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={pIdx} style={{ fontSize: '1.25rem', marginTop: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{paragraph.replace('### ', '')}</h3>;
                      }
                      if (paragraph.startsWith('#### ')) {
                        return <h4 key={pIdx} style={{ fontSize: '1.05rem', marginTop: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>{paragraph.replace('#### ', '')}</h4>;
                      }
                      if (paragraph.startsWith('```')) {
                        const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '');
                        return (
                          <pre key={pIdx} style={{ backgroundColor: 'var(--editor-bg)', color: 'var(--text-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                            <code>{cleanCode}</code>
                          </pre>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
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

            {/* TAB 2: INTERACTIVE SVG VISUALIZER */}
            {activeTab === 'animation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ConceptSvgAnimation
                  type={activeLesson.svg_animation_type || 'logic_gates'}
                  title={activeLesson.title}
                />
              </div>
            )}

            {/* TAB 3: INTERACTIVE SANDBOX SIMULATION */}
            {activeTab === 'sandbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

