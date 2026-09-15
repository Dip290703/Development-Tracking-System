import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Shield, Edit, Trash2 } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Developer } from '../types';

export const DevelopersView: React.FC = () => {
  const { developers, requirements, modules, customizationRequests, addDeveloper, updateDeveloper, deleteDeveloper } = useTracker();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<Developer | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const openCreateModal = () => {
    setEditingDev(null);
    setName('');
    setEmail('');
    setRole('Odoo Developer');
    setModalOpen(true);
  };

  const openEditModal = (dev: Developer) => {
    setEditingDev(dev);
    setName(dev.name);
    setEmail(dev.email);
    setRole(dev.role);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDev) {
      await updateDeveloper(editingDev.id, { name, email, role });
    } else {
      await addDeveloper({ name, email, role });
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <span>Developers Team ({developers.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Team members assigned across requirements, modules, and customization requests</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Developer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {developers.map(dev => {
          const assignedReqs = requirements.filter(r => r.assignedDeveloperId === dev.id);
          const assignedMods = modules.filter(m => m.developerId === dev.id);
          const assignedCRs = customizationRequests.filter(c => c.assignedDeveloperId === dev.id);

          return (
            <div key={dev.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: dev.avatarColor || '#6366f1' }}
                  >
                    {dev.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{dev.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{dev.role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => openEditModal(dev)} className="p-1 text-slate-400 hover:text-white">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteDeveloper(dev.id)} className="p-1 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dev.email}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>ID: {dev.id}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Requirements:</span>
                  <span className="font-bold text-indigo-300">{assignedReqs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Modules:</span>
                  <span className="font-bold text-purple-300">{assignedMods.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customization Requests:</span>
                  <span className="font-bold text-pink-300">{assignedCRs.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-100 text-sm">
                {editingDev ? 'Edit Developer' : 'Add New Developer'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Developer Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="alex@odoo-dev.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role / Title *</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                  placeholder="e.g. Senior Odoo Technical Lead"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

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
                  Save Developer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
