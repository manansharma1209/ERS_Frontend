import { Toast } from './Toast';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          visible={true}
          onDismiss={() => onDismiss?.(toast.id)}
        />
      ))}
    </div>
  );
}