import { Check } from 'lucide-react';

export function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-100 text-green-800 rounded-lg shadow-lg p-4 flex items-center">
        <Check className="h-5 w-5 text-green-500 mr-2" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}