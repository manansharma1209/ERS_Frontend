import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { UserCard } from '../UserCard';
import { Filter } from 'lucide-react';
import { Toast } from '../ui/Toast';
import { Dialog, DialogContent, DialogTitle } from '../ui/Dialog';


export function SearchUser({ onEditUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({ 
    isManager: '', 
    role: '',
    status: 'active' // Add default status filter
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];
    
    // Apply status filter
    if (filters.status === 'active') {
      result = result.filter(user => user.active === true);
    } else if (filters.status === 'inactive') {
      result = result.filter(user => user.active === false);
    }
    
    // Apply other existing filters...
    
    setFilteredUsers(result);
  }, [users, filters, searchTerm]);

  // Close filter dropdown when clicking outside
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

  // Apply search and filters whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, filters, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/');
      console.log(response.data);
      setUsers(response.data);
      setFilteredUsers(response.data);
      console.log('Fetched users:', response.data); // Log the fetched users
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...users];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.role && user.role.toLowerCase().includes(term)) ||
        (user.wissenID && user.wissenID.toString().toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filters.status === 'active') {
      result = result.filter(user => user.active);
    } else if (filters.status === 'inactive') {
      result = result.filter(user => !user.active);
    }
    
    // Apply other filters
    if (filters.isManager) {
      if (filters.isManager === 'Yes') {
        result = result.filter(user => user.isManager === true);
      } else if (filters.isManager === 'No') {
        result = result.filter(user => user.isManager === false);
      }
    }
    
    if (filters.role && filters.role.trim()) {
      const roleFilter = filters.role.toLowerCase().trim();
      result = result.filter(user => 
        user.role && user.role.toLowerCase().includes(roleFilter)
      );
    }
    
    setFilteredUsers(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleStatusChange = (wissenID, newStatus) => {
    // Update users state with the correct field name (active instead of isActive)
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.wissenID === wissenID 
          ? { ...user, active: newStatus }
          : user
      );
      // Force a re-filter after state update
      applyFiltersAndSearch();
      return updatedUsers;
    });
  };
  
  // Add this new function to handle the actual deletion
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userToDelete}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      fetchUsers();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Function to fetch subordinates for a user
  const fetchSubordinates = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/subordinates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subordinates:', error);
      return [];
    }
  };

  return (
    <div className="space-y-6">
        <Toast 
      message="User deleted successfully!"
      visible={showToast}
    />
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <div className="mt-4 space-y-4">
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
                {/* Add the new status filter first */}
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
          
                {/* Existing Is Manager filter */}
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
          
                {/* Existing Role filter */}
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
          
                {/* Update the Clear Filters button to include status */}
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setFilters({ isManager: '', role: '', status: 'active' });
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
  <div className="col-span-full flex justify-center items-center h-32">
    <div className="bg-white p-6 rounded-lg shadow-md text-center w-64">
      <p className="text-gray-500 text-base">Loading users...</p>
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
      isActive: user.active, // Map 'active' from API to 'isActive' for UserCard
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