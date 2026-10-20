import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-lab-blue/10 text-lab-blue border-lab-blue/30',
    purple: 'bg-lab-purple/10 text-lab-purple border-lab-purple/30',
    green: 'bg-lab-green/10 text-lab-green border-lab-green/30',
    red: 'bg-lab-red/10 text-lab-red border-lab-red/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
};