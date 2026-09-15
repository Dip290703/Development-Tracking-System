import React from 'react';
import {
  FileText,
  GitPullRequest,
  Package,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  ArrowRight,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { WorkflowStatus } from '../types';

export const Dashboard: React.FC = () => {
  const {
    requirements,
    modules,
    customizationRequests,
    clients,
    developers,
    openTraceModal,
    setActiveTab
  } = useTracker();

  // 10 Workflow stages
  const STAGES: WorkflowStatus[] = [
    'New',
    'Analysis',
    'Development',
    'Internal Testing',
    'Ready for Client',
    'Client Testing',
    'Changes Requested',
    'Rework',
    'Approved',
    'Closed'
  ];

  // Combine Requirements and Customization Requests for stage counting
  const allItems = [
    ...requirements.map(r => ({ id: r.id, type: 'Requirement', status: r.status, title: r.title, clientId: r.clientId, devId: r.assignedDeveloperId })),
    ...customizationRequests.map(c => ({ id: c.id, type: 'CR', status: c.developmentStatus, title: c.description, clientId: c.clientId, devId: c.assignedDeveloperId }))
  ];

  const getStageCount = (stage: WorkflowStatus) => {
    return allItems.filter(item => item.status === stage).length;
  };

  // Stat Card Metrics
  const activeRequirementsCount = requirements.filter(r => r.status !== 'Closed').length;
  const pendingNewCount = allItems.filter(i => i.status === 'New').length;
  const inDevOrTestCount = allItems.filter(i => ['Development', 'Internal Testing', 'Client Testing'].includes(i.status)).length;
  const clientReviewPendingCount = allItems.filter(i => ['Ready for Client', 'Client Testing'].includes(i.status)).length;
  const totalCRCount = customizationRequests.length;
  const reworkPendingCount = allItems.filter(i => i.status === 'Rework' || i.status === 'Changes Requested').length;
  const approvedCount = allItems.filter(i => i.status === 'Approved').length;
  const closedCount = allItems.filter(i => i.status === 'Closed').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border border-indigo-700/40 p-6 text-slate-100 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Odoo Online 19.0 (SaaS) Development Tracker
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Centralized Customization & Module Workload Dashboard</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Live tracking tool recording client requirements, custom module version history (V1.0 → V1.1 → V2.0), developer workload, client sign-offs, and file downloads.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('requirements')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Log Requirement</span>
            </button>
            <button
              onClick={() => setActiveTab('customization-requests')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Log Change Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. PIPELINE BAR (10 Stages) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Workflow Pipeline Bar</span>
            <span className="text-xs text-slate-400 font-normal">({allItems.length} active requirements & CRs across 10 stages)</span>
          </h3>
        </div>

        {/* Stages Visual Flow Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 pt-2">
          {STAGES.map((stage, index) => {
            const count = getStageCount(stage);
            const isHighlight = count > 0;
            return (
              <div
                key={stage}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isHighlight
                    ? 'bg-slate-800/90 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-medium truncate">{index + 1}. {stage}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-lg font-bold ${count > 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {count}
                  </span>
                  <span className="text-[9px] text-slate-500">records</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. STAT CARDS GRID (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Active Reqs</span>
          <span className="text-xl font-bold text-slate-100 mt-1 block">{activeRequirementsCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Pending (New)</span>
          <span className="text-xl font-bold text-indigo-400 mt-1 block">{pendingNewCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">In Dev/Test</span>
          <span className="text-xl font-bold text-purple-400 mt-1 block">{inDevOrTestCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Client Review</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{clientReviewPendingCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Total CRs</span>
          <span className="text-xl font-bold text-pink-400 mt-1 block">{totalCRCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Rework</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">{reworkPendingCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Approved</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{approvedCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Closed</span>
          <span className="text-xl font-bold text-slate-400 mt-1 block">{closedCount}</span>
        </div>
      </div>

      {/* 3. DEVELOPER WORKLOAD & CLIENT PENDING WORK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Developer Workload */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Developer Workload Allocation</span>
            </h3>
            <span className="text-xs text-slate-400">{developers.length} Developers</span>
          </div>

          <div className="space-y-3">
            {developers.map(dev => {
              const devItems = allItems.filter(i => i.devId === dev.id);
              const openDevItems = devItems.filter(i => i.status !== 'Closed' && i.status !== 'Approved');
              const totalDevItems = devItems.length;
              const percent = totalDevItems > 0 ? Math.round((openDevItems.length / totalDevItems) * 100) : 0;

              return (
                <div key={dev.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: dev.avatarColor || '#6366f1' }}
                      >
                        {dev.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200 block">{dev.name}</span>
                        <span className="text-[10px] text-slate-400">{dev.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-400">{openDevItems.length} open</span>
                      <span className="text-slate-400 text-[10px]"> / {totalDevItems} total items</span>
                    </div>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/40">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, totalDevItems > 0 ? 10 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client-Wise Pending Work */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Client-Wise Pending Work</span>
            </h3>
            <span className="text-xs text-slate-400">{clients.length} Clients</span>
          </div>

          <div className="space-y-3">
            {clients.map(client => {
              const clientReqs = requirements.filter(r => r.clientId === client.id);
              const clientCRs = customizationRequests.filter(c => c.clientId === client.id);
              const openCount = [...clientReqs, ...clientCRs].filter(x => ('status' in x ? x.status !== 'Closed' : x.developmentStatus !== 'Closed')).length;

              return (
                <div key={client.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-200">{client.name}</h4>
                    <p className="text-[10px] text-slate-400">{client.company} ({clientReqs.length} reqs, {clientCRs.length} CRs)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${openCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {openCount} Pending Items
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. MODULE-WISE CUSTOMIZATION HISTORY TABLE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>Module Customization History & Downloads</span>
            </h3>
            <p className="text-xs text-slate-400">Click any module to open its full 360° Traceability timeline & download developed packages</p>
          </div>
          <button
            onClick={() => setActiveTab('modules')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View All Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Module Name</th>
                <th className="px-4 py-3">Technical Name</th>
                <th className="px-4 py-3">Current Version</th>
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">CR Count</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {modules.map(mod => {
                const dev = developers.find(d => d.id === mod.developerId);
                const crs = customizationRequests.filter(c => c.relatedModuleId === mod.id);
                return (
                  <tr
                    key={mod.id}
                    onClick={() => openTraceModal('module', mod.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{mod.moduleName}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{mod.technicalName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-[11px]">
                        v{mod.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">{dev?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                        {crs.length} CRs
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                        {mod.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTraceModal('module', mod.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-[11px] font-semibold transition-colors"
                      >
                        Trace Timeline
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
