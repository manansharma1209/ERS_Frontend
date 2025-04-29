import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.fetchNotifications(auth.wissenID);
      // Sort notifications by date in descending order (newest first)
      const sortedNotifications = (response.data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'fetchNotifications' }
      });
      setError(errorMessage);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await apiService.markNotificationsAsRead(auth.wissenID);
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'markNotificationsAsRead' }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const createNotification = async (data) => {
    try {
      const response = await apiService.createNotification({
        ...data,
      });
      // setNotifications(prev => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'createNotification', data }
      });
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    if (auth?.wissenID) {
      fetchNotifications();
    }
  }, [auth?.wissenID]);

  return {
    notifications,
    isLoading,
    error,
    addNotification: createNotification,
    refreshNotifications: fetchNotifications,
    markAsRead
  };
}