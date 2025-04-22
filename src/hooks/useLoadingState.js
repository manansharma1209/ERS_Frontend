import { useState, useCallback } from 'react';

export function useLoadingState(initialState = {}) {
  const [loadingStates, setLoadingStates] = useState(initialState);

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const withLoading = useCallback(async (key, asyncFn) => {
    setLoading(key, true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    withLoading,
    isLoading,
    isAnyLoading
  };
}