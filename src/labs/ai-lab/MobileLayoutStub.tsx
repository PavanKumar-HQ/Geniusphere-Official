// Stub for MobileLayout components — not needed in platform integration
// The desktop layout is used by default in the embedded AI lab workspace

import React from 'react';

interface MobileLayoutProps {
  title?: string;
  description?: React.ReactNode;
  badges?: React.ReactNode[];
  visualContent?: React.ReactNode;
  controls?: React.ReactNode;
  infoContent?: React.ReactNode;
  onMenuToggle?: () => void;
  onExit?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ visualContent, controls, infoContent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
    <div>{visualContent}</div>
    <div>{controls}</div>
    <div>{infoContent}</div>
  </div>
);

interface MobileBadgeProps {
  variant?: string;
  children: React.ReactNode;
}

export const MobileBadge: React.FC<MobileBadgeProps> = ({ children }) => (
  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '100px', backgroundColor: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}>
    {children}
  </span>
);

interface MobileControlGroupProps {
  onPlay?: () => void;
  onReset?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isPlaying?: boolean;
}

export const MobileControlGroup: React.FC<MobileControlGroupProps> = ({ onPlay, onReset, isPlaying }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <button type="button" onClick={onPlay} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#06B6D4', color: '#000', fontWeight: 700, cursor: 'pointer' }}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
    <button type="button" onClick={onReset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#94A3B8', cursor: 'pointer' }}>
      Reset
    </button>
  </div>
);
