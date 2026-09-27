import { PlanDefinition, SubscriptionPlanId, UsageMetrics } from '../types/billing';

/**
 * Centralized Pricing & Plans Configuration
 * 
 * IMPORTANT:
 * All pricing values and plan limits are defined here.
 * Do not hard-code pricing inside individual components.
 */
export const PLANS_CONFIG: Record<SubscriptionPlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'BDT',
    currencySymbol: '৳',
    billingPeriod: 'month',
    whatsappNumbers: 1,
    monthlyConversations: 100,
    aiMessages: 500,
    products: 10,
    teamMembers: 1,
    description: 'Basic exploration plan for testing WhatsApp automation.',
    features: [
      '1 WhatsApp number',
      '100 conversations/month',
      'Basic AI agent',
      '10 products',
      'Basic lead capture',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 1999,
    currency: 'BDT',
    currencySymbol: '৳',
    billingPeriod: 'month',
    whatsappNumbers: 1,
    monthlyConversations: 2000,
    aiMessages: 5000,
    products: 50,
    teamMembers: 2,
    description: 'Ideal for small retail shops and boutique brands.',
    features: [
      '1 WhatsApp number',
      '2,000 conversations/month',
      'AI customer support',
      'Product knowledge base',
      'Lead capture',
      'Human handoff',
      'Basic analytics',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 4999,
    currency: 'BDT',
    currencySymbol: '৳',
    billingPeriod: 'month',
    whatsappNumbers: 3,
    monthlyConversations: 10000,
    aiMessages: 20000,
    products: 500,
    teamMembers: 5,
    highlight: true,
    description: 'Most popular tier for fast-scaling businesses and e-commerce stores.',
    features: [
      '3 WhatsApp numbers',
      '10,000 conversations/month',
      'Advanced AI agent',
      'Product image understanding',
      'Lead qualification',
      'Human handoff',
      'Analytics',
      'Priority support',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 9999,
    currency: 'BDT',
    currencySymbol: '৳',
    billingPeriod: 'month',
    whatsappNumbers: 10,
    monthlyConversations: 50000,
    aiMessages: 100000,
    products: 2000,
    teamMembers: 20,
    description: 'High-volume deployment for digital marketing agencies & conglomerates.',
    features: [
      '10 WhatsApp numbers',
      '50,000 conversations/month',
      'Multiple businesses',
      'Advanced automation',
      'AI image understanding',
      'CRM integrations',
      'Client management',
      'Advanced analytics',
    ],
  },
};

export const PLANS_LIST: PlanDefinition[] = Object.values(PLANS_CONFIG);

/**
 * Format BDT currency consistently: e.g. ৳4,999
 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-US')}`;
}

/**
 * Calculate usage percent clamped between 0 and 100
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (!limit || limit <= 0) return 0;
  const pct = (used / limit) * 100;
  return Math.min(100, Math.round(pct * 10) / 10);
}

/**
 * Check usage threshold warning state
 */
export function getUsageWarningState(
  used: number,
  limit: number
): 'normal' | 'warning' | 'exceeded' {
  if (used >= limit) return 'exceeded';
  if (used / limit >= 0.8) return 'warning';
  return 'normal';
}

/**
 * bKash Brand & Configuration Constants (Safe for Frontend)
 * NOTE: Do NOT store any secret API credentials or merchant private keys here.
 */
export const BKASH_CONFIG = {
  name: 'bKash',
  tagline: 'Pay securely using bKash.',
  primaryColor: '#E2136E', // Official bKash Pink
  accentBg: '#FFF0F6',
  buttonLabel: 'Pay with bKash',
  supportContact: 'support@whatsai.com',
  isDemoMode: true,
  demoNotice:
    'Demo Payment Mode: This is a simulated checkout test environment. No real funds will be deducted.',
};
