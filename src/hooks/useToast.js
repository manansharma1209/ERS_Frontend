import { useState, useCallback } from 'react';
import { TOAST_DURATION } from '../lib/constants';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = 'success', duration = TOAST_DURATION }) => {
    const id = Date.now();
    
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearToasts
  };
}