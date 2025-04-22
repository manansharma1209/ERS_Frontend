import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchNotifications(auth.wissenID, auth.token);
      // Sort notifications by date (newest first)
      const sortedNotifications = data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      setNotifications(sortedNotifications);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = async (notification) => {
    try {
      const response = await api.createNotification(notification, auth.token);
      setNotifications(prev => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
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
    addNotification,
    refreshNotifications: fetchNotifications
  };
}