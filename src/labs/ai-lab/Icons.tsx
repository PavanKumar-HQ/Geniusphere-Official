import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

function getIconDimensions(className: string = ''): { width: number; height: number } {
  if (className.includes('w-12') || className.includes('h-12')) return { width: 48, height: 48 };
  if (className.includes('w-10') || className.includes('h-10')) return { width: 40, height: 40 };
  if (className.includes('w-8') || className.includes('h-8')) return { width: 32, height: 32 };
  if (className.includes('w-6') || className.includes('h-6')) return { width: 24, height: 24 };
  if (className.includes('w-5') || className.includes('h-5')) return { width: 20, height: 20 };
  if (className.includes('w-4') || className.includes('h-4')) return { width: 16, height: 16 };
  if (className.includes('w-3') || className.includes('h-3')) return { width: 12, height: 12 };
  return { width: 20, height: 20 };
}

export const Shield: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.955 11.955 0 00-1.766 6.894c0 1.156-.16 2.276-.455 3.335a12.01 12.01 0 01-2.039 4.31m0 0a11.95 11.95 0 01-4.744 3.748 11.95 11.95 0 01-4.744-3.748m0 0a12.01 12.01 0 01-2.039-4.31A12.01 12.01 0 002.25 12c0 1.156.16 2.276.455 3.335a12.01 12.01 0 002.039 4.31m11.264-12.01a11.955 11.955 0 00-8.618-3.04" />
    </svg>
  );
};

export const Play: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
};

export const AlertTriangle: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
};

export const CheckCircle: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export const Info: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export const Terminal: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => {
  const { width, height } = getIconDimensions(className);
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px`, flexShrink: 0, display: 'inline-block', ...style }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
};
