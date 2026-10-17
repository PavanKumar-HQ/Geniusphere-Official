import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'danger' | 'ghost' | 'quest' | 'questioning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    accent: 'btn-accent',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    quest: 'btn-quest',
    questioning: 'btn-questioning',
  }[variant] || 'btn-primary';

  const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
    sm: { height: '32px', padding: '0 12px', fontSize: '0.8rem', gap: '6px' },
    md: { height: '40px', padding: '0 16px', fontSize: '0.88rem', gap: '8px' },
    lg: { height: '48px', padding: '0 24px', fontSize: '1rem', gap: '10px' },
  };

  return (
    <button
      type="button"
      className={`${baseClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      style={{
        ...sizeStyles[size],
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled || isLoading ? 0.65 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon}
    </button>
  );
};
