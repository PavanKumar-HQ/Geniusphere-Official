// ====================================================================
// Geniusphere 2.0 — Official Website & System Loading Animation Suite
// Botanical orbital rings, breathing mascot sphere, deterministic status
// ====================================================================

import React from 'react';
import { MascotSphere } from './MascotSphere';

export interface GeniusphereLoaderProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  overlay?: boolean;
  fullscreen?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export const GeniusphereLoader: React.FC<GeniusphereLoaderProps> = ({
  message = 'Welcome to Geniusphere!',
  submessage = 'Getting your interactive classroom ready...',
  size = 'md',
  overlay = false,
  fullscreen = false,
  theme = 'auto',
}) => {
  const isDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof document !== 'undefined' &&
      (document.documentElement.getAttribute('data-theme')?.includes('dark') ?? false));

  const sphereSize = size === 'sm' ? 44 : size === 'lg' ? 96 : size === 'xl' ? 120 : 68;
  const ringSize = size === 'sm' ? 76 : size === 'lg' ? 144 : size === 'xl' ? 180 : 108;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size === 'sm' ? '12px' : '20px',
        padding: size === 'sm' ? '16px' : '28px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Sleek Modern Spinner */}
      <div
        style={{
          width: size === 'sm' ? '32px' : size === 'lg' ? '54px' : '44px',
          height: size === 'sm' ? '32px' : size === 'lg' ? '54px' : '44px',
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--brand-primary, #10B981)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />

      {/* Message Text with Brand Typography */}
      <div>
        <div
          style={{
            fontSize: size === 'sm' ? '0.84rem' : size === 'xl' ? '1.25rem' : '1.02rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display-brand, Inter, sans-serif)',
            letterSpacing: '-0.015em',
          }}
        >
          {message}
        </div>
        {submessage && (
          <div
            style={{
              fontSize: size === 'sm' ? '0.74rem' : '0.82rem',
              color: 'var(--text-muted)',
              marginTop: '6px',
              maxWidth: size === 'xl' ? '400px' : '320px',
              lineHeight: 1.45,
            }}
          >
            {submessage}
          </div>
        )}
      </div>

      {/* Modern Determinate/Indeterminate Pulse Track */}
      <div
        style={{
          width: size === 'sm' ? '120px' : '180px',
          height: '4px',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: '100px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '45%',
            backgroundColor: 'var(--brand-primary, #10B981)',
            borderRadius: '100px',
            animation: 'shimmer 1.6s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );

  // Fullscreen Website Loader (Initial Load / Persona Switch / Global Boot)
  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '24px',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {content}
      </div>
    );
  }

  // Overlay Loader (Inside Cards / Panels / Containers)
  if (overlay) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--bg-canvas)',
          opacity: 0.94,
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          borderRadius: 'inherit',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
