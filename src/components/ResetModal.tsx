import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const ResetModal: React.FC = () => {
  const { isResetModalOpen, closeResetModal, resetAllData } = useTracker();
  const [confirmText, setConfirmText] = useState('');
  const [resetting, setResetting] = useState(false);

  if (!isResetModalOpen) return null;

  const handleReset = async () => {
    if (confirmText !== 'RESET') return;
    setResetting(true);
    await resetAllData();
    setResetting(false);
    setConfirmText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 text-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Reset All Data</h3>
          </div>
          <button onClick={closeResetModal} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <p className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-300 leading-relaxed font-semibold">
            Warning: This action permanently erases every requirement, custom module, customization request, client, developer record, and audit log for everyone on the team.
          </p>
          <p className="text-slate-400">This action cannot be undone. To proceed, type <strong className="text-white font-mono">RESET</strong> below:</p>
        </div>

        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="Type RESET to confirm"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={closeResetModal}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            disabled={confirmText !== 'RESET' || resetting}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
              confirmText === 'RESET' && !resetting
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetting ? 'Resetting System...' : 'Permanently Reset Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
