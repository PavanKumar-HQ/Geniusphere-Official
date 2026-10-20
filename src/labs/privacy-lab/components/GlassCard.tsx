
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase font-mono">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
