import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Business,
  Conversation,
  Message,
  Product,
  KnowledgeItem,
  Lead,
  AIAgentConfig,
  NotificationItem,
  TeamMember,
  NavView,
  ToastMessage,
  LeadStatus,
  BillingPlan,
} from '../types';
import { businessService } from '../services/businessService';
import { conversationService } from '../services/conversationService';
import { productService } from '../services/productService';
import { leadService } from '../services/leadService';
import { knowledgeService } from '../services/knowledgeService';
import { aiService } from '../services/aiService';
import { analyticsService, AnalyticsPayload } from '../services/analyticsService';
import { teamService } from '../services/teamService';
import {
  SubscriptionRecord,
  PaymentRecord,
  InvoiceRecord,
  SubscriptionPlanId,
  UsageMetrics,
} from '../types/billing';
import { paymentService } from '../services/paymentService';
import { PLANS_CONFIG } from '../config/plans';
import {
  ChannelAccount,
  ChannelType,
  WebsiteChatWidgetConfig,
  Customer,
  CustomerTimelineEvent,
  CustomerLifecycleStage,
  Booking,
  BookingStatus,
  ServiceItem,
  BusinessInvoice,
  BusinessInvoiceStatus,
  ClientPayment,
  AutomationRule,
  AutomationTemplate,
  FollowUpSequence,
  Campaign,
  ApprovalRequest,
} from '../types/omnichannel';
import { channelService } from '../services/channelService';
import { customerService } from '../services/customerService';
import { bookingService } from '../services/bookingService';
import { servicesService } from '../services/servicesService';
import { invoiceService } from '../services/invoiceService';
import { clientPaymentService } from '../services/clientPaymentService';
import { automationService } from '../services/automationService';
import { approvalService } from '../services/approvalService';
import { campaignService } from '../services/campaignService';
import { authApi, AuthUser, RegisterPayload } from '../services/api/authApi';
import {
  SaaSClient,
  SaaSSubscription,
  SaaSPayment,
  SystemHealthService,
  AdminAuditLog,
  initialSaaSClients,
  initialSaaSSubscriptions,
  initialSaaSPayments,
  initialSaaSHealthServices,
  initialAdminAuditLogs,
} from '../data/mockAdmin';

interface AppContextType {
  // User Authentication & Session
  currentUser: AuthUser | null;
  loginClient: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerClient: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;

  // SaaS Executive Admin Portal
  saasClients: SaaSClient[];
  saasSubscriptions: SaaSSubscription[];
  saasPayments: SaaSPayment[];
  saasHealthServices: SystemHealthService[];
  adminAuditLogs: AdminAuditLog[];
  updateClientStatus: (clientId: string, status: SaaSClient['status']) => Promise<void>;
  updateClientPlan: (clientId: string, plan: SaaSClient['plan']) => Promise<void>;
  pingHealthService: (serviceId: string) => Promise<void>;

  // Navigation & View
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Business & User
  currentBusiness: Business | null;
  businesses: Business[];
  switchBusiness: (id: string) => void;
  updateBusinessProfile: (updates: Partial<Business>) => Promise<void>;
  toggleWhatsAppConnection: () => Promise<void>;

  // Conversations & Inbox
  conversations: Conversation[];
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  selectConversationAndOpenInbox: (id: string) => void;
  activeConversationMessages: Message[];
  sendChatMessage: (text: string) => Promise<void>;
  takeOverConversation: (convId?: string) => Promise<void>;
  toggleAIForConversation: (convId: string, enabled: boolean) => Promise<void>;
  updateConversationLead: (convId: string, updates: Partial<Conversation>) => Promise<void>;

  // Products
  products: Product[];
  createProduct: (data: any) => Promise<Product>;
  addProduct: (data: any) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Leads
  leads: Lead[];
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  createLead: (data: Omit<Lead, 'id' | 'createdAt'>) => Promise<Lead>;

  // Knowledge Base
  knowledge: KnowledgeItem[];
  knowledgeItems: KnowledgeItem[];
  createKnowledgeItem: (data: any) => Promise<KnowledgeItem>;
  addKnowledgeItem: (data: any) => Promise<KnowledgeItem>;
  updateKnowledgeItem: (id: string, updates: any) => Promise<KnowledgeItem>;
  deleteKnowledgeItem: (id: string) => Promise<void>;

  // AI Agent Settings
  aiConfig: AIAgentConfig | null;
  updateAISettings: (updates: Partial<AIAgentConfig>) => Promise<void>;
  testAIPrompt: (message: string) => Promise<string>;

  // Team & Notifications
  teamMembers: TeamMember[];
  inviteTeamMember: (dataOrEmail: { name?: string; email: string; role?: any } | string, role?: any) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // Analytics Stats
  analyticsData: AnalyticsPayload | null;
  refreshAnalytics: (range?: 'today' | '7days' | '30days' | '90days') => Promise<void>;

  // Billing Plans
  billingPlans: BillingPlan[];
  upgradePlan: (planId: string) => Promise<void>;

  // bKash Subscription & Payment Management
  subscription: SubscriptionRecord | null;
  usageMetrics: UsageMetrics;
  paymentHistory: PaymentRecord[];
  invoices: InvoiceRecord[];
  selectedInvoice: InvoiceRecord | null;
  isCheckoutModalOpen: boolean;
  isDemoSimulatorOpen: boolean;
  isCancelModalOpen: boolean;
  activeCheckoutPlanId: SubscriptionPlanId;
  paymentOutcomeView: 'success' | 'failed' | 'pending' | null;
  lastPaymentResult: {
    planId: SubscriptionPlanId;
    amount: number;
    transactionId: string;
    failureReason?: string;
  } | null;
  openCheckout: (planId?: SubscriptionPlanId) => void;
  closeCheckout: () => void;
  openDemoSimulator: (planId: SubscriptionPlanId, amount: number) => void;
  closeDemoSimulator: () => void;
  handleSimulateSuccess: (txnId: string) => Promise<void>;
  handleSimulatePending: (txnId: string) => Promise<void>;
  handleSimulateFailed: (reason: string) => Promise<void>;
  cancelActiveSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  openCancelModal: () => void;
  closeCancelModal: () => void;
  viewInvoice: (invoiceNumber: string) => Promise<void>;
  closeInvoice: () => void;
  resetPaymentOutcomeView: () => void;

  // Omnichannel Channels
  channels: ChannelAccount[];
  toggleChannelConnection: (id: string) => Promise<void>;
  widgetConfig: WebsiteChatWidgetConfig;
  updateWidgetConfig: (updates: Partial<WebsiteChatWidgetConfig>) => Promise<void>;

  // Omnichannel Customers & Lifecycle CRM
  customers: Customer[];
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  updateCustomerLifecycleStage: (id: string, stage: CustomerLifecycleStage) => Promise<void>;
  customerTimelineEvents: CustomerTimelineEvent[];
  addCustomerTimelineEvent: (event: Omit<CustomerTimelineEvent, 'id'>) => Promise<void>;

  // Bookings & Services
  bookings: Booking[];
  createBooking: (data: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  servicesList: ServiceItem[];
  createService: (data: Omit<ServiceItem, 'id'>) => Promise<ServiceItem>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Business Invoices & Client Payments
  businessInvoices: BusinessInvoice[];
  createBusinessInvoice: (data: Omit<BusinessInvoice, 'id' | 'createdDate'>) => Promise<BusinessInvoice>;
  sendInvoiceViaChannel: (id: string, channel: ChannelType) => Promise<void>;
  markInvoicePaid: (id: string) => Promise<void>;
  updateBusinessInvoiceStatus: (id: string, status: BusinessInvoiceStatus) => Promise<void>;
  deleteBusinessInvoice: (id: string) => Promise<void>;
  clientPayments: ClientPayment[];
  recordClientPayment: (data: Omit<ClientPayment, 'id' | 'date'>) => Promise<ClientPayment>;

  // Automations, Templates & Follow-ups
  automations: AutomationRule[];
  automationTemplates: AutomationTemplate[];
  followUps: FollowUpSequence[];
  toggleAutomation: (id: string) => Promise<void>;
  createAutomation: (data: Omit<AutomationRule, 'id' | 'executionCount'>) => Promise<AutomationRule>;
  useAutomationTemplate: (templateId: string) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;

  // Human Approval Queue
  approvals: ApprovalRequest[];
  resolveApproval: (id: string, status: 'approved' | 'rejected') => Promise<void>;

  // Campaigns & Broadcasts
  campaigns: Campaign[];
  createCampaign: (data: Omit<Campaign, 'id' | 'sentCount' | 'deliveredCount' | 'readCount' | 'repliedCount'>) => Promise<Campaign>;
  toggleCampaignStatus: (id: string) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
  dismissToast: (id: string) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // General loading
  loading: boolean;
  refreshData: () => Promise<void>;
}

const defaultBillingPlans: BillingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 49,
    conversationLimit: 5000,
    description: 'Perfect for small retailers & boutique showrooms launching WhatsApp automation.',
    features: [
      '1 Connected WhatsApp number',
      '5,000 monthly conversations',
      'AI Lead extraction & scoring',
      'Human agent handoff & live takeover',
      'Catalog sync up to 100 items',
      'Email & WhatsApp support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Automation',
    price: 129,
    conversationLimit: 15000,
    description: 'Designed for fast-growing businesses needing higher conversation quotas and multi-agent inboxes.',
    features: [
      '3 Connected WhatsApp numbers',
      '15,000 monthly conversations',
      'Multi-agent team inbox & routing',
      'Advanced AI guardrails & custom prompt',
      'Unlimited products & knowledge entries',
      'Webhook sync to n8n, CRM & Zapier',
      'Priority 24/7 support',
    ],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    price: 299,
    conversationLimit: 50000,
    description: 'Full custom deployment for enterprise chains, multi-branches, and high-volume WhatsApp traffic.',
    features: [
      'Unlimited WhatsApp numbers & branches',
      '50,000+ monthly conversations',
      'Custom LLM fine-tuning & Gemini models',
      'Custom SLA & dedicated account manager',
      'Custom security & on-premise webhook bridge',
      'White-label portal with custom domain',
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Theme state with localStorage persistence and system preference support
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('whatsai_theme');
        if (saved === 'light' || saved === 'dark') return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch {
        // Ignore localStorage error in sandboxed environment
      }
    }
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('whatsai_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  }, []);

  // Data state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv-rahim');
  const [activeConversationMessages, setActiveConversationMessages] = useState<Message[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [aiConfig, setAiConfig] = useState<AIAgentConfig | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsPayload | null>(null);
  const [billingPlans] = useState<BillingPlan[]>(defaultBillingPlans);

  // bKash Subscription & Billing State
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>({
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
  });

  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({
    conversationsUsed: 3240,
    conversationsLimit: 10000,
    aiMessagesUsed: 7842,
    aiMessagesLimit: 20000,
    productsUsed: 42,
    productsLimit: 500,
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  // Modals & Flow States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isDemoSimulatorOpen, setIsDemoSimulatorOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [activeCheckoutPlanId, setActiveCheckoutPlanId] = useState<SubscriptionPlanId>('business');
  const [paymentOutcomeView, setPaymentOutcomeView] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [lastPaymentResult, setLastPaymentResult] = useState<{
    planId: SubscriptionPlanId;
    amount: number;
    transactionId: string;
    failureReason?: string;
  } | null>(null);

  // Omnichannel States
  const [channels, setChannels] = useState<ChannelAccount[]>([]);
  const [widgetConfig, setWidgetConfig] = useState<WebsiteChatWidgetConfig>({
    id: 'widget-001',
    businessId: 'biz-sofana',
    widgetColor: '#059669',
    welcomeMessage: 'Hello! How can we assist you with our services today?',
    position: 'bottom-right',
    agentName: 'WhatsAI Assistant',
    businessHours: 'Sunday - Thursday, 9:00 AM - 9:00 PM',
    autoOpenDelaySeconds: 5,
    isActive: true,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerTimelineEvents, setCustomerTimelineEvents] = useState<CustomerTimelineEvent[]>([]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);

  const [businessInvoices, setBusinessInvoices] = useState<BusinessInvoice[]>([]);
  const [clientPayments, setClientPayments] = useState<ClientPayment[]>([]);

  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [automationTemplates, setAutomationTemplates] = useState<AutomationTemplate[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpSequence[]>([]);

  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // User Authentication & Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('whatsai_auth_user');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Ignore
      }
    }
    // Default active client session
    return {
      id: 'usr-client-01',
      name: 'Sheikh Jassim Al-Kuwari',
      email: 'jassim@sofanafurniture.qa',
      role: 'client',
      businessId: 'biz-sofana',
      businessName: 'Sofana Furniture Doha',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+974 5512 8844',
      emailVerified: true,
    };
  });

  // SaaS Executive Admin State
  const [saasClients, setSaasClients] = useState<SaaSClient[]>(initialSaaSClients);
  const [saasSubscriptions, setSaasSubscriptions] = useState<SaaSSubscription[]>(initialSaaSSubscriptions);
  const [saasPayments, setSaasPayments] = useState<SaaSPayment[]>(initialSaaSPayments);
  const [saasHealthServices, setSaasHealthServices] = useState<SystemHealthService[]>(initialSaaSHealthServices);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(initialAdminAuditLogs);

  // Authentication Handlers
  const loginClient = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const user = res.data.user;
    setCurrentUser(user);
    try {
      localStorage.setItem('whatsai_auth_user', JSON.stringify(user));
    } catch {}

    // Link user to matching business or create one
    if (user.businessId) {
      const match = businesses.find((b) => b.id === user.businessId);
      if (match) {
        setCurrentBusiness(match);
      } else {
        const newBiz: Business = {
          id: user.businessId,
          name: user.businessName || 'My Workspace',
          industry: 'Luxury Retail & Furniture',
          country: 'Qatar',
          city: 'Doha',
          whatsappStatus: 'connected',
          whatsappPhone: user.phone || '+974 5512 8844',
          email: user.email,
          plan: 'Business',
          conversationsUsed: 3240,
          conversationsLimit: 10000,
        };
        setBusinesses((prev) => [newBiz, ...prev]);
        setCurrentBusiness(newBiz);
      }
    }
    setCurrentView('dashboard');
  }, [businesses]);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const res = await authApi.adminLogin(email, password);
    const user = res.data.user;
    setCurrentUser(user);
    try {
      localStorage.setItem('whatsai_auth_user', JSON.stringify(user));
    } catch {}
    setCurrentView('admin-overview');
  }, []);

  const registerClient = useCallback(async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    const user = res.data.user;
    user.emailVerified = true;
    setCurrentUser(user);
    try {
      localStorage.setItem('whatsai_auth_user', JSON.stringify(user));
    } catch {}

    const newBizId = user.businessId || `biz-${Date.now()}`;
    const newBiz: Business = {
      id: newBizId,
      name: payload.businessName,
      industry: payload.industry || 'Luxury Retail & Furniture',
      country: 'Qatar',
      city: 'Doha',
      whatsappStatus: 'connected',
      whatsappPhone: payload.phone || '+974 5500 0000',
      email: payload.email,
      plan: 'Starter',
      conversationsUsed: 0,
      conversationsLimit: 5000,
    };
    setBusinesses((prev) => [newBiz, ...prev]);
    setCurrentBusiness(newBiz);

    const newClient: SaaSClient = {
      id: `client-${Date.now()}`,
      businessId: newBizId,
      businessName: payload.businessName,
      industry: payload.industry,
      country: 'Qatar',
      city: 'Doha',
      ownerName: payload.ownerName,
      ownerEmail: payload.email,
      ownerPhone: payload.phone || '',
      plan: 'Starter',
      status: 'trial',
      subscriptionStatus: 'Trial',
      mrr: 250,
      currency: 'USD',
      totalRevenue: 250,
      channelsConnected: ['whatsapp'],
      conversationsCount: 0,
      aiMessagesCount: 0,
      automationsActive: 1,
      createdDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      usage: {
        whatsappMessages: 0,
        whatsappLimit: 5000,
        aiTokensUsed: 0,
        aiTokensLimit: 100000,
        webhookCalls: 0,
      },
    };
    setSaasClients((prev) => [newClient, ...prev]);
    setCurrentView('dashboard');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setCurrentUser(null);
    try {
      localStorage.removeItem('whatsai_auth_user');
    } catch {}
    setCurrentView('login');
    addToast('info', 'Signed Out', 'You have been safely signed out.');
  }, [addToast]);

  const updateClientStatus = useCallback(async (clientId: string, status: SaaSClient['status']) => {
    setSaasClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status } : c))
    );
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.name || 'SaaS Super Admin',
      adminEmail: currentUser?.email || 'admin@scaleupgulf.ai',
      action: `Updated client status to ${status}`,
      target: clientId,
      targetId: clientId,
      ipAddress: '82.148.100.41',
      location: 'Doha, Qatar',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      result: 'success',
    };
    setAdminAuditLogs((prev) => [newLog, ...prev]);
  }, [currentUser]);

  const updateClientPlan = useCallback(async (clientId: string, plan: SaaSClient['plan']) => {
    setSaasClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, plan } : c))
    );
    setSaasSubscriptions((prev) =>
      prev.map((s) => (s.clientId === clientId ? { ...s, plan } : s))
    );
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.name || 'SaaS Super Admin',
      adminEmail: currentUser?.email || 'admin@scaleupgulf.ai',
      action: `Changed client plan tier to ${plan}`,
      target: clientId,
      targetId: clientId,
      ipAddress: '82.148.100.41',
      location: 'Doha, Qatar',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      result: 'success',
    };
    setAdminAuditLogs((prev) => [newLog, ...prev]);
  }, [currentUser]);

  const pingHealthService = useCallback(async (serviceId: string) => {
    const randomizedLatency = Math.floor(Math.random() * 45) + 18;
    setSaasHealthServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              status: 'operational',
              latencyMs: randomizedLatency,
              lastChecked: 'Just now',
            }
          : s
      )
    );
  }, []);

  // Initial data bootstrap
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        bizList,
        convList,
        prodList,
        leadList,
        kbList,
        aiSettings,
        teamList,
        notifList,
        analytics,
      ] = await Promise.all([
        businessService.getBusinesses(),
        conversationService.getConversations(),
        productService.getProducts(),
        leadService.getLeads(),
        knowledgeService.getKnowledgeItems(),
        aiService.getAISettings(),
        teamService.getTeam(),
        teamService.getNotifications(),
        analyticsService.getAnalytics('7days'),
      ]);

      // Normalize products
      const normalizedProds = prodList.map((p) => ({
        ...p,
        inStock: p.inStock !== undefined ? p.inStock : p.stockStatus !== 'out_of_stock',
        stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : p.stockCount,
        imageUrl: p.imageUrl || p.image,
      }));

      // Normalize knowledge
      const normalizedKb = kbList.map((k) => ({
        ...k,
        question: k.question || k.title,
        answer: k.answer || k.content,
        isActive: k.isActive !== undefined ? k.isActive : k.status === 'active',
      }));

      setBusinesses(bizList);
      const activeBiz = bizList[0] || null;
      if (activeBiz) {
        activeBiz.plan = activeBiz.plan || 'starter';
        activeBiz.conversationsUsed = activeBiz.conversationsUsed || 1248;
        activeBiz.conversationsLimit = activeBiz.conversationsLimit || 5000;
      }
      setCurrentBusiness(activeBiz);
      setConversations(convList);
      setProducts(normalizedProds);
      setLeads(leadList);
      setKnowledge(normalizedKb);
      setAiConfig(aiSettings);
      setTeamMembers(teamList);
      setNotifications(notifList);
      setAnalyticsData(analytics);

      const [payList, invList] = await Promise.all([
        paymentService.getPaymentHistory(),
        paymentService.getInvoices(),
      ]);
      setPaymentHistory(payList);
      setInvoices(invList);

      // Load Omnichannel data
      const [
        chanList,
        wConfig,
        custList,
        bookList,
        srvList,
        bInvList,
        cPayList,
        autoList,
        tplList,
        fSeqList,
        apprList,
        cmpList,
      ] = await Promise.all([
        channelService.getChannels(),
        channelService.getWidgetConfig(),
        customerService.getCustomers(),
        bookingService.getBookings(),
        servicesService.getServices(),
        invoiceService.getInvoices(),
        clientPaymentService.getPayments(),
        automationService.getAutomations(),
        automationService.getTemplates(),
        automationService.getFollowUpSequences(),
        approvalService.getApprovals(),
        campaignService.getCampaigns(),
      ]);

      setChannels(chanList);
      setWidgetConfig(wConfig);
      setCustomers(custList);
      if (custList.length > 0) {
        setSelectedCustomerId(custList[0].id);
        const tEvents = await customerService.getCustomerTimeline(custList[0].id);
        setCustomerTimelineEvents(tEvents);
      }
      setBookings(bookList);
      setServicesList(srvList);
      setBusinessInvoices(bInvList);
      setClientPayments(cPayList);
      setAutomations(autoList);
      setAutomationTemplates(tplList);
      setFollowUps(fSeqList);
      setApprovals(apprList);
      setCampaigns(cmpList);

      if (convList.length > 0) {
        const initialConvId = convList[0].id;
        setSelectedConversationId(initialConvId);
        const msgs = await conversationService.getMessages(initialConvId);
        setActiveConversationMessages(msgs);
      }
    } catch (err) {
      console.error('Failed to load initial mock data', err);
      addToast('error', 'Error loading application data');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      conversationService.getMessages(selectedConversationId).then((msgs) => {
        setActiveConversationMessages(msgs);
      });
    } else {
      setActiveConversationMessages([]);
    }
  }, [selectedConversationId]);

  const switchBusiness = (id: string) => {
    const found = businesses.find((b) => b.id === id);
    if (found) {
      setCurrentBusiness(found);
      addToast('info', 'Workspace Switched', `Now managing ${found.name}`);
    }
  };

  const updateBusinessProfile = async (updates: Partial<Business>) => {
    if (!currentBusiness) return;
    try {
      const updated = await businessService.updateBusiness(currentBusiness.id, updates);
      setCurrentBusiness(updated);
      setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      addToast('success', 'Business profile saved successfully');
    } catch {
      addToast('error', 'Failed to update business profile');
    }
  };

  const toggleWhatsAppConnection = async () => {
    if (!currentBusiness) return;
    try {
      const nextStatus = currentBusiness.whatsappStatus === 'connected' ? 'disconnected' : 'connected';
      const updated = await businessService.setWhatsAppStatus(currentBusiness.id, nextStatus);
      setCurrentBusiness(updated);
      setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      if (nextStatus === 'connected') {
        addToast('success', 'WhatsApp Connected', 'Meta Cloud API webhook is active and verified');
      } else {
        addToast('warning', 'WhatsApp Disconnected', 'Inbound WhatsApp messages will pause');
      }
    } catch {
      addToast('error', 'Failed to toggle WhatsApp status');
    }
  };

  const selectConversationAndOpenInbox = (id: string) => {
    setSelectedConversationId(id);
    setCurrentView('inbox');
  };

  const sendChatMessage = async (text: string) => {
    if (!selectedConversationId || !text.trim()) return;
    try {
      const { message, conversation } = await conversationService.sendMessage(
        selectedConversationId,
        text,
        'agent'
      );
      setActiveConversationMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? conversation : c))
      );
    } catch {
      addToast('error', 'Failed to send message');
    }
  };

  const takeOverConversation = async (convId?: string) => {
    const id = convId || selectedConversationId;
    if (!id) return;
    try {
      const updated = await conversationService.takeOverConversation(id);
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      const msgs = await conversationService.getMessages(id);
      setActiveConversationMessages(msgs);
      addToast('warning', 'Conversation transferred to human', 'AI responses are paused. You are now in live control.');
    } catch {
      addToast('error', 'Could not take over conversation');
    }
  };

  const toggleAIForConversation = async (convId: string, enabled: boolean) => {
    try {
      const updated = await conversationService.toggleAI(convId, enabled);
      setConversations((prev) => prev.map((c) => (c.id === convId ? updated : c)));
      addToast('info', enabled ? 'AI Agent Activated' : 'AI Agent Paused for conversation');
    } catch {
      addToast('error', 'Could not toggle AI status');
    }
  };

  const updateConversationLead = async (convId: string, updates: Partial<Conversation>) => {
    try {
      const updated = await conversationService.updateCustomerLead(convId, updates);
      setConversations((prev) => prev.map((c) => (c.id === convId ? updated : c)));
      addToast('success', 'Customer record updated');
    } catch {
      addToast('error', 'Failed to update customer details');
    }
  };

  const createProduct = async (data: any) => {
    const payload: Omit<Product, 'id' | 'createdAt'> = {
      businessId: currentBusiness?.id || 'biz-sofana',
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      currency: data.currency || 'QAR',
      category: data.category || 'General',
      stockStatus: data.inStock ? 'in_stock' : 'out_of_stock',
      stockCount: Number(data.stockQuantity || data.stockCount || 10),
      image: data.imageUrl || data.image || '',
      features: data.features || [],
      inStock: data.inStock ?? true,
      stockQuantity: Number(data.stockQuantity || data.stockCount || 10),
      imageUrl: data.imageUrl || data.image || '',
    };
    const newProd = await productService.createProduct(payload);
    const normalized = {
      ...newProd,
      inStock: newProd.stockStatus !== 'out_of_stock',
      stockQuantity: newProd.stockCount,
      imageUrl: newProd.image,
    };
    setProducts((prev) => [normalized, ...prev]);
    addToast('success', 'Product added successfully', `${newProd.name} is now in the AI catalog.`);
    return normalized;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const stockStatus =
      updates.inStock !== undefined
        ? updates.inStock
          ? 'in_stock'
          : 'out_of_stock'
        : updates.stockStatus;

    const payload: Partial<Product> = {
      ...updates,
      stockStatus,
      image: updates.imageUrl || updates.image,
      stockCount: updates.stockQuantity ?? updates.stockCount,
    };

    const updated = await productService.updateProduct(id, payload);
    const normalized: Product = {
      ...updated,
      inStock: updated.stockStatus !== 'out_of_stock',
      stockQuantity: updated.stockCount,
      imageUrl: updated.image,
    };
    setProducts((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    addToast('success', 'Product updated', `${updated.name} changes were saved.`);
    return normalized;
  };

  const deleteProduct = async (id: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Product removed from catalog');
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const updated = await leadService.updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      addToast('success', 'Lead status updated', `Lead is now marked as ${status.toUpperCase()}`);
    } catch {
      addToast('error', 'Failed to update lead status');
    }
  };

  const createLead = async (data: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead = await leadService.createLead(data);
    setLeads((prev) => [newLead, ...prev]);
    addToast('success', 'New lead recorded');
    return newLead;
  };

  const createKnowledgeItem = async (data: any) => {
    const title = data.question || data.title || 'FAQ';
    const content = data.answer || data.content || '';
    const status = data.isActive !== undefined ? (data.isActive ? 'active' : 'draft') : data.status || 'active';

    const newItem = await knowledgeService.createKnowledgeItem({
      businessId: currentBusiness?.id || 'biz-sofana',
      title,
      content,
      category: data.category || 'General',
      status,
      question: title,
      answer: content,
      isActive: status === 'active',
    });
    const normalized = {
      ...newItem,
      question: newItem.title,
      answer: newItem.content,
      isActive: newItem.status === 'active',
    };
    setKnowledge((prev) => [normalized, ...prev]);
    addToast('success', 'Knowledge item added', 'AI agent will index this content for replies.');
    return normalized;
  };

  const updateKnowledgeItem = async (id: string, updates: any) => {
    const title = updates.question || updates.title;
    const content = updates.answer || updates.content;
    const status = updates.isActive !== undefined ? (updates.isActive ? 'active' : 'draft') : updates.status;

    const payload: Partial<KnowledgeItem> = {
      ...updates,
      ...(title ? { title, question: title } : {}),
      ...(content ? { content, answer: content } : {}),
      ...(status ? { status, isActive: status === 'active' } : {}),
    };

    const updated = await knowledgeService.updateKnowledgeItem(id, payload);
    const normalized: KnowledgeItem = {
      ...updated,
      question: updated.title,
      answer: updated.content,
      isActive: updated.status === 'active',
    };
    setKnowledge((prev) => prev.map((k) => (k.id === id ? normalized : k)));
    addToast('success', 'Knowledge base updated');
    return normalized;
  };

  const deleteKnowledgeItem = async (id: string) => {
    await knowledgeService.deleteKnowledgeItem(id);
    setKnowledge((prev) => prev.filter((k) => k.id !== id));
    addToast('info', 'Knowledge item removed');
  };

  const updateAISettings = async (updates: Partial<AIAgentConfig>) => {
    if (!currentBusiness) return;
    try {
      const updated = await aiService.updateAISettings(currentBusiness.id, updates);
      setAiConfig(updated);
      addToast('success', 'AI settings updated', 'Changes applied to WhatsApp automated agent.');
    } catch {
      addToast('error', 'Failed to update AI settings');
    }
  };

  const testAIPrompt = async (message: string) => {
    if (!aiConfig) return 'AI agent is currently unconfigured.';
    return aiService.testAIPrompt(message, aiConfig, products, knowledge);
  };

  const inviteTeamMember = async (
    dataOrEmail: { name?: string; email: string; role?: any } | string,
    role?: any
  ) => {
    let email = '';
    let userRole: any = 'Agent';
    let userName = '';

    if (typeof dataOrEmail === 'string') {
      email = dataOrEmail;
      userRole = role || 'Agent';
    } else {
      email = dataOrEmail.email;
      userRole = dataOrEmail.role || 'Agent';
      userName = dataOrEmail.name || '';
    }

    const newMember = await teamService.inviteMember(email, userRole);
    if (userName) {
      newMember.name = userName;
    }
    setTeamMembers((prev) => [...prev, newMember]);
    addToast('success', 'Invitation sent', `Invited ${email} as ${userRole}`);
  };

  const removeTeamMember = async (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    addToast('info', 'Team member removed');
  };

  const markNotificationRead = async (id: string) => {
    const updated = await teamService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const clearAllNotifications = async () => {
    const updated = await teamService.clearAllNotifications();
    setNotifications(updated);
    addToast('info', 'Notifications cleared');
  };

  const refreshAnalytics = async (range: 'today' | '7days' | '30days' | '90days' = '7days') => {
    const res = await analyticsService.getAnalytics(range);
    setAnalyticsData(res);
  };

  const upgradePlan = async (planId: string) => {
    if (!currentBusiness) return;
    const plan = billingPlans.find((p) => p.id === planId);
    if (!plan) return;

    setCurrentBusiness({
      ...currentBusiness,
      plan: plan.id,
      conversationsLimit: plan.conversationLimit,
    });
    addToast('success', 'Subscription Updated', `Switched to ${plan.name} ($${plan.price}/mo)`);
  };

  // bKash Subscription Actions
  const openCheckout = (planId: SubscriptionPlanId = 'business') => {
    setActiveCheckoutPlanId(planId);
    setPaymentOutcomeView(null);
    setIsCheckoutModalOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutModalOpen(false);
  };

  const openDemoSimulator = (planId: SubscriptionPlanId, amount: number) => {
    setActiveCheckoutPlanId(planId);
    setIsCheckoutModalOpen(false);
    setIsDemoSimulatorOpen(true);
  };

  const closeDemoSimulator = () => {
    setIsDemoSimulatorOpen(false);
  };

  const handleSimulateSuccess = async (txnId: string) => {
    setIsDemoSimulatorOpen(false);
    const plan = PLANS_CONFIG[activeCheckoutPlanId];
    
    // Call server-side payment verification simulation
    const result = await paymentService.verifyPayment(
      `pay-sim-${Date.now()}`,
      'success',
      undefined,
      activeCheckoutPlanId
    );

    if (result.subscription) {
      setSubscription(result.subscription);
      // Update limits according to plan
      setUsageMetrics((prev) => ({
        ...prev,
        conversationsLimit: plan.monthlyConversations,
        aiMessagesLimit: plan.aiMessages,
        productsLimit: plan.products,
      }));
    }

    setLastPaymentResult({
      planId: activeCheckoutPlanId,
      amount: plan.price,
      transactionId: txnId,
    });
    setPaymentOutcomeView('success');

    // Refresh transactions & invoices
    const [pList, iList] = await Promise.all([
      paymentService.getPaymentHistory(),
      paymentService.getInvoices(),
    ]);
    setPaymentHistory(pList);
    setInvoices(iList);

    addToast('success', 'Payment Verified', `WhatsAI ${plan.name} activated via bKash!`);
  };

  const handleSimulatePending = async (txnId: string) => {
    setIsDemoSimulatorOpen(false);
    const plan = PLANS_CONFIG[activeCheckoutPlanId];

    await paymentService.verifyPayment(
      `pay-sim-${Date.now()}`,
      'pending',
      undefined,
      activeCheckoutPlanId
    );

    setLastPaymentResult({
      planId: activeCheckoutPlanId,
      amount: plan.price,
      transactionId: txnId,
    });
    setPaymentOutcomeView('pending');

    const pList = await paymentService.getPaymentHistory();
    setPaymentHistory(pList);

    addToast('info', 'Verification Pending', 'bKash transaction awaiting backend confirmation.');
  };

  const handleSimulateFailed = async (reason: string) => {
    setIsDemoSimulatorOpen(false);
    const plan = PLANS_CONFIG[activeCheckoutPlanId];

    await paymentService.verifyPayment(
      `pay-sim-${Date.now()}`,
      'failed',
      reason,
      activeCheckoutPlanId
    );

    setLastPaymentResult({
      planId: activeCheckoutPlanId,
      amount: plan.price,
      transactionId: 'TXN-FAILED',
      failureReason: reason,
    });
    setPaymentOutcomeView('failed');

    const pList = await paymentService.getPaymentHistory();
    setPaymentHistory(pList);

    addToast('error', 'Payment Unsuccessful', reason);
  };

  const cancelActiveSubscription = async () => {
    if (!subscription) return;
    const updated = await paymentService.cancelSubscription(subscription.id);
    setSubscription(updated);
    setIsCancelModalOpen(false);
    addToast('warning', 'Subscription Cancelled', 'Access remains active until billing period ends.');
  };

  const reactivateSubscription = async () => {
    if (!subscription) return;
    const updated = await paymentService.reactivateSubscription(subscription.id);
    setSubscription(updated);
    addToast('success', 'Subscription Reactivated', 'Your bKash recurring billing is active.');
  };

  const openCancelModal = () => setIsCancelModalOpen(true);
  const closeCancelModal = () => setIsCancelModalOpen(false);

  const viewInvoice = async (invoiceNumber: string) => {
    const inv = await paymentService.getInvoiceById(invoiceNumber);
    if (inv) {
      setSelectedInvoice(inv);
    } else {
      addToast('error', 'Invoice not found');
    }
  };

  const closeInvoice = () => setSelectedInvoice(null);
  const resetPaymentOutcomeView = () => setPaymentOutcomeView(null);

  // Omnichannel Channels
  const toggleChannelConnection = async (id: string) => {
    try {
      const updated = await channelService.toggleChannelConnection(id);
      setChannels((prev) => prev.map((c) => (c.id === id ? updated : c)));
      addToast('info', `${updated.channelName} Status Changed`, `Channel is now ${updated.status}.`);
    } catch (err) {
      addToast('error', 'Channel update failed');
    }
  };

  const updateWidgetConfig = async (updates: Partial<WebsiteChatWidgetConfig>) => {
    try {
      const updated = await channelService.updateWidgetConfig(updates);
      setWidgetConfig(updated);
      addToast('success', 'Chat Widget Updated', 'Changes saved successfully.');
    } catch (err) {
      addToast('error', 'Failed to update widget');
    }
  };

  // Customers & CRM
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updated = await customerService.updateCustomer(id, updates);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
      addToast('success', 'Customer Updated', 'Profile updated successfully.');
    } catch (err) {
      addToast('error', 'Failed to update customer');
    }
  };

  const updateCustomerLifecycleStage = async (id: string, stage: CustomerLifecycleStage) => {
    try {
      const updated = await customerService.updateCustomerLifecycleStage(id, stage);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
      addToast('info', 'Customer Lifecycle Updated', `Moved to ${stage}.`);
    } catch (err) {
      addToast('error', 'Failed to update lifecycle stage');
    }
  };

  const addCustomerTimelineEvent = async (event: Omit<CustomerTimelineEvent, 'id'>) => {
    const newEvt = await customerService.addTimelineEvent(event);
    setCustomerTimelineEvents((prev) => [newEvt, ...prev]);
  };

  // Bookings
  const createBooking = async (data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const created = await bookingService.createBooking(data);
    setBookings((prev) => [created, ...prev]);
    addToast('success', 'Booking Confirmed', `Appointment #${created.id} scheduled.`);
    return created;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const updated = await bookingService.updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    addToast('info', 'Booking Updated', `Status is now ${status}.`);
  };

  const deleteBooking = async (id: string) => {
    await bookingService.deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    addToast('info', 'Booking Removed');
  };

  // Services
  const createService = async (data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> => {
    const created = await servicesService.createService(data);
    setServicesList((prev) => [created, ...prev]);
    addToast('success', 'Service Created', `${created.name} added to catalog.`);
    return created;
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    const updated = await servicesService.updateService(id, updates);
    setServicesList((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast('success', 'Service Updated');
  };

  const deleteService = async (id: string) => {
    await servicesService.deleteService(id);
    setServicesList((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Service Deleted');
  };

  // Business Invoices
  const createBusinessInvoice = async (data: Omit<BusinessInvoice, 'id' | 'createdDate'>): Promise<BusinessInvoice> => {
    const created = await invoiceService.createInvoice(data);
    setBusinessInvoices((prev) => [created, ...prev]);
    addToast('success', 'Invoice Generated', `${created.invoiceNumber} created.`);
    return created;
  };

  const sendInvoiceViaChannel = async (id: string, channel: ChannelType) => {
    const updated = await invoiceService.sendInvoiceViaChannel(id, channel);
    setBusinessInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    addToast('success', 'Invoice Dispatched', `Sent to customer via ${channel.toUpperCase()}.`);
  };

  const markInvoicePaid = async (id: string) => {
    const updated = await invoiceService.markInvoicePaid(id);
    setBusinessInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    addToast('success', 'Invoice Marked as Paid', `${updated.invoiceNumber} recorded as settled.`);
  };

  const updateBusinessInvoiceStatus = async (id: string, status: BusinessInvoiceStatus) => {
    const updated = await invoiceService.updateInvoiceStatus(id, status);
    setBusinessInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    addToast('info', 'Invoice Status Updated', `Status set to ${status}.`);
  };

  const deleteBusinessInvoice = async (id: string) => {
    await invoiceService.deleteInvoice(id);
    setBusinessInvoices((prev) => prev.filter((inv) => inv.id !== id));
    addToast('info', 'Invoice Deleted');
  };

  // Client Payments
  const recordClientPayment = async (data: Omit<ClientPayment, 'id' | 'date'>): Promise<ClientPayment> => {
    const created = await clientPaymentService.recordPayment(data);
    setClientPayments((prev) => [created, ...prev]);
    addToast('success', 'Payment Logged', `${created.currency} ${created.amount.toLocaleString()} received via ${created.paymentMethod}.`);
    return created;
  };

  // Automations
  const toggleAutomation = async (id: string) => {
    const updated = await automationService.toggleAutomation(id);
    setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    addToast('info', 'Automation Rule', `${updated.name} is now ${updated.isActive ? 'Active' : 'Paused'}.`);
  };

  const createAutomation = async (data: Omit<AutomationRule, 'id' | 'executionCount'>): Promise<AutomationRule> => {
    const created = await automationService.createAutomation(data);
    setAutomations((prev) => [created, ...prev]);
    addToast('success', 'Workflow Deployed', `${created.name} activated.`);
    return created;
  };

  const useAutomationTemplate = async (templateId: string) => {
    if (!currentBusiness) return;
    const deployed = await automationService.useTemplate(templateId, currentBusiness.id);
    setAutomations((prev) => [deployed, ...prev]);
    addToast('success', 'Template Activated', `${deployed.name} added to your workflows.`);
  };

  const deleteAutomation = async (id: string) => {
    await automationService.deleteAutomation(id);
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Automation Deleted');
  };

  // Approvals
  const resolveApproval = async (id: string, status: 'approved' | 'rejected') => {
    const updated = await approvalService.resolveApproval(id, status);
    setApprovals((prev) => prev.map((a) => (a.id === id ? updated : a)));
    addToast(status === 'approved' ? 'success' : 'info', `Request ${status === 'approved' ? 'Approved' : 'Rejected'}`);
  };

  // Campaigns
  const createCampaign = async (data: Omit<Campaign, 'id' | 'sentCount' | 'deliveredCount' | 'readCount' | 'repliedCount'>): Promise<Campaign> => {
    const created = await campaignService.createCampaign(data);
    setCampaigns((prev) => [created, ...prev]);
    addToast('success', 'Campaign Scheduled', `${created.name} created.`);
    return created;
  };

  const toggleCampaignStatus = async (id: string) => {
    const updated = await campaignService.toggleCampaignStatus(id);
    setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast('info', 'Campaign Status', `${updated.name} is now ${updated.status}.`);
  };

  return (
  <AppContext.Provider
    value={{
      // User Authentication & Session
      currentUser,
      loginClient,
      loginAdmin,
      registerClient,
      logout,

      // SaaS Executive Admin Portal
      saasClients,
      saasSubscriptions,
      saasPayments,
      saasHealthServices,
      adminAuditLogs,
      updateClientStatus,
      updateClientPlan,
      pingHealthService,

      currentView,
      setCurrentView,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        currentBusiness,
        businesses,
        switchBusiness,
        updateBusinessProfile,
        toggleWhatsAppConnection,
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        selectConversationAndOpenInbox,
        activeConversationMessages,
        sendChatMessage,
        takeOverConversation,
        toggleAIForConversation,
        updateConversationLead,
        products,
        createProduct,
        addProduct: createProduct,
        updateProduct,
        deleteProduct,
        leads,
        updateLeadStatus,
        createLead,
        knowledge,
        knowledgeItems: knowledge,
        createKnowledgeItem,
        addKnowledgeItem: createKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        aiConfig,
        updateAISettings,
        testAIPrompt,
        teamMembers,
        inviteTeamMember,
        removeTeamMember,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        analyticsData,
        refreshAnalytics,
        billingPlans,
        upgradePlan,

        // bKash Subscription & Payment Management
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

        // Omnichannel Channels
        channels,
        toggleChannelConnection,
        widgetConfig,
        updateWidgetConfig,

        // Omnichannel Customers & CRM
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        updateCustomer,
        updateCustomerLifecycleStage,
        customerTimelineEvents,
        addCustomerTimelineEvent,

        // Bookings & Services
        bookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        servicesList,
        createService,
        updateService,
        deleteService,

        // Business Invoices & Client Payments
        businessInvoices,
        createBusinessInvoice,
        sendInvoiceViaChannel,
        markInvoicePaid,
        updateBusinessInvoiceStatus,
        deleteBusinessInvoice,
        clientPayments,
        recordClientPayment,

        // Automations, Templates & Follow-ups
        automations,
        automationTemplates,
        followUps,
        toggleAutomation,
        createAutomation,
        useAutomationTemplate,
        deleteAutomation,

        // Human Approval Queue
        approvals,
        resolveApproval,

        // Campaigns & Broadcasts
        campaigns,
        createCampaign,
        toggleCampaignStatus,

        toasts,
        addToast,
        dismissToast,
        theme,
        toggleTheme,
        setTheme,
        loading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
