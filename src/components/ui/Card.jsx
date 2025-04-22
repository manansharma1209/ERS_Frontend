import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const cardVariants = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
  outline: 'border-2 border-gray-300',
  ghost: 'bg-gray-50'
};

export const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg',
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'p-6 border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef(({
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

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'p-6 border-t border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';