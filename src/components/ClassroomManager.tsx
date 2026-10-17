import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Classroom, ClassroomEnrollment } from '../types';
import { KeyRound, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface ClassroomManagerProps {
  db: InMemoryDatabase;
  currentUserId: string;
  isTeacher: boolean;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({ db, currentUserId, isTeacher }) => {
  const [joinCode, setJoinCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // If teacher, list all classrooms taught
  // If student, list all enrolled classrooms
  const classrooms = db.getClassrooms(currentUserId);

  const handleJoinClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanCode = joinCode.trim().toUpperCase();
    if (!cleanCode) return;

    // Search for classroom with active join code
    let foundClass: Classroom | null = null;
    for (const cls of db.classrooms.values()) {
      if (cls.join_code === cleanCode && cls.is_active) {
        foundClass = cls;
        break;
      }
    }

    if (!foundClass) {
      setFeedback({ type: 'error', message: 'Invalid or inactive classroom join code.' });
      return;
    }

    // Check expiration
    if (new Date(foundClass.join_code_expires_at).getTime() < Date.now()) {
      setFeedback({ type: 'error', message: 'This classroom join code has expired.' });
      return;
    }

    // Check existing enrollment
    for (const enr of db.enrollments.values()) {
      if (enr.classroom_id === foundClass.id && enr.student_id === currentUserId) {
        setFeedback({ type: 'error', message: 'You are already enrolled in this classroom.' });
        return;
      }
    }

    // Create new enrollment
    const newEnrollment: ClassroomEnrollment = {
      id: crypto.randomUUID(),
      classroom_id: foundClass.id,
      student_id: currentUserId,
      enrolled_at: new Date().toISOString(),
    };
    db.enrollments.set(newEnrollment.id, newEnrollment);

    db.logAuditEvent({
      organization_id: foundClass.organization_id,
      actor_id: currentUserId,
      action_type: 'CLASSROOM_ENROLLED',
      resource_type: 'classroom',
      resource_id: foundClass.id,
      ip_address: null,
      user_agent: null,
      details: { join_code: cleanCode },
    });

    setFeedback({
      type: 'success',
      message: `Enrolled in "${foundClass.name}" successfully!`,
    });
    setJoinCode('');
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {classrooms.map((cls) => {
              const org = db.organizations.get(cls.organization_id);
              const teacher = db.users.get(cls.teacher_id);

              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subdued)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-brand">{org?.name || 'School'}</span>
                    <span className="badge badge-neutral">
                      <KeyRound size={12} /> {cls.join_code}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem' }}>{cls.name}</h4>

                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Teacher: <strong>{teacher?.full_name || 'Assigned Educator'}</strong></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> Expires: {new Date(cls.join_code_expires_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
