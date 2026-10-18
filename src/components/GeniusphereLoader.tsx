import React from 'react';
import { MascotSphere } from './MascotSphere';

interface GeniusphereLoaderProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  theme?: 'light' | 'dark';
}

export const GeniusphereLoader: React.FC<GeniusphereLoaderProps> = ({
  message = 'Processing in secure runtime...',
  submessage = 'Verifying deterministic invariants & state sync',
  size = 'md',
  overlay = false,
  theme = 'light',
}) => {
  const sphereSize = size === 'sm' ? 48 : size === 'lg' ? 96 : 72;
  const ringSize = size === 'sm' ? 80 : size === 'lg' ? 144 : 110;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      {/* Orbital Mascot Sphere Container */}
      <div
        style={{
          position: 'relative',
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated Botanical Orbital Rings */}
        <svg
          viewBox="0 0 120 120"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            animation: 'rotateFan 3.5s linear infinite',
          }}
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#E5F0DF"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#43A85B"
            strokeWidth="3.5"
            strokeDasharray="45 180"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="#D9F477"
            strokeWidth="2.5"
            strokeDasharray="30 120"
            strokeLinecap="round"
            style={{
              animation: 'rotateFan 2s linear infinite reverse',
              transformOrigin: 'center',
            }}
          />
          {/* Orbital Satellite Dot */}
          <circle cx="60" cy="6" r="4.5" fill="#43A85B" />
        </svg>

        {/* Mascot Center with Subtle Breathing Pulse */}
        <div className="signal-pulse">
          <MascotSphere pose="loading" size={sphereSize} />
        </div>
      </div>

      {/* Message Text */}
      <div>
        <div
          style={{
            fontSize: size === 'sm' ? '0.86rem' : '1.02rem',
            fontWeight: 800,
            color: theme === 'dark' ? '#F0FDF4' : 'var(--text-primary)',
            fontFamily: 'var(--font-display-brand)',
            letterSpacing: '-0.01em',
          }}
        >
          {message}
        </div>
        {submessage && (
          <div
            style={{
              fontSize: '0.78rem',
              color: theme === 'dark' ? '#94A3B8' : 'var(--text-muted)',
              marginTop: '4px',
              maxWidth: '320px',
              lineHeight: 1.4,
            }}
          >
            {submessage}
          </div>
        )}
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(250, 250, 244, 0.88)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          borderRadius: 'inherit',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
