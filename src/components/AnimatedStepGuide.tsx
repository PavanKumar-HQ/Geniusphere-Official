import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Target,
  ListOrdered,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export interface AnimatedStepGuideProps {
  learningObjective: string;
  instructions: string[];
  activeStepIndex?: number;
  onStepChange?: (index: number) => void;
  completedStepIndices?: number[];
  onToggleCompleteStep?: (index: number) => void;
  className?: string;
}

export const AnimatedStepGuide: React.FC<AnimatedStepGuideProps> = ({
  learningObjective,
  instructions,
  activeStepIndex: controlledStepIndex,
  onStepChange,
  completedStepIndices: controlledCompletedSteps,
  onToggleCompleteStep,
  className = '',
}) => {
  // Internal state if uncontrolled
  const [internalStepIndex, setInternalStepIndex] = useState<number>(0);
  const [internalCompletedSteps, setInternalCompletedSteps] = useState<Set<number>>(new Set());
  const [displayMode, setDisplayMode] = useState<'guided' | 'all'>('guided');

  const currentIndex = controlledStepIndex !== undefined ? controlledStepIndex : internalStepIndex;
  const completedSet =
    controlledCompletedSteps !== undefined
      ? new Set(controlledCompletedSteps)
      : internalCompletedSteps;

  const totalSteps = instructions.length;
  const currentStepText = instructions[currentIndex] || '';
  const isCurrentCompleted = completedSet.has(currentIndex);

  const handleStepSelect = (idx: number) => {
    if (idx < 0 || idx >= totalSteps) return;
    if (onStepChange) {
      onStepChange(idx);
    } else {
      setInternalStepIndex(idx);
    }
  };

  const handleToggleComplete = (idx: number) => {
    if (onToggleCompleteStep) {
      onToggleCompleteStep(idx);
    } else {
      setInternalCompletedSteps((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          next.add(idx);
        }
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      // Auto-mark current step as completed if not yet marked
      if (!completedSet.has(currentIndex)) {
        if (onToggleCompleteStep) {
          onToggleCompleteStep(currentIndex);
        } else {
          setInternalCompletedSteps((prev) => new Set([...prev, currentIndex]));
        }
      }
      handleStepSelect(currentIndex + 1);
    } else if (currentIndex === totalSteps - 1 && !completedSet.has(currentIndex)) {
      // Mark final step completed
      if (onToggleCompleteStep) {
        onToggleCompleteStep(currentIndex);
      } else {
        setInternalCompletedSteps((prev) => new Set([...prev, currentIndex]));
      }
    }
  };

  const progressPercent = totalSteps > 0 ? ((completedSet.size) / totalSteps) * 100 : 0;

  return (
    <div
      className={`animated-step-guide ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      {/* 1. LEARNING OBJECTIVE (Spacious, modern card) */}
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(0, 245, 160, 0.05)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--brand-primary, #00F5A0)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Target size={13} strokeWidth={2.5} />
          <span>LEARNING OBJECTIVE</span>
        </div>
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary, #94A3B8)',
            lineHeight: 1.55,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {learningObjective}
        </p>
      </div>

      {/* 2. STEPPER HEADER & MODE SWITCHER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '4px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-primary, #F8FAFC)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ListOrdered size={14} color="var(--brand-primary, #00F5A0)" />
            <span>INTERACTIVE STEPS</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
            {completedSet.size} of {totalSteps} completed
          </div>
        </div>

        {/* Mode Toggle Button */}
        <div
          style={{
            display: 'inline-flex',
            padding: '2px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-canvas, #070B19)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
          }}
        >
          <button
            type="button"
            onClick={() => setDisplayMode('guided')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: displayMode === 'guided' ? 'rgba(0, 245, 160, 0.18)' : 'transparent',
              color: displayMode === 'guided' ? 'var(--brand-primary, #00F5A0)' : 'var(--text-muted, #64748B)',
              transition: 'all 0.2s ease',
            }}
          >
            Guided
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: displayMode === 'all' ? 'rgba(0, 245, 160, 0.18)' : 'transparent',
              color: displayMode === 'all' ? 'var(--brand-primary, #00F5A0)' : 'var(--text-muted, #64748B)',
              transition: 'all 0.2s ease',
            }}
          >
            All Steps
          </button>
        </div>
      </div>

      {/* 3. ANIMATED STEP PROGRESS BAR */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00F5A0, #00D9F5)',
            boxShadow: '0 0 10px rgba(0, 245, 160, 0.5)',
          }}
        />
      </div>

      {/* 4. STEP PILL TABS */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {instructions.map((_, idx) => {
          const isActive = idx === currentIndex;
          const isDone = completedSet.has(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleStepSelect(idx)}
              style={{
                flex: '1 1 0',
                minWidth: '36px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                border: isActive
                  ? '1.5px solid var(--brand-primary, #00F5A0)'
                  : isDone
                  ? '1px solid rgba(0, 245, 160, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive
                  ? 'rgba(0, 245, 160, 0.16)'
                  : isDone
                  ? 'rgba(0, 245, 160, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                color: isActive
                  ? 'var(--brand-primary, #00F5A0)'
                  : isDone
                  ? '#00F5A0'
                  : 'var(--text-muted, #94A3B8)',
                boxShadow: isActive ? '0 0 12px rgba(0, 245, 160, 0.2)' : 'none',
              }}
              title={`Step ${idx + 1}`}
            >
              {isDone ? <Check size={14} strokeWidth={2.5} /> : idx + 1}
            </button>
          );
        })}
      </div>

      {/* 5. GUIDED MODE: ANIMATED ACTIVE STEP CARD */}
      {displayMode === 'guided' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              padding: '18px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-surface-subdued, rgba(15, 23, 42, 0.65))',
              border: isCurrentCompleted
                ? '1px solid rgba(0, 245, 160, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isCurrentCompleted
                ? '0 4px 20px rgba(0, 245, 160, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Step Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(0, 245, 160, 0.12)',
                  color: 'var(--brand-primary, #00F5A0)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                <span>STEP {currentIndex + 1} OF {totalSteps}</span>
              </div>

              {isCurrentCompleted ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--brand-primary, #00F5A0)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Completed</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-muted, #94A3B8)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-primary, #00F5A0)',
                      display: 'inline-block',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span>In Progress</span>
                </div>
              )}
            </div>

            {/* Step Body (Spacious & Clean typography) */}
            <div
              style={{
                fontSize: '0.94rem',
                color: 'var(--text-primary, #F8FAFC)',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {currentStepText}
            </div>

              {/* Streamlined Step Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => handleStepSelect(currentIndex - 1)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === 0 ? 0.35 : 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-secondary, #94A3B8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isCurrentCompleted && currentIndex === totalSteps - 1
                      ? 'rgba(0, 245, 160, 0.18)'
                      : 'var(--brand-primary, #00F5A0)',
                    border: isCurrentCompleted && currentIndex === totalSteps - 1
                      ? '1px solid rgba(0, 245, 160, 0.4)'
                      : 'none',
                    color: isCurrentCompleted && currentIndex === totalSteps - 1
                      ? 'var(--brand-primary, #00F5A0)'
                      : '#070B19',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>
                    {currentIndex < totalSteps - 1
                      ? `Next: Step ${currentIndex + 2}`
                      : isCurrentCompleted
                      ? 'All Steps Complete ✓'
                      : 'Complete Final Step ✓'}
                  </span>
                  {currentIndex < totalSteps - 1 && <ChevronRight size={14} />}
                </button>
              </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* 6. ALL STEPS ROADMAP MODE */}
      {displayMode === 'all' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {instructions.map((step, idx) => {
            const isDone = completedSet.has(idx);
            const isCurrent = idx === currentIndex;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                onClick={() => handleStepSelect(idx)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: isCurrent
                    ? 'rgba(0, 245, 160, 0.08)'
                    : 'var(--bg-surface-subdued, rgba(15, 23, 42, 0.4))',
                  border: isCurrent
                    ? '1.5px solid var(--brand-primary, #00F5A0)'
                    : isDone
                    ? '1px solid rgba(0, 245, 160, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleComplete(idx);
                  }}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isDone
                      ? 'none'
                      : isCurrent
                      ? '2px solid var(--brand-primary, #00F5A0)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: isDone ? 'var(--brand-primary, #00F5A0)' : 'transparent',
                    color: isDone ? '#070B19' : 'var(--brand-primary, #00F5A0)',
                    cursor: 'pointer',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </button>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isCurrent
                        ? 'var(--brand-primary, #00F5A0)'
                        : isDone
                        ? '#00F5A0'
                        : 'var(--text-muted, #94A3B8)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    STEP {idx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: isDone ? 'var(--text-muted, #94A3B8)' : 'var(--text-primary, #F8FAFC)',
                      lineHeight: 1.5,
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {step}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* 7. FOOTER BADGE */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
          fontSize: '0.74rem',
          color: 'var(--text-muted, #64748B)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ShieldCheck size={15} color="var(--brand-primary, #00F5A0)" />
        <span>Step-by-Step Guided Simulator</span>
      </div>
    </div>
  );
};
