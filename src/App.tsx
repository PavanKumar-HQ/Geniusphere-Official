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
import { ScamDefenseJourney } from './components/ScamDefenseJourney';
import { CIEAuditMatrix } from './components/CIEAuditMatrix';
import { BackupExportModal } from './components/BackupExportModal';
import { VectorScratchpadOverlay } from './components/VectorScratchpadOverlay';
import { VisualDiagramStudio } from './components/VisualDiagramStudio';
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
  Download,
  Smartphone,
  Monitor,
  Edit3,
  Zap,
  Flame,
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
  | 'audit'
  | 'scam-defense'
  | 'cie-audit'
  | 'diagram-studio';

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
    { id: 'user-cie-auditor', name: 'Dr. Suresh Kumar (CIE Reviewer, PESU)', role: 'auditor', badge: 'CIE Audit' },
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

  // Viewport Simulator State (Desktop 100% vs Mobile PWA Frame 390px)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [devToolbarVisible, setDevToolbarVisible] = useState<boolean>(false);

  // Sovereign Backup & Notes Overlay Modals
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [scratchpadOpen, setScratchpadOpen] = useState<boolean>(false);

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
      view === 'platform-workspace' ||
      view === 'scam-defense' ||
      view === 'cie-audit' ||
      view === 'diagram-studio'
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
      {/* Top Hairline Rule: Fresh Green */}
      <div
        style={{
          height: '3px',
          backgroundColor: '#43A85B',
          width: '100%',
        }}
      />

      {/* ============================================================ */}
      {/* 0. PERSISTENT TELEMETRY, GOVERNANCE & SIMULATOR BAR (DEV MODE)*/}
      {/* ============================================================ */}
      {devToolbarVisible && (
        <div
          style={{
          backgroundColor: '#FAFAF4',
          color: '#26352A',
          fontSize: '0.78rem',
          padding: '6px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid rgba(38, 53, 42, 0.12)',
          zIndex: 101,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Performance & Sync Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E5F0DF',
              color: '#26352A',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.72rem',
              border: '1px solid rgba(38, 53, 42, 0.12)',
            }}
          >
            <Zap size={13} color="#43A85B" />
            <span>Snapshot Loaded: 14ms (IDB)</span>
            <span style={{ color: 'rgba(38, 53, 42, 0.35)' }}>•</span>
            <span style={{ color: '#43A85B' }}>Sync: Verified</span>
            <span style={{ color: 'rgba(38, 53, 42, 0.35)' }}>•</span>
            <span>24h Auto-Backup: Active</span>
          </div>

          {/* Gamification Pill: Streak in Lime with Charcoal text */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#D9F477',
              color: '#26352A',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.72rem',
            }}
            title="Consistent Student Streak"
          >
            <Flame size={13} color="#26352A" />
            <span>12 Days</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>2,450 XP</span>
          </div>
        </div>

        {/* Action Controls & Simulator Switches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Viewport Simulator Toggle (390px Mobile vs 100% Desktop) */}
          <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(38, 53, 42, 0.18)' }}>
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                border: 'none',
                backgroundColor: viewportMode === 'desktop' ? '#43A85B' : '#FFFFFF',
                color: viewportMode === 'desktop' ? '#FAFAF4' : '#26352A',
                fontWeight: viewportMode === 'desktop' ? 800 : 500,
                cursor: 'pointer',
              }}
              title="Desktop Studio View"
            >
              <Monitor size={12} />
              <span>Studio 100%</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                border: 'none',
                backgroundColor: viewportMode === 'mobile' ? '#43A85B' : '#FFFFFF',
                color: viewportMode === 'mobile' ? '#FAFAF4' : '#26352A',
                fontWeight: viewportMode === 'mobile' ? 800 : 500,
                cursor: 'pointer',
              }}
              title="Mobile PWA Touch Frame (390px)"
            >
              <Smartphone size={12} />
              <span>PWA 390px</span>
            </button>
          </div>

          {/* Sovereign Backup Drawer Button */}
          <button
            type="button"
            onClick={() => setBackupModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(38, 53, 42, 0.18)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#26352A',
            }}
          >
            <Download size={12} />
            <span>Backup / Export</span>
          </button>

          {/* Vector Notes Overlay Toggle */}
          <button
            type="button"
            onClick={() => setScratchpadOpen(!scratchpadOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              fontSize: '0.74rem',
              fontWeight: 600,
              backgroundColor: scratchpadOpen ? '#E5F0DF' : '#FFFFFF',
              border: '1px solid rgba(38, 53, 42, 0.18)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#26352A',
            }}
          >
            <Edit3 size={12} />
            <span>Vector Overlay</span>
          </button>

          {/* Persona Switcher Quick Dropdown */}
          <select
            value={currentUserId}
            onChange={(e) => {
              const newId = e.target.value;
              setCurrentUserId(newId);
              if (newId === 'user-cie-auditor') setCurrentView('cie-audit');
              else if (newId === 'user-teacher-1') setCurrentView('gradebook');
              else if (newId === 'user-parent-1') setCurrentView('parent');
              else if (newId === 'user-admin-1') setCurrentView('institution-workspace');
              else if (newId === 'user-superadmin-1') setCurrentView('platform-workspace');
              else if (newId === 'user-student-1') setCurrentView('student-dashboard');
            }}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(38, 53, 42, 0.18)',
              backgroundColor: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: '#26352A',
              cursor: 'pointer',
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.badge}: {u.name.split(' (')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
      )}

      {/* ============================================================ */}
      {/* 1. TOP PRIMARY NAVIGATION BAR (CLEAN, DESIGN BOARD 1)        */}
      {/* ============================================================ */}
      <header
        style={{
          backgroundColor: '#FAFAF4',
          borderBottom: '1px solid #E5F0DF',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* LEFT: GENIUSPHERE BRAND LOGO */}
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
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#43A85B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(67, 168, 91, 0.25)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#26352A',
                  display: 'block',
                  lineHeight: 1.1,
                }}
              >
                Geniusphere
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6A7D70', fontWeight: 600 }}>
                Learn it. Apply it. Prove it.
              </span>
            </div>
          </button>

          {/* CENTER: CLEAN NAVIGATION LINKS */}
          <nav
            className="desktop-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              style={{
                backgroundColor: currentView === 'home' ? '#E5F0DF' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: currentView === 'home' ? '#26352A' : '#3A4E40',
                fontWeight: currentView === 'home' ? 800 : 600,
                borderRadius: '100px',
                fontSize: '0.92rem',
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
                backgroundColor: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '#E5F0DF' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '#26352A' : '#3A4E40',
                fontWeight: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 800 : 600,
                borderRadius: '100px',
                fontSize: '0.92rem',
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
                backgroundColor: currentView === 'labs' || currentView === 'lab-workspace' ? '#E5F0DF' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: currentView === 'labs' || currentView === 'lab-workspace' ? '#26352A' : '#3A4E40',
                fontWeight: currentView === 'labs' || currentView === 'lab-workspace' ? 800 : 600,
                borderRadius: '100px',
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Labs & Projects
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('resources')}
              style={{
                backgroundColor: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? '#E5F0DF' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? '#26352A' : '#3A4E40',
                fontWeight: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 800 : 600,
                borderRadius: '100px',
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Resources
            </button>
          </nav>

          {/* RIGHT: AUTH & ACTIVE ROLE WORKSPACE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Active User Workspace Quick-Link */}
            {isLearner && (
              <button
                type="button"
                onClick={() => handleNavigate('student-dashboard')}
                style={{
                  backgroundColor: currentView === 'student-dashboard' ? '#43A85B' : '#E5F0DF',
                  color: currentView === 'student-dashboard' ? '#FFFFFF' : '#26352A',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '7px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <BookOpen size={14} />
                <span>My Learning</span>
              </button>
            )}

            {isTeacher && (
              <button
                type="button"
                onClick={() => handleNavigate('gradebook')}
                style={{
                  backgroundColor: currentView === 'gradebook' || currentView === 'classrooms' ? '#43A85B' : '#E5F0DF',
                  color: currentView === 'gradebook' || currentView === 'classrooms' ? '#FFFFFF' : '#26352A',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '7px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <GraduationCap size={15} />
                <span>Teacher Workspace</span>
              </button>
            )}

            {isInstAdmin && (
              <button
                type="button"
                onClick={() => handleNavigate('institution-workspace')}
                style={{
                  backgroundColor: currentView === 'institution-workspace' ? '#43A85B' : '#E5F0DF',
                  color: currentView === 'institution-workspace' ? '#FFFFFF' : '#26352A',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '7px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <School size={14} />
                <span>Admin Console</span>
              </button>
            )}

            {isGuardian && (
              <button
                type="button"
                onClick={() => handleNavigate('parent')}
                style={{
                  backgroundColor: currentView === 'parent' ? '#43A85B' : '#E5F0DF',
                  color: currentView === 'parent' ? '#FFFFFF' : '#26352A',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '7px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Users size={14} />
                <span>Parent Portal</span>
              </button>
            )}

            {/* Single Clean Persona Selector Pill */}
            <div style={{ position: 'relative' }}>
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
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: '1px solid #E5F0DF',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: '#26352A',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                aria-label="Switch User Persona"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    👤 {u.name.split(' (')[0]} ({u.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* CTA Button: Get Started */}
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('getstarted');
                setAuthModalOpen(true);
              }}
              style={{
                backgroundColor: '#43A85B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(67, 168, 91, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              Get Started
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: '1px solid #E5F0DF',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#26352A',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
          padding: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '0' : '28px 24px',
          maxWidth: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '100%' : '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={
            viewportMode === 'mobile'
              ? {
                  maxWidth: '390px',
                  margin: '24px auto',
                  borderRadius: '36px',
                  border: '8px solid #26352A',
                  boxShadow: '0 20px 40px rgba(38, 53, 42, 0.25)',
                  overflow: 'hidden',
                  backgroundColor: '#FAFAF4',
                  minHeight: '844px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }
              : { width: '100%' }
          }
        >
          {viewportMode === 'mobile' && (
            <div
              style={{
                height: '24px',
                backgroundColor: '#26352A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAFAF4',
                fontSize: '0.65rem',
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: '110px',
                  height: '14px',
                  backgroundColor: '#1E2B22',
                  borderRadius: '0 0 10px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#43A85B' }} />
                <div style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: '#3A4E40' }} />
              </div>
            </div>
          )}

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

        {currentView === 'scam-defense' && (
          <ScamDefenseJourney
            key={`scam-defense-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onNavigateBack={() => handleNavigate('home')}
            onViewPortfolio={() => handleNavigate('student-dashboard')}
          />
        )}

        {currentView === 'cie-audit' && (
          <CIEAuditMatrix
            key={`cie-audit-${refreshTrigger}`}
            db={db}
            onNavigateHome={() => handleNavigate('home')}
            onLaunchLab={(slug) => {
              setSelectedLabSlug(slug);
              setCurrentView('lab-workspace');
            }}
          />
        )}

        {currentView === 'diagram-studio' && (
          <VisualDiagramStudio
            key={`diagram-studio-${refreshTrigger}`}
          />
        )}
        </div>
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
              <span>40 Canonical Courses • 3 Learning Streams • 10 Interactive Labs</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setDevToolbarVisible(!devToolbarVisible)}
                style={{
                  background: 'none',
                  border: '1px solid #E5F0DF',
                  borderRadius: '100px',
                  padding: '3px 10px',
                  color: '#43A85B',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ⚡ {devToolbarVisible ? 'Hide Developer Toolbar' : 'Dev / Auditor Mode'}
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* ============================================================ */}
      {/* 6. SOVEREIGN BACKUP & LORIEN VECTOR OVERLAY MODALS           */}
      {/* ============================================================ */}
      <BackupExportModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        db={db}
        currentUserId={currentUserId}
        onRestoreSuccess={() => setRefreshTrigger((v) => v + 1)}
      />

      <VectorScratchpadOverlay
        isOpen={scratchpadOpen}
        onClose={() => setScratchpadOpen(false)}
        labKey={selectedLabSlug || 'global'}
      />
    </div>
  );
};
