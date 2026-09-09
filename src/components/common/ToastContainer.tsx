import React from 'react';
import { useApp } from '../../store/useAppStore';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'border-slate-700 bg-slate-900 text-slate-100';
        let iconColor = 'text-cyan-400';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          borderClass = 'border-emerald-600/80 bg-slate-900/95 text-emerald-100 shadow-lg shadow-emerald-950/30';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-600/80 bg-slate-900/95 text-amber-100 shadow-lg shadow-amber-950/30';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-600/80 bg-slate-900/95 text-rose-100 shadow-lg shadow-rose-950/30';
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-lg border shadow-xl transition-all duration-300 animate-slideDown ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">{toast.title}</span>
                {toast.description && (
                  <span className="text-xs text-slate-300/90 mt-0.5 leading-relaxed">{toast.description}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
