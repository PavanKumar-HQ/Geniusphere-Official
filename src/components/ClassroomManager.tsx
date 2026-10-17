import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { KeyRound, CheckCircle2, AlertCircle, Calendar, RefreshCw, Ban, PlusCircle } from 'lucide-react';

interface ClassroomManagerProps {
  db: InMemoryDatabase;
  currentUserId: string;
  isTeacher: boolean;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({ db, currentUserId, isTeacher }) => {
  const [joinCode, setJoinCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New classroom modal for teachers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Classrooms list refreshed on actions
  const classrooms = useMemo(() => {
    void refreshTrigger;
    return db.getClassrooms(currentUserId);
  }, [db, currentUserId, refreshTrigger]);

  const handleJoinClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const res = db.validateAndJoinClassroom(currentUserId, joinCode);
      setFeedback({
        type: 'success',
        message: `Successfully enrolled in "${res.classroom.name}"!`,
      });
      setJoinCode('');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to join classroom' });
    }
  };

  const handleRegenerateCode = (classroomId: string) => {
    try {
      const updated = db.generateClassroomJoinCode(currentUserId, classroomId, 14);
      setFeedback({
        type: 'success',
        message: `New cryptographic join code generated: ${updated.join_code} (Valid for 14 days)`,
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRevokeCode = (classroomId: string) => {
    try {
      db.revokeClassroomJoinCode(currentUserId, classroomId);
      setFeedback({
        type: 'success',
        message: 'Classroom join code revoked. New student enrollments are now disabled for this code.',
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const created = db.createClassroom(currentUserId, {
        organization_id: 'org-school-1',
        teacher_id: currentUserId,
        name: newClassName.trim(),
        join_code: `SEC${Math.floor(1000 + Math.random() * 9000)}`,
        join_code_expires_at: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
        is_active: true,
      });

      setFeedback({
        type: 'success',
        message: `Classroom "${created.name}" created with join code ${created.join_code}!`,
      });
      setShowCreateModal(false);
      setNewClassName('');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Student: Join with Code */}
      {!isTeacher && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <KeyRound size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Join Classroom with Invite Code</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '14px' }}>
            Enter the 8-character code provided by your educator to access your institution's cohort, assignments, and gradebook.
          </p>

          <form onSubmit={handleJoinClassroom} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. SEC2026A"
              style={{
                flex: '1 1 200px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>
              Join Classroom
            </button>
          </form>

          {feedback && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: feedback.type === 'success' ? 'var(--success-text)' : 'var(--danger-text)',
                border: `1px solid ${feedback.type === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}`,
                fontSize: '0.85rem',
              }}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Teacher Actions Bar */}
      {isTeacher && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Classroom & Join Code Administration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Manage active student access codes and cryptographic expiration windows.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{ height: '38px', padding: '0 14px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} /> New Classroom
          </button>
        </div>
      )}

      {/* Classrooms List */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>
          {isTeacher ? 'Managed Classrooms' : 'Your Enrolled Classrooms'}
        </h3>
        {classrooms.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            {isTeacher ? 'No classrooms configured.' : 'You are not enrolled in any classrooms yet.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {classrooms.map((cls) => {
              const org = db.organizations.get(cls.organization_id);
              const teacher = db.users.get(cls.teacher_id);
              const isExpired = new Date(cls.join_code_expires_at).getTime() < Date.now();

              // Count students enrolled
              let enrolledCount = 0;
              for (const enr of db.enrollments.values()) {
                if (enr.classroom_id === cls.id) enrolledCount++;
              }

              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subdued)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-brand">{org?.name || 'School'}</span>
                      <span className={`badge ${isExpired ? 'badge-danger' : 'badge-neutral'}`}>
                        <KeyRound size={12} /> {cls.join_code} {isExpired ? '(Expired)' : ''}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{cls.name}</h4>

                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Teacher: <strong>{teacher?.full_name || 'Assigned Educator'}</strong></div>
                      <div>Enrolled Students: <strong>{enrolledCount}</strong></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> Code Expiration: {new Date(cls.join_code_expires_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {isTeacher && (
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleRegenerateCode(cls.id)}
                        style={{ flex: 1, height: '34px', fontSize: '0.78rem' }}
                        title="Generate fresh cryptographic join code"
                      >
                        <RefreshCw size={13} /> Regenerate
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleRevokeCode(cls.id)}
                        disabled={isExpired}
                        style={{ height: '34px', padding: '0 10px', fontSize: '0.78rem' }}
                        title="Instantly revoke join code"
                      >
                        <Ban size={13} /> Revoke
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Classroom */}
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
          <div className="card-elevated" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Create New Classroom</h3>
            <form onSubmit={handleCreateClassroom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Classroom Name
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Advanced Cybersecurity Cohort B"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
