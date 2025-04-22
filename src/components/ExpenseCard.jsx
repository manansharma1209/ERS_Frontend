import { formatDate, formatCurrency, getCategoryIcon } from '../lib/utils';
import { Button } from '../Components/ui/Button';
import { Card, CardContent, CardFooter } from '../Components/ui/Card';
import { Tooltip } from '../Components/ui/Tooltip';
import { EXPENSE_STATUS } from '../lib/constants';

export function ExpenseCard({
  expense,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  isManager
}) {
  const Icon = getCategoryIcon(expense.category);
  const isActionable = expense.status === EXPENSE_STATUS.PENDING && isManager;
  const statusColors = {
    [EXPENSE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [EXPENSE_STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [EXPENSE_STATUS.REJECTED]: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{expense.description}</h3>
              <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
            <span className={`text-sm px-2 py-1 rounded-full ${statusColors[expense.status]}`}>
              {expense.status}
            </span>
          </div>
        </div>

        {expense.receiptUrl && (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View Receipt
          </a>
        )}

        {expense.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Reason for rejection:</strong> {expense.rejectionReason}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 px-6 py-4">
        <div className="flex justify-end space-x-2 w-full">
          {isActionable ? (
            <>
              <Tooltip content="Approve expense">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onApprove(expense.id)}
                >
                  Approve
                </Button>
              </Tooltip>
              <Tooltip content="Reject expense">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onReject(expense.id)}
                >
                  Reject
                </Button>
              </Tooltip>
            </>
          ) : (
            expense.status === EXPENSE_STATUS.PENDING && (
              <>
                <Tooltip content="Edit expense">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip content="Delete expense">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}