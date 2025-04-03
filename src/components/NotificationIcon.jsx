import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/Button';

export function NotificationIcon({ notifications, onClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const latestNotifications = notifications.slice(0, 3);

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <Button variant="secondary" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell className="h-6 w-6" />
      </Button>
      {showNotifications && (
  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg">
    <div className="p-4">
      <h3 className="text-lg font-semibold">Notifications</h3>
      {latestNotifications.length > 0 ? (
        <>
          <ul className="mt-2 space-y-2">
            {latestNotifications.map((notification, index) => (
              <li
                key={notification.id}
                className={`text-sm text-gray-700 p-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
              >
                {notification.message}
              </li>
            ))}
          </ul>
          <Button variant="link" onClick={onClick} className="mt-2 text-blue-500 w-full text-center">
            See more
          </Button>
        </>
      ) : (
        <div className="mt-2 py-3 px-2">
          <p className="text-gray-500 text-sm font-medium text-center">Stay tuned for updates!</p>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}