import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    toasts,
    show: (message, opts = {}) => {
      const id = crypto.randomUUID();
      const toast = { id, message, type: opts.type || 'info', duration: opts.duration ?? 2500 };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration);
      }
    },
    dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    clear: () => setToasts([]),
  }), [toasts]);

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
