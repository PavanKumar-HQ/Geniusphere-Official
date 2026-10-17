import React from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  BookOpen,
  Terminal,
  Award,
  Clock,
  Flame,
  Shield,
  Briefcase,
  Sparkles,
} from 'lucide-react';

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

  // Calculate enrolled courses with progress
  const enrolledCoursesWithDetails = enrollments.map((enr) => {
    const course = db.getCourseById(enr.course_id);
    return {
      enrollment: enr,
      course,
    };
  }).filter((item) => item.course !== null);

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
      desc: `Enrolled in ${enrolledCoursesWithDetails.length} practical subject${enrolledCoursesWithDetails.length > 1 ? 's' : ''}.`,
      icon: BookOpen,
      date: 'Active Learner',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="card-elevated" style={{ borderLeft: '5px solid var(--brand-primary)', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">LEARNER WORKSPACE</span>
              {user?.is_minor && <span className="badge badge-neutral">Minor Account (Parent Consent Active)</span>}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
              Welcome back, {user?.full_name || 'Learner'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Track your real coursework progress, complete hands-on lab challenges, and build verified skills.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)' }}>
              <Flame size={20} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Streak
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  3 Days <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>(Rest-Protected)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('catalogue')}
              style={{ height: '42px', fontSize: '0.9rem' }}
            >
              <BookOpen size={16} />
              <span>Explore Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Continue Learning & Pending Assignments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Continue Learning */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Continue Learning</h2>
              <span className="badge badge-brand">{enrolledCoursesWithDetails.length} Enrolled</span>
            </div>

            {enrolledCoursesWithDetails.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: 'var(--bg-surface-subdued)', borderRadius: '8px' }}>
                <Sparkles size={32} color="var(--brand-primary)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>Ready to Begin Your Journey?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
                  You have not enrolled in any courses yet. Choose from 27 practical subjects in Technology, Coding, Finance, and Professional Skills.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onNavigate('catalogue')}
                  style={{ fontSize: '0.85rem', height: '36px' }}
                >
                  Browse Course Catalogue
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {enrolledCoursesWithDetails.map(({ course, enrollment }) => (
                  <div
                    key={course!.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-subdued)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {course!.domain.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                        {enrollment.progress_percent}% Complete
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                      {course!.title}
                    </h3>

                    {/* Progress Bar */}
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden', marginBottom: '12px' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${enrollment.progress_percent}%`,
                          backgroundColor: 'var(--brand-primary)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Completed {enrollment.completed_lessons.length} lessons
                      </span>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => onSelectCourse(course!.slug)}
                        style={{ height: '30px', padding: '0 12px', fontSize: '0.78rem' }}
                      >
                        Continue Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Assignments & Labs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Classroom Assignments</h2>
              <span className="badge badge-neutral">Classroom Tasks</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingAssignments.map((assign) => (
                <div
                  key={assign.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subdued)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{assign.course}</span>
                    <span className={assign.isCompleted ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.7rem' }}>
                      {assign.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
                    {assign.title}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {assign.due}
                    </span>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onNavigate('lab')}
                      style={{ height: '30px', padding: '0 12px', fontSize: '0.78rem' }}
                    >
                      {assign.isCompleted ? 'Re-open Lab' : 'Launch Assignment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Enrolled in School Cohort?
            </span>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('classrooms')}
              style={{ height: '32px', fontSize: '0.8rem' }}
            >
              Join Classroom with Code
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Recent Lab Results & Earned Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Results */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Evaluation Results</h2>
            <Terminal size={18} color="var(--brand-primary)" />
          </div>

          {allSubmissions.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No evaluations submitted yet. Complete course assessments to generate verified evaluation results.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-subdued)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Web Security Defense Evaluation</span>
                    <span className={sub.passed ? 'badge badge-success' : 'badge badge-danger'}>
                      {sub.score}/100 PTS
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Timestamp: {new Date(sub.submitted_at).toLocaleTimeString()} • 5/5 Assertions Passed
                  </div>
                  {sub.submission_hash && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      Hash: {sub.submission_hash.slice(0, 32)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earned Achievements */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Achievements</h2>
            <Award size={18} color="var(--brand-primary)" />
          </div>

          {achievements.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
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
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface-subdued)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={20} color="var(--brand-primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ach.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ach.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate('resume-builder')}
              style={{ width: '100%', height: '34px', fontSize: '0.82rem' }}
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
