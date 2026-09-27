import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  DollarSign,
  ShieldCheck,
  Building2,
  Wallet,
} from 'lucide-react';
import { ClientPayment } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

export const PaymentsView: React.FC = () => {
  const { clientPayments, recordClientPayment, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual payment form
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('2400');
  const [currency, setCurrency] = useState('QAR');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire Transfer');
  const [transactionRef, setTransactionRef] = useState(`TXN-${Date.now().toString().slice(-6)}`);

  const filteredPayments = clientPayments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (methodFilter !== 'all' && !p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalSettled = clientPayments
    .filter((p) => p.status === 'settled' || (p.status as string) === 'successful')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordClientPayment({
      businessId: 'biz-sofana',
      customerName,
      amount: Number(amount) || 0,
      currency: currency as any,
      paymentMethod: paymentMethod as any,
      transactionId: transactionRef,
      status: 'settled',
      paidAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
    setIsManualModalOpen(false);
    setCustomerName('');
  };

  const handleDownloadReceipt = (p: ClientPayment) => {
    addToast('info', 'Receipt Generated', `Downloading receipt #${p.transactionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Client Payments Ledger & Settlements
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Unified multi-channel transaction audit log tracking automated gateway checkouts, online payment links, and offline wire receipts.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Offline Payment</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Settled Volume
          </p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            QAR {totalSettled.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
            +18.4% this month
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Transactions
          </p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {clientPayments.length}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 inline-block">100% verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Average Ticket
          </p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">QAR 4,375</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 inline-block">
            Omnichannel basket size
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Supported Gateways
          </p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">6 Gateways</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 inline-block">
            Stripe, Apple Pay, bKash, Wire
          </span>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transaction ID, customer, invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            {[
              { id: 'all', label: 'All Methods' },
              { id: 'card', label: 'Cards' },
              { id: 'apple', label: 'Apple Pay' },
              { id: 'wire', label: 'Bank Wire' },
              { id: 'bkash', label: 'bKash' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethodFilter(m.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  methodFilter === m.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Method & Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Settled At</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No transactions matching filter
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {p.transactionId}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.customerName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {p.invoiceNumber || 'Direct Payment'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                        <Wallet className="w-3 h-3 text-slate-500" />
                        <span>{p.paymentMethod}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                      {p.currency} {p.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Settled</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                      {p.paidAt || p.date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Client Payment"
        subtitle="Log an offline bank transfer, cash, or terminal payment"
      >
        <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Fatima Al-Kuwari"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount</label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              >
                <option value="QAR">QAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BDT">BDT</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                <option value="Showroom POS Terminal">Showroom POS Terminal</option>
                <option value="Cheque Deposit">Cheque Deposit</option>
                <option value="Direct Cash">Direct Cash</option>
                <option value="bKash Merchant">bKash Merchant</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transaction Ref #</label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Record Settlement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
