import axios from 'axios';
import { errorTracking } from './errorTracking';
import { API_CONFIG } from './constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Don't override if Authorization is already set
    if (config.headers.Authorization) {
      return config;
    }
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.warn('No user found in localStorage');
      return config;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user?.token) {
        console.warn('No token found in user data');
        return config;
      }
      config.headers.Authorization = `Bearer ${user.token}`;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return config;
  },
  (error) => {
    errorTracking.logError({
      error,
      category: 'API',
      context: { type: 'request' }
    });
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    errorTracking.logError({
      error,
      category: 'API',
      context: { type: 'response' }
    });
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: (credentials) => api.post('/users/authenticate', credentials),
  
  // Expenses
  fetchExpenses: (userId) => api.get('/expenses/user', { params: { userId } }),
  createExpense: (data) => api.post('/expenses/', data),
  updateExpense: (id, userId, data) => api.put(`/expenses/${id}?userId=${userId}`, {
    userId: data.userId,
    category: data.category,
    amount: data.amount,
    description: data.description,
    receipt: data.receipt
  }),
  deleteExpense: (id, userId) => api.delete(`/expenses/${id}?userId=${userId}`),
  approveExpense: (id, userId, managerId, data) => api.put(`/expenses/${id}/user/${userId}/manager/${managerId}/approve`, data),
  rejectExpense: (id, userId, managerId, data) => api.put(`/expenses/${id}/user/${userId}/manager/${managerId}/reject`, data),
  
  // Users
  fetchUsers: () => api.get('/users/'),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/users/toggle-status/${id}`),
  
  // Notifications
  fetchNotifications: (userId) => api.get(`/notifications/user/${userId}`),
  createNotification: (data) => api.post('/notifications/', data),
  markNotificationsAsRead: (userId) => api.put(`/notifications/user/${userId}/mark-read`),
  
  // File uploads
  uploadReceipt: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const fetchExpensesForReportee = async (reporteeWissenId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/user?userId=${reporteeWissenId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};