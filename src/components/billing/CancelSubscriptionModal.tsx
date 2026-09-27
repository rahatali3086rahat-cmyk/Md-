import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nextBillingDate?: string;
  isProcessing?: boolean;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  nextBillingDate = 'October 14, 2026',
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-base font-extrabold text-slate-900">
            Are you sure you want to cancel your subscription?
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            You will continue to have access until the end of your current billing period (
            <strong className="text-slate-800">{nextBillingDate}</strong>). After this date, your plan will downgrade to Free, and WhatsApp AI automation will be paused.
          </p>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">What happens after cancellation:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>No further bKash payments will be debited.</li>
              <li>Your customer conversations and catalog remain securely saved.</li>
              <li>You can reactivate your plan at any time before or after expiry.</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Keep Subscription
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
          >
            {isProcessing ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};
