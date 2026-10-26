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
  Star,
  Check,
  Sparkles,
  Shield,
  Users,
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

  // Skill tags mapped from course subject, objectives, and domain
  const skillsGained = [
    course.subject,
    ...course.learning_objectives.slice(0, 4).map((obj) => obj.split(':')[0].split('—')[0].trim()),
  ].filter(Boolean);

  const totalVideos = course.modules.flatMap((m) => m.lessons).length;
  const totalDuration = course.duration_hours || 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* ================================================================ */}
      {/* 1. GREAT LEARNING 2-COLUMN HERO & FLOATING CERTIFICATE PURCHASE CARD */}
      {/* ================================================================ */}
      <div className="gl-course-detail-layout">
        
        {/* LEFT COLUMN: Authority Header, Metadata, Skills & Outcomes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Breadcrumb / Category Tag */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'capitalize', marginBottom: '8px' }}>
              <span>Curated {course.domain} Masterclass</span>
              <span>•</span>
              <span>Geniusphere Verified Curriculum</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 12px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {course.title}
            </h1>

            {/* Social Proof & Course Telemetry Bar (Great Learning Pattern) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#D97706' }}>
                <Star size={16} fill="#D97706" color="#D97706" />
                <span>4.85</span>
              </div>
              <span>•</span>
              <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{course.level} Level</span>
              <span>•</span>
              <span style={{ fontWeight: 600 }}>{totalDuration}.0 Learning Hours</span>
              <span>•</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                <Users size={14} />
                <span>12.4K+ Learners</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
            {course.description}
          </p>

          {/* Instructor & CIE Institutional Accreditation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Instructor: <strong style={{ color: 'var(--text-primary)' }}>Geniusphere Lead Faculty & CIE Committee</strong></span>
          </div>

          {/* Skills You Will Gain (Great Learning Pill Strip) */}
          <div style={{ marginTop: '4px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px', color: 'var(--text-primary)' }}>
              Skills you will gain
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skillsGained.map((sk, idx) => (
                <span key={idx} className="gl-skill-chip">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* What You'll Learn (Great Learning Checkmark Card) */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              What you&rsquo;ll learn
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {course.learning_objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Check size={13} color="var(--brand-primary)" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Great Learning Style Certificate & Action Card */}
        <div className="gl-sidebar-sticky">
          <div className="gl-sidebar-card">
            
            {/* Visual Certificate Mockup Thumbnail */}
            <div
              style={{
                borderRadius: '14px',
                border: '1.5px solid var(--border-subtle)',
                overflow: 'hidden',
                backgroundColor: '#FAFAF9',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '170px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              }}
            >
              {/* Certificate watermark badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                    <Shield size={12} />
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    GENIUSPHERE
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: 'var(--brand-surface)', padding: '2px 6px', borderRadius: '4px' }}>
                  VERIFIED
                </span>
              </div>

              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Certificate of Completion
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--text-primary)', margin: '2px 0' }}>
                  {course.title}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                  Accredited by CIE Platform Ledger
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed var(--border-subtle)', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.60rem', color: 'var(--text-muted)' }}>ID: CIE-{course.id.slice(-6).toUpperCase()}</span>
                <Award size={18} color="var(--brand-primary)" />
              </div>
            </div>

            {/* Course Overview in Card */}
            <div>
              <div style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {course.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#D97706', fontWeight: 800 }}>★ 4.85</span>
                <span>•</span>
                <span>{totalDuration}.0 Hours</span>
                <span>•</span>
                <span style={{ textTransform: 'capitalize' }}>{course.level}</span>
              </div>
            </div>

            {/* Progress / Status feedback if enrolled */}
            {enrollment && (
              <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '4px' }}>
                  <span>Learning Progress</span>
                  <span>{enrollment.progress_percent}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '100px', backgroundColor: 'rgba(16, 185, 129, 0.2)', overflow: 'hidden' }}>
                  <div style={{ width: `${enrollment.progress_percent}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {enrollment.completed_lessons.length} of {totalVideos} lessons mastered
                </div>
              </div>
            )}

            {/* Primary Action Button (Great Learning Blue/Emerald CTA) */}
            <button
              type="button"
              onClick={() => {
                if (!enrollment) {
                  handleEnroll();
                } else if (firstLessonId) {
                  onStartLesson(course.id, firstLessonId);
                }
              }}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                borderRadius: '100px',
                padding: '14px',
                fontSize: '0.95rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px -2px rgba(16, 185, 129, 0.45)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>{enrollment ? 'Resume Learning' : 'Start Course Free'}</span>
            </button>

            {/* Certificate Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                const certs = db.getCertificates(currentUserId);
                const match = certs.find((c) => c.course_id === course.id);
                if (match) {
                  setActiveCertificate(match);
                } else {
                  // Preview or open certificate modal
                  setActiveCertificate({
                    id: `cert-preview-${course.id}`,
                    user_id: currentUserId,
                    course_id: course.id,
                    student_name: db.getUser(currentUserId, currentUserId)?.full_name || 'Enrolled Student',
                    course_title: course.title,
                    issue_date: new Date().toISOString(),
                    verification_hash: `sha256-cie-${course.slug}-verified`,
                    grade: 96,
                    skills_acquired: skillsGained,
                  });
                }
              }}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--brand-primary)',
                borderRadius: '100px',
                padding: '12px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: '1.5px solid var(--brand-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <Award size={16} />
              <span>Preview Verified Certificate</span>
            </button>

            {/* Social Proof Footer */}
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Users size={13} />
              <span>411.8K+ learners enrolled on Geniusphere</span>
            </div>
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
                          backgroundColor: isExpanded ? 'var(--brand-surface)' : 'var(--bg-surface)',
                          padding: '14px 18px',
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: isModCompleted ? 'var(--brand-primary)' : isExpanded ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                              color: isModCompleted || isExpanded ? '#FFFFFF' : 'var(--text-secondary)',
                              border: isModCompleted || isExpanded ? 'none' : '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.80rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {isModCompleted ? '✓' : mIdx + 1}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Module {mIdx + 1}: {cleanModuleTitle}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: isModCompleted ? 'var(--brand-primary)' : 'var(--text-muted)',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              padding: '3px 10px',
                              borderRadius: '100px',
                            }}
                          >
                            {completedInMod > 0 ? `${completedInMod}/${mod.lessons.length} completed` : `${mod.lessons.length} video lectures`}
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
                              onClick={() => onStartLesson(course.id, les.id)}
                              style={{
                                padding: '14px 18px',
                                borderTop: lIdx > 0 ? '1px solid var(--border-subtle)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1', minWidth: '220px' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-subdued)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '2px',
                                  }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} color="var(--brand-primary)" />
                                  ) : (
                                    <Play size={15} color="var(--text-secondary)" />
                                  )}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.90rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                    {cleanLessonTitle}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {les.summary}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} />
                                  <span>{les.duration_minutes} mins</span>
                                </span>
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartLesson(course.id, les.id);
                                  }}
                                  style={{ height: '32px', padding: '0 16px', fontSize: '0.80rem', borderRadius: '100px', fontWeight: 800 }}
                                >
                                  {isCompleted ? 'Review' : 'Play'}
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
