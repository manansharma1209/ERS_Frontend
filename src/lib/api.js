import axios from 'axios';
import { errorTracking } from './errorTracking';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      return config;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
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
  fetchExpenses: (userId) => api.get(`/expenses/${userId}`),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  approveExpense: (id, data) => api.put(`/expenses/${id}/approve`, data),
  rejectExpense: (id, data) => api.put(`/expenses/${id}/reject`, data),
  
  // Users
  fetchUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
  
  // Notifications
  fetchNotifications: (userId) => api.get(`/notifications/${userId}`),
  createNotification: (data) => api.post('/notifications', data),
  markNotificationsAsRead: (userId) => api.put(`/notifications/${userId}/mark-read`),
  
  // File uploads
  uploadReceipt: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uploads/receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};