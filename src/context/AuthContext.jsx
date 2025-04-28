import { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired, getTokenExpirationTime } from '../lib/utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenExpiration = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData?.token && isTokenExpired(userData.token)) {
        // Token is expired, log out user
        updateAuth(null);
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    // Initialize auth state from localStorage and check token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData?.token && !isTokenExpired(userData.token)) {
        setAuth(userData);
        // Set up expiration timer
        const expirationTime = getTokenExpirationTime(userData.token);
        if (expirationTime) {
          const timeUntilExpiry = expirationTime - Date.now();
          setTimeout(() => {
            updateAuth(null);
            window.location.href = '/login';
          }, timeUntilExpiry);
        }
      } else {
        // Token is expired or invalid, remove it
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Check token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Update both context and localStorage
  const updateAuth = (userData) => {
    if (userData) {
      // Only store if token is valid
      if (userData.token && !isTokenExpired(userData.token)) {
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth(userData);
      } else {
        localStorage.removeItem('user');
        setAuth(null);
      }
    } else {
      localStorage.removeItem('user');
      setAuth(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};