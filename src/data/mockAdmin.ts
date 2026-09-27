/**
 * Mock Admin Data for ScaleUp Gulf AI SaaS Owner Portal
 * 
 * In production, all these records are retrieved from PostgreSQL/Supabase 
 * via authenticated Admin API endpoints (/api/admin/*) with RLS.
 */

export interface SaaSClient {
  id: string;
  businessId: string;
  businessName: string;
  industry: string;
  country: string;
  city: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  phone?: string;
  plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  subscriptionStatus: 'Active' | 'Trial' | 'Past Due' | 'Cancelled' | 'Expired';
  mrr: number; // in USD or QAR equivalent
  currency: string;
  totalRevenue: number;
  channelsConnected: string[];
  conversationsCount: number;
  aiMessagesCount: number;
  automationsActive: number;
  createdDate: string;
  lastActive: string;
  lastActivity?: string;
  renewalDate?: string;
  usage: {
    whatsappMessages: number;
    whatsappLimit: number;
    aiTokensUsed: number;
    aiTokensLimit: number;
    webhookCalls: number;
  };
}

export interface SaaSSubscription {
  id: string;
  clientId: string;
  clientName: string;
  businessName?: string;
  ownerEmail: string;
  plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  billingCycle: 'monthly' | 'annually';
  amount: number;
  currency: string;
  status: 'Active' | 'Trial' | 'Past Due' | 'Cancelled' | 'Expired';
  startDate: string;
  renewalDate: string;
  paymentMethod: string;
  autoRenew: boolean;
}

export interface SaaSPayment {
  id: string;
  invoiceNumber: string;
  transactionRef?: string;
  clientId: string;
  clientName: string;
  businessName?: string;
  amount: number;
  currency: string;
  plan: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  gateway: 'Stripe' | 'Telr' | 'bKash' | 'Bank Transfer';
  paymentMethod?: string;
  date: string;
  receiptUrl?: string;
  failureReason?: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  target: string;
  targetId?: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  result: 'success' | 'warning' | 'denied' | string;
  details?: string;
}

export interface SystemHealthService {
  id: string;
  name: string;
  category: 'Workflow Automation' | 'Database' | 'Core API' | 'Messaging' | 'Email' | 'Billing' | 'AI Intelligence';
  status: 'operational' | 'warning' | 'down';
  latencyMs: number;
  uptime90d: number;
  uptimePercentage?: number;
  lastChecked: string;
  lastCheck?: string;
  details: string;
}

export const initialSaaSHealthServices: SystemHealthService[] = [
  {
    id: 'health-n8n',
    name: 'n8n Workflow Automation Engine',
    category: 'Workflow Automation',
    status: 'operational',
    latencyMs: 42,
    uptime90d: 99.94,
    lastChecked: 'Just now',
    details: 'All 48 active tenant webhooks executing within <60ms threshold.',
  },
  {
    id: 'health-db',
    name: 'PostgreSQL Primary Cluster (Supabase)',
    category: 'Database',
    status: 'operational',
    latencyMs: 12,
    uptime90d: 99.99,
    lastChecked: 'Just now',
    details: 'Connection pool at 14% utilization. Row-level multi-tenant policies active.',
  },
  {
    id: 'health-api',
    name: 'Core REST & WebSocket Gateway',
    category: 'Core API',
    status: 'operational',
    latencyMs: 28,
    uptime90d: 99.98,
    lastChecked: 'Just now',
    details: 'Express/Fastify proxy node responding normally on port 3000.',
  },
  {
    id: 'health-wa',
    name: 'Meta WhatsApp Cloud API Gateway',
    category: 'Messaging',
    status: 'operational',
    latencyMs: 85,
    uptime90d: 99.91,
    lastChecked: '1 min ago',
    details: 'WABA webhook delivery verified with 100% 24-hr window sync.',
  },
  {
    id: 'health-email',
    name: 'Transactional Email (Resend/SMTP)',
    category: 'Email',
    status: 'operational',
    latencyMs: 110,
    uptime90d: 99.89,
    lastChecked: '2 mins ago',
    details: 'DKIM and SPF verified for scaleupgulf.ai dispatch.',
  },
  {
    id: 'health-stripe',
    name: 'Stripe & Regional Payment Gateways',
    category: 'Billing',
    status: 'operational',
    latencyMs: 95,
    uptime90d: 99.96,
    lastChecked: 'Just now',
    details: 'Webhook listener active. Auto-charge webhooks processing without backlog.',
  },
  {
    id: 'health-ai',
    name: 'Google Gemini 2.5 Flash / AI Provider',
    category: 'AI Intelligence',
    status: 'operational',
    latencyMs: 310,
    uptime90d: 99.95,
    lastChecked: 'Just now',
    details: 'Server-side API key verified. Multilingual Arabic-English latency optimal.',
  },
];

export const initialSaaSClients: SaaSClient[] = [
  {
    id: 'client-1',
    businessId: 'biz-sofana',
    businessName: 'Sofana Furniture Doha',
    industry: 'Luxury Retail & Interior Design',
    country: 'Qatar',
    city: 'Doha',
    ownerName: 'Sheikh Jassim Al-Kuwari',
    ownerEmail: 'jassim@sofanafurniture.qa',
    ownerPhone: '+974 5512 8844',
    plan: 'Business',
    status: 'active',
    subscriptionStatus: 'Active',
    mrr: 1250,
    currency: 'USD',
    totalRevenue: 15000,
    channelsConnected: ['whatsapp', 'instagram', 'website', 'facebook'],
    conversationsCount: 8420,
    aiMessagesCount: 19300,
    automationsActive: 8,
    createdDate: '2026-01-15',
    lastActive: '12 mins ago',
    usage: {
      whatsappMessages: 8420,
      whatsappLimit: 15000,
      aiTokensUsed: 193000,
      aiTokensLimit: 500000,
      webhookCalls: 1240,
    },
  },
  {
    id: 'client-2',
    businessId: 'biz-oasis',
    businessName: 'Oasis Luxury Living',
    industry: 'Architecture & Fitout',
    country: 'Qatar',
    city: 'Lusail',
    ownerName: 'Mona Al-Sulaiti',
    ownerEmail: 'mona@oasisluxury.qa',
    ownerPhone: '+974 5588 3322',
    plan: 'Business',
    status: 'active',
    subscriptionStatus: 'Active',
    mrr: 1250,
    currency: 'USD',
    totalRevenue: 11250,
    channelsConnected: ['whatsapp', 'website', 'email'],
    conversationsCount: 5120,
    aiMessagesCount: 12800,
    automationsActive: 6,
    createdDate: '2026-02-10',
    lastActive: '1 hour ago',
    usage: {
      whatsappMessages: 5120,
      whatsappLimit: 15000,
      aiTokensUsed: 128000,
      aiTokensLimit: 500000,
      webhookCalls: 890,
    },
  },
  {
    id: 'client-3',
    businessId: 'biz-alnoor',
    businessName: 'Al Noor Medical Clinic',
    industry: 'Healthcare & Specialized Care',
    country: 'UAE',
    city: 'Dubai',
    ownerName: 'Dr. Tariq Mansour',
    ownerEmail: 'tariq@alnoorclinic.ae',
    ownerPhone: '+971 50 882 1934',
    plan: 'Enterprise',
    status: 'active',
    subscriptionStatus: 'Active',
    mrr: 2500,
    currency: 'USD',
    totalRevenue: 22500,
    channelsConnected: ['whatsapp', 'website', 'facebook', 'instagram', 'email'],
    conversationsCount: 14200,
    aiMessagesCount: 38400,
    automationsActive: 14,
    createdDate: '2025-11-04',
    lastActive: '5 mins ago',
    usage: {
      whatsappMessages: 14200,
      whatsappLimit: 50000,
      aiTokensUsed: 384000,
      aiTokensLimit: 1000000,
      webhookCalls: 3400,
    },
  },
  {
    id: 'client-4',
    businessId: 'biz-riyadh-auto',
    businessName: 'Riyadh Prestige Motors',
    industry: 'Automotive Dealership',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    ownerName: 'Fahad Al-Husseini',
    ownerEmail: 'fahad@riyadhmotors.sa',
    ownerPhone: '+966 54 391 2288',
    plan: 'Professional',
    status: 'active',
    subscriptionStatus: 'Active',
    mrr: 650,
    currency: 'USD',
    totalRevenue: 5200,
    channelsConnected: ['whatsapp', 'instagram'],
    conversationsCount: 3410,
    aiMessagesCount: 7600,
    automationsActive: 4,
    createdDate: '2026-03-01',
    lastActive: '3 hours ago',
    usage: {
      whatsappMessages: 3410,
      whatsappLimit: 10000,
      aiTokensUsed: 76000,
      aiTokensLimit: 250000,
      webhookCalls: 450,
    },
  },
  {
    id: 'client-5',
    businessId: 'biz-bay-dining',
    businessName: 'Pearl Bay Dining Group',
    industry: 'Hospitality & Restaurants',
    country: 'Qatar',
    city: 'The Pearl, Doha',
    ownerName: 'Carlos Rivera',
    ownerEmail: 'carlos@pearlbaydining.qa',
    ownerPhone: '+974 6633 4411',
    plan: 'Starter',
    status: 'trial',
    subscriptionStatus: 'Trial',
    mrr: 250,
    currency: 'USD',
    totalRevenue: 250,
    channelsConnected: ['whatsapp', 'instagram'],
    conversationsCount: 890,
    aiMessagesCount: 1950,
    automationsActive: 2,
    createdDate: '2026-09-02',
    lastActive: '45 mins ago',
    usage: {
      whatsappMessages: 890,
      whatsappLimit: 5000,
      aiTokensUsed: 19500,
      aiTokensLimit: 100000,
      webhookCalls: 120,
    },
  },
  {
    id: 'client-6',
    businessId: 'biz-apex-realestate',
    businessName: 'Apex Gulf Real Estate',
    industry: 'Real Estate & Brokerage',
    country: 'Bahrain',
    city: 'Manama',
    ownerName: 'Zainab Al-Mahmood',
    ownerEmail: 'zainab@apexgulf.bh',
    ownerPhone: '+973 3921 4455',
    plan: 'Professional',
    status: 'suspended',
    subscriptionStatus: 'Past Due',
    mrr: 650,
    currency: 'USD',
    totalRevenue: 3900,
    channelsConnected: ['whatsapp', 'website'],
    conversationsCount: 2200,
    aiMessagesCount: 4100,
    automationsActive: 3,
    createdDate: '2026-04-12',
    lastActive: '2 days ago',
    usage: {
      whatsappMessages: 2200,
      whatsappLimit: 10000,
      aiTokensUsed: 41000,
      aiTokensLimit: 250000,
      webhookCalls: 310,
    },
  },
];

export const initialSaaSSubscriptions: SaaSSubscription[] = [
  {
    id: 'sub-001',
    clientId: 'client-1',
    clientName: 'Sofana Furniture Doha',
    businessName: 'Sofana Furniture Doha',
    ownerEmail: 'jassim@sofanafurniture.qa',
    plan: 'Business',
    billingCycle: 'monthly',
    amount: 1250,
    currency: 'USD',
    status: 'Active',
    startDate: '2026-01-15',
    renewalDate: '2026-10-15',
    paymentMethod: 'Corporate Visa ending in 4291',
    autoRenew: true,
  },
  {
    id: 'sub-002',
    clientId: 'client-2',
    clientName: 'Oasis Luxury Living',
    businessName: 'Oasis Luxury Living',
    ownerEmail: 'mona@oasisluxury.qa',
    plan: 'Business',
    billingCycle: 'monthly',
    amount: 1250,
    currency: 'USD',
    status: 'Active',
    startDate: '2026-02-10',
    renewalDate: '2026-10-10',
    paymentMethod: 'Mastercard ending in 9812',
    autoRenew: true,
  },
  {
    id: 'sub-003',
    clientId: 'client-3',
    clientName: 'Al Noor Medical Clinic',
    businessName: 'Al Noor Medical Clinic',
    ownerEmail: 'tariq@alnoorclinic.ae',
    plan: 'Enterprise',
    billingCycle: 'annually',
    amount: 25000,
    currency: 'USD',
    status: 'Active',
    startDate: '2025-11-04',
    renewalDate: '2026-11-04',
    paymentMethod: 'Direct Bank Wire (ENBD Dubai)',
    autoRenew: true,
  },
  {
    id: 'sub-004',
    clientId: 'client-4',
    clientName: 'Riyadh Prestige Motors',
    businessName: 'Riyadh Prestige Motors',
    ownerEmail: 'fahad@riyadhmotors.sa',
    plan: 'Professional',
    billingCycle: 'monthly',
    amount: 650,
    currency: 'USD',
    status: 'Active',
    startDate: '2026-03-01',
    renewalDate: '2026-10-01',
    paymentMethod: 'Mada Debit ending in 7712',
    autoRenew: true,
  },
  {
    id: 'sub-005',
    clientId: 'client-5',
    clientName: 'Pearl Bay Dining Group',
    businessName: 'Pearl Bay Dining Group',
    ownerEmail: 'carlos@pearlbaydining.qa',
    plan: 'Starter',
    billingCycle: 'monthly',
    amount: 250,
    currency: 'USD',
    status: 'Trial',
    startDate: '2026-09-02',
    renewalDate: '2026-09-23',
    paymentMethod: 'Trial (Card pending)',
    autoRenew: true,
  },
  {
    id: 'sub-006',
    clientId: 'client-6',
    clientName: 'Apex Gulf Real Estate',
    businessName: 'Apex Gulf Real Estate',
    ownerEmail: 'zainab@apexgulf.bh',
    plan: 'Professional',
    billingCycle: 'monthly',
    amount: 650,
    currency: 'USD',
    status: 'Past Due',
    startDate: '2026-04-12',
    renewalDate: '2026-09-12',
    paymentMethod: 'Visa ending in 0029 (Expired)',
    autoRenew: false,
  },
];

export const initialSaaSPayments: SaaSPayment[] = [
  {
    id: 'pay-saas-901',
    invoiceNumber: 'INV-SUG-2026-091',
    transactionRef: 'txn_99482_str_qa',
    clientId: 'client-1',
    clientName: 'Sofana Furniture Doha',
    businessName: 'Sofana Furniture Doha',
    amount: 1250,
    currency: 'USD',
    plan: 'Business Tier - Sep 2026',
    status: 'Paid',
    gateway: 'Stripe',
    paymentMethod: 'Corporate Visa ending in 4291',
    date: '2026-09-15 08:30 AM',
    receiptUrl: 'https://receipts.scaleupgulf.ai/inv-901.pdf',
  },
  {
    id: 'pay-saas-902',
    invoiceNumber: 'INV-SUG-2026-092',
    transactionRef: 'txn_99483_str_qa',
    clientId: 'client-2',
    clientName: 'Oasis Luxury Living',
    businessName: 'Oasis Luxury Living',
    amount: 1250,
    currency: 'USD',
    plan: 'Business Tier - Sep 2026',
    status: 'Paid',
    gateway: 'Stripe',
    paymentMethod: 'Mastercard ending in 9812',
    date: '2026-09-10 11:15 AM',
    receiptUrl: 'https://receipts.scaleupgulf.ai/inv-902.pdf',
  },
  {
    id: 'pay-saas-903',
    invoiceNumber: 'INV-SUG-2026-093',
    transactionRef: 'txn_88120_tlr_sa',
    clientId: 'client-4',
    clientName: 'Riyadh Prestige Motors',
    businessName: 'Riyadh Prestige Motors',
    amount: 650,
    currency: 'USD',
    plan: 'Professional Tier - Sep 2026',
    status: 'Paid',
    gateway: 'Telr',
    paymentMethod: 'Mada Debit ending in 7712',
    date: '2026-09-01 02:40 PM',
    receiptUrl: 'https://receipts.scaleupgulf.ai/inv-903.pdf',
  },
  {
    id: 'pay-saas-904',
    invoiceNumber: 'INV-SUG-2026-094',
    transactionRef: 'txn_77192_str_bh',
    clientId: 'client-6',
    clientName: 'Apex Gulf Real Estate',
    businessName: 'Apex Gulf Real Estate',
    amount: 650,
    currency: 'USD',
    plan: 'Professional Tier - Sep Renewal',
    status: 'Failed',
    gateway: 'Stripe',
    paymentMethod: 'Visa ending in 0029',
    date: '2026-09-12 09:00 AM',
    failureReason: 'Card expired / insufficient funds',
  },
  {
    id: 'pay-saas-905',
    invoiceNumber: 'INV-SUG-2026-085',
    transactionRef: 'wire_ref_enbd_9918',
    clientId: 'client-3',
    clientName: 'Al Noor Medical Clinic',
    businessName: 'Al Noor Medical Clinic',
    amount: 25000,
    currency: 'USD',
    plan: 'Enterprise Annual License',
    status: 'Paid',
    gateway: 'Bank Transfer',
    paymentMethod: 'Direct Bank Wire (ENBD Dubai)',
    date: '2025-11-04 10:00 AM',
    receiptUrl: 'https://receipts.scaleupgulf.ai/inv-085.pdf',
  },
];

export const initialAdminAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-101',
    adminName: 'SaaS Super Admin',
    adminEmail: 'admin@scaleupgulf.ai',
    action: 'Changed Client Plan',
    target: 'Apex Gulf Real Estate -> Upgraded to Professional',
    targetId: 'client-6',
    ipAddress: '82.148.100.41',
    location: 'Doha, Qatar',
    timestamp: '2026-09-15 16:42:10',
    result: 'success',
  },
  {
    id: 'log-102',
    adminName: 'SaaS Super Admin',
    adminEmail: 'admin@scaleupgulf.ai',
    action: 'Triggered Global n8n Health Ping',
    target: 'n8n Automated Cluster Diagnostic',
    ipAddress: '82.148.100.41',
    location: 'Doha, Qatar',
    timestamp: '2026-09-15 14:15:02',
    result: 'success',
  },
  {
    id: 'log-103',
    adminName: 'Security Automation',
    adminEmail: 'system@scaleupgulf.ai',
    action: 'Flagged Failed Payment Notification',
    target: 'Apex Gulf Real Estate (Card Expired)',
    targetId: 'client-6',
    ipAddress: '10.0.4.12',
    location: 'Cloud Ingress',
    timestamp: '2026-09-12 09:02:11',
    result: 'warning',
  },
  {
    id: 'log-104',
    adminName: 'SaaS Super Admin',
    adminEmail: 'admin@scaleupgulf.ai',
    action: 'Activated WABA Cloud Partner Webhook',
    target: 'Pearl Bay Dining Group',
    targetId: 'client-5',
    ipAddress: '82.148.100.41',
    location: 'Doha, Qatar',
    timestamp: '2026-09-02 11:20:00',
    result: 'success',
  },
  {
    id: 'log-105',
    adminName: 'SaaS Super Admin',
    adminEmail: 'admin@scaleupgulf.ai',
    action: 'Updated Global Pricing Tier Limits',
    target: 'Starter & Business AI Message Caps',
    ipAddress: '82.148.100.41',
    location: 'Doha, Qatar',
    timestamp: '2026-08-28 17:05:44',
    result: 'success',
  },
];
