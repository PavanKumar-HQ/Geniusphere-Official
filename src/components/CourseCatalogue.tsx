import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import { Course } from '../types';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Cpu,
  Coins,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  Terminal,
  GraduationCap,
  Search,
  X,
  Grid,
  Layers,
  Filter,
} from 'lucide-react';

interface CourseCatalogueProps {
  db: InMemoryDatabase;
  onSelectCourse: (slug: string) => void;
  onNavigateHome: () => void;
  initialDomain?: string;
  onLaunchLab?: (slug: string) => void;
}

export const CourseCatalogue: React.FC<CourseCatalogueProps> = ({
  db,
  onSelectCourse,
  initialDomain = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>(
    initialDomain === 'all' || initialDomain === 'technology' || initialDomain === 'finance' || initialDomain === 'professional'
      ? initialDomain
      : 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');

  const streams = db.getCanonicalStreams();
  const allCanonicalCourses = db.getCanonicalCourses();

  // Filtered courses for search or filter selection
  const filteredCourses = db.getCanonicalCourses({
    stream: selectedStream === 'all' ? undefined : selectedStream,
    search: search.trim() ? search : undefined,
    level: selectedLevel === 'all' ? undefined : selectedLevel,
  });

  const getStreamIcon = (streamId: string, size: number = 18) => {
    switch (streamId) {
      case 'technology':
        return <Cpu size={size} />;
      case 'finance':
        return <Coins size={size} />;
      case 'professional':
        return <Users size={size} />;
      default:
        return <GraduationCap size={size} />;
    }
  };

  const getStreamMeta = (streamId: string) => {
    switch (streamId) {
      case 'technology':
        return {
          label: 'Technology & Digital Skills',
          color: 'var(--brand-primary)',
          bg: 'var(--bg-surface-subdued)',
          accent: 'var(--brand-primary)',
          borderColor: 'var(--border-subtle)',
        };
      case 'finance':
        return {
          label: 'Financial Literacy & Economy',
          color: 'var(--brand-primary)',
          bg: 'var(--bg-surface-subdued)',
          accent: '#A9C86A',
          borderColor: 'var(--border-subtle)',
        };
      case 'professional':
        return {
          label: 'Professional & Life Skills',
          color: 'var(--brand-primary)',
          bg: 'var(--bg-surface-subdued)',
          accent: '#348B60',
          borderColor: 'var(--border-subtle)',
        };
      default:
        return {
          label: 'General Curriculum',
          color: 'var(--text-primary)',
          bg: 'var(--bg-surface-subdued)',
          accent: 'var(--brand-primary)',
          borderColor: 'var(--border-subtle)',
        };
    }
  };

  const hasActiveFilters = selectedStream !== 'all' || selectedLevel !== 'all' || search.trim() !== '';

  const resetFilters = () => {
    setSearch('');
    setSelectedStream('all');
    setSelectedLevel('all');
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      {/* ================================================================ */}
      {/* TOP HERO HEADER SECTION WITH STUDYING MASCOT & STAT BADGES       */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(200px, 0.9fr) minmax(260px, 1fr)',
          gap: '28px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '32px 36px 28px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Left: Titles & Mission Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--brand-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Sparkles size={13} color="var(--brand-primary)" /> Canonical Skills Curriculum
            </span>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                margin: 0,
                lineHeight: 1.15,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Course Catalogue
            </h1>
          </div>

          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--brand-primary)',
              margin: 0,
            }}
          >
            Choose your learning path. Master real-world capabilities.
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Explore our curated 40-course syllabus across Technology, Applied Indian Finance, and Career Readiness.
            Every course features hands-on exercises, browser sandboxes, and verified milestone certification.
          </p>
        </div>

        {/* Center: Mascot Sphere with Cap & Glowing Digital Book */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '12px',
              transform: 'rotate(-5deg)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: '0.92rem',
              color: 'var(--brand-lime-text, #252C27)',
              backgroundColor: 'var(--brand-lime, #A9C86A)',
              padding: '5px 14px',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}
          >
            Small steps. Giant leaps.
          </div>
          <MascotSphere
            pose="studying"
            size={160}
            animated={true}
            interactive={true}
          />
        </div>

        {/* Far Right: Stat Highlights matching Enterprise SaaS Standard */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'var(--bg-surface-subdued)',
            padding: '18px 20px',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>3 Learning Streams</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Technology, Finance & Careers</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>40 Full Courses</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>180+ verified lessons & quizzes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Terminal size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Interactive Sandboxes</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Multi-language live execution</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Verifiable Credentials</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>SHA-256 tamper-proof hash</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* INTERACTIVE NAVIGATION & FILTER HUB                              */}
      {/* Always visible, clear, and spacious                              */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)',
          padding: '20px 24px',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {/* Stream Selector Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* All Courses Tab */}
            <button
              type="button"
              onClick={() => setSelectedStream('all')}
              style={{
                padding: '9px 18px',
                borderRadius: '100px',
                border: 'none',
                backgroundColor: selectedStream === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                color: selectedStream === 'all' ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: selectedStream === 'all' ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
              }}
            >
              <GraduationCap size={16} />
              <span>All Courses</span>
              <span
                style={{
                  backgroundColor: selectedStream === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {allCanonicalCourses.length}
              </span>
            </button>

            {/* Stream Specific Tabs */}
            {streams.map((s) => {
              const isSelected = selectedStream === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStream(s.id)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '100px',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  }}
                >
                  {getStreamIcon(s.id, 16)}
                  <span>{s.title}</span>
                  <span
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {s.courses.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher: Grid vs Grouped */}
          {selectedStream === 'all' && !search.trim() && selectedLevel === 'all' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface-subdued)',
                borderRadius: '100px',
                padding: '3px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Continuous Grid View"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Grid size={14} />
                <span>Grid View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                title="Grouped by Stream Sections"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: viewMode === 'grouped' ? 'var(--bg-surface)' : 'transparent',
                  color: viewMode === 'grouped' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grouped' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Layers size={14} />
                <span>Stream Sections</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Difficulty Filter Sub-bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Real-time Search Box */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 320px',
              maxWidth: '480px',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, skills, Python, UPI, AI, Resume..."
              style={{
                width: '100%',
                padding: '10px 38px 10px 40px',
                borderRadius: '100px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-canvas)',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Difficulty Level Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} /> Level:
            </span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
              const isLvlSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: isLvlSelected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                    backgroundColor: isLvlSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                    color: isLvlSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {lvl === 'all' ? 'All Levels' : lvl}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '100px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '4px',
                }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course Count / Active Filter Feedback */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ fontSize: '0.94rem', color: '#556D5C' }}>
          Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
          {selectedStream !== 'all' && (
            <span> in <strong>{streams.find((s) => s.id === selectedStream)?.title}</strong></span>
          )}
          {selectedLevel !== 'all' && (
            <span> at <strong>{selectedLevel}</strong> level</span>
          )}
          {search.trim() && (
            <span> matching &ldquo;<strong>{search}</strong>&rdquo;</span>
          )}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#43A85B',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* ZERO RESULTS EMPTY STATE                                         */}
      {/* ================================================================ */}
      {filteredCourses.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <MascotSphere pose="idea" size={130} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '20px 0 8px' }}>
            No courses found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '440px', lineHeight: 1.5 }}>
            We couldn&rsquo;t find courses matching &ldquo;{search}&rdquo;. Try using broader terms like &ldquo;Python&rdquo;, &ldquo;Finance&rdquo;, or &ldquo;Safety&rdquo;.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              fontWeight: 800,
              border: 'none',
              padding: '12px 28px',
              borderRadius: '100px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.92rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span>Show All 40 Courses</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : selectedStream === 'all' && viewMode === 'grouped' && !search.trim() && selectedLevel === 'all' ? (
        /* ================================================================ */
        /* GROUPED BY STREAM SECTIONS (Generous, full-width rows)           */
        /* ================================================================ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {streams.map((stream) => {
            const streamMeta = getStreamMeta(stream.id);
            return (
              <div
                key={stream.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Stream Section Header */}
                <div
                  style={{
                    backgroundColor: streamMeta.bg,
                    border: `1px solid ${streamMeta.borderColor}`,
                    borderRadius: '20px',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-surface)',
                        color: streamMeta.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `1px solid var(--border-subtle)`,
                      }}
                    >
                      {getStreamIcon(stream.id, 24)}
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: '1.45rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          fontFamily: 'Space Grotesk, sans-serif',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {stream.title}
                      </h2>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: '0.9rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {stream.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStream(stream.id);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      border: `1px solid var(--border-subtle)`,
                      borderRadius: '100px',
                      padding: '8px 18px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <span>View all {stream.courses.length} courses</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Stream Courses Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '22px',
                  }}
                >
                  {allCanonicalCourses
                    .filter((c) => c.domain === stream.id)
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        streamMeta={streamMeta}
                        onSelectCourse={onSelectCourse}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================================================================ */
        /* CONTINUOUS SPACIOUS COURSE GRID                                  */
        /* Clean, high-legibility cards with breathing room                 */
        /* ================================================================ */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '22px',
          }}
        >
          {filteredCourses.map((course: Course) => {
            const streamMeta = getStreamMeta(course.domain);
            return (
              <CourseCard
                key={course.id}
                course={course}
                streamMeta={streamMeta}
                onSelectCourse={onSelectCourse}
              />
            );
          })}
        </div>
      )}

      {/* ================================================================ */}
      {/* BOTTOM CTA & TESTIMONIAL BANNER (Design Board 2)                 */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
          marginTop: '12px',
        }}
      >
        {/* 1. Left Card: Ready to start your journey? with Idea Mascot */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <MascotSphere pose="idea" size={90} animated={true} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                Ready to level up your skills?
              </h3>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.45 }}>
                Master industry-grade concepts through self-paced learning and practical simulations.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  padding: '8px 18px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.84rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                }}
              >
                <span>Browse all 40 courses</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Center Card: 4 Feature Pillars with Icons */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            alignContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', border: '1px solid var(--border-subtle)' }}>
              <CheckCircle2 size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Self-paced learning</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', border: '1px solid var(--border-subtle)' }}>
              <Terminal size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Hands-on code labs</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', border: '1px solid var(--border-subtle)' }}>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Interactive quizzes</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-subdued)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', border: '1px solid var(--border-subtle)' }}>
              <Award size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tamper-proof certs</div>
          </div>
        </div>

        {/* 3. Right Card: Editorial Student Testimonial */}
        <div
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, zIndex: 1 }}>
            <span style={{ color: 'var(--brand-lime, #A9C86A)', fontSize: '1.6rem', lineHeight: 1, fontFamily: 'serif' }}>&ldquo;</span>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.5,
                fontWeight: 500,
                color: 'var(--text-inverse, #F7F6F0)',
                margin: '2px 0 8px',
              }}
            >
              Geniusphere made learning practical and exciting. I built real projects and gained confidence in my skills.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--brand-lime, #A9C86A)', fontWeight: 700 }}>
              — Student, Class 10
            </div>
          </div>

          <img
            src="/images/student_hero.jpg"
            alt="Student"
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--brand-lime, #A9C86A)',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* INDIVIDUAL COURSE CARD COMPONENT                                          */
/* Spacious, high readability, clean hover effects                           */
/* ========================================================================= */
interface CourseCardProps {
  course: Course;
  streamMeta: {
    label: string;
    color: string;
    bg: string;
    accent: string;
    borderColor: string;
  };
  onSelectCourse: (slug: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  streamMeta,
  onSelectCourse,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if course has lab or coding lesson
  const hasHandsOnLab = Boolean(
    course.modules?.some((m) =>
      m.lessons?.some((l) => l.title.toLowerCase().includes('lab') || l.title.toLowerCase().includes('sandbox'))
    )
  );

  return (
    <div
      onClick={() => onSelectCourse(course.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        border: `1.5px solid ${isHovered ? streamMeta.accent : 'var(--border-subtle)'}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 10px 28px rgba(0, 0, 0, 0.08)'
          : '0 2px 8px rgba(0, 0, 0, 0.02)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: streamMeta.bg,
              color: streamMeta.color,
              border: `1px solid ${streamMeta.borderColor}`,
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {course.domain}
          </span>

          <span
            style={{
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--text-muted)',
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'capitalize',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 800,
            color: isHovered ? streamMeta.accent : 'var(--text-primary)',
            lineHeight: 1.3,
            fontFamily: 'Space Grotesk, sans-serif',
            transition: 'color 0.15s ease',
          }}
        >
          {course.title}
        </h3>

        {/* Summary Description */}
        <p
          style={{
            margin: 0,
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.summary}
        </p>

        {/* Interactive Lab Highlight Tag if applicable */}
        {hasHandsOnLab && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              width: 'fit-content',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Terminal size={12} />
            <span>Interactive Lab Included</span>
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Action Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          marginTop: '4px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="var(--brand-primary)" /> {course.duration_hours}h
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={13} color="var(--brand-primary)" /> {course.modules.length} modules
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCourse(course.slug);
          }}
          style={{
            backgroundColor: isHovered ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
            color: isHovered ? '#FFFFFF' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '100px',
            padding: '7px 16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Explore Syllabus</span>
          <ArrowRight
            size={13}
            style={{
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
              transition: 'transform 0.15s ease',
            }}
          />
        </button>
      </div>
    </div>
  );
};
