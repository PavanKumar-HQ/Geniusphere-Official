import React from 'react';

export type MascotExpression =
  | 'happy'
  | 'thinking'
  | 'idea'
  | 'celebrating'
  | 'encouraging'
  | 'guidance'
  | 'loading'
  | 'coding'
  | 'teaching'
  | 'celebrating_certificate'
  | 'studying'
  | 'learning'
  | 'shield'
  | 'security';

export interface MascotSphereProps {
  pose?: MascotExpression;
  expression?: MascotExpression;
  size?: number;
  className?: string;
  speechBubble?: string;
  caption?: string;
  ariaLabel?: string;
  animated?: boolean;
  interactive?: boolean;
}

// Clean UI: Mascot disabled completely to keep the platform sleek, modern, professional,
// and focused on learning & courses like Coursera and Great Learning.
export const MascotSphere: React.FC<MascotSphereProps> = () => {
  return null;
};
