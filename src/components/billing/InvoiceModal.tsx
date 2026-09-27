import React from 'react';
import { InvoiceRecord } from '../../types/billing';
import { formatBDT } from '../../config/plans';
import { BKashLogo } from './bKashLogo';
import { X, Printer, Download, CheckCircle2, Building2 } from 'lucide-react';

interface InvoiceModalProps {
  invoice: InvoiceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/html download blob for demonstration
    const invoiceContent = `
INVOICE: ${invoice.invoice_number}
Date: ${invoice.issue_date}
Status: ${invoice.status.toUpperCase()}
Customer: ${invoice.customer_name} (${invoice.business_name})
Amount: ${formatBDT(invoice.total)}
Payment Method: ${invoice.payment_method.toUpperCase()}
Transaction ID: ${invoice.transaction_id || 'N/A'}
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoice_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tax Invoice
            </span>
            <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {invoice.invoice_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              title="Download Invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 ml-1"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  WhatsAI Technologies Ltd.
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                House 42, Road 11, Block D, Banani<br />
                Dhaka-1213, Bangladesh<br />
                BIN / VAT Reg: 002918273-0101
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                PAID IN FULL
              </span>
              <p className="text-slate-400 mt-2 text-[11px]">
                Issue Date: <strong className="text-slate-700">{invoice.issue_date}</strong>
              </p>
              <p className="text-slate-400 text-[11px]">
                Due Date: <strong className="text-slate-700">{invoice.due_date}</strong>
              </p>
            </div>
          </div>

          {/* Bill To & Payment Info */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoice.business_name}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{invoice.customer_name}</p>
              <p className="text-slate-500 text-[11px]">{invoice.business_address}</p>
              <p className="text-slate-500 text-[11px]">{invoice.customer_phone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Details
              </span>
              <div className="flex items-center gap-2 mt-1">
                <BKashLogo size="sm" />
                <span className="font-semibold text-slate-700 text-xs">Direct Merchant Gateway</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1.5 font-mono">
                Transaction ID: <span className="text-slate-800 font-bold">{invoice.transaction_id || 'DEMO-TXN-123456'}</span>
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                Processed via secure bKash tokenized gateway
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center w-16">Qty</th>
                  <th className="py-2.5 text-right w-28">Unit Price</th>
                  <th className="py-2.5 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-700">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{item.description}</p>
                      <p className="text-[10px] text-slate-400">1-month recurring subscription quota</p>
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatBDT(item.unit_price)}</td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-900">
                      {formatBDT(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatBDT(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Bangladesh VAT (5%)</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatBDT(invoice.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700">
                  {formatBDT(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            Thank you for powering your WhatsApp customer automation with WhatsAI. For billing inquiries, email support@whatsai.com.
          </div>
        </div>
      </div>
    </div>
  );
};
