import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bot,
  User,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
} from 'lucide-react';
import { Conversation } from '../../types';
import { ChannelType } from '../../types/omnichannel';

interface ConversationListProps {
  onSelectMobile?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ onSelectMobile }) => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | ChannelType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'ai' | 'human' | 'leads' | 'bookings' | 'payments'>('all');

  const filteredConversations = conversations.filter((conv) => {
    // Search match
    const matchesSearch =
      conv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
      (conv.customerPhone && conv.customerPhone.includes(search)) ||
      (conv.customerEmail && conv.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
      (conv.channel && conv.channel.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Channel filter
    if (channelFilter !== 'all' && conv.channel !== channelFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'unread') return (conv.unreadCount || 0) > 0;
    if (statusFilter === 'ai') return conv.status === 'ai';
    if (statusFilter === 'human') return conv.status === 'human';
    if (statusFilter === 'leads') return conv.leadStatus === 'qualified' || conv.leadStatus === 'proposal' || conv.leadStatus === 'won';
    if (statusFilter === 'bookings') return conv.conversationType === 'booking';
    if (statusFilter === 'payments') return conv.conversationType === 'payment';

    return true;
  });

  const handleSelect = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    if (onSelectMobile) {
      onSelectMobile();
    }
  };

  const getChannelIcon = (channel?: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="w-3 h-3 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3 h-3 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3 h-3 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3 h-3 text-emerald-600" />;
      case 'email':
        return <Mail className="w-3 h-3 text-indigo-600" />;
      default:
        return <MessageCircle className="w-3 h-3 text-emerald-600" />;
    }
  };

  const getChannelBadge = (channel?: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return { label: 'WhatsApp', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'facebook':
        return { label: 'Messenger', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'instagram':
        return { label: 'Instagram', bg: 'bg-pink-50 text-pink-800 border-pink-200' };
      case 'website':
        return { label: 'Web Chat', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'email':
        return { label: 'Email', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'Omni', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-100 space-y-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all channels, customers, leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Channel Switcher Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setChannelFilter('whatsapp')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'whatsapp'
                ? 'bg-[#25D366] text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </button>
          <button
            onClick={() => setChannelFilter('facebook')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'facebook'
                ? 'bg-[#1877F2] text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <MessageSquareText className="w-3 h-3" />
            FB
          </button>
          <button
            onClick={() => setChannelFilter('instagram')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'instagram'
                ? 'bg-[#E1306C] text-white'
                : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
            }`}
          >
            <Instagram className="w-3 h-3" />
            IG
          </button>
          <button
            onClick={() => setChannelFilter('website')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'website'
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <Globe className="w-3 h-3" />
            Web
          </button>
          <button
            onClick={() => setChannelFilter('email')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              channelFilter === 'email'
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            <Mail className="w-3 h-3" />
            Email
          </button>
        </div>

        {/* Status / Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {([
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'ai', label: 'AI Handled' },
            { id: 'human', label: 'Human' },
            { id: 'leads', label: 'Leads' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'payments', label: 'Payments' },
          ] as const).map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium whitespace-nowrap transition-colors ${
                statusFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No conversations matching this filter
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedConversationId === conv.id;
            const chBadge = getChannelBadge(conv.channel);

            return (
              <div
                key={conv.id}
                onClick={() => handleSelect(conv)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-50/70 border-l-3 border-emerald-600'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Avatar with Channel Overlay */}
                <div className="relative shrink-0">
                  {conv.customerAvatar ? (
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {conv.customerName.charAt(0)}
                    </div>
                  )}

                  {/* Channel icon badge */}
                  <span
                    className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center ring-1 ring-slate-200"
                    title={chBadge.label}
                  >
                    {getChannelIcon(conv.channel)}
                  </span>

                  {/* AI or Human Mode Indicator */}
                  {conv.status === 'ai' ? (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                      title="AI Automated"
                    />
                  ) : (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white"
                      title="Human Agent"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-emerald-950' : 'text-slate-900'
                        }`}
                      >
                        {conv.customerName}
                      </p>
                      <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${chBadge.bg}`}>
                        {chBadge.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate leading-snug">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 gap-1">
                    {/* Status Badges */}
                    <div className="flex items-center gap-1 overflow-hidden">
                      {conv.status === 'ai' ? (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                          <Bot className="w-2.5 h-2.5" />
                          AI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                          <User className="w-2.5 h-2.5" />
                          Human
                        </span>
                      )}

                      {conv.conversationType === 'booking' && (
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                          <CalendarCheck className="w-2.5 h-2.5" />
                          Booking
                        </span>
                      )}

                      {conv.conversationType === 'payment' && (
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded">
                          <CreditCard className="w-2.5 h-2.5" />
                          Payment
                        </span>
                      )}

                      {conv.leadStatus === 'qualified' && (
                        <span className="text-[9.5px] font-semibold text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded">
                          Hot Lead
                        </span>
                      )}
                    </div>

                    {/* Unread Badge */}
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
