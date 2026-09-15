import React, { useState } from 'react';
import { History, Download, Filter, Search, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const AuditLogView: React.FC = () => {
  const { auditLogs, searchQuery } = useTracker();
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const exportToCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Action', 'Entity Type', 'Entity ID', 'Summary'];
    const rows = filteredLogs.map(l => [
      l.id,
      new Date(l.timestamp).toLocaleString(),
      l.action,
      l.entityType,
      l.entityId,
      `"${l.summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `odoo_customization_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>System Audit Trail ({filteredLogs.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Timestamped history of all record creations, status changes, auto version bumps, and deletions</p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Audit Log to CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="font-semibold">Filter:</span>
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
        >
          <option value="all">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="VERSION_BUMP">VERSION_BUMP</option>
          <option value="DELETE">DELETE</option>
          <option value="RESET_ALL">RESET_ALL</option>
        </select>

        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
        >
          <option value="all">All Entities</option>
          <option value="Requirement">Requirement</option>
          <option value="Module">Module</option>
          <option value="CustomizationRequest">CustomizationRequest</option>
          <option value="Client">Client</option>
          <option value="Developer">Developer</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Entity ID</th>
                <th className="px-4 py-3">Audit Summary & Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      log.action === 'VERSION_BUMP' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      log.action === 'UPDATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-rose-950 text-rose-300 border border-rose-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[11px] font-sans font-semibold">{log.entityType}</td>
                  <td className="px-4 py-3 text-indigo-400 font-bold">{log.entityId}</td>
                  <td className="px-4 py-3 font-sans max-w-lg">
                    <div className="text-slate-200">{log.summary}</div>
                    {log.changes && log.changes.length > 0 && (
                      <div className="mt-1 font-mono text-[10px] text-amber-400 bg-slate-950/60 p-1.5 rounded border border-slate-800">
                        {log.changes.map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-slate-400">{c.field}:</span>
                            <span className="text-slate-400 line-through">{String(c.oldVal)}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 inline" />
                            <span className="text-emerald-400 font-bold">{String(c.newVal)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
