export function LoadingOverlay({ message = 'Loading...', transparent = false }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      transparent ? 'bg-white/50' : 'bg-white'
    }`}>
      <div className="flex flex-col items-center p-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}