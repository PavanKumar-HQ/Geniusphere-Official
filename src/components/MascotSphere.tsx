import React from 'react';

export type MascotExpression =
  | 'happy'
  | 'thinking'
  | 'celebrating'
  | 'encouraging'
  | 'guidance'
  | 'loading';

interface MascotSphereProps {
  pose?: MascotExpression;
  expression?: MascotExpression;
  size?: number;
  className?: string;
  speechBubble?: string;
  caption?: string;
  ariaLabel?: string;
}

export const MascotSphere: React.FC<MascotSphereProps> = ({
  pose,
  expression = pose || 'happy',
  size = 80,
  className = '',
  speechBubble,
  caption,
  ariaLabel,
}) => {
  const label = ariaLabel || `Geniusphere Mascot Sphere (${expression})`;

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
      }}
      role="img"
      aria-label={label}
    >
      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5F0DF',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#26352A',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '6px',
            position: 'relative',
            maxWidth: '180px',
            textAlign: 'center',
            lineHeight: 1.35,
          }}
        >
          {speechBubble}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              backgroundColor: '#FFFFFF',
              borderRight: '1.5px solid #E5F0DF',
              borderBottom: '1.5px solid #E5F0DF',
            }}
          />
        </div>
      )}

      {/* SVG Canvas for Sphere Character */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Subtle orbital path */}
          <ellipse id="orbitalRing" cx="50" cy="55" rx="42" ry="14" />
        </defs>

        {/* Back orbital ring for depth */}
        <path
          d="M 10 55 A 40 12 0 0 1 90 55"
          fill="none"
          stroke="#D9F477"
          strokeWidth="2.5"
          strokeDasharray={expression === 'loading' ? '4 3' : 'none'}
        />

        {/* Feet / Shadow Base */}
        <ellipse cx="50" cy="88" rx="26" ry="5" fill="rgba(38, 53, 42, 0.08)" />
        <ellipse cx="40" cy="84" rx="7" ry="4" fill="#2E7D4F" />
        <ellipse cx="60" cy="84" rx="7" ry="4" fill="#2E7D4F" />

        {/* Main Spherical Body */}
        <circle cx="50" cy="54" r="32" fill="#43A85B" />
        {/* Soft highlight belly / cheek blush */}
        <circle cx="50" cy="58" r="24" fill="#4EBD68" />
        <circle cx="34" cy="62" r="4" fill="#D9F477" opacity="0.6" />
        <circle cx="66" cy="62" r="4" fill="#D9F477" opacity="0.6" />

        {/* Front orbital ring segment */}
        <path
          d="M 90 55 A 40 12 0 0 1 10 55"
          fill="none"
          stroke="#D9F477"
          strokeWidth="2.5"
        />

        {/* Hands / Poses */}
        {expression === 'happy' && (
          <g>
            {/* Left Hand Waving */}
            <circle cx="16" cy="45" r="5" fill="#43A85B" />
            <path d="M 22 52 Q 16 46 16 45" stroke="#388E4C" strokeWidth="2.5" fill="none" />
            {/* Right Hand at side */}
            <circle cx="82" cy="58" r="5" fill="#43A85B" />
          </g>
        )}

        {expression === 'thinking' && (
          <g>
            {/* Hand to chin */}
            <circle cx="48" cy="66" r="5" fill="#43A85B" />
            <path d="M 30 62 Q 40 68 48 66" stroke="#388E4C" strokeWidth="2.5" fill="none" />
            {/* Thinking dot accents */}
            <circle cx="78" cy="30" r="2.5" fill="#D9F477" />
            <circle cx="85" cy="22" r="3.5" fill="#43A85B" />
          </g>
        )}

        {expression === 'celebrating' && (
          <g>
            {/* Both Hands in Air */}
            <circle cx="18" cy="32" r="5" fill="#43A85B" />
            <circle cx="82" cy="32" r="5" fill="#43A85B" />
            <path d="M 24 50 Q 18 38 18 32" stroke="#388E4C" strokeWidth="2.5" fill="none" />
            <path d="M 76 50 Q 82 38 82 32" stroke="#388E4C" strokeWidth="2.5" fill="none" />
            {/* Star celebration sparkles */}
            <polygon points="12,20 14,24 18,24 15,27 16,31 12,28 8,31 9,27 6,24 10,24" fill="#D9F477" />
            <polygon points="88,20 90,24 94,24 91,27 92,31 88,28 84,31 85,27 82,24 86,24" fill="#D9F477" />
          </g>
        )}

        {expression === 'encouraging' && (
          <g>
            {/* Thumbs up / friendly open gesture */}
            <circle cx="20" cy="52" r="5" fill="#43A85B" />
            <circle cx="80" cy="50" r="5" fill="#43A85B" />
            <path d="M 78 48 L 78 42 Q 80 40 82 42 L 82 48" stroke="#388E4C" strokeWidth="2" fill="#D9F477" />
          </g>
        )}

        {expression === 'guidance' && (
          <g>
            {/* Pointing gesture to the right */}
            <circle cx="18" cy="55" r="5" fill="#43A85B" />
            <circle cx="86" cy="52" r="5" fill="#43A85B" />
            <path d="M 86 52 L 95 50" stroke="#388E4C" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {expression === 'loading' && (
          <g>
            <circle cx="18" cy="56" r="4.5" fill="#43A85B" />
            <circle cx="82" cy="56" r="4.5" fill="#43A85B" />
          </g>
        )}

        {/* Facial Features */}
        {/* Eyes */}
        {expression === 'celebrating' ? (
          <g>
            {/* Happy squint eyes */}
            <path d="M 38 52 Q 44 46 50 52" stroke="#26352A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 50 52 Q 56 46 62 52" stroke="#26352A" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            {/* Left Eye */}
            <ellipse cx="42" cy="50" rx="4.5" ry="5.5" fill="#26352A" />
            <circle cx="43.5" cy="48" r="1.8" fill="#FFFFFF" />
            {/* Right Eye */}
            <ellipse cx="58" cy="50" rx="4.5" ry="5.5" fill="#26352A" />
            <circle cx="59.5" cy="48" r="1.8" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth */}
        {expression === 'happy' && (
          <path d="M 44 60 Q 50 67 56 60" stroke="#26352A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {expression === 'thinking' && (
          <ellipse cx="52" cy="61" rx="2.5" ry="2" fill="#26352A" />
        )}
        {expression === 'celebrating' && (
          <path d="M 43 59 Q 50 70 57 59 Z" fill="#26352A" />
        )}
        {expression === 'encouraging' && (
          <path d="M 44 60 Q 50 66 56 60" stroke="#26352A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {expression === 'guidance' && (
          <path d="M 45 60 Q 50 65 55 60" stroke="#26352A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        )}
        {expression === 'loading' && (
          <circle cx="50" cy="62" r="2.5" fill="#26352A" />
        )}

        {/* Academic Mortarboard / Graduation Cap */}
        <g>
          {/* Cap Skull cap base */}
          <ellipse cx="50" cy="30" rx="14" ry="5" fill="#1C271F" />
          {/* Diamond Cap Top */}
          <polygon points="50,15 76,23 50,31 24,23" fill="#26352A" stroke="#1A241C" strokeWidth="1" />
          {/* Center Button */}
          <circle cx="50" cy="23" r="2" fill="#D9F477" />
          {/* Tassel */}
          <path d="M 50 23 Q 66 22 72 34" stroke="#D9F477" strokeWidth="1.8" fill="none" />
          <polygon points="70,34 74,34 73,39 71,39" fill="#D9F477" />
        </g>
      </svg>

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
