import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useExpenseService } from '../hooks/useExpenseService';
import { Sidebar } from './Sidebar';
import { Toast } from './ui/Toast';
import { DashboardHeader } from './DashboardHeader';
import { DashboardToolbar } from './DashboardToolbar';
import { ExpenseListSection } from './ExpenseListSection';
import { DialogsContainer } from './DialogsContainer';

export function Dashboard() {
  const { user, logout } = useAuth();
  const api = useApi();
  const expenseService = useExpenseService();
  
  // States
  const [activeTab, setActiveTab] = useState('requests');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [filters, setFilters] = useState({ status: '', dateOrder: '', category: '' });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [approveRequests, setApproveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);

  // Refs
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Effect for fetching expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const data = await api.expenses.fetch();
        setExpenses(data);
      } catch (error) {
        setExpenses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, [api.expenses]);

  // Effect for fetching notifications
  useEffect(() => {
    const loadNotifications = async () => {
      const data = await api.notifications.fetch();
      setNotifications(data);
    };
    if (user?.wissenID) {
      loadNotifications();
    }
  }, [user, api.notifications]);

  // Effect for fetching approve requests
  useEffect(() => {
    const loadApproveRequests = async () => {
      setIsLoadingApprovals(true);
      try {
        const data = await api.expenses.fetchApprovalRequests();
        setApproveRequests(data);
      } finally {
        setIsLoadingApprovals(false);
      }
    };
    
    if (user.isManager) {
      loadApproveRequests();
    }
  }, [user.isManager, api.expenses]);

  // Effect for handling click outside filter dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler functions
  const handleApprove = async (id) => {
    try {
      const targetExpense = approveRequests.find(expense => expense.id === id);
      await expenseService.approveExpense(id, targetExpense);
      
      setExpenses(expenses.map(expense =>
        expense.id === id ? { ...expense, status: 'APPROVED'} : expense
      ));
      setApproveRequests(approveRequests.map(expense =>
        expense.id === id ? { ...expense, status: 'APPROVED'} : expense
      ));
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const targetExpense = approveRequests.find(expense => expense.id === id);
      await expenseService.rejectExpense(id, reason, targetExpense);
      
      setExpenses(expenses.map(expense =>
        expense.id === id ? { ...expense, status: 'REJECTED' } : expense
      ));
      setApproveRequests(approveRequests.map(expense =>
        expense.id === id ? { ...expense, status: 'REJECTED' } : expense
      ));
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const handleExpenseSubmit = async (formData) => {
    try {
      const newExpense = await expenseService.submitExpense(formData);
      setExpenses([newExpense, ...expenses]);
      setShowExpenseForm(false);
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  const handleEdit = (id) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    setEditingExpense(expenseToEdit);
    setShowExpenseForm(true);
  };

  const handleDelete = (id) => {
    setDeletingExpenseId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await expenseService.deleteExpense(deletingExpenseId);
      setExpenses(expenses.filter(expense => expense.id !== deletingExpenseId));
      setShowDeleteConfirm(false);
      setDeletingExpenseId(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleExpenseUpdate = async (formData) => {
    try {
      const updatedExpense = await expenseService.updateExpense(
        editingExpense.id,
        formData,
        editingExpense.receipt
      );
      
      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id ? updatedExpense : expense
      ));
      setEditingExpense(null);
      setShowExpenseForm(false);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowFilterDropdown(false);
  };

  // Filtering logic using the expense service
  const filteredExpenses = expenseService.filterExpenses(expenses, filters);
  const filteredApproveRequests = expenseService.filterExpenses(approveRequests, filters);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isManager={user.isManager}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-hidden">
        <DashboardHeader
          activeTab={activeTab}
          notifications={notifications}
          user={user}
          onNotificationClick={() => setShowAllNotifications(true)}
          onLogout={logout}
          onViewProfile={() => setShowProfileDialog(true)}
        />
        
        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <DashboardToolbar
            userName={user.name}
            activeTab={activeTab}
            filters={filters}
            showFilterDropdown={showFilterDropdown}
            onNewExpense={() => setShowExpenseForm(true)}
            onFilterChange={handleFilterChange}
            onFilterDropdownToggle={() => setShowFilterDropdown(!showFilterDropdown)}
          />

          <DialogsContainer
            showExpenseForm={showExpenseForm}
            showProfileDialog={showProfileDialog}
            showDeleteConfirm={showDeleteConfirm}
            showAllNotifications={showAllNotifications}
            editingExpense={editingExpense}
            isSubmitting={expenseService.isSubmitting}
            user={user}
            notifications={notifications}
            onExpenseSubmit={editingExpense ? handleExpenseUpdate : handleExpenseSubmit}
            onExpenseCancel={() => {
              setEditingExpense(null);
              setShowExpenseForm(false);
            }}
            onExpenseFormClose={setShowExpenseForm}
            onProfileClose={setShowProfileDialog}
            onDeleteConfirm={confirmDelete}
            onDeleteCancel={() => setShowDeleteConfirm(false)}
            onNotificationsClose={() => setShowAllNotifications(false)}
          />

          {/* Toast Notifications */}
          <Toast message="Expense added successfully!" visible={expenseService.showToast} />
          <Toast message="Expense deleted successfully!" visible={expenseService.showDeleteToast} />
          <Toast message="Expense approved successfully!" visible={expenseService.showApproveToast} />
          <Toast message="Expense rejected successfully!" visible={expenseService.showRejectToast} />

          {/* Loading Overlay */}
          {expenseService.isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-gray-700">
                    {editingExpense ? 'Updating expense...' : 'Adding new expense...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expense Lists */}
          {activeTab === 'requests' ? (
            <ExpenseListSection
              isLoading={isLoading}
              expenses={filteredExpenses}
              isApprovalView={false}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ExpenseListSection
              isLoading={isLoadingApprovals}
              expenses={filteredApproveRequests}
              isApprovalView={true}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
