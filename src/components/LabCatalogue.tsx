import React, { useState } from 'react';
import {
  Search,
  Clock,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Cpu,
  TrendingUp,
  Users,
  Play,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import { getStandaloneLab } from '../labs/registry';

export interface LabCatalogueProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onSelectLab: (slug: string) => void;
  onNavigateHome: () => void;
  onOpenCodingSandbox?: () => void;
  onSelectCourse?: (slug: string) => void;
}

export const LabCatalogue: React.FC<LabCatalogueProps> = ({
  db,
  currentUserId,
  onSelectLab,
  onNavigateHome,
  onOpenCodingSandbox,
  onSelectCourse,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDomainTab, setSelectedDomainTab] = useState<'all' | 'technology' | 'finance' | 'professional'>('all');

  const publishedCourses = db.getCanonicalCourses();
  const allLabs = db.getLabDefinitions();

  const domainTabs = [
    { id: 'all' as const, label: 'All Courses (18)' },
    { id: 'technology' as const, label: 'Technology & AI (7)' },
    { id: 'finance' as const, label: 'Finance & Markets (6)' },
    { id: 'professional' as const, label: 'Professional Skills (5)' },
  ];

  const filteredCourses = publishedCourses.filter((c) => {
    const matchesDomain = selectedDomainTab === 'all' || c.domain === selectedDomainTab;
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-meta)', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <button 
              type="button"
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: 'inherit' }}
            >
              Home
            </button>
            <span>/</span>
            <span>Interactive Labs</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '10px' }}>
            <Terminal size={14} />
            <span>AUTHORITATIVE COURSE LABS &amp; SIMULATIONS</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-page-title)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Explore Interactive Labs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
            Hands-on concept simulations, parameter-driven experiments, and code execution sandboxes directly mapped to the 18 canonical courses.
          </p>
        </div>
        <MascotSphere pose="coding" size={88} speechBubble="Choose a course to launch its interactive lab!" />
      </div>

      {/* Flagship Multi-Language Coding Sandbox Banner */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '3px 10px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Terminal size={12} />
              <span>Flagship Sandbox • Python 3.12 &amp; C Compiler</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Multi-Language In-Browser Coding Sandbox
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Directly test and compile <strong>Python</strong> (functions, loops, math, algorithms) and <strong>C Language</strong> (pointers, printf formatting, buffer boundary checks) with live terminal stdout feedback and zero setup.
          </p>
        </div>

        {onOpenCodingSandbox && (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenCodingSandbox}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '100px',
              padding: '11px 22px',
              fontWeight: 800,
              fontSize: '0.88rem',
            }}
          >
            <span>Launch Python &amp; C Sandbox</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Course Structure Controls (Matching Home Page) */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search courses and labs by concept, algorithm, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px' }}
            />
          </div>

          {/* Domain Filter Pills (Identical to Home Page) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {domainTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDomainTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: selectedDomainTab === tab.id ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                  borderColor: selectedDomainTab === tab.id ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  color: selectedDomainTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses & Labs Grid (Matching Home Page Course Card Architecture) */}
      {filteredCourses.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <MascotSphere pose="thinking" size={90} speechBubble="No courses matched this filter!" />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '14px 0 4px' }}>No matching courses found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Try clearing your search query or selecting "All Courses".</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredCourses.map((c) => {
            const domainColor =
              c.domain === 'technology'
                ? '#059669'
                : c.domain === 'finance'
                ? '#D97706'
                : '#7C3AED';
            const DomainIcon =
              c.domain === 'technology'
                ? Cpu
                : c.domain === 'finance'
                ? TrendingUp
                : Users;

            const linkedLab = allLabs.find(
              (l) => l.course_slug === c.slug || l.slug === (c as any).linked_lab_slug || l.slug === c.slug
            );
            const targetLabSlug = linkedLab?.slug || (c as any).linked_lab_slug || c.slug;
            const standaloneMeta = getStandaloneLab(c.slug) || (linkedLab ? getStandaloneLab(linkedLab.slug) : null);
            const isCompleted = linkedLab ? db.isLabCompleted(currentUserId, linkedLab.id) : false;

            return (
              <div
                key={c.id}
                className="card-interactive-lift"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: isCompleted ? '2px solid var(--success)' : '1.5px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                {/* Domain & Level Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: `${domainColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: domainColor,
                      }}
                    >
                      <DomainIcon size={16} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        backgroundColor: `${domainColor}12`,
                        color: domainColor,
                        border: `1px solid ${domainColor}30`,
                      }}
                    >
                      {c.domain}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCompleted && (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </span>
                    )}
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {c.duration_hours} hrs • {c.level}
                    </span>
                  </div>
                </div>

                {/* Course Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {c.title}
                </h3>

                {/* Course Summary */}
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {c.summary}
                </p>

                {/* Modules & Simulation Badges */}
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Play size={12} color="var(--brand-primary)" />
                    10 Modules
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FlaskConical size={12} color="#059669" />
                    <span>{standaloneMeta ? standaloneMeta.name : (linkedLab?.title || 'Interactive Concept Lab')}</span>
                  </span>
                </div>

                {/* Actions: Launch Lab Workspace (Primary) & Course Syllabus (Secondary) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    className="btn-shimmer"
                    onClick={() => onSelectLab(targetLabSlug)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(36, 76, 58, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <FlaskConical size={14} />
                    <span>Launch Lab Workspace</span>
                    <ArrowRight size={14} />
                  </button>

                  {onSelectCourse && (
                    <button
                      type="button"
                      onClick={() => onSelectCourse(c.slug)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-subdued)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                      title="View course syllabus and curriculum"
                    >
                      <BookOpen size={13} />
                      <span>Syllabus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
