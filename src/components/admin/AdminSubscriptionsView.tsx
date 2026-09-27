import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaaSSubscription } from '../../data/mockAdmin';
import {
  WalletCards,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  Calendar,
  CreditCard,
  Building2,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const AdminSubscriptionsView: React.FC = () => {
  const { saasSubscriptions, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSubs = saasSubscriptions.filter((sub) => {
    const matchesSearch =
      sub.businessName.toLowerCase().includes(search.toLowerCase()) ||
      sub.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SaaSSubscription['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Trial':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Past Due':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Cancelled':
      case 'Expired':
        return 'bg-slate-700/50 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Subscription Lifecycle Management
          </h1>
          <p className="text-xs text-slate-400">
            Monitor client billing cycles, renewal windows, and auto-collection status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Active Subscriptions: <strong className="text-emerald-400">{saasSubscriptions.filter(s => s.status === 'Active').length}</strong>
          </div>
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
            placeholder="Search by subscription ID or client..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Subscription States</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Past Due">Past Due</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Subscription ID</th>
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Billing Amount</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Next Renewal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">
                    {sub.id}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{sub.businessName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-[11px]">
                      {sub.plan}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-200">
                    ${sub.amount.toLocaleString()} / {sub.billingCycle}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {sub.startDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {sub.renewalDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${getStatusBadge(
                        sub.status
                      )}`}
                    >
                      <span>{sub.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => addToast('info', 'Subscription Invoice', `Retrieving Stripe receipt for ${sub.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Invoice
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
