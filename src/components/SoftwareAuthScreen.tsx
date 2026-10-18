import React, { useState } from 'react';
import { ShieldCheck, GraduationCap, Users, School, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { MascotSphere } from './MascotSphere';

interface SoftwareAuthScreenProps {
  onLogin: (userId: string, role: string) => void;
  users: Array<{ id: string; name: string; role: string; badge: string }>;
}

export const SoftwareAuthScreen: React.FC<SoftwareAuthScreenProps> = ({ onLogin, users }) => {
  const [selectedRole, setSelectedRole] = useState<'learner' | 'teacher' | 'institution_admin'>('learner');
  const [email, setEmail] = useState('pavan.kumar@geniusphere.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [institution, setInstitution] = useState('Delhi Public Technical School (DPTS)');
  const [rememberMe, setRememberMe] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);

  const handleRoleChange = (role: 'learner' | 'teacher' | 'institution_admin') => {
    setSelectedRole(role);
    if (role === 'learner') {
      setEmail('pavan.kumar@geniusphere.edu');
    } else if (role === 'teacher') {
      setEmail('dr.sharma@dpts.edu');
    } else {
      setEmail('principal.verma@dpts.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthInProgress(true);

    setTimeout(() => {
      let targetUser = users.find((u) => u.role === selectedRole);
      if (!targetUser) {
        targetUser = users[0];
      }
      onLogin(targetUser.id, targetUser.role);
    }, 450);
  };

  const handleQuickLaunch = (userId: string) => {
    const user = users.find((u) => u.id === userId) || users[0];
    setAuthInProgress(true);
    setTimeout(() => {
      onLogin(user.id, user.role);
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '36px 20px 24px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top Software Suite Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#43A85B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(67, 168, 91, 0.25)',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#26352A',
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Geniusphere
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6A7D70', fontWeight: 600 }}>
              Educational Software Suite • Production Release
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#E5F0DF',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#26352A',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#43A85B' }} />
          <span>Institutional Cloud Online</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          border: '1px solid #E5F0DF',
          boxShadow: '0 16px 40px rgba(38, 53, 42, 0.06)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          overflow: 'hidden',
          margin: '32px 0',
        }}
      >
        {/* Left Welcome Panel with Animated Mascot */}
        <div
          style={{
            backgroundColor: '#F3F8F0',
            padding: '44px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #E5F0DF',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: '#D9F477',
                color: '#26352A',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={13} color="#26352A" /> Single Sign-On Ready
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#26352A',
                fontFamily: 'Space Grotesk, sans-serif',
                lineHeight: 1.2,
              }}
            >
              Sign In to Your Workspace
            </h2>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '0.88rem',
                color: '#556D5C',
                lineHeight: 1.45,
              }}
            >
              Access curriculum courses, interactive coding sandboxes, gradebooks, and cryptographically verified credentials.
            </p>
          </div>

          {/* Centered Mascot with Welcome Greeting */}
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <MascotSphere
              expression={selectedRole === 'teacher' ? 'teaching' : 'happy'}
              size={135}
              speechBubble={
                selectedRole === 'teacher'
                  ? 'Welcome back, Educator! Your class roster is ready.'
                  : 'Welcome to Geniusphere! Ready to learn?'
              }
            />
          </div>

          {/* Quick Workstation Launchers */}
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#6A7D70',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              Instant Workstation Access:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLaunch('user-student-1')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: '1px solid #DCEADA',
                  backgroundColor: '#FFFFFF',
                  color: '#26352A',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5F0DF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <GraduationCap size={16} color="#43A85B" />
                <div>
                  <div>Pavan Kumar</div>
                  <div style={{ fontSize: '0.68rem', color: '#6A7D70', fontWeight: 500 }}>Student Portal</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLaunch('user-teacher-1')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: '1px solid #DCEADA',
                  backgroundColor: '#FFFFFF',
                  color: '#26352A',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5F0DF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <Users size={16} color="#43A85B" />
                <div>
                  <div>Dr. Sharma</div>
                  <div style={{ fontSize: '0.68rem', color: '#6A7D70', fontWeight: 500 }}>Teacher Portal</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '44px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Role Tab Selector */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#26352A', marginBottom: '8px' }}>
              Select Portal Role:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '6px',
                backgroundColor: '#FAFAF4',
                padding: '4px',
                borderRadius: '14px',
                border: '1px solid #E5F0DF',
              }}
            >
              <button
                type="button"
                onClick={() => handleRoleChange('learner')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selectedRole === 'learner' ? '#FFFFFF' : 'transparent',
                  color: '#26352A',
                  fontWeight: selectedRole === 'learner' ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'learner' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <GraduationCap size={14} color={selectedRole === 'learner' ? '#43A85B' : '#6A7D70'} />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selectedRole === 'teacher' ? '#FFFFFF' : 'transparent',
                  color: '#26352A',
                  fontWeight: selectedRole === 'teacher' ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'teacher' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Users size={14} color={selectedRole === 'teacher' ? '#43A85B' : '#6A7D70'} />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('institution_admin')}
                style={{
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selectedRole === 'institution_admin' ? '#FFFFFF' : 'transparent',
                  color: '#26352A',
                  fontWeight: selectedRole === 'institution_admin' ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'institution_admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <School size={14} color={selectedRole === 'institution_admin' ? '#43A85B' : '#6A7D70'} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#26352A', marginBottom: '6px' }}>
                Institutional Email:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5F0DF',
                  backgroundColor: '#FAFAF4',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#26352A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#26352A', marginBottom: '6px' }}>
                Password / Secure Passkey:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #E5F0DF',
                    backgroundColor: '#FAFAF4',
                    fontSize: '0.88rem',
                    color: '#26352A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Lock size={16} color="#A3B8A8" style={{ position: 'absolute', right: '14px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#26352A', marginBottom: '6px' }}>
                Institution:
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5F0DF',
                  backgroundColor: '#FAFAF4',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#26352A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="Delhi Public Technical School (DPTS)">Delhi Public Technical School (DPTS)</option>
                <option value="PES University (PESU)">PES University (PESU)</option>
                <option value="Global Independent Learners Network">Global Independent Learners Network</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#556D5C' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#43A85B', width: '16px', height: '16px' }}
                />
                <span>Remember session on this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={authInProgress}
              style={{
                marginTop: '10px',
                padding: '13px 24px',
                backgroundColor: '#43A85B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '100px',
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: authInProgress ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(67, 168, 91, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              {authInProgress ? (
                <span>Authenticating Workspace...</span>
              ) : (
                <>
                  <span>Launch {selectedRole === 'teacher' ? 'Teacher Portal' : 'Student Workspace'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Software Footnote */}
      <div style={{ textAlign: 'center', fontSize: '0.76rem', color: '#6A7D70' }}>
        <span>© 2026 Geniusphere Official Suite. Local-First Engine • Cryptographic Verifiable Storage.</span>
      </div>
    </div>
  );
};
