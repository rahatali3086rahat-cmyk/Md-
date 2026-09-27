import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminAuditLog } from '../../data/mockAdmin';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Clock,
  Download,
} from 'lucide-react';

export const AdminAuditLogsView: React.FC = () => {
  const { adminAuditLogs, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');

  const filteredLogs = adminAuditLogs.filter((log) => {
    const matchesSearch =
      log.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchesResult = resultFilter === 'all' || log.result.toLowerCase() === resultFilter.toLowerCase();
    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Cryptographic Admin Audit Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Immutable log of all operator actions, credential touches, status changes, and plan upgrades
          </p>
        </div>

        <button
          onClick={() => addToast('info', 'Audit Exported', 'Downloading SHA-256 verified audit ledger log.')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Records</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by admin, action, target, or IP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Results</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">IP & Region</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-white">
                    <div>{log.adminName}</div>
                    <div className="text-[11px] text-slate-500">{log.adminEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-indigo-300">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-200 font-mono text-[11px]">
                    {log.target}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="font-mono text-[11px] text-slate-300">{log.ipAddress}</div>
                    <div className="text-[10px] text-slate-500">{log.location}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border capitalize ${
                        log.result.toLowerCase() === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : log.result.toLowerCase() === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <span>{log.result}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                    {log.details || log.action || '—'}
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
