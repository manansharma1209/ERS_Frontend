import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export function Tooltip({
  children,
  content,
  className,
  position = 'bottom',
  delay = 200,
  offset = 8,
  ...props
}) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShow(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(false);
  };

  const positions = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: '-left-2 top-1/2 -translate-x-full -translate-y-1/2',
    right: '-right-2 top-1/2 translate-x-full -translate-y-1/2'
  };

  const arrows = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-900',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-900',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-gray-900',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-gray-900'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-2 py-1',
            'text-sm text-white bg-gray-900',
            'rounded shadow-lg',
            'animate-in fade-in-50 zoom-in-95',
            'duration-200',
            positions[position],
            className
          )}
          style={{
            [`margin-${position}`]: `${offset}px`
          }}
        >
          {content}
          <span
            className={cn(
              'absolute w-2 h-2 rotate-45',
              'bg-gray-900 border-4 border-transparent',
              arrows[position]
            )}
          />
        </div>
      )}
    </div>
  );
}