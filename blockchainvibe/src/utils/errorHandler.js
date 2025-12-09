/**
 * Centralized error handling utilities
 */

/**
 * Get user-friendly error message from error object
 * @param {Error|Object} error - Error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle axios errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is currently unavailable. Please try again later.';
      default:
        return data?.message || `An error occurred (${status}). Please try again.`;
    }
  }

  // Handle network errors
  if (error.request) {
    if (!navigator.onLine) {
      return 'You are currently offline. Please check your internet connection.';
    }
    return 'Network error. Please check your connection and try again.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Handle generic errors
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error to console (and optionally to error tracking service)
 * @param {Error|Object} error - Error object
 * @param {Object} context - Additional context information
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // TODO: Send to error tracking service (e.g., Sentry)
  // Example:
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: { custom: context },
  //   });
  // }
};

/**
 * Handle API error with user notification
 * @param {Error|Object} error - Error object
 * @param {Function} showToast - Toast notification function (e.g., from react-hot-toast)
 * @param {Object} options - Additional options
 */
export const handleApiError = (error, showToast, options = {}) => {
  const {
    silent = false,
    customMessage = null,
    onError = null,
  } = options;

  // Log error
  logError(error, { customMessage, silent });

  // Call custom error handler if provided
  if (onError) {
    onError(error);
  }

  // Show user-friendly message
  if (!silent && showToast) {
    const message = customMessage || getErrorMessage(error);
    showToast(message, {
      icon: '❌',
      duration: 5000,
    });
  }

  return getErrorMessage(error);
};

/**
 * Check if error is retryable
 * @param {Error|Object} error - Error object
 * @returns {boolean} Whether the error is retryable
 */
export const isRetryableError = (error) => {
  // Network errors are retryable
  if (!error.response && error.request) {
    return true;
  }

  // 5xx errors are retryable
  if (error.response?.status >= 500 && error.response?.status < 600) {
    return true;
  }

  // Timeout errors are retryable
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }

  // 429 (Too Many Requests) is retryable after delay
  if (error.response?.status === 429) {
    return true;
  }

  return false;
};

/**
 * Get retry delay based on error and attempt count
 * @param {Error|Object} error - Error object
 * @param {number} attemptCount - Current attempt count
 * @returns {number} Delay in milliseconds
 */
export const getRetryDelay = (error, attemptCount) => {
  // Exponential backoff with jitter
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const exponentialDelay = baseDelay * Math.pow(2, attemptCount);
  const jitter = Math.random() * 1000; // Random jitter up to 1 second
  const delay = Math.min(exponentialDelay + jitter, maxDelay);

  // For 429 errors, use Retry-After header if available
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    if (retryAfter) {
      return parseInt(retryAfter) * 1000;
    }
  }

  return delay;
};

/**
 * Create error boundary error object
 * @param {Error} error - Original error
 * @param {Object} errorInfo - React error info
 * @returns {Object} Formatted error object
 */
export const formatErrorBoundaryError = (error, errorInfo) => {
  return {
    error: {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
    },
    errorInfo: {
      componentStack: errorInfo?.componentStack,
    },
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
};

