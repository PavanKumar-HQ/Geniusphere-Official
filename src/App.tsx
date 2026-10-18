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
import { MascotSphere } from './components/MascotSphere';
import { CertificateModal } from './components/CertificateModal';
import { SoftwareAuthScreen } from './components/SoftwareAuthScreen';
import { SoftwareUserGuideModal } from './components/SoftwareUserGuideModal';
import {
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  Home,
  School,
  Menu,
  X,
  Terminal,
  Search,
  Bell,
  ChevronDown,
  Folder,
  Award,
  ArrowRight,
  Sparkles,
  LogOut,
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

  // Supported actors in the environment (matching Design Board 2: Pavan Kumar / Learner)
  const users = [
    { id: 'user-student-1', name: 'Pavan Kumar (Learner)', role: 'learner', badge: 'Learner' },
    { id: 'user-student-2', name: 'Aarav Patel (Student, Minor)', role: 'learner', badge: 'Student' },
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

  // Master Layout UI States (Matching Design Board 2)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userGuideOpen, setUserGuideOpen] = useState<boolean>(false);


  // Sovereign Backup & Notes Overlay Modals
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [scratchpadOpen, setScratchpadOpen] = useState<boolean>(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode] = useState<'signin' | 'getstarted'>('signin');

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const isTeacher = currentUser.role === 'teacher';
  const isInstAdmin = currentUser.role === 'institution_admin';
  const isSuperadmin = currentUser.role === 'superadmin';

  const allCourses = useMemo(() => db.getCanonicalCourses(), [db, refreshTrigger]);
  const allLabs = useMemo(() => db.getLabDefinitions(), [db]);

  const matchingCourses = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return allCourses.filter(c => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)).slice(0, 5);
  }, [allCourses, globalSearch]);

  const matchingLabs = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return allLabs.filter(l => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q)).slice(0, 3);
  }, [allLabs, globalSearch]);

  const handleNavigate = (view: string, slug?: string) => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setSearchSuggestionsOpen(false);
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

  if (!isAuthenticated) {
    return (
      <SoftwareAuthScreen
        users={users}
        onLogin={(userId, role) => {
          setCurrentUserId(userId);
          setIsAuthenticated(true);
          if (role === 'teacher') {
            setCurrentView('gradebook');
          } else if (role === 'institution_admin') {
            setCurrentView('institution-workspace');
          } else {
            setCurrentView('catalogue');
          }
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* ============================================================ */}
      {/* 1. TOP MASTER BAR (CANONICAL ENTERPRISE SOFTWARE SHELL)     */}
      {/* ============================================================ */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '3px solid #43A85B',
          borderBottom: '1px solid #E5F0DF',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '70px',
          boxShadow: '0 2px 8px rgba(38, 53, 42, 0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '100%',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* LEFT: MOBILE TOGGLE & GENIUSPHERE BRAND LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile / Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: '1px solid #E5F0DF',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#26352A',
              }}
              aria-label="Toggle Navigation Sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

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
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#26352A',
                  lineHeight: 1.1,
                }}
              >
                Geniusphere
              </span>
            </button>
          </div>

          {/* CENTER: UNIVERSAL SEARCH BAR WITH LIVE DROPDOWN (Design Board 2) */}
          <div style={{ flex: 1, maxWidth: '540px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '12px',
                  color: '#6A7D70',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchSuggestionsOpen(true);
                }}
                onFocus={() => setSearchSuggestionsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchSuggestionsOpen(false);
                    handleNavigate('catalogue');
                  }
                }}
                placeholder="Search for courses, skills or topics..."
                style={{
                  width: '100%',
                  height: '42px',
                  paddingLeft: '44px',
                  paddingRight: globalSearch ? '36px' : '16px',
                  borderRadius: '100px',
                  border: '1.5px solid #E5F0DF',
                  backgroundColor: '#FAFAF4',
                  color: '#26352A',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearch('');
                    setSearchSuggestionsOpen(false);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#6A7D70',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {searchSuggestionsOpen && globalSearch.trim().length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E5F0DF',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  padding: '12px',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto',
                }}
              >
                {matchingCourses.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6A7D70', textTransform: 'uppercase', padding: '4px 8px' }}>
                      Courses ({matchingCourses.length})
                    </div>
                    {matchingCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          handleSelectCourse(c.slug);
                          setSearchSuggestionsOpen(false);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5F0DF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BookOpen size={15} color="#43A85B" />
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#26352A' }}>{c.title}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#6A7D70' }}>{c.duration_hours}h • {c.level}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingLabs.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6A7D70', textTransform: 'uppercase', padding: '4px 8px' }}>
                      Interactive Labs ({matchingLabs.length})
                    </div>
                    {matchingLabs.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setSelectedLabSlug(l.slug);
                          setCurrentView('lab-workspace');
                          setSearchSuggestionsOpen(false);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5F0DF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Terminal size={15} color="#43A85B" />
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#26352A' }}>{l.title}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#6A7D70' }}>Lab Simulator</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingCourses.length === 0 && matchingLabs.length === 0 && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#6A7D70', fontSize: '0.85rem' }}>
                    No direct matches. Press Enter to search curriculum.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: USER GUIDE, NOTIFICATIONS BELL & USER AVATAR PILL (Design Board 2) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {/* Interactive User Guide Button with Mascot */}
            <button
              type="button"
              onClick={() => setUserGuideOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FAFAF4',
                border: '1px solid #E5F0DF',
                borderRadius: '100px',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#26352A',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5F0DF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FAFAF4';
              }}
              title="Launch Interactive Software User Guide"
            >
              <MascotSphere pose="happy" size={20} animated={false} />
              <span>User Guide</span>
            </button>

            {/* Notification Bell Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid #E5F0DF',
                  backgroundColor: notificationsOpen ? '#E5F0DF' : '#FFFFFF',
                  color: '#26352A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#43A85B',
                  }}
                />
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5F0DF',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                    padding: '16px',
                    zIndex: 200,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#26352A' }}>Notifications</div>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#43A85B', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FAFAF4', border: '1px solid #E5F0DF', fontSize: '0.78rem' }}>
                      <div style={{ fontWeight: 700, color: '#26352A' }}>🎓 Welcome to Geniusphere Suite</div>
                      <div style={{ color: '#6A7D70' }}>Explore 40 canonical courses, hands-on sandboxes, and gradebooks.</div>
                    </div>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FAFAF4', border: '1px solid #E5F0DF', fontSize: '0.78rem' }}>
                      <div style={{ fontWeight: 700, color: '#26352A' }}>🎖️ Verified Credentials Active</div>
                      <div style={{ color: '#6A7D70' }}>Certificates include tamper-proof SHA-256 integrity hashes.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill matching Design Board 2 */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5F0DF',
                  padding: '4px 14px 4px 6px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <img
                  src="/images/student_hero.jpg"
                  alt={currentUser.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #43A85B',
                  }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#26352A' }}>
                    {currentUser.name.split(' (')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6A7D70', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span>{isTeacher ? 'Faculty' : 'Learner'}</span>
                    <ChevronDown size={11} />
                  </div>
                </div>
              </button>

              {/* Persona / User Switcher Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '290px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5F0DF',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                    padding: '16px',
                    zIndex: 200,
                  }}
                >
                  <div style={{ borderBottom: '1px solid #E5F0DF', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#26352A' }}>{currentUser.name.split(' (')[0]}</div>
                    <div style={{ fontSize: '0.74rem', color: '#43A85B', fontWeight: 600, marginTop: '2px' }}>
                      {isTeacher ? '🎓 Faculty & Educator Portal' : '👤 Student Learner Portal'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {/* Toggle between Student & Teacher */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextUserId = isTeacher ? 'user-student-1' : 'user-teacher-1';
                        setCurrentUserId(nextUserId);
                        setUserMenuOpen(false);
                        setCurrentView(isTeacher ? 'student-dashboard' : 'gradebook');
                      }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E5F0DF',
                        backgroundColor: '#F8FAF6',
                        color: '#26352A',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E5F0DF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F8FAF6';
                      }}
                    >
                      {isTeacher ? <GraduationCap size={16} color="#43A85B" /> : <Users size={16} color="#43A85B" />}
                      <span>{isTeacher ? 'Switch to Student View' : 'Switch to Teacher Portal'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setUserGuideOpen(true);
                      }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E5F0DF',
                        backgroundColor: '#FFFFFF',
                        color: '#26352A',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Sparkles size={16} color="#43A85B" />
                      <span>Software User Guide</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setIsAuthenticated(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '10px',
                      backgroundColor: '#FAFAF4',
                      border: '1px solid #E5F0DF',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out / Lock Workstation</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MASTER APPLICATION LAYOUT WITH SIDEBAR (DESIGN BOARD 2)  */}
      {/* ============================================================ */}
      <div className="platform-layout">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="platform-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR NAVIGATION RAIL */}
        <aside className={`platform-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div>
            {isTeacher ? (
              /* TEACHER / EDUCATOR DEDICATED NAVIGATION RAIL */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#43A85B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0 16px 8px',
                  }}
                >
                  Educator Portal
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('gradebook')}
                  className={`sidebar-nav-btn ${currentView === 'gradebook' ? 'active' : ''}`}
                >
                  <Users size={18} />
                  <span>Class Gradebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('classrooms')}
                  className={`sidebar-nav-btn ${currentView === 'classrooms' ? 'active' : ''}`}
                >
                  <School size={18} />
                  <span>Manage Classes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                >
                  <BookOpen size={18} />
                  <span>Curriculum & Courses</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                >
                  <Terminal size={18} />
                  <span>Lab Environments</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('institution-workspace')}
                  className={`sidebar-nav-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
                >
                  <ShieldCheck size={18} />
                  <span>Institution Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCertificateModalOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                >
                  <Award size={18} />
                  <span>Certificate Registry</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('resources')}
                  className={`sidebar-nav-btn ${currentView === 'resources' ? 'active' : ''}`}
                >
                  <Folder size={18} />
                  <span>Teaching Resources</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                >
                  <Sparkles size={18} />
                  <span>Software User Guide</span>
                </button>
              </div>
            ) : (
              /* STUDENT / LEARNER DEDICATED NAVIGATION RAIL */
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className={`sidebar-nav-btn ${currentView === 'home' ? 'active' : ''}`}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('catalogue')}
                    className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'active' : ''}`}
                  >
                    <BookOpen size={18} />
                    <span>Courses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('student-dashboard')}
                    className={`sidebar-nav-btn ${currentView === 'student-dashboard' ? 'active' : ''}`}
                  >
                    <GraduationCap size={18} />
                    <span>My Learning</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('labs')}
                    className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  >
                    <Terminal size={18} />
                    <span>Labs & Projects</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('leaderboard')}
                    className={`sidebar-nav-btn ${currentView === 'leaderboard' ? 'active' : ''}`}
                  >
                    <Users size={18} />
                    <span>Community</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('resources')}
                    className={`sidebar-nav-btn ${currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 'active' : ''}`}
                  >
                    <Folder size={18} />
                    <span>Resources</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCertificateModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    className="sidebar-nav-btn"
                  >
                    <Award size={18} />
                    <span>Certificates</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserGuideOpen(true);
                      setSidebarOpen(false);
                    }}
                    className="sidebar-nav-btn"
                  >
                    <Sparkles size={18} />
                    <span>Software User Guide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setSidebarOpen(false);
                    }}
                    className="sidebar-nav-btn"
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                  </button>
                </div>

                {/* For Institutions Group */}
                <div style={{ marginTop: '24px' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#6A7D70',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    For Institutions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleNavigate('institution-workspace')}
                      className={`sidebar-nav-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
                    >
                      <School size={18} />
                      <span>Institution Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('classrooms')}
                      className={`sidebar-nav-btn ${currentView === 'classrooms' || currentView === 'gradebook' ? 'active' : ''}`}
                    >
                      <Users size={18} />
                      <span>Manage Classes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Mascot Encouragement Widget (matching Design Board 2) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5F0DF',
              padding: '16px',
              marginTop: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            {isTeacher ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MascotSphere pose="teaching" size={40} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#26352A', fontFamily: 'Space Grotesk, sans-serif' }}>
                      Educator Suite
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6A7D70', lineHeight: 1.25 }}>
                      Class 10-A: 24 students enrolled, 82% course completion.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleNavigate('gradebook')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#43A85B',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <span>Open Gradebook</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MascotSphere pose="happy" size={38} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#26352A', fontFamily: 'Space Grotesk, sans-serif' }}>
                      Keep going!
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6A7D70', lineHeight: 1.25 }}>
                      Every skill you learn builds a bigger you.
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', backgroundColor: '#E5F0DF', borderRadius: '100px', overflow: 'hidden', margin: '8px 0 6px' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: '#43A85B', borderRadius: '100px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6A7D70', fontWeight: 600 }}>3/5 courses</span>
                  <button
                    type="button"
                    onClick={() => handleNavigate('student-dashboard')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#43A85B',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span>Continue</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <div className="platform-main-content">
          <main
            style={{
              flex: 1,
              padding: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '0' : '32px 28px',
              maxWidth: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '100%' : '1320px',
              margin: '0 auto',
              width: '100%',
              minHeight: 'calc(100vh - 70px)',
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
      </main>
    </div>
  </div>

      {/* ============================================================ */}
      {/* 3.5 CERTIFICATE MODAL VIEWER                                 */}
      {/* ============================================================ */}
      {certificateModalOpen && (
        <CertificateModal
          certificate={
            db.getUserCertificates(currentUserId)[0] || {
              id: 'cert-sample-ai',
              user_id: currentUserId,
              course_id: 'course-ai-fund',
              course_title: 'Artificial Intelligence Literacy',
              student_name: currentUser.name.split(' (')[0],
              verification_hash: '9f8e7d6c5b4a3210fedcba9876543210',
              issued_at: new Date().toISOString(),
              credential_url: 'https://verify.geniusphere.tech/c/ai-literacy',
              metadata: {
                score_achieved: 100,
                learning_stream: 'Technology & Digital Skills',
                curriculum_version: '2026.1',
              },
            }
          }
          onClose={() => setCertificateModalOpen(false)}
        />
      )}

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
                onClick={() => setBackupModalOpen(true)}
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
                <span>Sovereign Data Backup</span>
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

      <SoftwareUserGuideModal
        isOpen={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        isTeacher={isTeacher}
        onNavigate={(view) => handleNavigate(view)}
      />
    </div>
  );
};
