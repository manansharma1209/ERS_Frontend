import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from './SideBar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardToolbar } from './DashboardToolbar';
import { ExpenseList } from './ExpenseList';
import {ExpenseCard} from './ExpenseCard';
import { ExpenseForm } from './ExpenseForm';
import { NotificationList } from './NotificationList';
import { ProfileDialog } from './ProfileDialog';
import { Dialog, DialogContent } from './ui/Dialog';
import { Toast } from './ui/Toast';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useNotifications } from '../hooks/useNotifications';
import { apiService, fetchExpensesForReportee } from '../lib/api';
import { API_CONFIG } from '../lib/constants';

export function Dashboard() {
  const { auth, updateAuth } = useAuth();
  const { 
    expenses,
    setExpenses,
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
  const [filters, setFilters] = useState({ 
    status: '', // empty means show only PENDING for approvals tab
    dateOrder: 'New to old', 
    category: '' 
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [reporteeExpenses, setReporteeExpenses] = useState([]);
  const [loadingReporteeExpenses, setLoadingReporteeExpenses] = useState(false);
  const [isApprovingId, setIsApprovingId] = useState(null);
  const [isRejectingId, setIsRejectingId] = useState(null);
  
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

  // Effect to fetch reportee expenses when approvals tab is active
  useEffect(() => {
    async function fetchReporteeData() {
      if (activeTab === 'approvals' && auth?.isManager) {
        setLoadingReporteeExpenses(true);
        try {
          // Fetch expenses for all reportees
          const allExpenses = [];
          for (const reporteeId of auth.reportees) {
            const data = await fetchExpensesForReportee(reporteeId, auth.token);
            allExpenses.push(...data);
          }
          setReporteeExpenses(allExpenses);
        } catch (error) {
          console.error('Error fetching reportee expenses:', error);
        } finally {
          setLoadingReporteeExpenses(false);
        }
      }
    }
    fetchReporteeData();
  }, [activeTab, auth]);

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
      
      const uploadResponse = await axios.post(
        `${API_CONFIG.BASE_URL}/upload/pdf`,
        receiptFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

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
        const receiptFormData = new FormData();
        receiptFormData.append('file', formData.receipt);
        
        const uploadResponse = await axios.post(
          `${API_CONFIG.BASE_URL}/upload/pdf`,
          receiptFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        receiptUrl = uploadResponse.data;
      }
  
      const expenseData = {
        userId: auth.wissenID,
        category: formData.category.toUpperCase(),
        amount: parseFloat(formData.amount),
        description: formData.description,
        receipt: receiptUrl
      };
  
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/expenses/${editingExpense.expenseID}?userId=${auth.wissenID}`,
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
  
      if (response.data) {
        // Update the expenses list with the returned expense
        const updatedExpenses = expenses.map(expense => 
          expense.expenseID === editingExpense.expenseID ? response.data : expense
        );
        setExpenses(updatedExpenses);
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
    setIsApprovingId(id);
    try {
      const targetExpense = reporteeExpenses.find(expense => expense.expenseID === id);
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/expenses/${id}/status/approve`,
        null,
        {
          params: {
            userId: targetExpense.wissenID,
            status: "APPROVED",
            approvedBy: auth.wissenID,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      
      if (response.status === 200) {
        const today = new Date().toLocaleDateString();
        
        const notification = {
          message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been approved. On ${today}`,
          status: 'APPROVED',
          userId: targetExpense.wissenID,
          managerId: auth.wissenID,
          expenseId: id
        };
        
        await addNotification(notification);
  
        setReporteeExpenses(prevExpenses => 
          prevExpenses.map(expense =>
            expense.expenseID === id ? { ...expense, status: 'APPROVED' } : expense
          )
        );
  
        showSuccessToast('Expense approved successfully!');
      }
    } catch (error) {
      console.error('Error approving expense:', error);
    } finally {
      setIsApprovingId(null);
    }
  };
  
  const handleReject = async (id, reason) => {
    setIsRejectingId(id);
    try {
      const targetExpense = reporteeExpenses.find(expense => expense.expenseID === id);
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/expenses/${id}/status/reject`,
        null,
        {
          params: {
            userId: targetExpense.wissenID,
            status: "REJECTED",
            reason: reason,
            rejectedBy: auth.wissenID,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      
      if (response.status === 200) {
        const today = new Date().toLocaleDateString();
        
        const notification = {
          message: `Your expense request for ${targetExpense.category} and amount ${targetExpense.amount} has been rejected. Due to ${reason}. By ${auth.name}. On ${today}`,
          status: 'REJECTED',
          userId: targetExpense.wissenID,
          managerId: auth.wissenID,
          expenseId: id
        };
        
        await addNotification(notification);
  
        setReporteeExpenses(prevExpenses => 
          prevExpenses.map(expense =>
            expense.expenseID === id ? { ...expense, status: 'REJECTED' } : expense
          )
        );
  
        showSuccessToast('Expense rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
    } finally {
      setIsRejectingId(null);
    }
  };
  

  const handleDelete = async (id) => {
    const result = await deleteExpense(id);
    if (result.success) {
      showSuccessToast('Expense deleted successfully!');
    }
  };

  const filteredExpenses = (activeTab === 'approvals' ? reporteeExpenses : expenses)
  .filter((expense) => {
    // Apply status filter for both tabs
    const statusMatch = !filters.status 
      ? expense.status === 'PENDING'  // Show only PENDING by default for both tabs
      : expense.status === filters.status.toUpperCase();
    
    // Apply category filter
    const categoryMatch = filters.category 
      ? expense.category === filters.category.toUpperCase() 
      : true;
      
    // Return true only if both status and category match
    return statusMatch && categoryMatch;
  })
  .sort((a, b) => {
    // For both tabs, always show PENDING first when no status filter is applied
    if (!filters.status) {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    }
  
    // Then sort by date
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return filters.dateOrder === 'Old to new' 
      ? dateA - dateB 
      : dateB - dateA;
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
            user={auth}
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

          {activeTab === 'approvals' && auth.isManager ? (
  <div className="mt-8">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {loadingReporteeExpenses ? (
        <div className="col-span-full flex justify-center items-center h-32 -mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-gray-500 text-base">Loading approve requests...</p>
            </div>
          </div>
        </div>
      ) : filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.expenseID}
            expense={expense}
            isApprovalView={true}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            isApproving={isApprovingId === expense.expenseID}
            isRejecting={isRejectingId === expense.expenseID}
          />
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center h-32 -mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
            <p className="text-gray-500 text-base">
              {(!filters.status && !filters.category) 
                ? "No pending expenses found for approval" 
                : "No matching expenses found"}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
) : (
  <ExpenseList
    expenses={filteredExpenses}
    isLoading={isLoading}
    isApprovalView={false}
    onEdit={(expense) => {
      setEditingExpense(expense);
      setShowExpenseForm(true);
    }}
    onDelete={handleDelete}
    user={auth}
    filters={filters}
  />
)}
        </main>
      </div>
    </div>
  );
}