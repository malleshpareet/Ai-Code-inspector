import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isOpen: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Snackbar({
    message,
    type,
    isOpen,
    onClose,
    duration = 4000
}: SnackbarProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const icons = {
        success: <FiCheckCircle className="text-xl" />,
        error: <FiXCircle className="text-xl" />,
        warning: <FiAlertCircle className="text-xl" />,
        info: <FiInfo className="text-xl" />
    };

    const styles = {
        success: 'bg-green-500/90 border-green-400 text-white',
        error: 'bg-red-500/90 border-red-400 text-white',
        warning: 'bg-yellow-500/90 border-yellow-400 text-white',
        info: 'bg-blue-500/90 border-blue-400 text-white'
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
            <div className={`
        ${styles[type]}
        border-l-4 rounded-lg shadow-2xl
        px-6 py-4 min-w-[320px] max-w-md
        flex items-center gap-3
        backdrop-blur-sm
        transform transition-all duration-300
      `}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-1 text-sm font-medium">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    aria-label="Close notification"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
