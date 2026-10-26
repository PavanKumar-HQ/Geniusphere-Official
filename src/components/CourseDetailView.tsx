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
  ChevronDown,
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
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(course?.modules?.[0]?.id || null);
  const matchingLab = course
    ? db.getLabDefinitions().find(
        (l) =>
          l.course_slug === courseSlug ||
          (course.linked_lab_slug && (l.slug === course.linked_lab_slug || l.id === course.linked_lab_slug)) ||
          l.slug === courseSlug
      ) || null
    : null;

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

  const getDomainColor = (d: string) => {
    switch (d) {
      case 'technology':
        return '#0D9488';
      case 'finance':
        return '#059669';
      case 'professional':
        return '#2563EB';
      default:
        return 'var(--brand-primary)';
    }
  };

  const domainAccent = getDomainColor(course.domain);

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
      <div className="card-elevated" style={{ borderLeft: `6px solid ${domainAccent}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span
              style={{
                backgroundColor: `${domainAccent}1A`,
                color: domainAccent,
                border: `1.5px solid ${domainAccent}40`,
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {course.domain.toUpperCase()}
            </span>
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

        {/* Course Progress & Primary CTA Banner */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--brand-surface)',
            borderRadius: '16px',
            border: '1.5px solid var(--brand-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {enrollment ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-accent-surface)',
                  border: '2px solid var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: 'var(--brand-accent)',
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                {enrollment.progress_percent}%
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {enrollment.progress_percent >= 100 ? 'Course Completed! 🎉' : 'Course In Progress'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {enrollment.completed_lessons.length} of {course.modules.flatMap((m) => m.lessons).length} modules completed
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Ready to begin?</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {course.modules.length} Modules • Video Lectures • Interactive Labs • Code Sandbox
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {enrollment && enrollment.progress_percent >= 100 && (
              <button
                type="button"
                className="btn-accent"
                onClick={() => {
                  const certs = db.getCertificates(currentUserId);
                  const match = certs.find((c) => c.course_id === course.id);
                  if (match) setActiveCertificate(match);
                }}
                style={{ height: '40px', padding: '0 16px', fontSize: '0.84rem' }}
              >
                <Award size={16} />
                <span>Certificate</span>
              </button>
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
                style={{
                  height: '42px',
                  padding: '0 20px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  borderRadius: '100px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                }}
              >
                <Play size={16} fill="currentColor" />
                <span>{enrollment ? 'Continue Learning' : 'Start Course'}</span>
              </button>
            ) : (
              <div className="badge badge-warning" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Pilot Course
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App-Native Segmented Control: Syllabus, Concept Lab & Sandbox */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface-subdued)',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveCourseTab('syllabus')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeCourseTab === 'syllabus' ? 'var(--bg-surface)' : 'transparent',
            color: activeCourseTab === 'syllabus' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeCourseTab === 'syllabus' ? 800 : 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            boxShadow: activeCourseTab === 'syllabus' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={16} />
          <span>Syllabus ({course.modules.flatMap((m) => m.lessons).length})</span>
        </button>

        {matchingLab && (
          <button
            type="button"
            onClick={() => setActiveCourseTab('lab')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeCourseTab === 'lab' ? 'var(--bg-surface)' : 'transparent',
              color: activeCourseTab === 'lab' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeCourseTab === 'lab' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeCourseTab === 'lab' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Terminal size={16} />
            <span>Interactive Lab</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveCourseTab('sandbox')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeCourseTab === 'sandbox' ? 'var(--bg-surface)' : 'transparent',
            color: activeCourseTab === 'sandbox' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeCourseTab === 'sandbox' ? 800 : 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            boxShadow: activeCourseTab === 'sandbox' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Code2 size={16} />
          <span>Code Sandbox</span>
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

          {/* Master Course Blueprint Pack: Paired Lab, Capstone & Assessment Architecture */}
          {(course.paired_lab_concept || course.capstone_prompt || course.assessment_plan) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {course.paired_lab_concept && (
                <div className="card" style={{ borderLeft: '4px solid var(--brand-accent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Terminal size={18} color="var(--brand-accent)" />
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800 }}>Paired Practical Lab</h4>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {course.paired_lab_concept}
                  </p>
                </div>
              )}

              {course.capstone_prompt && (
                <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Award size={18} color="var(--brand-primary)" />
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800 }}>Capstone / Final Artifact</h4>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {course.capstone_prompt}
                  </p>
                </div>
              )}

              {course.assessment_plan && (
                <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <ListChecks size={18} color="#8B5CF6" />
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800 }}>Assessment Plan</h4>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {course.assessment_plan}
                  </p>
                </div>
              )}
            </div>
          )}

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
                  const cleanModuleTitle = mod.title.replace(/^Module\s+\d+:\s*/i, '').replace(/^Video\s+\d+:\s*/i, '');
                  const isExpanded = expandedModuleId === mod.id;
                  const completedInMod = mod.lessons.filter((l) => enrollment?.completed_lessons.includes(l.id)).length;
                  const isModCompleted = completedInMod === mod.lessons.length && mod.lessons.length > 0;

                  return (
                    <div
                      key={mod.id}
                      style={{
                        border: isExpanded ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-surface)',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        style={{
                          width: '100%',
                          backgroundColor: isExpanded ? 'var(--brand-surface)' : 'var(--bg-surface-subdued)',
                          padding: '12px 16px',
                          border: 'none',
                          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: isModCompleted ? 'var(--brand-primary)' : isExpanded ? 'var(--brand-primary)' : 'var(--bg-surface)',
                              color: isModCompleted || isExpanded ? '#FFFFFF' : 'var(--text-muted)',
                              border: isModCompleted || isExpanded ? 'none' : '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {isModCompleted ? '✓' : mIdx + 1}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Module {mIdx + 1}: {cleanModuleTitle}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: isModCompleted ? 'var(--brand-primary)' : 'var(--text-muted)',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              padding: '2px 8px',
                              borderRadius: '100px',
                            }}
                          >
                            {completedInMod > 0 ? `${completedInMod}/${mod.lessons.length} done` : `${mod.lessons.length} lessons`}
                          </span>
                          <ChevronDown
                            size={16}
                            style={{
                              color: 'var(--text-muted)',
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {mod.lessons.map((les, lIdx) => {
                          const isCompleted = enrollment?.completed_lessons.includes(les.id);
                          const cleanLessonTitle = les.title.replace(/^Video\s+\d+:\s*/i, '');

                          return (
                            <div
                              key={les.id}
                              style={{
                                padding: '12px 14px',
                                borderTop: lIdx > 0 ? '1px solid var(--border-subtle)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '10px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: '1', minWidth: '220px' }}>
                                {isCompleted ? (
                                  <CheckCircle2 size={18} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                ) : (
                                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border-strong)', flexShrink: 0, marginTop: '2px' }} />
                                )}
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                    {cleanLessonTitle}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {les.summary}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                                <span className="badge badge-neutral" style={{ fontSize: '0.7rem', padding: '3px 7px' }}>
                                  <Clock size={11} style={{ marginRight: '3px' }} />
                                  {les.duration_minutes}m
                                </span>
                                <button
                                  type="button"
                                  className="badge badge-brand"
                                  onClick={() => onStartLesson(course.id, les.id, 'video')}
                                  style={{ fontSize: '0.72rem', padding: '4px 8px', cursor: 'pointer', border: 'none' }}
                                  title="Watch Video Lecture"
                                >
                                  <Video size={11} style={{ marginRight: '3px' }} /> Video
                                </button>
                                <button
                                  type="button"
                                  className="badge badge-accent"
                                  onClick={() => onStartLesson(course.id, les.id, 'lab')}
                                  style={{ fontSize: '0.72rem', padding: '4px 8px', cursor: 'pointer', border: 'none' }}
                                  title="Open Interactive Lab Simulation"
                                >
                                  <Terminal size={11} style={{ marginRight: '3px' }} /> Lab
                                </button>
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => onStartLesson(course.id, les.id)}
                                  style={{ height: '30px', padding: '0 12px', fontSize: '0.76rem', borderRadius: '8px' }}
                                >
                                  {isCompleted ? 'Review' : 'Start'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CONCEPT LAB EMBEDDED IN COURSE */}
      {activeCourseTab === 'lab' && matchingLab && (
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
                <span>{matchingLab.title}</span>
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

          <div style={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: '780px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <SharedLabWorkspace
              db={db}
              labSlug={matchingLab.slug}
              currentUserId={currentUserId}
              onNavigateBack={() => setActiveCourseTab('syllabus')}
              onSelectCourse={undefined}
            />
          </div>
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
