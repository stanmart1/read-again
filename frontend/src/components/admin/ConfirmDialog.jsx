import { motion } from 'framer-motion';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-primary hover:bg-primary/90'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
            <i className={`${type === 'danger' ? 'ri-error-warning-line text-red-600 dark:text-red-400' : 'ri-alert-line text-yellow-600 dark:text-yellow-400'} text-2xl`}></i>
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
