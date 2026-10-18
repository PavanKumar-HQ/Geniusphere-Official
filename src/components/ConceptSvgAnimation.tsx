import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ConceptSvgAnimationProps {
  type: string;
  title?: string;
}

export const ConceptSvgAnimation: React.FC<ConceptSvgAnimationProps> = ({ type, title }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0);

  // Logic Gate switches
  const [inputA, setInputA] = useState(true);
  const [inputB, setInputB] = useState(false);

  // Financial compounding slider
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  // Animation step ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E5F0DF',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Animation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#E5F0DF',
              color: '#43A85B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#43A85B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Interactive SVG Concept Animation
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#26352A', fontFamily: 'var(--font-heading)' }}>
              {title || 'Concept Architecture Visualizer'}
            </h4>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-outline"
            style={{ height: '34px', padding: '0 12px', fontSize: '0.78rem' }}
          >
            {isPlaying ? 'Pause Animation' : 'Resume Animation'}
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-secondary"
            style={{ height: '34px', padding: '0 10px', fontSize: '0.78rem' }}
            title="Reset simulation step"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Canvas Body */}
      <div
        style={{
          width: '100%',
          minHeight: '260px',
          backgroundColor: '#FAFAF4',
          borderRadius: '12px',
          border: '1.5px solid #E5F0DF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
        {/* 1. NEURAL NETWORK ANIMATION */}
        {type === 'neural_network' && (
          <svg viewBox="0 0 600 240" style={{ width: '100%', maxHeight: '240px' }}>
            {/* Connecting Synapses */}
            {[50, 110, 170].map((y1, i) =>
              [40, 90, 140, 190].map((y2, j) => (
                <line
                  key={`syn1-${i}-${j}`}
                  x1="100"
                  y1={y1}
                  x2="300"
                  y2={y2}
                  stroke="rgba(67, 168, 91, 0.22)"
                  strokeWidth="1.5"
                />
              ))
            )}

            {[40, 90, 140, 190].map((y1, i) =>
              [70, 150].map((y2, j) => (
                <line
                  key={`syn2-${i}-${j}`}
                  x1="300"
                  y1={y1}
                  x2="500"
                  y2={y2}
                  stroke="rgba(67, 168, 91, 0.28)"
                  strokeWidth="1.5"
                />
              ))
            )}

            {/* Input Layer */}
            {[50, 110, 170].map((y, idx) => (
              <g key={`in-${idx}`}>
                <circle cx="100" cy={y} r="18" fill="#FFFFFF" stroke="#43A85B" strokeWidth="2.5" />
                <text x="100" y={y + 5} fill="#26352A" fontSize="11" fontWeight="700" textAnchor="middle">
                  x{idx + 1}
                </text>
              </g>
            ))}

            {/* Hidden Layer (Pulsing) */}
            {[40, 90, 140, 190].map((y, idx) => {
              const active = (step + idx) % 4 === 0;
              return (
                <g key={`hid-${idx}`}>
                  <circle
                    cx="300"
                    cy={y}
                    r={active ? '20' : '17'}
                    fill={active ? '#D9F477' : '#FFFFFF'}
                    stroke="#43A85B"
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <text x="300" y={y + 5} fill="#26352A" fontSize="10" fontWeight="700" textAnchor="middle">
                    h{idx + 1}
                  </text>
                </g>
              );
            })}

            {/* Output Layer */}
            {[70, 150].map((y, idx) => (
              <g key={`out-${idx}`}>
                <circle cx="500" cy={y} r="20" fill="#E5F0DF" stroke="#43A85B" strokeWidth="2.5" />
                <text x="500" y={y + 5} fill="#26352A" fontSize="11" fontWeight="800" textAnchor="middle">
                  y{idx + 1}
                </text>
              </g>
            ))}

            {/* Pulse token moving along network */}
            <circle
              cx={100 + ((step * 4) % 400)}
              cy={110 + Math.sin(step * 0.2) * 30}
              r="6"
              fill="#43A85B"
            />
            <text x="300" y="228" fill="#6B7C72" fontSize="11" textAnchor="middle" fontWeight="500">
              Forward Propagation • Transformer Attention &amp; Weight Tensors
            </text>
          </svg>
        )}

        {/* 2. BLOCKCHAIN ANIMATION */}
        {type === 'blockchain' && (
          <svg viewBox="0 0 620 220" style={{ width: '100%', maxHeight: '220px' }}>
            {[0, 1, 2].map((idx) => {
              const x = 40 + idx * 190;
              return (
                <g key={`blk-${idx}`}>
                  {/* Block Box */}
                  <rect
                    x={x}
                    y="35"
                    width="150"
                    height="140"
                    rx="10"
                    fill="#FFFFFF"
                    stroke={idx === 2 ? '#D9F477' : '#43A85B'}
                    strokeWidth="2"
                  />
                  <text x={x + 75} y="60" fill="#26352A" fontSize="12" fontWeight="800" textAnchor="middle">
                    Block #{idx + 104}
                  </text>
                  <text x={x + 15} y="85" fill="#6B7C72" fontSize="9">
                    Prev Hash: {idx === 0 ? '00000abc...' : `0000a${idx * 4}f...`}
                  </text>
                  <text x={x + 15} y="105" fill="#43A85B" fontSize="9" fontWeight="700">
                    Nonce: {28941 + idx * 723 + (idx === 2 ? step : 0)}
                  </text>
                  <text x={x + 15} y="125" fill="#26352A" fontSize="9">
                    Merkle: 84a9e...
                  </text>
                  <rect x={x + 15} y="140" width="120" height="20" rx="4" fill="#E5F0DF" />
                  <text x={x + 75} y="154" fill="#26352A" fontSize="9" fontWeight="700" textAnchor="middle">
                    ✓ Validated Block
                  </text>

                  {/* Hash link Arrow */}
                  {idx < 2 && (
                    <g>
                      <line
                        x1={x + 150}
                        y1="105"
                        x2={x + 190}
                        y2="105"
                        stroke="#43A85B"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <polygon points={`${x + 190},105 ${x + 182},101 ${x + 182},109`} fill="#43A85B" />
                    </g>
                  )}
                </g>
              );
            })}
            <text x="310" y="205" fill="#6B7C72" fontSize="11" textAnchor="middle" fontWeight="500">
              Cryptographic Hash Pointers &amp; Proof-of-Work Distributed Consensus
            </text>
          </svg>
        )}

        {/* 3. LOGIC GATES ANIMATION (INTERACTIVE) */}
        {type === 'logic_gates' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setInputA(!inputA)}
                className={inputA ? 'btn-lime' : 'btn-secondary'}
                style={{ height: '36px', minWidth: '100px', fontSize: '0.85rem' }}
              >
                Input A: {inputA ? '1 (HIGH)' : '0 (LOW)'}
              </button>
              <button
                type="button"
                onClick={() => setInputB(!inputB)}
                className={inputB ? 'btn-lime' : 'btn-secondary'}
                style={{ height: '36px', minWidth: '100px', fontSize: '0.85rem' }}
              >
                Input B: {inputB ? '1 (HIGH)' : '0 (LOW)'}
              </button>
            </div>

            <svg viewBox="0 0 540 140" style={{ width: '100%', maxWidth: '540px' }}>
              {/* Wires */}
              <line x1="80" y1="45" x2="220" y2="45" stroke={inputA ? '#43A85B' : '#CBD5E1'} strokeWidth="3" />
              <line x1="80" y1="95" x2="220" y2="95" stroke={inputB ? '#43A85B' : '#CBD5E1'} strokeWidth="3" />
              <line x1="320" y1="70" x2="440" y2="70" stroke={inputA && inputB ? '#43A85B' : '#CBD5E1'} strokeWidth="4" />

              {/* AND Gate Body */}
              <path
                d="M 220,30 L 260,30 A 40,40 0 0,1 260,110 L 220,110 Z"
                fill="#FFFFFF"
                stroke="#43A85B"
                strokeWidth="2.5"
              />
              <text x="250" y="75" fill="#26352A" fontSize="13" fontWeight="800" textAnchor="middle">
                AND
              </text>

              {/* Output LED */}
              <circle
                cx="460"
                cy="70"
                r="16"
                fill={inputA && inputB ? '#D9F477' : '#F1F5F9'}
                stroke="#43A85B"
                strokeWidth="3"
              />
              <text x="460" y="75" fill="#26352A" fontSize="11" fontWeight="800" textAnchor="middle">
                {inputA && inputB ? '1' : '0'}
              </text>
            </svg>

            <div style={{ fontSize: '0.82rem', color: '#6B7C72' }}>
              Click Input buttons to toggle voltage state. Output is HIGH (1) only when BOTH inputs are 1.
            </div>
          </div>
        )}

        {/* 4. FINANCIAL COMPOUND INTEREST CURVE */}
        {type === 'compound_growth' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#26352A', fontWeight: 600 }}>Principal: ₹{principal}</label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#26352A', fontWeight: 600 }}>Annual Return: {rate}%</label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#26352A', fontWeight: 600 }}>Duration: {years} Years</label>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Calculated Values */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px', backgroundColor: '#E5F0DF', borderRadius: '10px', border: '1px solid #D5CCC0' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#6B7C72', fontWeight: 600 }}>Invested Capital</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#26352A' }}>₹{principal.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#26352A', fontWeight: 600 }}>Estimated Future Corpus</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#43A85B' }}>
                  ₹{Math.round(principal * Math.pow(1 + rate / 100, years)).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. DEFAULT / CIPHER & DEFENSE FLOW */}
        {!['neural_network', 'blockchain', 'logic_gates', 'compound_growth'].includes(type) && (
          <svg viewBox="0 0 560 160" style={{ width: '100%', maxHeight: '160px' }}>
            <rect x="40" y="45" width="120" height="70" rx="10" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2" />
            <text x="100" y="75" fill="#26352A" fontSize="12" fontWeight="700" textAnchor="middle">
              Untrusted Input
            </text>
            <text x="100" y="95" fill="#E11D48" fontSize="10" textAnchor="middle" fontWeight="700">
              Raw Payload
            </text>

            <line x1="160" y1="80" x2="230" y2="80" stroke="#43A85B" strokeWidth="2" />
            <polygon points="230,80 222,76 222,84" fill="#43A85B" />

            {/* Defense Barrier */}
            <rect x="230" y="30" width="130" height="100" rx="10" fill="#E5F0DF" stroke="#43A85B" strokeWidth="2" />
            <text x="295" y="70" fill="#26352A" fontSize="12" fontWeight="800" textAnchor="middle">
              Parameterization
            </text>
            <text x="295" y="90" fill="#43A85B" fontSize="10" textAnchor="middle" fontWeight="700">
              Positional ? Bind
            </text>

            <line x1="360" y1="80" x2="430" y2="80" stroke="#43A85B" strokeWidth="2" />
            <polygon points="430,80 422,76 422,84" fill="#43A85B" />

            {/* Execution Engine */}
            <rect x="430" y="45" width="100" height="70" rx="10" fill="#FFFFFF" stroke="#43A85B" strokeWidth="2" />
            <text x="480" y="75" fill="#26352A" fontSize="12" fontWeight="700" textAnchor="middle">
              Engine Core
            </text>
            <text x="480" y="95" fill="#43A85B" fontSize="10" textAnchor="middle" fontWeight="700">
              Zero Injection
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
