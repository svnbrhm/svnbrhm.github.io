import { useState, useCallback } from 'react';

/**
 * Custom hook for handling errors in components
 * @param {Object} options - Configuration options
 * @param {boolean} options.shouldRetry - Whether to enable automatic retry
 * @param {number} options.maxRetries - Maximum number of retry attempts
 * @param {number} options.retryDelay - Delay between retries in milliseconds
 * @param {Function} options.onError - Callback function when error occurs
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = ({
  shouldRetry = true,
  maxRetries = 3,
  retryDelay = 1000,
  onError = null,
} = {}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Report error to the API
   * @param {Error} err - The error object
   * @param {string} context - Additional context about where the error occurred
   */
  const reportError = useCallback((err, context = '') => {
    if (typeof window !== 'undefined') {
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          url: window.location.href,
          error: err.message,
          stack: err.stack,
          context,
        }),
      }).catch(console.error);
    }
  }, []);

  /**
   * Handle an error with optional retry logic
   * @param {Error} err - The error object
   * @param {Function} retryFn - Function to call when retrying
   * @param {string} context - Additional context about where the error occurred
   */
  const handleError = useCallback(
    (err, retryFn = null, context = '') => {
      setError(err);
      reportError(err, context);
      
      if (onError) {
        onError(err);
      }

      if (shouldRetry && retryFn && retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => {
          setLoading(true);
          try {
            retryFn();
          } catch (retryErr) {
            reportError(retryErr, `${context} (retry ${retryCount + 1})`);
          } finally {
            setLoading(false);
          }
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      }
    },
    [shouldRetry, maxRetries, retryCount, retryDelay, reportError, onError]
  );

  /**
   * Reset the error state and retry count
   */
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  /**
   * Wrap an async function with error handling
   * @param {Function} fn - Async function to wrap
   * @param {string} context - Context for error reporting
   * @returns {Function} Wrapped function with error handling
   */
  const withErrorHandling = useCallback(
    (fn, context = '') => {
      return async (...args) => {
        try {
          setLoading(true);
          const result = await fn(...args);
          setLoading(false);
          return result;
        } catch (err) {
          setLoading(false);
          handleError(err, () => fn(...args), context);
          throw err; // Re-throw for component error boundaries
        }
      };
    },
    [handleError]
  );

  return {
    error,
    loading,
    retryCount,
    handleError,
    clearError,
    withErrorHandling,
    reportError,
  };
};

export default useErrorHandler;