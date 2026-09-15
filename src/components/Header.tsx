import React, { useState } from 'react';
import { Search, Sun, Moon, Plus, FileText, Package, GitPullRequest } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { TabSection } from '../types';

interface HeaderProps {
  onOpenNewRequirement?: () => void;
  onOpenNewModule?: () => void;
  onOpenNewCR?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewRequirement,
  onOpenNewModule,
  onOpenNewCR
}) => {
  const { activeTab, searchQuery, setSearchQuery, theme, toggleTheme } = useTracker();
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const getTitle = (tab: TabSection) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', desc: 'Live overview of requirements, modules, pipeline stages & workload' };
      case 'requirements':
        return { title: 'Requirements', desc: 'Original client requirements and initial specification details' };
      case 'modules':
        return { title: 'Modules', desc: 'Custom Odoo 19.0 modules being developed and versioned' };
      case 'customization-requests':
        return { title: 'Customization Requests', desc: 'Follow-up change requests, client feedback, and auto-version triggers' };
      case 'clients':
        return { title: 'Clients', desc: 'Client directory and associated custom development history' };
      case 'developers':
        return { title: 'Developers', desc: 'Team member allocation and active module workload metrics' };
      case 'audit-log':
        return { title: 'Audit Log', desc: 'Complete timestamped audit history of system actions and version bumps' };
    }
  };

  const info = getTitle(activeTab);

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">{info.title}</h2>
        <p className="text-xs text-slate-400 hidden sm:block">{info.desc}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search REQ, MOD, CR, clients..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Record</span>
          </button>

          {quickMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setQuickMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 py-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewRequirement?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>New Requirement</span>
                </button>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewModule?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                >
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>New Module</span>
                </button>
                <button
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewCR?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                >
                  <GitPullRequest className="w-4 h-4 text-pink-400" />
                  <span>New Customization Request</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};
