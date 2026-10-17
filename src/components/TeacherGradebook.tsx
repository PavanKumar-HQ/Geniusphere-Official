import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Assignment, Submission, User } from '../types';
import { Users, BookOpen, Award, CheckCircle2, PlusCircle } from 'lucide-react';

interface TeacherGradebookProps {
  db: InMemoryDatabase;
  teacherId: string;
}

export const TeacherGradebook: React.FC<TeacherGradebookProps> = ({ db, teacherId }) => {
  const teacherClassrooms = db.getClassrooms(teacherId);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    teacherClassrooms[0]?.id || ''
  );

  const [newDueDate, setNewDueDate] = useState<string>(
    new Date(Date.now() + 7 * 86400 * 1000).toISOString().split('T')[0]
  );
  const [newMaxAttempts, setNewMaxAttempts] = useState<number>(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedClass = teacherClassrooms.find((c) => c.id === selectedClassId);

  // Get assignments in selected class
  const classAssignments: Assignment[] = [];
  if (selectedClassId) {
    for (const a of db.assignments.values()) {
      if (a.classroom_id === selectedClassId) {
        classAssignments.push(a);
      }
    }
  }

  // Get enrolled students
  const enrolledStudents: User[] = [];
  if (selectedClassId) {
    for (const enr of db.enrollments.values()) {
      if (enr.classroom_id === selectedClassId) {
        const student = db.users.get(enr.student_id);
        if (student) enrolledStudents.push(student);
      }
    }
  }

  // Submissions for assignments in this classroom
  const submissions: Submission[] = [];
  for (const a of classAssignments) {
    const subs = db.getSubmissions(teacherId, a.id);
    submissions.push(...subs);
  }

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    try {
      db.createAssignment(teacherId, {
        classroom_id: selectedClassId,
        lab_id: 'lab-sec-101',
        due_date: new Date(newDueDate).toISOString(),
        max_score: 100,
        max_attempts: newMaxAttempts,
      });

      db.logAuditEvent({
        organization_id: selectedClass?.organization_id || 'org-school-1',
        actor_id: teacherId,
        action_type: 'ASSIGNMENT_CREATED',
        resource_type: 'classroom',
        resource_id: selectedClassId,
        ip_address: null,
        user_agent: null,
        details: { lab_id: 'lab-sec-101', max_attempts: newMaxAttempts },
      });

      setActionMessage('New assignment published successfully!');
      setShowCreateModal(false);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Teacher Gradebook & Classroom Roster</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Authoritative institutional view with database-enforced classroom isolation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="class-select" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Active Classroom:
          </label>
          <select
            id="class-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-surface)',
              fontWeight: 500,
            }}
          >
            {teacherClassrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.join_code})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div style={{
          backgroundColor: actionMessage.startsWith('Error') ? 'var(--danger-bg)' : 'var(--success-bg)',
          color: actionMessage.startsWith('Error') ? 'var(--danger-text)' : 'var(--success-text)',
          border: `1px solid ${actionMessage.startsWith('Error') ? 'var(--danger-border)' : 'var(--success-border)'}`,
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          {actionMessage}
        </div>
      )}

      {/* Classroom Metrics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="var(--brand-primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enrolled Students</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{enrolledStudents.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={22} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Assignments</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{classAssignments.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluated Submissions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{submissions.length}</div>
          </div>
        </div>
      </div>

      {/* Roster & Gradebook Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Student Performance & Submissions</h3>
        {enrolledStudents.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            No students enrolled in this classroom yet. Share join code <strong>{selectedClass?.join_code}</strong>.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subdued)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Student</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Email</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Lab Status</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Attempts</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Server Score</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Integrity Hash</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student) => {
                  const studentSubs = submissions.filter((s) => s.student_id === student.id);
                  const latestSub = studentSubs[studentSubs.length - 1];

                  return (
                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{student.full_name}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {student.email}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {latestSub ? (
                          latestSub.passed ? (
                            <span className="badge badge-success">
                              <CheckCircle2 size={12} /> PASSED
                            </span>
                          ) : (
                            <span className="badge badge-warning">IN PROGRESS</span>
                          )
                        ) : (
                          <span className="badge badge-neutral">NOT STARTED</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                        {studentSubs.length > 0 ? `${studentSubs.length} / 10` : '0'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                        {latestSub ? (
                          <span style={{ color: latestSub.passed ? 'var(--success)' : 'var(--text-primary)' }}>
                            {latestSub.score} / 100
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {latestSub ? latestSub.submission_hash.substring(0, 16) + '...' : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Assignment */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000,
        }}>
          <div className="card-elevated" style={{ width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Create Lab Assignment</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Select Lab
                </label>
                <input
                  type="text"
                  disabled
                  value="Lab 101: SQL Parameterization & Injection Defense"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-surface-subdued)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Maximum Allowed Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newMaxAttempts}
                  onChange={(e) => setNewMaxAttempts(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
