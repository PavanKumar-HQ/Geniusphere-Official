import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface FeedbackAlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  type = 'info',
  title,
  children,
  onDismiss,
  className = '',
  style,
}) => {
  const config = {
    info: {
      bg: 'var(--brand-surface)',
      border: 'var(--brand-border)',
      color: 'var(--brand-primary)',
      icon: <Info size={18} />,
    },
    success: {
      bg: 'var(--success-bg)',
      border: 'var(--success-border)',
      color: 'var(--success-text)',
      icon: <CheckCircle2 size={18} />,
    },
    warning: {
      bg: 'var(--warning-bg)',
      border: 'var(--warning-border)',
      color: 'var(--warning-text)',
      icon: <AlertTriangle size={18} />,
    },
    danger: {
      bg: 'var(--danger-bg)',
      border: 'var(--danger-border)',
      color: 'var(--danger-text)',
      icon: <AlertCircle size={18} />,
    },
  }[type];

  return (
    <div
      role="alert"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.88rem',
        lineHeight: 1.5,
        ...style,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{config.icon}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '2px' }}>{title}</div>}
        <div style={{ color: 'var(--text-primary)' }}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: 'inherit',
            opacity: 0.7,
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
