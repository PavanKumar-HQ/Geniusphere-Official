import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from './db/in-memory-db';
import { Homepage } from './components/Homepage';
import { CourseCatalogue } from './components/CourseCatalogue';
import { CourseDetailView } from './components/CourseDetailView';
import { LessonPlayer } from './components/LessonPlayer';
import { SqlLab } from './components/SqlLab';
import { TeacherGradebook } from './components/TeacherGradebook';
import { ClassroomManager } from './components/ClassroomManager';
import { ParentPortal } from './components/ParentPortal';
import { AuditLogViewer } from './components/AuditLogViewer';
import { ResumeBuilder } from './components/ResumeBuilder';
import { SchoolKit } from './components/SchoolKit';
import { StudentDashboard } from './components/StudentDashboard';
import { InstitutionAdminWorkspace } from './components/InstitutionAdminWorkspace';
import { PlatformAdminWorkspace } from './components/PlatformAdminWorkspace';
import {
  ShieldCheck,
  Terminal,
  BookOpen,
  Users,
  User,
  GraduationCap,
  Home,
  Briefcase,
  School,
  Menu,
  X,
  Layers,
  Shield,
  LayoutDashboard,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'catalogue'
  | 'course-detail'
  | 'lesson-player'
  | 'lab'
  | 'gradebook'
  | 'classrooms'
  | 'parent'
  | 'audit'
  | 'resume-builder'
  | 'schoolkit'
  | 'student-dashboard'
  | 'institution-workspace'
  | 'platform-workspace';

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
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('web-application-defense-fundamentals');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-web-defense-101');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('lesson-wd-101');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const isTeacher = currentUser.role === 'teacher';
  const isInstAdmin = currentUser.role === 'institution_admin';
  const isSuperadmin = currentUser.role === 'superadmin';
  const isGuardian = currentUser.role === 'guardian';
  const isLearner = currentUser.role === 'learner';

  // Force re-render of dependent tabs after new submissions or enrollments
  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleNavigate = (view: string, slug?: string) => {
    setMobileMenuOpen(false);
    if (view === 'course-detail' && slug) {
      setSelectedCourseSlug(slug);
      setCurrentView('course-detail');
    } else if (view === 'catalogue') {
      if (slug) {
        setSelectedDomain(slug);
      } else {
        setSelectedDomain('all');
      }
      setCurrentView('catalogue');
    } else if (
      view === 'home' ||
      view === 'lab' ||
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Top Application Header */}
      <header
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                  color: '#FFF',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    GENIUSPHERE
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                    PILOT v0.1.0
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Evidence-Backed Education Platform • Real Persistence
                </div>
              </div>
            </button>
          </div>

          {/* Right Actions: Persona Switcher & Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <User size={16} />
              <span>Persona:</span>
            </div>
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
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface-subdued)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
              aria-label="Switch User Persona"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'inline-flex', padding: '8px', height: '36px', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Navigation Bar (Desktop & Tablet) */}
      <nav
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'home' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'home' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'home' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          {isLearner && (
            <button
              type="button"
              onClick={() => handleNavigate('student-dashboard')}
              style={{
                height: '46px',
                backgroundColor: 'transparent',
                color: currentView === 'student-dashboard' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'student-dashboard' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'student-dashboard' ? 700 : 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LayoutDashboard size={16} />
              <span>My Learning</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedDomain('all');
              handleNavigate('catalogue');
            }}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={16} />
            <span>Explore Courses (27)</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('lab')}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'lab' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'lab' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'lab' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Terminal size={16} />
            <span>SQL Lab 101</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('classrooms')}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'classrooms' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'classrooms' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'classrooms' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={16} />
            <span>Classroom & Join Codes</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('resume-builder')}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'resume-builder' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'resume-builder' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'resume-builder' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Briefcase size={16} />
            <span>Resume Builder</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('schoolkit')}
            style={{
              height: '46px',
              backgroundColor: 'transparent',
              color: currentView === 'schoolkit' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'schoolkit' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'schoolkit' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <School size={16} />
            <span>Educator SchoolKit</span>
          </button>

          {(isTeacher || isSuperadmin) && (
            <button
              type="button"
              onClick={() => handleNavigate('gradebook')}
              style={{
                height: '46px',
                backgroundColor: 'transparent',
                color: currentView === 'gradebook' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'gradebook' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'gradebook' ? 700 : 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <GraduationCap size={16} />
              <span>Teacher Gradebook</span>
            </button>
          )}

          {(isInstAdmin || isSuperadmin) && (
            <button
              type="button"
              onClick={() => handleNavigate('institution-workspace')}
              style={{
                height: '46px',
                backgroundColor: 'transparent',
                color: currentView === 'institution-workspace' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'institution-workspace' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'institution-workspace' ? 700 : 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={16} />
              <span>Institution Workspace</span>
            </button>
          )}

          {(isGuardian || isSuperadmin) && (
            <button
              type="button"
              onClick={() => handleNavigate('parent')}
              style={{
                height: '46px',
                backgroundColor: 'transparent',
                color: currentView === 'parent' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'parent' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'parent' ? 700 : 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={16} />
              <span>Parent Oversight</span>
            </button>
          )}

          {isSuperadmin && (
            <button
              type="button"
              onClick={() => handleNavigate('platform-workspace')}
              style={{
                height: '46px',
                backgroundColor: 'transparent',
                color: currentView === 'platform-workspace' ? '#DC2626' : 'var(--text-secondary)',
                borderBottom: currentView === 'platform-workspace' ? '3px solid #DC2626' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'platform-workspace' ? 700 : 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={16} />
              <span>Platform Ops</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '2px solid var(--border-strong)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Navigation Routes
          </div>
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('home')} style={{ justifyContent: 'flex-start' }}>
            <Home size={16} /> Home
          </button>
          {isLearner && (
            <button type="button" className="btn-secondary" onClick={() => handleNavigate('student-dashboard')} style={{ justifyContent: 'flex-start' }}>
              <LayoutDashboard size={16} /> My Learning Dashboard
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('catalogue')} style={{ justifyContent: 'flex-start' }}>
            <BookOpen size={16} /> Explore 27 Courses
          </button>
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('lab')} style={{ justifyContent: 'flex-start' }}>
            <Terminal size={16} /> Interactive SQL Lab 101
          </button>
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('classrooms')} style={{ justifyContent: 'flex-start' }}>
            <Users size={16} /> Classrooms & Join Codes
          </button>
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('resume-builder')} style={{ justifyContent: 'flex-start' }}>
            <Briefcase size={16} /> Resume Builder
          </button>
          <button type="button" className="btn-secondary" onClick={() => handleNavigate('schoolkit')} style={{ justifyContent: 'flex-start' }}>
            <School size={16} /> Educator SchoolKit
          </button>
          {(isTeacher || isSuperadmin) && (
            <button type="button" className="btn-secondary" onClick={() => handleNavigate('gradebook')} style={{ justifyContent: 'flex-start' }}>
              <GraduationCap size={16} /> Teacher Gradebook
            </button>
          )}
          {(isInstAdmin || isSuperadmin) && (
            <button type="button" className="btn-secondary" onClick={() => handleNavigate('institution-workspace')} style={{ justifyContent: 'flex-start' }}>
              <Layers size={16} /> Institution Workspace
            </button>
          )}
          {(isGuardian || isSuperadmin) && (
            <button type="button" className="btn-secondary" onClick={() => handleNavigate('parent')} style={{ justifyContent: 'flex-start' }}>
              <Shield size={16} /> Parent Oversight Portal
            </button>
          )}
          {isSuperadmin && (
            <button type="button" className="btn-secondary" onClick={() => handleNavigate('platform-workspace')} style={{ justifyContent: 'flex-start' }}>
              <Shield size={16} /> Platform Operations
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: currentView === 'home' ? '0' : '28px 24px', maxWidth: currentView === 'home' ? '100%' : '1280px', margin: '0 auto', width: '100%' }}>
        {currentView === 'home' && (
          <Homepage
            key={`home-${currentUserId}-${refreshTrigger}`}
            db={db}
            onNavigate={handleNavigate}
            currentUserId={currentUserId}
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

        {currentView === 'catalogue' && (
          <CourseCatalogue
            key={`catalogue-${currentUserId}-${refreshTrigger}-${selectedDomain}`}
            db={db}
            onSelectCourse={handleSelectCourse}
            onNavigateHome={() => handleNavigate('home')}
            initialDomain={selectedDomain}
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
            onLaunchLab={(labId) => {
              if (labId === 'lab-sec-101') {
                handleNavigate('lab');
              }
            }}
          />
        )}

        {currentView === 'lab' && (
          <SqlLab
            key={`lab-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            assignmentId="assign-lab-101"
            onSubmissionComplete={handleDataChange}
          />
        )}

        {currentView === 'gradebook' && (
          <TeacherGradebook
            key={`gradebook-${currentUserId}-${refreshTrigger}`}
            db={db}
            teacherId={currentUser.role === 'teacher' ? currentUserId : 'user-teacher-1'}
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

        {currentView === 'classrooms' && (
          <ClassroomManager
            key={`classrooms-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            isTeacher={isTeacher || isInstAdmin || isSuperadmin}
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

      {/* Global Application Footer */}
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
          <span>© 2026 Geniusphere. Full Learning Experience & Evidence-Backed Education.</span>
          <span>Four Authorized Learning Areas • 27 Reconciled Curricular Subjects • Authoritative Server Grading</span>
        </div>
      </footer>
    </div>
  );
};
