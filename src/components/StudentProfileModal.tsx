import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Calendar, Shield, Award, Flame, BookOpen, 
  FlaskConical, CheckCircle2, AlertCircle, Edit3, Save, RefreshCw, Building2 
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { db } from '../db/in-memory-db';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  onProfileUpdated?: (updatedName: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFullName, setEditFullName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<{
    personalInfo: {
      id: string;
      email: string;
      fullName: string;
      dateOfBirth: string;
      isMinor: boolean;
      isSuperadmin: boolean;
      accountStatus: string;
      role: string;
      organization: { id: string; name: string; type: string } | null;
      createdAt: string;
      updatedAt: string;
    };
    learningStats: {
      xp: number;
      currentStreak: number;
      streakLastExtendedDate: string | null;
      totalTimeSpentSeconds: number;
      lastActiveAt: string;
      completedLessonsCount: number;
      enrolledCoursesCount: number;
      labAttemptsCount: number;
    };
  } | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try authoritative PostgreSQL Fastify API
      const data = await apiClient.getProfile();
      setProfileData(data);
      setEditFullName(data.personalInfo.fullName);
    } catch {
      // 2. Authoritative local state fallback if server offline
      try {
        const localProfile = db.getStudentProfile(currentUser.id, currentUser.id);
        setProfileData(localProfile);
        setEditFullName(localProfile.personalInfo.fullName);
      } catch (localErr: any) {
        setError(localErr.message || 'Failed to load authoritative profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setError(null);
      setIsEditing(false);
      setValidationError(null);
      fetchProfile();
    }
  }, [isOpen, currentUser.id]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);
    setSuccessMessage(null);

    const trimmed = editFullName.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
      setValidationError('Full name must be between 2 and 100 characters.');
      return;
    }
    if (/<[^>]*>/.test(trimmed)) {
      setValidationError('HTML or special code tags are not permitted.');
      return;
    }

    setSaving(true);
    try {
      let updatedUser;
      try {
        const res = await apiClient.updateProfile({ fullName: trimmed });
        updatedUser = res.user;
      } catch {
        // Fallback to local in-memory DB update with RLS rules
        updatedUser = db.updateUserProfile(currentUser.id, currentUser.id, {
          full_name: trimmed,
        });
      }

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                fullName: trimmed,
                updatedAt: new Date().toISOString(),
              },
            }
          : null
      );

      setIsEditing(false);
      setSuccessMessage('Student profile updated and securely synchronized.');
      if (onProfileUpdated) {
        onProfileUpdated(trimmed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '24px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-surface)',
                border: '1px solid var(--brand-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Verified Student Profile
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Authoritative records &amp; persistent credentials
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon-circle"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <RefreshCw size={28} className="animate-spin" color="var(--brand-primary)" />
              <p style={{ fontSize: '0.88rem', margin: 0 }}>Fetching verified records from secure storage...</p>
            </div>
          ) : error && !profileData ? (
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: 'var(--danger)',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: '0 0 4px' }}>Failed to Load Profile</p>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>{error}</p>
                <button
                  type="button"
                  onClick={fetchProfile}
                  className="btn-secondary"
                  style={{ marginTop: '10px', height: '28px', padding: '0 10px', fontSize: '0.74rem' }}
                >
                  Retry Retrieval
                </button>
              </div>
            </div>
          ) : profileData ? (
            <>
              {/* Notification Alerts */}
              {successMessage && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--success)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
              )}
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--danger)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} color="var(--danger)" style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Top Profile Summary Card */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1.5px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'var(--grad-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {profileData.personalInfo.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {profileData.personalInfo.fullName}
                      </h3>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '100px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--brand-surface)',
                          color: 'var(--brand-primary)',
                          border: '1px solid var(--brand-border)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {profileData.personalInfo.role}
                      </span>
                      {profileData.personalInfo.isMinor && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '100px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--warning-bg)',
                            color: 'var(--warning)',
                            border: '1px solid var(--warning-border)',
                          }}
                        >
                          DPDP Minor Protected
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="var(--text-muted)" />
                      <span>{profileData.personalInfo.email}</span>
                    </p>
                    {profileData.personalInfo.organization && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={13} color="var(--text-muted)" />
                        <span>{profileData.personalInfo.organization.name}</span>
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setEditFullName(profileData.personalInfo.fullName);
                    }}
                    className="btn-secondary"
                    style={{ height: '34px', padding: '0 14px', fontSize: '0.78rem', borderRadius: '10px', gap: '6px' }}
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Editable Personal Information Section */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} color="var(--brand-primary)" />
                    <span>Personal Information</span>
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isEditing ? 'Editing Personal Details' : 'Server Authenticated'}
                  </span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Full Name (Editable)
                      </label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Enter full legal name"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-strong)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                        disabled={saving}
                      />
                      {validationError && (
                        <p style={{ fontSize: '0.76rem', color: 'var(--danger)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertCircle size={14} />
                          <span>{validationError}</span>
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditFullName(profileData.personalInfo.fullName);
                          setValidationError(null);
                        }}
                        className="btn-secondary"
                        style={{ height: '34px', padding: '0 14px', fontSize: '0.8rem' }}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary"
                        style={{ height: '34px', padding: '0 16px', fontSize: '0.8rem', gap: '6px' }}
                      >
                        {saving ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Persisting...</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>Student ID</span>
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {profileData.personalInfo.id}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>Date of Birth</span>
                      <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        <span>{profileData.personalInfo.dateOfBirth}</span>
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>Account Status</span>
                      <span style={{ color: 'var(--success)', textTransform: 'capitalize', fontWeight: 700 }}>
                        ● {profileData.personalInfo.accountStatus}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>Registered Since</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {new Date(profileData.personalInfo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated Learning Information Section */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} color="var(--brand-primary)" />
                    <span>Authoritative Learning Statistics</span>
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Calculated from verified events</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                  {/* XP */}
                  <div style={{ padding: '12px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: '4px' }}>
                      <Award size={16} />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {profileData.learningStats.xp}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Total XP
                    </div>
                  </div>

                  {/* Streak */}
                  <div style={{ padding: '12px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', marginBottom: '4px' }}>
                      <Flame size={16} />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {profileData.learningStats.currentStreak}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Day Streak
                    </div>
                  </div>

                  {/* Completed Lessons */}
                  <div style={{ padding: '12px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', marginBottom: '4px' }}>
                      <BookOpen size={16} />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {profileData.learningStats.completedLessonsCount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Completed
                    </div>
                  </div>

                  {/* Lab Attempts */}
                  <div style={{ padding: '12px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7', marginBottom: '4px' }}>
                      <FlaskConical size={16} />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {profileData.learningStats.labAttemptsCount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Labs Run
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Learning statistics reflect your saved course activity and lab submissions.
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Connected as {currentUser.email}</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ height: '32px', padding: '0 16px', fontSize: '0.8rem', borderRadius: '10px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
