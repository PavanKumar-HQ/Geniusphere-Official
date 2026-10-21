import React, { useEffect, useRef } from 'react';

export interface CelebrationCrackersProps {
  active: boolean;
  message?: string;
  xpAmount?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'star';
}

export const CelebrationCrackers: React.FC<CelebrationCrackersProps> = ({
  active,
  message = 'Streak Maintained & XP Collected!',
  xpAmount,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00F5A0', '#F59E0B', '#2563EB', '#A9C86A', '#EC4899', '#8B5CF6', '#10B981', '#F97316'];
    const particles: Particle[] = [];
    const particleCount = 90;

    const originX = canvas.width / 2;
    const originY = canvas.height * 0.42;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 9 + 4;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'star' : 'circle',
      });
    }

    let animationFrameId: number;
    let startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const render = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.985; // drag
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - progress * 1.15);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else {
          // 4-point star / diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.4, p.size * 0.4);
          ctx.lineTo(-p.size, 0);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Animated Celebration Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10001,
          backgroundColor: '#244C3A',
          color: '#FFFFFF',
          padding: '16px 28px',
          borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(36, 76, 58, 0.4), 0 0 0 2px #00F5A0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00F5A0',
              boxShadow: '0 0 10px #00F5A0',
            }}
          />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#A9C86A',
            }}
          >
            CELEBRATION MILESTONE
          </span>
        </div>

        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
          {message}
        </div>

        {xpAmount !== undefined && (
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#00F5A0',
              backgroundColor: 'rgba(0, 245, 160, 0.12)',
              padding: '4px 14px',
              borderRadius: '100px',
              border: '1px solid rgba(0, 245, 160, 0.3)',
            }}
          >
            +{xpAmount} XP Added to Profile
          </div>
        )}
      </div>
    </div>
  );
};
