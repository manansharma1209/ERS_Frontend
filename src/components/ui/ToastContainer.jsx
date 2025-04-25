import { Toast } from './Toast';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-16 right-4 z-[100] space-y-2 min-w-[320px]">
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