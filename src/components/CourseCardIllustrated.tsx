import React, { useState } from 'react';
import { Course } from '../types';
import {
  Clock,
  ArrowRight,
  Terminal,
  Cpu,
  Coins,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface CourseCardIllustratedProps {
  course: Course;
  progressPercent?: number; // Real persisted progress only if enrolled
  onSelectCourse: (slug: string) => void;
  streamMeta?: {
    label: string;
    color: string;
    bg: string;
    accent: string;
    borderColor: string;
  };
}

export const CourseCardIllustrated: React.FC<CourseCardIllustratedProps> = ({
  course,
  progressPercent,
  onSelectCourse,
  streamMeta,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const domain = course.domain || 'technology';
  const hasHandsOnLab = Boolean(
    course.modules?.some((m) =>
      m.lessons?.some((l) => l.title.toLowerCase().includes('lab') || l.title.toLowerCase().includes('sandbox'))
    )
  );

  // Distinct illustration colors and iconography per domain
  const getDomainTheme = () => {
    switch (domain) {
      case 'finance':
        return {
          gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #047857 100%)',
          accent: '#10B981',
          badgeBg: 'rgba(16, 185, 129, 0.22)',
          badgeColor: '#ECFDF5',
          icon: <Coins size={22} color="#10B981" />,
          label: 'Finance & Markets',
          svgType: 'finance',
        };
      case 'professional':
        return {
          gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #2563EB 100%)',
          accent: '#60A5FA',
          badgeBg: 'rgba(96, 165, 250, 0.22)',
          badgeColor: '#EFF6FF',
          icon: <Users size={22} color="#60A5FA" />,
          label: 'Professional Skills',
          svgType: 'professional',
        };
      case 'technology':
      default:
        return {
          gradient: 'linear-gradient(135deg, #0F172A 0%, #064E3B 55%, #047857 100%)',
          accent: '#34D399',
          badgeBg: 'rgba(52, 211, 153, 0.22)',
          badgeColor: '#ECFDF5',
          icon: <Cpu size={22} color="#34D399" />,
          label: 'Technology & AI',
          svgType: 'technology',
        };
    }
  };

  const theme = getDomainTheme();
  const accentColor = streamMeta?.accent || theme.accent;

  // Render stylized, vector illustration vignette for card header
  const renderHeaderIllustration = () => {
    if (theme.svgType === 'finance') {
      return (
        <svg viewBox="0 0 320 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.35 }}>
          <defs>
            <linearGradient id="finGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#A9C86A" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#A9C86A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d="M 0,90 Q 60,75 110,80 T 210,40 T 320,25 L 320,110 L 0,110 Z" fill="url(#finGrad)" />
          <path d="M 0,90 Q 60,75 110,80 T 210,40 T 320,25" fill="none" stroke="#A9C86A" strokeWidth="2.5" />
          <circle cx="210" cy="40" r="4" fill="#A9C86A" />
          <circle cx="300" cy="28" r="5" fill="#FFFFFF" />
        </svg>
      );
    }

    if (theme.svgType === 'professional') {
      return (
        <svg viewBox="0 0 320 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.3 }}>
          <circle cx="240" cy="55" r="45" fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="240" cy="55" r="28" fill="rgba(125, 211, 252, 0.12)" />
          <circle cx="90" cy="35" r="16" fill="rgba(125, 211, 252, 0.1)" />
          <line x1="106" y1="35" x2="212" y2="55" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        </svg>
      );
    }

    // Technology
    return (
      <svg viewBox="0 0 320 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.35 }}>
        <line x1="20" y1="30" x2="140" y2="30" stroke="#34D399" strokeWidth="1.5" />
        <line x1="140" y1="30" x2="170" y2="65" stroke="#34D399" strokeWidth="1.5" />
        <line x1="170" y1="65" x2="300" y2="65" stroke="#34D399" strokeWidth="1.5" />
        <circle cx="140" cy="30" r="3.5" fill="#34D399" />
        <circle cx="260" cy="65" r="4.5" fill="#FFFFFF" />
        <rect x="220" y="20" width="30" height="30" rx="6" fill="none" stroke="#34D399" strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View course: ${course.title}`}
      onClick={() => onSelectCourse(course.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectCourse(course.slug);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        border: `1.5px solid ${isHovered ? accentColor : 'var(--border-subtle)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 16px 36px -8px rgba(16, 185, 129, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.06)'
          : 'var(--shadow-sm)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.22s ease',
        outline: 'none',
      }}
    >
      {/* 1. Meaningful Subject Illustration Header */}
      <div
        style={{
          height: '110px',
          background: theme.gradient,
          position: 'relative',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {renderHeaderIllustration()}

        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <span
            style={{
              backgroundColor: theme.badgeBg,
              color: theme.badgeColor,
              backdropFilter: 'blur(4px)',
              padding: '3px 10px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {domain}
          </span>

          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              backdropFilter: 'blur(4px)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          >
            {course.level}
          </span>
        </div>

        {/* Subject Icon Vignette */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            {theme.icon}
          </div>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {course.subject || theme.label}
          </span>
        </div>
      </div>

      {/* 2. Content Body: Concise Title & Short Descriptor */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: '1.12rem',
            fontWeight: 800,
            color: isHovered ? accentColor : 'var(--text-primary)',
            lineHeight: 1.3,
            fontFamily: 'var(--font-heading)',
            transition: 'color 0.15s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.summary || course.description}
        </p>

        {/* Relevant tags only when useful */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
          {hasHandsOnLab && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--brand-primary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Terminal size={11} /> Lab Included
            </span>
          )}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          >
            <Clock size={11} /> {course.duration_hours || 4}h
          </span>
        </div>

        {/* Real Progress Bar ONLY where progress is defined and > 0 */}
        {typeof progressPercent === 'number' && progressPercent > 0 && (
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Progress</span>
              <span style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{progressPercent}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-canvas)', borderRadius: '100px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, progressPercent)}%`,
                  height: '100%',
                  background: 'var(--grad-brand)',
                  borderRadius: '100px',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Card Footer with Clear Action */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: isHovered ? 'var(--bg-surface-subdued)' : 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.15s ease',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {course.modules?.length || 10} modules
        </span>

        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            color: 'var(--brand-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>{typeof progressPercent === 'number' && progressPercent > 0 ? 'Continue' : 'Explore'}</span>
          <ArrowRight
            size={14}
            style={{
              transform: isHovered ? 'translateX(3px)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </span>
      </div>
    </div>
  );
};
