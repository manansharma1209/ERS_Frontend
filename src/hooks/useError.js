import { useEffect } from 'react';
import { errorTracking } from '../lib/errorTracking';

export function useError() {
  useEffect(() => {
    // Initialize error tracking on component mount
    errorTracking.init();
    return () => errorTracking.cleanup();
  }, []);

  const handleError = (error, metadata = {}) => {
    // Log error with additional metadata
    errorTracking.logError({
      error,
      timestamp: new Date().toISOString(),
      ...metadata
    });

    // Return formatted error message for UI display
    return {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.status || 'UNKNOWN',
      source: metadata.category || 'Application'
    };
  };

  const clearErrors = () => {
    errorTracking.clearErrors();
  };

  return {
    handleError,
    clearErrors
  };
}