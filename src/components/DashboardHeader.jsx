import { NotificationIcon } from './NotificationIcon';
import { UserMenu } from './UserMenu';
import { Tooltip } from './ui/Tooltip';

export function DashboardHeader({ 
  activeTab, 
  notifications, 
  user, 
  onShowNotifications, 
  onLogout, 
  onViewProfile 
}) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-semibold">
        {activeTab === 'requests' ? 'My Requests' : 'Approve Requests'}
      </h1>
      <div className="flex items-center space-x-4">
        <Tooltip content="Notifications" className="-bottom-8">
          <div>
            <NotificationIcon 
              notifications={notifications} 
              onClick={onShowNotifications} 
            />
          </div>
        </Tooltip>
        <UserMenu
          user={user}
          onLogout={onLogout}
          onViewProfile={onViewProfile}
        />
      </div>
    </header>
  );
}