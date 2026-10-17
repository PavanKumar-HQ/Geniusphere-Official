import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  style,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          >
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`input-field ${className}`.trim()}
          style={{
            width: '100%',
            height: '40px',
            padding: leftIcon ? '0 14px 0 38px' : '0 14px',
            fontSize: '0.88rem',
            borderRadius: 'var(--radius-md)',
            border: error ? '1px solid var(--danger-border)' : '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            ...style,
          }}
          {...props}
        />
      </div>

      {error ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--danger-text)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  style,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={`input-field ${className}`.trim()}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '0.88rem',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--danger-border)' : '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          outline: 'none',
          lineHeight: 1.5,
          fontFamily: 'inherit',
          resize: 'vertical',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          ...style,
        }}
        {...props}
      />

      {error ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--danger-text)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};
