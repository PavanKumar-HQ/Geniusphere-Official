import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  labName?: string;
  onClose?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class LabErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred while running this lab module.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('LabErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-slate-950/95 border border-red-500/30 rounded-2xl shadow-2xl backdrop-blur-md"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            Lab Encountered an Issue
          </h3>

          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            {this.props.labName ? `The module "${this.props.labName}"` : 'This interactive lab'} encountered an unexpected runtime error and halted safely to prevent session corruption.
          </p>

          <div className="p-3 mb-6 bg-red-950/40 border border-red-900/50 rounded-lg text-xs font-mono text-red-300 max-w-lg overflow-x-auto text-left">
            <code>{this.state.errorMessage}</code>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Lab
            </button>

            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Course
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
