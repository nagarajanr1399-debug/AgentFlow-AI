import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...message, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-slate-700/80 bg-[#161f30] text-slate-100 shadow-xl shadow-black/40 transition-all transform animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'error' ? (
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5" />
              ) : t.type === 'warning' ? (
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <div className="font-semibold text-slate-200">{t.title}</div>
              {t.description && <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
