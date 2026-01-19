'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Check, X, Sparkles } from '@/components/ui/Icons';

// Toast types
interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }
    }, [dismissToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Toast Container Component
function ToastContainer({ toasts, dismissToast }: { toasts: Toast[]; dismissToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return <Check size={20} style={{ color: '#22c55e' }} />;
            case 'error':
                return <X size={20} style={{ color: '#ef4444' }} />;
            case 'info':
            default:
                return <Sparkles size={20} style={{ color: 'hsl(var(--primary))' }} />;
        }
    };

    return (
        <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast ${toast.type}`}
                    role="alert"
                >
                    {getIcon(toast.type)}
                    <span style={{ flex: 1 }}>{toast.message}</span>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        aria-label="Dismiss notification"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            opacity: 0.5,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ToastProvider;
