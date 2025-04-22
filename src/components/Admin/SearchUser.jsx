import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { UserCard } from '../UserCard';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/Dialog';
import { Toast } from '../ui/Toast';
import { useUsers } from '../../hooks/useUsers';

export function SearchUser({ onEditUser }) {
  const { users, isLoading, toggleUserStatus } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({ 
    isManager: '', 
    role: '',
    status: 'active'
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Click outside handler for filter dropdown
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (wissenID, newStatus) => {
    const result = await toggleUserStatus(wissenID, newStatus);
    if (result.success) {
      showSuccessToast(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    // Apply search filter
    const searchMatch = !searchTerm || (
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.wissenID && user.wissenID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply status filter
    const statusMatch = filters.status === 'all' || 
      (filters.status === 'active' ? user.active : !user.active);

    // Apply manager filter
    const managerMatch = !filters.isManager || 
      (filters.isManager === 'Yes' ? user.isManager : !user.isManager);

    // Apply role filter
    const roleMatch = !filters.role || 
      (user.role && user.role.toLowerCase().includes(filters.role.toLowerCase()));

    return searchMatch && statusMatch && managerMatch && roleMatch;
  });

  return (
    <div className="space-y-6">
      <Toast 
        message={toastMessage}
        visible={showToast}
      />

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search users by name, email, role, or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <Button 
            ref={filterButtonRef}
            variant="secondary" 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
                 
          {showFilterDropdown && (
            <div 
              ref={filterDropdownRef}
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-4"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                    <option value="all">All Users</option>
                  </select>
                </div>
          
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Is Manager
                  </label>
                  <select
                    name="isManager"
                    value={filters.isManager}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
          
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Filter by role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
          
                <Button 
                  variant="secondary" 
                  onClick={() => setFilters({ isManager: '', role: '', status: 'active' })}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="col-span-full flex justify-center items-center h-32">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-gray-500 text-base">Loading users...</p>
            </div>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="col-span-full flex justify-center items-center h-32">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
            <p className="text-gray-500 text-base">No users found. Try adjusting your search criteria.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.wissenID}
              user={{
                id: user.wissenID,
                name: user.name,
                email: user.email,
                role: user.role,
                managerId: user.managerId,
                joiningDate: user.dateOfJoining,
                isManager: user.isManager,
                isActive: user.active,
                wissenID: user.wissenID
              }}
              reportees={user.reportees || []}
              onEdit={() => onEditUser(user)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}