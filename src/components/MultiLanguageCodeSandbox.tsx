import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
  Code2,
  Cpu,
  Database,
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { MascotSphere } from './MascotSphere';
import { GeniusphereLoader } from './GeniusphereLoader';
import {
  SupportedLanguage,
  STARTER_TEMPLATES,
  executePythonCode,
  executeCCode,
  executeJavaScriptCode,
  executeSqlCode,
  ExecutionResult,
} from '../utils/codeSandboxRunner';

interface MultiLanguageCodeSandboxProps {
  initialLanguage?: SupportedLanguage;
  onRunSuccess?: (result: ExecutionResult) => void;
}

export const MultiLanguageCodeSandbox: React.FC<MultiLanguageCodeSandboxProps> = ({
  initialLanguage = 'python',
  onRunSuccess,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('py-basics');

  // Filter templates for current language
  const availableTemplates = STARTER_TEMPLATES.filter((t) => t.language === language);

  const initialCode =
    availableTemplates.find((t) => t.id === selectedTemplateId)?.code ||
    availableTemplates[0]?.code ||
    'print("Hello from Geniusphere!")';

  const [code, setCode] = useState<string>(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // When language changes, update template and code
  useEffect(() => {
    const defaultTpl = STARTER_TEMPLATES.find((t) => t.language === language);
    if (defaultTpl) {
      setSelectedTemplateId(defaultTpl.id);
      setCode(defaultTpl.code);
      setResult(null);
    }
  }, [language]);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = STARTER_TEMPLATES.find((t) => t.id === id);
    if (tpl) {
      setCode(tpl.code);
      setResult(null);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setResult(null);

    // Simulate realistic execution tick for visual feedback
    setTimeout(() => {
      let res: ExecutionResult;
      if (language === 'python') {
        res = executePythonCode(code);
      } else if (language === 'c') {
        res = executeCCode(code);
      } else if (language === 'javascript') {
        res = executeJavaScriptCode(code);
      } else if (language === 'sql') {
        res = executeSqlCode(code);
      } else {
        res = executePythonCode(code);
      }

      setResult(res);
      setIsRunning(false);
      if (onRunSuccess) onRunSuccess(res);
    }, 280);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const tpl = STARTER_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (tpl) setCode(tpl.code);
    setResult(null);
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Sandbox Header Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '18px 24px',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <MascotSphere
            pose="coding"
            size={52}
            speechBubble={
              language === 'python'
                ? 'Python v3.12 active! Try testing loops and functions!'
                : language === 'c'
                ? 'C Language environment ready! Test pointers and memory bounds!'
                : language === 'javascript'
                ? 'Modern ES6+ engine active! Test async, closures, and array methods!'
                : 'Relational SQL active! Run live queries against Geniusphere student DB!'
            }
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#26352A' }}>
                Multi-Language Coding Sandbox
              </h2>
              <span
                style={{
                  backgroundColor: '#E5F0DF',
                  color: '#26352A',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                }}
              >
                In-Browser Engine
              </span>
            </div>
            <p style={{ margin: 0, color: '#6A7D70', fontSize: '0.86rem' }}>
              Write, compile, and execute real <strong>Python</strong>, <strong>C</strong>, <strong>JavaScript</strong>, and <strong>SQL</strong> code with live stdout terminal feedback.
            </p>
          </div>
        </div>

        {/* Language Tabs Selector */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#FAFAF4',
            border: '1.5px solid #E5F0DF',
            padding: '4px',
            borderRadius: '100px',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => setLanguage('python')}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: language === 'python' ? '#43A85B' : 'transparent',
              color: language === 'python' ? '#FFFFFF' : '#26352A',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: language === 'python' ? '0 2px 6px rgba(67, 168, 91, 0.25)' : 'none',
            }}
          >
            <Code2 size={15} />
            <span>Python 3.12</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('c')}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: language === 'c' ? '#43A85B' : 'transparent',
              color: language === 'c' ? '#FFFFFF' : '#26352A',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: language === 'c' ? '0 2px 6px rgba(67, 168, 91, 0.25)' : 'none',
            }}
          >
            <Cpu size={15} />
            <span>C Language</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('javascript')}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: language === 'javascript' ? '#43A85B' : 'transparent',
              color: language === 'javascript' ? '#FFFFFF' : '#26352A',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: language === 'javascript' ? '0 2px 6px rgba(67, 168, 91, 0.25)' : 'none',
            }}
          >
            <FileCode size={15} />
            <span>JavaScript</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('sql')}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: language === 'sql' ? '#43A85B' : 'transparent',
              color: language === 'sql' ? '#FFFFFF' : '#26352A',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: language === 'sql' ? '0 2px 6px rgba(67, 168, 91, 0.25)' : 'none',
            }}
          >
            <Database size={15} />
            <span>Relational SQL</span>
          </button>
        </div>
      </div>

      {/* Template Preset Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5F0DF',
          borderRadius: '12px',
          padding: '10px 16px',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6A7D70', textTransform: 'uppercase' }}>
          Starter Programs:
        </span>
        {availableTemplates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => handleSelectTemplate(tpl.id)}
            style={{
              padding: '5px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: selectedTemplateId === tpl.id ? 800 : 600,
              backgroundColor: selectedTemplateId === tpl.id ? '#E5F0DF' : '#FAFAF4',
              border: selectedTemplateId === tpl.id ? '1.5px solid #43A85B' : '1px solid #E5F0DF',
              color: '#26352A',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tpl.title}
          </button>
        ))}
      </div>

      {/* Main Sandbox Grid (Editor Left / Terminal Output Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: Code Editor */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            border: '1.5px solid #E5F0DF',
            borderRadius: '16px',
          }}
        >
          {/* Editor Header Toolbar */}
          <div
            style={{
              backgroundColor: '#FAFAF4',
              borderBottom: '1px solid #E5F0DF',
              padding: '10px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={16} color="#43A85B" />
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#26352A' }}>
                {language === 'python' ? 'main.py' : 'main.c'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6A7D70' }}>• UTF-8</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  background: 'none',
                  border: '1px solid #E5F0DF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#26352A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Copy code to clipboard"
              >
                {copied ? <Check size={12} color="#43A85B" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: '1px solid #E5F0DF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#26352A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Reset to template"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* CodeMirror Editor Area */}
          <div style={{ flex: 1, minHeight: '360px', backgroundColor: '#FFFFFF' }}>
            <CodeEditor
              value={code}
              onChange={(newVal) => setCode(newVal)}
              minHeight="360px"
            />
          </div>

          {/* Editor Action Footer */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#FAFAF4',
              borderTop: '1px solid #E5F0DF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#6A7D70' }}>
              Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid #D2DEC9', backgroundColor: '#FFFFFF' }}>⌘+Enter</kbd> to run
            </span>

            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary"
              style={{
                padding: '0 24px',
                height: '42px',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(67, 168, 91, 0.25)',
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>{isRunning ? 'Compiling & Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Execution Terminal & Output */}
        <div
          style={{
            backgroundColor: '#1E2B22',
            borderRadius: '16px',
            border: '1.5px solid #2B3D30',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {/* Terminal Title Bar */}
          <div
            style={{
              backgroundColor: '#16221A',
              padding: '12px 18px',
              borderBottom: '1px solid #2B3D30',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span
                style={{
                  color: '#D5DDD2',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  marginLeft: '8px',
                }}
              >
                bash - geniusphere-runtime ({language})
              </span>
            </div>

            {result && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: result.hasErrors ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: result.hasErrors ? '#F87171' : '#34D399',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Exit: {result.exitCode}
                </span>

                <span
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {result.executionTimeMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Terminal Screen Output Area */}
          <div
            style={{
              flex: 1,
              padding: '18px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.86rem',
              color: '#F0FDF4',
              lineHeight: 1.55,
              overflowY: 'auto',
              minHeight: '340px',
            }}
          >
            {!result && !isRunning && (
              <div style={{ color: '#6A7D70', paddingTop: '40px', textAlign: 'center' }}>
                <Terminal size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>Terminal is ready.</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
                  Click <strong>Run Code</strong> or press <strong>⌘+Enter</strong> to compile and execute.
                </p>
              </div>
            )}

            {isRunning && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                }}
              >
                <GeniusphereLoader
                  size="sm"
                  theme="dark"
                  message={`Executing ${
                    language === 'python'
                      ? 'Python 3.12 Bytecode'
                      : language === 'c'
                      ? 'C Native Runtime'
                      : language === 'javascript'
                      ? 'JavaScript ES6+ Engine'
                      : 'Relational SQL Query'
                  }...`}
                  submessage="Isolated sandbox with memory guards & safety execution limits"
                />
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {result.stdout.map((line, i) => (
                  <div
                    key={`out-${i}`}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      color: line.startsWith('[GUARD]')
                        ? '#F59E0B'
                        : line.startsWith('[SECURITY') || line.startsWith('✓')
                        ? '#34D399'
                        : '#F0FDF4',
                    }}
                  >
                    {line}
                  </div>
                ))}

                {result.stderr.map((errLine, j) => (
                  <div
                    key={`err-${j}`}
                    style={{
                      color: '#F87171',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      fontWeight: 600,
                    }}
                  >
                    {errLine}
                  </div>
                ))}

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '10px',
                    borderTop: '1px solid #2B3D30',
                    color: '#6A7D70',
                    fontSize: '0.74rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>[Process completed with exit code {result.exitCode}]</span>
                  <span>Memory: ~{result.memoryUsedKb} KB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
