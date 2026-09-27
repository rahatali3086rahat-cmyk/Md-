import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaaSPayment } from '../../data/mockAdmin';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  Search,
  Download,
  Filter,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const AdminPaymentsView: React.FC = () => {
  const { saasPayments, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // KPI Calculations
  const totalRevenue = saasPayments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = 6550; // Current active MRR
  const successfulPayments = saasPayments.filter((p) => p.status === 'Paid').length;
  const failedPayments = saasPayments.filter((p) => p.status === 'Failed').length;
  const refundsTotal = saasPayments.filter((p) => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);
  const outstandingTotal = 1950; // In grace period / invoice pending

  const filteredPayments = saasPayments.filter((p) => {
    const matchesSearch =
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SaaSPayment['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Failed':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Refunded':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const handleExportCsv = () => {
    addToast('success', 'Export Dispatched', 'Generating cryptographic CSV ledger of all settled SaaS transactions.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            SaaS Payments & Financial Settlements
          </h1>
          <p className="text-xs text-slate-400">
            Audit Stripe, Apple Pay, and GCC bank card transactions for all tenant subscriptions
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* 6 Required Payment KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Revenue</span>
          <span className="text-xl font-black text-white">${totalRevenue.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Monthly Revenue</span>
          <span className="text-xl font-black text-emerald-400">${monthlyRevenue.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Successful</span>
          <span className="text-xl font-black text-emerald-400">{successfulPayments}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Failed Payments</span>
          <span className="text-xl font-black text-rose-400">{failedPayments}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Refunds Settled</span>
          <span className="text-xl font-black text-amber-400">${refundsTotal.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Outstanding</span>
          <span className="text-xl font-black text-blue-400">${outstandingTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID, ref, or client..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                    <div>{p.id}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{p.transactionRef}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{p.businessName}</span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-200">
                    ${p.amount.toLocaleString()} {p.currency}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-bold text-[10.5px]">
                      {p.plan}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {p.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      <span>{p.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {p.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => addToast('info', 'Receipt Exported', `Opening PDF receipt for ${p.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      View
                    </button>
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
