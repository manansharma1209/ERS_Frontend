import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './useToast';
import { useError } from './useError';

export function useExpenses() {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const { handleError } = useError();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.fetchExpenses(auth.wissenID, auth.token);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'fetchExpenses' }
      });
      setError(errorMessage);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await api.createExpense(expenseData, auth.token);
      setExpenses(prev => [response.data, ...prev]);
      showToast({
        message: 'Expense added successfully',
        type: 'success'
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'addExpense', data: expenseData }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const response = await api.updateExpense(expenseId, auth.wissenID, expenseData, auth.token);
      setExpenses(prev => 
        prev.map(expense => expense.id === expenseId ? response.data : expense)
      );
      showToast({
        message: 'Expense updated successfully',
        type: 'success'
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'updateExpense', expenseId, data: expenseData }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await api.deleteExpense(expenseId, auth.wissenID, auth.token);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      showToast({
        message: 'Expense deleted successfully',
        type: 'success'
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'deleteExpense', expenseId }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  const approveExpense = async (expenseId, userId) => {
    try {
      await api.approveExpense(expenseId, userId, auth.wissenID, auth.token);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId ? { ...expense, status: 'APPROVED' } : expense
        )
      );
      showToast({
        message: 'Expense approved successfully',
        type: 'success'
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'approveExpense', expenseId, userId }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  const rejectExpense = async (expenseId, userId, reason) => {
    try {
      await api.rejectExpense(expenseId, userId, reason, auth.wissenID, auth.token);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId ? { ...expense, status: 'REJECTED' } : expense
        )
      );
      showToast({
        message: 'Expense rejected successfully',
        type: 'success'
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      handleError(err, {
        category: 'API',
        context: { action: 'rejectExpense', expenseId, userId, reason }
      });
      showToast({
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    if (auth?.wissenID) {
      fetchExpenses();
    }
  }, [auth?.wissenID]);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    refreshExpenses: fetchExpenses
  };
}