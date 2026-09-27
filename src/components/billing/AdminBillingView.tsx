import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { PaymentRecord, AdminBillingMetrics } from '../../types/billing';
import { formatBDT } from '../../config/plans';
import { BKashLogo } from './bKashLogo';
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface AdminBillingViewProps {
  onViewInvoice?: (invoiceNumber: string) => void;
}

export const AdminBillingView: React.FC<AdminBillingViewProps> = ({ onViewInvoice }) => {
  const [metrics, setMetrics] = useState<AdminBillingMetrics | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, p] = await Promise.all([
          paymentService.getAdminBillingMetrics(),
          paymentService.getAdminPayments(),
        ]);
        setMetrics(m);
        setPayments(p);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      (p.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Revenue
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {metrics ? formatBDT(metrics.totalRevenue) : '...'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last mo
          </span>
        </div>

        {/* MRR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Rev (MRR)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black text-emerald-600 font-mono">
              {metrics ? formatBDT(metrics.monthlyRevenue) : '...'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Active month cycle</span>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Subs
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {metrics?.activeSubscriptions || 142}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
            100% bKash auto-pay
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-600 mt-1">
            {metrics?.pendingPayments || 0}
          </div>
          <span className="text-[10px] text-amber-700 mt-1 block">Awaiting webhook</span>
        </div>

        {/* Failed Payments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Failed
          </span>
          <div className="text-lg sm:text-xl font-black text-rose-600 mt-1">
            {metrics?.failedPayments || 0}
          </div>
          <span className="text-[10px] text-rose-700 mt-1 block">Need retry</span>
        </div>

        {/* Refunds */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Refunds
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-700 mt-1">
            {metrics?.refundsCount || 0}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Settled via MFS</span>
        </div>
      </div>

      {/* Payments Table & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Bangladesh bKash Subscription Transactions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time audit log of all bKash subscription checkouts and merchant accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search merchant, txn..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              {(['all', 'paid', 'pending', 'failed', 'refunded'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Customer & Business</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const statusBadges = {
                    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    pending: 'bg-amber-50 text-amber-800 border-amber-200',
                    failed: 'bg-rose-50 text-rose-700 border-rose-200',
                    refunded: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{p.customer_name || 'Customer'}</p>
                        <p className="text-[11px] text-slate-400">{p.business_name || 'Business'}</p>
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold text-slate-800">
                        {p.plan_id}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatBDT(p.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <BKashLogo size="sm" />
                          <span className="font-medium text-slate-700">bKash</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {p.transaction_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                            statusBadges[p.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {p.created_at.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onViewInvoice && p.status === 'paid' && (
                          <button
                            onClick={() => onViewInvoice(p.invoice_number)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
