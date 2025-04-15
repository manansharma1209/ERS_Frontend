import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const { user } = useAuth();
  const BASE_URL = 'http://localhost:8080/api';

  // Expense related API calls
  const fetchUserExpenses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/expenses/user?userId=${user.wissenID}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  };

  const fetchApprovalRequests = async () => {
    if (!user.isManager) return [];
    
    try {
      const approveRequestsPromises = user.reportees.map(reporteeWissenId =>
        axios.get(`${BASE_URL}/expenses/user?userId=${reporteeWissenId}`)
      );
      const responses = await Promise.all(approveRequestsPromises);
      return responses.flatMap(response => response.data);
    } catch (error) {
      console.error('Error fetching approve requests:', error);
      return [];
    }
  };

  const submitExpense = async (formData) => {
    // Upload receipt file
    const receiptUrl = await uploadFile(formData.receipt);

    const expenseData = {
      userId: user.wissenID,
      category: formData.category.toUpperCase(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      receipt: receiptUrl,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/expenses/`,
        expenseData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting expense:", error);
      throw error;
    }
  };

  const updateExpense = async (id, formData) => {
    let receiptUrl = formData.existingReceipt;

    if (formData.receipt instanceof File) {
      receiptUrl = await uploadFile(formData.receipt);
    }

    const expenseUpdateData = {
      category: formData.category.toUpperCase(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      receipt: receiptUrl,
      status: 'PENDING',
      wissenID: user.wissenID
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/expenses/${id}?userId=${user.wissenID}`,
        expenseUpdateData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/expenses/${id}`, {
        params: { userId: user.wissenID }
      });
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  const approveExpense = async (id, targetExpense) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/expenses/${id}/status/approve?userId=${targetExpense.wissenID}&status=APPROVED&approvedBy=${user.wissenID}`
      );
      
      if (response.status === 200) {
        const today = new Date().toLocaleDateString();
        await createNotification({
          message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been approved. On ${today}`,
          status: 'APPROVED',
          userId: targetExpense.user.wissenID,
          managerId: user.wissenID,
          expenseId: id
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      throw error;
    }
  };

  const rejectExpense = async (id, reason, targetExpense) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/expenses/${id}/status/reject?userId=${targetExpense.wissenID}&status=REJECTED&reason=${reason}&rejectedBy=${user.wissenID}`
      );

      if (response.status === 200) {
        const today = new Date().toLocaleDateString();
        await createNotification({
          message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been rejected. Due to ${reason}. By ${user.name}. On ${today}`,
          status: 'REJECTED',
          userId: targetExpense.user.wissenID,
          managerId: user.wissenID,
          expenseId: id
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
      throw error;
    }
  };

  // Notification related API calls
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/notifications/user/${user.wissenID}`
      );
      return response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  const createNotification = async (notificationData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/notifications/`,
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  };

  // File upload helper
  const uploadFile = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${BASE_URL}/upload/pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  // Auth related API calls
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const api = {
    auth: {
      login: loginUser
    },
    expenses: {
      fetch: fetchUserExpenses,
      fetchApprovalRequests,
      submit: submitExpense,
      update: updateExpense,
      delete: deleteExpense,
      approve: approveExpense,
      reject: rejectExpense,
    },
    notifications: {
      fetch: fetchNotifications,
      create: createNotification,
    },
    upload: uploadFile,
  };

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
