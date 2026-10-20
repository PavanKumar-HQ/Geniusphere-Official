
import React from 'react';

const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#E6E9F0 1px, transparent 1px), linear-gradient(90deg, #E6E9F0 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070B1A]/50 to-[#070B1A]" />
      
      {/* Moving Particles/Glows */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[100px] opacity-[0.05] animate-pulse"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? '#3BF0FF' : '#7C6BFF',
              animationDelay: `${i * 2}s`,
              animationDuration: `${10 + i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundGrid;
