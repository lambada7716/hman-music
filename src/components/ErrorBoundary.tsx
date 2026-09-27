import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#070714] text-white flex items-center justify-center p-6 select-text">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#0f1026] border border-rose-500/30 shadow-[0_20px_50px_rgba(225,29,72,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-5 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">
              Terjadi Kesalahan pada Aplikasi
            </h1>
            <p className="text-sm text-slate-300 mb-4">
              Komponen mengalami kegagalan saat proses render. Detail error ditampilkan di bawah ini (setara dengan mode debug aktif):
            </p>

            {this.state.error && (
              <div className="mb-4 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-rose-300 overflow-x-auto">
                <p className="font-bold mb-1">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[11px] text-slate-400 whitespace-pre-wrap mt-2 max-h-48 overflow-y-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/20 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-medium text-xs transition"
              >
                Coba Render Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
