import { ExpenseCard } from './ExpenseCard';

export function ExpenseList({ 
  expenses, 
  isLoading,
  isLoadingApprovals, 
  isApprovalView,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  user
}) {
  if (isLoadingApprovals && isApprovalView) {
    return (
      <div className="col-span-full flex justify-center items-center h-32 -mt-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-base">Loading approve requests...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show approval requests for managers
  if (isApprovalView && user?.isManager) {
    return (
      <div className="mt-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense.expenseID}
                expense={expense}
                isApprovalView={true}
                onApprove={onApprove}
                onReject={onReject}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-32 -mt-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
                <p className="text-gray-500 text-base">No expenses found for approval.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show regular expenses
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.expenseID}
          expense={expense}
          isApprovalView={false}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={() => onEdit(expense)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}