import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log to an error reporting service here
    if (this.props.onError) {
      try { this.props.onError(error, errorInfo); } catch {}
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{this.state.error?.message || 'Unknown error'}</p>
          <button className="px-4 py-2 bg-black text-white rounded-md" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
