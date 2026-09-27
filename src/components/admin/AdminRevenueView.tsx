import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  PieChart,
  Layers,
} from 'lucide-react';

export const AdminRevenueView: React.FC = () => {
  const { saasClients, saasPayments, addToast } = useApp();

  const [granularity, setGranularity] = useState<'monthly' | 'quarterly'>('monthly');

  const mrr = saasClients.reduce((sum, c) => sum + (c.status === 'active' ? c.mrr : 0), 0);
  const arr = mrr * 12;
  const lifetimeCollected = saasPayments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const cohortData = [
    { cohort: 'Q1 2026', clients: 3, retention: '100%', revenue: '$14,200', arpu: '$1,090' },
    { cohort: 'Q2 2026', clients: 2, retention: '100%', revenue: '$18,600', arpu: '$1,250' },
    { cohort: 'Q3 2026', clients: 1, retention: '100%', revenue: '$25,100', arpu: '$1,320' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Revenue & Financial Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Track Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Net Expansion, and Customer Lifetime Value (LTV)
          </p>
        </div>

        <button
          onClick={() => addToast('info', 'Financial Model', 'Exporting SaaS Revenue & Cohort Retention report.')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Model</span>
        </button>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly Recurring Revenue</span>
          <div className="text-2xl font-black text-emerald-400">${mrr.toLocaleString()}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.5% MoM</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Annual Recurring Revenue Run-Rate</span>
          <div className="text-2xl font-black text-white">${arr.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Targeting $120k ARR for FY2026
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Lifetime Gross Collections</span>
          <div className="text-2xl font-black text-white">${lifetimeCollected.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across 142 total invoices
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Average Revenue Per User (ARPU)</span>
          <div className="text-2xl font-black text-indigo-400">${Math.round(mrr / Math.max(1, saasClients.length)).toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Highest in Luxury & Clinic verticals
          </div>
        </div>
      </div>

      {/* Cohorts & Net Expansion */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-white mb-1">Client Cohort Retention & Expansion</h3>
        <p className="text-xs text-slate-400 mb-4">Historical retention rates and ARPU progression over subscription quarters</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Cohort Period</th>
                <th className="py-2.5 px-3">New Tenants</th>
                <th className="py-2.5 px-3">Net Logo Retention</th>
                <th className="py-2.5 px-3">Cumulative Revenue</th>
                <th className="py-2.5 px-3">Average ARPU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cohortData.map((c) => (
                <tr key={c.cohort} className="hover:bg-slate-850/50">
                  <td className="py-3 px-3 font-bold text-white">{c.cohort}</td>
                  <td className="py-3 px-3 text-slate-300">{c.clients} Accounts</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{c.retention}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{c.revenue}</td>
                  <td className="py-3 px-3 text-slate-300">{c.arpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
