import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Code,
  Layers,
} from 'lucide-react';

interface DiagramNode {
  id: string;
  label: string;
  colorType: 'green' | 'sage' | 'lime' | 'amber';
  x: number;
  y: number;
}

interface DiagramEdge {
  from: string;
  to: string;
  label: string;
}

const DEFAULT_DSL = `Client [green] -> WAF [sage] : Inspect HTTP
WAF [sage] -> Gateway [green] : Clean Request
Gateway [green] -> AuthEngine [lime] : Validate Token
AuthEngine [lime] -> Database [sage] : Query Ledger
Database [sage] -> AuditChain [green] : SHA256 Log`;

export const VisualDiagramStudio: React.FC = () => {
  const [dslText, setDslText] = useState<string>(DEFAULT_DSL);
  const [nodes, setNodes] = useState<DiagramNode[]>([]);
  const [edges, setEdges] = useState<DiagramEdge[]>([]);
  const [animStep, setAnimStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Parse DSL text into nodes & edges
  useEffect(() => {
    const lines = dslText.split('\n').filter((l) => l.trim().length > 0);
    const parsedNodes: Map<string, DiagramNode> = new Map();
    const parsedEdges: DiagramEdge[] = [];

    let nodeIndex = 0;
    lines.forEach((line) => {
      // Syntax: NodeA [color] -> NodeB [color] : Label
      const arrowMatch = line.match(/^([A-Za-z0-9_-]+)(?:\s*\[([a-z]+)\])?\s*->\s*([A-Za-z0-9_-]+)(?:\s*\[([a-z]+)\])?(?:\s*:\s*(.+))?$/);
      if (arrowMatch) {
        const fromId = arrowMatch[1];
        const fromColor = (arrowMatch[2] as any) || 'green';
        const toId = arrowMatch[3];
        const toColor = (arrowMatch[4] as any) || 'sage';
        const label = arrowMatch[5] || '';

        if (!parsedNodes.has(fromId)) {
          parsedNodes.set(fromId, {
            id: fromId,
            label: fromId,
            colorType: fromColor,
            x: 80 + (nodeIndex % 3) * 180,
            y: 60 + Math.floor(nodeIndex / 3) * 110,
          });
          nodeIndex++;
        }

        if (!parsedNodes.has(toId)) {
          parsedNodes.set(toId, {
            id: toId,
            label: toId,
            colorType: toColor,
            x: 80 + (nodeIndex % 3) * 180,
            y: 60 + Math.floor(nodeIndex / 3) * 110,
          });
          nodeIndex++;
        }

        parsedEdges.push({ from: fromId, to: toId, label });
      }
    });

    setNodes(Array.from(parsedNodes.values()));
    setEdges(parsedEdges);
  }, [dslText]);

  // Step Animation Loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setAnimStep((prev) => {
          if (prev >= edges.length - 1) {
            setIsPlaying(false);
            return -1;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, edges.length]);

  const handleDragNode = (id: string) => {
    setDraggingNodeId(id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(50, Math.min(650, e.clientX - rect.left));
    const newY = Math.max(40, Math.min(380, e.clientY - rect.top));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Studio Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Visual Architecture Studio (Diagram-as-Code)
            </h3>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Inspired by OpenFlowKit & WBO · Bidirectional DSL & Interactive SVG
            </div>
          </div>
        </div>

        {/* Animation & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setAnimStep(0);
              setIsPlaying(true);
            }}
            style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Play size={14} />
            <span>{isPlaying ? 'Playing...' : 'Play Flow Steps'}</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setIsPlaying(false);
              setAnimStep(-1);
            }}
            style={{ height: '34px', padding: '0 10px', fontSize: '0.8rem' }}
            title="Reset Flow"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Split-Pane Studio Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Left Pane: DSL Code Editor */}
        <div
          style={{
            borderRight: '1px solid var(--border-subtle)',
            backgroundColor: '#1E2925',
            color: '#FAFAF4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#141E1A',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.74rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#A8C5A0',
            }}
          >
            <Code size={14} />
            <span>architecture.dsl (Diagram-as-Code)</span>
          </div>

          <textarea
            value={dslText}
            onChange={(e) => setDslText(e.target.value)}
            style={{
              flex: 1,
              minHeight: '340px',
              backgroundColor: 'transparent',
              color: '#E5F0DF',
              border: 'none',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
            }}
            spellCheck={false}
          />

          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.72rem',
              color: '#8CA696',
            }}
          >
            Syntax: <code>NodeA [green|sage|lime] -&gt; NodeB : Label</code>
          </div>
        </div>

        {/* Right Pane: Interactive SVG Canvas */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            position: 'relative',
            minHeight: '380px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Warm Ivory Graph Grid Pattern */}
          <svg
            viewBox="0 0 700 400"
            style={{ width: '100%', height: '100%', display: 'block', cursor: draggingNodeId ? 'grabbing' : 'default' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(38, 53, 42, 0.08)" />
              </pattern>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#43A85B" />
              </marker>
              <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#D9F477" />
              </marker>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid-pattern)" />

            {/* Edges */}
            {edges.map((e, idx) => {
              const fromNode = nodes.find((n) => n.id === e.from);
              const toNode = nodes.find((n) => n.id === e.to);
              if (!fromNode || !toNode) return null;

              const isEdgeActive = animStep === idx;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isEdgeActive ? '#D9F477' : 'rgba(38, 53, 42, 0.25)'}
                    strokeWidth={isEdgeActive ? 3.5 : 2}
                    markerEnd={isEdgeActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />
                  {e.label && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 8}
                      textAnchor="middle"
                      fill="#26352A"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      fontWeight="600"
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isNodeActive = edges[animStep]?.from === node.id || edges[animStep]?.to === node.id;
              const fillBg =
                node.colorType === 'green'
                  ? '#E5F0DF'
                  : node.colorType === 'lime'
                  ? '#D9F477'
                  : '#FFFFFF';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x - 55}, ${node.y - 20})`}
                  style={{ cursor: 'grab' }}
                  onMouseDown={() => handleDragNode(node.id)}
                >
                  <rect
                    width="110"
                    height="40"
                    rx="8"
                    fill={fillBg}
                    stroke={isNodeActive ? '#43A85B' : 'rgba(38, 53, 42, 0.18)'}
                    strokeWidth={isNodeActive ? 2.5 : 1.5}
                  />
                  <text
                    x="55"
                    y="24"
                    textAnchor="middle"
                    fill="#26352A"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    fontWeight="700"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
