import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Lesson, CourseEnrollment } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Terminal,
  Clock,
} from 'lucide-react';

interface LessonPlayerProps {
  db: InMemoryDatabase;
  courseId: string;
  initialLessonId: string;
  currentUserId: string;
  onBackToCourse: () => void;
  onLaunchLab: (labId: string) => void;
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
  const [enrollment, setEnrollment] = useState<CourseEnrollment>(
    db.getCourseEnrollment(currentUserId, courseId) || db.enrollInCourse(currentUserId, courseId)
  );

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
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
      {/* Sidebar: Course Outline & Progress */}
      <div className="card" style={{ padding: '16px', position: 'sticky', top: '70px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToCourse}
          style={{ width: '100%', height: '36px', fontSize: '0.8rem', marginBottom: '14px' }}
        >
          <ArrowLeft size={14} /> Back to Course Syllabus
        </button>

        <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{course.title}</h3>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {course.subject}
        </div>

        {/* Course Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 600 }}>
            <span>Progress</span>
            <span>{enrollment.progress_percent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subdued)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${enrollment.progress_percent}%`,
                height: '100%',
                backgroundColor: 'var(--brand-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {course.modules.map((mod) => (
            <div key={mod.id}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {mod.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mod.lessons.map((l) => {
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
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '36px',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.title}
                      </span>
                      {isDone && <CheckCircle2 size={14} color="var(--success)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Lesson Content Area */}
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeLesson && (
          <>
            <div className="card-elevated">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  {activeModuleTitle}
                </span>
                <span className="badge badge-neutral">
                  <Clock size={12} /> {activeLesson.duration_minutes} min read
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
                {activeLesson.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', fontStyle: 'italic', borderLeft: '3px solid var(--border-strong)', paddingLeft: '12px' }}>
                {activeLesson.summary}
              </p>

              {/* Lesson Text Body */}
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
                    return <h3 key={pIdx} style={{ fontSize: '1.3rem', marginTop: '12px' }}>{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('#### ')) {
                    return <h4 key={pIdx} style={{ fontSize: '1.1rem', marginTop: '8px' }}>{paragraph.replace('#### ', '')}</h4>;
                  }
                  if (paragraph.startsWith('```')) {
                    const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '');
                    return (
                      <pre key={pIdx} style={{ backgroundColor: '#18181B', color: '#F4F4F5', padding: '14px', borderRadius: '8px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        <code>{cleanCode}</code>
                      </pre>
                    );
                  }
                  return <p key={pIdx}>{paragraph}</p>;
                })}
              </div>
            </div>

            {/* Linked Lab Callout Card */}
            {activeLesson.linked_lab_id && (
              <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)', backgroundColor: 'var(--brand-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={22} color="var(--brand-primary)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>Hands-On Interactive Laboratory Linked</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Launch the isolated SQLite-WASM laboratory to apply parameter binding directly against attack payloads.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onLaunchLab(activeLesson.linked_lab_id!)}
                    style={{ height: '40px', padding: '0 16px' }}
                  >
                    <Terminal size={16} />
                    <span>Launch SQL Sandbox</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Lesson Quiz */}
            {activeLesson.quiz && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <HelpCircle size={20} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: '1.2rem' }}>Knowledge Check Quiz</h3>
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
                              backgroundColor: selectedAnswers[q.id] === optIdx ? 'var(--brand-surface)' : 'var(--bg-surface-subdued)',
                              border: `1px solid ${selectedAnswers[q.id] === optIdx ? 'var(--brand-border)' : 'var(--border-subtle)'}`,
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
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: selectedAnswers[q.id] === q.correct_option_index ? 'var(--success-text)' : 'var(--danger-text)' }}>
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
                      style={{ height: '38px', padding: '0 16px' }}
                    >
                      Submit Answers
                    </button>

                    {quizSubmitted && quizScore !== null && (
                      <span className={`badge ${quizScore >= 50 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                        Quiz Result: {quizScore}%
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Next / Completion Bar */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Status: <strong>{isCompleted ? 'Completed' : 'In Progress'}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCompleteAndNext}
                  style={{ height: '42px', padding: '0 20px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{nextLesson ? 'Complete & Continue Next' : 'Complete Course'}</span>
                  {nextLesson && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
