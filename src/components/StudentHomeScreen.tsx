import React, { useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import { CourseCardIllustrated } from './CourseCardIllustrated';
import {
  Play,
  Flame,
  Zap,
  Award,
  BookOpen,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  School,
  Calendar,
  ChevronRight,
  Target,
  ShieldCheck,
  Cpu,
  TrendingUp,
  FlaskConical,
  BarChart3,
  Code2,
} from 'lucide-react';

interface StudentHomeScreenProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigate: (view: string, slug?: string) => void;
  onStartLesson?: (courseId: string, lessonId: string, tab?: 'video' | 'lab' | 'sandbox' | 'animation') => void;
  onSelectCourse: (slug: string) => void;
  onLaunchLab: (slug: string) => void;
  onViewMarketing?: () => void;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  db,
  currentUserId,
  onNavigate,
  onStartLesson,
  onSelectCourse,
  onLaunchLab,
  onViewMarketing,
}) => {
  const user = db.getUser(currentUserId, currentUserId);
  const enrollments = db.getUserEnrollments(currentUserId);
  const userProgress = db.getUserProgress(currentUserId);
  const allCourses = db.getCanonicalCourses();
  const allLabs = db.getLabDefinitions();

  // Find active course or default to first enrolled / top track
  const primaryEnrollment = enrollments[0];
  const primaryCourse = useMemo(() => {
    if (primaryEnrollment) {
      const match = allCourses.find((c) => c.id === primaryEnrollment.course_id || c.slug === primaryEnrollment.course_id);
      if (match) return match;
    }
    return allCourses.find((c) => c.slug === 'cybersecurity-defensive-web') || allCourses[0];
  }, [primaryEnrollment, allCourses]);

  // Find next lesson to complete
  const nextLesson = useMemo(() => {
    if (!primaryCourse || !primaryCourse.modules) return null;
    const completedSet = new Set(primaryEnrollment?.completed_lessons || []);
    for (const mod of primaryCourse.modules) {
      for (const les of mod.lessons || []) {
        if (!completedSet.has(les.id)) {
          return { lesson: les, module: mod };
        }
      }
    }
    // If all completed, return first lesson
    return {
      lesson: primaryCourse.modules[0]?.lessons?.[0],
      module: primaryCourse.modules[0],
    };
  }, [primaryCourse, primaryEnrollment]);

  // Upcoming scheduled training sessions for this student's classroom/school
  const upcomingSessions = useMemo(() => {
    try {
      return db.getUpcomingTrainingSessions(currentUserId).slice(0, 2);
    } catch {
      return [];
    }
  }, [db, currentUserId]);

  const streakDays = userProgress.streak_days || 7;
  const totalXp = userProgress.xp || 320;
  const level = Math.floor(totalXp / 150) + 1;
  const completedCount = primaryEnrollment?.completed_lessons?.length || 0;
  const totalLessonsCount = primaryCourse?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 10;
  const progressPercent = primaryEnrollment?.progress_percent || Math.round((completedCount / totalLessonsCount) * 100);

  const handleResumePrimaryLesson = () => {
    if (primaryCourse && nextLesson?.lesson) {
      if (onStartLesson) {
        onStartLesson(primaryCourse.id, nextLesson.lesson.id);
      } else {
        onSelectCourse(primaryCourse.slug);
      }
    } else if (primaryCourse) {
      onSelectCourse(primaryCourse.slug);
    }
  };

  // 3 visually distinct tracks showcasing each domain (Technology, Finance, Professional)
  const visualRecommendedCourses = useMemo(() => {
    const techCourse = allCourses.find((c) => c.domain === 'technology' && c.id !== primaryCourse?.id);
    const finCourse = allCourses.find((c) => c.domain === 'finance' && c.id !== primaryCourse?.id);
    const profCourse = allCourses.find((c) => c.domain === 'professional' && c.id !== primaryCourse?.id);

    const list = [techCourse, finCourse, profCourse].filter(Boolean) as typeof allCourses;
    if (list.length < 3) {
      const remaining = allCourses.filter((c) => c.id !== primaryCourse?.id && !list.includes(c));
      return [...list, ...remaining].slice(0, 3);
    }
    return list;
  }, [allCourses, primaryCourse]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '16px 16px 48px' }}>
      
      {/* ================================================================ */}
      {/* 1. PERSONALIZED WELCOME & MASCOT GUIDANCE BANNER                 */}
      {/* ================================================================ */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          borderRadius: '24px',
          padding: '20px 24px',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
          <MascotSphere pose="happy" size={64} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-primary)', letterSpacing: '0.05em' }}>
                LEARNER QUEST HUB
              </span>
              <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                Level {level} Explorer
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.65rem)', fontWeight: 900, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Hi, {user?.full_name?.split(' ')[0] || 'Learner'}!
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              1 lesson away from your next streak milestone. Keep building your superpower!
            </p>
          </div>
        </div>

        {/* Gamified Habit & Telemetry Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '100px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Flame size={18} color="#D97706" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#D97706' }}>
              {streakDays} Days Streak
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '100px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Zap size={18} color="var(--brand-primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. ONE CLEAR DOMINANT NEXT ACTION: CONTINUE YOUR LESSON HERO     */}
      {/* ================================================================ */}
      <div
        style={{
          background: 'var(--hero-card-bg)',
          borderRadius: '24px',
          padding: '28px 32px',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          border: '1px solid var(--hero-card-border)',
          boxShadow: 'var(--hero-card-shadow)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow Accent */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ flex: 1, minWidth: '280px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              style={{
                backgroundColor: 'var(--hero-card-pill-bg)',
                color: 'var(--hero-card-pill-text)',
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid var(--hero-card-border)',
              }}
            >
              CONTINUE YOUR LESSON
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {primaryCourse?.domain?.toUpperCase()}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)', fontWeight: 800, margin: '0 0 8px', color: 'var(--hero-card-title)', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
            {primaryCourse?.title}
          </h2>

          <p style={{ margin: '0 0 18px', fontSize: '0.9rem', color: 'var(--hero-card-desc)', maxWidth: '580px', lineHeight: 1.5 }}>
            {nextLesson?.lesson ? (
              <span>Next up: <strong style={{ color: 'var(--hero-card-title)' }}>{nextLesson.lesson.title}</strong></span>
            ) : (
              primaryCourse?.summary
            )}
          </p>

          {/* Genuine Persisted Progress Bar */}
          <div style={{ maxWidth: '420px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              <span>{completedCount} of {totalLessonsCount} lessons mastered</span>
              <span style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{progressPercent}% Complete</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: '100px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.max(5, progressPercent)}%`,
                  height: '100%',
                  background: 'var(--grad-brand)',
                  borderRadius: '100px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={handleResumePrimaryLesson}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '100px',
              padding: '14px 28px',
              fontWeight: 800,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(16, 185, 129, 0.5)';
            }}
          >
            <Play size={18} fill="#FFFFFF" />
            <span>Resume Lesson</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2.5 QUICK APP CATEGORY PILL STRIP                                */}
      {/* ================================================================ */}
      <div className="mobile-pill-strip" style={{ margin: '-8px 0 0' }}>
        <button
          type="button"
          onClick={() => onNavigate('catalogue')}
          style={{
            padding: '7px 14px',
            borderRadius: '100px',
            background: 'var(--grad-brand)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Layers size={14} />
          <span>All Tracks</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('catalogue', 'technology')}
          style={{
            padding: '7px 14px',
            borderRadius: '100px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} color="var(--brand-primary)" />
          <span>Cybersecurity</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('catalogue', 'technology')}
          style={{
            padding: '7px 14px',
            borderRadius: '100px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Cpu size={14} color="var(--brand-primary)" />
          <span>AI &amp; Neural Nets</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('catalogue', 'finance')}
          style={{
            padding: '7px 14px',
            borderRadius: '100px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <TrendingUp size={14} color="var(--brand-primary)" />
          <span>FinTech &amp; Trading</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('labs')}
          style={{
            padding: '7px 14px',
            borderRadius: '100px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FlaskConical size={14} color="var(--brand-primary)" />
          <span>15 Interactive Labs</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 3. DAILY QUESTS & GAMIFIED HABIT MATRIX                          */}
      {/* ================================================================ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Daily Quests &amp; Challenges
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Resets at midnight
          </span>
        </div>

        <div className="app-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Quest 1: Watch Lesson */}
          <div
            className="app-carousel-item-compact card-hover-lift"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
            }}
            onClick={() => handleResumePrimaryLesson()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Complete 1 Video Lesson
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Watch video &amp; complete quiz
                </div>
              </div>
            </div>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                color: 'var(--brand-primary)',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: '100px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              +50 XP
            </span>
          </div>

          {/* Quest 2: Run a Simulation Lab */}
          <div
            className="app-carousel-item-compact card-hover-lift"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  flexShrink: 0,
                }}
              >
                <Terminal size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Interactive Experiment
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Run 1 lab or sandbox challenge
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onLaunchLab('office-lab')}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.75rem', height: '32px', borderRadius: '100px', fontWeight: 800 }}
            >
              Open Lab
            </button>
          </div>

          {/* Quest 3: Maintain Streak */}
          <div
            className="app-carousel-item-compact card-hover-lift"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(217, 119, 6, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  flexShrink: 0,
                }}
              >
                <span className="flame-anim">
                  <Flame size={20} />
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Active Streak Check-in
                </div>
                <div style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700 }}>
                  Active ({streakDays} Days)
                </div>
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.75rem', fontWeight: 800 }}>
              <CheckCircle2 size={16} /> Kept
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. UPCOMING SCHOOL SESSIONS (MARKETPLACE INTEGRATION)            */}
      {/* ================================================================ */}
      {upcomingSessions.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '20px 24px',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <School size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                School Workshop Sessions
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Coordinated with DPTS School Admin &amp; Verified Trainers
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', flex: 1, minWidth: 0, lineHeight: 1.35 }}>
                    {session.topic}
                  </div>
                  <span
                    className="badge badge-accent"
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      padding: '3px 8px',
                    }}
                  >
                    {session.delivery_status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> In 2 Days • 10:00 AM
                  </span>
                  <span>•</span>
                  <span>{session.meeting_or_room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 5. VISUAL COURSE TRACKS (NO BORING WALLS OF TEXT)               */}
      {/* ================================================================ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Curated Learning Tracks
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Bite-sized visual modules with interactive experiments
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalogue')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Tracks</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          className="app-carousel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '18px',
          }}
        >
          {visualRecommendedCourses.map((c) => (
            <div key={c.id} className="app-carousel-item">
              <CourseCardIllustrated
                course={c}
                onSelectCourse={onSelectCourse}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 6. LEARNING THROUGH DOING: INTERACTIVE EXPERIMENT SANDBOXES      */}
      {/* ================================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '24px',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hands-On Simulation Sandboxes
              </h2>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Try things out, observe real reactions, and build genuine muscle memory
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('labs')}
            className="btn-secondary"
            style={{ height: '34px', fontSize: '0.78rem', padding: '0 14px' }}
          >
            <span>All 15 Labs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="app-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {/* Tile 1: Office Lab X */}
          <div
            className="app-carousel-item-compact"
            onClick={() => onLaunchLab('office-lab')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(37, 99, 235, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B7FFF' }}>
                <BarChart3 size={20} />
              </div>
              <span className="badge badge-accent" style={{ fontSize: '0.62rem' }}>Interactive</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Office Lab X</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>Spreadsheet formulas, total math &amp; live workflows</div>
            </div>
          </div>

          {/* Tile 2: Cyber Defense Lab */}
          <div
            className="app-carousel-item-compact"
            onClick={() => onLaunchLab('cybersecurity-lab')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#10B981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <ShieldCheck size={20} />
              </div>
              <span className="badge badge-accent" style={{ fontSize: '0.62rem' }}>Defensive Web</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Cyber Attack Visualizer</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>SQL injection parameterization &amp; firewall rules</div>
            </div>
          </div>

          {/* Tile 3: AI Neural Lab */}
          <div
            className="app-carousel-item-compact"
            onClick={() => onLaunchLab('ai-lab')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#8B5CF6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                <Cpu size={20} />
              </div>
              <span className="badge badge-accent" style={{ fontSize: '0.62rem' }}>AI Decision</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Neural Playground</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tweak weights, biases, and visual decision planes</div>
            </div>
          </div>

          {/* Tile 4: Multi-Language Sandbox */}
          <div
            className="app-carousel-item-compact"
            onClick={() => onNavigate('code-sandbox')}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#EC4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(236, 72, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
                <Code2 size={20} />
              </div>
              <span className="badge badge-accent" style={{ fontSize: '0.62rem' }}>Python / C / JS</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Multi-Language Sandbox</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>In-browser compiler with test cases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Link to Public Marketing View if needed */}
      {onViewMarketing && (
        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={onViewMarketing}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Viewing Student Space • Click here to switch to Public Platform Overview
          </button>
        </div>
      )}

    </div>
  );
};
export default StudentHomeScreen;
