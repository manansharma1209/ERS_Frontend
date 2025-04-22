// Error severity levels
const Severity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Error categories for better organization
const Category = {
  API: 'api',
  AUTH: 'auth',
  VALIDATION: 'validation',
  UI: 'ui',
  NETWORK: 'network'
};

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.errorListeners = new Set();
  }

  track(error, {
    severity = Severity.ERROR,
    category = Category.UI,
    context = {}
  } = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity,
      category,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    this.errors.push(errorInfo);
    this.notifyListeners(errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracker]', errorInfo);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  addListener(callback) {
    this.errorListeners.add(callback);
    return () => this.errorListeners.delete(callback);
  }

  notifyListeners(errorInfo) {
    this.errorListeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

// Error tracking service
class ErrorTrackingService {
  constructor() {
    this.errors = [];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError({
        error,
        category: 'Global',
        context: { message, source, lineno, colno }
      });
    };

    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      this.logError({
        error: event.reason,
        category: 'UnhandledPromise',
        context: { event }
      });
    };

    this.isInitialized = true;
  }

  cleanup() {
    window.onerror = null;
    window.onunhandledrejection = null;
    this.isInitialized = false;
    this.errors = [];
  }

  logError(errorData) {
    const formattedError = {
      ...errorData,
      timestamp: errorData.timestamp || new Date().toISOString()
    };

    // Add to local error store
    this.errors.push(formattedError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Tracking]', formattedError);
    }

    // Here you could send errors to your error tracking service
    // e.g., Sentry, LogRocket, etc.
    this.sendToErrorService(formattedError);
  }

  sendToErrorService(errorData) {
    // TODO: Implement integration with error tracking service
    // This is where you would send errors to your preferred service
    // Example:
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(errorData.error, {
    //     extra: errorData
    //   });
    // }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorTracker = new ErrorTracker();
export const errorTracking = new ErrorTrackingService();
export { Severity, Category };