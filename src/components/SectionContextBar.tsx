import React from 'react';
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Play,
  FileText,
  ShieldCheck,
  Layout,
} from 'lucide-react';
import { AppView } from '../App';

interface SectionContextBarProps {
  currentView: AppView;
  courseTitle?: string;
  labTitle?: string;
  userRole?: string;
  onNavigate: (view: string, slug?: string) => void;
  onBack?: () => void;
}

export const SectionContextBar: React.FC<SectionContextBarProps> = ({
  currentView,
  courseTitle,
  labTitle: _labTitle,
  userRole: _userRole,
  onNavigate,
  onBack,
}) => {
  // Only render on deeply nested drill-down views where a back button and breadcrumb path are essential
  const isNested =
    currentView === 'course-detail' ||
    currentView === 'lesson-player' ||
    currentView === 'resume-builder' ||
    currentView === 'schoolkit' ||
    currentView === 'cie-audit' ||
    currentView === 'diagram-studio';

  if (!isNested) {
    return null;
  }

  // Derive section metadata
  const getSectionMeta = () => {
    switch (currentView) {
      case 'course-detail':
        return {
          title: courseTitle || 'Course Overview',
          icon: BookOpen,
          parent: 'Courses',
          parentView: 'catalogue',
        };
      case 'lesson-player':
        return {
          title: 'Interactive Lesson',
          icon: Play,
          parent: courseTitle || 'Course',
          parentView: 'course-detail',
        };
      case 'resume-builder':
        return {
          title: 'Resume & Portfolio Studio',
          icon: FileText,
          parent: 'My Learning',
          parentView: 'student-dashboard',
        };
      case 'cie-audit':
        return {
          title: 'CIE Audit Ledger Explorer',
          icon: ShieldCheck,
          parent: 'Administration',
          parentView: 'audit',
        };
      case 'diagram-studio':
        return {
          title: 'Visual Diagram & Architecture Studio',
          icon: Layout,
          parent: 'Home',
          parentView: 'home',
        };
      default:
        return {
          title: 'Workspace',
          icon: BookOpen,
          parent: 'Home',
          parentView: 'home',
        };
    }
  };

  const meta = getSectionMeta();
  const Icon = meta.icon;

  return (
    <div
      className="section-context-bar"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '8px 16px',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {/* Left Side: Back Button & Clean Breadcrumb Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onBack || (() => onNavigate(meta.parentView))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-canvas)',
              color: 'var(--text-primary)',
              fontSize: '0.80rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to {meta.parent}</span>
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Breadcrumb Trail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', whiteSpace: 'nowrap' }}>
            <button
              type="button"
              onClick={() => onNavigate(meta.parentView)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px 4px',
                fontWeight: 600,
                borderRadius: '4px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {meta.parent}
            </button>

            <ChevronRight size={13} color="var(--border-strong)" />

            <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon size={14} color="var(--brand-primary)" />
              <span>{meta.title}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
