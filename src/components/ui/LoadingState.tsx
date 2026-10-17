import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading workspace resources...',
  minHeight = '240px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        minHeight,
        padding: '32px',
        color: 'var(--text-secondary)',
      }}
    >
      <Loader2 size={32} color="var(--brand-primary)" className="animate-spin" />
      <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        opacity: 0.6,
      }}
    >
      <div style={{ height: '20px', width: '40%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px' }} />
      <div style={{ height: '16px', width: '80%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px' }} />
      <div style={{ height: '14px', width: '60%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px' }} />
    </div>
  );
};
