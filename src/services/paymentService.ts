/**
 * Dedicated Payment Service Abstraction
 *
 * ARCHITECTURAL DESIGN:
 * Future Production Integration:
 *   WhatsAI Frontend
 *       ↓ (Safe HTTPS Requests with Session Token)
 *   Backend API (e.g. /api/payments/create, /api/payments/callback)
 *       ↓ (PostgreSQL / Supabase + Webhook Handlers)
 *   Payment Service (Server-side)
 *       ↓ (Encrypted Server-to-Server)
 *   Official bKash Payment API
 *
 * CRITICAL SECURITY DIRECTIVE:
 * - NEVER put bKash secret credentials, app_secret, password, or private tokens in frontend code.
 * - The frontend NEVER decides whether a payment succeeded on its own.
 * - In this MVP version, this service simulates backend API responses using realistic demo mode.
 */

import {
  PaymentRecord,
  InvoiceRecord,
  SubscriptionRecord,
  SubscriptionPlanId,
  AdminBillingMetrics,
  PaymentStatus,
} from '../types/billing';
import { PLANS_CONFIG } from '../config/plans';

// Seed initial subscription matching example from prompt: Business, ৳4,999 / month, Active, bKash, Next Billing: October 14, 2026
let currentSubscription: SubscriptionRecord = {
  id: 'sub-bkash-9921',
  business_id: 'biz-sofana',
  plan_id: 'business',
  status: 'active',
  billing_period: 'monthly',
  start_date: '2026-09-14',
  next_billing_date: '2026-10-14',
  cancelled_at: null,
  payment_method: 'bkash',
  auto_renew: true,
};

// Seed mock payment history matching the exact examples from the user prompt:
// 14 Sep 2026, INV-00124, Business, ৳4,999, bKash, TXN123456, Paid
// 14 Aug 2026, INV-00091, Business, ৳4,999, bKash, TXN098765, Paid
let mockPayments: PaymentRecord[] = [
  {
    id: 'pay-00124',
    business_id: 'biz-sofana',
    user_id: 'usr-rahat',
    subscription_id: 'sub-bkash-9921',
    amount: 4999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN123456',
    provider: 'bkash',
    status: 'paid',
    created_at: '2026-09-14T09:30:00Z',
    paid_at: '2026-09-14T09:32:15Z',
    invoice_number: 'INV-00124',
    plan_id: 'business',
    customer_name: 'Rahat Ali',
    business_name: 'Sofana Decor & Living',
  },
  {
    id: 'pay-00091',
    business_id: 'biz-sofana',
    user_id: 'usr-rahat',
    subscription_id: 'sub-bkash-9921',
    amount: 4999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN098765',
    provider: 'bkash',
    status: 'paid',
    created_at: '2026-08-14T10:12:00Z',
    paid_at: '2026-08-14T10:14:02Z',
    invoice_number: 'INV-00091',
    plan_id: 'business',
    customer_name: 'Rahat Ali',
    business_name: 'Sofana Decor & Living',
  },
  {
    id: 'pay-00058',
    business_id: 'biz-sofana',
    user_id: 'usr-rahat',
    subscription_id: 'sub-bkash-9921',
    amount: 1999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN064219',
    provider: 'bkash',
    status: 'paid',
    created_at: '2026-07-14T11:00:00Z',
    paid_at: '2026-07-14T11:02:45Z',
    invoice_number: 'INV-00058',
    plan_id: 'starter',
    customer_name: 'Rahat Ali',
    business_name: 'Sofana Decor & Living',
  },
  {
    id: 'pay-00032',
    business_id: 'biz-sofana',
    user_id: 'usr-rahat',
    subscription_id: 'sub-bkash-9921',
    amount: 1999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN041180',
    provider: 'bkash',
    status: 'paid',
    created_at: '2026-06-14T14:20:00Z',
    paid_at: '2026-06-14T14:22:10Z',
    invoice_number: 'INV-00032',
    plan_id: 'starter',
    customer_name: 'Rahat Ali',
    business_name: 'Sofana Decor & Living',
  },
];

// Additional mock payments for Admin view (including pending, failed, refunded)
const adminMockPayments: PaymentRecord[] = [
  ...mockPayments,
  {
    id: 'pay-adm-001',
    business_id: 'biz-apex',
    user_id: 'usr-tanvir',
    subscription_id: 'sub-bkash-8812',
    amount: 9999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN998822',
    provider: 'bkash',
    status: 'paid',
    created_at: '2026-09-13T16:45:00Z',
    paid_at: '2026-09-13T16:47:20Z',
    invoice_number: 'INV-00123',
    plan_id: 'agency',
    customer_name: 'Tanvir Hossain',
    business_name: 'Apex Digital Agency',
  },
  {
    id: 'pay-adm-002',
    business_id: 'biz-dhaka-mart',
    user_id: 'usr-sadia',
    subscription_id: 'sub-bkash-7744',
    amount: 4999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN776655',
    provider: 'bkash',
    status: 'pending',
    created_at: '2026-09-14T08:15:00Z',
    paid_at: null,
    invoice_number: 'INV-00125',
    plan_id: 'business',
    customer_name: 'Sadia Jahan',
    business_name: 'Dhaka Fashion Mart',
  },
  {
    id: 'pay-adm-003',
    business_id: 'biz-bengal-spices',
    user_id: 'usr-kamal',
    subscription_id: 'sub-bkash-5531',
    amount: 1999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN443322',
    provider: 'bkash',
    status: 'failed',
    created_at: '2026-09-12T14:10:00Z',
    paid_at: null,
    invoice_number: 'INV-00121',
    plan_id: 'starter',
    customer_name: 'Kamal Uddin',
    business_name: 'Bengal Spices Ltd',
    failure_reason: 'Payment timeout on bKash gateway',
  },
  {
    id: 'pay-adm-004',
    business_id: 'biz-chittagong-crafts',
    user_id: 'usr-nasreen',
    subscription_id: 'sub-bkash-3321',
    amount: 1999,
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: 'TXN221100',
    provider: 'bkash',
    status: 'refunded',
    created_at: '2026-09-08T11:20:00Z',
    paid_at: '2026-09-08T11:22:10Z',
    invoice_number: 'INV-00118',
    plan_id: 'starter',
    customer_name: 'Nasreen Akhtar',
    business_name: 'Chittagong Crafts',
  },
];

// Helper to construct invoice records
function generateInvoiceFromPayment(payment: PaymentRecord): InvoiceRecord {
  const plan = PLANS_CONFIG[payment.plan_id] || PLANS_CONFIG.starter;
  const subtotal = Math.round(payment.amount / 1.05); // 5% VAT included in price
  const tax = payment.amount - subtotal;

  return {
    id: `inv-${payment.invoice_number.toLowerCase()}`,
    invoice_number: payment.invoice_number,
    business_id: payment.business_id,
    subscription_id: payment.subscription_id,
    payment_id: payment.id,
    amount: payment.amount,
    currency: 'BDT',
    status: payment.status,
    issue_date: payment.created_at.slice(0, 10),
    due_date: payment.created_at.slice(0, 10),
    items: [
      {
        description: `WhatsAI ${plan.name} Monthly Subscription (${plan.monthlyConversations.toLocaleString()} WhatsApp conversations, ${plan.whatsappNumbers} numbers)`,
        quantity: 1,
        unit_price: subtotal,
        total: subtotal,
      },
    ],
    subtotal,
    tax,
    total: payment.amount,
    business_name: payment.business_name || 'Sofana Decor & Living',
    business_address: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    customer_name: payment.customer_name || 'Valued WhatsAI Merchant',
    customer_phone: '+880 1711 234567',
    payment_method: payment.payment_method,
    transaction_id: payment.transaction_id,
  };
}

class PaymentService {
  /**
   * Step 1: Create a payment request.
   * Future: POST /api/payments/create-bkash
   */
  async createPayment(params: {
    businessId: string;
    planId: SubscriptionPlanId;
    amount: number;
    paymentMethod: 'bkash';
  }): Promise<{
    paymentId: string;
    demoMode: boolean;
    status: PaymentStatus;
    transactionId: string;
  }> {
    // Artificial latency to simulate server creation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const timestamp = Date.now().toString().slice(-6);
    const paymentId = `pay-demo-${timestamp}`;
    const transactionId = `DEMO-TXN-${timestamp}`;

    return {
      paymentId,
      demoMode: true,
      status: 'pending',
      transactionId,
    };
  }

  /**
   * Step 2: Get status of a payment
   * Future: GET /api/payments/:id/status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockPayments.find((p) => p.id === paymentId) || null;
  }

  /**
   * Step 3: Verify and complete a payment.
   * In future production, bKash webhook calls the backend, which verifies the signature and activates.
   * The frontend NEVER activates subscription directly — it receives verified server confirmation.
   */
  async verifyPayment(
    paymentId: string,
    simulateOutcome: 'success' | 'pending' | 'failed' = 'success',
    failureReason?: string,
    planId: SubscriptionPlanId = 'business'
  ): Promise<{
    payment: PaymentRecord;
    subscription?: SubscriptionRecord;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const plan = PLANS_CONFIG[planId] || PLANS_CONFIG.business;
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const txnId = `DEMO-TXN-${randomSuffix}`;
    const invNum = `INV-00${Math.floor(130 + Math.random() * 50)}`;

    const payment: PaymentRecord = {
      id: paymentId,
      business_id: currentSubscription.business_id,
      user_id: 'usr-rahat',
      subscription_id: currentSubscription.id,
      amount: plan.price,
      currency: 'BDT',
      payment_method: 'bkash',
      transaction_id: txnId,
      provider: 'bkash',
      status: simulateOutcome === 'success' ? 'paid' : simulateOutcome,
      created_at: now.toISOString(),
      paid_at: simulateOutcome === 'success' ? now.toISOString() : null,
      invoice_number: invNum,
      plan_id: planId,
      customer_name: 'Rahat Ali',
      business_name: 'Sofana Decor & Living',
      failure_reason:
        simulateOutcome === 'failed'
          ? failureReason || 'Payment verification failed'
          : undefined,
    };

    if (simulateOutcome === 'success') {
      // Backend verifies transaction and activates subscription
      currentSubscription = {
        ...currentSubscription,
        plan_id: planId,
        status: 'active',
        start_date: now.toISOString().slice(0, 10),
        next_billing_date: nextMonth.toISOString().slice(0, 10),
        cancelled_at: null,
      };

      // Add to mock history
      mockPayments = [payment, ...mockPayments];
      return { payment, subscription: currentSubscription };
    }

    if (simulateOutcome === 'pending') {
      mockPayments = [payment, ...mockPayments];
      return { payment };
    }

    // Failed
    mockPayments = [payment, ...mockPayments];
    return { payment };
  }

  /**
   * Get Active Subscription
   */
  async getCurrentSubscription(): Promise<SubscriptionRecord> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { ...currentSubscription };
  }

  /**
   * Cancel Subscription
   * Future: POST /api/subscriptions/cancel
   */
  async cancelSubscription(subscriptionId: string): Promise<SubscriptionRecord> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    currentSubscription = {
      ...currentSubscription,
      status: 'cancelled',
      cancelled_at: new Date().toISOString().slice(0, 10),
      auto_renew: false,
    };
    return { ...currentSubscription };
  }

  /**
   * Reactivate Subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<SubscriptionRecord> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    currentSubscription = {
      ...currentSubscription,
      status: 'active',
      cancelled_at: null,
      auto_renew: true,
    };
    return { ...currentSubscription };
  }

  /**
   * Get Payment History
   */
  async getPaymentHistory(): Promise<PaymentRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockPayments];
  }

  /**
   * Get Invoices
   */
  async getInvoices(): Promise<InvoiceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPayments.map(generateInvoiceFromPayment);
  }

  /**
   * Get Single Invoice
   */
  async getInvoiceById(invoiceNumber: string): Promise<InvoiceRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const pay = mockPayments.find((p) => p.invoice_number === invoiceNumber);
    if (!pay) return null;
    return generateInvoiceFromPayment(pay);
  }

  /**
   * Admin: Get aggregated billing metrics
   */
  async getAdminBillingMetrics(): Promise<AdminBillingMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const paid = adminMockPayments.filter((p) => p.status === 'paid');
    const totalRev = paid.reduce((sum, p) => sum + p.amount, 0);
    const mrr = paid
      .filter((p) => p.created_at.startsWith('2026-09'))
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue: totalRev,
      monthlyRevenue: mrr,
      activeSubscriptions: 142,
      pendingPayments: adminMockPayments.filter((p) => p.status === 'pending').length,
      failedPayments: adminMockPayments.filter((p) => p.status === 'failed').length,
      refundsCount: adminMockPayments.filter((p) => p.status === 'refunded').length,
    };
  }

  /**
   * Admin: Get all payments
   */
  async getAdminPayments(): Promise<PaymentRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return [...adminMockPayments];
  }
}

export const paymentService = new PaymentService();
