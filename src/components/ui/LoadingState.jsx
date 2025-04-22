import { cn } from '../../lib/utils';

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export function LoadingState({
  size = 'md',
  fullScreen = false,
  message,
  className,
  ...props
}) {
  const Wrapper = fullScreen ? FullScreenWrapper : DefaultWrapper;

  return (
    <Wrapper className={className} {...props}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg
          className={cn(
            'animate-spin text-blue-500',
            spinnerSizes[size]
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {message && (
          <p className={cn(
            'text-gray-600 animate-pulse',
            textSizes[size]
          )}>
            {message}
          </p>
        )}
      </div>
    </Wrapper>
  );
}

function FullScreenWrapper({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-white bg-opacity-75 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DefaultWrapper({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'min-h-[100px] w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LoadingSpinner({ className, size = 'md', ...props }) {
  return (
    <svg
      className={cn(
        'animate-spin text-blue-500',
        spinnerSizes[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function LoadingOverlay({
  message = 'Loading...',
  size = 'md',
  className,
  ...props
}) {
  return (
    <LoadingState
      fullScreen
      message={message}
      size={size}
      className={cn('bg-white/80', className)}
      {...props}
    />
  );
}