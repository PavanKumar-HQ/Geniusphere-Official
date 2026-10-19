import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { CourseEnrollment, Certificate } from '../types';
import { CertificateModal } from './CertificateModal';
import { SharedLabWorkspace } from './SharedLabWorkspace';
import { MultiLanguageCodeSandbox } from './MultiLanguageCodeSandbox';
import { SupportedLanguage } from '../utils/codeSandboxRunner';
import { backendEngine } from '../backend/RealtimeOrchestrator';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ListChecks,
  Play,
  Terminal,
  Award,
  Video,
  Code2,
} from 'lucide-react';

interface CourseDetailViewProps {
  db: InMemoryDatabase;
  courseSlug: string;
  currentUserId: string;
  onBack: () => void;
  onStartLesson: (courseId: string, lessonId: string, initialTab?: 'video' | 'lab' | 'animation' | 'sandbox') => void;
  onLaunchLab?: (labSlug: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  db,
  courseSlug,
  currentUserId,
  onBack,
  onStartLesson,
  onLaunchLab: _onLaunchLab,
}) => {
  const course = db.getCourseBySlug(courseSlug);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(
    course ? db.getCourseEnrollment(currentUserId, course.id) : null
  );
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'syllabus' | 'lab' | 'sandbox'>('syllabus');
  const matchingLab = course ? db.getLabDefinitions().find((l) => l.course_slug === courseSlug || l.category === course.domain) : null;

  const getInitialSandboxLanguage = (_domain: string, slug: string): SupportedLanguage => {
    if (slug.includes('sql') || slug.includes('database')) return 'sql';
    if (slug.includes('c-') || slug.includes('embedded') || slug.includes('kernel') || slug.includes('operating-systems') || slug.includes('systems-programming')) return 'c';
    if (slug.includes('web') || slug.includes('react') || slug.includes('javascript') || slug.includes('frontend')) return 'javascript';
    return 'python';
  };

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

    backendEngine.notifications.dispatch(
      currentUserId,
      `Enrolled in ${course.title}`,
      `10 modules and practical lab ready. Start with Module 1!`,
      'medium',
      'system',
      'course-detail',
      course.slug,
      'Start Course'
    );

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
        <div style={{ padding: '20px', backgroundColor: 'var(--brand-surface)', borderRadius: '12px', border: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {enrollment ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--brand-accent-surface)', border: '2px solid var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--brand-accent)', fontSize: '1.1rem' }}>
                {enrollment.progress_percent}%
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {enrollment.progress_percent >= 100 ? 'Course 100% Completed' : 'Course In Progress'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Completed {enrollment.completed_lessons.length} of {course.modules.flatMap(m => m.lessons).length} modules
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Ready to begin?</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                10 Comprehensive Modules • 10 Videos • 10 Interactive Labs • 10 Code Sandboxes • Certificate
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {enrollment && enrollment.progress_percent >= 100 && (
              <button
                type="button"
                className="btn-accent"
                onClick={() => {
                  const certs = db.getCertificates(currentUserId);
                  const match = certs.find((c) => c.course_id === course.id);
                  if (match) setActiveCertificate(match);
                }}
                style={{ height: '44px', padding: '0 20px', fontSize: '0.9rem' }}
              >
                <Award size={18} />
                <span>View Verified Certificate</span>
              </button>
            )}

            <button
              type="button"
              className={activeCourseTab === 'lab' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveCourseTab('lab')}
              style={{
                height: '44px',
                padding: '0 18px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              title="Open associated interactive concept lab"
            >
              <Terminal size={18} />
              <span>Interactive Lab</span>
            </button>

            <button
              type="button"
              className={activeCourseTab === 'sandbox' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveCourseTab('sandbox')}
              style={{
                height: '44px',
                padding: '0 18px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              title="Open coding sandbox for this course"
            >
              <Code2 size={18} />
              <span>Coding Sandbox</span>
            </button>

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
                style={{ height: '44px', padding: '0 22px', fontSize: '0.95rem' }}
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
      </div>

      {/* Reduced Friction Unified Hub Tabs: Syllabus, Concept Lab & Sandbox in One Place */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '2px solid var(--border-subtle)',
          paddingBottom: '2px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveCourseTab('syllabus')}
          style={{
            padding: '12px 20px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeCourseTab === 'syllabus' ? '3px solid var(--brand-primary)' : '3px solid transparent',
            backgroundColor: activeCourseTab === 'syllabus' ? 'var(--bg-surface)' : 'transparent',
            color: activeCourseTab === 'syllabus' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeCourseTab === 'syllabus' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={18} />
          <span>Syllabus & Modules</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            {course.modules.flatMap((m) => m.lessons).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCourseTab('lab')}
          style={{
            padding: '12px 20px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeCourseTab === 'lab' ? '3px solid var(--brand-primary)' : '3px solid transparent',
            backgroundColor: activeCourseTab === 'lab' ? 'var(--bg-surface)' : 'transparent',
            color: activeCourseTab === 'lab' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeCourseTab === 'lab' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <Terminal size={18} />
          <span>Interactive Concept Lab</span>
          {matchingLab && (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 7px',
                borderRadius: '100px',
                backgroundColor: 'var(--brand-lime)',
                color: 'var(--brand-lime-text)',
                fontWeight: 800,
              }}
            >
              Sim Available
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveCourseTab('sandbox')}
          style={{
            padding: '12px 20px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeCourseTab === 'sandbox' ? '3px solid var(--brand-primary)' : '3px solid transparent',
            backgroundColor: activeCourseTab === 'sandbox' ? 'var(--bg-surface)' : 'transparent',
            color: activeCourseTab === 'sandbox' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeCourseTab === 'sandbox' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <Code2 size={18} />
          <span>Course Code Sandbox</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            {getInitialSandboxLanguage(course.domain, course.slug).toUpperCase()}
          </span>
        </button>
      </div>

      {/* TAB 1: SYLLABUS & LESSON MODULES */}
      {activeCourseTab === 'syllabus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Complete 10-Module Syllabus</h3>
              <span className="badge badge-accent">10 Videos • 10 Interactive Labs • 10 Sandboxes</span>
            </div>

            {course.modules.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                Detailed lesson modules for this syllabus are currently in curriculum review.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {course.modules.map((mod, mIdx) => {
                  const cleanModuleTitle = mod.title.replace(/^Module\s+\d+:\s*/i, '');
                  return (
                    <div key={mod.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
                      <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '12px 18px', fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}>
                        <span>Module {mIdx + 1}: {cleanModuleTitle}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{mod.lessons.length} Lessons</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {mod.lessons.map((les, lIdx) => {
                          const isCompleted = enrollment?.completed_lessons.includes(les.id);

                          return (
                            <div
                              key={les.id}
                              style={{
                                padding: '14px 18px',
                                borderTop: lIdx > 0 ? '1px solid var(--border-subtle)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '240px' }}>
                                {isCompleted ? (
                                  <CheckCircle2 size={20} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                                ) : (
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-strong)', flexShrink: 0 }} />
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{les.title}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{les.summary}</div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                  <Clock size={11} style={{ marginRight: '3px' }} />
                                  {les.duration_minutes}m
                                </span>
                                <button
                                  type="button"
                                  className="badge badge-brand"
                                  onClick={() => onStartLesson(course.id, les.id, 'video')}
                                  style={{ fontSize: '0.72rem', cursor: 'pointer', border: 'none' }}
                                  title="Watch Video Lecture"
                                >
                                  <Video size={11} style={{ marginRight: '3px' }} /> Video
                                </button>
                                <button
                                  type="button"
                                  className="badge badge-accent"
                                  onClick={() => onStartLesson(course.id, les.id, 'animation')}
                                  style={{ fontSize: '0.72rem', cursor: 'pointer', border: 'none' }}
                                  title="Open Interactive Lab Simulation"
                                >
                                  <Terminal size={11} style={{ marginRight: '3px' }} /> Lab
                                </button>
                                <button
                                  type="button"
                                  className="badge badge-success"
                                  onClick={() => onStartLesson(course.id, les.id, 'sandbox')}
                                  style={{ fontSize: '0.72rem', cursor: 'pointer', border: 'none' }}
                                  title="Open Code Sandbox"
                                >
                                  <Terminal size={11} style={{ marginRight: '3px' }} /> Sandbox
                                </button>
                                <button
                                  type="button"
                                  className="btn-outline"
                                  onClick={() => onStartLesson(course.id, les.id)}
                                  style={{ height: '34px', padding: '0 12px', fontSize: '0.82rem' }}
                                >
                                  Launch
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CONCEPT LAB EMBEDDED IN COURSE */}
      {activeCourseTab === 'lab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} color="var(--brand-primary)" />
                <span>{matchingLab ? matchingLab.title : 'Course Interactive Laboratory'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Integrated concept laboratory directly mapped to {course.title}. Conduct live simulations without leaving this course workspace.
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActiveCourseTab('syllabus')}
              style={{ height: '36px', padding: '0 14px', fontSize: '0.84rem' }}
            >
              <BookOpen size={15} /> Return to Syllabus
            </button>
          </div>

          <SharedLabWorkspace
            db={db}
            labSlug={matchingLab ? matchingLab.slug : 'ai-classification-playground'}
            currentUserId={currentUserId}
            onNavigateBack={() => setActiveCourseTab('syllabus')}
            onSelectCourse={undefined}
          />
        </div>
      )}

      {/* TAB 3: COURSE CODE SANDBOX EMBEDDED IN COURSE */}
      {activeCourseTab === 'sandbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={18} color="var(--brand-primary)" />
                <span>Hands-on Code Sandbox ({getInitialSandboxLanguage(course.domain, course.slug).toUpperCase()})</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Directly practice coding principles and algorithmic implementations for {course.title} with genuine in-browser execution.
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActiveCourseTab('syllabus')}
              style={{ height: '36px', padding: '0 14px', fontSize: '0.84rem' }}
            >
              <BookOpen size={15} /> Return to Syllabus
            </button>
          </div>

          <MultiLanguageCodeSandbox
            initialLanguage={getInitialSandboxLanguage(course.domain, course.slug)}
          />
        </div>
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
};
