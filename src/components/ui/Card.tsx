import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  const baseClass = {
    default: 'card',
    elevated: 'card card-elevated',
    bordered: 'card',
  }[variant];

  const paddingStyle: Record<'none' | 'sm' | 'md' | 'lg', React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: '14px 16px' },
    md: { padding: '20px 24px' },
    lg: { padding: '32px 36px' },
  };

  return (
    <div
      className={`${baseClass} ${className}`.trim()}
      style={{
        ...paddingStyle[padding],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginBottom: '16px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  style,
  ...props
}) => (
  <h3
    style={{
      fontSize: 'var(--text-card-title)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  style,
  ...props
}) => (
  <p
    style={{
      fontSize: '0.88rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => (
  <div style={{ flex: 1, ...style }} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '16px',
      marginTop: '16px',
      borderTop: '1px solid var(--border-subtle)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
