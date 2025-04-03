import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';

export function NotificationList({ notifications, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>All Notifications</DialogTitle>
        <div className="mt-4 space-y-4">
          {notifications.length > 0 ? (
            <>
              <ul className="space-y-2">
                {currentNotifications.map((notification, index) => (
                  <li
                    key={notification.id}
                    className={`text-sm text-gray-700 p-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    {notification.message}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-32">
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <p className="text-gray-500 text-sm font-medium">Stay tuned for updates!</p>
    </div>
  </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}