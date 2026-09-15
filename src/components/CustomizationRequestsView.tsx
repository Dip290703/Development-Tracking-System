import React, { useState } from 'react';
import { Plus, GitPullRequest, Calendar, User, Package, Edit, Trash2, Download, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { CustomizationRequest, WorkflowStatus, Priority, TestingStatus, ClientReviewStatus, FinalApprovalStatus } from '../types';
import { FileUploader } from './FileUploader';

export const CustomizationRequestsView: React.FC = () => {
  const {
    customizationRequests,
    modules,
    requirements,
    clients,
    developers,
    searchQuery,
    openTraceModal,
    addCustomizationRequest,
    updateCustomizationRequest,
    deleteCustomizationRequest
  } = useTracker();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCr, setEditingCr] = useState<CustomizationRequest | null>(null);

  // Form State
  const [relatedModuleId, setRelatedModuleId] = useState(modules[0]?.id || '');
  const [originalRequirementId, setOriginalRequirementId] = useState(requirements[0]?.id || '');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [assignedDeveloperId, setAssignedDeveloperId] = useState(developers[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('High');
  const [developmentStatus, setDevelopmentStatus] = useState<WorkflowStatus>('New');
  const [devStartDate, setDevStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [devCompletionDate, setDevCompletionDate] = useState('');
  const [testingStatus, setTestingStatus] = useState<TestingStatus>('Not started');
  const [clientReviewStatus, setClientReviewStatus] = useState<ClientReviewStatus>('Pending');
  const [clientFeedback, setClientFeedback] = useState('');
  const [finalApproval, setFinalApproval] = useState<FinalApprovalStatus>('Pending');

  const openCreateModal = () => {
    setEditingCr(null);
    const firstMod = modules[0];
    setRelatedModuleId(firstMod?.id || '');
    setOriginalRequirementId(firstMod?.linkedRequirementId || requirements[0]?.id || '');
    setClientId(clients[0]?.id || '');
    setRequestDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setReason('');
    setAssignedDeveloperId(developers[0]?.id || '');
    setPriority('High');
    setDevelopmentStatus('New');
    setDevStartDate(new Date().toISOString().slice(0, 10));
    setDevCompletionDate('');
    setTestingStatus('Not started');
    setClientReviewStatus('Pending');
    setClientFeedback('');
    setFinalApproval('Pending');
    setModalOpen(true);
  };

  const openEditModal = (cr: CustomizationRequest) => {
    setEditingCr(cr);
    setRelatedModuleId(cr.relatedModuleId);
    setOriginalRequirementId(cr.originalRequirementId);
    setClientId(cr.clientId);
    setRequestDate(cr.requestDate.slice(0, 10));
    setDescription(cr.description);
    setReason(cr.reason);
    setAssignedDeveloperId(cr.assignedDeveloperId);
    setPriority(cr.priority);
    setDevelopmentStatus(cr.developmentStatus);
    setDevStartDate(cr.devStartDate ? cr.devStartDate.slice(0, 10) : '');
    setDevCompletionDate(cr.devCompletionDate ? cr.devCompletionDate.slice(0, 10) : '');
    setTestingStatus(cr.testingStatus);
    setClientReviewStatus(cr.clientReviewStatus);
    setClientFeedback(cr.clientFeedback);
    setFinalApproval(cr.finalApproval);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      relatedModuleId,
      originalRequirementId,
      clientId,
      requestDate: new Date(requestDate).toISOString(),
      description,
      reason,
      assignedDeveloperId,
      priority,
      developmentStatus,
      devStartDate: devStartDate ? new Date(devStartDate).toISOString() : new Date().toISOString(),
      devCompletionDate: devCompletionDate ? new Date(devCompletionDate).toISOString() : new Date().toISOString(),
      testingStatus,
      clientReviewStatus,
      clientFeedback,
      finalApproval
    };

    if (editingCr) {
      await updateCustomizationRequest(editingCr.id, payload);
    } else {
      await addCustomizationRequest(payload);
    }
    setModalOpen(false);
  };

  const filteredCRs = customizationRequests.filter(cr => {
    return (
      cr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cr.relatedModuleId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-pink-400" />
            <span>Customization Requests ({filteredCRs.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Post-delivery change requests that auto-increment module versions on Approval (e.g. V1.0 → V1.1)</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Customization Request</span>
        </button>
      </div>

      {/* Auto Version Banner Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-700/40 text-xs text-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Automatic Version Bump Rule:</strong> Setting Development Status to <strong>Approved</strong> automatically bumps the linked module version (e.g. v1.0 → v1.1) and logs an entry in audit trail.
          </span>
        </div>
      </div>

      {/* CR Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">CR ID</th>
                <th className="px-4 py-3">Related Module & Req</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Change Description & Reason</th>
                <th className="px-4 py-3">Dev</th>
                <th className="px-4 py-3">Dev Status</th>
                <th className="px-4 py-3">Testing Status</th>
                <th className="px-4 py-3">Final Sign-off</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCRs.map(cr => {
                const mod = modules.find(m => m.id === cr.relatedModuleId);
                const client = clients.find(c => c.id === cr.clientId);
                const dev = developers.find(d => d.id === cr.assignedDeveloperId);

                return (
                  <tr key={cr.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-pink-400">
                      <button
                        onClick={() => openTraceModal('module', cr.relatedModuleId)}
                        className="hover:underline"
                      >
                        {cr.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-indigo-300">{cr.relatedModuleId} <span className="text-slate-400 text-[10px] font-normal">(v{mod?.version || '1.0'})</span></div>
                      <div className="text-[10px] text-slate-400">{cr.originalRequirementId}</div>
                    </td>
                    <td className="px-4 py-3">{client?.name || 'N/A'}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-semibold text-slate-100">{cr.description}</div>
                      <div className="text-[10px] text-slate-400 italic line-clamp-1">"{cr.reason}"</div>
                    </td>
                    <td className="px-4 py-3">{dev?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={cr.developmentStatus}
                        onChange={e => updateCustomizationRequest(cr.id, { developmentStatus: e.target.value as WorkflowStatus })}
                        className={`border rounded px-2 py-1 text-[11px] font-bold focus:outline-none ${
                          cr.developmentStatus === 'Approved'
                            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800 border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Analysis">Analysis</option>
                        <option value="Development">Development</option>
                        <option value="Internal Testing">Internal Testing</option>
                        <option value="Ready for Client">Ready for Client</option>
                        <option value="Client Testing">Client Testing</option>
                        <option value="Changes Requested">Changes Requested</option>
                        <option value="Rework">Rework</option>
                        <option value="Approved">Approved (Auto Bump)</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px] border border-slate-700">
                        {cr.testingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        cr.finalApproval === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cr.finalApproval}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(cr)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomizationRequest(cr.id)}
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
                {editingCr ? `Edit Customization Request (${editingCr.id})` : 'Log Customization Request'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Related Module *</label>
                  <select
                    value={relatedModuleId}
                    onChange={e => {
                      const modId = e.target.value;
                      setRelatedModuleId(modId);
                      const mod = modules.find(m => m.id === modId);
                      if (mod) setOriginalRequirementId(mod.linkedRequirementId);
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.id} — {m.moduleName} (v{m.version})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Original Requirement</label>
                  <select
                    value={originalRequirementId}
                    onChange={e => setOriginalRequirementId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  >
                    {requirements.map(r => (
                      <option key={r.id} value={r.id}>{r.id} — {r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Client</label>
                  <select
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description of Requested Change *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Exact description of what the client wants changed..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason for Change *</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Business driver or bug reason..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Developer</label>
                  <select
                    value={assignedDeveloperId}
                    onChange={e => setAssignedDeveloperId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {developers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Development Status</label>
                  <select
                    value={developmentStatus}
                    onChange={e => setDevelopmentStatus(e.target.value as WorkflowStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-bold"
                  >
                    <option value="New">New</option>
                    <option value="Analysis">Analysis</option>
                    <option value="Development">Development</option>
                    <option value="Internal Testing">Internal Testing</option>
                    <option value="Ready for Client">Ready for Client</option>
                    <option value="Client Testing">Client Testing</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Rework">Rework</option>
                    <option value="Approved">Approved (Trigger Auto Version Bump)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Testing Status</label>
                  <select
                    value={testingStatus}
                    onChange={e => setTestingStatus(e.target.value as TestingStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Not started">Not started</option>
                    <option value="Internal testing">Internal testing</option>
                    <option value="Client testing">Client testing</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Client Feedback Log</label>
                <textarea
                  value={clientFeedback}
                  onChange={e => setClientFeedback(e.target.value)}
                  rows={2}
                  placeholder="Record verbatim client review comments..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              {editingCr && (
                <div className="pt-2">
                  <FileUploader
                    entityType="CustomizationRequest"
                    entityId={editingCr.id}
                    attachments={editingCr.attachments}
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
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold"
                >
                  Save Customization Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
