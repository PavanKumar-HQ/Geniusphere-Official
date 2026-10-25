import React, { useState } from 'react';

export type MascotExpression =
  | 'happy'
  | 'thinking'
  | 'idea'
  | 'celebrating'
  | 'encouraging'
  | 'guidance'
  | 'loading'
  | 'coding'
  | 'teaching'
  | 'celebrating_certificate'
  | 'studying'
  | 'learning'
  | 'shield'
  | 'security';

interface MascotSphereProps {
  pose?: MascotExpression;
  expression?: MascotExpression;
  size?: number;
  className?: string;
  speechBubble?: string;
  caption?: string;
  ariaLabel?: string;
  animated?: boolean;
  interactive?: boolean;
}

interface PoseAsset {
  webp: string;
  png: string;
  alt: string;
  speechFallback: string;
}

const POSE_ASSETS: Record<MascotExpression, PoseAsset> = {
  happy: {
    webp: '/images/mascot/mascot_happy.webp',
    png: '/images/mascot/mascot_happy.png',
    alt: 'Geniusphere Mascot Sphere smiling and waving',
    speechFallback: 'Hello! Ready to level up your skills today?',
  },
  encouraging: {
    webp: '/images/mascot/mascot_happy.webp',
    png: '/images/mascot/mascot_happy.png',
    alt: 'Geniusphere Mascot Sphere giving encouragement',
    speechFallback: 'Small steps every day lead to giant leaps!',
  },
  coding: {
    webp: '/images/mascot/mascot_laptop.webp',
    png: '/images/mascot/mascot_laptop.png',
    alt: 'Geniusphere Mascot Sphere coding on a glowing laptop',
    speechFallback: 'Writing code and running test assertions!',
  },
  loading: {
    webp: '/images/mascot/mascot_laptop.webp',
    png: '/images/mascot/mascot_laptop.png',
    alt: 'Geniusphere Mascot Sphere working diligently',
    speechFallback: 'Crunching data in the cloud sandbox...',
  },
  celebrating: {
    webp: '/images/mascot/mascot_celebrating.webp',
    png: '/images/mascot/mascot_celebrating.png',
    alt: 'Geniusphere Mascot Sphere cheering in celebration with confetti',
    speechFallback: 'Incredible work! Milestone unlocked!',
  },
  celebrating_certificate: {
    webp: '/images/mascot/mascot_celebrating.webp',
    png: '/images/mascot/mascot_celebrating.png',
    alt: 'Geniusphere Mascot Sphere celebrating certificate earned',
    speechFallback: 'Verified credential earned! So proud of you!',
  },
  teaching: {
    webp: '/images/mascot/mascot_teaching.webp',
    png: '/images/mascot/mascot_teaching.png',
    alt: 'Geniusphere Mascot Sphere educator with glasses and pointer stick',
    speechFallback: 'Welcome to class! Let us explore the core concepts.',
  },
  guidance: {
    webp: '/images/mascot/mascot_teaching.webp',
    png: '/images/mascot/mascot_teaching.png',
    alt: 'Geniusphere Mascot Sphere guiding the student step by step',
    speechFallback: 'Here is a helpful tip to guide your solution!',
  },
  studying: {
    webp: '/images/mascot/mascot_studying.png',
    png: '/images/mascot/mascot_studying.png',
    alt: 'Geniusphere Mascot Sphere studying with cap and glowing digital textbook',
    speechFallback: 'Every module you master unlocks genuine real-world capability.',
  },
  learning: {
    webp: '/images/mascot/mascot_studying.png',
    png: '/images/mascot/mascot_studying.png',
    alt: 'Geniusphere Mascot Sphere reading coursework',
    speechFallback: 'Deep focus mode active. Keep building your knowledge!',
  },
  shield: {
    webp: '/images/mascot/mascot_shield.png',
    png: '/images/mascot/mascot_shield.png',
    alt: 'Geniusphere Mascot Sphere holding glowing cybersecurity defense shield',
    speechFallback: 'Defense matrix active. Zero-trust architecture verified!',
  },
  security: {
    webp: '/images/mascot/mascot_shield.png',
    png: '/images/mascot/mascot_shield.png',
    alt: 'Geniusphere Mascot Sphere security sentinel',
    speechFallback: 'All cryptographic and verification protocols intact.',
  },
  idea: {
    webp: '/images/mascot/mascot_idea.png',
    png: '/images/mascot/mascot_idea.png',
    alt: 'Geniusphere Mascot Sphere thinking with glowing lightbulb idea above head',
    speechFallback: 'Aha! Here is a brilliant algorithmic insight.',
  },
  thinking: {
    webp: '/images/mascot/mascot_idea.png',
    png: '/images/mascot/mascot_idea.png',
    alt: 'Geniusphere Mascot Sphere pondering thoughtfully',
    speechFallback: 'Analyzing the problem parameters carefully...',
  },
};

const FUN_QUOTES = [
  'Curiosity is your superpower!',
  'Practice makes progress, not perfection!',
  'Every expert was once a beginner!',
  'Coding is like magic, but real!',
  'You have got this! Keep going!',
];

export const MascotSphere: React.FC<MascotSphereProps> = ({
  pose,
  expression = pose || 'happy',
  size = 80,
  className = '',
  speechBubble,
  caption,
  ariaLabel,
  animated = true,
  interactive = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const asset = POSE_ASSETS[expression] || POSE_ASSETS.happy;
  const label = ariaLabel || `Geniusphere Mascot Sphere (${expression})`;

  // Display speech bubble if explicitly provided or dynamically on interaction
  const activeSpeech =
    speechBubble ||
    (clickCount > 0 ? FUN_QUOTES[(clickCount - 1) % FUN_QUOTES.length] : null);

  const handleClick = () => {
    if (!interactive) return;
    setIsBouncing(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const shadowWidth = Math.round(size * 0.65);
  const shadowHeight = Math.max(6, Math.round(size * 0.1));

  return (
    <div
      className={`mascot-sphere-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        cursor: interactive ? 'pointer' : 'default',
        transform: isBouncing ? 'scale(1.12) translateY(-6px)' : 'scale(1)',
        transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      role="img"
      aria-label={label}
      onClick={handleClick}
      title={interactive ? 'Click to say hello to Sphere!' : label}
    >
      {/* Speech Bubble */}
      {activeSpeech && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #D2DEC9',
            borderRadius: '14px',
            padding: '7px 14px',
            fontSize: size < 60 ? '0.72rem' : '0.8rem',
            fontWeight: 700,
            color: '#26352A',
            boxShadow: '0 4px 16px rgba(38, 53, 42, 0.12)',
            marginBottom: '6px',
            position: 'relative',
            maxWidth: `${Math.max(160, Math.round(size * 1.6))}px`,
            textAlign: 'center',
            lineHeight: 1.35,
            zIndex: 3,
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          {activeSpeech}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              backgroundColor: '#FFFFFF',
              borderRight: '1.5px solid #D2DEC9',
              borderBottom: '1.5px solid #D2DEC9',
            }}
          />
        </div>
      )}

      {/* 3D Render Image Container */}
      {!imageError ? (
        <div
          className={animated ? 'mascot-animated-float' : ''}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <picture>
            <source srcSet={asset.webp} type="image/webp" />
            <img
              src={asset.png}
              alt={asset.alt}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 6px 14px rgba(38, 53, 42, 0.14))',
                transition: 'filter 0.2s ease',
              }}
              draggable={false}
            />
          </picture>
        </div>
      ) : (
        /* Graceful SVG Fallback in offline / test environments */
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="sphereGradFallback" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#5CD078" />
              <stop offset="60%" stopColor="#43A85B" />
              <stop offset="100%" stopColor="#2E7E43" />
            </radialGradient>
          </defs>

          <ellipse
            cx="50"
            cy="89"
            rx="26"
            ry="5"
            fill="rgba(38, 53, 42, 0.12)"
            className={animated ? 'mascot-animated-shadow' : ''}
          />
          <ellipse cx="40" cy="85" rx="7" ry="4" fill="#246435" />
          <ellipse cx="60" cy="85" rx="7" ry="4" fill="#246435" />

          <g className={animated ? 'mascot-animated-float' : ''}>
            <circle cx="50" cy="54" r="32" fill="url(#sphereGradFallback)" />
            <ellipse
              cx="50"
              cy="55"
              rx="38"
              ry="10"
              fill="none"
              stroke="#D9F477"
              strokeWidth="2.5"
            />
            <ellipse cx="42" cy="50" rx="4" ry="5.5" fill="#26352A" />
            <circle cx="43.5" cy="48" r="1.5" fill="#FFFFFF" />
            <ellipse cx="58" cy="50" rx="4" ry="5.5" fill="#26352A" />
            <circle cx="59.5" cy="48" r="1.5" fill="#FFFFFF" />
            <path
              d="M 44 60 Q 50 67 56 60"
              stroke="#26352A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Mortarboard Cap */}
            <polygon
              points="50,15 76,23 50,31 24,23"
              fill="#26352A"
              stroke="#1A241C"
              strokeWidth="1"
            />
            <circle cx="50" cy="23" r="2" fill="#D9F477" />
            <path
              d="M 50 23 Q 66 22 72 34"
              stroke="#D9F477"
              strokeWidth="1.8"
              fill="none"
            />
            <polygon points="70,34 74,34 73,39 71,39" fill="#D9F477" />
          </g>
        </svg>
      )}

      {/* Dynamic Ground Shadow that breathes with float animation */}
      {size >= 32 && !imageError && (
        <div
          className={animated ? 'mascot-animated-shadow' : ''}
          style={{
            width: `${shadowWidth}px`,
            height: `${shadowHeight}px`,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(38, 53, 42, 0.22) 0%, rgba(38, 53, 42, 0) 70%)',
            marginTop: `-${Math.round(size * 0.08)}px`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Optional Caption */}
      {caption && (
        <span
          style={{
            fontSize: '0.72rem',
            color: '#6B7C72',
            fontWeight: 600,
            marginTop: '4px',
            textAlign: 'center',
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
};
