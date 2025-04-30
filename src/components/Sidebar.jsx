import { useState, useEffect } from 'react';
import { Menu, PenSquare, ClipboardCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';

export function Sidebar({ isManager, activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Convert isManager to boolean to handle both string and boolean values
  const showApprovalTab = isManager === true || isManager === 'true';

  // Add responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 640;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Override toggle behavior for mobile
  const handleToggle = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      className={cn(
        'h-screen bg-gray-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn('flex items-center space-x-2', isCollapsed && 'hidden')}>
          <PenSquare className="h-6 w-6" />
          <span className="text-xl font-bold">ERS</span>
        </div>
        <Tooltip content="Toggle Sidebar" className="-right-20">
          <button
            onClick={handleToggle}
            className={cn(
              "rounded-lg p-2 hover:bg-gray-800",
              isMobile && "hidden" // Hide toggle button on mobile
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>

      <nav className="mt-8 space-y-2 px-2">
        {isCollapsed ? (
          <>
            <Tooltip content="My Requests" className="-right-20">
              <button
                onClick={() => onTabChange('requests')}
                className={cn(
                  'flex w-full items-center justify-center rounded-lg p-3 transition-colors',
                  activeTab === 'requests' ? 'bg-gray-800' : 'hover:bg-gray-800'
                )}
              >
                <PenSquare className="h-5 w-5" />
              </button>
            </Tooltip>
            
            {showApprovalTab && (
              <Tooltip content="Approve Requests" className="-right-20">
                <button
                  onClick={() => onTabChange('approvals')}
                  className={cn(
                    'flex w-full items-center justify-center rounded-lg p-3 transition-colors',
                    activeTab === 'approvals' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  )}
                >
                  <ClipboardCheck className="h-5 w-5" />
                </button>
              </Tooltip>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => onTabChange('requests')}
              className={cn(
                'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
                activeTab === 'requests' ? 'bg-gray-800' : 'hover:bg-gray-800'
              )}
            >
              <PenSquare className="h-5 w-5" />
              <span>My Requests</span>
            </button>

            {showApprovalTab && (
              <button
                onClick={() => onTabChange('approvals')}
                className={cn(
                  'flex w-full items-center space-x-2 rounded-lg p-3 transition-colors',
                  activeTab === 'approvals' ? 'bg-gray-800' : 'hover:bg-gray-800'
                )}
              >
                <ClipboardCheck className="h-5 w-5" />
                <span>Approve Requests</span>
              </button>
            )}
          </>
        )}
      </nav>
    </div>
  );
}