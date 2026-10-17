import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Search, BookOpen, Clock, ChevronRight } from 'lucide-react';

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
  const [showPublishedOnly, setShowPublishedOnly] = useState<boolean>(false);

  const courses = db.getCourses({
    search,
    domain: selectedDomain,
    level: selectedLevel,
    publishedOnly: showPublishedOnly,
  });

  const domains: { id: string; label: string }[] = [
    { id: 'all', label: 'All Subjects (27)' },
    { id: 'technology', label: 'Technology (8)' },
    { id: 'coding', label: 'Coding & Programming (7)' },
    { id: 'finance', label: 'Finance (7)' },
    { id: 'professional', label: 'Professional Skills (5)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">STRICTLY AUTHORIZED 27-SUBJECT CURRICULUM</span>
              <span className="badge badge-neutral">Technology • Finance • Professional • Coding</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Course Catalogue</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Browse the strictly verified curriculum across Technology, Coding & Programming, Finance, and Professional Skills.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={onNavigateHome}
          >
            Back to Home
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, subjects, or keywords (e.g. SQL, AI, Finance, Resume)..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '0.9rem',
            }}
          >
            <option value="all">All Difficulty Levels</option>
            <option value="beginner">Beginner / Foundational</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={showPublishedOnly}
              onChange={(e) => setShowPublishedOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
            />
            <span>Published Only</span>
          </label>
        </div>

        {/* Domain Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {domains.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDomain(d.id)}
              className={selectedDomain === d.id ? 'btn-primary' : 'btn-secondary'}
              style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem' }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{courses.length}</strong> courses
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No courses matched your search criteria. Try clearing filters.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {courses.map((course) => (
              <div
                key={course.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: course.is_published ? '3px solid var(--brand-primary)' : '3px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-brand">
                      {course.domain === 'coding' ? 'CODING & PROGRAMMING' : course.domain.toUpperCase()}
                    </span>
                    {course.availability_status === 'verified_functional' ? (
                      <span className="badge badge-success">VERIFIED & USABLE</span>
                    ) : course.availability_status === 'implemented_in_build' ? (
                      <span className="badge badge-brand">IMPLEMENTED IN BUILD</span>
                    ) : (
                      <span className="badge badge-neutral">IN DEVELOPMENT</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{course.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Subject: <strong>{course.subject}</strong>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {course.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {course.duration_hours} hrs
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={14} /> {course.modules.length > 0 ? `${course.modules.length} modules` : 'Full syllabus'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={course.is_published ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => onSelectCourse(course.slug)}
                  style={{ width: '100%', height: '40px', fontSize: '0.85rem' }}
                >
                  <span>{course.is_published ? 'View Course & Enroll' : 'Inspect Syllabus'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
