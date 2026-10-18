import React from 'react';
import {
  Home,
  BookOpen,
  Terminal,
  GraduationCap,
  Users,
  Folder,
  Award,
  ChevronRight,
  ArrowLeft,
  School,
  Sparkles,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { AppView } from '../App';

interface SectionContextBarProps {
  currentView: AppView;
  courseTitle?: string;
  labTitle?: string;
  onNavigate: (view: string, slug?: string) => void;
  onBack?: () => void;
}

export const SectionContextBar: React.FC<SectionContextBarProps> = ({
  currentView,
  courseTitle,
  labTitle,
  onNavigate,
  onBack,
}) => {
  // If we are on home page, render a minimal clean status bar or skip
  if (currentView === 'home') {
    return null;
  }

  // Derive section metadata
  const getSectionMeta = () => {
    switch (currentView) {
      case 'catalogue':
        return {
          title: 'Curriculum & Courses',
          subtitle: '40 Canonical Enterprise Courses with Interactive Modules',
          icon: BookOpen,
          parent: 'Home',
          parentView: 'home',
        };
      case 'course-detail':
        return {
          title: courseTitle || 'Course Overview',
          subtitle: 'Module syllabus, interactive labs, and certification path',
          icon: BookOpen,
          parent: 'Courses',
          parentView: 'catalogue',
        };
      case 'lesson-player':
        return {
          title: 'Interactive Lesson Player',
          subtitle: 'Step-by-step concepts with verified assessment checkpoints',
          icon: Sparkles,
          parent: courseTitle || 'Course',
          parentView: 'course-detail',
        };
      case 'labs':
        return {
          title: 'Interactive Labs & Simulators',
          subtitle: 'In-browser concept simulators and experimentation suites',
          icon: Terminal,
          parent: 'Home',
          parentView: 'home',
        };
      case 'lab-workspace':
        return {
          title: labTitle || 'Lab Workspace',
          subtitle: 'Isolated parameter-driven environment and automated test suite',
          icon: Terminal,
          parent: 'Labs',
          parentView: 'labs',
        };
      case 'code-sandbox':
        return {
          title: 'Multi-Language Coding Sandbox',
          subtitle: 'Live Python 3.12 & C Compiler Simulation with Real-Time Output',
          icon: Code2,
          parent: 'Home',
          parentView: 'home',
          badge: 'Python & C Engine',
        };
      case 'student-dashboard':
        return {
          title: 'My Learning & Progress',
          subtitle: 'Enrolled courses, completed checkpoints, and XP milestones',
          icon: GraduationCap,
          parent: 'Home',
          parentView: 'home',
        };
      case 'certificates':
        return {
          title: 'Certificates & Verified Credentials',
          subtitle: 'Cryptographically validated certificates with SHA-256 integrity hashes',
          icon: Award,
          parent: 'Home',
          parentView: 'home',
          badge: 'Tamper-Proof Ledger',
        };
      case 'leaderboard':
        return {
          title: 'Community & Peer Rankings',
          subtitle: 'Collaborative achievements, school rankings, and challenge streaks',
          icon: Users,
          parent: 'Home',
          parentView: 'home',
        };
      case 'resources':
        return {
          title: 'Learning Resources & Toolkits',
          subtitle: 'Curated references, developer toolkits, and sovereign study kits',
          icon: Folder,
          parent: 'Home',
          parentView: 'home',
        };
      case 'gradebook':
        return {
          title: 'Educator Gradebook',
          subtitle: 'Student roster mastery tracking and lab submission review',
          icon: Users,
          parent: 'Home',
          parentView: 'home',
        };
      case 'classrooms':
        return {
          title: 'Classroom Management',
          subtitle: 'Join codes, assigned curriculum modules, and roster controls',
          icon: School,
          parent: 'Home',
          parentView: 'home',
        };
      case 'institution-workspace':
        return {
          title: 'Institution Workspace',
          subtitle: 'Institutional enrollment analytics, curriculum audit, and compliance',
          icon: ShieldCheck,
          parent: 'Home',
          parentView: 'home',
        };
      case 'platform-workspace':
        return {
          title: 'Platform Superadmin Console',
          subtitle: 'System health, database logs, and telemetry controls',
          icon: ShieldCheck,
          parent: 'Home',
          parentView: 'home',
        };
      default:
        return {
          title: 'Workspace',
          subtitle: 'Geniusphere Software Workspace',
          icon: Home,
          parent: 'Home',
          parentView: 'home',
        };
    }
  };

  const meta = getSectionMeta();
  const Icon = meta.icon;

  const isNested = currentView === 'course-detail' || currentView === 'lesson-player' || currentView === 'lab-workspace';

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5F0DF',
        padding: '12px 28px',
        boxShadow: '0 1px 3px rgba(38, 53, 42, 0.02)',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left Side: Breadcrumb Trail & Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isNested && (
            <button
              type="button"
              onClick={onBack || (() => onNavigate(meta.parentView))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #E5F0DF',
                backgroundColor: '#FAFAF4',
                color: '#26352A',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5F0DF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FAFAF4';
              }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          {/* Breadcrumb Path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6A7D70',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#43A85B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6A7D70')}
            >
              <Home size={14} />
              <span>Home</span>
            </button>

            <ChevronRight size={13} color="#A0B2A4" />

            {meta.parent !== 'Home' && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate(meta.parentView)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6A7D70',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#43A85B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6A7D70')}
                >
                  {meta.parent}
                </button>
                <ChevronRight size={13} color="#A0B2A4" />
              </>
            )}

            <span style={{ fontWeight: 800, color: '#26352A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon size={15} color="#43A85B" />
              <span>{meta.title}</span>
            </span>

            {meta.badge && (
              <span
                style={{
                  backgroundColor: '#E5F0DF',
                  color: '#26352A',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  marginLeft: '4px',
                }}
              >
                {meta.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Quick Section Jump Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8A9D90', marginRight: '4px' }}>
            Quick Nav:
          </span>

          <button
            type="button"
            onClick={() => onNavigate('catalogue')}
            style={{
              padding: '5px 12px',
              borderRadius: '100px',
              border: currentView === 'catalogue' ? '1.5px solid #43A85B' : '1px solid #E5F0DF',
              backgroundColor: currentView === 'catalogue' ? '#E5F0DF' : '#FFFFFF',
              color: '#26352A',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={13} color="#43A85B" />
            <span>Courses</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('labs')}
            style={{
              padding: '5px 12px',
              borderRadius: '100px',
              border: currentView === 'labs' ? '1.5px solid #43A85B' : '1px solid #E5F0DF',
              backgroundColor: currentView === 'labs' ? '#E5F0DF' : '#FFFFFF',
              color: '#26352A',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Terminal size={13} color="#43A85B" />
            <span>Labs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('code-sandbox')}
            style={{
              padding: '5px 12px',
              borderRadius: '100px',
              border: currentView === 'code-sandbox' ? '1.5px solid #43A85B' : '1.5px solid #C8E3BF',
              backgroundColor: currentView === 'code-sandbox' ? '#43A85B' : '#F2F8EF',
              color: currentView === 'code-sandbox' ? '#FFFFFF' : '#26352A',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Code2 size={13} color={currentView === 'code-sandbox' ? '#FFFFFF' : '#43A85B'} />
            <span>Python & C Sandbox</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('student-dashboard')}
            style={{
              padding: '5px 12px',
              borderRadius: '100px',
              border: currentView === 'student-dashboard' ? '1.5px solid #43A85B' : '1px solid #E5F0DF',
              backgroundColor: currentView === 'student-dashboard' ? '#E5F0DF' : '#FFFFFF',
              color: '#26352A',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <GraduationCap size={13} color="#43A85B" />
            <span>My Learning</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('certificates')}
            style={{
              padding: '5px 12px',
              borderRadius: '100px',
              border: currentView === 'certificates' ? '1.5px solid #43A85B' : '1px solid #E5F0DF',
              backgroundColor: currentView === 'certificates' ? '#E5F0DF' : '#FFFFFF',
              color: '#26352A',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Award size={13} color="#43A85B" />
            <span>Certificates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
