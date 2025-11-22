import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "تأیید عملیات",
  message = "آیا از انجام این عمل اطمینان دارید؟",
  confirmText = "بله",
  cancelText = "خیر",
  type = "warning" 
}) {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: <AlertTriangle className="text-yellow-500" size={48} />,
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30"
    },
    danger: {
      icon: <AlertTriangle className="text-red-500" size={48} />,
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30"
    },
    info: {
      icon: <AlertTriangle className="text-blue-500" size={48} />,
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border ${config.borderColor} shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-2xl ${config.bgColor}`}>
              {config.icon}
            </div>
            <p className="text-gray-300 text-lg leading-8">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
              type === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : type === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}