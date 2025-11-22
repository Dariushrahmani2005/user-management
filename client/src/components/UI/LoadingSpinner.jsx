import { RefreshCw } from 'lucide-react';

export default function LoadingSpinner({ size = 'large', text = 'در حال بارگذاری...' }) {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <RefreshCw className={`${sizes[size]} animate-spin text-cyan-400`} />
      <p className="text-gray-400 text-lg">{text}</p>
    </div>
  );
}