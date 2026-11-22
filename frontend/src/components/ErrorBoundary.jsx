import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KRPS Portal Runtime Boundary Caught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">KRPS Portal View Notice</h1>
          <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
            An unexpected client rendering notice occurred. You can restore the default session safely using the buttons below.
          </p>
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-left max-w-lg w-full mb-6 text-xs font-mono text-red-300 overflow-x-auto">
            {this.state.error?.toString()}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
            <button
              onClick={this.handleReset}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Reset Cache & Return</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
