import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../config/branding';
import {
  LayoutDashboard,
  MessageSquare,
  GitFork,
  Target,
  CalendarCheck,
  Receipt,
  CreditCard,
  Package,
  Briefcase,
  Workflow,
  Bot,
  BookOpen,
  Megaphone,
  BarChart3,
  Radio,
  Building2,
  ShieldCheck,
  Wallet,
  Lock,
  Smartphone,
  Sparkles,
  Zap,
  X,
  ChevronRight,
} from 'lucide-react';
import { NavView } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    conversations,
    approvals,
    subscription,
    usageMetrics,
  } = useApp();

  const unreadMessagesCount = (conversations || []).reduce(
    (acc, curr) => acc + (curr?.unreadCount || 0),
    0
  );

  const pendingApprovalsCount = (approvals || []).filter((a) => a?.status === 'pending').length;

  const coreNav: { id: NavView; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare, badge: unreadMessagesCount, badgeColor: 'bg-emerald-600' },
    { id: 'customers', label: 'Customers', icon: GitFork },
    { id: 'leads', label: 'Leads & Pipeline', icon: Target },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  ];

  const commerceNav: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Briefcase },
  ];

  const intelligenceNav: { id: NavView; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot, badge: pendingApprovalsCount, badgeColor: 'bg-amber-500' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'automations', label: 'Automations', icon: Workflow },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

  const settingsNav: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'settings', label: 'Settings', icon: Building2 },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'settings-whatsapp', label: 'WhatsApp API', icon: Smartphone },
    { id: 'settings-billing', label: 'Subscription & Plan', icon: Wallet },
  ];

  const handleNavClick = (viewId: NavView) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  const renderNavGroup = (
    title: string,
    items: { id: NavView; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[]
  ) => (
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white shadow-xs shrink-0 ${
                    item.badgeColor || 'bg-emerald-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 select-none transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                {BRAND_CONFIG.name}
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                Omni
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[135px]">
              AI Business Platform
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5">
        {renderNavGroup('Core Operations', coreNav)}
        {renderNavGroup('Sales & Catalog', commerceNav)}
        {renderNavGroup('Intelligence', intelligenceNav)}
        {renderNavGroup('Configuration', settingsNav)}
      </div>

      {/* Sidebar Bottom: Plan & Usage */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide capitalize">
                {subscription?.plan_id || 'business'} Plan
              </span>
            </div>
            <button
              onClick={() => handleNavClick('settings-billing')}
              className="text-[10px] font-bold text-[#E2136E] hover:underline flex items-center gap-0.5"
            >
              Billing
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Usage Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10.5px]">
              <span className="text-slate-500 dark:text-slate-400">Conversations</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {(usageMetrics?.conversationsUsed || 0).toLocaleString()} / {(usageMetrics?.conversationsLimit || 10000).toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    ((usageMetrics?.conversationsUsed || 0) / (usageMetrics?.conversationsLimit || 1)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Admin Portal Gateway */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/80">
            <button
              onClick={() => handleNavClick('admin-overview')}
              className="w-full py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-md shadow-indigo-950/40"
              title="Open ScaleUp Gulf AI Executive Administration"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-200" />
                <span>SaaS Admin Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
