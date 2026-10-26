import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import { CourseCardIllustrated } from './CourseCardIllustrated';
import {
  BookOpen,
  Award,
  Clock,
  Flame,
  Shield,
  CheckCircle2,
  ListTodo,
  Play,
  FlaskConical,
  X,
  ExternalLink,
  Video,
  Check,
  Calendar,
  ArrowRight,
  GraduationCap,
  Layers,
  ChevronRight,
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
  const [isCrackersActive, setIsCrackersActive] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [activeCurriculumLab, setActiveCurriculumLab] = useState<{ lab: SimulationLab; topicTitle: string } | null>(null);
  const [selectedCurriculumCategory, setSelectedCurriculumCategory] = useState<'all' | 'technology' | 'finance' | 'professional'>('all');
  const [selectedTopicDrawer, setSelectedTopicDrawer] = useState<TopicSpecification | null>(null);
  const [activeTopicDrawerTab, setActiveTopicDrawerTab] = useState<'labs' | 'lessons'>('labs');
  const [activeVideoLesson, setActiveVideoLesson] = useState<{ lesson: VideoLesson; topicTitle: string; topicId: string } | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  // Authoritative Date & Time Engine for Real Streak Tracking
  const now = useMemo(() => new Date(), [refreshSeed]);
  const todayDateStr = useMemo(() => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, [now]);

  const yesterdayDateStr = useMemo(() => {
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    return `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  }, [now]);

  const streakStorageKey = `geniusphere_streak_claim_${currentUserId}`;

  // Read persisted check-in records from storage
  const persistedClaim = useMemo(() => {
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
  const currentHour = now.getHours();
  const currentSlot: 'morning' | 'evening' = currentHour < 14 ? 'morning' : 'evening';
  const claimsToday = userProgress.last_streak_claim_date === todayDateStr
    ? (userProgress.streak_claims_today || 0)
    : 0;

  const isCurrentSlotClaimed = claimsToday >= 2 || (claimsToday === 1 && userProgress.last_streak_claim_session === currentSlot);
  const isClaimedToday = claimsToday >= 2;

  const realProgress = getLearnerProgress(currentUserId);
  const studyMetrics = backendEngine.tracker.getUserMetrics(currentUserId);

  // Authoritative streak days calculation based on date continuity:
  const effectiveStreakDays = useMemo(() => {
    const rawStreak = userProgress.streak_days || persistedClaim?.streakCount || studyMetrics.current_streak_days || 0;
    if (!lastActiveDate) return rawStreak > 0 ? rawStreak : 0;
    if (lastActiveDate === todayDateStr) {
      return Math.max(1, rawStreak);
    }
    if (lastActiveDate === yesterdayDateStr) {
      return Math.max(1, rawStreak);
    }
    return 0;
  }, [lastActiveDate, todayDateStr, yesterdayDateStr, userProgress.streak_days, persistedClaim, studyMetrics.current_streak_days]);

  const streakDays = effectiveStreakDays;

  const handleClaimDailyStreak = () => {
    if (isCurrentSlotClaimed) return;

    const result = db.claimDailyStreak(currentUserId);
    if (result.alreadyClaimedSlot) return;

    backendEngine.tracker.recordMilestone(
      currentUserId,
      'lesson_completed',
      'daily-streak-claim',
      `Daily Active Streak Check-In (${result.slot})`,
      300
    );

    backendEngine.notifications.dispatch(
      currentUserId,
      `Daily Streak (${result.nextStreak} Days, +${result.awardedXp} XP)!`,
      `Great consistency! Logged ${result.slot} session check-in on ${now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}.`,
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

  // Fallback courses for discovery if not enrolled
  const allCanonicalCourses = db.getCanonicalCourses();
  const highlightedCourses = enrolledCoursesWithDetails.length > 0
    ? enrolledCoursesWithDetails.slice(0, 3)
    : allCanonicalCourses.slice(0, 3).map((c) => ({
        course: c,
        enrollment: { progress_percent: 0, completed_lessons: [] } as any,
      }));

  // Primary Continue-Learning target course
  const primaryContinueItem = enrolledCoursesWithDetails.length > 0
    ? enrolledCoursesWithDetails[0]
    : {
        course: allCanonicalCourses[0] || null,
        enrollment: { progress_percent: 0, completed_lessons: [] } as any,
      };

  // Derive genuine classroom assignments for student
  const studentEnrollments = Array.from(db.enrollments.values()).filter(
    (ce) => ce.student_id === currentUserId
  );
  const enrolledClassroomIds = new Set(studentEnrollments.map((ce) => ce.classroom_id));
  const pendingAssignments = Array.from(db.assignments.values())
    .filter((a) => enrolledClassroomIds.has(a.classroom_id))
    .map((a) => {
      const isCompleted = allSubmissions.some((s) => s.assignment_id === a.id && s.passed);
      const lab = db.getLabById(a.lab_id);
      return {
        id: a.id,
        title: lab?.title || 'Classroom Assessment Lab',
        course: 'Cohort Lab Assignment',
        due: a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline',
        status: isCompleted ? 'Completed (Verified)' : 'Pending Submission',
        isCompleted,
        labSlug: lab?.slug || 'ai-classification-playground',
      };
    });

  const pendingAssignmentsCount = pendingAssignments.filter((a) => !a.isCompleted).length;

  // Calculate overall learning stage
  const hasStarted = (userProgress.completed_lessons?.length || 0) > 0;
  const hasLabAttempt = allSubmissions.length > 0;
  const hasCertificate = certificates.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ================================================================ */}
      {/* 1. COMPACT GREETING, PURPOSEFUL MASCOT & DAILY STREAK CHECK-IN  */}
      {/* ================================================================ */}
      <div
        className="card-elevated"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <MascotSphere
            pose={streakDays > 2 ? 'celebrating' : 'happy'}
            size={68}
            animated={true}
            interactive={true}
            speechBubble={isClaimedToday ? 'Streak locked in! Ready to learn?' : 'Click to check in for today!'}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--brand-primary)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                STUDENT SPACE
              </span>
              {user?.is_minor && (
                <span
                  style={{
                    backgroundColor: 'var(--bg-surface-subdued)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  Verified Student
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              Good morning, {user?.full_name?.split(' ')[0] || 'Learner'}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '3px 0 0' }}>
              {enrolledCoursesWithDetails.length > 0
                ? `You have ${enrolledCoursesWithDetails.length} active course${enrolledCoursesWithDetails.length > 1 ? 's' : ''}. Keep up your steady momentum.`
                : 'Welcome! Choose your first hands-on course to start learning.'}
            </p>
          </div>
        </div>

        {/* Daily Streak Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleClaimDailyStreak}
            disabled={isCurrentSlotClaimed}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '100px',
              backgroundColor: isCurrentSlotClaimed ? 'var(--bg-surface-subdued)' : 'var(--brand-quest, #F59E0B)',
              color: isCurrentSlotClaimed ? 'var(--text-primary)' : '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              cursor: isCurrentSlotClaimed ? 'default' : 'pointer',
              fontWeight: 800,
              fontSize: '0.84rem',
              boxShadow: isCurrentSlotClaimed ? 'none' : '0 2px 8px rgba(245, 158, 11, 0.25)',
              transition: 'all 0.15s ease',
            }}
            title={isCurrentSlotClaimed ? `${claimsToday}/2 daily sessions claimed` : `Claim ${currentSlot} session streak check-in`}
          >
            <Flame size={18} color={isCurrentSlotClaimed ? 'var(--brand-primary)' : '#FFFFFF'} />
            <span>
              {streakDays} Day Streak {isCurrentSlotClaimed ? (claimsToday >= 2 ? '(2/2 Claimed ✓)' : `(${claimsToday}/2 ✓)`) : `(Claim ${currentSlot === 'morning' ? 'Morning' : 'Evening'} +25 XP)`}
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. ONE PROMINENT CONTINUE-LEARNING ACTION (HERO CARD)             */}
      {/* ================================================================ */}
      {primaryContinueItem.course && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 55%, #047857 100%)',
            borderRadius: '24px',
            padding: '28px 32px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Background Decoration */}
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '640px', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {enrolledCoursesWithDetails.length > 0 ? 'PICK UP WHERE YOU LEFT OFF' : 'RECOMMENDED STARTING TRACK'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 600 }}>
                {primaryContinueItem.course.domain.toUpperCase()}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 8px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {primaryContinueItem.course.title}
            </h2>

            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5, maxWidth: '540px' }}>
              {primaryContinueItem.course.summary}
            </p>

            {/* Real Progress Bar */}
            {primaryContinueItem.enrollment.progress_percent > 0 && (
              <div style={{ maxWidth: '380px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', color: '#94A3B8' }}>
                  <span>Course Progress</span>
                  <span style={{ color: '#34D399', fontWeight: 800 }}>{primaryContinueItem.enrollment.progress_percent}% Complete</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${primaryContinueItem.enrollment.progress_percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10B981, #34D399)',
                      borderRadius: '100px',
                      boxShadow: '0 0 10px rgba(52, 211, 153, 0.6)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1 }}>
            <button
              type="button"
              onClick={() => onSelectCourse(primaryContinueItem.course!.slug)}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '100px',
                padding: '14px 28px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
              <span>{primaryContinueItem.enrollment.progress_percent > 0 ? 'Resume Lesson' : 'Start Course'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. COMPACT PROGRESS SUMMARY BASED ON ACTUAL PERSISTED DATA       */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
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
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enrolled Tracks</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {enrolledCoursesWithDetails.length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
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
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Lessons</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {userProgress.completed_lessons?.length || 0}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FlaskConical size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lab Submissions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {allSubmissions.length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
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
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Certificates</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {certificates.length}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. CLEAR VISUAL LEARNING PATHWAY                                 */}
      {/* ================================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Your Learning Journey
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Structured, four-stage mastery flow based on verified progress
            </p>
          </div>
        </div>

        <div
          className="app-carousel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            {
              step: '1',
              title: 'Core Fundamentals',
              desc: 'Video lectures & concepts',
              active: true,
              done: hasStarted,
            },
            {
              step: '2',
              title: 'Hands-on Labs',
              desc: 'Parameter simulations & experiments',
              active: hasStarted,
              done: hasLabAttempt,
            },
            {
              step: '3',
              title: 'Knowledge Checks',
              desc: 'Interactive quizzes & asserts',
              active: hasLabAttempt,
              done: userProgress.completed_lessons?.length > 2,
            },
            {
              step: '4',
              title: 'Verified Credential',
              desc: 'Cryptographic SHA-256 certificate',
              active: userProgress.completed_lessons?.length > 2,
              done: hasCertificate,
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="app-carousel-item-compact"
              style={{
                backgroundColor: s.done ? 'var(--selected-bg, #E5F0DF)' : 'var(--bg-surface-subdued)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: s.done ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: s.done ? 'var(--brand-primary)' : '#FFFFFF',
                  color: s.done ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {s.done ? <Check size={14} /> : s.step}
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. SMALL SET OF ILLUSTRATED COURSE CARDS                         */}
      {/* ================================================================ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              {enrolledCoursesWithDetails.length > 0 ? 'Active Courses' : 'Featured Courses for You'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Explore hands-on curriculum with interactive labs and code execution
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('catalogue')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Courses</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div
          className="app-carousel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px',
          }}
        >
          {highlightedCourses.map(({ course, enrollment }) => (
            <div key={course!.id} className="app-carousel-item">
              <CourseCardIllustrated
                course={course!}
                progressPercent={enrollment?.progress_percent || 0}
                onSelectCourse={onSelectCourse}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 6. UPCOMING ASSIGNED SCHOOL SESSIONS & CLASSROOM HOMEWORK        */}
      {/* ================================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              School & Classroom Sessions
            </h2>
          </div>
          {pendingAssignmentsCount > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--brand-quest, #F59E0B)',
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '0.74rem',
                fontWeight: 800,
              }}
            >
              {pendingAssignmentsCount} Due
            </span>
          )}
        </div>

        {pendingAssignments.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface-subdued)',
              borderRadius: '14px',
              color: 'var(--text-secondary)',
              fontSize: '0.86rem',
            }}
          >
            All caught up! You have no pending homework or mandatory cohort labs assigned right now.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingAssignments.slice(0, 3).map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Due: {a.due} • {a.status}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('lab-workspace', a.labSlug)}
                  style={{
                    backgroundColor: a.isCompleted ? 'var(--bg-surface)' : 'var(--brand-primary)',
                    color: a.isCompleted ? 'var(--text-secondary)' : '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {a.isCompleted ? 'Review Lab' : 'Launch Lab'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 7. PRACTICAL CURRICULUM TOPICS & SIMULATION LABS EXPLORER        */}
      {/* ================================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1.5px solid var(--border-subtle)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--bg-surface-subdued)', color: 'var(--brand-primary)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              <span>17 Topics • 170 Lessons • 170 SVG Labs</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Interactive Curriculum Studio
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '4px 0 0' }}>
              Hands-on interactive simulations with live parameters, formula assertions, and video masterclasses.
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="mobile-pill-strip" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All 17 Topics' },
              { id: 'technology', label: 'Technology' },
              { id: 'finance', label: 'Finance' },
              { id: 'professional', label: 'Professional' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCurriculumCategory(cat.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedCurriculumCategory === cat.id ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedCurriculumCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                  color: selectedCurriculumCategory === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 17 Topic Matrix (Compact & Well-Proportioned) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '16px',
          }}
        >
          {ALL_CANONICAL_17_TOPICS.filter((t) =>
            selectedCurriculumCategory === 'all' ? true : t.category === selectedCurriculumCategory
          ).map((topic) => {
            const topicRecord = realProgress[topic.id];
            const pct = topicRecord?.percentComplete || 0;

            return (
              <div
                key={topic.id}
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      #{topic.canonicalIndex} • {topic.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      10 Labs
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {topic.summary}
                  </p>
                </div>

                <div>
                  {/* Progress Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span style={{ color: 'var(--brand-primary)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'var(--bg-canvas)', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicDrawer(topic);
                      setActiveTopicDrawerTab('labs');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Open 10 Labs & Lessons</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confetti celebration feedback */}
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
        onClaimDailyStreak={handleClaimDailyStreak}
      />

      {/* Curriculum Lab Runner Modal */}
      {activeCurriculumLab && (
        <CurriculumLabRunner
          lab={activeCurriculumLab.lab}
          topicTitle={activeCurriculumLab.topicTitle}
          currentUserId={currentUserId}
          onClose={() => setActiveCurriculumLab(null)}
          onLabCompleted={(_labId: string, _score: number) => {
            setRefreshSeed((s) => s + 1);
          }}
        />
      )}

      {/* Topic Drawer: 10 Lessons & 10 Labs Modal */}
      {selectedTopicDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
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
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                  Topic #{selectedTopicDrawer.canonicalIndex} • {selectedTopicDrawer.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {selectedTopicDrawer.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTopicDrawer(null)}
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Controls: 10 Interactive Labs vs 10 Video Lessons */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px' }}>
              <button
                type="button"
                onClick={() => setActiveTopicDrawerTab('labs')}
                style={{
                  padding: '12px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: activeTopicDrawerTab === 'labs' ? 'var(--brand-primary)' : 'var(--text-muted)',
                  borderBottom: activeTopicDrawerTab === 'labs' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                }}
              >
                10 Interactive SVG Labs
              </button>
              <button
                type="button"
                onClick={() => setActiveTopicDrawerTab('lessons')}
                style={{
                  padding: '12px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: activeTopicDrawerTab === 'lessons' ? 'var(--brand-primary)' : 'var(--text-muted)',
                  borderBottom: activeTopicDrawerTab === 'lessons' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                }}
              >
                10 Video Masterclasses
              </button>
            </div>

            {/* List */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTopicDrawerTab === 'labs'
                ? selectedTopicDrawer.labs.map((lab) => {
                    const isLabCompleted = realProgress[selectedTopicDrawer.id]?.completedLabIds?.includes(lab.id);
                    return (
                      <div
                        key={lab.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-surface-subdued)',
                          border: '1px solid var(--border-subtle)',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Lab #{lab.orderIndex}: {lab.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {lab.summary}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveCurriculumLab({ lab, topicTitle: selectedTopicDrawer.title });
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '100px',
                            backgroundColor: isLabCompleted ? 'var(--bg-surface)' : 'var(--brand-primary)',
                            color: isLabCompleted ? 'var(--text-primary)' : '#FFFFFF',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            flexShrink: 0,
                          }}
                        >
                          <Play size={12} fill={isLabCompleted ? 'var(--text-primary)' : '#FFFFFF'} />
                          <span>{isLabCompleted ? 'Review Lab' : 'Launch Simulation'}</span>
                        </button>
                      </div>
                    );
                  })
                : selectedTopicDrawer.lessons.map((lesson) => {
                    const isLessonDone = realProgress[selectedTopicDrawer.id]?.completedLessonIds?.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-surface-subdued)',
                          border: '1px solid var(--border-subtle)',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Lesson #{lesson.orderIndex}: {lesson.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {lesson.description} • {lesson.durationMinutes} mins
                          </div>
                        </div>

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
                            padding: '8px 16px',
                            borderRadius: '100px',
                            backgroundColor: isLessonDone ? 'var(--bg-surface)' : 'var(--brand-primary)',
                            color: isLessonDone ? 'var(--text-primary)' : '#FFFFFF',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            flexShrink: 0,
                          }}
                        >
                          <Video size={13} />
                          <span>{isLessonDone ? 'Rewatch' : 'Watch Lesson'}</span>
                        </button>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      )}

      {/* Video Lesson Modal */}
      {activeVideoLesson && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
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
              maxWidth: '880px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
            }}
          >
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
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                  {activeVideoLesson.topicTitle} • Video Lesson
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {activeVideoLesson.lesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoLesson(null)}
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

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

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Duration: {activeVideoLesson.lesson.durationMinutes} mins • {activeVideoLesson.lesson.channelTitle}
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
                  borderRadius: '100px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} />
                <span>Mark Completed (+50 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
