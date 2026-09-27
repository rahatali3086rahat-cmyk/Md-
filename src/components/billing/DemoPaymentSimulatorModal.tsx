import React, { useState } from 'react';
import { BKashLogo } from './bKashLogo';
import { formatBDT, PLANS_CONFIG } from '../../config/plans';
import { SubscriptionPlanId } from '../../types/billing';
import { X, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Smartphone } from 'lucide-react';

interface DemoPaymentSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: SubscriptionPlanId;
  amount: number;
  onSimulateSuccess: (txnId: string) => void;
  onSimulatePending: (txnId: string) => void;
  onSimulateFailed: (reason: string) => void;
}

export const DemoPaymentSimulatorModal: React.FC<DemoPaymentSimulatorModalProps> = ({
  isOpen,
  onClose,
  planId,
  amount,
  onSimulateSuccess,
  onSimulatePending,
  onSimulateFailed,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('01712-345678');
  const [pin, setPin] = useState('•••••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFailureReason, setSelectedFailureReason] = useState('Payment cancelled by user');

  if (!isOpen) return null;

  const plan = PLANS_CONFIG[planId] || PLANS_CONFIG.business;

  const handleAction = async (type: 'success' | 'pending' | 'failed') => {
    setIsProcessing(true);
    const mockTxn = `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setIsProcessing(false);
      if (type === 'success') {
        onSimulateSuccess(mockTxn);
      } else if (type === 'pending') {
        onSimulatePending(mockTxn);
      } else {
        onSimulateFailed(selectedFailureReason);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top bKash Branded Header */}
        <div className="bg-[#E2136E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">bKash Checkout</span>
                <span className="px-2 py-0.2 rounded-full bg-white/25 text-[10px] font-bold uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>
              <p className="text-[11px] text-pink-100">Simulated Payment Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Details summary */}
        <div className="bg-pink-50/70 px-6 py-3.5 border-b border-pink-100/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-pink-800 font-bold uppercase tracking-wider block">
              Merchant Order
            </span>
            <p className="text-xs font-semibold text-slate-800">
              WhatsAI {plan.name} Tier
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-pink-800 font-bold uppercase tracking-wider block">
              Amount
            </span>
            <span className="text-base font-black text-[#E2136E] font-mono">
              {formatBDT(amount)}
            </span>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/90 flex items-start gap-2 text-[11px] text-amber-900 leading-snug">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Simulated Demo Environment:</strong>
              <p className="text-amber-800 mt-0.5">
                No actual bKash credentials or real monetary transactions are handled. Test how the frontend responds to each backend verification outcome below.
              </p>
            </div>
          </div>
        </div>

        {/* Mock bKash Form Inputs */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your bKash Wallet Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#E2136E]/30 focus:border-[#E2136E]"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              bKash PIN (Simulated)
            </label>
            <input
              type="password"
              value={pin}
              readOnly
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              PIN is masked automatically. Never enter real wallet PINs in test modes.
            </p>
          </div>

          {/* Test Outcomes Simulation Choices */}
          <div className="pt-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Verification Outcome to Test:
            </span>

            <div className="space-y-2">
              {/* Outcome 1: Success */}
              <button
                type="button"
                onClick={() => handleAction('success')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900 group-hover:text-emerald-950">
                      Simulate Successful Payment
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      Generates verified transaction & activates subscription
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Run
                </span>
              </button>

              {/* Outcome 2: Pending */}
              <button
                type="button"
                onClick={() => handleAction('pending')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900 group-hover:text-amber-950">
                      Simulate Verification Pending
                    </p>
                    <p className="text-[10px] text-amber-700">
                      Awaits backend webhook, subscription stays unactivated
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Run
                </span>
              </button>

              {/* Outcome 3: Failed */}
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-900">
                        Simulate Payment Failure
                      </p>
                      <p className="text-[10px] text-rose-700">
                        Routes to Payment Failed page with reason
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAction('failed')}
                    disabled={isProcessing}
                    className="text-[11px] font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-100 transition-colors"
                  >
                    Run
                  </button>
                </div>

                <div className="pt-1">
                  <label className="text-[10px] font-semibold text-rose-800 block mb-1">
                    Failure reason:
                  </label>
                  <select
                    value={selectedFailureReason}
                    onChange={(e) => setSelectedFailureReason(e.target.value)}
                    className="w-full text-[11px] bg-white border border-rose-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden"
                  >
                    <option value="Payment cancelled in bKash prompt">Payment cancelled in bKash prompt</option>
                    <option value="Payment gateway timeout (60s exceeded)">Payment timeout</option>
                    <option value="Payment verification signature mismatch">Payment verification failed</option>
                    <option value="Temporary bKash network maintenance">Temporary payment issue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>WhatsAI Bangladesh bKash Integration</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
