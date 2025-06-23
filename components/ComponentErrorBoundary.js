import React from 'react';

class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Component error caught:', error, errorInfo);
    
    // Report to our error API
    if (typeof window !== 'undefined') {
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          url: window.location.href,
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        }),
      }).catch(err => {
        console.error('Failed to report error:', err);
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h3>Unable to load this section</h3>
            <p>We're sorry, but something went wrong while loading this content.</p>
            <button onClick={this.handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;