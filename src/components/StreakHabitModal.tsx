import React from 'react';
import {
  Flame,
  Shield,
  Zap,
  Award,
  CheckCircle2,
  X,
  Calendar,
} from 'lucide-react';
import { UserProgressState } from '../types';

interface StreakHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgressState;
  userName?: string;
}

export const StreakHabitModal: React.FC<StreakHabitModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  userName = 'Learner',
}) => {
  if (!isOpen) return null;

  const streakDays = userProgress.streak_days || 0;
  const currentXp = userProgress.xp || 0;

  // Calculate real active days of the week based on streak and current day
  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  const dayNames = [
    { day: 'Mon', full: 'Monday' },
    { day: 'Tue', full: 'Tuesday' },
    { day: 'Wed', full: 'Wednesday' },
    { day: 'Thu', full: 'Thursday' },
    { day: 'Fri', full: 'Friday' },
    { day: 'Sat', full: 'Saturday' },
    { day: 'Sun', full: 'Sunday' },
  ];

  const daysOfWeek = dayNames.map((d, idx) => {
    const isActive =
      streakDays > 0 &&
      idx <= currentDayIndex &&
      idx >= currentDayIndex - streakDays + 1;
    return {
      day: d.day,
      full: d.full,
      active: isActive,
      shielded: false,
    };
  });

  const nextMilestone = streakDays < 7 ? 7 : streakDays < 14 ? 14 : streakDays < 30 ? 30 : streakDays + 7;
  const progressToMilestone = streakDays > 0 ? Math.min(100, Math.round((streakDays / nextMilestone) * 100)) : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 10, 20, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card-elevated"
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-subtle)',
          padding: '32px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
          animation: 'fadeInUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-subdued)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close Streak Modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header: Fire & Streak Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(245, 158, 11, 0.25)',
              flexShrink: 0,
            }}
          >
            <Flame size={36} color="#F59E0B" fill="#F59E0B" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                HABIT TRACKER
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Consistent Daily Practice
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{streakDays}-Day Active Streak!</span>
              <Flame size={24} color="#EA580C" className="animate-flame" />
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Way to go, {userName}! You have practiced every day this week.
            </p>
          </div>
        </div>

        {/* 7-Day Habit Tracker Visualizer */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--brand-primary)" /> Weekly Learning Calendar
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
              {streakDays} of 7 Days Active
            </span>
          </div>

          {/* Mon - Sun Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {daysOfWeek.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 4px',
                  borderRadius: '12px',
                  backgroundColor: d.active
                    ? 'rgba(0, 245, 160, 0.08)'
                    : 'var(--bg-surface)',
                  border: d.active
                    ? '1.5px solid var(--brand-primary)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: d.active ? '0 0 10px rgba(0, 245, 160, 0.15)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: d.active ? 'var(--brand-primary)' : 'var(--text-muted)',
                  }}
                >
                  {d.day}
                </span>

                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: d.active
                      ? 'var(--brand-primary)'
                      : 'var(--bg-surface-subdued)',
                    color: d.active ? '#03170E' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {d.active ? (
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  ) : d.shielded ? (
                    <Shield size={14} color="#F59E0B" />
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>•</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress & Streak Shield Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Milestone Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#F59E0B" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Next: {nextMilestone} Days
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Reach {nextMilestone} days for +100 XP & Streak Badge
            </div>
            {/* Mini Progress */}
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-surface-subdued)',
                overflow: 'hidden',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressToMilestone}%`,
                  backgroundColor: '#F59E0B',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          {/* Shield Status Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Streak Shield Active
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              1 Missed-day protection enabled automatically.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Zap size={14} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {currentXp} Total XP
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-primary"
          style={{
            height: '46px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Zap size={16} />
          <span>Keep the Momentum Going</span>
        </button>
      </div>
    </div>
  );
};
