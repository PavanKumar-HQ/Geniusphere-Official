import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'quest' | 'questioning';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  icon,
  className = '',
  style,
  ...props
}) => {
  const baseClass = {
    brand: 'badge badge-brand',
    quest: 'badge badge-quest',
    questioning: 'badge badge-questioning',
    accent: 'badge badge-accent',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-danger',
    neutral: 'badge badge-neutral',
  }[variant];

  const sizeStyle: Record<'sm' | 'md', React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '0.72rem' },
    md: { padding: '4px 10px', fontSize: '0.78rem' },
  };

  return (
    <span
      className={`${baseClass} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        ...sizeStyle[size],
        ...style,
      }}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
