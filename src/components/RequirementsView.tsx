import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Calendar, User, Package, Edit, Trash2, Download, Paperclip } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Requirement, WorkflowStatus, Priority } from '../types';
import { FileUploader } from './FileUploader';

interface RequirementsViewProps {
  onOpenNewModuleWithReq?: (reqId: string) => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({ onOpenNewModuleWithReq }) => {
  const {
    requirements,
    clients,
    developers,
    searchQuery,
    openTraceModal,
    addRequirement,
    updateRequirement,
    deleteRequirement
  } = useTracker();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);

  // Form State
  const [clientId, setClientId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [title, setTitle] = useState('');
  const [detailedRequirement, setDetailedRequirement] = useState('');
  const [requirementDate, setRequirementDate] = useState(new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignedDeveloperId, setAssignedDeveloperId] = useState('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
  const [status, setStatus] = useState<WorkflowStatus>('New');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const openCreateModal = () => {
    setEditingReq(null);
    setClientId(clients[0]?.id || '');
    setProjectName('');
    setTitle('');
    setDetailedRequirement('');
    setRequirementDate(new Date().toISOString().slice(0, 10));
    setPriority('Medium');
    setAssignedDeveloperId(developers[0]?.id || '');
    setExpectedCompletionDate('');
    setStatus('New');
    setModalOpen(true);
  };

  const openEditModal = (req: Requirement) => {
    setEditingReq(req);
    setClientId(req.clientId);
    setProjectName(req.projectName);
    setTitle(req.title);
    setDetailedRequirement(req.detailedRequirement);
    setRequirementDate(req.requirementDate.slice(0, 10));
    setPriority(req.priority);
    setAssignedDeveloperId(req.assignedDeveloperId);
    setExpectedCompletionDate(req.expectedCompletionDate ? req.expectedCompletionDate.slice(0, 10) : '');
    setStatus(req.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      clientId,
      projectName,
      title,
      detailedRequirement,
      requirementDate: new Date(requirementDate).toISOString(),
      priority,
      assignedDeveloperId,
      expectedCompletionDate: expectedCompletionDate ? new Date(expectedCompletionDate).toISOString() : new Date().toISOString(),
      status
    };

    if (editingReq) {
      await updateRequirement(editingReq.id, payload);
    } else {
      await addRequirement(payload);
    }
    setModalOpen(false);
  };

  const filteredRequirements = requirements.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.detailedRequirement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Client Requirements ({filteredRequirements.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Record original requirements raised by clients prior to module creation</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Requirement</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="font-semibold">Filter:</span>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Analysis">Analysis</option>
          <option value="Development">Development</option>
          <option value="Internal Testing">Internal Testing</option>
          <option value="Ready for Client">Ready for Client</option>
          <option value="Client Testing">Client Testing</option>
          <option value="Changes Requested">Changes Requested</option>
          <option value="Rework">Rework</option>
          <option value="Approved">Approved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Requirements Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Req ID</th>
                <th className="px-4 py-3">Client & Project</th>
                <th className="px-4 py-3">Requirement Title</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assigned Dev</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequirements.map(req => {
                const client = clients.find(c => c.id === req.clientId);
                const dev = developers.find(d => d.id === req.assignedDeveloperId);

                return (
                  <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                      <button
                        onClick={() => openTraceModal('requirement', req.id)}
                        className="hover:underline"
                      >
                        {req.id}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{client?.name || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400">{req.projectName}</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-semibold text-slate-100">{req.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{req.detailedRequirement}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        req.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                          {dev?.name.charAt(0) || '?'}
                        </div>
                        <span>{dev?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(req.requirementDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={req.status}
                        onChange={e => updateRequirement(req.id, { status: e.target.value as WorkflowStatus })}
                        className="bg-slate-800 border border-slate-700/60 rounded px-2 py-1 text-[11px] font-medium text-slate-200 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Analysis">Analysis</option>
                        <option value="Development">Development</option>
                        <option value="Internal Testing">Internal Testing</option>
                        <option value="Ready for Client">Ready for Client</option>
                        <option value="Client Testing">Client Testing</option>
                        <option value="Changes Requested">Changes Requested</option>
                        <option value="Rework">Rework</option>
                        <option value="Approved">Approved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {onOpenNewModuleWithReq && (
                        <button
                          onClick={() => onOpenNewModuleWithReq(req.id)}
                          title="Create Custom Module from this requirement"
                          className="px-2 py-1 rounded bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 text-[10px] font-semibold transition-colors"
                        >
                          + Module
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(req)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteRequirement(req.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-100 text-sm">
                {editingReq ? `Edit Requirement (${editingReq.id})` : 'Log New Requirement'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Client *</label>
                  <select
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    placeholder="e.g. Nexus Sales Commission 2026"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Requirement Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Custom Sales Commission Module"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Requirement *</label>
                <textarea
                  value={detailedRequirement}
                  onChange={e => setDetailedRequirement(e.target.value)}
                  rows={3}
                  placeholder="Full description of the requirement raised by client..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Assigned Developer</label>
                  <select
                    value={assignedDeveloperId}
                    onChange={e => setAssignedDeveloperId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {developers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as WorkflowStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Analysis">Analysis</option>
                    <option value="Development">Development</option>
                    <option value="Internal Testing">Internal Testing</option>
                    <option value="Ready for Client">Ready for Client</option>
                    <option value="Client Testing">Client Testing</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Rework">Rework</option>
                    <option value="Approved">Approved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* File Attachment Uploader inside form */}
              {editingReq && (
                <div className="pt-2">
                  <FileUploader
                    entityType="Requirement"
                    entityId={editingReq.id}
                    attachments={editingReq.attachments}
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
