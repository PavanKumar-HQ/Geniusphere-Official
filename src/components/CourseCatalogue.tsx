import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Search,
  BookOpen,
  Play,
  ArrowRight,
  ArrowLeft,
  Clock,
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
  onNavigateHome,
  initialDomain = 'all',
  onLaunchLab,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const courses = db.getCourses({
    search,
    domain: selectedDomain,
    level: selectedLevel,
  });

  const allList = db.getCourses();
  const techCount = allList.filter((c) => c.domain === 'technology').length;
  const codingCount = allList.filter((c) => c.domain === 'coding').length;
  const finCount = allList.filter((c) => c.domain === 'finance').length;
  const profCount = allList.filter((c) => c.domain === 'professional').length;

  const domains: { id: string; label: string }[] = [
    { id: 'all', label: `All (${allList.length})` },
    { id: 'technology', label: `Technology (${techCount})` },
    { id: 'coding', label: `Coding & Programming (${codingCount})` },
    { id: 'finance', label: `Finance (${finCount})` },
    { id: 'professional', label: `Professional Development (${profCount})` },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Navigation & Back Link */}
      <div>
        <button
          type="button"
          onClick={onNavigateHome}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px',
            padding: 0,
            minHeight: 'auto',
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={14} />
          </div>
          <span>BACK TO HOME</span>
        </button>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Course Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px' }}>
          Explore our approved 27-course curriculum across Technology, Coding & Programming, Finance, and Professional Development.
        </p>
      </div>

      {/* Filter Pills & Search Bar matching Image 2 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Domain Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {domains.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id)}
                className={`filter-pill ${selectedDomain === d.id ? 'active' : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, topics, keywords..."
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px' }}
            />
          </div>
        </div>

        {/* Level filter row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Filter by difficulty:</span>
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              style={{
                background: 'none',
                border: 'none',
                color: selectedLevel === lvl ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: selectedLevel === lvl ? 700 : 500,
                textDecoration: selectedLevel === lvl ? 'underline' : 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px 6px',
                minHeight: 'auto',
              }}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '16px' }}>
            No courses matched your search or filters.
          </p>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setSearch('');
              setSelectedDomain('all');
              setSelectedLevel('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => onSelectCourse(course.slug)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="category-tag-pill">
                  {course.domain.toUpperCase()}
                </span>
                <button
                  type="button"
                  className="syllabus-circle-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCourse(course.slug);
                  }}
                  title="View Course Syllabus"
                >
                  <BookOpen size={17} />
                </button>
              </div>

              <h3>{course.title}</h3>

              <p>{course.summary}</p>

              {/* Tags matching Image 1 */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="topic-hashtag-pill">
                  #{course.domain === 'technology' ? 'Tech' : course.domain === 'coding' ? 'Programming' : course.domain === 'finance' ? 'Finance' : 'Career'}
                </span>
                <span className="topic-hashtag-pill">
                  #{course.slug.split('-')[0].charAt(0).toUpperCase() + course.slug.split('-')[0].slice(1)}
                </span>
                <span className="topic-hashtag-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                  #10Sims
                </span>
              </div>

              {/* Bottom row matching reference Image 1 */}
              <div className="course-card-footer">
                <span className="modules-badge">
                  <Clock size={16} />
                  <span>10 Modules</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="play-sim-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const allLabs = db.getLabDefinitions();
                      const matched = allLabs.find(
                        (l) => l.course_slug === course.slug || l.category === course.domain
                      ) || allLabs[0];
                      if (onLaunchLab) {
                        onLaunchLab(matched.slug);
                      } else {
                        onSelectCourse(course.slug);
                      }
                    }}
                    title="Launch Interactive Lab"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <button
                    type="button"
                    className="arrow-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course.slug);
                    }}
                    title="Open Course"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
