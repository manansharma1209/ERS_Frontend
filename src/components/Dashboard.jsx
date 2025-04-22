import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './SideBar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardToolbar } from './DashboardToolbar';
import { ExpenseList } from './ExpenseList';
import { ExpenseForm } from './ExpenseForm';
import { NotificationList } from './NotificationList';
import { ProfileDialog } from './ProfileDialog';
import { Dialog, DialogContent } from './ui/Dialog';
import { Toast } from './ui/Toast';
import { LoadingOverlay } from './ui/LoadingOverlay';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useNotifications } from '../hooks/useNotifications';
import { api } from '../lib/api';

export function Dashboard() {
  const { auth, updateAuth } = useAuth();
  const { 
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense
  } = useExpenses();
  const {
    notifications,
    addNotification
  } = useNotifications();

  // Local state
  const [activeTab, setActiveTab] = useState('requests');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [filters, setFilters] = useState({ status: '', dateOrder: '', category: '' });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Filter click outside effect
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && 
          !filterDropdownRef.current.contains(event.target) &&
          filterButtonRef.current && 
          !filterButtonRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Event handlers
  const handleLogout = () => {
    updateAuth(null);
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExpenseSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Upload receipt first
      const receiptFormData = new FormData();
      receiptFormData.append('file', formData.receipt);
      const uploadResponse = await api.uploadReceipt(formData.receipt, auth.token);

      const expenseData = {
        userId: auth.wissenID,
        category: formData.category.toUpperCase(),
        amount: parseFloat(formData.amount),
        description: formData.description,
        receipt: uploadResponse.data
      };

      const result = await addExpense(expenseData);
      if (result.success) {
        setShowExpenseForm(false);
        showSuccessToast('Expense added successfully!');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpenseUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      let receiptUrl = editingExpense.receipt;

      if (formData.receipt instanceof File) {
        const uploadResponse = await api.uploadReceipt(formData.receipt, auth.token);
        receiptUrl = uploadResponse.data;
      }

      const expenseData = {
        category: formData.category.toUpperCase(),
        amount: parseFloat(formData.amount),
        description: formData.description,
        receipt: receiptUrl,
        status: 'PENDING',
        wissenID: auth.wissenID
      };

      const result = await updateExpense(editingExpense.id, expenseData);
      if (result.success) {
        setEditingExpense(null);
        setShowExpenseForm(false);
        showSuccessToast('Expense updated successfully!');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    const targetExpense = expenses.find(expense => expense.id === id);
    const result = await approveExpense(id, targetExpense.wissenID);
    
    if (result.success) {
      const notification = {
        message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been approved.`,
        status: 'APPROVED',
        userId: targetExpense.wissenID,
        managerId: auth.wissenID,
        expenseId: id
      };
      await addNotification(notification);
      showSuccessToast('Expense approved successfully!');
    }
  };

  const handleReject = async (id, reason) => {
    const targetExpense = expenses.find(expense => expense.id === id);
    const result = await rejectExpense(id, targetExpense.wissenID, reason);
    
    if (result.success) {
      const notification = {
        message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been rejected. Reason: ${reason}`,
        status: 'REJECTED',
        userId: targetExpense.wissenID,
        managerId: auth.wissenID,
        expenseId: id
      };
      await addNotification(notification);
      showSuccessToast('Expense rejected successfully!');
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteExpense(id);
    if (result.success) {
      showSuccessToast('Expense deleted successfully!');
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const statusMatch = filters.status ? expense.status === filters.status.toUpperCase() : true;
    const categoryMatch = filters.category ? expense.category === filters.category.toUpperCase() : true;
    return statusMatch && categoryMatch;
  }).sort((a, b) => {
    if (filters.dateOrder === 'Old to new') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (filters.dateOrder === 'New to old') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isManager={auth.isManager}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-hidden">
        <DashboardHeader 
          activeTab={activeTab}
          notifications={notifications}
          user={auth}
          onShowNotifications={() => setShowAllNotifications(true)}
          onLogout={handleLogout}
          onViewProfile={() => setShowProfileDialog(true)}
        />
        
        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <DashboardToolbar 
            activeTab={activeTab}
            showFilterDropdown={showFilterDropdown}
            filterButtonRef={filterButtonRef}
            filterDropdownRef={filterDropdownRef}
            filters={filters}
            onAddExpense={() => setShowExpenseForm(true)}
            onFilterChange={setFilters}
            onToggleFilter={() => setShowFilterDropdown(!showFilterDropdown)}
          />

          {/* Dialogs */}
          <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
            <DialogContent className="pointer-events-auto">
              <ExpenseForm
                onSubmit={editingExpense ? handleExpenseUpdate : handleExpenseSubmit}
                onCancel={() => {
                  setEditingExpense(null);
                  setShowExpenseForm(false);
                }}
                initialData={editingExpense}
                showExpenseForm={showExpenseForm}
                disabled={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          <ProfileDialog 
            user={auth}
            isOpen={showProfileDialog}
            onClose={() => setShowProfileDialog(false)}
          />

          <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
            <DialogContent>
              <NotificationList
                notifications={notifications}
                onClose={() => setShowAllNotifications(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Toast */}
          <Toast message={toastMessage} visible={showToast} />

          {/* Loading States */}
          {isSubmitting && (
            <LoadingOverlay 
              message={editingExpense ? 'Updating expense...' : 'Adding new expense...'}
            />
          )}

          {/* Expense Lists */}
          <ExpenseList
            expenses={filteredExpenses}
            isLoading={isLoading}
            isApprovalView={activeTab === 'approvals'}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={(id) => {
              const expense = expenses.find(e => e.id === id);
              setEditingExpense(expense);
              setShowExpenseForm(true);
            }}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}