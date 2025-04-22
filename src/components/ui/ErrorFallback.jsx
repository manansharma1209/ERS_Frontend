export function ErrorFallback({ error, errorInfo, onReset }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-4 mb-4">
            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error?.message || 'An unexpected error occurred'}
          </p>
          
          {process.env.NODE_ENV === 'development' && errorInfo && (
            <div className="w-full mb-6">
              <details className="text-left">
                <summary className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  View technical details
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded text-xs text-gray-700 overflow-auto">
                  {errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go to homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}