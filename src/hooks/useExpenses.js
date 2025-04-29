import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './useToast';
import { useError } from './useError';
import { fetchExpensesForReportee } from '../lib/api';

export function useExpenses() {
  const { user, auth } = useAuth();
  const { showToast } = useToast();
  const { handleError } = useError();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approveRequests, setApproveRequests] = useState([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(false);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.fetchExpenses(auth.wissenID);
      setExpenses(Array.isArray(response.data) ? response.data : []);
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
      expenseData.userId = auth.wissenID;
      const response = await apiService.createExpense(expenseData);
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
      const response = await apiService.updateExpense(expenseId, auth.wissenID, expenseData);
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
      await apiService.deleteExpense(expenseId, auth.wissenID);
      setExpenses(prev => prev.filter(expense => expense.expenseID !== expenseId));
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
      await apiService.approveExpense(expenseId, userId, auth.wissenID);
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
      await apiService.rejectExpense(expenseId, userId, auth.wissenID, { reason });
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

  const fetchApproveRequests = async () => {
    if (user.isManager === 'false' || !user.isManager) return;
    
    setIsLoadingApprovals(true);
    try {
      const approveRequestsPromises = user.reportees.map(reporteeWissenId =>
        fetchExpensesForReportee(reporteeWissenId, auth.token)
      );
      const responses = await Promise.all(approveRequestsPromises);
      const approveRequests = responses.flatMap(response => response);
      setApproveRequests(approveRequests);
    } catch (error) {
      console.error('Error fetching approve requests:', error);
    } finally {
      setIsLoadingApprovals(false);
    }
  };

  useEffect(() => {
    if (auth?.wissenID) {
      fetchExpenses();
    }
  }, [auth?.wissenID]);

  return {
    expenses,
    setExpenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    refreshExpenses: fetchExpenses,
    approveRequests,
    isLoadingApprovals,
    fetchApproveRequests
  };
}