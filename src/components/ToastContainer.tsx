import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTracker();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-slide-up ${
              toast.type === 'success' ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' :
              toast.type === 'info' ? 'bg-slate-900/90 border-indigo-500/40 text-indigo-300' :
              toast.type === 'warning' ? 'bg-slate-900/90 border-amber-500/40 text-amber-300' :
              'bg-slate-900/90 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              <div>
                <h4 className="font-bold text-xs text-slate-100">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded ml-2 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
