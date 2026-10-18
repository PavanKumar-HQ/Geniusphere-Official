import React, { useState, useRef, useEffect } from 'react';
import {
  Pen,
  Minus,
  Square,
  Eraser,
  Download,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface Stroke {
  type: 'freehand' | 'line' | 'rect';
  points: [number, number][];
  color: string;
  width: number;
}

interface VectorScratchpadOverlayProps {
  labKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VectorScratchpadOverlay: React.FC<VectorScratchpadOverlayProps> = ({
  labKey,
  isOpen,
  onClose,
}) => {
  const [tool, setTool] = useState<'pen' | 'line' | 'rect' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#43A85B'); // Fresh Green by default
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [zenMode, setZenMode] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Load strokes from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(`geniusphere_sketch_${labKey}`);
      if (saved) {
        setStrokes(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }
  }, [labKey]);

  // Persist strokes
  const saveStrokes = (newStrokes: Stroke[]) => {
    setStrokes(newStrokes);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(`geniusphere_sketch_${labKey}`, JSON.stringify(newStrokes));
    } catch {
      // Storage quota guard
    }
  };

  const getCoordinates = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>): [number, number] => {
    if (!svgRef.current) return [0, 0];
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return [clientX - rect.left, clientY - rect.top];
  };

  const handleStart = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const pt = getCoordinates(e);
    setIsDrawing(true);
    setCurrentStroke({
      type: tool === 'pen' ? 'freehand' : tool === 'line' ? 'line' : 'rect',
      points: [pt],
      color: tool === 'eraser' ? '#FAFAF4' : color,
      width: tool === 'eraser' ? 16 : 2.5,
    });
  };

  const handleMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentStroke) return;
    const pt = getCoordinates(e);

    if (currentStroke.type === 'freehand') {
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, pt],
      });
    } else {
      setCurrentStroke({
        ...currentStroke,
        points: [currentStroke.points[0], pt],
      });
    }
  };

  const handleEnd = () => {
    if (isDrawing && currentStroke && currentStroke.points.length > 0) {
      saveStrokes([...strokes, currentStroke]);
    }
    setIsDrawing(false);
    setCurrentStroke(null);
  };

  const handleClear = () => {
    saveStrokes([]);
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geniusphere-notes-${labKey}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        pointerEvents: 'none',
      }}
    >
      {/* Floating Toolbar (Lorien Pattern) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(38, 53, 42, 0.18)',
          borderRadius: '12px',
          padding: '6px 12px',
          boxShadow: '0 8px 24px rgba(38, 53, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          zIndex: 1502,
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginRight: '4px' }}>
          Vector Notes
        </span>

        {/* Tool Buttons */}
        <button
          type="button"
          onClick={() => setTool('pen')}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: tool === 'pen' ? 'var(--brand-surface)' : 'transparent',
            color: tool === 'pen' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Pen Tool"
        >
          <Pen size={16} />
        </button>

        <button
          type="button"
          onClick={() => setTool('line')}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: tool === 'line' ? 'var(--brand-surface)' : 'transparent',
            color: tool === 'line' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Line Tool"
        >
          <Minus size={16} />
        </button>

        <button
          type="button"
          onClick={() => setTool('rect')}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: tool === 'rect' ? 'var(--brand-surface)' : 'transparent',
            color: tool === 'rect' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Rectangle Tool"
        >
          <Square size={16} />
        </button>

        <button
          type="button"
          onClick={() => setTool('eraser')}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            background: tool === 'eraser' ? 'var(--brand-surface)' : 'transparent',
            color: tool === 'eraser' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Eraser"
        >
          <Eraser size={16} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Color Palette */}
        {['#43A85B', '#26352A', '#D97706', '#DC2626'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setColor(c);
              if (tool === 'eraser') setTool('pen');
            }}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: c,
              border: color === c ? '2px solid var(--text-primary)' : '1px solid rgba(0,0,0,0.15)',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label={`Color ${c}`}
          />
        ))}

        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-subtle)' }} />

        <button
          type="button"
          onClick={handleClear}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          title="Clear All Strokes"
        >
          <RotateCcw size={15} />
        </button>

        <button
          type="button"
          onClick={handleExportSvg}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px' }}
          title="Export SVG Notes"
        >
          <Download size={15} />
        </button>

        <button
          type="button"
          onClick={() => setZenMode(!zenMode)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px' }}
          title={zenMode ? 'Exit Zen Mode' : 'Zen Mode Canvas'}
        >
          {zenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          title="Close Vector Overlay"
        >
          <X size={16} />
        </button>
      </div>

      {/* Interactive SVG Overlay Canvas */}
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          backgroundColor: zenMode ? 'rgba(250, 250, 244, 0.94)' : 'rgba(250, 250, 244, 0.08)',
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Render Saved Strokes */}
        {strokes.map((s, idx) => {
          if (s.type === 'freehand') {
            const pathData = s.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
            return (
              <path
                key={idx}
                d={pathData}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          } else if (s.type === 'line' && s.points.length >= 2) {
            return (
              <line
                key={idx}
                x1={s.points[0][0]}
                y1={s.points[0][1]}
                x2={s.points[1][0]}
                y2={s.points[1][1]}
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="round"
              />
            );
          } else if (s.type === 'rect' && s.points.length >= 2) {
            const x = Math.min(s.points[0][0], s.points[1][0]);
            const y = Math.min(s.points[0][1], s.points[1][1]);
            const w = Math.abs(s.points[1][0] - s.points[0][0]);
            const h = Math.abs(s.points[1][1] - s.points[0][1]);
            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width}
                rx={4}
              />
            );
          }
          return null;
        })}

        {/* Render Current In-Progress Stroke */}
        {currentStroke && (
          currentStroke.type === 'freehand' ? (
            <path
              d={currentStroke.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ')}
              fill="none"
              stroke={currentStroke.color}
              strokeWidth={currentStroke.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : currentStroke.type === 'line' && currentStroke.points.length >= 2 ? (
            <line
              x1={currentStroke.points[0][0]}
              y1={currentStroke.points[0][1]}
              x2={currentStroke.points[1][0]}
              y2={currentStroke.points[1][1]}
              stroke={currentStroke.color}
              strokeWidth={currentStroke.width}
              strokeLinecap="round"
            />
          ) : currentStroke.type === 'rect' && currentStroke.points.length >= 2 ? (
            <rect
              x={Math.min(currentStroke.points[0][0], currentStroke.points[1][0])}
              y={Math.min(currentStroke.points[0][1], currentStroke.points[1][1])}
              width={Math.abs(currentStroke.points[1][0] - currentStroke.points[0][0])}
              height={Math.abs(currentStroke.points[1][1] - currentStroke.points[0][1])}
              fill="none"
              stroke={currentStroke.color}
              strokeWidth={currentStroke.width}
              rx={4}
            />
          ) : null
        )}
      </svg>
    </div>
  );
};
