import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastIcon = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const toastStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400'
};

export function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  visible = false,
  onDismiss 
}) {
  useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!visible) return null;

  const Icon = ToastIcon[type];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={cn(
          'max-w-sm rounded-lg shadow-lg border',
          'transform transition-all duration-300 ease-in-out',
          'animate-in slide-in-from-right-full fade-in',
          toastStyles[type]
        )}
      >
        <div className="flex items-center p-3">
          <Icon className={cn('h-5 w-5 shrink-0', iconStyles[type])} />
          <p className="ml-2 mr-2 text-sm font-medium flex-grow">{message}</p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}