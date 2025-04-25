import { cn } from '../../lib/utils';

export function Tooltip({ children, content, className }) {
  return (
    <div className="relative group">
      {children}
      <div className={cn(
        'absolute invisible group-hover:visible opacity-0 group-hover:opacity-100',
        'bg-gray-100 text-black px-2 py-1 rounded text-sm whitespace-nowrap',
        'transition-opacity duration-200',
        'z-50',
        className
      )}>
        {content}
      </div>
    </div>
  );
}