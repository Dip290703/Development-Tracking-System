import React, { useState } from 'react';
import { Plus, Package, Calendar, User, Edit, Trash2, Download, GitBranch, ShieldCheck } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Module, ModuleStatus } from '../types';
import { FileUploader } from './FileUploader';

interface ModulesViewProps {
  initialReqId?: string;
}

export const ModulesView: React.FC<ModulesViewProps> = ({ initialReqId }) => {
  const {
    modules,
    requirements,
    developers,
    searchQuery,
    openTraceModal,
    addModule,
    updateModule,
    deleteModule
  } = useTracker();

  const [modalOpen, setModalOpen] = useState(!!initialReqId);
  const [editingMod, setEditingMod] = useState<Module | null>(null);

  // Form state
  const [linkedRequirementId, setLinkedRequirementId] = useState(initialReqId || (requirements[0]?.id || ''));
  const [moduleName, setModuleName] = useState('');
  const [technicalName, setTechnicalName] = useState('');
  const [odooVersion, setOdooVersion] = useState('19.0');
  const [devStartDate, setDevStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [developerId, setDeveloperId] = useState(developers[0]?.id || '');
  const [status, setStatus] = useState<ModuleStatus>('Planning');
  const [completionDate, setCompletionDate] = useState('');
  const [version, setVersion] = useState('1.0');

  const openCreateModal = () => {
    setEditingMod(null);
    setLinkedRequirementId(requirements[0]?.id || '');
    setModuleName('');
    setTechnicalName('');
    setOdooVersion('19.0');
    setDevStartDate(new Date().toISOString().slice(0, 10));
    setDeveloperId(developers[0]?.id || '');
    setStatus('Planning');
    setCompletionDate('');
    setVersion('1.0');
    setModalOpen(true);
  };

  const openEditModal = (mod: Module) => {
    setEditingMod(mod);
    setLinkedRequirementId(mod.linkedRequirementId);
    setModuleName(mod.moduleName);
    setTechnicalName(mod.technicalName);
    setOdooVersion(mod.odooVersion || '19.0');
    setDevStartDate(mod.devStartDate.slice(0, 10));
    setDeveloperId(mod.developerId);
    setStatus(mod.status);
    setCompletionDate(mod.completionDate ? mod.completionDate.slice(0, 10) : '');
    setVersion(mod.version);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      linkedRequirementId,
      moduleName,
      technicalName,
      odooVersion,
      devStartDate: new Date(devStartDate).toISOString(),
      developerId,
      status,
      completionDate: completionDate ? new Date(completionDate).toISOString() : new Date().toISOString(),
      version
    };

    if (editingMod) {
      await updateModule(editingMod.id, payload);
    } else {
      await addModule(payload);
    }
    setModalOpen(false);
  };

  const filteredModules = modules.filter(m => {
    return (
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.technicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.linkedRequirementId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            <span>Custom Odoo 19 Modules ({filteredModules.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Custom Odoo modules being developed, versioned, and package archives for team lead download</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Module</span>
        </button>
      </div>

      {/* Modules Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map(mod => {
          const req = requirements.find(r => r.id === mod.linkedRequirementId);
          const dev = developers.find(d => d.id === mod.developerId);

          return (
            <div
              key={mod.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-400">{mod.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-bold">
                      v{mod.version}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Odoo {mod.odooVersion}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm mb-1">{mod.moduleName}</h3>
                <p className="font-mono text-xs text-indigo-400/90 mb-3 flex items-center gap-1">
                  <code>{mod.technicalName}</code>
                </p>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5 text-xs text-slate-300 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Linked Requirement:</span>
                    <span className="font-mono font-bold text-indigo-300">{mod.linkedRequirementId}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Developer:</span>
                    <span className="font-semibold text-slate-200">{dev?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Development Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                      {mod.status}
                    </span>
                  </div>
                </div>

                {/* Attached Files & Download links */}
                {mod.attachments && mod.attachments.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block">Module Code Files ({mod.attachments.length})</span>
                    {mod.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-1.5 rounded bg-slate-800/80 text-[11px]">
                        <span className="truncate pr-2 font-mono text-slate-300">{att.name}</span>
                        <a
                          href={att.url}
                          download={att.name}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 text-[10px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openTraceModal('module', mod.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Trace Timeline</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(mod)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteModule(mod.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-100 text-sm">
                {editingMod ? `Edit Module (${editingMod.id})` : 'Initialize New Custom Module'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Linked Requirement *</label>
                <select
                  value={linkedRequirementId}
                  onChange={e => setLinkedRequirementId(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                >
                  {requirements.map(r => (
                    <option key={r.id} value={r.id}>{r.id} — {r.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Module Display Name *</label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={e => setModuleName(e.target.value)}
                    placeholder="e.g. Sales Commission Manager"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Odoo Technical Name *</label>
                  <input
                    type="text"
                    value={technicalName}
                    onChange={e => setTechnicalName(e.target.value)}
                    placeholder="e.g. sale_commission_custom"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Odoo Version</label>
                  <input
                    type="text"
                    value={odooVersion}
                    onChange={e => setOdooVersion(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Initial Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Developer</label>
                  <select
                    value={developerId}
                    onChange={e => setDeveloperId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {developers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={devStartDate}
                    onChange={e => setDevStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ModuleStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In development">In development</option>
                    <option value="Internal testing">Internal testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Deployed">Deployed</option>
                  </select>
                </div>
              </div>

              {/* Upload module package / zip files */}
              {editingMod && (
                <div className="pt-2">
                  <FileUploader
                    entityType="Module"
                    entityId={editingMod.id}
                    attachments={editingMod.attachments}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
