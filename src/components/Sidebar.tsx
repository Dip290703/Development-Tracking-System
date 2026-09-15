import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Package,
  GitPullRequest,
  Users,
  UserCheck,
  History,
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { TabSection } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    requirements,
    modules,
    customizationRequests,
    clients,
    developers,
    auditLogs,
    openResetModal,
    connected
  } = useTracker();

  const navItems: { id: TabSection; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, count: 0 },
    { id: 'requirements', label: 'Requirements', icon: <FileText className="w-5 h-5" />, count: requirements.length },
    { id: 'modules', label: 'Modules', icon: <Package className="w-5 h-5" />, count: modules.length },
    { id: 'customization-requests', label: 'Customization requests', icon: <GitPullRequest className="w-5 h-5" />, count: customizationRequests.length },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" />, count: clients.length },
    { id: 'developers', label: 'Developers', icon: <UserCheck className="w-5 h-5" />, count: developers.length },
    { id: 'audit-log', label: 'Audit log', icon: <History className="w-5 h-5" />, count: auditLogs.length }
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none backdrop-blur-md">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm tracking-wide">Customization Tracker</h1>
              <p className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 inline" /> Odoo 19.0 SaaS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.id !== 'dashboard' && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Reset Button */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {connected ? 'Live Sync Active' : 'Connecting...'}
          </span>
          <span className="text-slate-500 text-[10px] font-mono">v19.0-SaaS</span>
        </div>

        <button
          onClick={openResetModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset all data</span>
        </button>
      </div>
    </aside>
  );
};
