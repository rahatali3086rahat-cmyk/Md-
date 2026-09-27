export type ChannelType =
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'website'
  | 'email'
  | 'telegram'
  | 'tiktok'
  | 'sms';

export type GlobalCurrency = 'BDT' | 'USD' | 'QAR' | 'SAR' | 'AED' | 'EUR' | 'GBP';

export interface ChannelAccount {
  id: string;
  businessId: string;
  channel: ChannelType;
  type?: ChannelType;
  channelName: string;
  name?: string;
  accountIdentifier: string; // phone number, IG handle, page name, domain, or email
  status: 'connected' | 'disconnected' | 'connecting' | 'coming_soon';
  lastSyncAt?: string;
  lastSync?: string;
  totalConversations: number;
  unreadCount: number;
  isOfficialApi: boolean;
  webhookUrl?: string;
}

export interface WebsiteChatWidgetConfig {
  id: string;
  businessId: string;
  widgetColor: string;
  themeColor?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left';
  agentName: string;
  businessHours: string;
  autoOpenDelaySeconds: number;
  isActive: boolean;
}

export interface CustomerIdentity {
  id: string;
  channel: ChannelType;
  identifier: string; // e.g., '+974 5521 9874', '@rahim.design', 'fb_psid_9921', 'rahim@example.com'
  isPrimary: boolean;
  verifiedAt?: string;
}

export type CustomerLifecycleStage =
  | 'visitor'
  | 'conversation'
  | 'lead'
  | 'prospect'
  | 'qualified'
  | 'booking'
  | 'invoice'
  | 'payment'
  | 'customer'
  | 'vip'
  | 'churned'
  | 'followup'
  | 'repeat';

export interface CustomerTimelineEvent {
  id: string;
  customerId: string;
  timestamp: string;
  stage: CustomerLifecycleStage;
  title: string;
  description: string;
  channel?: ChannelType;
  actor: 'ai' | 'customer' | 'agent' | 'system';
  metadata?: Record<string, any>;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address?: string;
  location?: string;
  company?: string;
  tags: string[];
  channels?: ChannelType[];
  identities: CustomerIdentity[];
  leadStatus: 'new' | 'contacted' | 'qualified' | 'proposal' | 'booked' | 'won' | 'lost';
  lifecycleStage: CustomerLifecycleStage;
  totalSpend: number;
  totalBookings?: number;
  firstSeenDate?: string;
  currency: GlobalCurrency;
  notes?: string;
  createdAt: string;
  lastActiveAt: string;
}

export type CRMLeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'booked'
  | 'won'
  | 'lost';

export type LeadSource =
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'website'
  | 'email'
  | 'manual';

export interface CRMLead {
  id: string;
  businessId: string;
  customerId?: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  country: string;
  city: string;
  source: LeadSource;
  interestedProductOrService: string;
  budget: string;
  status: CRMLeadStatus;
  assignedAgent: string;
  lastContact: string;
  nextFollowUp: string;
  createdAt: string;
  notes?: string;
  conversationId?: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Booking {
  id: string;
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "15:00"
  durationMinutes: number;
  assignedStaff: string;
  location: string;
  status: BookingStatus;
  notes?: string;
  channelOrigin?: ChannelType;
  channel?: ChannelType;
  price?: number;
  currency?: GlobalCurrency | string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  currency: GlobalCurrency | string;
  durationMinutes: number;
  availability?: string;
  assignedStaff?: string[];
  category: string;
  isActive: boolean;
}

export type BusinessInvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'pending'
  | 'overdue'
  | 'cancelled';

export type InvoiceStatus = BusinessInvoiceStatus;

export interface BusinessInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  totalPrice?: number;
}

export interface BusinessInvoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: BusinessInvoiceLineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  totalAmount?: number;
  currency: GlobalCurrency | string;
  status: BusinessInvoiceStatus;
  dueDate: string;
  createdDate: string;
  notes?: string;
  deliveryChannel?: ChannelType;
  paymentUrl?: string;
  paymentLink?: string;
  paidAt?: string;
}

export type ClientPaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded' | 'settled';

export type ClientPaymentMethod =
  | 'bkash'
  | 'stripe'
  | 'paypal'
  | 'credit_card'
  | 'apple_pay'
  | 'bank_transfer'
  | string;

export interface ClientPayment {
  id: string;
  businessId: string;
  transactionId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerId?: string;
  customerName: string;
  amount: number;
  currency: GlobalCurrency | string;
  paymentMethod: ClientPaymentMethod;
  status: ClientPaymentStatus;
  date: string;
  paidAt?: string;
  channel?: ChannelType;
  failureReason?: string;
}

export type WorkflowBlockType =
  | 'trigger'
  | 'condition'
  | 'ai_action'
  | 'message'
  | 'lead'
  | 'booking'
  | 'invoice'
  | 'payment'
  | 'notification'
  | 'wait'
  | 'human_handoff';

export interface WorkflowBlock {
  id: string;
  type: WorkflowBlockType;
  label: string;
  description: string;
  channel?: ChannelType | 'all';
  config: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  businessId: string;
  name: string;
  description: string;
  isActive: boolean;
  category: string;
  triggerChannel: ChannelType | 'all';
  triggerEvent: string;
  blocks: WorkflowBlock[];
  executionCount: number;
  lastTriggeredAt?: string;
}

export interface AutomationTemplate {
  id: string;
  title: string;
  category:
    | 'Lead Generation'
    | 'Customer Support'
    | 'Sales'
    | 'Booking'
    | 'Invoice'
    | 'Payment'
    | 'Follow-up'
    | 'Marketing';
  description: string;
  triggerDesc: string;
  actionsDesc: string;
  channels: ChannelType[];
  blocks: WorkflowBlock[];
}

export interface FollowUpStep {
  stepNumber: number;
  delayText: string;
  actionTitle: string;
  actionMessage: string;
  channel: ChannelType;
}

export interface FollowUpSequence {
  id: string;
  businessId: string;
  name: string;
  targetSegment: string;
  steps: FollowUpStep[];
  scheduledCount: number;
  sentCount: number;
  failedCount: number;
  cancelledCount: number;
  status: 'active' | 'paused' | 'draft';
}

export type FollowUpJob = FollowUpSequence;

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'active';

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  audience: string;
  audienceCount: number;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'email';
  channels?: ('whatsapp' | 'facebook' | 'instagram' | 'email')[];
  message: string;
  scheduledAt: string;
  scheduledFor?: string;
  targetSegment?: string;
  status: CampaignStatus;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  convertedCount?: number;
}

export type ApprovalActionType =
  | 'booking_modification'
  | 'invoice_cancellation'
  | 'refund_request'
  | 'high_value_lead'
  | 'custom_quotation';

export interface ApprovalRequest {
  id: string;
  businessId: string;
  actionType: ApprovalActionType;
  title: string;
  customerName: string;
  customerAvatar?: string;
  channel: ChannelType;
  aiRecommendation: string;
  details: string;
  proposedChange: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
