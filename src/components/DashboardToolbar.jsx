import { Button } from './ui/Button';
import { PlusCircle, Filter } from 'lucide-react';
import { ExpenseFilter } from './ExpenseFilter';
import { useRef } from 'react';

export function DashboardToolbar({
  userName,
  activeTab,
  filters,
  showFilterDropdown,
  onNewExpense,
  onFilterChange,
  onFilterDropdownToggle
}) {
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Welcome {userName},</h2>
      <div className="flex items-center space-x-4">
        {activeTab === 'requests' && (
          <Button variant="primary" onClick={onNewExpense}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense Request
          </Button>
        )}
        <div className="relative">
          <Button 
            ref={filterButtonRef}
            variant="secondary" 
            onClick={onFilterDropdownToggle}
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
                filters={filters}
                onFilterChange={onFilterChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
