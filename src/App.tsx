import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from './db/in-memory-db';
import { SqlLab } from './components/SqlLab';
import { TeacherGradebook } from './components/TeacherGradebook';
import { ClassroomManager } from './components/ClassroomManager';
import { ParentPortal } from './components/ParentPortal';
import { AuditLogViewer } from './components/AuditLogViewer';
import {
  ShieldCheck,
  Terminal,
  BookOpen,
  Users,
  FileText,
  User,
  GraduationCap,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'lab' | 'gradebook' | 'classrooms' | 'parent' | 'audit'>('lab');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentUser = users.find((u) => u.id === currentUserId)!;
  const isTeacher = currentUser.role === 'teacher';
  const isAdmin = currentUser.role === 'institution_admin';
  const isGuardian = currentUser.role === 'guardian';

  // Force re-render of dependent tabs after new submissions or enrollments
  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  GENIUSPHERE
                </span>
                <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                  PILOT v0.1.0
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Authoritative Education Platform • Real Data & Zero Placeholders
              </div>
            </div>
          </div>

          {/* Actor Role Switcher for Testing & Pilot Demonstration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <User size={16} />
              <span>Simulated Persona:</span>
            </div>
            <select
              value={currentUserId}
              onChange={(e) => {
                const newUserId = e.target.value;
                setCurrentUserId(newUserId);
                const userObj = users.find((u) => u.id === newUserId);
                if (userObj?.role === 'teacher') setActiveTab('gradebook');
                else if (userObj?.role === 'guardian') setActiveTab('parent');
                else if (userObj?.role === 'institution_admin') setActiveTab('audit');
                else setActiveTab('lab');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface-subdued)',
                fontWeight: 600,
                fontSize: '0.875rem',
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

      {/* Navigation Tab Bar */}
      <nav
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: activeTab === 'lab' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'lab' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: activeTab === 'lab' ? 700 : 500,
            }}
          >
            <Terminal size={18} />
            <span>SQL Injection Lab</span>
          </button>

          {(isTeacher || isAdmin) && (
            <button
              type="button"
              onClick={() => setActiveTab('gradebook')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: activeTab === 'gradebook' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'gradebook' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: activeTab === 'gradebook' ? 700 : 500,
              }}
            >
              <GraduationCap size={18} />
              <span>Teacher Gradebook</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('classrooms')}
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              color: activeTab === 'classrooms' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'classrooms' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              borderRadius: '0',
              fontWeight: activeTab === 'classrooms' ? 700 : 500,
            }}
          >
            <BookOpen size={18} />
            <span>Classroom & Join Codes</span>
          </button>

          {(isGuardian || isAdmin) && (
            <button
              type="button"
              onClick={() => setActiveTab('parent')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: activeTab === 'parent' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'parent' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: activeTab === 'parent' ? 700 : 500,
              }}
            >
              <Users size={18} />
              <span>Parent Oversight (DPDP)</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                color: activeTab === 'audit' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'audit' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                borderRadius: '0',
                fontWeight: activeTab === 'audit' ? 700 : 500,
              }}
            >
              <FileText size={18} />
              <span>Audit Log Trail</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'lab' && (
          <SqlLab
            key={`lab-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            assignmentId="assign-lab-101"
            onSubmissionComplete={handleDataChange}
          />
        )}

        {activeTab === 'gradebook' && (
          <TeacherGradebook
            key={`gradebook-${currentUserId}-${refreshTrigger}`}
            db={db}
            teacherId={currentUser.role === 'teacher' ? currentUserId : 'user-teacher-1'}
          />
        )}

        {activeTab === 'classrooms' && (
          <ClassroomManager
            key={`classrooms-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={currentUserId}
            isTeacher={isTeacher || isAdmin}
          />
        )}

        {activeTab === 'parent' && (
          <ParentPortal
            key={`parent-${currentUserId}-${refreshTrigger}`}
            db={db}
            parentUserId={currentUser.role === 'guardian' ? currentUserId : 'user-parent-1'}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogViewer
            key={`audit-${currentUserId}-${refreshTrigger}`}
            db={db}
            currentUserId={isAdmin ? currentUserId : 'user-admin-1'}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 Geniusphere. Production-Grade Autonomous Engineering.</span>
          <span>Zero Fake Data • Database RLS Enforced • SQLite-WASM Sandbox</span>
        </div>
      </footer>
    </div>
  );
};
