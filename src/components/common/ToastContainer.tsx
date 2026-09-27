import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white shadow-lg shadow-emerald-500/5',
          info: 'border-blue-200 bg-white shadow-lg shadow-blue-500/5',
          warning: 'border-amber-200 bg-white shadow-lg shadow-amber-500/5',
          error: 'border-rose-200 bg-white shadow-lg shadow-rose-500/5',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borders[t.type]} transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900">{t.title}</p>
              {t.message && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
