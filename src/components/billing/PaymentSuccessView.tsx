import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Download, LayoutDashboard, CreditCard } from 'lucide-react';
import { BKashLogo } from './bKashLogo';
import { formatBDT } from '../../config/plans';
import { SubscriptionPlanId } from '../../types/billing';
import { PLANS_CONFIG } from '../../config/plans';

interface PaymentSuccessViewProps {
  planId?: SubscriptionPlanId;
  amount?: number;
  transactionId?: string;
  startDate?: string;
  nextBillingDate?: string;
  onGoToDashboard: () => void;
  onViewBilling: () => void;
  onDownloadInvoice?: () => void;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  planId = 'business',
  amount = 4999,
  transactionId = 'DEMO-TXN-123456',
  startDate = 'September 14, 2026',
  nextBillingDate = 'October 14, 2026',
  onGoToDashboard,
  onViewBilling,
  onDownloadInvoice,
}) => {
  const plan = PLANS_CONFIG[planId] || PLANS_CONFIG.business;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Top Success Banner */}
        <div className="bg-gradient-to-b from-emerald-50 to-white pt-8 pb-6 px-6 text-center border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment Successful
          </h2>

          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Payment verified</span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Your WhatsApp automation plan is now activated and ready to handle incoming chats.
          </p>
        </div>

        {/* Payment Summary Receipt Card */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Plan</span>
              <span className="font-bold text-slate-900 text-sm capitalize">
                {plan.name}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Amount</span>
              <span className="font-black text-slate-900 text-base font-mono">
                {formatBDT(amount)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Payment Method</span>
              <div className="flex items-center gap-2">
                <BKashLogo size="sm" />
                <span className="font-semibold text-slate-800">bKash</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {transactionId}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Subscription</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/80">
              <span className="text-slate-500 font-medium">Start Date</span>
              <span className="font-semibold text-slate-800">{startDate}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Next Billing Date</span>
              <span className="font-semibold text-slate-800">{nextBillingDate}</span>
            </div>
          </div>

          {/* Demo Mode Notice Badge */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
            <p className="text-[11px] text-amber-800 font-medium">
              <strong>Demo Payment Simulation:</strong> Completed in test sandbox mode. In production, official bKash server IPNs confirm transactions securely.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGoToDashboard}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
            <button
              onClick={onViewBilling}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>View Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
