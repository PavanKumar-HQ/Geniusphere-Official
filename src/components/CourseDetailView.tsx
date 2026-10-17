import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { CourseEnrollment } from '../types';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ListChecks,
  Play,
  Terminal,
  HelpCircle,
} from 'lucide-react';

interface CourseDetailViewProps {
  db: InMemoryDatabase;
  courseSlug: string;
  currentUserId: string;
  onBack: () => void;
  onStartLesson: (courseId: string, lessonId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  db,
  courseSlug,
  currentUserId,
  onBack,
  onStartLesson,
}) => {
  const course = db.getCourseBySlug(courseSlug);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(
    course ? db.getCourseEnrollment(currentUserId, course.id) : null
  );

  if (!course) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <h2>Course Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          The requested course slug does not exist in the curriculum database.
        </p>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Return to Catalogue
        </button>
      </div>
    );
  }

  const handleEnroll = () => {
    const newEnr = db.enrollInCourse(currentUserId, course.id);
    setEnrollment(newEnr);

    // If course has lessons, start the first one
    if (course.modules[0]?.lessons[0]) {
      onStartLesson(course.id, course.modules[0].lessons[0].id);
    }
  };

  const firstLessonId = course.modules[0]?.lessons[0]?.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Bar */}
      <div>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
          style={{ height: '36px', padding: '0 12px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Course Catalogue
        </button>
      </div>

      {/* Main Course Header Card */}
      <div className="card-elevated" style={{ borderLeft: '5px solid var(--brand-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-brand">{course.domain.toUpperCase()}</span>
            <span className="badge badge-neutral">{course.level.toUpperCase()}</span>
            {course.availability_status === 'verified_functional' ? (
              <span className="badge badge-success">VERIFIED & USABLE</span>
            ) : course.availability_status === 'implemented_in_build' ? (
              <span className="badge badge-brand">IMPLEMENTED IN BUILD</span>
            ) : (
              <span className="badge badge-neutral">IN DEVELOPMENT</span>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Course ID: <code>{course.id}</code>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, marginBottom: '8px' }}>
          {course.title}
        </h1>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Curriculum Subject Area: <strong>{course.subject}</strong>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '24px' }}>
          {course.description}
        </p>

        {/* Enrollment / Progress Action Banner */}
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subdued)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {enrollment ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {enrollment.progress_percent}%
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {enrollment.progress_percent === 100 ? 'Course Completed!' : 'Enrolled & In Progress'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Completed {enrollment.completed_lessons.length} lessons
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ready to begin?</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Duration: ~{course.duration_hours} hours • Hands-on challenges included
              </div>
            </div>
          )}

          {course.is_published ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!enrollment) {
                  handleEnroll();
                } else if (firstLessonId) {
                  onStartLesson(course.id, firstLessonId);
                }
              }}
              style={{ height: '44px', padding: '0 20px', fontSize: '0.95rem' }}
            >
              <Play size={18} />
              <span>{enrollment ? 'Continue Course Player' : 'Enroll & Start Learning'}</span>
            </button>
          ) : (
            <div className="badge badge-warning" style={{ padding: '8px 12px' }}>
              Course Syllabus Planned for Pilot Expansion
            </div>
          )}
        </div>
      </div>

      {/* Grid: Objectives & Prerequisites */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ListChecks size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Learning Objectives</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {course.learning_objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Prerequisites & Scope</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {course.prerequisites.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Module & Lesson Syllabus */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Course Syllabus & Lesson Breakdown</h3>
        {course.modules.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            Detailed lesson modules for this syllabus are currently in curriculum review.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.modules.map((mod) => (
              <div key={mod.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '12px 16px', fontWeight: 700, fontSize: '0.95rem' }}>
                  {mod.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mod.lessons.map((les) => {
                    const isCompleted = enrollment?.completed_lessons.includes(les.id);

                    return (
                      <div
                        key={les.id}
                        style={{
                          padding: '12px 16px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {isCompleted ? (
                            <CheckCircle2 size={18} color="var(--success)" />
                          ) : (
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border-strong)' }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{les.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{les.summary}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                            {les.duration_minutes}m
                          </span>
                          {les.linked_lab_id && (
                            <span className="badge badge-brand">
                              <Terminal size={12} /> Interactive Lab
                            </span>
                          )}
                          {les.quiz && (
                            <span className="badge badge-neutral">
                              <HelpCircle size={12} /> Quiz
                            </span>
                          )}
                          <button
                            type="button"
                            className="btn-outline"
                            onClick={() => onStartLesson(course.id, les.id)}
                            style={{ height: '32px', padding: '0 10px', fontSize: '0.8rem' }}
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
