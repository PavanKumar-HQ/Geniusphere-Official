import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'getstarted';
  onClose: () => void;
  onAuthenticate: (userId: string, role: string) => void;
  users: Array<{ id: string; name: string; role: string; badge: string }>;
  currentUserId: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onAuthenticate,
  users,
  currentUserId,
}) => {
  const [mode, setMode] = useState<'signin' | 'getstarted'>(initialMode);
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUserId);
  const [onboardingRole, setOnboardingRole] = useState<'student' | 'teacher'>('student');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.id === selectedUserId);
    if (user) {
      onAuthenticate(user.id, user.role);
      onClose();
    }
  };

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (onboardingRole === 'student') {
      // Direct student to student-dashboard / classroom enrollment
      const studentUser = users.find((u) => u.role === 'learner') || users[0];
      onAuthenticate(studentUser.id, 'learner');
      onClose();
    } else {
      // Direct teacher to teacher workspace
      const teacherUser = users.find((u) => u.role === 'teacher') || users[1];
      onAuthenticate(teacherUser.id, 'teacher');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {mode === 'signin' ? 'Sign In to Geniusphere' : 'Get Started with Geniusphere'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Evidence-Backed Education Platform
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', minHeight: 'auto' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-canvas)', padding: '4px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{
              flex: 1,
              height: '36px',
              borderRadius: '6px',
              backgroundColor: mode === 'signin' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'signin' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontWeight: mode === 'signin' ? 700 : 500,
              boxShadow: mode === 'signin' ? 'var(--shadow-xs)' : 'none',
              fontSize: '0.88rem',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('getstarted')}
            style={{
              flex: 1,
              height: '36px',
              borderRadius: '6px',
              backgroundColor: mode === 'getstarted' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'getstarted' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontWeight: mode === 'getstarted' ? 700 : 500,
              boxShadow: mode === 'getstarted' ? 'var(--shadow-xs)' : 'none',
              fontSize: '0.88rem',
            }}
          >
            Get Started
          </button>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Select User Profile
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {users.map((u) => (
                  <label
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: selectedUserId === u.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-strong)',
                      backgroundColor: selectedUserId === u.id ? 'var(--brand-surface)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="auth_user"
                        value={u.id}
                        checked={selectedUserId === u.id}
                        onChange={() => setSelectedUserId(u.id)}
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          User ID: <code>{u.id}</code>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${u.role === 'teacher' ? 'badge-accent' : u.role === 'institution_admin' || u.role === 'superadmin' ? 'badge-danger' : 'badge-brand'}`}>
                      {u.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ height: '44px', width: '100%', marginTop: '8px' }}
            >
              <Lock size={16} />
              <span>Continue to Workspace</span>
            </button>
          </form>
        ) : (
          /* GET STARTED ONBOARDING FORM */
          <form onSubmit={handleGetStarted} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                How do you plan to use Geniusphere?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setOnboardingRole('student')}
                  style={{
                    flexDirection: 'column',
                    padding: '16px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: onboardingRole === 'student' ? '2px solid var(--brand-primary)' : '1px solid var(--border-strong)',
                    backgroundColor: onboardingRole === 'student' ? 'var(--brand-surface)' : 'var(--bg-surface)',
                    textAlign: 'center',
                    gap: '6px',
                  }}
                >
                  <UserIcon size={22} style={{ color: onboardingRole === 'student' ? 'var(--brand-primary)' : 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Learn & Build Portfolio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingRole('teacher')}
                  style={{
                    flexDirection: 'column',
                    padding: '16px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: onboardingRole === 'teacher' ? '2px solid var(--brand-accent)' : '1px solid var(--border-strong)',
                    backgroundColor: onboardingRole === 'teacher' ? 'var(--brand-accent-surface)' : 'var(--bg-surface)',
                    textAlign: 'center',
                    gap: '6px',
                  }}
                >
                  <GraduationCap size={22} style={{ color: onboardingRole === 'teacher' ? 'var(--brand-accent)' : 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teacher</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Classrooms & Join Codes</span>
                </button>
              </div>
            </div>

            {onboardingRole === 'student' ? (
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Enrolling in a Classroom:
                </strong>
                Students can join school cohorts using an 8-character cryptographic join code provided by their teacher inside their personal learning dashboard.
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Educator Onboarding:
                </strong>
                Teachers can create classrooms, generate 14-day cryptographic join codes, distribute curriculum assignments, and manage student submissions.
              </div>
            )}

            <button
              type="submit"
              className={onboardingRole === 'teacher' ? 'btn-accent' : 'btn-primary'}
              style={{ height: '44px', width: '100%' }}
            >
              <span>{onboardingRole === 'student' ? 'Launch Student Workspace' : 'Launch Teacher Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
