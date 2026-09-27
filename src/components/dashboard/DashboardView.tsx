import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VolumeChart } from './VolumeChart';
import { LeadChart } from './LeadChart';
import { AIPerformanceCard } from './AIPerformanceCard';
import { RecentConversationsTable } from './RecentConversationsTable';
import { QuickActions } from '../layout/QuickActions';
import { ProductModal } from '../products/ProductModal';
import { KnowledgeModal } from '../knowledge/KnowledgeModal';
import {
  MessageSquare,
  Bot,
  Users,
  CheckCircle,
  UserCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CalendarCheck,
  Receipt,
  Radio,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { ChannelType } from '../../types/omnichannel';

export const DashboardView: React.FC = () => {
  const { analyticsData, channels, bookings, businessInvoices, setCurrentView } = useApp();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);

  const stats = analyticsData?.stats || {
    totalConversations: 1248,
    totalConversationsChange: '+18.4%',
    aiHandled: 982,
    aiHandledPct: '78.7%',
    newLeads: 164,
    newLeadsChange: '+12.8%',
    qualifiedLeads: 89,
    qualifiedLeadsChange: '+9.2%',
    humanHandoffs: 47,
    responseTimeSec: 8.4,
    aiResolutionRatePct: '78.7%',
    customerSatisfactionPct: 94,
  };

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-teal-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const upcomingBookings = (bookings || []).filter((b) => b && b.status === 'confirmed').slice(0, 3);
  const pendingInvoices = (businessInvoices || []).filter((i) => i && i.status === 'sent').slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Good morning, Rahat 👋
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Omnichannel AI operations overview across WhatsApp, Instagram, Messenger, Web Chat, and Email.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <QuickActions
          onAddProductClick={() => setIsProductModalOpen(true)}
          onAddKnowledgeClick={() => setIsKnowledgeModalOpen(true)}
        />
      </div>

      {/* Omnichannel Channel Status Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">Connected Messaging Networks:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                ch.status === 'connected'
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-50/50 border-slate-200/50 text-slate-400'
              }`}
            >
              {getChannelIcon(ch.channel || ch.type)}
              <span className="capitalize">{ch.channel || ch.type}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  ch.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            </div>
          ))}
          <button
            onClick={() => setCurrentView('channels')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 ml-1 flex items-center"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Core Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Conversations */}
        <div
          onClick={() => setCurrentView('inbox')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Conversations</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.totalConversations.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{stats.totalConversationsChange}</span>
          </div>
        </div>

        {/* AI Handled */}
        <div
          onClick={() => setCurrentView('ai-agent')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">AI Handled</span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Bot className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.aiHandled.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <span>{stats.aiHandledPct} auto-resolved</span>
          </div>
        </div>

        {/* New Leads */}
        <div
          onClick={() => setCurrentView('leads')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">New Leads</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.newLeads}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{stats.newLeadsChange}</span>
          </div>
        </div>

        {/* Qualified Leads */}
        <div
          onClick={() => setCurrentView('leads')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Qualified Leads</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.qualifiedLeads}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{stats.qualifiedLeadsChange}</span>
          </div>
        </div>

        {/* Human Handoffs */}
        <div
          onClick={() => setCurrentView('inbox')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Human Handoffs</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.humanHandoffs}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            <span>3.7% handoff rate</span>
          </div>
        </div>

        {/* Response Time */}
        <div
          onClick={() => setCurrentView('analytics')}
          role="button"
          tabIndex={0}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Response Time</span>
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.responseTimeSec} sec
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Under 10s SLA</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {analyticsData && <VolumeChart data={analyticsData.volume} />}
        </div>
        <div>
          <AIPerformanceCard
            resolutionRate={stats.aiResolutionRatePct}
            responseTime={`${stats.responseTimeSec} sec`}
            satisfaction={stats.customerSatisfactionPct}
          />
        </div>
      </div>

      {/* Omnichannel Business Highlights: Upcoming Appointments & Open Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Appointments</h3>
              </div>
              <button
                onClick={() => setCurrentView('bookings')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
              >
                View All ({bookings.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{b.serviceName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {b.customerName} · {b.date} at {b.time}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10.5px] font-medium text-slate-700">
                    {getChannelIcon(b.channel)}
                    <span className="capitalize">{b.channel}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Invoices Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Invoices Awaiting Payment</h3>
              </div>
              <button
                onClick={() => setCurrentView('invoices')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
              >
                View Ledger <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingInvoices.map((inv) => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {inv.invoiceNumber} · Due {inv.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900">
                      {inv.currency} {(inv.totalAmount ?? inv.total ?? 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold">Payment Link Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Generation Chart & Secondary Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {analyticsData && <LeadChart data={analyticsData.leads} />}
        </div>

        {/* Omnichannel Security & Meta Gateway Status */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gateway Infrastructure</h3>
              <button
                onClick={() => setCurrentView('settings-security')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Security & Webhooks <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Meta Cloud API, Instagram Graph API & Webhook Dispatcher
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Meta Cloud API Status</span>
                <span className="text-xs font-bold text-emerald-600">Operational (100%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Instagram Graph Token</span>
                <span className="text-xs font-bold text-emerald-600">Active (Auto-refresh)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Average Latency</span>
                <span className="text-xs font-bold text-slate-800">38 ms</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Enterprise TLS 1.3 · Zero Downtime Architecture
          </div>
        </div>
      </div>

      {/* Recent Conversations Table */}
      <RecentConversationsTable />

      {/* Modals for Quick Actions */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <KnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
      />
    </div>
  );
};
