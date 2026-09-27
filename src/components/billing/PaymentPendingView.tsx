import React, { useState } from 'react';
import { Clock, RefreshCw, AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { BKashLogo } from './bKashLogo';
import { formatBDT } from '../../config/plans';

interface PaymentPendingViewProps {
  transactionId?: string;
  amount?: number;
  onRefreshStatus: () => Promise<void> | void;
  onBackToBilling: () => void;
  onSimulateApprove?: () => void;
}

export const PaymentPendingView: React.FC<PaymentPendingViewProps> = ({
  transactionId = 'DEMO-TXN-PENDING',
  amount = 4999,
  onRefreshStatus,
  onBackToBilling,
  onSimulateApprove,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = async () => {
    setIsChecking(true);
    try {
      await onRefreshStatus();
    } finally {
      setTimeout(() => setIsChecking(false), 800);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-b from-amber-50 to-white pt-8 pb-6 px-6 text-center border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25 animate-pulse">
            <Clock className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment Verification Pending
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Your payment has been submitted and is waiting for verification.
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Status: Pending</span>
          </div>
        </div>

        {/* Content & Architectural Safety Guarantee */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Payment Method</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <BKashLogo size="sm" />
                <span>bKash</span>
              </div>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Amount</span>
              <span className="font-bold text-slate-900 font-mono">{formatBDT(amount)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Transaction ID</span>
              <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {transactionId}
              </span>
            </div>
          </div>

          {/* Security & Verification Rule Callout */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Zero-Trust Activation Rule:</strong> The subscription will NOT be activated until the backend API securely verifies the webhook signature and funds confirmation from the bKash payment gateway.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleRefresh}
              disabled={isChecking}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors disabled:opacity-75"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Querying Backend...' : 'Refresh Status'}</span>
            </button>

            {onSimulateApprove && (
              <button
                onClick={onSimulateApprove}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <span>Simulate Backend Verification Webhook</span>
              </button>
            )}

            <button
              onClick={onBackToBilling}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
