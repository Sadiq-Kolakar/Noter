import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Trash2, RefreshCw, Sparkles, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string;
  iconType: string; // 'check', 'alert-circle', 'trash', 'refresh-cw', 'sparkles', 'import'
  onClose: () => void;
}

export default function Toast({
  message,
  iconType,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (iconType) {
      case 'check':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'alert-circle':
        return <AlertCircle className="w-4 h-4 text-error" />;
      case 'trash':
        return <Trash2 className="w-4 h-4 text-error" />;
      case 'refresh-cw':
        return <RefreshCw className="w-4 h-4 text-primary" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-tertiary" />;
      case 'import':
        return <Upload className="w-4 h-4 text-primary" />;
      default:
        return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="fixed bottom-16 right-6 z-[100] pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="pointer-events-auto bg-surface-container-low border border-outline-variant px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 max-w-sm backdrop-blur-md"
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <p className="font-mono text-xs text-on-surface select-none">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
