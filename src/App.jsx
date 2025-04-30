import { useEffect } from 'react';
import { disableRightClick, disableDevTools } from './lib/security';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './Components/ErrorBoundary';

function App() {
  useEffect(() => {
    // Disable right-click and developer tools
    document.addEventListener('contextmenu', disableRightClick);
    disableDevTools();

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;