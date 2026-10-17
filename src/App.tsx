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
      {/* ============================================================ */}
      {/* 1. TOP PRIMARY NAVIGATION BAR                                */}
      {/* ============================================================ */}
      <header
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
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
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    GENIUSPHERE
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    PILOT
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Evidence-Backed Education Platform
                </div>
              </div>
            </button>
          </div>

          {/* RIGHT: PRIMARY NAVIGATION LINKS & ACTIONS (DESKTOP) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Desktop Navigation Links */}
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
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  color: currentView === 'home' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'home' ? 700 : 500,
                  borderBottom: currentView === 'home' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                  borderRadius: 0,
                  fontSize: '0.9rem',
                }}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('catalogue')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  color: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 700 : 500,
                  borderBottom: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                  borderRadius: 0,
                  fontSize: '0.9rem',
                }}
              >
                Courses
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('labs')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  color: currentView === 'labs' || currentView === 'lab-workspace' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'labs' || currentView === 'lab-workspace' ? 700 : 500,
                  borderBottom: currentView === 'labs' || currentView === 'lab-workspace' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                  borderRadius: 0,
                  fontSize: '0.9rem',
                }}
              >
                Labs
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('resources')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  color: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? 700 : 500,
                  borderBottom: currentView === 'resources' || currentView === 'schoolkit' || currentView === 'resume-builder' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                  borderRadius: 0,
                  fontSize: '0.9rem',
                }}
              >
                Resources
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('about')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  color: currentView === 'about' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'about' ? 700 : 500,
                  borderBottom: currentView === 'about' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
                  borderRadius: 0,
                  fontSize: '0.9rem',
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
            onLaunchLab={() => {}}
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
      {/* 5. GLOBAL FOOTER                                             */}
      {/* ============================================================ */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>© {new Date().getFullYear()} Geniusphere. Evidence-Backed Education Platform.</span>
          <span>Four Core Disciplines • 27 Approved Curricular Courses • Zero Fabricated Data</span>
        </div>
      </footer>
    </div>
  );
};
