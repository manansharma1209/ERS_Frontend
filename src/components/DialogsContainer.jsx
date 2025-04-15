import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { ExpenseForm } from './ExpenseForm';
import { NotificationList } from './NotificationList';

export function DialogsContainer({
  showExpenseForm,
  showProfileDialog,
  showDeleteConfirm,
  showAllNotifications,
  editingExpense,
  isSubmitting,
  user,
  notifications,
  onExpenseSubmit,
  onExpenseCancel,
  onExpenseFormClose,
  onProfileClose,
  onDeleteConfirm,
  onDeleteCancel,
  onNotificationsClose
}) {
  return (
    <>
      {/* Expense Form Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={onExpenseFormClose}>
        <DialogContent>
          <ExpenseForm
            onSubmit={onExpenseSubmit}
            onCancel={onExpenseCancel}
            initialData={editingExpense}
            disabled={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={onProfileClose}>
        <DialogContent>
          <DialogTitle>My Profile</DialogTitle>
          <div className="mt-4 space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || 'User'}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={onDeleteCancel}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <div className="mt-4 space-y-4">
            <p>Are you sure you want to delete this expense request?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={onDeleteCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showAllNotifications} onOpenChange={onNotificationsClose}>
        <DialogContent>
          <NotificationList
            notifications={notifications}
            onClose={onNotificationsClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
