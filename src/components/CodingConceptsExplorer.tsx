import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Check,
  Copy,
  Terminal,
  Columns,
  Layers,
  Zap,
  Code2,
  FileCode,
  Cpu,
  Binary,
  Database,
} from 'lucide-react';
import { CODING_CONCEPTS, LanguageConceptDetail } from '../data/codingConcepts';
import {
  SupportedLanguage,
  executePythonCode,
  executeJavaScriptCode,
  executeTypeScriptCode,
  executeCppCode,
  executeJavaCode,
  executeCCode,
  executeSqlCode,
  ExecutionResult,
} from '../utils/codeSandboxRunner';
import { MascotSphere } from './MascotSphere';

interface CodingConceptsExplorerProps {
  initialConceptId?: string;
  initialLanguage?: SupportedLanguage;
  onOpenSandboxWithCode?: (code: string, language: SupportedLanguage) => void;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export const CodingConceptsExplorer: React.FC<CodingConceptsExplorerProps> = ({
  initialConceptId = 'variables_types',
  initialLanguage = 'python',
  onOpenSandboxWithCode,
  onLanguageChange,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId);
  const [electedLanguage, setElectedLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [compareLanguage, setCompareLanguage] = useState<SupportedLanguage>(
    initialLanguage === 'python' ? 'javascript' : 'python'
  );
  const [viewMode, setViewMode] = useState<'single' | 'side-by-side' | 'matrix'>('side-by-side');
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const currentConcept =
    CODING_CONCEPTS.find((c) => c.id === selectedConceptId) || CODING_CONCEPTS[0];

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setElectedLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
    setRunResult(null);
  };

  const handleCopy = (code: string, langKey: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(langKey);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const handleExecuteSnippet = (code: string, lang: SupportedLanguage) => {
    setIsRunning(true);
    setRunResult(null);

    setTimeout(() => {
      let res: ExecutionResult;
      switch (lang) {
        case 'python':
          res = executePythonCode(code);
          break;
        case 'javascript':
          res = executeJavaScriptCode(code);
          break;
        case 'typescript':
          res = executeTypeScriptCode(code);
          break;
        case 'cpp':
          res = executeCppCode(code);
          break;
        case 'java':
          res = executeJavaCode(code);
          break;
        case 'c':
          res = executeCCode(code);
          break;
        case 'sql':
          res = executeSqlCode(code);
          break;
        default:
          res = executePythonCode(code);
      }
      setRunResult(res);
      setIsRunning(false);
    }, 240);
  };

  const renderCodeCard = (
    detail: LanguageConceptDetail,
    isPrimary: boolean
  ) => {
    return (
      <div
        key={detail.language}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: isPrimary ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: isPrimary ? '0 4px 16px rgba(0, 0, 0, 0.06)' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'var(--bg-surface-subdued)',
                color: 'var(--brand-primary)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                border: '1px solid var(--border-subtle)',
              }}
            >
              {detail.badge}
            </span>
            {isPrimary && (
              <span
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                }}
              >
                Elected Language
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleCopy(detail.code, detail.language)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {copiedLang === detail.language ? <Check size={12} color="var(--brand-primary)" /> : <Copy size={12} />}
              <span>{copiedLang === detail.language ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteSnippet(detail.code, detail.language)}
              disabled={isRunning}
              style={{
                backgroundColor: 'var(--brand-primary)',
                border: 'none',
                color: '#FFFFFF',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Play size={12} fill="#FFFFFF" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Syntax Characteristic: <strong>{detail.syntaxStyle}</strong>
        </div>

        {/* Code Box */}
        <div
          style={{
            backgroundColor: 'var(--editor-bg, #0B1120)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: '#E2E8F0',
            }}
          >
            <code>{detail.code}</code>
          </pre>
        </div>

        {/* Cognitive Breakdown & Gotcha */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'var(--bg-surface-subdued)',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>How it operates:</strong> {detail.explanation}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--brand-quest, #D97706)', lineHeight: 1.4 }}>
            <strong>Gotcha to avoid:</strong> {detail.commonGotcha}
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <strong>Pro Tip:</strong> {detail.proTip}
          </div>
        </div>

        {onOpenSandboxWithCode && (
          <button
            type="button"
            onClick={() => onOpenSandboxWithCode(detail.code, detail.language)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--brand-primary)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Terminal size={14} />
            <span>Open in Full Sandbox</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    );
  };

  const getLangIcon = (id: SupportedLanguage) => {
    switch (id) {
      case 'python': return <Code2 size={14} />;
      case 'javascript': return <FileCode size={14} />;
      case 'typescript': return <FileCode size={14} />;
      case 'cpp': return <Cpu size={14} />;
      case 'java': return <Terminal size={14} />;
      case 'c': return <Binary size={14} />;
      case 'sql': return <Database size={14} />;
      default: return <Code2 size={14} />;
    }
  };

  const languageOptions: Array<{ id: SupportedLanguage; label: string }> = [
    { id: 'python', label: 'Python 3.12' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'cpp', label: 'C++ (C++20)' },
    { id: 'java', label: 'Java 21' },
    { id: 'c', label: 'C (C11)' },
    { id: 'sql', label: 'SQL (ANSI)' },
  ];

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '0 12px',
      }}
    >
      {/* Header Banner */}
      <div
        className="card-elevated"
        style={{
          borderLeft: '5px solid var(--brand-primary)',
          padding: '24px 28px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <MascotSphere
            pose="coding"
            size={56}
            speechBubble="Compare how different programming languages implement the same core logic!"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--brand-primary)',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Computational Thinking Engine
              </span>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--text-secondary)',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                7 Core Languages • Zero Abstraction
              </span>
            </div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 4px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Coding Concepts & Multi-Language Matrix
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Select your primary elected language to view concepts through its lens, or compare how languages solve the exact same problem side-by-side.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface-subdued)',
            border: '1px solid var(--border-subtle)',
            padding: '3px',
            borderRadius: '100px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: viewMode === 'side-by-side' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'side-by-side' ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Columns size={13} />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: viewMode === 'matrix' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'matrix' ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={13} />
            <span>Comparison Matrix</span>
          </button>
        </div>
      </div>

      {/* Primary Elected Language Selector Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Elected Language:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {languageOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectLanguage(opt.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: electedLanguage === opt.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: electedLanguage === opt.id ? 'var(--bg-surface-subdued)' : 'var(--bg-surface)',
                color: electedLanguage === opt.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: electedLanguage === opt.id ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{getLangIcon(opt.id)}</span>
              <span>{opt.label}</span>
              {electedLanguage === opt.id && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Concept Exploration Grid */}
      <div
        className="coding-concepts-grid"
      >
        {/* Left Concept Navigation Sidebar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              marginBottom: '4px',
              paddingLeft: '8px',
            }}
          >
            Core Concepts
          </div>

          {CODING_CONCEPTS.map((concept) => (
            <button
              key={concept.id}
              type="button"
              onClick={() => {
                setSelectedConceptId(concept.id);
                setRunResult(null);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: selectedConceptId === concept.id ? '1.5px solid var(--brand-primary)' : '1px solid transparent',
                backgroundColor: selectedConceptId === concept.id ? 'var(--bg-surface-subdued)' : 'transparent',
                color: selectedConceptId === concept.id ? 'var(--brand-primary)' : 'var(--text-primary)',
                fontWeight: selectedConceptId === concept.id ? 800 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                transition: 'all 0.12s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{concept.title}</span>
                {selectedConceptId === concept.id && <Check size={14} />}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {concept.category}
              </span>
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Concept Overview Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div>
                <span
                  style={{
                    backgroundColor: 'var(--bg-surface-subdued)',
                    color: 'var(--brand-primary)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {currentConcept.category}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '8px 0 6px', color: 'var(--text-primary)' }}>
                  {currentConcept.title}
                </h2>
                <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {currentConcept.summary}
                </p>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface-subdued)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--brand-primary)',
                  }}
                >
                  <strong>Computational Mental Model:</strong> {currentConcept.computationalModel}
                </div>
              </div>

              {viewMode === 'side-by-side' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Compare Alongside:
                  </label>
                  <select
                    value={compareLanguage}
                    onChange={(e) => setCompareLanguage(e.target.value as SupportedLanguage)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    {languageOptions
                      .filter((o) => o.id !== electedLanguage)
                      .map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Execution Output Panel (if code was run) */}
          {runResult && (
            <div
              style={{
                backgroundColor: 'var(--editor-bg, #0B1120)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                color: '#E2E8F0',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: runResult.hasErrors ? '#EF4444' : '#10B981' }}>
                  {runResult.hasErrors ? '● Execution Error' : '● Process Execution Verified'} ({runResult.executionTimeMs}ms)
                </span>
                <button
                  type="button"
                  onClick={() => setRunResult(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Clear Output
                </button>
              </div>
              {runResult.stdout.map((line, idx) => (
                <div key={idx} style={{ color: '#F8FAFC' }}>
                  {line}
                </div>
              ))}
              {runResult.stderr.map((line, idx) => (
                <div key={idx} style={{ color: '#F87171' }}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Comparison Views */}
          {viewMode === 'side-by-side' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px',
              }}
            >
              {renderCodeCard(currentConcept.languages[electedLanguage], true)}
              {renderCodeCard(currentConcept.languages[compareLanguage], false)}
            </div>
          ) : (
            /* Comprehensive Comparison Matrix Table */
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                overflowX: 'auto',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Cross-Language Dimensional Analysis for {currentConcept.title}
              </h3>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--text-secondary)' }}>Dimension</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>Python</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>JavaScript</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>TypeScript</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>C++</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>Java</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: 'var(--brand-primary)' }}>C</th>
                  </tr>
                </thead>
                <tbody>
                  {currentConcept.comparisonMatrix.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-surface-subdued)',
                      }}
                    >
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>{row.dimension}</td>
                      <td style={{ padding: '12px 10px' }}>{row.python}</td>
                      <td style={{ padding: '12px 10px' }}>{row.javascript}</td>
                      <td style={{ padding: '12px 10px' }}>{row.typescript}</td>
                      <td style={{ padding: '12px 10px' }}>{row.cpp}</td>
                      <td style={{ padding: '12px 10px' }}>{row.java}</td>
                      <td style={{ padding: '12px 10px' }}>{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
