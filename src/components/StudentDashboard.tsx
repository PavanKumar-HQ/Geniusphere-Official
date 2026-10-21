import React, { useState } from 'react';
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
  RotateCcw,
  Play,
  FlaskConical,
  X,
  ExternalLink,
  Layers,
  Video,
  Check,
  Calendar,
} from 'lucide-react';
import { CelebrationCrackers } from './CelebrationCrackers';
import { StreakHabitModal } from './StreakHabitModal';
import { backendEngine } from '../backend/RealtimeOrchestrator';
import {
  ALL_CANONICAL_17_TOPICS,
  getLearnerProgress,
  SimulationLab,
  VideoLesson,
  TopicSpecification,
  saveLearnerLessonCompletion,
} from '../curriculum';
import { CurriculumLabRunner } from './CurriculumLabRunner';

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
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [activeCurriculumLab, setActiveCurriculumLab] = useState<{ lab: SimulationLab; topicTitle: string } | null>(null);
  const [selectedCurriculumCategory, setSelectedCurriculumCategory] = useState<'all' | 'technology' | 'finance' | 'professional'>('all');
  const [selectedTopicDrawer, setSelectedTopicDrawer] = useState<TopicSpecification | null>(null);
  const [activeTopicDrawerTab, setActiveTopicDrawerTab] = useState<'labs' | 'lessons'>('labs');
  const [activeVideoLesson, setActiveVideoLesson] = useState<{ lesson: VideoLesson; topicTitle: string; topicId: string } | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  // Authoritative Date & Time Engine for Real Streak Tracking
  const now = React.useMemo(() => new Date(), [refreshSeed]);
  const todayDateStr = React.useMemo(() => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, [now]);

  const yesterdayDateStr = React.useMemo(() => {
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    return `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  }, [now]);

  const streakStorageKey = `geniusphere_streak_claim_${currentUserId}`;

  // Read persisted check-in records from storage
  const persistedClaim = React.useMemo(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(streakStorageKey);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }
    return null;
  }, [streakStorageKey, refreshSeed]);

  const lastActiveDate = userProgress.last_active_date || persistedClaim?.lastClaimedDate || '';
  const isClaimedToday = lastActiveDate === todayDateStr || persistedClaim?.lastClaimedDate === todayDateStr;

  const realProgress = getLearnerProgress(currentUserId);
  const studyMetrics = backendEngine.tracker.getUserMetrics(currentUserId);

  // Authoritative streak days calculation based on date continuity:
  const effectiveStreakDays = React.useMemo(() => {
    const rawStreak = userProgress.streak_days || persistedClaim?.streakCount || studyMetrics.current_streak_days || 0;
    if (!lastActiveDate) return rawStreak > 0 ? rawStreak : 0;
    if (lastActiveDate === todayDateStr) {
      return Math.max(1, rawStreak);
    }
    if (lastActiveDate === yesterdayDateStr) {
      return Math.max(1, rawStreak);
    }
    // Decayed / missed days
    return 0;
  }, [lastActiveDate, todayDateStr, yesterdayDateStr, userProgress.streak_days, persistedClaim, studyMetrics.current_streak_days]);

  const streakDays = effectiveStreakDays;
  const streakClaimed = isClaimedToday;
  const totalStudyMinutes = studyMetrics.total_study_minutes || ((userProgress.completed_lessons?.length || 0) * 25) || 0;

  // 7-Day current week calendar (Monday to Sunday) based on real Date & Time
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  const mondayOfWeek = React.useMemo(() => {
    const m = new Date(now);
    m.setDate(now.getDate() - currentDayOfWeek);
    m.setHours(0, 0, 0, 0);
    return m;
  }, [now, currentDayOfWeek]);

  const currentWeekDays = React.useMemo(() => {
    const weekDayLabels = [
      { label: 'M', full: 'Monday' },
      { label: 'T', full: 'Tuesday' },
      { label: 'W', full: 'Wednesday' },
      { label: 'T', full: 'Thursday' },
      { label: 'F', full: 'Friday' },
      { label: 'S', full: 'Saturday' },
      { label: 'S', full: 'Sunday' },
    ];

    return weekDayLabels.map((dayItem, idx) => {
      const dayDate = new Date(mondayOfWeek);
      dayDate.setDate(mondayOfWeek.getDate() + idx);
      const dayDateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      const isToday = idx === currentDayOfWeek;
      const isPast = idx < currentDayOfWeek;
      const isFuture = idx > currentDayOfWeek;

      let isActive = false;
      if (isToday) {
        isActive = isClaimedToday;
      } else if (isPast) {
        const daysAgo = currentDayOfWeek - idx;
        const streakRange = isClaimedToday ? effectiveStreakDays : (lastActiveDate === yesterdayDateStr ? effectiveStreakDays : 0);
        isActive = daysAgo <= streakRange && (isClaimedToday ? daysAgo < effectiveStreakDays : daysAgo <= effectiveStreakDays);
      }

      return {
        label: dayItem.label,
        full: dayItem.full,
        dateNum: dayDate.getDate(),
        dayDateStr,
        isToday,
        isPast,
        isFuture,
        isActive,
      };
    });
  }, [mondayOfWeek, currentDayOfWeek, isClaimedToday, effectiveStreakDays, lastActiveDate, yesterdayDateStr]);

  const handleClaimDailyStreak = () => {
    if (isClaimedToday) return;

    let nextStreak = 1;
    if (lastActiveDate === yesterdayDateStr) {
      nextStreak = (effectiveStreakDays || 0) + 1;
    } else if (lastActiveDate === todayDateStr) {
      nextStreak = effectiveStreakDays || 1;
    } else {
      nextStreak = 1;
    }

    userProgress.streak_days = nextStreak;
    userProgress.last_active_date = todayDateStr;
    db.awardXp(currentUserId, 50, 'Daily Streak Active Check-In');

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          streakStorageKey,
          JSON.stringify({
            lastClaimedDate: todayDateStr,
            streakCount: nextStreak,
            claimedAt: new Date().toISOString(),
          })
        );
      }
    } catch (e) {
      // ignore
    }

    backendEngine.tracker.recordMilestone(
      currentUserId,
      'lesson_completed',
      'daily-streak-claim',
      'Daily Active Streak Check-In',
      300
    );

    backendEngine.notifications.dispatch(
      currentUserId,
      `Daily Streak Maintained (${nextStreak} Days, +50 XP)!`,
      `Great consistency! You maintained your daily study streak on ${now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} and unlocked bonus XP.`,
      'high',
      'grade'
    );

    setIsCrackersActive(true);
    setRefreshSeed((prev) => prev + 1);
  };

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

  // Calculate overall completion percent from genuine completed modules
  const avgProgress =
    enrolledCoursesWithDetails.length > 0
      ? Math.round(
          enrolledCoursesWithDetails.reduce((acc, curr) => {
            const total = curr.course?.modules?.length || 10;
            const completed = curr.enrollment.completed_lessons?.length || 0;
            return acc + Math.min(100, Math.round((completed / total) * 100));
          }, 0) / enrolledCoursesWithDetails.length
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

  // Derive genuine classroom assignments for student
  const studentEnrollments = Array.from(db.enrollments.values()).filter(
    (ce) => ce.student_id === currentUserId
  );
  const enrolledClassroomIds = new Set(studentEnrollments.map((ce) => ce.classroom_id));
  const pendingAssignments = Array.from(db.assignments.values())
    .filter((a) => enrolledClassroomIds.has(a.classroom_id))
    .map((a) => {
      const isCompleted = allSubmissions.some((s) => s.assignment_id === a.id && s.passed);
      const lab = db.labs.get(a.lab_id);
      return {
        id: a.id,
        title: lab?.title || 'Classroom Assessment Lab',
        course: 'Cohort Lab Assignment',
        due: a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline',
        status: isCompleted ? 'Completed (Verified)' : 'Pending Submission',
        isCompleted,
      };
    });

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
                  {streakDays} Days{' '}
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

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.confirm('Reset local cache to start with a completely fresh, clean 0-state?')) {
                  localStorage.removeItem('geniusphere_db_v1');
                  localStorage.removeItem(`geniusphere_progress_${currentUserId}`);
                  localStorage.removeItem(`geniusphere_notifications_${currentUserId}`);
                  localStorage.removeItem(`geniusphere_study_tracker_${currentUserId}`);
                  window.location.reload();
                }
              }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                height: '44px',
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '0 16px',
                borderRadius: '100px',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Wipe previous test cache and experience clean 0-state progression"
            >
              <RotateCcw size={15} />
              <span>Reset Demo State</span>
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
        className="student-dashboard-main-grid"
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
                  {(() => {
                    const totalMods = course!.modules?.length || 10;
                    const completedMods = enrollment.completed_lessons?.length || 0;
                    const percent = Math.min(100, Math.round((completedMods / totalMods) * 100));
                    return (
                      <>
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
                          {completedMods} of {totalMods} Modules ({percent}%)
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {course!.title}
                      </h3>

                      {/* Realtime Glowing Gradient Course Progress Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Progress</span>
                          <span style={{ color: 'var(--brand-primary)' }}>{percent}% COMPLETED</span>
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
                              width: `${percent}%`,
                              background: 'linear-gradient(90deg, #00F5A0 0%, #00D287 100%)',
                              boxShadow: '0 0 10px rgba(0, 245, 160, 0.45)',
                              borderRadius: '5px',
                              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          />
                        </div>
                      </div>
                      </>
                    );
                  })()}

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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setIsStreakModalOpen(true)}
              title="Click to view full habit breakdown"
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DAILY LEARNING HABIT
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>& Streak Tracker</span>
                  <Calendar size={15} color="var(--brand-primary)" />
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
                  transition: 'transform 0.2s ease',
                }}
              >
                <Flame size={20} color="#F59E0B" fill="#F59E0B" className={effectiveStreakDays > 0 ? 'animate-flame' : undefined} />
              </div>
            </div>

            {/* 7-Day Mon-Sun Grid (Reflecting genuine active streak & current Date/Time) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {currentWeekDays.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.full}, ${day.dayDateStr}${day.isToday ? ' (Today)' : ''}${day.isActive ? ' - Study Session Completed' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 2px 10px',
                    borderRadius: '12px',
                    backgroundColor: day.isActive
                      ? 'rgba(0, 245, 160, 0.09)'
                      : day.isToday
                      ? 'rgba(0, 245, 160, 0.04)'
                      : 'var(--bg-canvas)',
                    border: day.isActive
                      ? '1.5px solid var(--brand-primary)'
                      : day.isToday
                      ? '1.5px dashed var(--brand-primary)'
                      : '1px solid var(--border-subtle)',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: day.isActive || day.isToday ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                      {day.label}
                    </span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 600, color: day.isToday ? 'var(--brand-primary)' : 'var(--text-muted)', marginTop: '2px' }}>
                      {day.dateNum}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: day.isActive
                        ? 'var(--brand-primary)'
                        : day.isToday
                        ? 'rgba(0, 245, 160, 0.15)'
                        : 'var(--bg-surface-subdued)',
                      color: day.isActive ? '#03170E' : day.isToday ? 'var(--brand-primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      boxShadow: day.isActive ? '0 0 10px rgba(0, 245, 160, 0.35)' : 'none',
                    }}
                  >
                    {day.isActive ? (
                      <CheckCircle2 size={13} strokeWidth={2.8} />
                    ) : day.isToday ? (
                      <Flame size={12} className="animate-flame" />
                    ) : (
                      <span style={{ fontSize: '0.65rem' }}>•</span>
                    )}
                  </div>
                  {day.isToday && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        fontSize: '0.5rem',
                        fontWeight: 800,
                        backgroundColor: 'var(--brand-primary)',
                        color: '#03170E',
                        padding: '1px 3px',
                        borderRadius: '3px',
                        letterSpacing: '0.02em',
                        lineHeight: 1,
                      }}
                    >
                      TODAY
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Current Streak & Milestone */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{effectiveStreakDays}-Day Current Streak</span>
                  <Flame size={18} color="#F59E0B" fill="#F59E0B" className={effectiveStreakDays > 0 ? 'animate-flame' : undefined} />
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: effectiveStreakDays > 0 ? '#F59E0B' : 'var(--text-muted)',
                    backgroundColor: effectiveStreakDays > 0 ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-subdued)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {effectiveStreakDays > 0 ? 'Shield Active' : 'Start Today'}
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
                    width: `${Math.min(100, Math.round((effectiveStreakDays / 7) * 100))}%`,
                    backgroundColor: 'var(--brand-primary)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {/* Claim Streak Action Button */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className={isClaimedToday ? '' : 'btn-shimmer'}
                  disabled={isClaimedToday}
                  onClick={handleClaimDailyStreak}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: isClaimedToday ? '#E5F0DF' : 'var(--brand-primary)',
                    color: isClaimedToday ? '#26352A' : '#FFFFFF',
                    border: isClaimedToday ? '1px solid #C8E3BF' : 'none',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: isClaimedToday ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Flame size={14} color={isClaimedToday ? '#43A85B' : '#F59E0B'} className={isClaimedToday ? undefined : 'animate-flame'} />
                  <span>{isClaimedToday ? 'Streak Claimed Today (+50 XP)' : 'Claim Daily Streak (+50 XP)'}</span>
                </button>
              </div>
            </div>
          </div>

          <CelebrationCrackers
            active={isCrackersActive}
            onComplete={() => setIsCrackersActive(false)}
            message="Daily Streak Maintained & +50 XP Collected!"
            xpAmount={50}
          />

          <StreakHabitModal
            isOpen={isStreakModalOpen}
            onClose={() => setIsStreakModalOpen(false)}
            userProgress={userProgress}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
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

      {/* ================================================================ */}
      {/* 17 CANONICAL CURRICULUM TOPICS & INTERACTIVE SIMULATION LABS */}
      {/* ================================================================ */}
      <div
        className="card-elevated"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-subtle)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(0, 245, 160, 0.12)',
                  color: 'var(--brand-primary)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                17 TOPICS • 170 LESSONS • 170 LABS
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Practical Learning Topics & Interactive Simulation Labs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0' }}>
              Explore real school-age technology, financial literacy, and career skills through genuine video lessons and interactive SVG simulators.
            </p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Topics (17)' },
              { id: 'technology', label: 'Technology (6)' },
              { id: 'finance', label: 'Finance (6)' },
              { id: 'professional', label: 'Professional Skills (5)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCurriculumCategory(cat.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedCurriculumCategory === cat.id
                    ? '1.5px solid var(--brand-primary)'
                    : '1px solid var(--border-subtle)',
                  backgroundColor: selectedCurriculumCategory === cat.id
                    ? 'rgba(0, 245, 160, 0.12)'
                    : 'var(--bg-surface-subdued)',
                  color: selectedCurriculumCategory === cat.id
                    ? 'var(--brand-primary)'
                    : 'var(--text-secondary)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 17 Topic Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '20px',
          }}
        >
          {ALL_CANONICAL_17_TOPICS.filter((t) =>
            selectedCurriculumCategory === 'all' ? true : t.category === selectedCurriculumCategory
          ).map((topic) => {
            const topicRecord = realProgress[topic.id];
            const pct = topicRecord?.percentComplete || 0;
            const completedLessonsCount = topicRecord?.completedLessonIds?.length || 0;
            const completedLabsCount = topicRecord?.completedLabIds?.length || 0;

            return (
              <div
                key={topic.id}
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  borderRadius: '18px',
                  border: '1px solid var(--border-subtle)',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor:
                          topic.category === 'technology'
                            ? 'rgba(0, 245, 160, 0.15)'
                            : topic.category === 'finance'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(168, 85, 247, 0.15)',
                        color:
                          topic.category === 'technology'
                            ? 'var(--brand-primary)'
                            : topic.category === 'finance'
                            ? '#3B82F6'
                            : '#A855F7',
                      }}
                    >
                      #{topic.canonicalIndex} • {topic.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      10 Lessons • 10 Labs
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {topic.summary}
                  </p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Topic Progress</span>
                      <span style={{ color: 'var(--brand-primary)' }}>{pct}% Complete</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--bg-canvas)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedTopicDrawer(topic)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#000000',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Layers size={14} />
                      <span>Explore 10 Labs & Lessons</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCurriculumLab({ lab: topic.labs[0], topicTitle: topic.title })}
                      title="Quick Launch Lab #1"
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FlaskConical size={14} />
                      <span>Lab #1</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CURRICULUM LAB RUNNER MODAL */}
      {activeCurriculumLab && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              maxWidth: '1150px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <CurriculumLabRunner
              lab={activeCurriculumLab.lab}
              topicTitle={activeCurriculumLab.topicTitle}
              currentUserId={currentUserId}
              onClose={() => setActiveCurriculumLab(null)}
              onLabCompleted={(labId, score) => {
                db.awardXp(currentUserId, 100, `Completed Simulation Lab: ${activeCurriculumLab.lab.title}`);
                setRefreshSeed((s) => s + 1);
              }}
            />
          </div>
        </div>
      )}

      {/* TOPIC CURRICULUM DRAWER: ALL 10 LABS & ALL 10 LESSONS */}
      {selectedTopicDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: 'var(--bg-surface-subdued)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 245, 160, 0.15)',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    Topic #{selectedTopicDrawer.canonicalIndex} • {selectedTopicDrawer.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Canonical Syllabus
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  {selectedTopicDrawer.title}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '680px' }}>
                  {selectedTopicDrawer.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTopicDrawer(null)}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Selector */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '0 28px',
                gap: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTopicDrawerTab('labs')}
                style={{
                  padding: '14px 0',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTopicDrawerTab === 'labs' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  color: activeTopicDrawerTab === 'labs' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FlaskConical size={16} />
                <span>10 Interactive Simulation Labs</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTopicDrawerTab('lessons')}
                style={{
                  padding: '14px 0',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTopicDrawerTab === 'lessons' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  color: activeTopicDrawerTab === 'lessons' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Video size={16} />
                <span>10 Video Lessons</span>
              </button>
            </div>

            {/* Tab Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              {activeTopicDrawerTab === 'labs' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {selectedTopicDrawer.labs.map((lab, idx) => {
                    const isDone = (realProgress[selectedTopicDrawer.id]?.completedLabIds || []).includes(lab.id);
                    return (
                      <div
                        key={lab.id}
                        style={{
                          backgroundColor: 'var(--bg-surface-subdued)',
                          borderRadius: '14px',
                          border: '1px solid var(--border-subtle)',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                backgroundColor: 'var(--bg-canvas)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                color: 'var(--brand-primary)',
                              }}
                            >
                              Lab #{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {lab.controls.length} Interactive Controls
                            </span>
                            {isDone && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor: 'rgba(0, 245, 160, 0.15)',
                                  color: 'var(--brand-primary)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Check size={12} />
                                Completed (+100 XP)
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                            {lab.title}
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                            {lab.summary}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveCurriculumLab({ lab, topicTitle: selectedTopicDrawer.title });
                          }}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            backgroundColor: isDone ? 'var(--bg-surface)' : 'var(--brand-primary)',
                            color: isDone ? 'var(--text-primary)' : '#000000',
                            border: isDone ? '1px solid var(--border-subtle)' : 'none',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <FlaskConical size={15} />
                          <span>{isDone ? 'Re-run Lab' : 'Launch Simulation'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {selectedTopicDrawer.lessons.map((lesson, idx) => {
                    const isDone = (realProgress[selectedTopicDrawer.id]?.completedLessonIds || []).includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        style={{
                          backgroundColor: 'var(--bg-surface-subdued)',
                          borderRadius: '14px',
                          border: '1px solid var(--border-subtle)',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                backgroundColor: 'var(--bg-canvas)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                color: '#3B82F6',
                              }}
                            >
                              Lesson #{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {lesson.durationMinutes} mins • Verified YouTube Resource
                            </span>
                            {isDone && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                  color: '#3B82F6',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Check size={12} />
                                Completed (+50 XP)
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                            {lesson.title}
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 4px', lineHeight: 1.4 }}>
                            {lesson.learningObjectives?.join(' • ') || lesson.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveVideoLesson({
                                lesson,
                                topicTitle: selectedTopicDrawer.title,
                                topicId: selectedTopicDrawer.id,
                              });
                            }}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              backgroundColor: '#3B82F6',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Play size={14} />
                            <span>Watch</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO LESSON VIEWER MODAL */}
      {activeVideoLesson && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#3B82F6',
                  }}
                >
                  {activeVideoLesson.topicTitle} • Verified Video Lesson
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                  {activeVideoLesson.lesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoLesson(null)}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: '#000000' }}>
              <iframe
                title={activeVideoLesson.lesson.title}
                src={`https://www.youtube.com/embed/${activeVideoLesson.lesson.youtubeVideoId}?autoplay=1&rel=0`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Objectives & Mark as Complete */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  🎯 Core Learning Objective
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {activeVideoLesson.lesson.learningObjectives?.join(' • ') || activeVideoLesson.lesson.description}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Estimated Watch Time: {activeVideoLesson.lesson.durationMinutes} minutes
                </span>

                <button
                  type="button"
                  onClick={() => {
                    saveLearnerLessonCompletion(
                      currentUserId,
                      activeVideoLesson.topicId,
                      activeVideoLesson.lesson.id
                    );
                    db.awardXp(currentUserId, 50, `Completed Lesson: ${activeVideoLesson.lesson.title}`);
                    setRefreshSeed((s) => s + 1);
                    setActiveVideoLesson(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#000000',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} />
                  <span>Mark Completed & Earn 50 XP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
