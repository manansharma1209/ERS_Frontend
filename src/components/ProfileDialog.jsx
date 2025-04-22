import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';

export function ProfileDialog({ user, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          My Profile
        </DialogTitle>
        <div className="mt-4 space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role || 'User'}
          </p>
          {user.wissenID && (
            <p>
              <strong>Wissen ID:</strong> {user.wissenID}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}