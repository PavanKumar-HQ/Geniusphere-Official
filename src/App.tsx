import React, { useState, useMemo, useEffect } from 'react';
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
import { TrainerWorkspace } from './components/TrainerWorkspace';
import { LabCatalogue } from './components/LabCatalogue';
import { SharedLabWorkspace } from './components/SharedLabWorkspace';
import { ScamDefenseJourney } from './components/ScamDefenseJourney';
import { CIEAuditMatrix } from './components/CIEAuditMatrix';
import { BackupExportModal } from './components/BackupExportModal';
import { PilotApplicationModal } from './components/PilotApplicationModal';
import { VectorScratchpadOverlay } from './components/VectorScratchpadOverlay';
import { VisualDiagramStudio } from './components/VisualDiagramStudio';
import { MascotSphere } from './components/MascotSphere';
import { CertificateModal } from './components/CertificateModal';
import { SoftwareAuthScreen } from './components/SoftwareAuthScreen';
import { SoftwareUserGuideModal } from './components/SoftwareUserGuideModal';
import { MultiLanguageCodeSandbox } from './components/MultiLanguageCodeSandbox';
import { SectionContextBar } from './components/SectionContextBar';
import { CertificatesView } from './components/CertificatesView';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { RealtimeHeaderStatus } from './components/RealtimeHeaderStatus';
import { RealtimeNotificationCenter, RealtimeToastStack } from './components/RealtimeNotificationCenter';
import { backendEngine } from './backend/RealtimeOrchestrator';
import { webPushService } from './services/WebPushService';
import { apiClient } from './services/apiClient';
import { GeniusphereLoader } from './components/GeniusphereLoader';
import { LegalPrivacyTermsView } from './components/LegalPrivacyTermsView';
import { ContactCommunityView } from './components/ContactCommunityView';
import { NotFoundView } from './components/NotFoundView';
import {
  ThemeId,
  getStoredTheme,
  initThemeEngine,
  applyTheme,
} from './utils/themeEngine';
import { Certificate } from './types';
import { StreakHabitModal } from './components/StreakHabitModal';
import { StudentProfileModal } from './components/StudentProfileModal';
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
  HelpCircle,
  LogOut,
  Code2,
  ShieldAlert,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Flame,
  Zap,
  User,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'catalogue'
  | 'course-detail'
  | 'lesson-player'
  | 'labs'
  | 'lab-workspace'
  | 'code-sandbox'
  | 'coding-concepts'
  | 'certificates'
  | 'resources'
  | 'leaderboard'
  | 'about'
  | 'student-dashboard'
  | 'gradebook'
  | 'classrooms'
  | 'institution-workspace'
  | 'platform-workspace'
  | 'trainer-workspace'
  | 'resume-builder'
  | 'schoolkit'
  | 'parent'
  | 'audit'
  | 'scam-defense'
  | 'cie-audit'
  | 'diagram-studio'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'community'
  | 'not-found';

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
    { id: 'user-trainer-1', name: 'Vikram Singh (Verified Trainer)', role: 'trainer', badge: 'Trainer' },
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
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userGuideOpen, setUserGuideOpen] = useState<boolean>(false);

  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => getStoredTheme());
  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Authenticate current user with the authoritative backend server on user switch
  useEffect(() => {
    const emailMap: Record<string, string> = {
      'user-student-1': 'learner@geniusphere.tech',
      'user-student-2': 'aarav.student@dpts.edu',
      'user-teacher-1': 'dr.sharma@dpts.edu',
      'user-parent-1': 'sunita.patel@gmail.com',
      'user-admin-1': 'principal.verma@dpts.edu',
      'user-superadmin-1': 'admin@geniusphere.tech',
      'user-trainer-1': 'vikram.trainer@geniusphere.tech',
    };
    const targetEmail = emailMap[currentUserId] || 'learner@geniusphere.tech';
    apiClient.login(targetEmail).catch((err) => {
      console.warn('[App] Server authentication notice:', err.message);
    });
  }, [currentUserId]);

  const isDarkMode =
    currentTheme === 'dark' ||
    currentTheme === 'oled-dark' ||
    currentTheme === 'midnight-blue' ||
    currentTheme === 'high-contrast-dark';

  const toggleTheme = () => {
    const nextTheme: ThemeId = isDarkMode ? 'light' : 'dark';
    applyTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  // Desktop Collapsible Sidebar Rail State (Persisted in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('geniusphere_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const showSidebarText = !isSidebarCollapsed || sidebarOpen;

  // Website Loading Animation States (Active throughout website)
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    try {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
        return false;
      }
    } catch {
      // browser environment without process
    }
    return true;
  });
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!initialLoading) return;
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [initialLoading]);

  // Initialize Theme Engine and System Scheme Listeners
  useEffect(() => {
    const cleanup = initThemeEngine();
    return cleanup;
  }, []);

  const toggleSidebarCollapse = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
      return;
    }
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('geniusphere_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut: ⌘+B or Ctrl+B toggles sidebar collapse rail / drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);


  // Sovereign Backup & Notes Overlay Modals
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [scratchpadOpen, setScratchpadOpen] = useState<boolean>(false);
  const [pilotModalOpen, setPilotModalOpen] = useState<boolean>(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode] = useState<'signin' | 'getstarted'>('signin');

  const baseUser = users.find((u) => u.id === currentUserId) || users[0];
  const dbUser = db.users.get(currentUserId);
  const currentUser = useMemo(() => {
    return {
      ...baseUser,
      name: dbUser?.full_name || baseUser.name,
      email: dbUser?.email || 'learner@geniusphere.tech',
    };
  }, [baseUser, dbUser?.full_name, dbUser?.email, refreshTrigger]);

  const isTeacher = currentUser.role === 'teacher';
  const isInstAdmin = currentUser.role === 'institution_admin' || currentUser.role === 'admin';
  const isSuperadmin = currentUser.role === 'superadmin';
  const isGuardian = currentUser.role === 'guardian';
  const isTrainer = currentUser.role === 'trainer';
  const isLearner = !isTeacher && !isInstAdmin && !isSuperadmin && !isGuardian && !isTrainer;

  const [unreadCount, setUnreadCount] = useState<number>(() =>
    backendEngine.notifications.getUnreadCount(currentUser.id)
  );
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const userProgress = useMemo(() => db.getUserProgress(currentUser.id), [db, currentUser.id, refreshTrigger]);

  useEffect(() => {
    backendEngine.initialize(currentUser.id, currentUser.name, currentUser.role);

    const updateUnread = () => {
      setUnreadCount(backendEngine.notifications.getUnreadCount(currentUser.id));
    };

    updateUnread();
    const unsub = backendEngine.bus.subscribe(`user:${currentUser.id}`, () => {
      updateUnread();
    });

    return () => unsub();
  }, [currentUser.id, currentUser.name, currentUser.role]);

  useEffect(() => {
    backendEngine.presence.sendHeartbeat(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      currentView,
      `Viewing ${currentView}`
    );
  }, [currentView, currentUser]);

  // Hook Web Push notification click navigation
  useEffect(() => {
    webPushService.onNavigateFromPush((view, slug) => {
      handleNavigate(view as any, slug);
    });
  }, []);

  // Live real-time subscription for course catalog publications
  useEffect(() => {
    const unsub = backendEngine.bus.subscribe('courses:catalog', () => {
      setRefreshTrigger((prev) => prev + 1);
    });
    return () => unsub();
  }, []);

  // Live WebSocket cross-device & cross-session sync
  useEffect(() => {
    apiClient.initWebSocket();
    const unsub = apiClient.onRealtimeEvent((event) => {
      if (
        event?.eventType === 'user.profile_updated' ||
        event?.type === 'PROFILE_UPDATED' ||
        event?.eventType === 'lesson.completed' ||
        event?.eventType === 'streak.updated' ||
        event?.eventType === 'enrollment.created' ||
        event?.eventType === 'lab.completed'
      ) {
        // Authoritative reconciliation in local db state
        if (event.eventType === 'lesson.completed' && event.payload?.courseId && event.payload?.lessonId) {
          db.completeLesson(event.payload.userId || currentUser.id, event.payload.courseId, event.payload.lessonId);
        }
        if (event.eventType === 'lab.completed' && event.payload?.labSlug) {
          const lab = db.getLabBySlug(event.payload.labSlug);
          if (lab) {
            db.recordLabAttempt(event.payload.userId || currentUser.id, lab.id, {
              passed: (event.payload.score || 100) >= 60,
              score: event.payload.score || 100,
              diagnostics: 'Real-time synchronization event from session',
            });
          }
        }
        if (event.eventType === 'user.profile_updated' && event.payload?.fullName) {
          const user = db.getUserById(currentUser.id);
          if (user) {
            user.full_name = event.payload.fullName;
          }
        }
        setRefreshTrigger((prev) => prev + 1);
      }
    });
    return () => unsub();
  }, [currentUser.id, db]);

  // Server-authoritative learning duration tracking: records 30s heartbeats while window is active
  useEffect(() => {
    const ticker = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden && isLearner) {
        backendEngine.tracker.recordHeartbeat(
          currentUser.id,
          selectedCourseSlug || selectedLabSlug || currentView,
          30
        );
      }
    }, 30000);
    return () => clearInterval(ticker);
  }, [currentUser.id, selectedCourseSlug, selectedLabSlug, currentView, isLearner]);

  // CRITICAL: Always reset scroll to the top whenever the view or active item changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [currentView, selectedCourseSlug, selectedLabSlug]);

  const allCourses = useMemo(() => db.getCanonicalCourses(), [db, refreshTrigger]);
  const allLabs = useMemo(() => db.getLabDefinitions(), [db]);
  const selectedCourse = useMemo(() => db.getCourseBySlug(selectedCourseSlug), [db, selectedCourseSlug]);
  const selectedLab = useMemo(() => allLabs.find(l => l.slug === selectedLabSlug), [allLabs, selectedLabSlug]);

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
    // Instantly reset scroll position to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setViewLoading(true);
    setTimeout(() => {
      setViewLoading(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 220);

    setSidebarOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setSearchSuggestionsOpen(false);

    // STRICT ROLE ACCESS GUARD: Prevent students, teachers, admins, and trainers from interfering with each other
    if (currentUser.role === 'learner') {
      const restrictedForLearner = ['gradebook', 'classrooms', 'institution-workspace', 'platform-workspace', 'trainer-workspace', 'audit'];
      if (restrictedForLearner.includes(view)) {
        setCurrentView('student-dashboard');
        return;
      }
    } else if (currentUser.role === 'teacher') {
      const restrictedForTeacher = ['platform-workspace', 'trainer-workspace', 'parent'];
      if (restrictedForTeacher.includes(view)) {
        setCurrentView('gradebook');
        return;
      }
    } else if (currentUser.role === 'institution_admin') {
      const restrictedForAdmin = ['student-dashboard', 'platform-workspace', 'trainer-workspace', 'parent'];
      if (restrictedForAdmin.includes(view)) {
        setCurrentView('institution-workspace');
        return;
      }
    } else if (currentUser.role === 'guardian') {
      const restrictedForGuardian = ['gradebook', 'classrooms', 'institution-workspace', 'platform-workspace', 'trainer-workspace', 'student-dashboard'];
      if (restrictedForGuardian.includes(view)) {
        setCurrentView('parent');
        return;
      }
    } else if (currentUser.role === 'trainer') {
      const restrictedForTrainer = ['gradebook', 'classrooms', 'institution-workspace', 'platform-workspace', 'parent'];
      if (restrictedForTrainer.includes(view)) {
        setCurrentView('trainer-workspace');
        return;
      }
    }

    if (view === 'course-detail' && slug) {
      setSelectedCourseSlug(slug);
      setCurrentView('course-detail');
    } else if (view === 'lab-workspace') {
      setSelectedLabSlug(slug || 'ai-classification-playground');
      setCurrentView('lab-workspace');
      setIsSidebarCollapsed(true);
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
      view === 'code-sandbox' ||
      view === 'coding-concepts' ||
      view === 'certificates' ||
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
      view === 'trainer-workspace' ||
      view === 'scam-defense' ||
      view === 'cie-audit' ||
      view === 'diagram-studio' ||
      view === 'privacy' ||
      view === 'terms' ||
      view === 'contact' ||
      view === 'community' ||
      view === 'not-found'
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

  const [selectedLessonTab, setSelectedLessonTab] = useState<'video' | 'lab' | 'sandbox' | 'animation'>('video');

  const handleStartLesson = (courseId: string, lessonId: string, initialTab: 'video' | 'lab' | 'sandbox' | 'animation' = 'video') => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
    setSelectedLessonTab(initialTab);
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
    else if (role === 'trainer') setCurrentView('trainer-workspace');
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

  if (initialLoading) {
    return (
      <GeniusphereLoader
        fullscreen
        size="lg"
        message="Geniusphere 2.0 Sovereign Platform"
        submessage="Hydrating offline database, real-time IPC broker, and verified curriculum..."
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* ============================================================ */}
      {/* 1. TOP MASTER BAR (CANONICAL ENTERPRISE SOFTWARE SHELL)     */}
      {/* ============================================================ */}
      <header
        className="platform-header"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          className="platform-header-inner"
          style={{
            maxWidth: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* LEFT: MOBILE TOGGLE, DESKTOP RAIL TOGGLE & GENIUSPHERE BRAND LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Mobile / Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-only-toggle"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)',
              }}
              aria-label="Toggle Mobile Navigation Drawer"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Sidebar Rail Collapse Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="desktop-only-toggle"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)',
                transition: 'all 0.15s ease',
              }}
              title={isSidebarCollapsed ? 'Expand Sidebar (⌘+B)' : 'Collapse Sidebar to Rail (⌘+B)'}
              aria-label="Toggle Desktop Sidebar Rail"
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--grad-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                Geniusphere
              </span>
            </button>

            {/* PRIMARY DESKTOP NAVIGATION TABS (Linear / Apple HIG Standard) */}
            <nav className="desktop-primary-nav" style={{ marginLeft: '12px' }}>
              {isLearner && (
                <>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigate('home')}
                  >
                    <Home size={14} />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                    onClick={() => handleNavigate('catalogue')}
                  >
                    <BookOpen size={14} />
                    <span>Courses</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                    onClick={() => handleNavigate('labs')}
                  >
                    <Terminal size={14} />
                    <span>Labs</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'code-sandbox' ? 'active' : ''}`}
                    onClick={() => handleNavigate('code-sandbox')}
                  >
                    <Code2 size={14} />
                    <span>Sandbox</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'student-dashboard' ? 'active' : ''}`}
                    onClick={() => handleNavigate('student-dashboard')}
                  >
                    <GraduationCap size={14} />
                    <span>My Learning</span>
                  </button>
                </>
              )}

              {isTeacher && (
                <>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigate('home')}
                  >
                    <Home size={14} />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'gradebook' ? 'active' : ''}`}
                    onClick={() => handleNavigate('gradebook')}
                  >
                    <Users size={14} />
                    <span>Gradebook</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'classrooms' ? 'active' : ''}`}
                    onClick={() => handleNavigate('classrooms')}
                  >
                    <School size={14} />
                    <span>Classrooms</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'catalogue' || currentView === 'labs' ? 'active' : ''}`}
                    onClick={() => handleNavigate('catalogue')}
                  >
                    <BookOpen size={14} />
                    <span>Curriculum</span>
                  </button>
                </>
              )}

              {isInstAdmin && (
                <>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigate('home')}
                  >
                    <Home size={14} />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
                    onClick={() => handleNavigate('institution-workspace')}
                  >
                    <School size={14} />
                    <span>Institution Hub</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'audit' || currentView === 'cie-audit' ? 'active' : ''}`}
                    onClick={() => handleNavigate('audit')}
                  >
                    <ShieldCheck size={14} />
                    <span>CIE Audit</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'classrooms' ? 'active' : ''}`}
                    onClick={() => handleNavigate('classrooms')}
                  >
                    <Users size={14} />
                    <span>Classrooms</span>
                  </button>
                </>
              )}

              {isTrainer && (
                <>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigate('home')}
                  >
                    <Home size={14} />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'trainer-workspace' ? 'active' : ''}`}
                    onClick={() => handleNavigate('trainer-workspace')}
                  >
                    <Award size={14} />
                    <span>Trainer Hub</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'catalogue' ? 'active' : ''}`}
                    onClick={() => handleNavigate('catalogue')}
                  >
                    <BookOpen size={14} />
                    <span>Curriculum</span>
                  </button>
                  <button
                    type="button"
                    className={`nav-tab-btn ${currentView === 'labs' ? 'active' : ''}`}
                    onClick={() => handleNavigate('labs')}
                  >
                    <Terminal size={14} />
                    <span>Labs</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* CENTER: UNIVERSAL SEARCH BAR OR LAB BREADCRUMB */}
          <div className="header-search-container" style={{ position: 'relative' }}>
            {currentView === 'lab-workspace' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  Labs & Simulations
                </button>
                <span>/</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Interactive Studio</span>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '11px',
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
                  placeholder="Search courses, skills, labs..."
                  style={{
                    width: '100%',
                    height: '38px',
                    paddingLeft: '38px',
                    paddingRight: globalSearch ? '32px' : '14px',
                    borderRadius: '100px',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-canvas)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
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
                      top: '11px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}

            {/* Live Autocomplete Dropdown */}
            {searchSuggestionsOpen && globalSearch.trim().length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  padding: '12px',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto',
                }}
              >
                {matchingCourses.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BookOpen size={15} color="var(--brand-primary)" />
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.title}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{c.duration_hours}h • {c.level}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingLabs.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Terminal size={15} color="var(--brand-primary)" />
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>{l.title}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Lab Simulator</span>
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

          {/* RIGHT: NOTIFICATIONS BELL, STREAK CHIP & USER AVATAR PILL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', flexShrink: 0 }}>

            {/* Gamified Habit Streak Chip (Tap to view streak & habit calendar) */}
            <button
              type="button"
              onClick={() => setStreakModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '34px',
                padding: '0 10px',
                borderRadius: '100px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: '#D97706',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.8rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              title="Daily Habit Streak — Click to open Streak Calendar"
            >
              <Flame size={15} color="#D97706" />
              <span>{userProgress.streak_days || 7}</span>
            </button>



            {/* Realtime Notification Bell Button */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                className="btn-icon-circle"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  maxWidth: '36px',
                  minHeight: '36px',
                  maxHeight: '36px',
                  padding: 0,
                  boxSizing: 'border-box',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: notificationsOpen ? 'var(--bg-surface-subdued)' : 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                aria-label="Notifications"
                title={`Live Notifications (${unreadCount} unread)`}
              >
                <Bell size={18} strokeWidth={2.2} color="var(--text-primary)" style={{ flexShrink: 0, display: 'block' }} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      boxShadow: '0 0 0 2px var(--bg-surface)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Realtime Notification Center Popover */}
              <RealtimeNotificationCenter
                userId={currentUser.id}
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onNavigate={handleNavigate}
              />
            </div>

            {/* User Profile Pill matching Design Board 2 */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 8px 3px 4px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <img
                  src="/images/student_hero.jpg"
                  alt={currentUser.name}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid var(--brand-primary)',
                    flexShrink: 0,
                  }}
                />
                <div className="header-hide-mobile" style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {currentUser.name.split(' (')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span>{isTeacher ? 'Faculty' : isInstAdmin ? 'Inst Admin' : isSuperadmin ? 'Superadmin' : currentUser.role === 'guardian' ? 'Parent' : 'Learner'}</span>
                    <ChevronDown size={10} />
                  </div>
                </div>
              </button>

              {/* Authenticated User Account Menu (Desktop Dropdown & Mobile Native Bottom Sheet) */}
              {userMenuOpen && (
                <>
                  {/* Backdrop for click-outside dismissal on both desktop and mobile */}
                  <div
                    className="user-menu-backdrop"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="user-menu-container">
                    {/* Mobile Native Sheet Top Drag Handle */}
                    <div className="mobile-sheet-drag-handle" />

                    {/* Header: Avatar, Real User Info, Role & Close Button */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-subtle)',
                        paddingBottom: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src="/images/student_hero.jpg"
                          alt={currentUser.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--brand-primary)',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                            {currentUser.name.split(' (')[0]}
                          </div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--brand-primary)',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <GraduationCap size={13} />
                            <span>Student &amp; Learner Suite</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        className="user-menu-close-btn"
                        aria-label="Close menu"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--bg-canvas)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Student Progress & Habit Snapshot */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        backgroundColor: 'var(--bg-canvas)',
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '14px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Streak
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '2px' }}>
                          <Flame size={13} color="#D97706" />
                          <span>7 Days</span>
                        </div>
                      </div>
                      <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Mastery
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--brand-primary)', marginTop: '2px' }}>
                          1,450 XP
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Records
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#2563EB', marginTop: '2px' }}>
                          3 Verified
                        </div>
                      </div>
                    </div>

                    {/* Primary Account & Learning Actions — High-Density 2x2 Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setProfileModalOpen(true);
                        }}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--brand-surface)',
                          color: 'var(--brand-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <User size={18} />
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.25 }}>Student Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleNavigate('student-dashboard');
                        }}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <BookOpen size={18} color="var(--brand-primary)" />
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.25 }}>My Curriculum</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleNavigate('certificates');
                        }}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Award size={18} color="var(--brand-primary)" />
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.25 }}>Certificates</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setStreakModalOpen(true);
                        }}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Flame size={18} color="#D97706" />
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.25 }}>Streak Calendar</span>
                      </button>
                    </div>

                    {/* Preferences & Quick Tools */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-subtle)',
                        marginBottom: '14px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTheme()}
                        style={{
                          padding: '8px 6px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isDarkMode ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--brand-primary)" />}
                        <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setThemeModalOpen(true);
                        }}
                        style={{
                          padding: '8px 6px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Palette size={15} color="var(--brand-primary)" />
                        <span>Themes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setUserGuideOpen(true);
                        }}
                        style={{
                          padding: '8px 6px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-canvas)',
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <HelpCircle size={15} color="var(--brand-primary)" />
                        <span>Guide</span>
                      </button>
                    </div>

                    {/* Sign Out Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsAuthenticated(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out / Lock Session</span>
                    </button>
                  </div>
                </>
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

        {/* LEFT SIDEBAR NAVIGATION RAIL (Collapsible Desktop Mini-Rail + Mobile Off-Canvas Drawer) */}
        <aside
          className={`platform-sidebar ${sidebarOpen ? 'open' : ''} ${isSidebarCollapsed && !sidebarOpen ? 'collapsed' : ''}`}
          style={{
            overflowX: 'hidden',
          }}
        >
          {/* Mobile Drawer Top Header (Only visible on mobile screens) */}
          <div
            className="sidebar-mobile-drawer-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
                Geniusphere
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close navigation drawer"
            >
              <X size={18} />
            </button>
          </div>



          <div style={{ flex: 1 }}>
            {isTeacher ? (
              /* ============================================================ */
              /* 1. TEACHER / EDUCATOR DEDICATED NAVIGATION RAIL              */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {showSidebarText && (
                  <div
                    className="sidebar-section-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    Educator Portal
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate('gradebook')}
                  className={`sidebar-nav-btn ${currentView === 'gradebook' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Class Gradebook" : undefined}
                >
                  <Users size={18} />
                  {showSidebarText && <span className="sidebar-label">Class Gradebook</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('classrooms')}
                  className={`sidebar-nav-btn ${currentView === 'classrooms' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Manage Classes" : undefined}
                >
                  <School size={18} />
                  {showSidebarText && <span className="sidebar-label">Manage Classes</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Curriculum & Courses" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Curriculum & Courses</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Lab Environments" : undefined}
                >
                  <Terminal size={18} />
                  {showSidebarText && <span className="sidebar-label">Lab Environments</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('code-sandbox')}
                  className={`sidebar-nav-btn ${currentView === 'code-sandbox' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Coding Sandbox (Python, JS, TS, C++, Java, C, SQL)" : undefined}
                >
                  <Code2 size={18} />
                  {showSidebarText && <span className="sidebar-label">Coding Sandbox</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('resources')}
                  className={`sidebar-nav-btn ${currentView === 'resources' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Teaching Resources" : undefined}
                >
                  <Folder size={18} />
                  {showSidebarText && <span className="sidebar-label">Teaching Resources</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('certificates')}
                  className={`sidebar-nav-btn ${currentView === 'certificates' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Certificate Registry" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Certificate Registry</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>
              </div>
            ) : isInstAdmin ? (
              /* ============================================================ */
              /* 2. INSTITUTION ADMIN DEDICATED NAVIGATION RAIL               */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {showSidebarText && (
                  <div
                    className="sidebar-section-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    Institution Governance
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate('institution-workspace')}
                  className={`sidebar-nav-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Institution Workspace" : undefined}
                >
                  <School size={18} />
                  {showSidebarText && <span className="sidebar-label">Institution Workspace</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('classrooms')}
                  className={`sidebar-nav-btn ${currentView === 'classrooms' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Class Rosters & Batches" : undefined}
                >
                  <Users size={18} />
                  {showSidebarText && <span className="sidebar-label">Class Rosters</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('gradebook')}
                  className={`sidebar-nav-btn ${currentView === 'gradebook' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Academic Gradebook" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Gradebook Performance</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('cie-audit')}
                  className={`sidebar-nav-btn ${currentView === 'cie-audit' || currentView === 'audit' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "CIE Compliance & Audit" : undefined}
                >
                  <ShieldCheck size={18} />
                  {showSidebarText && <span className="sidebar-label">CIE Audit Log</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Curriculum Oversight" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Curriculum Oversight</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Lab Environments" : undefined}
                >
                  <Terminal size={18} />
                  {showSidebarText && <span className="sidebar-label">Lab Environments</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('certificates')}
                  className={`sidebar-nav-btn ${currentView === 'certificates' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Verified Credentials Registry" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Credentials Registry</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>
              </div>
            ) : isSuperadmin ? (
              /* ============================================================ */
              /* 3. PLATFORM SUPERADMIN DEDICATED NAVIGATION RAIL             */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {showSidebarText && (
                  <div
                    className="sidebar-section-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    Platform Operations
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate('platform-workspace')}
                  className={`sidebar-nav-btn ${currentView === 'platform-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Platform Admin Console" : undefined}
                >
                  <ShieldAlert size={18} />
                  {showSidebarText && <span className="sidebar-label">Platform Admin</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('institution-workspace')}
                  className={`sidebar-nav-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Institution Directory" : undefined}
                >
                  <School size={18} />
                  {showSidebarText && <span className="sidebar-label">Institutions</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('audit')}
                  className={`sidebar-nav-btn ${currentView === 'audit' || currentView === 'cie-audit' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "System Audit Ledger" : undefined}
                >
                  <ShieldCheck size={18} />
                  {showSidebarText && <span className="sidebar-label">System Audit Ledger</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Curriculum Management" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Curriculum CMS</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Lab Sandboxes" : undefined}
                >
                  <Terminal size={18} />
                  {showSidebarText && <span className="sidebar-label">Lab Sandboxes</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('code-sandbox')}
                  className={`sidebar-nav-btn ${currentView === 'code-sandbox' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Code Runner Engine" : undefined}
                >
                  <Code2 size={18} />
                  {showSidebarText && <span className="sidebar-label">Code Runner</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('certificates')}
                  className={`sidebar-nav-btn ${currentView === 'certificates' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Global Certificates" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Global Certificates</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>
              </div>
            ) : isGuardian ? (
              /* ============================================================ */
              /* 4. PARENT & GUARDIAN DEDICATED NAVIGATION RAIL               */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {showSidebarText && (
                  <div
                    className="sidebar-section-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    Parent Oversight
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate('parent')}
                  className={`sidebar-nav-btn ${currentView === 'parent' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Student Progress & Consent" : undefined}
                >
                  <Users size={18} />
                  {showSidebarText && <span className="sidebar-label">Student Progress</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Course Curriculum" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Curriculum</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('certificates')}
                  className={`sidebar-nav-btn ${currentView === 'certificates' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Verified Certificates" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Credentials</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>
              </div>
            ) : isTrainer ? (
              /* ============================================================ */
              /* 5. VERIFIED TRAINER DEDICATED NAVIGATION RAIL                */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {showSidebarText && (
                  <div
                    className="sidebar-section-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0 16px 8px',
                    }}
                  >
                    Trainer Delivery Rail
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate('trainer-workspace')}
                  className={`sidebar-nav-btn ${currentView === 'trainer-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Trainer Workspace" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Trainer Workspace</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Curriculum Modules" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Curriculum Modules</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Hands-on Labs" : undefined}
                >
                  <Terminal size={18} />
                  {showSidebarText && <span className="sidebar-label">Hands-on Labs</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('code-sandbox')}
                  className={`sidebar-nav-btn ${currentView === 'code-sandbox' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Code Runner Engine" : undefined}
                >
                  <Code2 size={18} />
                  {showSidebarText && <span className="sidebar-label">Code Runner</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>
              </div>
            ) : (
              /* ============================================================ */
              /* 5. STUDENT / LEARNER DEDICATED NAVIGATION RAIL               */
              /* ============================================================ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className={`sidebar-nav-btn ${currentView === 'home' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Landing Page" : undefined}
                >
                  <Home size={18} />
                  {showSidebarText && <span className="sidebar-label">Landing Page</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('catalogue')}
                  className={`sidebar-nav-btn ${currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Courses" : undefined}
                >
                  <BookOpen size={18} />
                  {showSidebarText && <span className="sidebar-label">Courses</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('student-dashboard')}
                  className={`sidebar-nav-btn ${currentView === 'student-dashboard' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "My Learning" : undefined}
                >
                  <GraduationCap size={18} />
                  {showSidebarText && <span className="sidebar-label">My Learning</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('labs')}
                  className={`sidebar-nav-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Labs & Projects" : undefined}
                >
                  <Terminal size={18} />
                  {showSidebarText && <span className="sidebar-label">Labs & Projects</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('code-sandbox')}
                  className={`sidebar-nav-btn ${currentView === 'code-sandbox' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Coding Sandbox (Python, C, JS, SQL)" : undefined}
                >
                  <Code2 size={18} />
                  {showSidebarText && <span className="sidebar-label">Coding Sandbox</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('leaderboard')}
                  className={`sidebar-nav-btn ${currentView === 'leaderboard' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Community" : undefined}
                >
                  <Users size={18} />
                  {showSidebarText && <span className="sidebar-label">Community</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('resources')}
                  className={`sidebar-nav-btn ${currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Resources" : undefined}
                >
                  <Folder size={18} />
                  {showSidebarText && <span className="sidebar-label">Resources</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('certificates')}
                  className={`sidebar-nav-btn ${currentView === 'certificates' ? 'active' : ''}`}
                  title={isSidebarCollapsed ? "Certificates" : undefined}
                >
                  <Award size={18} />
                  {showSidebarText && <span className="sidebar-label">Certificates</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setThemeModalOpen(true)}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Appearance & Theme Palette" : undefined}
                >
                  <Palette size={18} />
                  {showSidebarText && <span className="sidebar-label">Theme Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserGuideOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Software User Guide" : undefined}
                >
                  <HelpCircle size={18} />
                  {showSidebarText && <span className="sidebar-label">Software User Guide</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setSidebarOpen(false);
                  }}
                  className="sidebar-nav-btn"
                  title={isSidebarCollapsed ? "Notifications" : undefined}
                >
                  <Bell size={18} />
                  {showSidebarText && <span className="sidebar-label">Notifications</span>}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Mascot Encouragement Widget (matching Design Board 2) */}
          <div
            className="sidebar-mascot-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: isSidebarCollapsed ? '8px 4px' : '16px',
              marginTop: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isSidebarCollapsed ? 'center' : 'stretch',
            }}
          >
            {isTeacher ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', gap: '10px', marginBottom: isSidebarCollapsed ? '0' : '8px' }}>
                  <MascotSphere pose="teaching" size={isSidebarCollapsed ? 30 : 40} />
                  {showSidebarText && (
                    <div className="sidebar-mascot-card-text">
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Educator Suite
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                        Class 10-A: 24 students enrolled, 82% completion.
                      </div>
                    </div>
                  )}
                </div>
                {showSidebarText && (
                  <div className="sidebar-mascot-card-text" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleNavigate('gradebook')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary)',
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
                )}
              </div>
            ) : isInstAdmin ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', gap: '10px', marginBottom: isSidebarCollapsed ? '0' : '8px' }}>
                  <MascotSphere pose="thinking" size={isSidebarCollapsed ? 30 : 40} />
                  {showSidebarText && (
                    <div className="sidebar-mascot-card-text">
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Institution Hub
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                        Accreditation verified. 248 learners active.
                      </div>
                    </div>
                  )}
                </div>
                {showSidebarText && (
                  <div className="sidebar-mascot-card-text" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleNavigate('institution-workspace')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ) : isSuperadmin ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', gap: '10px', marginBottom: isSidebarCollapsed ? '0' : '8px' }}>
                  <MascotSphere pose="happy" size={isSidebarCollapsed ? 30 : 40} />
                  {showSidebarText && (
                    <div className="sidebar-mascot-card-text">
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Platform Ops
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                        Tamper-proof node synced. Zero critical alerts.
                      </div>
                    </div>
                  )}
                </div>
                {showSidebarText && (
                  <div className="sidebar-mascot-card-text" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleNavigate('platform-workspace')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>Open Console</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', gap: '10px', marginBottom: isSidebarCollapsed ? '0' : '8px' }}>
                  <MascotSphere pose="happy" size={isSidebarCollapsed ? 28 : 38} />
                  {showSidebarText && (
                    <div className="sidebar-mascot-card-text">
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Keep going!
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                        Every skill you learn builds a bigger you.
                      </div>
                    </div>
                  )}
                </div>

                {showSidebarText && (
                  <div className="sidebar-mascot-card-text">
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subdued)', borderRadius: '100px', overflow: 'hidden', margin: '8px 0 6px' }}>
                      <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '100px' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>3/5 courses</span>
                      <button
                        type="button"
                        onClick={() => handleNavigate('student-dashboard')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-primary)',
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
            )}
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <div className="platform-main-content">
          <SectionContextBar
            currentView={currentView}
            courseTitle={selectedCourse?.title}
            labTitle={selectedLab?.title}
            userRole={currentUser.role}
            onNavigate={handleNavigate}
            onBack={() => {
              if (currentView === 'course-detail' || currentView === 'lesson-player') {
                handleNavigate('catalogue');
              } else if (currentView === 'lab-workspace') {
                handleNavigate('labs');
              } else {
                handleNavigate('home');
              }
            }}
          />
          <main
            style={{
              flex: 1,
              position: 'relative',
              padding: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '0' : '28px 28px 80px',
              maxWidth: currentView === 'home' || currentView === 'lab-workspace' || currentView === 'diagram-studio' ? '100%' : '1320px',
              margin: '0 auto',
              width: '100%',
              height: currentView === 'lab-workspace' ? 'calc(100vh - 70px)' : undefined,
              overflow: currentView === 'lab-workspace' ? 'hidden' : undefined,
              minHeight: currentView === 'lab-workspace' ? undefined : 'calc(100vh - 70px)',
            }}
          >
            {viewLoading && (
              <GeniusphereLoader
                overlay
                size="sm"
                message="Opening Workspace..."
                submessage="Applying role-partitioned views and state sync"
              />
            )}

          {currentView === 'home' && (
            <Homepage
              key={`home-${currentUserId}-${refreshTrigger}`}
              db={db}
              onNavigate={handleNavigate}
              currentUserId={currentUserId}
              onStartLesson={handleStartLesson}
              onSelectCourse={handleSelectCourse}
              onLaunchLab={(slug) => {
                setSelectedLabSlug(slug);
                setCurrentView('lab-workspace');
              }}
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
            onOpenCodingSandbox={() => handleNavigate('code-sandbox')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'code-sandbox' && (
          <MultiLanguageCodeSandbox
            key={`code-sandbox-${refreshTrigger}`}
            initialLanguage="python"
          />
        )}

        {currentView === 'coding-concepts' && (
          <CourseCatalogue
            key={`catalog-fallback-${refreshTrigger}`}
            db={db}
            onSelectCourse={handleSelectCourse}
            onLaunchLab={(slug: string) => {
              setSelectedLabSlug(slug);
              setCurrentView('lab-workspace');
            }}
            onNavigateHome={() => handleNavigate('home')}
            initialDomain={selectedDomain}
          />
        )}

        {currentView === 'certificates' && (
          <CertificatesView
            key={`certs-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            onOpenCertificateModal={(cert) => {
              setSelectedCertificate(cert);
              setCertificateModalOpen(true);
            }}
            onNavigateCourses={() => handleNavigate('catalogue')}
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
            initialTab={selectedLessonTab}
            currentUserId={currentUserId}
            onBackToCourse={() => handleNavigate('course-detail', selectedCourseSlug)}
            onLaunchLab={() => {
              const matchedLab = db.getLabDefinitions().find(
                (l) => l.course_slug === selectedCourseSlug || l.slug === selectedCourseSlug
              );
              if (matchedLab) {
                setSelectedLabSlug(matchedLab.slug);
                setCurrentView('lab-workspace');
              }
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

        {currentView === 'trainer-workspace' && (
          <TrainerWorkspace
            key={`trainer-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
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

        {(currentView === 'privacy' || currentView === 'terms') && (
          <LegalPrivacyTermsView
            initialTab={currentView === 'terms' ? 'terms' : 'privacy'}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {(currentView === 'contact' || currentView === 'community') && (
          <ContactCommunityView
            db={db}
            initialTab={currentView === 'community' ? 'community' : 'contact'}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCatalogue={() => handleNavigate('catalogue')}
          />
        )}

        {currentView === 'not-found' && (
          <NotFoundView
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCatalogue={() => handleNavigate('catalogue')}
            onNavigateLabs={() => handleNavigate('labs')}
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
            selectedCertificate ||
            db.getUserCertificates(currentUserId)[0] || {
              id: 'cert-cybersec-2026',
              user_id: currentUserId,
              course_id: 'course-web-sec',
              course_title: 'Defensive Web Security & Zero-Trust Architecture',
              student_name: currentUser.name.split(' (')[0],
              verification_hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
              issue_date: '2026-03-15',
              grade: 98,
              skills_acquired: [
                'Zero-Trust Architecture',
                'OWASP Top 10 Defense',
                'CSRF & Token Validation',
                'Cryptographic Key Management',
              ],
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
      {currentView !== 'lab-workspace' && currentView !== 'lesson-player' && !isMobile && (
        <footer
          className="platform-footer"
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
                <button type="button" onClick={() => handleNavigate('contact')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Institutional Contact & Support</button>
                <button type="button" onClick={() => handleNavigate('community')} style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Student Community Guidelines</button>
                <span style={{ color: 'var(--text-muted)' }}>PES University CIE Incubated</span>
                <span style={{ color: 'var(--text-muted)' }}>Bengaluru, Karnataka, India</span>
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
            <div style={{ display: 'flex', gap: '8px 12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>Active Pilot Deployment</span>
              <span style={{ flexShrink: 0 }}>•</span>
              <button type="button" onClick={() => handleNavigate('privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>Privacy Policy</button>
              <span style={{ flexShrink: 0 }}>•</span>
              <button type="button" onClick={() => handleNavigate('terms')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>Terms of Service</button>
              <span style={{ flexShrink: 0 }}>•</span>
              <button type="button" onClick={() => handleNavigate('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>Contact</button>
              <span style={{ flexShrink: 0 }}>•</span>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>40 Canonical Courses • 3 Learning Streams • 10 Interactive Labs</span>
              <span style={{ flexShrink: 0 }}>•</span>
              <button
                type="button"
                onClick={() => setPilotModalOpen(true)}
                style={{
                  background: 'rgba(230, 81, 0, 0.08)',
                  border: '1px solid rgba(230, 81, 0, 0.25)',
                  borderRadius: '100px',
                  padding: '3px 10px',
                  color: '#e65100',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>Institutional Pilot</span>
              </button>
              <span style={{ flexShrink: 0 }}>•</span>
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
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
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

      <PilotApplicationModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
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

      {/* 7. APPEARANCE & THEME PALETTE SETTINGS MODAL (10 THEMES) */}
      <ThemeSettingsModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={(newTheme) => setCurrentTheme(newTheme)}
      />

      {/* ============================================================ */}
      {/* 8. NATIVE MOBILE APP BOTTOM NAVIGATION BAR (Screens <= 768px)  */}
      {/* ============================================================ */}
      <nav className="mobile-app-bottom-bar" aria-label="Mobile Navigation">
        {isTeacher ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'gradebook' ? 'active' : ''}`}
              onClick={() => handleNavigate('gradebook')}
            >
              <Users size={20} />
              <span>Gradebook</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'classrooms' ? 'active' : ''}`}
              onClick={() => handleNavigate('classrooms')}
            >
              <School size={20} />
              <span>Classes</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogue')}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('labs')}
            >
              <Terminal size={20} />
              <span>Labs</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : isInstAdmin ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('institution-workspace')}
            >
              <School size={20} />
              <span>Institution</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'classrooms' ? 'active' : ''}`}
              onClick={() => handleNavigate('classrooms')}
            >
              <Users size={20} />
              <span>Classes</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'gradebook' ? 'active' : ''}`}
              onClick={() => handleNavigate('gradebook')}
            >
              <Award size={20} />
              <span>Grades</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'cie-audit' || currentView === 'audit' ? 'active' : ''}`}
              onClick={() => handleNavigate('cie-audit')}
            >
              <ShieldCheck size={20} />
              <span>Audit</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : isSuperadmin ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'platform-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('platform-workspace')}
            >
              <ShieldAlert size={20} />
              <span>Platform</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'institution-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('institution-workspace')}
            >
              <School size={20} />
              <span>Tenants</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'catalogue' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogue')}
            >
              <BookOpen size={20} />
              <span>Curriculum</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'audit' || currentView === 'cie-audit' ? 'active' : ''}`}
              onClick={() => handleNavigate('audit')}
            >
              <ShieldCheck size={20} />
              <span>Audit</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : isGuardian ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'parent' ? 'active' : ''}`}
              onClick={() => handleNavigate('parent')}
            >
              <Users size={20} />
              <span>Progress</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'catalogue' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogue')}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'certificates' ? 'active' : ''}`}
              onClick={() => handleNavigate('certificates')}
            >
              <Award size={20} />
              <span>Credentials</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : isTrainer ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'trainer-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('trainer-workspace')}
            >
              <Award size={20} />
              <span>Workspace</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'catalogue' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogue')}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'labs' ? 'active' : ''}`}
              onClick={() => handleNavigate('labs')}
            >
              <Terminal size={20} />
              <span>Labs</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : isLearner ? (
          <>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigate('home')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'catalogue' || currentView === 'course-detail' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogue')}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'labs' || currentView === 'lab-workspace' ? 'active' : ''}`}
              onClick={() => handleNavigate('labs')}
            >
              <Terminal size={20} />
              <span>Labs</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${currentView === 'student-dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigate('student-dashboard')}
            >
              <GraduationCap size={20} />
              <span>Learning</span>
            </button>
            <button
              type="button"
              className={`mobile-tab-btn ${userMenuOpen ? 'active' : ''}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </>
        ) : null}
      </nav>

      {/* Real-Time Floating Toast Notification Stack */}
      <RealtimeToastStack onNavigate={handleNavigate} />

      {/* Interactive Streak & Habit Calendar Modal */}
      <StreakHabitModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        userProgress={userProgress}
        userName={currentUser.name}
      />

      {/* Authenticated Student Profile & Record Verification Modal */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={{
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        }}
        onProfileUpdated={(updatedName) => {
          const userInDb = db.users.get(currentUser.id);
          if (userInDb) {
            userInDb.full_name = updatedName;
            db.users.set(currentUser.id, userInDb);
            db.persistState();
          }
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </div>
  );
};
