export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'booked' | 'won' | 'lost';

export type ConversationStatus = 'ai' | 'human';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type KnowledgeCategory =
  | 'Business Information'
  | 'FAQs'
  | 'Products'
  | 'Services'
  | 'Policies'
  | 'Delivery'
  | 'Returns'
  | string;

export interface Business {
  id: string;
  name: string;
  industry: string;
  website?: string;
  country: string;
  city?: string;
  description?: string;
  contactPhone?: string;
  businessEmail?: string;
  whatsappStatus: 'connected' | 'disconnected' | 'connecting';
  whatsappPhone: string;
  metaAccountId?: string;
  currency?: string;
  timezone?: string;
  workingHours?: string;
  address?: string;
  email?: string;
  phone?: string;
  plan?: string;
  conversationsUsed?: number;
  conversationsLimit?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'Owner' | 'Admin' | 'Agent';
  avatar?: string;
  businessId?: string;
  businessName?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'ai' | 'agent';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  suggestedProduct?: string;
}

import { ChannelType } from './omnichannel';

export interface Conversation {
  id: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAvatar?: string;
  channel: ChannelType;
  channelIdentifier?: string;
  conversationType?: 'lead' | 'booking' | 'payment' | 'support' | 'general';
  stage?: 'open' | 'pending' | 'resolved';
  location: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: ConversationStatus;
  interestedProduct: string;
  budget: string;
  leadStatus: LeadStatus;
  tags: string[];
  assignedAgent?: string;
  notes?: string;
  historySummary?: string;
}

export interface Product {
  id: string;
  businessId?: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stockStatus: StockStatus;
  stockCount: number;
  image: string;
  features?: string[];
  createdAt?: string;
  // Aliases for convenience
  inStock?: boolean;
  stockQuantity?: number;
  imageUrl?: string;
}

export interface KnowledgeItem {
  id: string;
  businessId?: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  status: 'active' | 'draft';
  updatedAt?: string;
  // Aliases for convenience
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export interface Lead {
  id: string;
  businessId?: string;
  name: string;
  customerName?: string;
  phone: string;
  interestedIn?: string;
  product?: string;
  interestedProduct?: string;
  budget: string;
  location?: string;
  source?: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
  assignedAgent?: string;
  conversationId?: string;
}

export interface AIAgentConfig {
  businessId: string;
  agentName: string;
  businessRole: string;
  languages: string[];
  tone: 'Friendly' | 'Professional' | 'Concise';
  primaryGoal: string;
  secondaryGoals: string[];
  autoReply: boolean;
  useProducts: boolean;
  useKnowledge: boolean;
  captureLeads: boolean;
  humanHandoff: boolean;
  neverInventPrices: boolean;
  neverInventStock: boolean;
  requireHumanApproval: boolean;
  advancedInstructions: string;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'lead' | 'handoff' | 'system' | 'milestone';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Agent' | 'Manager';
  status: 'active' | 'pending';
  joinedDate: string;
  avatar?: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  conversationLimit: number;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface PricingPlan {
  id: 'free' | 'starter' | 'business' | 'agency';
  name: string;
  priceMonthly: number;
  conversationsLimit: number;
  aiMessagesLimit: number;
  productsLimit: number;
  features: string[];
  isCurrent?: boolean;
}

export * from './billing';
export * from './omnichannel';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export type NavView =
  | 'dashboard'
  | 'inbox'
  | 'customers'
  | 'leads'
  | 'bookings'
  | 'products'
  | 'services'
  | 'invoices'
  | 'payments'
  | 'automations'
  | 'ai-agent'
  | 'knowledge'
  | 'campaigns'
  | 'analytics'
  | 'integrations'
  | 'channels'
  | 'security'
  | 'settings'
  | 'settings-channels'
  | 'settings-whatsapp'
  | 'settings-business'
  | 'settings-team'
  | 'settings-billing'
  | 'settings-security'
  // Admin Portal Views
  | 'admin'
  | 'admin-overview'
  | 'admin-clients'
  | 'admin-subscriptions'
  | 'admin-payments'
  | 'admin-plans'
  | 'admin-revenue'
  | 'admin-usage'
  | 'admin-logs'
  | 'admin-automation-health'
  | 'admin-support'
  | 'admin-settings'
  // Authentication Views
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'admin-login';
