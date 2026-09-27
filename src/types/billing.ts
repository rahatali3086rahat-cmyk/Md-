export type SubscriptionPlanId = 'free' | 'starter' | 'business' | 'agency';

export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired' | 'past_due';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'card';

/**
 * Corresponds to future PostgreSQL / Supabase `subscriptions` table
 */
export interface SubscriptionRecord {
  id: string;
  business_id: string;
  plan_id: SubscriptionPlanId;
  status: SubscriptionStatus;
  billing_period: 'monthly' | 'annual';
  start_date: string;
  next_billing_date: string;
  cancelled_at: string | null;
  payment_method: PaymentMethodType;
  auto_renew: boolean;
}

/**
 * Corresponds to future PostgreSQL / Supabase `payments` table
 */
export interface PaymentRecord {
  id: string;
  business_id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: 'BDT';
  payment_method: PaymentMethodType;
  transaction_id: string;
  provider: 'bkash';
  status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
  invoice_number: string;
  plan_id: SubscriptionPlanId;
  customer_name?: string;
  business_name?: string;
  failure_reason?: string;
}

/**
 * Corresponds to future PostgreSQL / Supabase `invoices` table
 */
export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  business_id: string;
  subscription_id: string;
  payment_id: string;
  amount: number;
  currency: 'BDT';
  status: PaymentStatus;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  business_name: string;
  business_address: string;
  customer_name: string;
  customer_phone: string;
  payment_method: PaymentMethodType;
  transaction_id?: string;
  pdf_url?: string;
}

/**
 * Corresponds to future `payment_events` table for webhook audit logs
 */
export interface PaymentEventRecord {
  id: string;
  payment_id: string;
  event_type:
    | 'payment.created'
    | 'payment.pending'
    | 'payment.verified'
    | 'payment.failed'
    | 'subscription.activated'
    | 'subscription.cancelled';
  payload: Record<string, any>;
  created_at: string;
}

/**
 * Central Plan Definition
 */
export interface PlanDefinition {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  currency: 'BDT';
  currencySymbol: '৳';
  billingPeriod: string;
  whatsappNumbers: number;
  monthlyConversations: number;
  aiMessages: number;
  products: number;
  teamMembers: number;
  features: string[];
  highlight?: boolean;
  description: string;
}

/**
 * Real-time usage metrics against plan quotas
 */
export interface UsageMetrics {
  conversationsUsed: number;
  conversationsLimit: number;
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  productsUsed: number;
  productsLimit: number;
}

/**
 * Admin Billing Aggregated Overview
 */
export interface AdminBillingMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  pendingPayments: number;
  failedPayments: number;
  refundsCount: number;
}
