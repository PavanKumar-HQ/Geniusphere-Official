import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from './db/in-memory-db';
import { Homepage } from './components/Homepage';
import { CourseCatalogue } from './components/CourseCatalogue';
import { CourseDetailView } from './components/CourseDetailView';
import { LessonPlayer } from './components/LessonPlayer';
import { ResourcesHub } from './components/ResourcesHub';
import { AboutPage } from './components/AboutPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { AuthModal } from './components/AuthModal';
import { TeacherGradebook } from './components/TeacherGradebook';
import { ClassroomManager } from './components/ClassroomManager';
import { ParentPortal } from './components/ParentPortal';
import { AuditLogViewer } from './components/AuditLogViewer';
import { ResumeBuilder } from './components/ResumeBuilder';
import { SchoolKit } from './components/SchoolKit';
import { StudentDashboard } from './components/StudentDashboard';
import { InstitutionAdminWorkspace } from './components/InstitutionAdminWorkspace';
import { PlatformAdminWorkspace } from './components/PlatformAdminWorkspace';
import { LabCatalogue } from './components/LabCatalogue';
import { SharedLabWorkspace } from './components/SharedLabWorkspace';
import {
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  Home,
  School,
  Menu,
  X,
  Shield,
  Video,
  Info,
  Terminal,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'catalogue'
  | 'course-detail'
  | 'lesson-player'
  | 'labs'
  | 'lab-workspace'
  | 'resources'
  | 'leaderboard'
  | 'about'
  | 'student-dashboard'
  | 'gradebook'
  | 'classrooms'
  | 'institution-workspace'
  | 'platform-workspace'
  | 'resume-builder'
  | 'schoolkit'
  | 'parent'
  | 'audit';

export const App: React.FC = () => {
  // Single persistent in-memory database instance for genuine state progression
  const db = useMemo(() => new InMemoryDatabase(), []);

  // Supported actors in the environment
  const users = [
    { id: 'user-student-1', name: 'Aarav Patel (Student, Minor)', role: 'learner', badge: 'Student' },
    { id: 'user-teacher-1', name: 'Dr. Sharma (Teacher, DPTS)', role: 'teacher', badge: 'Teacher' },
    { id: 'user-parent-1', name: 'Sunita Patel (Guardian of Aarav)', role: 'guardian', badge: 'Parent' },
    { id: 'user-admin-1', name: 'Principal Verma (Institution Admin)', role: 'institution_admin', badge: 'Inst Admin' },
    { id: 'user-superadmin-1', name: 'Platform Superadmin (System Operations)', role: 'superadmin', badge: 'Superadmin' },
  ];

  const [currentUserId, setCurrentUserId] = useState<string>('user-student-1');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('cybersecurity-defensive-web');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-web-sec');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('les-sec-101');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLabSlug, setSelectedLabSlug] = useState<string>('ai-classification-playground');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'getstarted'>('signin');

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const isTeacher = currentUser.role === 'teacher';
  const isInstAdmin = currentUser.role === 'institution_admin';
  const isSuperadmin = currentUser.role === 'superadmin';
  const isGuardian = currentUser.role === 'guardian';
  const isLearner = currentUser.role === 'learner';

  const handleNavigate = (view: string, slug?: string) => {
    setMobileMenuOpen(false);
    if (view === 'course-detail' && slug) {
      setSelectedCourseSlug(slug);
      setCurrentView('course-detail');
    } else if (view === 'lab-workspace') {
      setSelectedLabSlug(slug || 'ai-classification-playground');
      setCurrentView('lab-workspace');
    } else if (view === 'labs') {
      setCurrentView('labs');
    } else if (view === 'catalogue') {
      if (slug) {
        setSelectedDomain(slug);
      } else {
        setSelectedDomain('all');
      }
      setCurrentView('catalogue');
    } else if (
      view === 'home' ||
      view === 'resources' ||
      view === 'leaderboard' ||
      view === 'about' ||
      view === 'classrooms' ||
      view === 'gradebook' ||
      view === 'parent' ||
      view === 'audit' ||
      view === 'resume-builder' ||
      view === 'schoolkit' ||
      view === 'student-dashboard' ||
      view === 'institution-workspace' ||
      view === 'platform-workspace'
    ) {
      setCurrentView(view as AppView);
    }
  };

  const handleSelectCourse = (slug: string) => {
    setSelectedCourseSlug(slug);
    const course = db.getCourseBySlug(slug);
    if (course) {
      setSelectedCourseId(course.id);
      if (course.modules?.[0]?.lessons?.[0]?.id) {
        setSelectedLessonId(course.modules[0].lessons[0].id);
      }
    }
    setCurrentView('course-detail');
  };

  const handleStartLesson = (courseId: string, lessonId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
    setCurrentView('lesson-player');
  };

  const handleAuthenticate = (userId: string, role: string) => {
    setCurrentUserId(userId);
    setRefreshTrigger((v) => v + 1);
    if (role === 'learner') setCurrentView('student-dashboard');
    else if (role === 'teacher') setCurrentView('gradebook');
    else if (role === 'institution_admin') setCurrentView('institution-workspace');
    else if (role === 'superadmin') setCurrentView('platform-workspace');
    else if (role === 'guardian') setCurrentView('parent');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* 3.5px Vibrant Multi-Stop Radiant Rainbow Stripe */}
      <div
        style={{
          height: '3.5px',
          background: 'linear-gradient(90deg, #30B2E7 0%, #6366F1 25%, #8B5CF6 50%, #FDB913 75%, #75B543 100%)',
          width: '100%',
        }}
      />

      {/* ============================================================ */}
      {/* 0. LIVE DEMONSTRATION & MULTI-TENANT EVALUATION BAR          */}
      {/* ============================================================ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#F8FAFC',
          fontSize: '0.78rem',
          padding: '7px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          zIndex: 101,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.68rem',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
            }}
          >
            <span className="pulse-dot-green" />
            <span>DEMO READY</span>
          </div>
          <span style={{ color: '#94A3B8' }}>Active Persona:</span>
          <span style={{ fontWeight: 800, color: '#38BDF8', letterSpacing: '0.01em' }}>
            {currentUser.name.split(' (')[0]} ({currentUser.role.toUpperCase()})
          </span>
        </div>

        {/* Quick Role & View Switchers for Live Demonstration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#94A3B8', marginRight: '2px' }}>Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            style={{
              background: currentView === 'home' ? 'linear-gradient(135deg, #0284C7 0%, #30B2E7 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'home' ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'home' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('catalogue')}
            style={{
              background: currentView === 'catalogue' ? 'linear-gradient(135deg, #0284C7 0%, #30B2E7 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'catalogue' ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'catalogue' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Courses (27)
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('labs')}
            style={{
              background: currentView === 'labs' || currentView === 'lab-workspace' ? 'linear-gradient(135deg, #F59E0B 0%, #FDB913 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'labs' || currentView === 'lab-workspace' ? '1px solid #FCD34D' : '1px solid rgba(255, 255, 255, 0.15)',
              color: currentView === 'labs' || currentView === 'lab-workspace' ? '#172B4D' : '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'labs' || currentView === 'lab-workspace' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            12 Interactive Labs
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserId('user-student-1');
              handleNavigate('student-dashboard');
            }}
            style={{
              background: currentView === 'student-dashboard' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'student-dashboard' ? '1px solid #A5B4FC' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'student-dashboard' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Student Workspace
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserId('user-teacher-1');
              handleNavigate('gradebook');
            }}
            style={{
              background: currentView === 'gradebook' ? 'linear-gradient(135deg, #10B981 0%, #75B543 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'gradebook' ? '1px solid #86EFAC' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'gradebook' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Teacher Gradebook
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserId('user-guardian-1');
              handleNavigate('parent');
            }}
            style={{
              background: currentView === 'parent' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'parent' ? '1px solid #86EFAC' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'parent' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Parent Oversight
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserId('user-admin-1');
              handleNavigate('platform-workspace');
            }}
            style={{
              background: currentView === 'platform-workspace' ? 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'platform-workspace' ? '1px solid #FDA4AF' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: currentView === 'platform-workspace' ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Platform Admin
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. TOP PRIMARY NAVIGATION BAR                                */}
      {/* ============================================================ */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* LEFT: GENIUSPHERE BRAND LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284C7 0%, #30B2E7 50%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(48, 178, 231, 0.4)',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.28rem',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    GENIUSPHERE
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #FDB913 100%)',
                      color: '#172B4D',
                      boxShadow: '0 2px 6px rgba(253, 185, 19, 0.35)',
                    }}
                  >
                    PILOT 2026
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Evidence-Backed Education Platform
                </div>
              </div>
            </button>
          </div>

          {/* RIGHT: PRIMARY NAVIGATION LINKS & ACTIONS (DESKTOP) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Desktop Navigation Links with Rounded Active Glow Pills */}
            <nav
              className="desktop-nav-links"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginRight: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                style={{
                  background: currentView === 'home' ? 'rgba(48, 178, 231, 0.12)' : 'none',
                  border: 'none',
                  padding: '7px 14px',
                  color: currentView === 'home' ? '#0284C7' : 'var(--text-secondary)',
                  fontWeight: currentView === 'home' ? 800 : 600,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('catalogue')}
                style={{
                  background: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'rgba(48, 178, 231, 0.12)' : 'none',
                  border: 'none',
                  padding: '7px 14px',
                  color: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '#0284C7' : 'var(--text-secondary)',
                  fontWeight: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 800 : 600,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Courses
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('labs')}
                style={{
                  background: currentView === 'labs' || currentView === 'lab-workspace' ? 'rgba(253, 185, 19, 0.18)' : 'none',
                  border: 'none',
                  padding: '7px 14px',
                  color: currentView === 'labs' || currentView === 'lab-workspace' ? '#B45309' : 'var(--text-secondary)',
                  fontWeight: currentView === 'labs' || currentView === 'lab-workspace' ? 800 : 600,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Labs
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('resources')}
                style={{
                  background: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 'rgba(117, 181, 67, 0.18)' : 'none',
                  border: 'none',
                  padding: '7px 14px',
                  color: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? '#15803D' : 'var(--text-secondary)',
                  fontWeight: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 800 : 600,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Resources
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('about')}
                style={{
                  background: currentView === 'about' ? 'rgba(99, 102, 241, 0.12)' : 'none',
                  border: 'none',
                  padding: '7px 14px',
                  color: currentView === 'about' ? '#4F46E5' : 'var(--text-secondary)',
                  fontWeight: currentView === 'about' ? 800 : 600,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                About
              </button>
            </nav>

            {/* Authenticated Role Workspace Button */}
            {isLearner && (
              <button
                type="button"
                className={currentView === 'student-dashboard' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleNavigate('student-dashboard')}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
                title="Open Student Dashboard"
              >
                <BookOpen size={14} />
                <span>My Learning</span>
              </button>
            )}

            {isTeacher && (
              <button
                type="button"
                className={currentView === 'gradebook' || currentView === 'classrooms' ? 'btn-accent' : 'btn-secondary'}
                onClick={() => handleNavigate('gradebook')}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
                title="Open Teacher Gradebook & Classrooms"
              >
                <GraduationCap size={15} />
                <span>Teacher Workspace</span>
              </button>
            )}

            {isInstAdmin && (
              <button
                type="button"
                className={currentView === 'institution-workspace' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleNavigate('institution-workspace')}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
                title="Open Institution Admin Workspace"
              >
                <School size={14} />
                <span>Admin Console</span>
              </button>
            )}

            {isSuperadmin && (
              <button
                type="button"
                className={currentView === 'platform-workspace' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleNavigate('platform-workspace')}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
                title="Open Platform Operations"
              >
                <Shield size={14} />
                <span>Platform Ops</span>
              </button>
            )}

            {isGuardian && (
              <button
                type="button"
                className={currentView === 'parent' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleNavigate('parent')}
                style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
                title="Open Parent Oversight Portal"
              >
                <Users size={14} />
                <span>Parent Portal</span>
              </button>
            )}

            {/* Persona Switcher Dropdown (Evaluation & Workflow Verification) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 4px' }}>
              <select
                value={currentUserId}
                onChange={(e) => {
                  const newUserId = e.target.value;
                  setCurrentUserId(newUserId);
                  const userObj = users.find((u) => u.id === newUserId);
                  if (userObj?.role === 'teacher') setCurrentView('gradebook');
                  else if (userObj?.role === 'guardian') setCurrentView('parent');
                  else if (userObj?.role === 'institution_admin') setCurrentView('institution-workspace');
                  else if (userObj?.role === 'superadmin') setCurrentView('platform-workspace');
                  else if (userObj?.role === 'learner') setCurrentView('student-dashboard');
                }}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-canvas)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  maxWidth: '160px',
                }}
                aria-label="Switch User Persona"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.badge}: {u.name.split(' (')[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Authentication Buttons: Sign In & Get Started */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setAuthModalMode('signin');
                setAuthModalOpen(true);
              }}
              style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px' }}
            >
              Sign In
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setAuthModalMode('getstarted');
                setAuthModalOpen(true);
              }}
              style={{ height: '36px', fontSize: '0.82rem', padding: '0 14px' }}
            >
              Get Started
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'inline-flex',
                padding: '6px',
                height: '36px',
                width: '36px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. ACCESSIBLE RESPONSIVE MOBILE MENU DRAWER                  */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '2px solid var(--border-strong)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 99,
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Main Sections
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleNavigate('home')}
            style={{ justifyContent: 'flex-start', height: '40px' }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleNavigate('catalogue')}
            style={{ justifyContent: 'flex-start', height: '40px' }}
          >
            <BookOpen size={16} />
            <span>Courses ({db.getCourses().length})</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleNavigate('labs')}
            style={{ justifyContent: 'flex-start', height: '40px' }}
          >
            <Terminal size={16} />
            <span>Interactive Labs ({db.getLabDefinitions().length})</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleNavigate('resources')}
            style={{ justifyContent: 'flex-start', height: '40px' }}
          >
            <Video size={16} />
            <span>Resources Hub</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleNavigate('about')}
            style={{ justifyContent: 'flex-start', height: '40px' }}
          >
            <Info size={16} />
            <span>About Geniusphere</span>
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '8px 0' }} />

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Workspaces & Tools
          </div>

          {isLearner && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleNavigate('student-dashboard')}
              style={{ justifyContent: 'flex-start', height: '40px' }}
            >
              <BookOpen size={16} />
              <span>My Learning Dashboard</span>
            </button>
          )}

          {isTeacher && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleNavigate('gradebook')}
              style={{ justifyContent: 'flex-start', height: '40px' }}
            >
              <GraduationCap size={16} />
              <span>Teacher Gradebook & Classrooms</span>
            </button>
          )}

          {isInstAdmin && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleNavigate('institution-workspace')}
              style={{ justifyContent: 'flex-start', height: '40px' }}
            >
              <School size={16} />
              <span>Institution Admin Console</span>
            </button>
          )}

          {isSuperadmin && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleNavigate('platform-workspace')}
              style={{ justifyContent: 'flex-start', height: '40px' }}
            >
              <Shield size={16} />
              <span>Platform Operations</span>
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalMode('signin');
                setAuthModalOpen(true);
              }}
              style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalMode('getstarted');
                setAuthModalOpen(true);
              }}
              style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MAIN CONTENT ROUTER                                       */}
      {/* ============================================================ */}
      <main
        style={{
          flex: 1,
          padding: currentView === 'home' || currentView === 'lab-workspace' ? '0' : '28px 24px',
          maxWidth: currentView === 'home' || currentView === 'lab-workspace' ? '100%' : '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {currentView === 'home' && (
          <Homepage
            key={`home-${currentUserId}-${refreshTrigger}`}
            db={db}
            onNavigate={handleNavigate}
            currentUserId={currentUserId}
          />
        )}

        {currentView === 'catalogue' && (
          <CourseCatalogue
            key={`catalogue-${currentUserId}-${refreshTrigger}-${selectedDomain}`}
            db={db}
            onSelectCourse={handleSelectCourse}
            onLaunchLab={(slug) => {
              setSelectedLabSlug(slug);
              setCurrentView('lab-workspace');
            }}
            onNavigateHome={() => handleNavigate('home')}
            initialDomain={selectedDomain}
          />
        )}

        {currentView === 'labs' && (
          <LabCatalogue
            key={`labs-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onSelectLab={(slug) => {
              setSelectedLabSlug(slug);
              setCurrentView('lab-workspace');
            }}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'lab-workspace' && (
          <SharedLabWorkspace
            key={`lab-workspace-${selectedLabSlug}-${currentUserId}-${refreshTrigger}`}
            db={db}
            labSlug={selectedLabSlug}
            currentUserId={currentUserId}
            onNavigateBack={() => handleNavigate('labs')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'resources' && (
          <ResourcesHub
            key={`resources-${currentUserId}-${refreshTrigger}`}
            db={db}
            onNavigate={handleNavigate}
            currentUserId={currentUserId}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardPage
            key={`leaderboard-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            key={`about-${refreshTrigger}`}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'course-detail' && (
          <CourseDetailView
            key={`detail-${selectedCourseSlug}-${currentUserId}-${refreshTrigger}`}
            db={db}
            courseSlug={selectedCourseSlug}
            currentUserId={currentUserId}
            onBack={() => handleNavigate('catalogue')}
            onStartLesson={handleStartLesson}
            onLaunchLab={(slug) => {
              setSelectedLabSlug(slug);
              setCurrentView('lab-workspace');
            }}
          />
        )}

        {currentView === 'lesson-player' && (
          <LessonPlayer
            key={`player-${selectedCourseId}-${selectedLessonId}-${currentUserId}-${refreshTrigger}`}
            db={db}
            courseId={selectedCourseId}
            initialLessonId={selectedLessonId}
            currentUserId={currentUserId}
            onBackToCourse={() => handleNavigate('course-detail', selectedCourseSlug)}
            onLaunchLab={() => {
              const matchedLab = db.getLabDefinitions().find((l) => l.course_slug === selectedCourseSlug || l.category === selectedDomain) || db.getLabDefinitions()[0];
              setSelectedLabSlug(matchedLab.slug);
              setCurrentView('lab-workspace');
            }}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboard
            key={`student-dash-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onNavigate={handleNavigate}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'gradebook' && (
          <TeacherGradebook
            key={`gradebook-${currentUserId}-${refreshTrigger}`}
            db={db}
            teacherId={currentUser.role === 'teacher' ? currentUserId : 'user-teacher-1'}
          />
        )}

        {currentView === 'classrooms' && (
          <ClassroomManager
            key={`classrooms-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            isTeacher={isTeacher || isInstAdmin || isSuperadmin}
          />
        )}

        {currentView === 'institution-workspace' && (
          <InstitutionAdminWorkspace
            key={`inst-admin-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onNavigateToAudit={() => handleNavigate('audit')}
          />
        )}

        {currentView === 'platform-workspace' && (
          <PlatformAdminWorkspace
            key={`plat-admin-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onNavigateToAudit={() => handleNavigate('audit')}
            onNavigateToCatalogue={() => handleNavigate('catalogue')}
          />
        )}

        {currentView === 'parent' && (
          <ParentPortal
            key={`parent-${currentUserId}-${refreshTrigger}`}
            db={db}
            parentUserId={currentUser.role === 'guardian' ? currentUserId : 'user-parent-1'}
          />
        )}

        {currentView === 'audit' && (
          <AuditLogViewer
            key={`audit-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={isInstAdmin || isSuperadmin ? currentUserId : 'user-admin-1'}
          />
        )}

        {currentView === 'resume-builder' && (
          <ResumeBuilder
            key={`resume-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
          />
        )}

        {currentView === 'schoolkit' && (
          <SchoolKit
            key={`schoolkit-${refreshTrigger}`}
            onOpenGradebook={() => handleNavigate('gradebook')}
          />
        )}
      </main>

      {/* ============================================================ */}
      {/* 4. AUTHENTICATION & ONBOARDING MODAL                         */}
      {/* ============================================================ */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        users={users}
        currentUserId={currentUserId}
      />

      {/* ============================================================ */}
      {/* 5. SINGLE CANONICAL GLOBAL FOOTER                            */}
      {/* ============================================================ */}
      {currentView !== 'lab-workspace' && currentView !== 'lesson-player' && (
        <footer
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '48px 24px 28px',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-body)',
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '36px',
              paddingBottom: '36px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Column 1: Brand & Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--brand-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  GENIUSPHERE
                </span>
                <span className="badge badge-brand" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>PILOT</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                Evidence-backed, interactive education platform bridging academic curricula with hands-on capability across technology, programming, and finance.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }} />
                <span>Zero Fabricated Data • DPDP Act 2023 Compliant</span>
              </div>
            </div>

            {/* Column 2: Approved Disciplines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Curriculum Areas
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <button type="button" onClick={() => { setSelectedDomain('technology'); handleNavigate('catalogue'); }} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Technology & Architecture</button>
                <button type="button" onClick={() => { setSelectedDomain('coding'); handleNavigate('catalogue'); }} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Coding & Programming</button>
                <button type="button" onClick={() => { setSelectedDomain('finance'); handleNavigate('catalogue'); }} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Finance & Capital Markets</button>
                <button type="button" onClick={() => { setSelectedDomain('professional'); handleNavigate('catalogue'); }} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Professional Development</button>
              </div>
            </div>

            {/* Column 3: Interactive Workspaces */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Interactive Engines
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <button type="button" onClick={() => handleNavigate('labs')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>12 Approved Interactive Labs</button>
                <button type="button" onClick={() => handleNavigate('resources')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Curriculum Video Lessons</button>
                <button type="button" onClick={() => handleNavigate('leaderboard')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Verified Mastery Leaderboard</button>
                <button type="button" onClick={() => handleNavigate('student-dashboard')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Student Progress Workspace</button>
                <button type="button" onClick={() => handleNavigate('gradebook')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Educator Gradebook & Classes</button>
              </div>
            </div>

            {/* Column 4: Institution & Trust */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trust & Verification
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <button type="button" onClick={() => handleNavigate('about')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>About Geniusphere Mission</button>
                <span style={{ color: 'var(--text-muted)' }}>PES University CIE Incubated</span>
                <span style={{ color: 'var(--text-muted)' }}>Bengaluru, Karnataka, India</span>
                <span style={{ color: 'var(--text-muted)' }}>contact@geniusphere.tech</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              maxWidth: '1240px',
              margin: '20px auto 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: 'var(--text-meta)',
              color: 'var(--text-muted)',
            }}
          >
            <div>
              © {new Date().getFullYear()} Geniusphere. Evidence-Backed Education Platform. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>Active Pilot Deployment</span>
              <span>•</span>
              <button type="button" onClick={() => handleNavigate('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
              <span>•</span>
              <button type="button" onClick={() => handleNavigate('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
              <span>•</span>
              <span>27 Curricular Courses • 12 Interactive Labs</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
