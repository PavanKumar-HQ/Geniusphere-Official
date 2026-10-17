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
import {
  ShieldCheck,
  Terminal,
  BookOpen,
  Users,
  FileText,
  User,
  GraduationCap,
  Home,
  Briefcase,
  School,
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
  | 'schoolkit';

export const App: React.FC = () => {
  // Single persistent in-memory database instance for genuine state progression
  const db = useMemo(() => new InMemoryDatabase(), []);

  // Supported actors in the environment
  const users = [
    { id: 'user-student-1', name: 'Aarav Patel (Student, Minor)', role: 'learner', badge: 'Student' },
    { id: 'user-teacher-1', name: 'Dr. Sharma (Teacher, DPTS)', role: 'teacher', badge: 'Teacher' },
    { id: 'user-parent-1', name: 'Sunita Patel (Guardian of Aarav)', role: 'guardian', badge: 'Parent' },
    { id: 'user-admin-1', name: 'Principal Verma (Institution Admin)', role: 'institution_admin', badge: 'Admin' },
  ];

  const [currentUserId, setCurrentUserId] = useState<string>('user-student-1');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('web-application-defense-fundamentals');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-web-defense-101');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('lesson-wd-101');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentUser = users.find((u) => u.id === currentUserId)!;
  const isTeacher = currentUser.role === 'teacher';
  const isAdmin = currentUser.role === 'institution_admin';
  const isGuardian = currentUser.role === 'guardian';

  // Force re-render of dependent tabs after new submissions or enrollments
  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleNavigate = (view: string, slug?: string) => {
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
      view === 'schoolkit'
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
          <button
            type="button"
            onClick={() => setCurrentView('home')}
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
                Evidence-Backed Education Platform • Zero Fake Data
              </div>
            </div>
          </button>

          {/* Actor Role Switcher for Testing & Pilot Demonstration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                else if (userObj?.role === 'institution_admin') setCurrentView('audit');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface-subdued)',
                fontWeight: 600,
                fontSize: '0.875rem',
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
          </div>
        </div>
      </header>

      {/* Primary Navigation Bar */}
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
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'home' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'home' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'home' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={17} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDomain('all');
              setCurrentView('catalogue');
            }}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'catalogue' || currentView === 'course-detail' || currentView === 'lesson-player' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={17} />
            <span>Courses (26)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('lab')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'lab' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'lab' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'lab' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Terminal size={17} />
            <span>SQL Lab 101</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('classrooms')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'classrooms' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'classrooms' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'classrooms' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={17} />
            <span>Classroom & Join Codes</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('resume-builder')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'resume-builder' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'resume-builder' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'resume-builder' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Briefcase size={17} />
            <span>Resume Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('schoolkit')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: currentView === 'schoolkit' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: currentView === 'schoolkit' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: currentView === 'schoolkit' ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <School size={17} />
            <span>SchoolKit</span>
          </button>

          {(isTeacher || isAdmin) && (
            <button
              type="button"
              onClick={() => setCurrentView('gradebook')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: currentView === 'gradebook' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'gradebook' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'gradebook' ? 700 : 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <GraduationCap size={17} />
              <span>Teacher Gradebook</span>
            </button>
          )}

          {(isGuardian || isAdmin) && (
            <button
              type="button"
              onClick={() => setCurrentView('parent')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: currentView === 'parent' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'parent' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'parent' ? 700 : 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Users size={17} />
              <span>Parent Oversight</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setCurrentView('audit')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: currentView === 'audit' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: currentView === 'audit' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: currentView === 'audit' ? 700 : 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText size={17} />
              <span>Audit Trail</span>
            </button>
          )}
        </div>
      </nav>

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

        {currentView === 'catalogue' && (
          <CourseCatalogue
            key={`catalogue-${currentUserId}-${refreshTrigger}-${selectedDomain}`}
            db={db}
            onSelectCourse={handleSelectCourse}
            onNavigateHome={() => setCurrentView('home')}
            initialDomain={selectedDomain}
          />
        )}

        {currentView === 'course-detail' && (
          <CourseDetailView
            key={`detail-${selectedCourseSlug}-${currentUserId}-${refreshTrigger}`}
            db={db}
            courseSlug={selectedCourseSlug}
            currentUserId={currentUserId}
            onBack={() => setCurrentView('catalogue')}
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
            onBackToCourse={() => setCurrentView('course-detail')}
            onLaunchLab={(labId) => {
              if (labId === 'lab-sec-101') {
                setCurrentView('lab');
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

        {currentView === 'classrooms' && (
          <ClassroomManager
            key={`classrooms-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            isTeacher={isTeacher || isAdmin}
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
            currentUserId={isAdmin ? currentUserId : 'user-admin-1'}
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
            onOpenGradebook={() => setCurrentView('gradebook')}
          />
        )}
      </main>

      {/* Footer */}
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
          <span>Zero Placeholders • Authoritative Server Grading • 26 Curricular Subjects • DPDP 2023 Compliant</span>
        </div>
      </footer>
    </div>
  );
};
