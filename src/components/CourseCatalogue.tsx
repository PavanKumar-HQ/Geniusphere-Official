import React, { useState, useEffect } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';
import { Course } from '../types';
import { apiClient } from '../services/apiClient';
import { CourseCardIllustrated } from './CourseCardIllustrated';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Cpu,
  Coins,
  Users,
  Award,
  CheckCircle2,
  Terminal,
  GraduationCap,
  Search,
  X,
  Grid,
  Layers,
  Filter,
  AlertCircle,
  RefreshCw,
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
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');

  const [apiCourses, setApiCourses] = useState<Course[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchAuthoritativeCourses = () => {
    setIsLoading(true);
    setApiError(null);
    apiClient
      .getCourses()
      .then((data) => {
        if (Array.isArray(data)) {
          const canonicalMap = new Map(db.getCanonicalCourses().map((c) => [c.slug, c]));
          const enriched: Course[] = data.map((dbCourse: any) => {
            const canonical = canonicalMap.get(dbCourse.slug);
            return {
              ...(canonical || {}),
              id: dbCourse.id,
              title: dbCourse.title,
              slug: dbCourse.slug,
              domain: dbCourse.domain,
              subject: canonical?.subject || dbCourse.domain,
              level: canonical?.level || 'beginner',
              summary: canonical?.summary || canonical?.description || `Authoritative ${dbCourse.domain} course`,
              description: canonical?.description || `Authoritative ${dbCourse.domain} course`,
              learning_objectives: canonical?.learning_objectives || [],
              prerequisites: canonical?.prerequisites || [],
              duration_hours: canonical?.duration_hours || 4,
              is_published: dbCourse.is_published ?? true,
              availability_status: canonical?.availability_status || 'available',
              modules: canonical?.modules || [],
              created_at: dbCourse.created_at || new Date().toISOString(),
            } as Course;
          });
          setApiCourses(enriched);
        } else {
          setApiCourses([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setApiError(err.message || 'Unable to connect to authoritative PostgreSQL database');
        setApiCourses(null); // CRITICAL: NEVER fabricate course cards when request fails!
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAuthoritativeCourses();
  }, [db]);

  const streams = db.getCanonicalStreams();

  // Filtered courses for search or filter selection
  const rawCourses = apiCourses !== null ? apiCourses : [];
  const allCanonicalCourses: Course[] = rawCourses;
  const filteredCourses = rawCourses.filter((course) => {
    if (selectedStream !== 'all' && course.domain !== selectedStream) return false;
    if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        (course.summary && course.summary.toLowerCase().includes(q)) ||
        (course.description && course.description.toLowerCase().includes(q)) ||
        (course.subject && course.subject.toLowerCase().includes(q)) ||
        (course.slug && course.slug.toLowerCase().includes(q))
      );
    }
    return true;
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
          label: 'Technology & AI',
          color: '#0D9488',
          bg: 'rgba(13, 148, 136, 0.08)',
          accent: '#0D9488',
          borderColor: 'rgba(13, 148, 136, 0.35)',
        };
      case 'finance':
        return {
          label: 'Finance & Markets',
          color: '#059669',
          bg: 'rgba(5, 150, 105, 0.08)',
          accent: '#059669',
          borderColor: 'rgba(5, 150, 105, 0.35)',
        };
      case 'professional':
        return {
          label: 'Professional Skills',
          color: '#2563EB',
          bg: 'rgba(37, 99, 235, 0.08)',
          accent: '#2563EB',
          borderColor: 'rgba(37, 99, 235, 0.35)',
        };
      default:
        return {
          label: 'General Curriculum',
          color: 'var(--brand-primary)',
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
        padding: '0 0 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* ================================================================ */}
      {/* COMPACT STUDENT-FIRST HERO HEADER WITH PURPOSEFUL MASCOT         */}
      {/* ================================================================ */}
      <div
        className="mobile-hero-compact"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ maxWidth: '680px', flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--bg-surface-subdued)', color: 'var(--brand-primary)', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            <BookOpen size={12} color="var(--brand-primary)" />
            <span>Interactive Course Catalogue</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 6px',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.25,
            }}
          >
            Explore Courses & Hands-On Skills
          </h1>
          <p
            className="mobile-hide-sm"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Curated, practical curriculum across Technology, Financial Literacy, and Professional Skills with browser labs and verified credentials.
          </p>
        </div>

        <div className="mobile-hero-mascot" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <MascotSphere
            pose="studying"
            size={68}
            animated={true}
            interactive={true}
            speechBubble="Choose your learning track!"
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* CLEAN, LOW-FRICTION FILTER & SEARCH BAR                          */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}
      >
        {/* Stream Selector Navigation Tabs */}
        <div className="mobile-pill-strip" style={{ display: 'flex', gap: '8px' }}>
          {/* All Courses Tab */}
          <button
            type="button"
            onClick={() => setSelectedStream('all')}
            style={{
              padding: '7px 16px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: selectedStream === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
              color: selectedStream === 'all' ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <GraduationCap size={15} />
            <span>All Courses</span>
            <span
              style={{
                backgroundColor: selectedStream === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                padding: '1px 6px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {allCanonicalCourses.length}
            </span>
          </button>

          {/* Stream Specific Tabs */}
          {streams.map((s) => {
            const isSelected = selectedStream === s.id;
            const meta = getStreamMeta(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStream(s.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '100px',
                  border: isSelected ? `1.5px solid ${meta.accent}` : '1.5px solid transparent',
                  backgroundColor: isSelected ? meta.accent : 'var(--bg-surface-subdued)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? `0 2px 10px ${meta.accent}33` : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {getStreamIcon(s.id, 15)}
                <span>{s.title}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                    padding: '1px 6px',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {s.courses.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Real-time Search Box */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '340px',
          }}
        >
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{
              width: '100%',
              padding: '8px 32px 8px 34px',
              borderRadius: '100px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-canvas)',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
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
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Course Count Feedback */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
          {selectedStream !== 'all' && (
            <span> in <strong>{streams.find((s) => s.id === selectedStream)?.title}</strong></span>
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
              color: 'var(--brand-primary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Reset filter
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* AUTHORITATIVE DATA STATES (LOADING, ERROR, EMPTY, RESULTS)       */}
      {/* ================================================================ */}
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          data-testid="courses-loading-state"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            margin: '20px 0',
          }}
        >
          <RefreshCw size={36} color="var(--brand-primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Loading Authoritative Courses from PostgreSQL...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Establishing authenticated connection and retrieving canonical curriculum records.
          </p>
        </div>
      ) : apiError ? (
        <div
          role="alert"
          data-testid="courses-error-state"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderRadius: '24px',
            padding: '52px 24px',
            textAlign: 'center',
            border: '1.5px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            margin: '20px 0',
          }}
        >
          <AlertCircle size={44} color="#EF4444" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B91C1C', margin: 0 }}>
            Authoritative Database Connection Unavailable
          </h3>
          <p style={{ color: '#7F1D1D', fontSize: '0.94rem', maxWidth: '480px', lineHeight: 1.5, margin: 0 }}>
            {apiError}
          </p>
          <button
            type="button"
            onClick={fetchAuthoritativeCourses}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontWeight: 700,
              border: 'none',
              padding: '10px 24px',
              borderRadius: '100px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px',
            }}
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : rawCourses.length === 0 ? (
        <div
          data-testid="courses-empty-state"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <MascotSphere pose="idea" size={130} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '20px 0 8px' }}>
            No published courses found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            The authoritative database currently contains zero published courses.
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
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
      ) : selectedStream === 'all' && viewMode === 'grouped' ? (
        /* ================================================================ */
        /* GROUPED BY STREAM SECTIONS (Generous, full-width rows)           */
        /* ================================================================ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {streams.map((stream) => {
            const streamMeta = getStreamMeta(stream.id);
            const streamCourses = filteredCourses.filter((c) => c.domain === stream.id);
            if (streamCourses.length === 0) return null;

            return (
              <div
                key={stream.id}
                id={`category-${stream.id}`}
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
                    border: `1.5px solid ${streamMeta.borderColor}`,
                    borderRadius: '20px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-surface)',
                        color: streamMeta.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: `1.5px solid ${streamMeta.borderColor}`,
                        flexShrink: 0,
                      }}
                    >
                      {getStreamIcon(stream.id, 22)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {stream.title}
                        </h2>
                        <span
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            color: streamMeta.accent,
                            border: `1px solid ${streamMeta.borderColor}`,
                            borderRadius: '100px',
                            padding: '2px 10px',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                          }}
                        >
                          {streamCourses.length} {streamCourses.length === 1 ? 'course' : 'courses'}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '3px 0 0',
                          fontSize: '0.88rem',
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
                    }}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      color: streamMeta.accent,
                      border: `1px solid ${streamMeta.borderColor}`,
                      borderRadius: '100px',
                      padding: '7px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>View track ({streamCourses.length})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Stream Courses Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                    gap: '20px',
                  }}
                >
                  {streamCourses.map((course) => (
                    <CourseCardIllustrated
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
        /* SINGLE CATEGORY OR CONTINUOUS GRID VIEW                          */
        /* Clean, high-legibility cards with breathing room                 */
        /* ================================================================ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedStream !== 'all' && (() => {
            const currentStream = streams.find((s) => s.id === selectedStream);
            const streamMeta = getStreamMeta(selectedStream);
            if (!currentStream) return null;
            return (
              <div
                style={{
                  backgroundColor: streamMeta.bg,
                  border: `1px solid ${streamMeta.borderColor}`,
                  borderRadius: '20px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface)',
                      color: streamMeta.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid var(--border-subtle)`,
                    }}
                  >
                    {getStreamIcon(selectedStream, 22)}
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {currentStream.title}
                    </h2>
                    <p style={{ margin: '3px 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {currentStream.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStream('all')}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '100px',
                    padding: '8px 16px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  View All Categories
                </button>
              </div>
            );
          })()}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
            }}
          >
            {filteredCourses.map((course: Course) => {
              const streamMeta = getStreamMeta(course.domain);
              return (
                <CourseCardIllustrated
                  key={course.id}
                  course={course}
                  streamMeta={streamMeta}
                  onSelectCourse={onSelectCourse}
                />
              );
            })}
          </div>
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
                  fontFamily: 'var(--font-heading)',
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
            src="/images/student_hero.webp"
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


