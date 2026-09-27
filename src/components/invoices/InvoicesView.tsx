import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  Trash2,
  Eye,
  DollarSign,
} from 'lucide-react';
import { BusinessInvoice, InvoiceStatus, ChannelType, BusinessInvoiceLineItem } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

export const InvoicesView: React.FC = () => {
  const {
    businessInvoices,
    createBusinessInvoice,
    sendInvoiceViaChannel,
    markInvoicePaid,
    deleteBusinessInvoice,
    customers,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | ChannelType>('all');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<BusinessInvoice | null>(null);

  // New Invoice Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryChannel, setDeliveryChannel] = useState<ChannelType>('whatsapp');
  const [currency, setCurrency] = useState('QAR');
  const [dueDate, setDueDate] = useState('2026-10-05');
  const [notes, setNotes] = useState('Thank you for choosing Sofana Living.');

  const [items, setItems] = useState<BusinessInvoiceLineItem[]>([
    { id: '1', description: 'Bespoke Velvet Armchair - Forest Green', quantity: 1, unitPrice: 3800, total: 3800, totalPrice: 3800 },
  ]);

  const filteredInvoices = businessInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerPhone && inv.customerPhone.includes(search));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (channelFilter !== 'all' && inv.deliveryChannel !== channelFilter) return false;

    return true;
  });

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-teal-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getStatusBadge = (st: InvoiceStatus) => {
    switch (st) {
      case 'paid':
        return { label: 'Paid & Settled', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'sent':
        return { label: 'Sent & Unpaid', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'overdue':
        return { label: 'Overdue', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'draft':
        return { label: 'Draft', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-slate-100 text-slate-500 border-slate-200' };
      default:
        return { label: st, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.totalPrice || 0), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0, totalPrice: 0 },
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof BusinessInvoiceLineItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const t = Number(updated.quantity || 1) * Number(updated.unitPrice || 0);
          updated.totalPrice = t;
          updated.total = t;
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const invNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    await createBusinessInvoice({
      businessId: 'biz-sofana',
      invoiceNumber: invNumber,
      customerName,
      customerEmail,
      customerPhone,
      deliveryChannel,
      items,
      subtotal,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: tax,
      total,
      totalAmount: total,
      currency: currency as any,
      status: 'sent',
      dueDate,
      notes,
    });

    setIsNewInvoiceOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
  };

  const copyPaymentLink = (link?: string) => {
    if (!link) return;
    navigator.clipboard?.writeText(link);
    addToast('success', 'Link Copied', 'Secure payment URL copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Business Invoices & Global Billing
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Create, deliver, and track invoices with auto-generated secure checkout links delivered natively across WhatsApp, Email, Instagram, and Web Chat.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Invoiced
          </p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            QAR{' '}
            {businessInvoices
              .reduce((acc, i) => acc + (i.totalAmount ?? i.total ?? 0), 0)
              .toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
            Across all channels
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Paid & Settled
          </p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            QAR{' '}
            {businessInvoices
              .filter((i) => i.status === 'paid')
              .reduce((acc, i) => acc + (i.totalAmount ?? i.total ?? 0), 0)
              .toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
            {businessInvoices.filter((i) => i.status === 'paid').length} invoices paid
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Awaiting Payment
          </p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">
            QAR{' '}
            {businessInvoices
              .filter((i) => i.status === 'sent')
              .reduce((acc, i) => acc + (i.totalAmount ?? i.total ?? 0), 0)
              .toLocaleString()}
          </p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 inline-block">
            Active payment links live
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Average Settlement
          </p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">2.4 hours</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 inline-block">
            From WhatsApp delivery
          </span>
        </div>
      </div>

      {/* Invoice Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice number, client, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            {(['all', 'sent', 'paid', 'overdue', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'sent' ? 'Awaiting Payment' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Channel Delivery</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No invoices matching this filter
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const badge = getStatusBadge(inv.status);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inv.customerName}</div>
                        <div className="text-[10px] text-slate-400">{inv.customerPhone || inv.customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10.5px] font-medium text-slate-700 capitalize">
                          {getChannelIcon(inv.deliveryChannel)}
                          <span>{inv.deliveryChannel}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {inv.currency} {(inv.totalAmount ?? inv.total ?? 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {inv.dueDate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview modal */}
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title="Preview Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Copy payment link */}
                          {inv.paymentLink && (
                            <button
                              onClick={() => copyPaymentLink(inv.paymentLink)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Copy Payment Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Re-send via channel */}
                          <button
                            onClick={() => sendInvoiceViaChannel(inv.id, inv.deliveryChannel)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                            title={`Re-send via ${inv.deliveryChannel}`}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Mark Paid button */}
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => markInvoicePaid(inv.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        title="Create Business Invoice"
        subtitle="Generate itemized billing with multi-channel payment delivery"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          {/* Customer & Delivery Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nasser Al-Khelaifi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Channel</label>
              <select
                value={deliveryChannel}
                onChange={(e) => setDeliveryChannel(e.target.value as ChannelType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
              >
                <option value="whatsapp">WhatsApp Business (Direct Link)</option>
                <option value="facebook">Facebook Messenger</option>
                <option value="instagram">Instagram Direct</option>
                <option value="website">Website Live Chat</option>
                <option value="email">Official Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+974 3311 9988"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="client@domain.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              >
                <option value="QAR">QAR (Qatari Riyal)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">Invoice Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Item description / service"
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                  className="w-16 px-2 py-2 border border-slate-200 rounded-xl text-center"
                />
                <input
                  type="number"
                  min={0}
                  required
                  placeholder="Unit price"
                  value={item.unitPrice}
                  onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                  className="w-24 px-2 py-2 border border-slate-200 rounded-xl text-right font-bold"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold">{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (5%):</span>
              <span>{currency} {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
              <span>Total Invoice Amount:</span>
              <span className="text-emerald-800">{currency} {total.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewInvoiceOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Generate & Dispatch Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewInvoice(null)}
          title={`Invoice ${previewInvoice.invoiceNumber}`}
          subtitle={`Dispatched via ${previewInvoice.deliveryChannel}`}
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex justify-between items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="font-extrabold text-sm text-slate-900">Sofana Living Atelier</p>
                <p className="text-slate-500">Doha, Qatar · VAT: QA-8829104</p>
                <p className="text-slate-500 mt-1">Billed To: <strong className="text-slate-800">{previewInvoice.customerName}</strong></p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold mb-1 ${getStatusBadge(previewInvoice.status).bg}`}>
                  {getStatusBadge(previewInvoice.status).label}
                </span>
                <p className="text-slate-500">Due: {previewInvoice.dueDate}</p>
              </div>
            </div>

            {/* Items */}
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewInvoice.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2 font-medium">{it.description}</td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right">{previewInvoice.currency} {(it.unitPrice ?? 0).toLocaleString()}</td>
                    <td className="py-2 text-right font-bold">{previewInvoice.currency} {(it.totalPrice ?? it.total ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Amount:</span>
              <span className="text-emerald-700">{previewInvoice.currency} {(previewInvoice.totalAmount ?? previewInvoice.total ?? 0).toLocaleString()}</span>
            </div>

            {/* Payment Link Box */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Omnichannel Payment Link</span>
                <span className="font-mono text-emerald-900 text-[11px] truncate block">{previewInvoice.paymentLink || previewInvoice.paymentUrl || 'https://pay.whatsai.global/checkout'}</span>
              </div>
              <button
                onClick={() => copyPaymentLink(previewInvoice.paymentLink || previewInvoice.paymentUrl || '')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0"
              >
                Copy Link
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
