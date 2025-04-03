import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUser } from './AddUser';
import { SearchUser } from './SearchUser';
import { Dialog, DialogContent } from '../ui/Dialog';
import { UserMenu } from '../UserMenu';
import { Plus, Search, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addUser');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setActiveTab('addUser');
  };

  // Custom sidebar for admin
  const AdminSidebar = ({ activeTab, onTabChange, isMinimized, onToggle }) => {
    return (
      <div className={cn(
        'bg-gray-900 text-white h-screen transition-all duration-300',
        isMinimized ? 'w-16' : 'w-64'
      )}>
        <div className="flex items-center justify-between p-4">
          <div className={cn('flex items-center space-x-2', isMinimized && 'hidden')}>
            <Search className="h-6 w-6" />
            <span className="text-xl font-bold">ERS Admin</span>
          </div>
          <Tooltip content="Toggle Sidebar" className="-right-20">
            <button
              onClick={onToggle}
              className="rounded-lg p-2 hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
  
        <nav className="mt-8 space-y-2 px-2">
          {isMinimized ? (
            <Tooltip content="Add User Details" className="-right-20">
              <button
                className={cn(
                  'flex w-full items-center justify-center rounded-lg p-3 transition-colors',
                  activeTab === 'addUser' ? 'bg-gray-800' : 'hover:bg-gray-800'
                )}
                onClick={() => onTabChange('addUser')}
              >
                <Plus className="h-5 w-5" />
              </button>
            </Tooltip>
          ) : (
            <button
              className={cn(
                'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
                activeTab === 'addUser' ? 'bg-gray-800' : 'hover:bg-gray-800'
              )}
              onClick={() => onTabChange('addUser')}
            >
              <Plus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          )}
  
          {isMinimized ? (
            <Tooltip content="Search Users" className="-right-20">
              <button
                className={cn(
                  'flex w-full items-center justify-center rounded-lg p-3 transition-colors',
                  activeTab === 'searchUser' ? 'bg-gray-800' : 'hover:bg-gray-800'
                )}
                onClick={() => onTabChange('searchUser')}
              >
                <Search className="h-5 w-5" />
              </button>
            </Tooltip>
          ) : (
            <button
              className={cn(
                'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
                activeTab === 'searchUser' ? 'bg-gray-800' : 'hover:bg-gray-800'
              )}
              onClick={() => onTabChange('searchUser')}
            >
              <Search className="h-5 w-5" />
              <span>Search User</span>
            </button>
          )}
        </nav>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMinimized={isSidebarMinimized}
        onToggle={() => setIsSidebarMinimized(!isSidebarMinimized)}
      />

      <div className="flex-1 overflow-hidden">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <h1 className="text-xl font-semibold">
            {activeTab === 'addUser' ? 'Add User Details' : 'Search User'}
          </h1>
          <div className="flex items-center space-x-4">
            <UserMenu
              user={user}
              onLogout={handleLogout}
              onViewProfile={() => setShowProfileDialog(true)}
            />
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>

          {activeTab === 'addUser' ? (
            <AddUser editingUser={editingUser} setEditingUser={setEditingUser} />
          ) : (
            <SearchUser onEditUser={handleEditUser} />
          )}

          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogContent>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role || 'Admin'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}

// Export the component without internal Routes
export function AdminApp() {
  return <AdminDashboard />;
}