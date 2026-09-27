import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitFork,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Building2,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Customer, ChannelType, CustomerLifecycleStage, CustomerTimelineEvent } from '../../types/omnichannel';
import { initialTimelineEvents } from '../../data/mockCustomers';

export const CustomerJourneyView: React.FC = () => {
  const {
    customers = [],
    selectedCustomerId,
    setSelectedCustomerId,
    customerTimelineEvents = [],
    updateCustomerLifecycleStage,
    setCurrentView,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | CustomerLifecycleStage>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | ChannelType>('all');

  // Safe helper to extract channels from customer
  const getCustomerChannels = (c?: Customer | null): ChannelType[] => {
    if (!c) return ['whatsapp'];
    if (c.channels && Array.isArray(c.channels) && c.channels.length > 0) {
      return c.channels;
    }
    if (c.identities && Array.isArray(c.identities) && c.identities.length > 0) {
      const idChannels = c.identities.map((i) => i.channel).filter(Boolean);
      if (idChannels.length > 0) {
        return Array.from(new Set(idChannels));
      }
    }
    return ['whatsapp'];
  };

  const activeCustomer: Customer | undefined =
    (customers || []).find((c) => c.id === selectedCustomerId) ||
    (customers && customers.length > 0 ? customers[0] : undefined);

  const filteredCustomers = (customers || []).filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (stageFilter !== 'all' && c.lifecycleStage !== stageFilter) return false;
    if (channelFilter !== 'all') {
      const channels = getCustomerChannels(c);
      if (!channels.includes(channelFilter)) return false;
    }

    return true;
  });

  const getChannelIcon = (ch?: ChannelType | string) => {
    switch (ch) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-teal-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getStageBadge = (stage?: CustomerLifecycleStage | string) => {
    switch (stage) {
      case 'lead':
        return { label: 'New Lead', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'prospect':
        return { label: 'Prospect', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'customer':
        return { label: 'Active Client', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'vip':
        return { label: 'VIP Client', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'churned':
        return { label: 'Inactive', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
      case 'booking':
        return { label: 'Consultation Booked', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'invoice':
        return { label: 'Invoice Issued', bg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
      case 'repeat':
        return { label: 'Repeat VIP', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      default:
        return { label: stage || 'Active', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const stagesOrder: CustomerLifecycleStage[] = ['lead', 'prospect', 'customer', 'vip'];

  // Current active customer's timeline events
  const activeEvents: CustomerTimelineEvent[] = React.useMemo(() => {
    if (!activeCustomer) return [];
    const fromContext = (customerTimelineEvents || []).filter(
      (evt) => evt.customerId === activeCustomer.id
    );
    if (fromContext.length > 0) return fromContext;

    const fromMock = initialTimelineEvents.filter(
      (evt) => evt.customerId === activeCustomer.id
    );
    if (fromMock.length > 0) return fromMock;

    // Return synthesized event if new customer
    return [
      {
        id: `evt-${activeCustomer.id}-init`,
        customerId: activeCustomer.id,
        timestamp: activeCustomer.createdAt || 'Recent',
        stage: 'lead',
        title: 'Customer Profile Established',
        description: `Initial contact recorded across connected channels: ${getCustomerChannels(activeCustomer).join(', ')}.`,
        channel: getCustomerChannels(activeCustomer)[0] || 'whatsapp',
        actor: 'system',
      },
    ];
  }, [activeCustomer, customerTimelineEvents]);

  const activeChannels = getCustomerChannels(activeCustomer);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <GitFork className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Omnichannel Customer Journeys & Unified Profiles
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Identity resolution across WhatsApp, Instagram, Facebook Messenger, Web Chat, and Email. Track customer lifecycle stages, lifetime spend, appointments, and event timelines in one single source of truth.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView('inbox')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Go to Inbox
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns (List on left, Detailed Journey Profile on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col h-[740px] overflow-hidden">
          {/* Filters & Search */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Lifecycle stage filters */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              {(['all', 'lead', 'prospect', 'customer', 'vip'] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setStageFilter(stage)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                    stageFilter === stage
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Directory List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No customers found matching filter
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = activeCustomer?.id === c.id;
                const badge = getStageBadge(c.lifecycleStage);
                const channels = getCustomerChannels(c);

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
                          {(c.name || 'C').charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded border font-semibold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1.5 truncate">
                        {c.phone && <span>{c.phone}</span>}
                        {c.email && <span>· {c.email}</span>}
                      </div>

                      {/* Connected channel icons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {channels.map((ch) => (
                            <span
                              key={ch}
                              className="p-1 rounded bg-slate-100/80 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700"
                              title={ch}
                            >
                              {getChannelIcon(ch)}
                            </span>
                          ))}
                        </div>

                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {c.currency} {(c.totalSpend ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Customer Details & Cross-Channel Journey Timeline */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col h-[740px] overflow-hidden">
          {activeCustomer ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  {activeCustomer.avatar ? (
                    <img
                      src={activeCustomer.avatar}
                      alt={activeCustomer.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-2xl text-slate-700 dark:text-slate-200">
                      {(activeCustomer.name || 'C').charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {activeCustomer.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${getStageBadge(activeCustomer.lifecycleStage).bg}`}>
                        {getStageBadge(activeCustomer.lifecycleStage).label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activeCustomer.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {activeCustomer.company}
                        </span>
                      )}
                      {activeCustomer.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {activeCustomer.phone}
                        </span>
                      )}
                      {activeCustomer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {activeCustomer.email}
                        </span>
                      )}
                      {(activeCustomer.location || activeCustomer.city) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {activeCustomer.location || `${activeCustomer.city}, ${activeCustomer.country}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentView('inbox');
                      addToast('info', 'Opening Inbox', `Switched to live chat for ${activeCustomer.name}`);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open Live Chat</span>
                  </button>
                </div>
              </div>

              {/* Lifecycle Stage Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                    Customer Journey Progression
                  </span>
                  <span className="text-slate-400 text-[11px]">Click a stage to advance</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {stagesOrder.map((stage, idx) => {
                    const currentIdx = stagesOrder.indexOf(activeCustomer.lifecycleStage);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <button
                        key={stage}
                        onClick={() => updateCustomerLifecycleStage(activeCustomer.id, stage)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                            : isPassed
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-wider mb-0.5">
                          Step 0{idx + 1}
                        </div>
                        <div className="text-xs capitalize">{stage}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Omnichannel Identity Channels Connected */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Unified Identity Matching
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {activeChannels.length} channels linked
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {activeChannels.map((ch) => (
                    <div
                      key={ch}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      {getChannelIcon(ch)}
                      <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{ch}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>Total Spend</span>
                    <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeCustomer.currency || 'USD'} {(activeCustomer.totalSpend ?? 0).toLocaleString()}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>Bookings</span>
                    <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeCustomer.totalBookings ?? 1} Completed
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>Client Since</span>
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeCustomer.firstSeenDate || activeCustomer.createdAt || 'Recent'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {activeCustomer.tags && activeCustomer.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {activeCustomer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Cross-Channel Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Omnichannel Activity Timeline
                  </h4>
                  <span className="text-[11px] text-slate-400">Chronological interactions</span>
                </div>

                {activeEvents.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                    No recorded timeline events for this customer yet.
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4 my-2">
                    {activeEvents.map((evt) => (
                      <div key={evt.id} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xs flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              {getChannelIcon(evt.channel)}
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {evt.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {evt.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
              <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              Select a customer to view their omnichannel profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
