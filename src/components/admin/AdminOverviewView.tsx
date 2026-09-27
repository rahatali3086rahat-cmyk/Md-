import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export const AdminOverviewView: React.FC = () => {
  const {
    saasClients,
    saasSubscriptions,
    saasPayments,
    saasHealthServices,
    setCurrentView,
    addToast,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');

  // Computed metrics
  const totalClients = saasClients.length;
  const activeClients = saasClients.filter((c) => c.status === 'active').length;
  const inactiveClients = saasClients.filter((c) => c.status === 'suspended' || c.status === 'cancelled').length;
  const newClients = saasClients.filter((c) => c.createdDate.startsWith('2026-09') || c.status === 'trial').length;
  const activeSubscriptions = saasSubscriptions.filter((s) => s.status === 'Active').length;
  
  // MRR & Total Revenue
  const mrrTotal = saasClients.reduce((sum, c) => sum + (c.status === 'active' ? c.mrr : 0), 0);
  const totalSaaSRevenue = saasPayments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const failedPaymentsCount = saasPayments.filter((p) => p.status === 'Failed').length;

  const revenueMonthlySeries = [
    { month: 'Apr 2026', revenue: 4200, clients: 3 },
    { month: 'May 2026', revenue: 4800, clients: 4 },
    { month: 'Jun 2026', revenue: 5200, clients: 4 },
    { month: 'Jul 2026', revenue: 5900, clients: 5 },
    { month: 'Aug 2026', revenue: 6200, clients: 5 },
    { month: 'Sep 2026', revenue: 6550, clients: 6 },
  ];

  const maxMonthlyRev = Math.max(...revenueMonthlySeries.map((r) => r.revenue), 10000);

  const planStats = [
    { name: 'Starter', count: 1, color: 'bg-slate-400', percentage: 17, price: '$250/mo' },
    { name: 'Professional', count: 2, color: 'bg-blue-500', percentage: 33, price: '$650/mo' },
    { name: 'Business', count: 2, color: 'bg-emerald-500', percentage: 33, price: '$1,250/mo' },
    { name: 'Enterprise', count: 1, color: 'bg-indigo-500', percentage: 17, price: '$2,500/mo' },
  ];

  return (
    <div className="space-y-6">
      {/* SaaS Mode Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-indigo-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-900/60 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm block">
              ScaleUp Gulf AI — Platform Owner Executive Cockpit
            </span>
            <span className="text-slate-400">
              Live multi-tenant telemetry for Gulf & international enterprise accounts. PostgreSQL RLS isolation active.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            Live Verified Sandbox
          </span>
          <button
            onClick={() => addToast('info', 'Telemetry Synced', 'Refreshed system metrics from Core API gateway.')}
            className="p-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 transition-colors cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Clients</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalClients}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+33% QoQ</span>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Clients</span>
            <span className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{activeClients}</div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            {Math.round((activeClients / totalClients) * 100)}% active engagement
          </div>
        </div>

        {/* Inactive / Suspended */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Inactive Clients</span>
            <span className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400">
              <UserX className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">{inactiveClients}</div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            1 past due payment
          </div>
        </div>

        {/* New Clients */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">New Clients (Mtd)</span>
            <span className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400">
              <UserPlus className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400">+{newClients}</div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            1 in trial evaluation
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Subs</span>
            <span className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{activeSubscriptions}</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-semibold">
            100% auto-renewing
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Monthly Revenue (MRR)</span>
            <span className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            ${mrrTotal.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            ARR Run-Rate: ${(mrrTotal * 12).toLocaleString()}
          </div>
        </div>

        {/* Total Lifetime Revenue */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total SaaS Revenue</span>
            <span className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            ${totalSaaSRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-semibold">
            Settled via Stripe & Wire
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Failed Payments</span>
            <span className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">
            {failedPaymentsCount}
          </div>
          <div className="mt-1 text-[11px] text-rose-400/80 font-medium">
            1 tenant needs renewal
          </div>
        </div>
      </div>

      {/* Charts Section: Revenue over time & Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">SaaS Revenue Growth & Trajectory</h3>
                <p className="text-xs text-slate-400">Monthly gross recurring billing across active tenant accounts</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setTimeRange('6m')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    timeRange === '6m' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setTimeRange('12m')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    timeRange === '12m' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-56 flex items-end gap-3 pt-6 pb-2 border-b border-slate-800">
              {revenueMonthlySeries.map((item) => {
                const heightPct = Math.round((item.revenue / maxMonthlyRev) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.revenue}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-indigo-700 to-indigo-500 group-hover:from-indigo-600 group-hover:to-emerald-400 rounded-t-lg transition-all shadow-md shadow-indigo-950/50"
                    />
                    <span className="text-[10px] font-semibold text-slate-400 truncate w-full text-center">
                      {item.month.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
              <span>Recurring Billing</span>
            </span>
            <span>Average Plan Revenue: <strong>$1,091 / client</strong></span>
          </div>
        </div>

        {/* Subscription Distribution & Activity (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Subscription Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Tier allocation across customer base</p>

            <div className="space-y-3">
              {planStats.map((plan) => (
                <div key={plan.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-xs ${plan.color}`} />
                      <span className="text-slate-200">{plan.name}</span>
                    </div>
                    <span className="text-slate-400">{plan.count} ({plan.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${plan.percentage}%` }}
                      className={`h-full ${plan.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Client Activity Breakdown */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white mb-2">Tenant Activity Health</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Active & Engaged</span>
                  <span className="text-base font-black text-emerald-400">4 Accounts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Trial / Review</span>
                  <span className="text-base font-black text-blue-400">2 Accounts</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('admin-clients')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage All SaaS Clients</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Clients Quick List */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Latest Subscribed Client Businesses</h3>
            <p className="text-xs text-slate-400">Direct multi-tenant overview without exposing private end-user messages</p>
          </div>
          <button
            onClick={() => setCurrentView('admin-clients')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            View All ({totalClients})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Business</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">MRR</th>
                <th className="py-2.5 px-3">Active Channels</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {saasClients.slice(0, 5).map((client) => (
                <tr key={client.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{client.businessName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div>{client.ownerName}</div>
                    <div className="text-[11px] text-slate-500">{client.ownerEmail}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800 text-indigo-300 font-bold text-[10.5px]">
                      {client.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold capitalize ${
                      client.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : client.status === 'trial'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">
                    ${client.mrr}/mo
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {client.channelsConnected.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setCurrentView('admin-clients')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Manage
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
