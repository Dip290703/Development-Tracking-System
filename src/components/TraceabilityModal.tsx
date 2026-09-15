import React from 'react';
import { X, GitBranch, Calendar, User, CheckCircle2, Clock, FileText, Download, Tag, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const TraceabilityModal: React.FC = () => {
  const {
    traceTarget,
    closeTraceModal,
    requirements,
    modules,
    customizationRequests,
    clients,
    developers
  } = useTracker();

  if (!traceTarget) return null;

  // Find root requirement & target module
  let targetReq = requirements.find(r => r.id === traceTarget.id);
  let targetMod = modules.find(m => m.id === traceTarget.id);

  if (traceTarget.type === 'requirement' && targetReq) {
    targetMod = modules.find(m => m.linkedRequirementId === targetReq?.id);
  } else if (traceTarget.type === 'module' && targetMod) {
    targetReq = requirements.find(r => r.id === targetMod?.linkedRequirementId);
  }

  const client = clients.find(c => c.id === targetReq?.clientId || targetMod?.developerId);
  const modDeveloper = developers.find(d => d.id === targetMod?.developerId);
  const reqDeveloper = developers.find(d => d.id === targetReq?.assignedDeveloperId);

  // Customization requests linked to this module or requirement
  const relatedCRs = customizationRequests.filter(
    cr => (targetMod && cr.relatedModuleId === targetMod.id) || (targetReq && cr.originalRequirementId === targetReq.id)
  ).sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());

  // Collect all file attachments across root requirement, module, and CRs
  const allAttachments = [
    ...(targetReq?.attachments || []),
    ...(targetMod?.attachments || []),
    ...relatedCRs.flatMap(cr => cr.attachments || [])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Traceability Timeline</h3>
                {targetMod && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                    v{targetMod.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Full requirement to production deployment audit trail</p>
            </div>
          </div>
          <button
            onClick={closeTraceModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Quick Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Client & Project</span>
              <p className="font-semibold text-slate-100">{client?.name || 'N/A'}</p>
              <p className="text-slate-400 text-[11px]">{targetReq?.projectName || 'Standard Module'}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Module Name</span>
              <p className="font-semibold text-slate-100">{targetMod?.moduleName || 'Pending creation'}</p>
              <p className="font-mono text-indigo-400 text-[11px]">{targetMod?.technicalName || '—'}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Lead Developer</span>
              <p className="font-semibold text-slate-100">{modDeveloper?.name || reqDeveloper?.name || 'Unassigned'}</p>
              <p className="text-slate-400 text-[11px]">{modDeveloper?.role || 'Developer'}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Current Status</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold inline-block">
                {targetMod?.status || targetReq?.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Downloadable Files Banner */}
          {allAttachments.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Module Package & Spec Attachments ({allAttachments.length})</span>
                </h4>
                <span className="text-[11px] text-indigo-400">Team leads can download & deploy code directly</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allAttachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs">
                    <span className="truncate pr-2 font-mono text-slate-300">{file.name}</span>
                    <a
                      href={file.url}
                      download={file.name}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Step-by-Step Chronological Timeline */}
          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8 my-4">
            
            {/* Stage 1: Root Requirement */}
            {targetReq ? (
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white ring-4 ring-slate-900 text-xs font-bold">
                  1
                </div>
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-indigo-400 font-bold">{targetReq.id}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(targetReq.requirementDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100">{targetReq.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    "{targetReq.detailedRequirement}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Priority: <strong className="text-slate-200">{targetReq.priority}</strong></span>
                    <span>Assigned: <strong className="text-slate-200">{reqDeveloper?.name || 'Unassigned'}</strong></span>
                    <span>Expected: <strong className="text-slate-200">{new Date(targetReq.expectedCompletionDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-xs italic">No root requirement record attached.</div>
            )}

            {/* Stage 2: Module Development Initialized */}
            {targetMod && (
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white ring-4 ring-slate-900 text-xs font-bold">
                  2
                </div>
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-purple-400 font-bold">{targetMod.id}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold">
                        v{targetMod.version} Initialized
                      </span>
                    </div>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Start: {new Date(targetMod.devStartDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100">{targetMod.moduleName}</h4>
                  <p className="text-xs text-slate-400 font-mono">Odoo Technical Name: {targetMod.technicalName} (Odoo {targetMod.odooVersion})</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Developer: <strong className="text-slate-200">{modDeveloper?.name}</strong></span>
                    <span>Target Completion: <strong className="text-slate-200">{new Date(targetMod.completionDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: Follow-Up Customization Requests */}
            {relatedCRs.length > 0 ? (
              relatedCRs.map((cr, idx) => {
                const crDev = developers.find(d => d.id === cr.assignedDeveloperId);
                return (
                  <div key={cr.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center text-white ring-4 ring-slate-900 text-xs font-bold">
                      {3 + idx}
                    </div>
                    <div className="bg-slate-800/60 border border-pink-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-pink-400 font-bold">{cr.id}</span>
                          <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[11px] font-semibold">
                            Customization Request
                          </span>
                        </div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(cr.requestDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-200 text-xs mb-1">Requested Change:</h5>
                        <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          {cr.description}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-400 text-[11px] mb-1">Business Reason:</h5>
                        <p className="text-xs text-slate-400 italic">"{cr.reason}"</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-700/50">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Developer</span>
                          <span className="font-medium text-slate-200">{crDev?.name || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Testing Status</span>
                          <span className="font-medium text-indigo-300">{cr.testingStatus}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Client Review & Approval</span>
                          <span className={`font-semibold ${cr.developmentStatus === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {cr.developmentStatus}
                          </span>
                        </div>
                      </div>

                      {cr.clientFeedback && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-[10px] uppercase tracking-wide text-amber-300">Client Feedback:</span>
                            <span>"{cr.clientFeedback}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No follow-up customization requests logged yet. Module is at V1.0 baseline.</span>
              </div>
            )}

            {/* Version Bump History Summary */}
            {targetMod?.versionHistory && targetMod.versionHistory.length > 0 && (
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-slate-900 text-xs font-bold">
                  ✓
                </div>
                <div className="bg-slate-800/80 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Module Version Release History</span>
                  </h4>
                  <div className="space-y-1.5">
                    {targetMod.versionHistory.map((vh, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-900/60 border border-slate-800 font-mono">
                        <span className="text-emerald-300 font-bold">{vh.version}</span>
                        <span className="text-slate-300 truncate px-2">{vh.note}</span>
                        <span className="text-slate-400 text-[10px]">{new Date(vh.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900/90">
          <button
            onClick={closeTraceModal}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Close Traceability Panel
          </button>
        </div>

      </div>
    </div>
  );
};
