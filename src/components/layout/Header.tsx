import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Building2,
  Check,
  Plus,
  Radio,
  ExternalLink,
  Shield,
  Bot,
  Sun,
  Moon,
  X,
  User,
  Target,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { NavView } from '../../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsMobileMenuOpen,
    currentBusiness,
    businesses,
    switchBusiness,
    notifications,
    channels,
    approvals,
    theme,
    toggleTheme,
    customers,
    leads,
    conversations,
    setSelectedCustomerId,
    selectConversationAndOpenInbox,
    currentUser,
    logout,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBizMenuOpen, setIsBizMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const bizRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = (notifications || []).filter((n) => !n?.read).length;
  const pendingApprovalsCount = (approvals || []).filter((a) => a?.status === 'pending').length;
  const activeChannelsCount = (channels || []).filter((c) => c?.status === 'connected').length;

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (bizRef.current && !bizRef.current.contains(e.target as Node)) {
        setIsBizMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Filtered search results across Customers, Leads, and Conversations
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { customers: [], leads: [], conversations: [] };

    const matchedCustomers = (customers || [])
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.phone.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedLeads = (leads || [])
      .filter(
        (l) =>
          (l.name || l.customerName || '').toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.notes && l.notes.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const matchedConversations = (conversations || [])
      .filter(
        (conv) =>
          conv.customerName.toLowerCase().includes(q) ||
          conv.lastMessage.toLowerCase().includes(q)
      )
      .slice(0, 4);

    return {
      customers: matchedCustomers,
      leads: matchedLeads,
      conversations: matchedConversations,
    };
  }, [searchQuery, customers, leads, conversations]);

  const hasSearchResults =
    searchResults.customers.length > 0 ||
    searchResults.leads.length > 0 ||
    searchResults.conversations.length > 0;

  const getPageTitle = (view: NavView): { title: string; subtitle: string } => {
    switch (view) {
      case 'dashboard':
        return { title: 'Omnichannel Dashboard', subtitle: 'Real-time overview & business automation metrics' };
      case 'inbox':
        return { title: 'Omnichannel Unified Inbox', subtitle: 'Live conversations across WhatsApp, Messenger, Instagram, Web & Email' };
      case 'customers':
        return { title: 'Customer Journeys & Profiles', subtitle: 'Cross-channel identity matching & lifecycle progression' };
      case 'leads':
        return { title: 'Leads & CRM Pipeline', subtitle: 'Visual sales stages, qualification & automated follow-ups' };
      case 'bookings':
        return { title: 'Bookings & Calendar', subtitle: 'AI-assisted appointments, staff scheduling & availability' };
      case 'invoices':
        return { title: 'Business Invoices', subtitle: 'Global multi-currency billing, delivery & payment links' };
      case 'payments':
        return { title: 'Client Payments Ledger', subtitle: 'Omnichannel settlement tracking across global gateways' };
      case 'products':
        return { title: 'Products Catalog', subtitle: 'Inventory synced with AI conversational sales engine' };
      case 'services':
        return { title: 'Services Catalog', subtitle: 'Bookable consultations, styling sessions & services' };
      case 'automations':
        return { title: 'Automation Workflows', subtitle: 'Visual multi-channel trigger builder & template library' };
      case 'ai-agent':
        return { title: 'AI Agent & Human Approvals', subtitle: 'Autonomous persona, guardrails & sensitive action queue' };
      case 'knowledge':
        return { title: 'Knowledge Base', subtitle: 'FAQs, business policies & retrieval memory' };
      case 'campaigns':
        return { title: 'Campaigns & Broadcasts', subtitle: 'Outbound multi-channel messaging & compliance management' };
      case 'analytics':
        return { title: 'Analytics & Revenue', subtitle: 'Omnichannel performance, conversion funnels & revenue' };
      case 'channels':
        return { title: 'Channels & Live Chat Widget', subtitle: 'Manage WhatsApp, Meta Messenger, Instagram, Web & Email' };
      case 'settings-business':
        return { title: 'Business Profile', subtitle: 'Global multi-currency, timezone, contact & hours' };
      case 'settings-team':
        return { title: 'Team Members', subtitle: 'Agent access controls, roles and routing' };
      case 'settings-billing':
        return { title: 'Subscription & Billing', subtitle: 'Plan limits, conversation quotas & bKash management' };
      case 'settings-security':
        return { title: 'Security & Webhooks', subtitle: 'API tokens, webhook listeners & privacy compliance' };
      default:
        return { title: 'WhatsAI Platform', subtitle: 'AI-powered omnichannel business automation' };
    }
  };

  const pageInfo = getPageTitle(currentView);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
            {pageInfo.title}
          </h1>
          <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar across Customers, Leads, and Inbox */}
      <div ref={searchRef} className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2 relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search customers, leads, inbox conversations..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSearchOpen(false);
              }
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {!hasSearchResults ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching customers, leads, or conversations found for "{searchQuery}"
              </div>
            ) : (
              <>
                {/* Customers Section */}
                {searchResults.customers.length > 0 && (
                  <div className="py-1.5 first:pt-0">
                    <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Customers ({searchResults.customers.length})
                    </p>
                    {searchResults.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setCurrentView('customers');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 text-[11px] font-bold">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {c.name}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {c.phone} {c.email ? `• ${c.email}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors shrink-0">
                          {c.lifecycleStage}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Leads Section */}
                {searchResults.leads.length > 0 && (
                  <div className="py-1.5">
                    <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Leads Pipeline ({searchResults.leads.length})
                    </p>
                    {searchResults.leads.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setCurrentView('leads');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {l.name || l.customerName || 'Lead'}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {l.phone} {l.product || l.interestedProduct ? `• ${l.product || l.interestedProduct}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shrink-0">
                          {l.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Inbox Conversations Section */}
                {searchResults.conversations.length > 0 && (
                  <div className="py-1.5 last:pb-0">
                    <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Inbox Conversations ({searchResults.conversations.length})
                    </p>
                    {searchResults.conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          selectConversationAndOpenInbox(conv.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {conv.customerName}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {conv.channel}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Omnichannel Channel Status Pill */}
        <button
          onClick={() => setCurrentView('channels')}
          title="Click to view connected channels"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>{activeChannelsCount > 0 ? `${activeChannelsCount} Channels Live` : 'Connect Channels'}</span>
        </button>

        {/* Human Approval Center Quick Badge if pending */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setCurrentView('ai-agent')}
            title="Approvals waiting for human action"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Approvals</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingApprovalsCount}
            </span>
          </button>
        )}

        {/* Theme Toggle (Light/Dark Mode) */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45 duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12 duration-200" />
          )}
        </button>

        {/* Business Selector */}
        <div className="relative" ref={bizRef}>
          <button
            onClick={() => setIsBizMenuOpen(!isBizMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline max-w-[120px] truncate">
              {currentBusiness?.name || 'Sofana Living'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isBizMenuOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Workspaces (Multi-Tenant)
              </div>
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    switchBusiness(b.id);
                    setIsBizMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    currentBusiness?.id === b.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {currentBusiness?.id === b.id && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setCurrentView('settings-business');
                    setIsBizMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Manage Businesses
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Admin Panel Quick Switch Button */}
        <button
          onClick={() => setCurrentView('admin-overview')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
          title="Open ScaleUp Gulf AI Executive Administration"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Admin Panel</span>
        </button>

        {/* User Profile Avatar & Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              {(currentUser?.name || 'R').charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-[120px] truncate">
              {currentUser?.name || 'Rahat'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {currentUser?.name || 'Rahat'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {currentUser?.email || 'rahatali3086rahat@gmail.com'}
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentUser?.role === 'admin' ? 'System Administrator' : 'Account Owner'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentView('settings-business');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Business Settings
              </button>
              <button
                onClick={() => {
                  setCurrentView('settings-team');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Team & Permissions
              </button>
              <button
                onClick={() => {
                  setCurrentView('settings-billing');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                Plan & Invoices
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin-overview');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors text-left"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel (SaaS Executive)
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
