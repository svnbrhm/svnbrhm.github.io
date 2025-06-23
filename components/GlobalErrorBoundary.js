import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Global error caught:', error, errorInfo);
    
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

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="global-error-container">
          <div className="global-error-content">
            <h1>Something went wrong</h1>
            <p>We're sorry, but something went wrong with this page.</p>
            <div className="error-actions">
              <button onClick={this.handleReload} className="primary-button">
                Reload Page
              </button>
              <button onClick={this.handleGoHome} className="secondary-button">
                Go to Homepage
              </button>
            </div>
            {process.env.NODE_ENV !== 'production' && (
              <div className="error-details">
                <p>{this.state.error?.toString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;