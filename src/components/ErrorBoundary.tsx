import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Home } from 'lucide-react';
import { initialDeadlines, initialProfile, initialEmailLogs } from '../data/initialData';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    if (window.confirm('Pulihkan dan bersihkan cache website ke pengaturan awal? Data tugas akan disetel ulang ke jadwal resmi Oktober 2026.')) {
      this.setState({ isRecovering: true });
      try {
        localStorage.setItem('deadlinehub_items', JSON.stringify(initialDeadlines));
        localStorage.setItem('deadlinehub_profile', JSON.stringify(initialProfile));
        localStorage.setItem('deadlinehub_email_logs', JSON.stringify(initialEmailLogs));
        localStorage.setItem('deadlinehub_auth_session', 'true');
      } catch (err) {
        console.error('Failed to reset localStorage:', err);
      }
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  handleTryRecover = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 ring-4 ring-amber-500/10">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Terjadi Kendala Teknis / Bug
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Website mendeteksi adanya gangguan sistem atau cache yang bermasalah. Jangan khawatir, Anda dapat langsung menyegarkan website atau mereset cache untuk kembali normal.
            </p>

            {/* Error Message Box */}
            <div className="mt-4 p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/80 font-mono text-xs text-rose-300 overflow-x-auto">
              <span className="font-bold text-slate-400 block mb-1">Informasi Error:</span>
              {this.state.error?.message || 'Unknown runtime error occurred.'}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                disabled={this.state.isRecovering}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${this.state.isRecovering ? 'animate-spin' : ''}`} />
                Segarkan Halaman (Refresh)
              </button>

              <button
                onClick={this.handleHardReset}
                disabled={this.state.isRecovering}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-semibold text-sm border border-slate-600 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Pulihkan & Reset Cache
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={this.handleTryRecover}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition"
              >
                <Home className="w-3.5 h-3.5" />
                Coba Buka Ulang Tanpa Reload
              </button>
              <span className="text-[11px] text-slate-500">
                DeadlineHub Mahasiswa • Pemulihan Otomatis
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
