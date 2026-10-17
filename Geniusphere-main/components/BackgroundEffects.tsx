
import React, { useEffect, useRef } from 'react';

export const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const STAR_COUNT = 150;
    const METEOR_FREQUENCY = 0.05; // Increased frequency

    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
    }

    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
    }

    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          alpha: Math.random(),
          twinkleSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const createMeteor = () => {
      // Meteors fall from top-right to bottom-left mostly
      // Spawn logic adjusted to ensure they appear on screen more often
      const spawnOnTop = Math.random() < 0.6;
      let x, y;
      
      if (spawnOnTop) {
          // Start anywhere along the top, extending off-screen to the right slightly
          x = Math.random() * (width + 300) - 100; 
          y = -50;
      } else {
          // Start on the right side
          x = width + 50;
          y = Math.random() * (height * 0.7); // Top 70% of right edge
      }

      meteors.push({
        x,
        y,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 12 + 10,
        angle: Math.PI * 0.75 + (Math.random() * 0.1 - 0.05), // Diagonal down-left (~135 degrees)
        alpha: 1
      });
    };

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    // Initial Setup
    setSize();
    window.addEventListener('resize', setSize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        // Bounce alpha between 0.2 and 1
        if (star.alpha > 1) {
            star.alpha = 1;
            star.twinkleSpeed = -star.twinkleSpeed;
        } else if (star.alpha < 0.2) {
            star.alpha = 0.2;
            star.twinkleSpeed = -star.twinkleSpeed;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      // Spawn Meteors
      if (Math.random() < METEOR_FREQUENCY) {
        createMeteor();
      }

      // Draw and Update Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        
        // Move
        m.x += m.speed * Math.cos(m.angle);
        m.y += m.speed * Math.sin(m.angle);
        
        // Fade out slower so they travel further
        m.alpha -= 0.01;

        // Draw Trail
        const startX = m.x;
        const startY = m.y;
        const endX = m.x - m.length * Math.cos(m.angle);
        const endY = m.y - m.length * Math.sin(m.angle);

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        // Bright white head for visibility
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`); 
        gradient.addColorStop(0.1, `rgba(100, 220, 255, ${m.alpha * 0.8})`); 
        gradient.addColorStop(1, 'rgba(100, 220, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3; // Thicker line
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw Head (Glowing Dot)
        ctx.beginPath();
        ctx.arc(startX, startY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.fill();
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(100, 220, 255, 1)";
        ctx.stroke(); // trigger shadow
        ctx.shadowBlur = 0; // reset

        // Cleanup
        if (m.alpha <= 0 || m.y > height + 100 || m.x < -100) {
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/30 via-black to-black" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
