// ====================================================================
// Geniusphere 2.0 — Not Found & Error State Component
// Accessible, Helpful Route Boundary with Curriculum Recovery Suggestions
// ====================================================================

import React from 'react';
import {
  Compass,
  Home,
  BookOpen,
  Terminal,
  ArrowRight,
} from 'lucide-react';

interface NotFoundViewProps {
  attemptedRoute?: string;
  onNavigateHome: () => void;
  onNavigateCatalogue: () => void;
  onNavigateLabs: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  attemptedRoute,
  onNavigateHome,
  onNavigateCatalogue,
  onNavigateLabs,
}) => {
  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '60px auto 100px',
        padding: '0 24px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '56px 36px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface-subdued)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Compass size={36} />
        </div>

        <span className="badge badge-neutral" style={{ fontSize: '0.78rem', marginBottom: '12px' }}>
          HTTP 404 • ROUTE NOT FOUND
        </span>

        <h1
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: '8px 0 16px',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          Curriculum Destination Uncharted
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          The resource {attemptedRoute ? `"${attemptedRoute}"` : 'you requested'} does not exist or may have been consolidated in the latest accredited syllabus release.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <Home size={16} />
            <span>Return to Home</span>
          </button>

          <button
            type="button"
            onClick={onNavigateCatalogue}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-canvas)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={16} color="var(--brand-primary)" />
            <span>Explore Courses</span>
          </button>

          <button
            type="button"
            onClick={onNavigateLabs}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-canvas)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <Terminal size={16} color="#2563EB" />
            <span>Interactive Labs</span>
          </button>
        </div>

        {/* Helpful Guidance */}
        <div
          style={{
            padding: '18px 24px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Looking for verified curriculum subjects?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              All 40 canonical courses and 14 interactive simulation engines are actively accessible from the navigation bar.
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateCatalogue}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <span>View Catalogue</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
