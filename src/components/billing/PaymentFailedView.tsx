import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft, HelpCircle } from 'lucide-react';
import { BKashLogo } from './bKashLogo';

interface PaymentFailedViewProps {
  failureReason?: string;
  onTryAgain: () => void;
  onBackToBilling: () => void;
}

export const PaymentFailedView: React.FC<PaymentFailedViewProps> = ({
  failureReason = 'Payment verification failed or timed out',
  onTryAgain,
  onBackToBilling,
}) => {
  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-b from-rose-50 to-white pt-8 pb-6 px-6 text-center border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/25 animate-in zoom-in-50 duration-300">
            <AlertCircle className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment Failed
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            We couldn&apos;t complete your payment.
          </p>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
            <span>Reason:</span>
            <span className="font-bold">{failureReason}</span>
          </div>
        </div>

        {/* Content & Possible Reasons */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              Possible reasons:
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Payment cancelled in bKash prompt</li>
              <li>Payment gateway request timeout</li>
              <li>Payment verification failed on backend</li>
              <li>Temporary bKash network maintenance</li>
            </ul>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            No money has been debited from your bKash wallet. If an amount was deducted, bKash usually reverses failed attempts within 24 hours.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onTryAgain}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={onBackToBilling}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
