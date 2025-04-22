import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useUsers() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchUsers(auth.token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await api.createUser(userData, auth.token);
      setUsers(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await api.updateUser(userId, userData, auth.token);
      setUsers(prev => prev.map(user => 
        user.wissenID === userId ? response.data : user
      ));
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const toggleUserStatus = async (userId, active) => {
    try {
      await api.toggleUserStatus(userId, active, auth.token);
      setUsers(prev => prev.map(user => 
        user.wissenID === userId ? { ...user, active } : user
      ));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const fetchReporteeInfo = async (reporteeWissenId) => {
    try {
      const response = await api.fetchReporteeInfo(reporteeWissenId, auth.token);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchUsers();
    }
  }, [auth?.token]);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    toggleUserStatus,
    fetchReporteeInfo,
    refreshUsers: fetchUsers
  };
}