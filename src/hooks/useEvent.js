import { useEffect, useCallback } from 'react';
import { eventEmitter, Events } from '../lib/eventEmitter';
import { useError } from './useError';

export function useEvent() {
  const { handleError } = useError();

  const subscribe = useCallback((event, callback) => {
    const wrappedCallback = (data) => {
      try {
        callback(data);
      } catch (error) {
        handleError(error, {
          context: { event, data }
        });
      }
    };

    return eventEmitter.on(event, wrappedCallback);
  }, [handleError]);

  const emit = useCallback((event, data) => {
    eventEmitter.emit(event, data);
  }, []);

  // Cleanup subscriptions when component unmounts
  useEffect(() => {
    return () => {
      // Optional: Clear specific events if needed
    };
  }, []);

  return {
    subscribe,
    emit,
    Events
  };
}