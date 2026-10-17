import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { sql } from '@codemirror/lang-sql';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  minHeight = '160px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        sql(),
        EditorView.theme({
          '&': {
            minHeight,
            fontSize: '14px',
            borderRadius: '8px',
            backgroundColor: '#F8FAFC',
            color: '#172B4D',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: 'var(--font-mono)',
          },
          '.cm-content': {
            caretColor: 'var(--brand-primary)',
            padding: '12px 14px',
          },
          '&.cm-focused .cm-cursor': {
            borderLeftColor: 'var(--brand-primary)',
          },
          '&.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: '#EFF6FF',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
          '.cm-gutters': {
            backgroundColor: '#F8FAFC',
            color: '#94A3B8',
            borderRight: '1px solid #E2E8F0',
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        }),
        EditorState.readOnly.of(readOnly),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []); // Mount once

  // Sync external value changes if not matching current editor text
  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (value !== currentDoc) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        width: '100%',
        minHeight,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--editor-bg)',
      }}
      aria-label="SQL Code Editor"
      role="region"
    />
  );
};
