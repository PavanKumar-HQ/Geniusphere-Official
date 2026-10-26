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
  onClaimDailyStreak?: () => void;
}

export const StreakHabitModal: React.FC<StreakHabitModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  userName = 'Learner',
  onClaimDailyStreak,
}) => {
  if (!isOpen) return null;

  const streakDays = userProgress.streak_days || 0;
  const currentXp = userProgress.xp || 0;

  const now = new Date();
  const currentHour = now.getHours();
  const currentSlot: 'morning' | 'evening' = currentHour < 14 ? 'morning' : 'evening';
  const todayDateStr = now.toISOString().split('T')[0];

  const claimsToday = userProgress.last_streak_claim_date === todayDateStr
    ? (userProgress.streak_claims_today || 0)
    : 0;

  const isMorningClaimed = claimsToday >= 2 || (claimsToday === 1 && userProgress.last_streak_claim_session === 'morning');
  const isEveningClaimed = claimsToday >= 2 || (claimsToday === 1 && userProgress.last_streak_claim_session === 'evening');

  const canClaimNow = claimsToday < 2 && !(claimsToday === 1 && userProgress.last_streak_claim_session === currentSlot);

  // Calculate real active days of the week based on streak and current date & time
  const currentDayIndex = (now.getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  const mondayOfWeek = new Date(now);
  mondayOfWeek.setDate(now.getDate() - currentDayIndex);
  mondayOfWeek.setHours(0, 0, 0, 0);

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
    const dayDate = new Date(mondayOfWeek);
    dayDate.setDate(mondayOfWeek.getDate() + idx);
    const isToday = idx === currentDayIndex;
    const isActive =
      streakDays > 0 &&
      idx <= currentDayIndex &&
      idx >= currentDayIndex - streakDays + 1;
    return {
      day: d.day,
      full: d.full,
      dateNum: dayDate.getDate(),
      isToday,
      active: isActive,
      shielded: false,
    };
  });

  const nextMilestone = streakDays < 7 ? 7 : streakDays < 14 ? 14 : streakDays < 30 ? 30 : streakDays + 7;
  const progressToMilestone = streakDays > 0 ? Math.min(100, Math.round((streakDays / nextMilestone) * 100)) : 0;
  const dailyCheckinProgress = Math.round((claimsToday / 2) * 100);

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
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '18px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(245, 158, 11, 0.25)',
              flexShrink: 0,
            }}
          >
            <Flame size={32} color="#F59E0B" fill="#F59E0B" />
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
                2 Daily Check-ins (Morning & Evening)
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{streakDays}-Day Learning Streak</span>
              <Flame size={20} color="#EA580C" />
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Check in twice daily to maintain consistency and double your bonus XP.
            </p>
          </div>
        </div>

        {/* 2-Times Daily Check-in Slots with Progress Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Today's Check-in Progress ({claimsToday}/2 completed)
            </span>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: claimsToday === 2 ? '#10B981' : '#F59E0B' }}>
              {dailyCheckinProgress}%
            </span>
          </div>

          {/* Daily Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-subdued)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${dailyCheckinProgress}%`,
                backgroundColor: claimsToday === 2 ? '#10B981' : '#F59E0B',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* 2 Check-in Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '2px' }}>
            {/* Slot 1: Morning Check-in */}
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: isMorningClaimed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                border: isMorningClaimed ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Morning Slot
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Before 2:00 PM • +25 XP
                </div>
              </div>
              {isMorningClaimed ? (
                <CheckCircle2 size={18} color="#10B981" />
              ) : (
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {currentSlot === 'morning' ? 'Open' : 'Pending'}
                </span>
              )}
            </div>

            {/* Slot 2: Evening Check-in */}
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: isEveningClaimed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                border: isEveningClaimed ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Evening Slot
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  After 2:00 PM • +25 XP
                </div>
              </div>
              {isEveningClaimed ? (
                <CheckCircle2 size={18} color="#10B981" />
              ) : (
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {currentSlot === 'evening' ? 'Open' : 'Pending'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 7-Day Habit Tracker Visualizer */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--brand-primary)" /> Weekly Learning Calendar
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
              {streakDays} Days Active
            </span>
          </div>

          {/* Mon - Sun Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {daysOfWeek.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 2px',
                  borderRadius: '10px',
                  backgroundColor: d.active
                    ? 'var(--brand-surface)'
                    : 'var(--bg-surface)',
                  border: d.active
                    ? '1.5px solid var(--brand-primary)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: d.active || d.isToday ? 'var(--brand-primary)' : 'var(--text-muted)',
                  }}
                >
                  {d.day}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    color: d.isToday ? 'var(--brand-primary)' : 'var(--text-muted)',
                  }}
                >
                  {d.dateNum}
                </span>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: d.active
                      ? 'var(--brand-primary)'
                      : 'var(--bg-surface-subdued)',
                    color: d.active ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {d.active ? <CheckCircle2 size={14} /> : <span style={{ fontSize: '0.62rem' }}>•</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone & Shield Status with Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Milestone Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Award size={15} color="#F59E0B" />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Milestone
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B' }}>
                {nextMilestone} Days
              </span>
            </div>
            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-surface-subdued)',
                overflow: 'hidden',
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
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {streakDays}/{nextMilestone} days ({progressToMilestone}%)
            </div>
          </div>

          {/* Shield Status Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={15} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Streak Shield
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={13} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {currentXp} Total XP
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Missed-day protection active
            </div>
          </div>
        </div>

        {/* Action Button: Check In / Claim Now */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onClaimDailyStreak && canClaimNow ? (
            <button
              type="button"
              onClick={() => {
                onClaimDailyStreak();
              }}
              className="btn-primary"
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Flame size={16} fill="#FFFFFF" />
              <span>Claim {currentSlot === 'morning' ? 'Morning' : 'Evening'} Check-In (+25 XP)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{claimsToday >= 2 ? 'Both Sessions Claimed Today!' : 'Close & Continue Learning'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
