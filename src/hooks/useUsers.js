import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useUsers() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.fetchUsers();
      setUsers(response.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await apiService.createUser(userData, auth.token);
      // setUsers(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response.data.message);
      return { success: false, error: err.response.data.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await apiService.updateUser(userId, userData, auth.token);
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
      await apiService.toggleUserStatus(userId, active, auth.token);
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
      const response = await apiService.fetchReporteeInfo(reporteeWissenId, auth.token);
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