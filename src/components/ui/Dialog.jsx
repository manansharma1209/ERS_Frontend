import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Dialog = forwardRef(({
  children,
  className,
  open = false,
  onOpenChange,
  ...props
}, ref) => {
  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange?.(false);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Dialog.displayName = 'Dialog';

export const DialogContent = forwardRef(({
  children,
  className,
  showClose = true,
  onClose,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4',
        'transform transition-all duration-200 ease-in-out',
        'animate-in fade-in zoom-in-95',
        className
      )}
      {...props}
    >
      {showClose && (
        <button
          onClick={() => onClose?.()}
          className={cn(
            'absolute right-4 top-4 rounded-sm opacity-70',
            'hover:opacity-100 focus:outline-none focus:ring-2',
            'focus:ring-offset-2 focus:ring-blue-500'
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  );
});

DialogContent.displayName = 'DialogContent';

export const DialogHeader = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

DialogHeader.displayName = 'DialogHeader';

export const DialogBody = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

DialogBody.displayName = 'DialogBody';

export const DialogFooter = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-gray-200',
        'flex justify-end space-x-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        'text-lg font-semibold text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
});

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'mt-2 text-sm text-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});

DialogDescription.displayName = 'DialogDescription';