import React, { useState } from 'react';
import { PLANS_CONFIG, PLANS_LIST, formatBDT, BKASH_CONFIG } from '../../config/plans';
import { SubscriptionPlanId } from '../../types/billing';
import { BKashLogo } from './bKashLogo';
import {
  X,
  Check,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Lock,
  Zap,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: SubscriptionPlanId;
  onProceedToDemoPayment: (selectedPlan: SubscriptionPlanId, amount: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'business',
  onProceedToDemoPayment,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>(initialPlanId);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');

  if (!isOpen) return null;

  const selectedPlan = PLANS_CONFIG[selectedPlanId] || PLANS_CONFIG.business;

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      onProceedToDemoPayment(selectedPlanId, selectedPlan.price);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step Indicator */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Step {currentStep} of 3
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              {currentStep === 1 && 'Select Your WhatsApp Tier'}
              {currentStep === 2 && 'Choose Payment Method'}
              {currentStep === 3 && 'Review & Confirm Payment'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Step badges */}
            <div className="flex items-center gap-1.5 mr-3">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === step
                      ? 'bg-slate-900 text-white'
                      : currentStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-50 px-6 py-2 border-b border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-[11px]">
              <strong>Demo Payment Mode:</strong> bKash simulated checkout. No credit card or real money required.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded">
            Test Env
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: Select Plan */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Choose the right conversation volume and WhatsApp numbers for your business:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PLANS_LIST.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/30 shadow-xs ring-2 ring-emerald-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {plan.highlight && (
                        <span className="absolute -top-2.5 right-4 px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider">
                          Most Popular
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900 capitalize">
                          {plan.name}
                        </span>
                        <span className="font-black text-slate-900 text-base font-mono">
                          {formatBDT(plan.price)}
                          <span className="text-[10px] font-normal text-slate-400">/mo</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {plan.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] space-y-1">
                        <div className="font-bold text-slate-800">
                          {plan.monthlyConversations.toLocaleString()} WhatsApp conversations
                        </div>
                        <div className="text-slate-500">
                          {plan.whatsappNumbers} WhatsApp {plan.whatsappNumbers === 1 ? 'Number' : 'Numbers'} • {plan.aiMessages.toLocaleString()} AI msgs
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{plan.products} products catalog</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select your payment method. bKash is the primary instant gateway for Bangladesh merchants:
              </p>

              {/* bKash Payment Card (Primary) */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  paymentMethod === 'bkash'
                    ? 'border-[#E2136E] bg-pink-50/20 shadow-xs ring-2 ring-[#E2136E]/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <BKashLogo size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        bKash Direct Gateway
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pay securely using bKash. Instant activation via automated tokenized payment.
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E2136E] text-white">
                    Primary
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-pink-100/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Lock className="w-3.5 h-3.5 text-[#E2136E]" />
                    <span>Zero convenience fees. Instant webhook verification.</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-[#E2136E] bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-lg transition-colors"
                  >
                    Pay with bKash
                  </button>
                </div>
              </div>

              {/* Coming Soon Gateways: Nagad, Rocket, Credit/Debit Cards */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Future Payment Methods:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 opacity-60">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black text-[10px] flex items-center justify-center">
                        N
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800">Nagad</span>
                        <p className="text-[10px] text-slate-400">Postal Digital Banking</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
                        R
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800">Rocket</span>
                        <p className="text-[10px] text-slate-400">Dutch-Bangla Bank MFS</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Summary Review */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Selected Plan</span>
                  <span className="font-bold text-slate-900 text-sm capitalize">
                    {selectedPlan.name} Tier
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Billing Cycle</span>
                  <span className="font-medium text-slate-800">Monthly auto-renewal</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <BKashLogo size="sm" />
                    <span className="font-semibold text-slate-800">bKash</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Included Limits</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPlan.monthlyConversations.toLocaleString()} chats / {selectedPlan.whatsappNumbers} numbers
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 text-sm font-black text-slate-900">
                  <span>Total Amount Due</span>
                  <span className="text-lg font-black text-[#E2136E] font-mono">
                    {formatBDT(selectedPlan.price)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Clicking <strong>&ldquo;Continue to Payment&rdquo;</strong> will open the secure bKash simulator interface.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackStep}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-colors ${
              currentStep === 3
                ? 'bg-[#E2136E] hover:bg-[#c90f61]'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span>
              {currentStep === 1 && 'Next: Payment Method'}
              {currentStep === 2 && 'Next: Confirm Summary'}
              {currentStep === 3 && 'Continue to Payment'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
