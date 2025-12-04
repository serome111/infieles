import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, title, message, type }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />;
            case 'error':
                return <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />;
            case 'info':
            default:
                return <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {getIcon()}

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-300 mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default NotificationModal;
