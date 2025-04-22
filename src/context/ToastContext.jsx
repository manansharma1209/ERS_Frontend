import { createContext, useContext } from 'react';
import { ToastContainer } from '../Components/ui/ToastContainer';
import { useToast } from '../hooks/useToast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const { toasts, showToast, hideToast, clearToasts } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}