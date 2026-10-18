import React from 'react';

export type MascotExpression =
  | 'happy'
  | 'thinking'
  | 'celebrating'
  | 'encouraging'
  | 'guidance'
  | 'loading'
  | 'coding'
  | 'teaching'
  | 'celebrating_certificate';

interface MascotSphereProps {
  pose?: MascotExpression;
  expression?: MascotExpression;
  size?: number;
  className?: string;
  speechBubble?: string;
  caption?: string;
  ariaLabel?: string;
  animated?: boolean;
}

export const MascotSphere: React.FC<MascotSphereProps> = ({
  pose,
  expression = pose || 'happy',
  size = 80,
  className = '',
  speechBubble,
  caption,
  ariaLabel,
  animated = true,
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
            boxShadow: '0 4px 12px rgba(38, 53, 42, 0.08)',
            marginBottom: '6px',
            position: 'relative',
            maxWidth: '190px',
            textAlign: 'center',
            lineHeight: 1.35,
            zIndex: 2,
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
          <radialGradient id="sphereGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5CD078" />
            <stop offset="60%" stopColor="#43A85B" />
            <stop offset="100%" stopColor="#2E7E43" />
          </radialGradient>
          <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C2D20" />
            <stop offset="100%" stopColor="#101F13" />
          </linearGradient>
          <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#F4EEDC" />
          </linearGradient>
        </defs>

        {/* Feet / Shadow Base (Scales with breathing animation) */}
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

        {/* Floating Main Character Body Group */}
        <g className={animated ? 'mascot-animated-float' : ''}>
          {/* Back orbital ring for depth */}
          <path
            d="M 10 55 A 40 12 0 0 1 90 55"
            fill="none"
            stroke="#D9F477"
            strokeWidth="2.5"
            strokeDasharray={expression === 'loading' ? '4 3' : 'none'}
            opacity="0.85"
          />

          {/* Main Spherical Body with Rich Gradient */}
          <circle cx="50" cy="54" r="32" fill="url(#sphereGrad)" />

          {/* Soft highlight belly / cheek blush */}
          <circle cx="50" cy="58" r="24" fill="#52C46F" opacity="0.6" />
          <circle cx="34" cy="62" r="4.5" fill="#D9F477" opacity="0.65" />
          <circle cx="66" cy="62" r="4.5" fill="#D9F477" opacity="0.65" />

          {/* Front orbital ring segment */}
          <path
            d="M 90 55 A 40 12 0 0 1 10 55"
            fill="none"
            stroke="#D9F477"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* ========================================================== */}
          {/* HANDS & POSE-SPECIFIC PROPS                                */}
          {/* ========================================================== */}

          {/* 1. HAPPY (Waving hand) */}
          {expression === 'happy' && (
            <g>
              <g className={animated ? 'mascot-hand-wave' : ''}>
                <circle cx="16" cy="45" r="5" fill="#43A85B" />
                <path d="M 22 52 Q 16 46 16 45" stroke="#2B753E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
              <circle cx="82" cy="58" r="5" fill="#43A85B" />
            </g>
          )}

          {/* 2. THINKING (Hand to chin + thought dots) */}
          {expression === 'thinking' && (
            <g>
              <circle cx="48" cy="66" r="5" fill="#43A85B" />
              <path d="M 30 62 Q 40 68 48 66" stroke="#2B753E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="82" cy="58" r="5" fill="#43A85B" />
              {/* Floating thought sparkles */}
              <circle cx="78" cy="30" r="2.5" fill="#D9F477" className={animated ? 'mascot-sparkle-spin' : ''} />
              <circle cx="85" cy="22" r="3.5" fill="#43A85B" className={animated ? 'mascot-sparkle-spin' : ''} />
            </g>
          )}

          {/* 3. CELEBRATING (Both hands raised + star sparkles) */}
          {expression === 'celebrating' && (
            <g>
              <circle cx="18" cy="32" r="5" fill="#43A85B" />
              <circle cx="82" cy="32" r="5" fill="#43A85B" />
              <path d="M 24 50 Q 18 38 18 32" stroke="#2B753E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 76 50 Q 82 38 82 32" stroke="#2B753E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Star sparkles */}
              <g className={animated ? 'mascot-sparkle-spin' : ''}>
                <polygon points="12,20 14,24 18,24 15,27 16,31 12,28 8,31 9,27 6,24 10,24" fill="#D9F477" />
                <polygon points="88,20 90,24 94,24 91,27 92,31 88,28 84,31 85,27 82,24 86,24" fill="#D9F477" />
              </g>
            </g>
          )}

          {/* 4. ENCOURAGING (Thumbs-up) */}
          {expression === 'encouraging' && (
            <g>
              <circle cx="20" cy="52" r="5" fill="#43A85B" />
              <circle cx="80" cy="50" r="5" fill="#43A85B" />
              <path d="M 78 48 L 78 42 Q 80 40 82 42 L 82 48" stroke="#2B753E" strokeWidth="2" fill="#D9F477" strokeLinecap="round" />
            </g>
          )}

          {/* 5. GUIDANCE (Pointing hand) */}
          {expression === 'guidance' && (
            <g>
              <circle cx="18" cy="55" r="5" fill="#43A85B" />
              <circle cx="86" cy="52" r="5" fill="#43A85B" />
              <path d="M 86 52 L 96 50" stroke="#2B753E" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* 6. CODING (Typing on Glowing Mini-Laptop) */}
          {expression === 'coding' && (
            <g>
              {/* Laptop Screen & Base */}
              <polygon points="36,65 64,65 61,53 39,53" fill="url(#laptopScreenGrad)" stroke="#26352A" strokeWidth="1" />
              {/* Green Code line on screen */}
              <text x="42" y="60" fontSize="4.5" fill="#D9F477" fontFamily="monospace" fontWeight="bold">&gt;_</text>
              <rect x="32" y="65" width="36" height="4" rx="1.5" fill="#D5DDD2" stroke="#26352A" strokeWidth="0.8" />
              {/* Cute little typing hands */}
              <circle cx="38" cy="64" r="3.5" fill="#43A85B" className={animated ? 'mascot-hand-typing-left' : ''} />
              <circle cx="62" cy="64" r="3.5" fill="#43A85B" className={animated ? 'mascot-hand-typing-right' : ''} />
            </g>
          )}

          {/* 7. TEACHING (Glasses + Laser Pointer / Whiteboard Wand) */}
          {expression === 'teaching' && (
            <g>
              {/* Left hand holding laser pointer */}
              <circle cx="18" cy="55" r="5" fill="#43A85B" />
              <path d="M 18 55 L 8 40" stroke="#26352A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="8" cy="40" r="2" fill="#D9F477" />
              <circle cx="82" cy="58" r="5" fill="#43A85B" />
              {/* Smart Educator Round Glasses */}
              <circle cx="42" cy="50" r="6" fill="none" stroke="#26352A" strokeWidth="1.5" />
              <circle cx="58" cy="50" r="6" fill="none" stroke="#26352A" strokeWidth="1.5" />
              <path d="M 48 50 L 52 50" stroke="#26352A" strokeWidth="1.5" />
            </g>
          )}

          {/* 8. CELEBRATING CERTIFICATE (Holding Scroll Diploma) */}
          {expression === 'celebrating_certificate' && (
            <g>
              {/* Parchment Scroll Diploma */}
              <rect x="34" y="58" width="32" height="18" rx="2" fill="url(#scrollGrad)" stroke="#B3A06E" strokeWidth="1" />
              {/* Gold Ribbon / Wax Seal */}
              <circle cx="50" cy="67" r="4.5" fill="#D9F477" stroke="#26352A" strokeWidth="1" />
              <path d="M 47 70 L 45 76 L 50 73 L 55 76 L 53 70" fill="#43A85B" />
              {/* Hands holding the sides of the scroll */}
              <circle cx="34" cy="66" r="4" fill="#43A85B" />
              <circle cx="66" cy="66" r="4" fill="#43A85B" />
            </g>
          )}

          {/* 9. LOADING (Dashed orbit focus) */}
          {expression === 'loading' && (
            <g>
              <circle cx="18" cy="56" r="4.5" fill="#43A85B" />
              <circle cx="82" cy="56" r="4.5" fill="#43A85B" />
            </g>
          )}

          {/* ========================================================== */}
          {/* FACIAL FEATURES                                            */}
          {/* ========================================================== */}

          {/* EYES */}
          {expression === 'celebrating' || expression === 'celebrating_certificate' ? (
            <g>
              {/* Joyful squint eyes */}
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

          {/* MOUTH */}
          {(expression === 'happy' || expression === 'encouraging' || expression === 'coding' || expression === 'teaching') && (
            <path d="M 44 60 Q 50 67 56 60" stroke="#26352A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {expression === 'thinking' && (
            <ellipse cx="52" cy="61" rx="2.5" ry="2" fill="#26352A" />
          )}
          {(expression === 'celebrating' || expression === 'celebrating_certificate') && (
            <path d="M 43 59 Q 50 71 57 59 Z" fill="#26352A" />
          )}
          {expression === 'guidance' && (
            <path d="M 45 60 Q 50 65 55 60" stroke="#26352A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          )}
          {expression === 'loading' && (
            <circle cx="50" cy="62" r="2.5" fill="#26352A" />
          )}

          {/* ========================================================== */}
          {/* ACADEMIC MORTARBOARD CAP (ICONIC GENIUSPHERE EMBLEM)       */}
          {/* ========================================================== */}
          <g>
            {/* Skull Cap Base */}
            <ellipse cx="50" cy="30" rx="14" ry="5" fill="#1C271F" />
            {/* Diamond Cap Top */}
            <polygon points="50,15 76,23 50,31 24,23" fill="#26352A" stroke="#1A241C" strokeWidth="1" />
            {/* Center Button */}
            <circle cx="50" cy="23" r="2" fill="#D9F477" />
            {/* Golden Lime Tassel */}
            <path d="M 50 23 Q 66 22 72 34" stroke="#D9F477" strokeWidth="1.8" fill="none" />
            <polygon points="70,34 74,34 73,39 71,39" fill="#D9F477" />
          </g>
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
