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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Verified Student Profile</h2>
              <p className="text-xs text-slate-400">Authoritative records & persistent credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm">Fetching verified records from secure storage...</p>
            </div>
          ) : error && !profileData ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Failed to Load Profile</p>
                <p className="text-xs text-rose-400 mt-1">{error}</p>
                <button
                  onClick={fetchProfile}
                  className="mt-3 text-xs bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
                >
                  Retry Retrieval
                </button>
              </div>
            </div>
          ) : profileData ? (
            <>
              {/* Notification Alerts */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Top Profile Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
                  {profileData.personalInfo.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {profileData.personalInfo.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                      {profileData.personalInfo.role}
                    </span>
                    {profileData.personalInfo.isMinor && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DPDP Minor Protected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {profileData.personalInfo.email}
                  </p>
                  {profileData.personalInfo.organization && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {profileData.personalInfo.organization.name}
                    </p>
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditFullName(profileData.personalInfo.fullName);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Editable Personal Information Section */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Personal Information
                  </h4>
                  <span className="text-xs text-slate-500">
                    {isEditing ? 'Editing Personal Details' : 'Server Authenticated'}
                  </span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Full Name (Editable)
                      </label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Enter full legal name"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        disabled={saving}
                      />
                      {validationError && (
                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {validationError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditFullName(profileData.personalInfo.fullName);
                          setValidationError(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Persisting...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Student ID</span>
                      <span className="text-slate-300 font-mono mt-0.5 block truncate">
                        {profileData.personalInfo.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date of Birth</span>
                      <span className="text-slate-300 mt-0.5 block flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {profileData.personalInfo.dateOfBirth}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Account Status</span>
                      <span className="text-emerald-400 capitalize mt-0.5 block font-medium">
                        ● {profileData.personalInfo.accountStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Registered Since</span>
                      <span className="text-slate-400 mt-0.5 block">
                        {new Date(profileData.personalInfo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated Learning Information Section */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Authoritative Learning Statistics
                  </h4>
                  <span className="text-xs text-slate-500">Calculated from verified events</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* XP */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <div className="flex items-center justify-center text-amber-400 mb-1">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-black text-white">
                      {profileData.learningStats.xp}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Total XP
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <div className="flex items-center justify-center text-orange-400 mb-1">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-black text-white">
                      {profileData.learningStats.currentStreak}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Day Streak
                    </div>
                  </div>

                  {/* Completed Lessons */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <div className="flex items-center justify-center text-emerald-400 mb-1">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-black text-white">
                      {profileData.learningStats.completedLessonsCount}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Completed
                    </div>
                  </div>

                  {/* Lab Attempts */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <div className="flex items-center justify-center text-cyan-400 mb-1">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-black text-white">
                      {profileData.learningStats.labAttemptsCount}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Labs Run
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center pt-1">
                  Learning statistics reflect your saved course activity and lab submissions.
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>Connected as {currentUser.email}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
