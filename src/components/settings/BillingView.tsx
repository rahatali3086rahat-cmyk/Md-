import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PLANS_CONFIG,
  PLANS_LIST,
  formatBDT,
  calculateUsagePercentage,
  getUsageWarningState,
  BKASH_CONFIG,
} from '../../config/plans';
import { SubscriptionPlanId } from '../../types/billing';
import { BKashLogo } from '../billing/bKashLogo';
import { CheckoutModal } from '../billing/CheckoutModal';
import { DemoPaymentSimulatorModal } from '../billing/DemoPaymentSimulatorModal';
import { PaymentSuccessView } from '../billing/PaymentSuccessView';
import { PaymentFailedView } from '../billing/PaymentFailedView';
import { PaymentPendingView } from '../billing/PaymentPendingView';
import { InvoiceModal } from '../billing/InvoiceModal';
import { CancelSubscriptionModal } from '../billing/CancelSubscriptionModal';
import { AdminBillingView } from '../billing/AdminBillingView';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  Eye,
  Calendar,
  Layers,
  HelpCircle,
  Smartphone,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Sliders,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const {
    subscription,
    usageMetrics,
    paymentHistory,
    invoices,
    selectedInvoice,
    isCheckoutModalOpen,
    isDemoSimulatorOpen,
    isCancelModalOpen,
    activeCheckoutPlanId,
    paymentOutcomeView,
    lastPaymentResult,
    openCheckout,
    closeCheckout,
    openDemoSimulator,
    closeDemoSimulator,
    handleSimulateSuccess,
    handleSimulatePending,
    handleSimulateFailed,
    cancelActiveSubscription,
    reactivateSubscription,
    openCancelModal,
    closeCancelModal,
    viewInvoice,
    closeInvoice,
    resetPaymentOutcomeView,
    setCurrentView,
  } = useApp();

  // Sub-tabs: 'overview' | 'plans' | 'history' | 'admin'
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'history' | 'admin'>('overview');
  const [isSimulatingQuota, setIsSimulatingQuota] = useState(false);
  const [simulatedUsagePct, setSimulatedUsagePct] = useState<number>(32.4);

  const currentPlanId: SubscriptionPlanId = subscription?.plan_id || 'business';
  const currentPlan = PLANS_CONFIG[currentPlanId] || PLANS_CONFIG.business;

  // Active usage calculations
  const effectiveConversationsUsed = isSimulatingQuota
    ? Math.round((simulatedUsagePct / 100) * usageMetrics.conversationsLimit)
    : usageMetrics.conversationsUsed;

  const convPct = calculateUsagePercentage(
    effectiveConversationsUsed,
    usageMetrics.conversationsLimit
  );
  const convWarningState = getUsageWarningState(
    effectiveConversationsUsed,
    usageMetrics.conversationsLimit
  );

  const aiMsgPct = calculateUsagePercentage(
    usageMetrics.aiMessagesUsed,
    usageMetrics.aiMessagesLimit
  );
  const prodPct = calculateUsagePercentage(
    usageMetrics.productsUsed,
    usageMetrics.productsLimit
  );

  // If a payment outcome screen is active, display that screen
  if (paymentOutcomeView === 'success') {
    return (
      <div className="space-y-4">
        <PaymentSuccessView
          planId={lastPaymentResult?.planId || currentPlanId}
          amount={lastPaymentResult?.amount || currentPlan.price}
          transactionId={lastPaymentResult?.transactionId || 'DEMO-TXN-123456'}
          startDate={subscription?.start_date || 'September 14, 2026'}
          nextBillingDate={subscription?.next_billing_date || 'October 14, 2026'}
          onGoToDashboard={() => {
            resetPaymentOutcomeView();
            setCurrentView('dashboard');
          }}
          onViewBilling={() => {
            resetPaymentOutcomeView();
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }

  if (paymentOutcomeView === 'failed') {
    return (
      <div className="space-y-4">
        <PaymentFailedView
          failureReason={lastPaymentResult?.failureReason}
          onTryAgain={() => {
            resetPaymentOutcomeView();
            openCheckout(currentPlanId);
          }}
          onBackToBilling={() => {
            resetPaymentOutcomeView();
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }

  if (paymentOutcomeView === 'pending') {
    return (
      <div className="space-y-4">
        <PaymentPendingView
          transactionId={lastPaymentResult?.transactionId || 'DEMO-TXN-PENDING'}
          amount={lastPaymentResult?.amount || currentPlan.price}
          onRefreshStatus={async () => {
            // Simulated check
            await new Promise((res) => setTimeout(res, 600));
          }}
          onSimulateApprove={() => {
            handleSimulateSuccess(lastPaymentResult?.transactionId || 'DEMO-TXN-VERIFIED');
          }}
          onBackToBilling={() => {
            resetPaymentOutcomeView();
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#E2136E] shadow-xs">
            <BKashLogo size="sm" showText={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Billing & Subscription
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-pink-50 text-[#E2136E] text-[10px] font-extrabold border border-pink-200/60">
                bKash MFS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your WhatsAI WhatsApp automation tier, bKash payment method, and invoices.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview & Usage
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'plans'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>

      {/* Demo Simulation Notice Banner */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 rounded-2xl border border-pink-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white border border-pink-200 text-[#E2136E] shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 font-bold">Demo Payment Mode Active</strong>
              <span className="text-[10px] font-mono bg-white px-2 py-0.2 rounded border border-pink-200 text-[#E2136E]">
                Test Gateway
              </span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Simulated bKash checkout for the Bangladesh market. No real money or credentials required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openCheckout(currentPlanId)}
            className="px-3.5 py-1.5 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Checkout</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & USAGE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Subscription Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Plan
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-slate-900 capitalize">
                    {currentPlan.name}
                  </h3>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold border capitalize ${
                      subscription?.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : subscription?.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    Status: {subscription?.status || 'Active'}
                  </span>
                </div>

                <p className="text-sm font-black text-[#E2136E] font-mono mt-1">
                  {formatBDT(currentPlan.price)}{' '}
                  <span className="text-xs font-medium text-slate-500">/ month</span>
                </p>
              </div>

              {/* Payment Method & Next Billing */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-1.5">
                    <BKashLogo size="sm" />
                    <span className="font-bold text-slate-800">Direct MFS</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Wallet: 01712-345678
                  </span>
                </div>

                <div className="sm:border-l sm:border-slate-200 sm:pl-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Next Billing Date
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subscription?.next_billing_date || 'October 14, 2026'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {subscription?.auto_renew ? 'Auto-renews monthly' : 'Expires on date'}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Action Controls */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => openCheckout('agency')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upgrade Plan</span>
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Change Plan
                </button>
              </div>

              <div>
                {subscription?.status === 'cancelled' ? (
                  <button
                    onClick={reactivateSubscription}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Reactivate Subscription
                  </button>
                ) : (
                  <button
                    onClick={openCancelModal}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-600 hover:underline transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Usage Section & Quota Progress Meters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Plan Quota & Resource Usage
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time usage across your WhatsApp Business automation pipeline.
                </p>
              </div>

              {/* Interactive preview toggle to test 80% and 100% warning states */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-[11px]">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 font-medium">Preview Limit Warnings:</span>
                <button
                  onClick={() => {
                    setIsSimulatingQuota(true);
                    setSimulatedUsagePct(32.4);
                  }}
                  className={`px-2 py-0.5 rounded font-bold ${
                    isSimulatingQuota && simulatedUsagePct === 32.4
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  32%
                </button>
                <button
                  onClick={() => {
                    setIsSimulatingQuota(true);
                    setSimulatedUsagePct(82);
                  }}
                  className={`px-2 py-0.5 rounded font-bold ${
                    isSimulatingQuota && simulatedUsagePct === 82
                      ? 'bg-amber-500 text-white'
                      : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  80% (Warn)
                </button>
                <button
                  onClick={() => {
                    setIsSimulatingQuota(true);
                    setSimulatedUsagePct(100);
                  }}
                  className={`px-2 py-0.5 rounded font-bold ${
                    isSimulatingQuota && simulatedUsagePct === 100
                      ? 'bg-rose-500 text-white'
                      : 'text-rose-700 hover:text-rose-900'
                  }`}
                >
                  100% (Cap)
                </button>
              </div>
            </div>

            {/* Threshold Warning Banner */}
            {convWarningState === 'warning' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Warning:</strong> You&apos;ve used 80% of your monthly conversation limit.
                  </span>
                </div>
                <button
                  onClick={() => openCheckout('agency')}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {convWarningState === 'exceeded' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start sm:items-center justify-between gap-3 text-xs text-rose-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Quota Reached:</strong> Monthly conversation limit reached. Inbound chats cannot trigger automated AI replies until renewed or upgraded.
                  </span>
                </div>
                <button
                  onClick={() => openCheckout('agency')}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* 3 Progress Bars */}
            <div className="space-y-5">
              {/* WhatsApp Conversations */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">WhatsApp Conversations</span>
                    <span className="text-[11px] text-slate-400">
                      ({convPct}% used)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {effectiveConversationsUsed.toLocaleString()} /{' '}
                    {usageMetrics.conversationsLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      convWarningState === 'exceeded'
                        ? 'bg-rose-500'
                        : convWarningState === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${convPct}%` }}
                  />
                </div>
              </div>

              {/* AI Messages */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">AI Messages</span>
                    <span className="text-[11px] text-slate-400">
                      ({aiMsgPct}% used)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {usageMetrics.aiMessagesUsed.toLocaleString()} /{' '}
                    {usageMetrics.aiMessagesLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${aiMsgPct}%` }}
                  />
                </div>
              </div>

              {/* Products */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">Products in Catalog</span>
                    <span className="text-[11px] text-slate-400">
                      ({prodPct}% used)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {usageMetrics.productsUsed.toLocaleString()} /{' '}
                    {usageMetrics.productsLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${prodPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Payment Method
            </h3>

            {/* bKash Card */}
            <div className="p-5 rounded-2xl border-2 border-pink-200 bg-pink-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <BKashLogo size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">bKash</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay securely using bKash.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openCheckout(currentPlanId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E2136E] hover:bg-[#c90f61] transition-colors shadow-xs"
                >
                  Pay with bKash
                </button>
              </div>
            </div>

            {/* Notice for Future Methods */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Future Payment Methods:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium">
                  Nagad (Coming Soon)
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium">
                  Rocket (Coming Soon)
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium">
                  Visa / Mastercard (Coming Soon)
                </span>
              </div>
            </div>
          </div>

          {/* Recent Payments Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Recent Invoices
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quick access to recent bKash payments and receipts.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View All History</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {paymentHistory.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BKashLogo size="sm" showText={false} />
                    <div>
                      <p className="font-bold text-slate-800 font-mono">{p.invoice_number}</p>
                      <p className="text-[11px] text-slate-400">
                        {p.created_at.slice(0, 10)} • Txn: {p.transaction_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-slate-900">
                      {formatBDT(p.amount)}
                    </span>
                    <button
                      onClick={() => viewInvoice(p.invoice_number)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto py-2">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Predictable Pricing for Bangladesh Businesses
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select the tier that fits your sales volume. Pay easily each month with bKash.
            </p>
          </div>

          {/* 4 Centralized Pricing Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS_LIST.map((plan) => {
              const isCurrent = plan.id === currentPlanId;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                    plan.highlight
                      ? 'bg-white border-2 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 capitalize">
                      {plan.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 min-h-[32px] line-clamp-2">
                      {plan.description}
                    </p>

                    <div className="my-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                          {formatBDT(plan.price)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">/ month</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Billed in BDT via bKash
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                      <div className="font-bold text-slate-800">
                        {plan.monthlyConversations.toLocaleString()} conversations/mo
                      </div>
                      <div className="text-slate-600 font-medium text-[11px]">
                        {plan.whatsappNumbers} WhatsApp {plan.whatsappNumbers === 1 ? 'Number' : 'Numbers'}
                      </div>
                      <div className="text-slate-600 font-medium text-[11px]">
                        {plan.aiMessages.toLocaleString()} AI messages
                      </div>
                      <div className="text-slate-600 font-medium text-[11px]">
                        {plan.products} products catalog
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {plan.features.map((feat) => (
                          <div key={feat} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4">
                    <button
                      onClick={() => openCheckout(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : plan.highlight
                          ? 'bg-[#E2136E] hover:bg-[#c90f61] text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? 'Current Active Plan' : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Payment History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full ledger of past bKash subscription payments, transaction IDs, and invoices.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paymentHistory.map((p) => {
                  const statusColors = {
                    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    pending: 'bg-amber-50 text-amber-800 border-amber-200',
                    failed: 'bg-rose-50 text-rose-700 border-rose-200',
                    refunded: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {p.created_at.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.invoice_number}
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
                          <span className="font-semibold text-slate-700">bKash</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {p.transaction_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                            statusColors[p.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => viewInvoice(p.invoice_number)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN BILLING OVERVIEW */}
      {activeTab === 'admin' && (
        <AdminBillingView onViewInvoice={viewInvoice} />
      )}

      {/* MODALS */}
      {/* 1. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={closeCheckout}
        initialPlanId={activeCheckoutPlanId}
        onProceedToDemoPayment={openDemoSimulator}
      />

      {/* 2. Demo Payment Simulator Modal */}
      <DemoPaymentSimulatorModal
        isOpen={isDemoSimulatorOpen}
        onClose={closeDemoSimulator}
        planId={activeCheckoutPlanId}
        amount={PLANS_CONFIG[activeCheckoutPlanId]?.price || 4999}
        onSimulateSuccess={handleSimulateSuccess}
        onSimulatePending={handleSimulatePending}
        onSimulateFailed={handleSimulateFailed}
      />

      {/* 3. Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={closeInvoice}
      />

      {/* 4. Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={cancelActiveSubscription}
        nextBillingDate={subscription?.next_billing_date}
      />
    </div>
  );
};
