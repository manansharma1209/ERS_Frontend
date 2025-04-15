import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';

export function useExpenseService() {
  const api = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showApproveToast, setShowApproveToast] = useState(false);
  const [showRejectToast, setShowRejectToast] = useState(false);

  const submitExpense = async (formData) => {
    setIsSubmitting(true);
    try {
      const newExpense = await api.expenses.submit(formData);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return newExpense;
    } catch (error) {
      console.error("Error submitting expense:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExpense = async (id, formData, existingReceipt) => {
    setIsSubmitting(true);
    try {
      const updatedExpense = await api.expenses.update(id, {
        ...formData,
        existingReceipt
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return updatedExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.expenses.delete(id);
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  const approveExpense = async (id, targetExpense) => {
    try {
      await api.expenses.approve(id, targetExpense);
      setShowApproveToast(true);
      setTimeout(() => setShowApproveToast(false), 3000);
      return true;
    } catch (error) {
      console.error('Error approving expense:', error);
      throw error;
    }
  };

  const rejectExpense = async (id, reason, targetExpense) => {
    try {
      await api.expenses.reject(id, reason, targetExpense);
      setShowRejectToast(true);
      setTimeout(() => setShowRejectToast(false), 3000);
      return true;
    } catch (error) {
      console.error('Error rejecting expense:', error);
      throw error;
    }
  };

  const filterExpenses = (expenses, filters) => {
    return expenses.filter((expense) => {
      const statusMatch = filters.status ? expense.status === filters.status.toUpperCase() : true;
      const categoryMatch = filters.category ? expense.category === filters.category.toUpperCase() : true;
      return statusMatch && categoryMatch;
    }).sort((a, b) => {
      if (filters.dateOrder === 'Old to new') return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.dateOrder === 'New to old') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  };

  return {
    isSubmitting,
    showToast,
    showDeleteToast,
    showApproveToast,
    showRejectToast,
    submitExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    filterExpenses
  };
}
