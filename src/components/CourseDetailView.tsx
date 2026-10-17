import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { CourseEnrollment, Certificate } from '../types';
import { CertificateModal } from './CertificateModal';
import { SimulationLabModal } from './SimulationLabModal';
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
  Cpu,
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
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [simLabOpen, setSimLabOpen] = useState(false);

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
                10 Comprehensive Modules • 10 Videos • 10 SVG Visualizers • 10 Sandbox Labs • Certificate
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
              className="btn-secondary"
              onClick={() => setSimLabOpen(true)}
              style={{
                height: '44px',
                padding: '0 18px',
                fontSize: '0.9rem',
                border: '1px solid #00F0FF',
                color: '#00F0FF',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Cpu size={18} />
              <span>Launch Simulation Lab (10 SVG Sims)</span>
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
          <span className="badge badge-accent">10 Videos • 10 SVG Animations • 10 Sandboxes</span>
        </div>

        {course.modules.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            Detailed lesson modules for this syllabus are currently in curriculum review.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.modules.map((mod, mIdx) => (
              <div key={mod.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '12px 18px', fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}>
                  <span>Module {mIdx + 1}: {mod.title}</span>
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
                          <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                            <Video size={11} style={{ marginRight: '3px' }} /> Video
                          </span>
                          <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                            <Cpu size={11} style={{ marginRight: '3px' }} /> SVG
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                            <Terminal size={11} style={{ marginRight: '3px' }} /> Sandbox
                          </span>
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
            ))}
          </div>
        )}
      </div>

      {/* Verified Certificate Modal */}
      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />

      {/* Interactive Simulation Lab Modal (Cyber Lab Reference Image 2) */}
      <SimulationLabModal
        isOpen={simLabOpen}
        onClose={() => setSimLabOpen(false)}
        courseTitle={course.title}
        courseSlug={course.slug}
        domain={course.domain}
      />
    </div>
  );
};
