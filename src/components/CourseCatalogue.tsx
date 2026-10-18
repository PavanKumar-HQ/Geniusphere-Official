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
  ChevronRight,
  Sparkles,
  Terminal,
  ShieldCheck,
  Briefcase,
  GraduationCap,
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
  const [expandedStreams, setExpandedStreams] = useState<Record<string, boolean>>({
    technology: false,
    finance: false,
    professional: false,
  });

  const streams = db.getCanonicalStreams();
  const allCanonicalCourses = db.getCanonicalCourses();

  // Filtered courses for search or individual stream view
  const filteredCourses = db.getCanonicalCourses({
    stream: selectedStream === 'all' ? undefined : selectedStream,
    search: search.trim() ? search : undefined,
    level: selectedLevel === 'all' ? undefined : selectedLevel,
  });

  const toggleStreamExpand = (streamId: string) => {
    setExpandedStreams((prev) => ({
      ...prev,
      [streamId]: !prev[streamId],
    }));
  };

  const getStreamIcon = (streamId: string, size: number = 20) => {
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

  const getCourseItemIcon = (streamId: string, idx: number) => {
    if (streamId === 'technology') {
      const icons = [<Sparkles key="sp" size={16} />, <Cpu key="cp" size={16} />, <Terminal key="tm" size={16} />, <ShieldCheck key="sc" size={16} />];
      return icons[idx % icons.length];
    }
    if (streamId === 'finance') {
      const icons = [<Coins key="co" size={16} />, <Award key="aw" size={16} />, <Briefcase key="bc" size={16} />, <CheckCircle2 key="ck" size={16} />];
      return icons[idx % icons.length];
    }
    const icons = [<Users key="us" size={16} />, <Clock key="cl" size={16} />, <Sparkles key="sp2" size={16} />, <GraduationCap key="gc" size={16} />];
    return icons[idx % icons.length];
  };

  const isBrowsingAllWithoutSearch = selectedStream === 'all' && !search.trim() && selectedLevel === 'all';

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
      }}
    >
      {/* ================================================================ */}
      {/* TOP HEADER SECTION WITH MASCOT & STAT BADGES (Design Board 2) */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.1fr 1fr',
          gap: '28px',
          alignItems: 'center',
          backgroundColor: '#FAFAF4',
          borderRadius: '24px',
          padding: '36px 36px 28px',
          border: '1px solid #E5F0DF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left: Titles & Mission Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: '#E5F0DF',
                color: '#26352A',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}
            >
              <Sparkles size={13} color="#43A85B" /> Practical Skills Platform
            </span>
            <h1
              style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: '#26352A',
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
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#43A85B',
              margin: 0,
            }}
          >
            Choose your path. Build real skills.
          </h2>

          <p
            style={{
              color: '#3A4E40',
              fontSize: '0.98rem',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Explore our curated 40-course curriculum across Technology, Finance and Professional Skills.
            Learn at your own pace, with hands-on practice, real projects and meaningful feedback.
          </p>
        </div>

        {/* Center: Mascot Sphere with Playful Angled Quote */}
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
              top: '-12px',
              left: '10px',
              transform: 'rotate(-7deg)',
              fontFamily: 'Space Grotesk, cursive, sans-serif',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#26352A',
              backgroundColor: '#D9F477',
              padding: '4px 12px',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              zIndex: 2,
            }}
          >
            Small steps. Big dreams.
          </div>
          <MascotSphere pose="happy" size={170} />
        </div>

        {/* Far Right: Stacked Stat Badges matching Design Board 2 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            padding: '20px',
            borderRadius: '18px',
            border: '1px solid #E5F0DF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E5F0DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#43A85B',
                flexShrink: 0,
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#26352A' }}>3 Learning Streams</div>
              <div style={{ fontSize: '0.78rem', color: '#6A7D70' }}>Structured career pathways</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E5F0DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#43A85B',
                flexShrink: 0,
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#26352A' }}>40+ Courses</div>
              <div style={{ fontSize: '0.78rem', color: '#6A7D70' }}>Modular, self-paced learning</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E5F0DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#43A85B',
                flexShrink: 0,
              }}
            >
              <Terminal size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#26352A' }}>Hands-on Labs & Projects</div>
              <div style={{ fontSize: '0.78rem', color: '#6A7D70' }}>Interactive browser execution</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E5F0DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#43A85B',
                flexShrink: 0,
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#26352A' }}>Earn Verifiable Certificates</div>
              <div style={{ fontSize: '0.78rem', color: '#6A7D70' }}>Cryptographic verification hash</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FILTER CONTROLS (Shown when searching or filtering)              */}
      {/* ================================================================ */}
      {!isBrowsingAllWithoutSearch ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#FFFFFF',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid #E5F0DF',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Stream Filter Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedStream('all')}
                style={{
                  backgroundColor: selectedStream === 'all' ? '#43A85B' : '#E5F0DF',
                  color: selectedStream === 'all' ? '#FFFFFF' : '#26352A',
                  border: 'none',
                  fontWeight: 700,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                All Streams ({allCanonicalCourses.length})
              </button>

              {streams.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStream(s.id)}
                  style={{
                    backgroundColor: selectedStream === s.id ? '#43A85B' : '#E5F0DF',
                    color: selectedStream === s.id ? '#FFFFFF' : '#26352A',
                    border: 'none',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {getStreamIcon(s.id, 14)}
                  <span>
                    {s.title} ({s.courses.length})
                  </span>
                </button>
              ))}
            </div>

            {/* Clear Filters Button */}
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedStream('all');
                setSelectedLevel('all');
              }}
              style={{
                background: 'none',
                border: '1px solid #E5F0DF',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                color: '#6A7D70',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reset to 3 Streams View
            </button>
          </div>
        </div>
      ) : null}

      {/* ================================================================ */}
      {/* 3-COLUMN STREAM LAYOUT (When "All Streams" is active)             */}
      {/* Exactly mirrors Design Board 2 (media_1792296532547.jpg)         */}
      {/* ================================================================ */}
      {isBrowsingAllWithoutSearch ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {streams.map((stream) => {
            const isExpanded = expandedStreams[stream.id];
            const displayedCourses = isExpanded ? stream.courses : stream.courses.slice(0, 5);

            return (
              <div
                key={stream.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E5F0DF',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {/* Stream Header */}
                <div
                  style={{
                    backgroundColor: '#FAFAF4',
                    padding: '24px 22px 18px',
                    borderBottom: '1px solid #E5F0DF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#E5F0DF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#43A85B',
                      }}
                    >
                      {getStreamIcon(stream.id, 22)}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStream(stream.id)}
                      style={{
                        backgroundColor: '#D9F477',
                        color: '#26352A',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '4px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{stream.courses.length} Courses</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#26352A',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {stream.title}
                    </h3>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '0.88rem',
                        color: '#6A7D70',
                      }}
                    >
                      {stream.summary}
                    </p>
                  </div>
                </div>

                {/* Course List Items */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {displayedCourses.map((c, idx) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectCourse(c.slug)}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #F0F4EC',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAFAF4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#E5F0DF',
                          color: '#43A85B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getCourseItemIcon(stream.id, idx)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '0.94rem',
                            color: '#26352A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {c.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: '#6A7D70',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px',
                          }}
                        >
                          {c.summary}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: '#43A85B',
                            marginTop: '4px',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <BookOpen size={12} /> {c.modules_count} modules
                          </span>
                          <span>•</span>
                          <span>{c.duration_hours}h</span>
                          <span>•</span>
                          <span style={{ textTransform: 'capitalize' }}>{c.difficulty}</span>
                        </div>
                      </div>

                      <ChevronRight size={18} color="#A3B8A8" />
                    </div>
                  ))}
                </div>

                {/* Bottom View All Button */}
                <div style={{ padding: '14px 20px', backgroundColor: '#FAFAF4', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => toggleStreamExpand(stream.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#43A85B',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>
                      {isExpanded ? `Show fewer courses` : `View all ${stream.courses.length} courses`}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================================================================ */
        /* FILTERED OR SEARCH RESULTS GRID */
        /* ================================================================ */
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.92rem', color: '#6A7D70' }}>
              Showing <strong>{filteredCourses.length}</strong> matching courses
            </span>
            {(selectedStream !== 'all' || selectedLevel !== 'all' || search.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('all');
                  setSelectedLevel('all');
                  setSearch('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#43A85B',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '64px 20px',
                textAlign: 'center',
                border: '1px solid #E5F0DF',
              }}
            >
              <MascotSphere pose="thinking" size={120} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#26352A', margin: '16px 0 8px' }}>
                No courses matched your search
              </h3>
              <p style={{ color: '#6A7D70', fontSize: '0.95rem', marginBottom: '20px' }}>
                Try adjusting your search terms or difficulty filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedStream('all');
                  setSelectedLevel('all');
                }}
                style={{
                  backgroundColor: '#43A85B',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                }}
              >
                Show All Courses
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredCourses.map((course: Course) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.slug)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E5F0DF',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          backgroundColor: '#E5F0DF',
                          color: '#26352A',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {course.domain}
                      </span>
                      <span
                        style={{
                          backgroundColor: '#FAFAF4',
                          color: '#43A85B',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {course.level}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: '#26352A',
                        lineHeight: 1.3,
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {course.title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: '#3A4E40',
                        lineHeight: 1.5,
                      }}
                    >
                      {course.summary}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #F0F4EC',
                      paddingTop: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: '#6A7D70' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {course.duration_hours}h
                      </span>
                      <span>•</span>
                      <span>{course.modules.length} Modules</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.slug);
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#43A85B',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* BOTTOM CTA & TESTIMONIAL BANNER (Matching Design Board 2)        */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {/* 1. Left Card: Ready to start your journey? */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5F0DF',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <MascotSphere pose="happy" size={90} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#26352A',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                Ready to start your journey?
              </h3>
              <p style={{ margin: '4px 0 0', color: '#6A7D70', fontSize: '0.84rem' }}>
                Join thousands of learners building skills for a better future.
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
                  backgroundColor: '#43A85B',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                }}
              >
                <span>Explore all courses</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Center Card: 4 Feature Pillars */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5F0DF',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            alignContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E5F0DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43A85B' }}>
              <CheckCircle2 size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#26352A' }}>Self-paced learning</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E5F0DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43A85B' }}>
              <Terminal size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#26352A' }}>Hands-on projects & labs</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E5F0DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43A85B' }}>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#26352A' }}>Expert feedback</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E5F0DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43A85B' }}>
              <Award size={18} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#26352A' }}>Certificates & recognition</div>
          </div>
        </div>

        {/* 3. Right Card: Editorial Student Testimonial with Photo */}
        <div
          style={{
            backgroundColor: '#26352A',
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
            <span style={{ color: '#D9F477', fontSize: '1.6rem', lineHeight: 1, fontFamily: 'serif' }}>“</span>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.5,
                fontWeight: 500,
                color: '#FAFAF4',
                margin: '2px 0 8px',
              }}
            >
              Geniusphere made learning practical and exciting. I built real projects and gained confidence in my skills.
            </p>
            <div style={{ fontSize: '0.76rem', color: '#D9F477', fontWeight: 700 }}>
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
              border: '2px solid #D9F477',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};
