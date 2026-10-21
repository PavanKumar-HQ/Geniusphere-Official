import React from 'react';

const BackgroundGrid: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Base Tech Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `linear-gradient(#3BF0FF 1px, transparent 1px), linear-gradient(90deg, #3BF0FF 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Subtle Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(7, 11, 26, 0.2) 0%, #070B1A 90%)',
        }}
      />
    </div>
  );
};

export default BackgroundGrid;
