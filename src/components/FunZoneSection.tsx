import React, { useState, useEffect, useRef } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  Trophy,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Clock,
  BookOpen,
  Terminal,
  Zap,
  Lightbulb,
  Check,
} from 'lucide-react';

export interface FunZoneSectionProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const FunZoneSection: React.FC<FunZoneSectionProps> = ({
  db,
  currentUserId,
  onNavigate,
}) => {
  // Auto-scroll track reference and state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Card 1: Daily Quest state
  const [questCompleted, setQuestCompleted] = useState<boolean>(false);

  // Card 2: Trivia Fact index
  const [factIndex, setFactIndex] = useState<number>(0);
  const triviaFacts = [
    {
      year: '1947',
      tag: 'Computer History',
      title: 'The First Actual Computer Bug',
      body: "Grace Hopper's team at Harvard logged the first literal computer bug: an actual moth trapped inside a relay of the Mark II Aiken Relay Calculator.",
    },
    {
      year: '2024',
      tag: 'Data Scale',
      title: 'Global Data Explosion',
      body: "Over 90% of the world's total stored digital information was created in just the last 24 months alone, accelerating distributed database scaling.",
    },
    {
      year: '1637',
      tag: 'Financial History',
      title: 'Dutch Tulip Mania',
      body: 'History’s first documented speculative asset bubble occurred in the Netherlands, where rare tulip bulbs traded for the price of entire canal estates.',
    },
    {
      year: '1969',
      tag: 'Space Computing',
      title: 'Apollo Guidance Computer',
      body: 'The Apollo 11 moon landing computer operated with just 4KB of RAM and 72KB of ROM, yet executed real-time priority task scheduling without crash.',
    },
  ];

  // Card 3: Interactive Brain Teaser
  const [teaserIndex, setTeaserIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [teaserFeedback, setTeaserFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const teasers = [
    {
      question: "What does 'HTTP' stand for in web architecture?",
      options: [
        'HyperText Transfer Protocol',
        'High Transfer Text Protocol',
        'HyperText Transmission Process',
      ],
      correctIndex: 0,
      explanation: 'HyperText Transfer Protocol governs client-server request/response communication across the World Wide Web.',
    },
    {
      question: 'In cryptographic blockchains, what is a "Nonce"?',
      options: [
        'A permanent secret signing key',
        'A number used once to satisfy proof-of-work difficulty',
        'A transaction fee multiplier',
      ],
      correctIndex: 1,
      explanation: 'Nonce (number used once) is the parameter miners iterate through to discover a block hash below the target threshold.',
    },
    {
      question: 'What does the "Sharpe Ratio" measure in financial markets?',
      options: [
        'Gross revenue before operational tax deduction',
        'Risk-adjusted return per unit of volatility',
        'Maximum debt-to-equity leverage ratio',
      ],
      correctIndex: 1,
      explanation: 'The Sharpe ratio evaluates how much excess return an investment achieves relative to the volatility risk endured.',
    },
  ];

  // Card 4: Word of the Day
  const [wordIndex, setWordIndex] = useState<number>(0);
  const wordList = [
    {
      term: 'Arbitrage',
      domain: 'Finance',
      definition: 'Simultaneously purchasing an asset in one market and selling in another to profit from temporary price discrepancies.',
    },
    {
      term: 'Parameterization',
      domain: 'Coding & Logic',
      definition: 'Abstracting hardcoded literals into variable inputs, allowing procedures and SQL queries to run safely and reusable.',
    },
    {
      term: 'Consensus',
      domain: 'Technology',
      definition: 'A fault-tolerant mechanism whereby distributed peers reach objective agreement on system state without central authorities.',
    },
    {
      term: 'Cold Storage',
      domain: 'Cybersecurity',
      definition: 'Storing cryptographic private keys and critical records on physical media strictly air-gapped from network connectivity.',
    },
  ];

  // Card 5: Code Detective Puzzle
  const [codePuzzleOption, setCodePuzzleOption] = useState<number | null>(null);

  // Smooth Automatic Scrolling Mechanism
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    const step = () => {
      if (isAutoScrolling && !isHovered && container) {
        // Increment gently
        container.scrollLeft += 0.8;

        // Wrap around seamlessly
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 4) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrolling, isHovered]);

  // Manual scroll controls
  const handleScrollManual = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Complete Daily Quest
  const handleCompleteQuest = () => {
    if (questCompleted) return;
    setQuestCompleted(true);
    const progress = db.getUserProgress(currentUserId);
    progress.xp += 25;
    db.logAuditEvent({
      organization_id: null,
      actor_id: currentUserId,
      action_type: 'gamification.daily_quest_completed',
      resource_type: 'quest',
      resource_id: 'micro-learner-finance',
      ip_address: null,
      user_agent: null,
      details: { xp_awarded: 25, quest: 'Micro-Learner' },
    });
  };

  // Answer Brain Teaser
  const handleSelectTeaserOption = (idx: number) => {
    setSelectedOption(idx);
    const currentTeaser = teasers[teaserIndex];
    const isCorrect = idx === currentTeaser.correctIndex;
    setTeaserFeedback({
      isCorrect,
      message: isCorrect
        ? `Correct! ${currentTeaser.explanation}`
        : `Incorrect. Hint: ${currentTeaser.explanation}`,
    });

    if (isCorrect) {
      const progress = db.getUserProgress(currentUserId);
      progress.xp += 10;
    }
  };

  const handleNextTeaser = () => {
    setSelectedOption(null);
    setTeaserFeedback(null);
    setTeaserIndex((prev) => (prev + 1) % teasers.length);
  };

  const currentFact = triviaFacts[factIndex];
  const currentTeaser = teasers[teaserIndex];
  const currentWord = wordList[wordIndex];

  return (
    <section
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '56px 24px',
        overflow: 'hidden',
      }}
      aria-label="Interactive Knowledge Fun Zone"
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-surface)',
                color: 'var(--brand-primary)',
                fontSize: 'var(--text-meta)',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <Sparkles size={14} />
              <span>INTERACTIVE FUN ZONE</span>
            </div>
            <h2
              style={{
                fontSize: 'var(--text-section-title)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Level Up Your Knowledge
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-body)',
                margin: 0,
                maxWidth: '620px',
              }}
            >
              Bite-sized daily challenges, historical tech trivia, and real domain concepts to sharpen your skills.
            </p>
          </div>

          {/* Interactive Auto-Scroll Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsAutoScrolling((prev) => !prev)}
              className="btn-outline"
              style={{ height: '34px', padding: '0 10px', fontSize: '0.78rem' }}
              title={isAutoScrolling ? 'Pause automatic scrolling' : 'Resume automatic scrolling'}
            >
              {isAutoScrolling ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoScrolling ? 'Auto-Scroll ON' : 'Paused'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleScrollManual('left')}
              className="btn-secondary"
              style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleScrollManual('right')}
              className="btn-secondary"
              style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontally Scrolling Cards Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={0}
          role="region"
          aria-label="Interactive learning cards carousel"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '16px',
            paddingTop: '4px',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* ======================================================== */}
          {/* CARD 1: DAILY QUEST                                     */}
          {/* ======================================================== */}
          <div
            className="funzone-card"
            style={{
              minWidth: '300px',
              maxWidth: '300px',
              flex: '0 0 auto',
              borderTop: '3px solid var(--brand-primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                  DAILY QUEST
                </span>
                <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} />
                  <span>Resets in 12h</span>
                </span>
              </div>
              <Trophy size={18} color="var(--brand-primary)" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                Micro-Learner
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Watch 1 video lesson or test an interactive concept simulation today.
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: 'var(--text-meta)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>REWARD</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>+25 XP</span>
              </div>

              {!questCompleted ? (
                <button
                  type="button"
                  onClick={handleCompleteQuest}
                  className="btn-primary"
                  style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
                >
                  <Zap size={14} />
                  <span>Complete Challenge</span>
                </button>
              ) : (
                <div
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    color: 'var(--success)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} />
                  <span>Completed (+25 XP Added!)</span>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2: TECH & FINANCE TRIVIA                           */}
          {/* ======================================================== */}
          <div
            className="funzone-card"
            style={{
              minWidth: '320px',
              maxWidth: '320px',
              flex: '0 0 auto',
              borderTop: '3px solid var(--brand-accent)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                TRIVIA • {currentFact.tag.toUpperCase()}
              </span>
              <Lightbulb size={18} color="var(--brand-accent)" />
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-meta)', color: 'var(--brand-accent)', fontWeight: 700, marginBottom: '4px' }}>
                {currentFact.year} MILESTONE
              </div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                {currentFact.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                {currentFact.body}
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)' }}>
                Fact {factIndex + 1} of {triviaFacts.length}
              </span>
              <button
                type="button"
                onClick={() => setFactIndex((prev) => (prev + 1) % triviaFacts.length)}
                className="btn-outline"
                style={{ height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
              >
                <span>Next Trivia</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 3: INTERACTIVE BRAIN TEASER                         */}
          {/* ======================================================== */}
          <div
            className="funzone-card"
            style={{
              minWidth: '340px',
              maxWidth: '340px',
              flex: '0 0 auto',
              borderTop: '3px solid var(--warning)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                BRAIN TEASER ({teaserIndex + 1}/{teasers.length})
              </span>
              <Brain size={18} color="var(--warning)" />
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                {currentTeaser.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentTeaser.options.map((option, optIdx) => {
                  let optStyle: React.CSSProperties = {
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-canvas)',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    transition: 'all 0.15s ease',
                  };

                  if (selectedOption !== null) {
                    if (optIdx === currentTeaser.correctIndex) {
                      optStyle.backgroundColor = 'var(--success-bg)';
                      optStyle.borderColor = 'var(--success-border)';
                      optStyle.color = 'var(--success)';
                      optStyle.fontWeight = 700;
                    } else if (selectedOption === optIdx) {
                      optStyle.backgroundColor = 'var(--danger-bg)';
                      optStyle.borderColor = 'var(--danger-border)';
                      optStyle.color = 'var(--danger)';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectTeaserOption(optIdx)}
                      style={optStyle}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {teaserFeedback && (
              <div
                style={{
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: teaserFeedback.isCorrect ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: teaserFeedback.isCorrect ? 'var(--success)' : 'var(--warning)',
                  fontWeight: 600,
                }}
              >
                {teaserFeedback.message}
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleNextTeaser}
                className="btn-outline"
                style={{ height: '30px', padding: '0 10px', fontSize: '0.76rem' }}
              >
                <span>Next Teaser</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 4: WORD OF THE DAY                                  */}
          {/* ======================================================== */}
          <div
            className="funzone-card"
            style={{
              minWidth: '300px',
              maxWidth: '300px',
              flex: '0 0 auto',
              borderTop: '3px solid #6366F1',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                WORD OF THE DAY
              </span>
              <BookOpen size={18} color="#6366F1" />
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>
                DOMAIN: {currentWord.domain.toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                {currentWord.term}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                {currentWord.definition}
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)' }}>
                Term {wordIndex + 1} of {wordList.length}
              </span>
              <button
                type="button"
                onClick={() => setWordIndex((prev) => (prev + 1) % wordList.length)}
                className="btn-outline"
                style={{ height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
              >
                <span>Next Term</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 5: CODE DETECTIVE PUZZLE                            */}
          {/* ======================================================== */}
          <div
            className="funzone-card"
            style={{
              minWidth: '320px',
              maxWidth: '320px',
              flex: '0 0 auto',
              borderTop: '3px solid #8B5CF6',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                CODE DETECTIVE
              </span>
              <Terminal size={18} color="#8B5CF6" />
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-meta)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Predict runtime output array:
              </div>
              <div style={{ backgroundColor: 'var(--editor-bg)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: '10px' }}>
                [1, 2, 3].map(x =&gt; x * 2).filter(x =&gt; x &gt; 2)
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {['[2, 4, 6]', '[4, 6]', '[1, 2, 3]'].map((val, idx) => {
                  const isCorrect = idx === 1;
                  const isChosen = codePuzzleOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCodePuzzleOption(idx)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: isChosen
                          ? isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)'
                          : 'var(--bg-canvas)',
                        color: isChosen
                          ? isCorrect ? 'var(--success)' : 'var(--danger)'
                          : 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {codePuzzleOption !== null && (
                <div style={{ fontSize: '0.75rem', marginTop: '8px', color: codePuzzleOption === 1 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {codePuzzleOption === 1 ? '✓ Correct! Double gives [2, 4, 6], filter (>2) keeps [4, 6].' : '✗ Try again! First double elements, then keep only elements > 2.'}
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => onNavigate('labs')}
                className="btn-outline"
                style={{ height: '30px', padding: '0 10px', fontSize: '0.76rem' }}
              >
                <span>More Code Labs</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
