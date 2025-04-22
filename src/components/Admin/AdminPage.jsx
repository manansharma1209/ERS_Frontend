import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUser } from './AddUser';
import { SearchUser } from './SearchUser';
import { ProfileDialog } from '../ProfileDialog';
import { UserMenu } from '../UserMenu';
import { Plus, Search, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../hooks/useUsers';

function AdminSidebar({ activeTab, onTabChange, isMinimized, onToggle }) {
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
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </nav>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addUser');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const navigate = useNavigate();
  const { auth, updateAuth } = useAuth();
  const { users, createUser, updateUser } = useUsers();

  const handleLogout = () => {
    updateAuth(null);
    navigate('/login');
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setActiveTab('addUser');
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
              user={auth}
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
            <AddUser 
              editingUser={editingUser} 
              setEditingUser={setEditingUser}
              onCreateUser={createUser}
              onUpdateUser={updateUser}
            />
          ) : (
            <SearchUser 
              users={users}
              onEditUser={handleEditUser}
            />
          )}

          <ProfileDialog
            user={auth}
            isOpen={showProfileDialog}
            onClose={() => setShowProfileDialog(false)}
          />
        </main>
      </div>
    </div>
  );
}

export function AdminApp() {
  return <AdminDashboard />;
}