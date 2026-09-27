import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gauge,
  Bot,
  Globe,
  Zap,
  Building2,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Layers,
} from 'lucide-react';

export const AdminUsageView: React.FC = () => {
  const { saasClients, addToast } = useApp();

  const totalTokens = saasClients.reduce((sum, c) => sum + c.usage.aiTokensUsed, 0);
  const totalWhatsApp = saasClients.reduce((sum, c) => sum + c.usage.whatsappMessages, 0);
  const totalWebhooks = saasClients.reduce((sum, c) => sum + c.usage.webhookCalls, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Tenant Resource Consumption & Quotas
          </h1>
          <p className="text-xs text-slate-400">
            Real-time aggregate consumption of LLM tokens, Meta WhatsApp Cloud API conversations, and n8n webhook triggers
          </p>
        </div>
      </div>

      {/* Global Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total AI Tokens (Mtd)</span>
              <span className="text-xl font-black text-white">{totalTokens.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Powered by Gemini 2.5 Flash & Pro</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">WhatsApp Messages Delivered</span>
              <span className="text-xl font-black text-white">{totalWhatsApp.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Meta Cloud API Enterprise Tier</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">n8n Automation Invocations</span>
              <span className="text-xl font-black text-white">{totalWebhooks.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Self-hosted workflow webhook triggers</span>
        </div>
      </div>

      {/* Quotas per Tenant Table */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-white mb-1">Per-Tenant Quota Utilization</h3>
        <p className="text-xs text-slate-400 mb-4">Breakdown of tenant usage against plan thresholds</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Client Business</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">WhatsApp Usage</th>
                <th className="py-2.5 px-3">AI Token Consumption</th>
                <th className="py-2.5 px-3">n8n Executions</th>
                <th className="py-2.5 px-3 text-right">Quota Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {saasClients.map((client) => {
                const waPercent = Math.round((client.usage.whatsappMessages / client.usage.whatsappLimit) * 100);
                const tokenPercent = Math.round((client.usage.aiTokensUsed / client.usage.aiTokensLimit) * 100);

                return (
                  <tr key={client.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{client.businessName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-[10.5px]">
                        {client.plan}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, waPercent)}%` }}
                            className={`h-full rounded-full ${waPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                        <span className="text-slate-300">{waPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, tokenPercent)}%` }}
                            className={`h-full rounded-full ${tokenPercent > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          />
                        </div>
                        <span className="text-slate-300">{tokenPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {client.usage.webhookCalls.toLocaleString()} runs
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Within Limits
                      </span>
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
