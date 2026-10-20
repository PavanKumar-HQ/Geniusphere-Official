
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GlobalEvent } from '../types';

interface GlobeVisualizerProps {
  currentStep: number;
  selectedEvent: GlobalEvent;
  isSimplified: boolean;
}

const GlobeVisualizer: React.FC<GlobeVisualizerProps> = ({ currentStep, selectedEvent, isSimplified }) => {
  const [rotation, setRotation] = useState(0);

  // Sample country points
  const countries = useMemo(() => [
    { id: 0, name: 'Americas', x: 180, y: 280, type: 'developed' },
    { id: 1, name: 'Europe', x: 420, y: 220, type: 'developed' },
    { id: 2, name: 'Asia', x: 620, y: 250, type: 'developing' },
    { id: 3, name: 'Africa', x: 440, y: 400, type: 'developing' },
    { id: 4, name: 'Oceania', x: 680, y: 480, type: 'developed' },
  ], []);

  const tradeRoutes = useMemo(() => [
    [0, 1], [1, 2], [2, 4], [3, 1], [0, 3]
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Matrix-like Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#4DA3FF 1px, transparent 1px), linear-gradient(90deg, #4DA3FF 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      <svg
        viewBox="0 0 800 600"
        className="w-full h-full drop-shadow-[0_0_50px_rgba(77,163,255,0.15)]"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2AFFA2" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* The Globe Sphere */}
        <circle cx="400" cy="300" r="260" fill="#0A1128" stroke="#1E293B" strokeWidth="2" />

        {/* Lat/Long Grid Lines */}
        <g className="opacity-10">
          {[...Array(8)].map((_, i) => (
            <ellipse key={`lat-${i}`} cx="400" cy="300" rx="260" ry={(i + 1) * 32} fill="none" stroke="#4DA3FF" strokeWidth="1" />
          ))}
          {[...Array(8)].map((_, i) => (
            <ellipse key={`long-${i}`} cx="400" cy="300" rx={(i + 1) * 32} ry="260" fill="none" stroke="#4DA3FF" strokeWidth="1" />
          ))}
        </g>

        {/* Trade Routes & Cargo Ships */}
        {!isSimplified && tradeRoutes.map(([start, end], idx) => {
          const s = countries[start];
          const e = countries[end];
          const isDisrupted = currentStep >= 3;
          const strokeColor = isDisrupted ? '#FF4D4D' : '#2AFFA2';

          return (
            <g key={`route-group-${idx}`}>
              <path
                id={`route-${idx}`}
                d={`M ${s.x} ${s.y} Q ${(s.x + e.x) / 2} ${(s.y + e.y) / 2 - 60} ${e.x} ${e.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isDisrupted ? 1 : 2}
                strokeDasharray={isDisrupted ? "4,6" : "none"}
                className="transition-all duration-1000 opacity-30"
              />
              {/* Moving Cargo Ships */}
              {!isDisrupted && (
                <circle r="3" fill="#2AFFA2">
                  <animateMotion dur={`${3 + idx}s`} repeatCount="indefinite">
                    <mpath href={`#route-${idx}`} />
                  </animateMotion>
                </circle>
              )}
              {isDisrupted && currentStep < 10 && (
                <text fontSize="12" fill="#FF4D4D" className="mono font-bold">
                  <textPath href={`#route-${idx}`} startOffset="50%">⚠️ DELAYED</textPath>
                </text>
              )}
            </g>
          );
        })}

        {/* Factories (Step 3 & 6) */}
        {(currentStep === 3 || currentStep === 6) && countries.map((c, i) => (
          <g key={`factory-${i}`} transform={`translate(${c.x - 20}, ${c.y - 40})`} className="animate-bounce">
            <path d="M0 20 L0 0 L10 10 L10 0 L20 10 L20 20 Z" fill={currentStep === 3 ? '#FF4D4D' : '#FFA14D'} opacity="0.8" />
            <rect x="0" y="20" width="20" height="5" fill="#E6E9F0" />
            {currentStep === 3 && <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="2" />}
          </g>
        ))}

        {/* Country Pulse Indicators */}
        {countries.map((c, idx) => {
          const isEventOrigin = idx === 2 && currentStep >= 2;
          const isStressed = currentStep >= 5;
          const isDeveloped = c.type === 'developed';

          let color = '#2AFFA2'; // Default Growth
          if (isEventOrigin) color = selectedEvent.color;
          else if (isStressed) {
            color = isDeveloped ? '#FFA14D' : '#FF4D4D'; // Developing countries show more stress
          }

          return (
            <g key={`country-${idx}`} transform={`translate(${c.x}, ${c.y})`}>
              <circle r="10" fill={color} filter="url(#glow)" />
              <circle r="15" fill="none" stroke={color} strokeWidth="1" opacity="0.4">
                <animate attributeName="r" from="10" to="30" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {isEventOrigin && (
                <g transform="translate(0, -40)">
                  <text textAnchor="middle" fill="#E6E9F0" className="text-[10px] font-bold uppercase mono">ORIGIN</text>
                  <path d="M-5 5 L0 15 L5 5" fill="none" stroke={color} strokeWidth="2" />
                </g>
              )}
            </g>
          );
        })}

        {/* Price Tag Overlays (Step 4 & 9) */}
        {(currentStep === 4 || currentStep === 9) && (
          <g transform="translate(400, 150)">
            <g transform="translate(-150, 0)" className="animate-pulse">
              <rect x="0" y="0" width="100" height="35" rx="4" fill="#1E293B" stroke="#FFA14D" />
              <text x="50" y="22" textAnchor="middle" fill="#FFA14D" className="text-sm font-bold mono">FUEL ↑ 30%</text>
            </g>
            <g transform="translate(50, 40)" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <rect x="0" y="0" width="100" height="35" rx="4" fill="#1E293B" stroke="#FF4D4D" />
              <text x="50" y="22" textAnchor="middle" fill="#FF4D4D" className="text-sm font-bold mono">FOOD ↑ 15%</text>
            </g>
          </g>
        )}

        {/* Job Market Shift (Step 7) */}
        {currentStep === 7 && (
          <g transform="translate(100, 450)">
            <text x="0" y="0" fill="#2AFFA2" className="text-xs font-bold mono">TECH SECTOR: GROWING</text>
            <path d="M0 10 L150 10" stroke="#2AFFA2" strokeWidth="4" strokeDasharray="150" strokeDashoffset="150">
              <animate attributeName="stroke-dashoffset" to="0" dur="1s" fill="freeze" />
            </path>
            <text x="0" y="40" fill="#FF4D4D" className="text-xs font-bold mono">RETAIL: CONTRACTING</text>
            <path d="M0 50 L100 50" stroke="#FF4D4D" strokeWidth="4" strokeDasharray="100" strokeDashoffset="100">
              <animate attributeName="stroke-dashoffset" to="0" dur="1s" fill="freeze" />
            </path>
          </g>
        )}

        {/* Recovery Curve (Step 10) */}
        {currentStep === 10 && (
          <g transform="translate(250, 450)">
            <rect x="-20" y="-120" width="340" height="140" fill="#0A0F24" opacity="0.9" rx="8" stroke="#1E293B" />
            <text x="150" y="-100" textAnchor="middle" fill="#4DA3FF" className="text-xs font-bold uppercase mono">Economic Recovery Forecast</text>

            <path
              d="M 0 0 Q 75 -100 150 -40 T 300 -80"
              fill="none"
              stroke="#2AFFA2"
              strokeWidth="3"
              strokeDasharray="500"
              strokeDashoffset="500"
            >
              <animate attributeName="stroke-dashoffset" to="0" dur="3s" fill="freeze" />
            </path>

            <circle cx="300" cy="-80" r="4" fill="#2AFFA2">
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze" />
            </circle>
            <text x="310" y="-75" fill="#2AFFA2" className="text-[10px] mono">NEW STABILITY</text>

            <line x1="0" y1="0" x2="300" y2="0" stroke="#1E293B" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-100" stroke="#1E293B" strokeWidth="1" />
          </g>
        )}

      </svg>
    </div>
  );
};

export default GlobeVisualizer;
