import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';

export function useNotificationService() {
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async (userId) => {
    setIsLoading(true);
    try {
      const data = await api.notifications.fetch(userId);
      setNotifications(data);
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      const newNotification = await api.notifications.create(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  };

  return {
    notifications,
    isLoading,
    fetchNotifications,
    createNotification
  };
}
