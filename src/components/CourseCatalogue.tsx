import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Search,
  BookOpen,
  Play,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface CourseCatalogueProps {
  db: InMemoryDatabase;
  onSelectCourse: (slug: string) => void;
  onNavigateHome: () => void;
  initialDomain?: string;
}

export const CourseCatalogue: React.FC<CourseCatalogueProps> = ({
  db,
  onSelectCourse,
  onNavigateHome,
  initialDomain = 'all',
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
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={14} />
          </div>
          <span>BACK TO HOME</span>
        </button>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
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
                color: selectedLevel === lvl ? 'var(--brand-cyan-light)' : 'var(--text-secondary)',
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
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '26px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${course.domain === 'technology' ? 'badge-brand' : course.domain === 'coding' ? 'badge-accent' : course.domain === 'finance' ? 'badge-warning' : 'badge-neutral'}`}>
                  {course.domain.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  <BookOpen size={16} />
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.35, color: '#FFFFFF' }}>
                {course.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: '1' }}>
                {course.summary}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  #{course.domain}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  #{course.level}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34D399', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  #10Videos
                </span>
                <span style={{ fontSize: '0.75rem', color: '#22D3EE', backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  #Sandbox
                </span>
              </div>

              {/* Bottom row matching Image 2 */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Play size={14} style={{ color: 'var(--brand-cyan-light)' }} />
                  <span>{course.modules.length} Modules</span>
                </span>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onSelectCourse(course.slug)}
                  style={{ height: '36px', fontSize: '0.82rem', padding: '0 14px' }}
                >
                  <span>Start Course</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
