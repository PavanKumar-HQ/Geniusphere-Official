import React from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import {
  BookOpen,
  Award,
  Clock,
  Flame,
  Shield,
  Briefcase,
  CheckCircle2,
  ListTodo,
  Zap,
} from 'lucide-react';
import { CelebrationCrackers } from './CelebrationCrackers';
import { backendEngine } from '../backend/RealtimeOrchestrator';

interface StudentDashboardProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigate: (view: string, slug?: string) => void;
  onSelectCourse: (slug: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  db,
  currentUserId,
  onNavigate,
  onSelectCourse,
}) => {
  const user = db.getUser(currentUserId, currentUserId);
  const enrollments = db.getUserEnrollments(currentUserId);
  const userProgress = db.getUserProgress(currentUserId);
  const certificates = db.getUserCertificates(currentUserId);
  const [isCrackersActive, setIsCrackersActive] = React.useState(false);
  const [streakClaimed, setStreakClaimed] = React.useState(false);

  // Student's completed lab submissions
  const allSubmissions: Array<{
    id: string;
    assignment_id: string;
    score: number | null;
    passed: boolean | null;
    submission_hash: string | null;
    submitted_at: string;
  }> = [];

  // Iterate over submissions in db
  db.submissions.forEach((sub) => {
    if (sub.student_id === currentUserId) {
      allSubmissions.push({
        id: sub.id,
        assignment_id: sub.assignment_id,
        score: sub.score,
        passed: sub.passed,
        submission_hash: sub.submission_hash,
        submitted_at: sub.submitted_at,
      });
    }
  });

  // All canonical courses in catalog
  const allCourses = db.getCanonicalCourses();

  // Calculate enrolled courses with progress
  const enrolledCoursesWithDetails = enrollments
    .map((enr) => {
      const course = db.getCourseById(enr.course_id);
      return {
        enrollment: enr,
        course,
      };
    })
    .filter((item) => item.course !== null);

  // Calculate overall completion percent
  const avgProgress =
    enrolledCoursesWithDetails.length > 0
      ? Math.round(
          enrolledCoursesWithDetails.reduce(
            (acc, curr) => acc + curr.enrollment.progress_percent,
            0
          ) / enrolledCoursesWithDetails.length
        )
      : 0;

  // Calculate achievements
  const achievements = [];
  const hasPassedLab = allSubmissions.some((s) => s.passed && (s.score || 0) >= 100);
  if (hasPassedLab) {
    achievements.push({
      id: 'ach-defense-initiate',
      title: 'Defense Initiate',
      desc: 'Passed web application defense evaluation with 100% score.',
      icon: Shield,
      date: 'Verified Server Evaluation',
    });
  }
  if (enrolledCoursesWithDetails.length > 0) {
    achievements.push({
      id: 'ach-first-step',
      title: 'Curriculum Explorer',
      desc: `Enrolled in ${enrolledCoursesWithDetails.length} practical subject${
        enrolledCoursesWithDetails.length > 1 ? 's' : ''
      }.`,
      icon: BookOpen,
      date: 'Active Learner',
    });
  }
  if (certificates.length > 0) {
    achievements.push({
      id: 'ach-certified-achiever',
      title: 'Certified Achiever',
      desc: `Earned ${certificates.length} verifiable completion certificate${
        certificates.length > 1 ? 's' : ''
      }.`,
      icon: Award,
      date: 'Verified Hash Credential',
    });
  }

  // Pending assignments
  const pendingAssignments = [
    {
      id: 'assign-lab-101',
      title: 'Course Assessment: Web Defense & Security Controls',
      course: 'Cybersecurity & Defensive Web Security',
      due: '14 days remaining',
      status: hasPassedLab ? 'Completed (100/100)' : 'Pending Submission',
      isCompleted: hasPassedLab,
    },
  ];

  const pendingAssignmentsCount = pendingAssignments.filter((a) => !a.isCompleted).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* ================================================================ */}
      {/* HEADER BANNER */}
      {/* ================================================================ */}
      <div
        className="card-elevated"
        style={{
          borderLeft: '5px solid var(--brand-primary)',
          padding: '28px 32px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--brand-primary)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                LEARNER WORKSPACE
              </span>
              {user?.is_minor && (
                <span
                  style={{
                    backgroundColor: 'var(--bg-surface-subdued)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '3px 8px',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  Minor Account (Parent Consent Active)
                </span>
              )}
            </div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '6px',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Good morning, {user?.full_name?.split(' ')[0] || 'Learner'}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Keep going. You're making great progress building practical, verified skills.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Flame size={22} color="var(--brand-quest, #F59E0B)" />
              <div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                  }}
                >
                  Active Streak
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {userProgress.streak_days || 3} Days{' '}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                    (Protected)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('catalogue')}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                height: '44px',
                fontSize: '0.92rem',
                fontWeight: 700,
                padding: '0 20px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <BookOpen size={16} />
              <span>Explore {allCourses.length} Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4-METRIC STAT ROW (Matching Design Board 1) */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enrolled Courses</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {enrolledCoursesWithDetails.length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Lessons</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {userProgress.completed_lessons.length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ListTodo size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Assignments</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {pendingAssignmentsCount}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Certificates Earned</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {certificates.length}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MAIN CONTENT GRID: CONTINUE LEARNING + MASCOT ENCOURAGEMENT */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.7fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Continue Learning */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Continue Learning
            </h2>
            <span
              style={{
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--brand-primary)',
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {enrolledCoursesWithDetails.length} Enrolled
            </span>
          </div>

          {enrolledCoursesWithDetails.length === 0 ? (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface-subdued)',
                borderRadius: '16px',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <MascotSphere pose="thinking" size={90} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '14px 0 6px', color: 'var(--text-primary)' }}>
                Ready to Begin Your Journey?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px', maxWidth: '420px', margin: '0 auto 18px', lineHeight: 1.5 }}>
                You have not enrolled in any courses yet. Choose from our curated curriculum across Technology & Digital Skills, Financial Literacy, and Professional Skills.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('catalogue')}
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '10px 22px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Browse Course Catalogue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {enrolledCoursesWithDetails.map(({ course, enrollment }) => (
                <div
                  key={course!.id}
                  style={{
                    padding: '20px 22px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--bg-surface-subdued)',
                        color: 'var(--brand-primary)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        border: '1px solid var(--border-subtle)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {course!.domain}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(0, 245, 160, 0.12)',
                        color: 'var(--brand-primary)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        border: '1px solid rgba(0, 245, 160, 0.25)',
                      }}
                    >
                      {enrollment.completed_lessons.length} of {course!.modules.length || 10} Modules ({enrollment.progress_percent}%)
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {course!.title}
                  </h3>

                  {/* Realtime Glowing Gradient Course Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Progress</span>
                      <span style={{ color: 'var(--brand-primary)' }}>{enrollment.progress_percent}% COMPLETED</span>
                    </div>
                    <div
                      style={{
                        height: '10px',
                        borderRadius: '5px',
                        backgroundColor: 'var(--bg-surface-subdued)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${enrollment.progress_percent}%`,
                          background: 'linear-gradient(90deg, #00F5A0 0%, #00D287 100%)',
                          boxShadow: '0 0 10px rgba(0, 245, 160, 0.45)',
                          borderRadius: '5px',
                          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Next: Module {Math.min((course!.modules.length || 10), enrollment.completed_lessons.length + 1)} Video & Lab
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCourse(course!.slug)}
                      className="btn-primary"
                      style={{
                        height: '36px',
                        padding: '0 18px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Continue Lesson</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Daily Learning Habit & Streak Tracker (Matching Prototype) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* DAILY LEARNING HABIT & STREAK TRACKER WIDGET */}
          <div
            className="card-elevated"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1.5px solid var(--border-subtle)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DAILY LEARNING HABIT
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  & Streak Tracker
                </h3>
              </div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame size={20} color="#F59E0B" fill="#F59E0B" />
              </div>
            </div>

            {/* 7-Day Mon-Sun Grid (Matches Prototype Image) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {[
                { day: 'M', active: true, shielded: false },
                { day: 'T', active: true, shielded: false },
                { day: 'W', active: true, shielded: false },
                { day: 'T', active: true, shielded: false },
                { day: 'F', active: (userProgress.streak_days || 5) >= 5, shielded: false },
                { day: 'S', active: (userProgress.streak_days || 5) >= 6, shielded: (userProgress.streak_days || 5) < 6 },
                { day: 'S', active: (userProgress.streak_days || 5) >= 7, shielded: (userProgress.streak_days || 5) < 7 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 2px',
                    borderRadius: '10px',
                    backgroundColor: item.active
                      ? 'rgba(0, 245, 160, 0.08)'
                      : 'var(--bg-canvas)',
                    border: item.active
                      ? '1.5px solid var(--brand-primary)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.active ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                    {item.day}
                  </span>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: item.active ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                      color: item.active ? '#03170E' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.active ? (
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    ) : item.shielded ? (
                      <Shield size={11} color="#F59E0B" />
                    ) : (
                      <span style={{ fontSize: '0.65rem' }}>•</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Streak & Milestone */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{userProgress.streak_days || 5}-Day Current Streak</span>
                  <Flame size={18} color="#F59E0B" fill="#F59E0B" />
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  Shield Active
                </span>
              </div>

              {/* Goal Progress */}
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Next Goal: 7-Day Achievement! (+100 XP Bonus)
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--bg-canvas)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.round(((userProgress.streak_days || 5) / 7) * 100))}%`,
                    backgroundColor: 'var(--brand-primary)',
                    borderRadius: '3px',
                  }}
                />
              </div>

              {/* Claim Streak Action Button */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-shimmer"
                  disabled={streakClaimed}
                  onClick={() => {
                    setStreakClaimed(true);
                    db.awardXp(currentUserId, 50, 'Daily Streak Active Check-In');
                    backendEngine.notifications.dispatch(
                      currentUserId,
                      'Daily Streak Maintained (+50 XP)!',
                      'Great consistency! You maintained your daily study streak and unlocked bonus XP.',
                      'high',
                      'grade'
                    );
                    setIsCrackersActive(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: streakClaimed ? '#E5F0DF' : 'var(--brand-primary)',
                    color: streakClaimed ? '#26352A' : '#FFFFFF',
                    border: streakClaimed ? '1px solid #C8E3BF' : 'none',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: streakClaimed ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Flame size={14} color={streakClaimed ? '#43A85B' : '#F59E0B'} className={streakClaimed ? undefined : 'animate-flame'} />
                  <span>{streakClaimed ? 'Streak Claimed Today (+50 XP)' : 'Claim Daily Streak (+50 XP)'}</span>
                </button>
              </div>
            </div>
          </div>

          <CelebrationCrackers
            active={isCrackersActive}
            message="Daily Streak Maintained & +50 XP Collected!"
            xpAmount={50}
            onComplete={() => setIsCrackersActive(false)}
          />

          {/* Overall Progress Widget */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface-subdued)',
                border: '6px solid var(--brand-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {avgProgress}%
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Done
              </span>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                Overall Curriculum Completion
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {userProgress.completed_lessons.length} total lessons validated across active subjects
              </div>
            </div>
          </div>

          {/* Mascot Encouragement Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-subdued)',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <MascotSphere pose="encouraging" size={72} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Keep building momentum!
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                Daily practical asserts solidify real developer skills.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* LOWER SECTION: ASSIGNMENTS & VERIFIED ACHIEVEMENTS */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Classroom Assignments */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Classroom Assignments
              </h2>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--brand-primary)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                Classroom Tasks
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingAssignments.map((assign) => (
                <div
                  key={assign.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subdued)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{assign.course}</span>
                    <span
                      style={{
                        backgroundColor: assign.isCompleted ? 'var(--bg-surface)' : 'rgba(217, 119, 6, 0.15)',
                        color: assign.isCompleted ? 'var(--brand-primary)' : 'var(--brand-quest, #D97706)',
                        border: `1px solid ${assign.isCompleted ? 'var(--border-subtle)' : 'var(--brand-quest-border, #FDE68A)'}`,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {assign.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.94rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    {assign.title}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {assign.due}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('lab')}
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '4px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {assign.isCompleted ? 'Re-open Lab' : 'Launch Assignment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Enrolled in School Cohort?</span>
            <button
              type="button"
              onClick={() => onNavigate('classrooms')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Join Classroom with Code
            </button>
          </div>
        </div>

        {/* Verified Achievements */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Verified Achievements
              </h2>
              <Award size={18} color="var(--brand-primary)" />
            </div>

            {achievements.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Complete lessons and lab challenges to earn verified skill badges.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {achievements.map((ach) => {
                  const IconComponent = ach.icon;
                  return (
                    <div
                      key={ach.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-surface-subdued)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--brand-primary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ach.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ach.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => onNavigate('resume-builder')}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '100px',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Briefcase size={14} />
              <span>Add Achievements to Resume Builder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
