import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  X,
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
  executeTypeScriptCode,
  executeCppCode,
  executeJavaCode,
  executeSqlCode,
  ExecutionResult,
} from '../utils/codeSandboxRunner';
import { CodingConceptsExplorer } from './CodingConceptsExplorer';

interface MultiLanguageCodeSandboxProps {
  initialLanguage?: SupportedLanguage;
  initialCode?: string;
  onRunSuccess?: (result: ExecutionResult) => void;
}

export const MultiLanguageCodeSandbox: React.FC<MultiLanguageCodeSandboxProps> = ({
  initialLanguage = 'python',
  initialCode: propInitialCode,
  onRunSuccess,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('py-basics');
  const [showConceptModal, setShowConceptModal] = useState<boolean>(false);

  // Filter templates for current language
  const availableTemplates = STARTER_TEMPLATES.filter((t) => t.language === language);

  const initialCode =
    propInitialCode ||
    availableTemplates.find((t) => t.id === selectedTemplateId)?.code ||
    availableTemplates[0]?.code ||
    'print("Hello from Geniusphere!")';

  const [code, setCode] = useState<string>(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // When language changes, update template and code if no explicit propInitialCode
  useEffect(() => {
    if (!propInitialCode) {
      const defaultTpl = STARTER_TEMPLATES.find((t) => t.language === language);
      if (defaultTpl) {
        setSelectedTemplateId(defaultTpl.id);
        setCode(defaultTpl.code);
        setResult(null);
      }
    }
  }, [language, propInitialCode]);

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

    setTimeout(() => {
      let res: ExecutionResult;
      switch (language) {
        case 'python':
          res = executePythonCode(code);
          break;
        case 'c':
          res = executeCCode(code);
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
        case 'sql':
          res = executeSqlCode(code);
          break;
        default:
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

  const getFileExtension = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'python':
        return 'main.py';
      case 'c':
        return 'main.c';
      case 'javascript':
        return 'index.js';
      case 'typescript':
        return 'index.ts';
      case 'cpp':
        return 'main.cpp';
      case 'java':
        return 'Main.java';
      case 'sql':
        return 'query.sql';
      default:
        return 'script.txt';
    }
  };

  const getMascotMessage = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'python':
        return 'Python v3.12 active! Try testing loops and functions!';
      case 'c':
        return 'C Language environment ready! Test pointers and memory bounds!';
      case 'javascript':
        return 'Modern ES6+ engine active! Test async, closures, and array methods!';
      case 'typescript':
        return 'TypeScript 5.x active! Test interfaces and compile-time type verification!';
      case 'cpp':
        return 'C++20 environment ready! Test std::cout, vectors, and memory safety!';
      case 'java':
        return 'Java 21 OpenJDK ready! Test classes and OOP principles!';
      case 'sql':
        return 'Relational SQL active! Run live queries against Geniusphere student DB!';
      default:
        return 'Coding environment active!';
    }
  };

  const languagesList: Array<{ id: SupportedLanguage; label: string; icon: string }> = [
    { id: 'python', label: 'Python 3.12', icon: '🐍' },
    { id: 'javascript', label: 'JavaScript', icon: '🟨' },
    { id: 'typescript', label: 'TypeScript', icon: '🔷' },
    { id: 'cpp', label: 'C++ (C++20)', icon: '⚡' },
    { id: 'java', label: 'Java 21', icon: '☕' },
    { id: 'c', label: 'C Language', icon: '⚙️' },
    { id: 'sql', label: 'Relational SQL', icon: '🗄️' },
  ];

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
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <MascotSphere
            pose="coding"
            size={52}
            speechBubble={getMascotMessage(language)}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Multi-Language Coding Sandbox
              </h2>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--brand-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                In-Browser Engine
              </span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
              Write, compile, and execute real <strong>Python</strong>, <strong>JavaScript</strong>, <strong>TypeScript</strong>, <strong>C++</strong>, <strong>Java</strong>, <strong>C</strong>, and <strong>SQL</strong> code.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Compare Concepts Across Languages Button */}
          <button
            type="button"
            onClick={() => setShowConceptModal(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1px solid var(--brand-primary)',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--brand-primary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={14} />
            <span>Compare Coding Concepts</span>
          </button>

          {/* Language Tabs Selector */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-surface-subdued)',
              border: '1px solid var(--border-subtle)',
              padding: '4px',
              borderRadius: '100px',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            {languagesList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: language === item.id ? 'var(--brand-primary)' : 'transparent',
                  color: language === item.id ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Preset Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '10px 16px',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
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
              backgroundColor: selectedTemplateId === tpl.id ? 'var(--bg-surface-subdued)' : 'var(--bg-surface)',
              border: selectedTemplateId === tpl.id ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
              color: selectedTemplateId === tpl.id ? 'var(--brand-primary)' : 'var(--text-primary)',
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
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Editor Header Toolbar */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-subdued)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '10px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {getFileExtension(language)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>• UTF-8</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Copy code to clipboard"
              >
                {copied ? <Check size={12} color="var(--brand-primary)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
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
          <div style={{ flex: 1, minHeight: '360px', backgroundColor: 'var(--editor-bg, #0B1120)' }}>
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
              backgroundColor: 'var(--bg-surface-subdued)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>⌘+Enter</kbd> to run
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
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
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
            backgroundColor: 'var(--editor-bg, #0B1120)',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {/* Terminal Title Bar */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle)',
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
                  color: 'var(--text-secondary)',
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
              <div style={{ color: 'var(--text-secondary)', paddingTop: '40px', textAlign: 'center' }}>
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
                      : language === 'typescript'
                      ? 'TypeScript Compiler & Engine'
                      : language === 'cpp'
                      ? 'Clang++ C++20 Runtime'
                      : language === 'java'
                      ? 'OpenJDK Java 21 VM'
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
                        : line.startsWith('[SECURITY') || line.startsWith('✓') || line.startsWith('[TS-COMPILER]') || line.startsWith('[CLANG++') || line.startsWith('[JAVAC')
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
                    borderTop: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
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

      {/* Modal for Comparing Coding Concepts */}
      {showConceptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '20px',
              maxWidth: '1240px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setShowConceptModal(false)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <CodingConceptsExplorer
              initialLanguage={language}
              onLanguageChange={(newLang) => setLanguage(newLang)}
              onOpenSandboxWithCode={(newCode, newLang) => {
                setLanguage(newLang);
                setCode(newCode);
                setShowConceptModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
