import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 bg-card rounded-2xl border border-border p-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <p className="text-red-400 text-sm text-center">
            Something went wrong rendering this section.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer"
          >
            RETRY
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
