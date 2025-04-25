import { PlusCircle, Filter } from 'lucide-react';
import { Button } from './ui/Button';
import { ExpenseFilter } from './ExpenseFilter';
import { getFirstName } from '../lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
];

export function DashboardToolbar({
  activeTab,
  showFilterDropdown,
  filterButtonRef,
  filterDropdownRef,
  filters,
  onAddExpense,
  onFilterChange,
  onToggleFilter,
  user
}) {
  // Set default filter for approvals tab to show only PENDING
  const handleFilterChange = (newFilters) => {
    if (activeTab === 'approvals' && !newFilters.status) {
      onFilterChange({ ...newFilters, status: 'PENDING' });
    } else {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">
        {activeTab === 'approvals' 
          ? 'Expense Approvals'
          : `Welcome ${getFirstName(user?.name || 'User')},`
        }
      </h2>
      <div className="flex items-center space-x-4">
        {activeTab === 'requests' && (
          <Button variant="primary" onClick={onAddExpense}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense Request
          </Button>
        )}
        <div className="relative">
          <Button 
            ref={filterButtonRef}
            variant="secondary" 
            onClick={onToggleFilter}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          {showFilterDropdown && (
            <div 
              ref={filterDropdownRef}
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200"
            >
              <ExpenseFilter 
                filters={activeTab === 'approvals' && !filters.status ? { ...filters, status: 'PENDING' } : filters}
                onFilterChange={handleFilterChange}
                activeTab={activeTab}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}