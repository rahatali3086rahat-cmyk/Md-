import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Plus,
  Search,
  Users,
  Clock,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Campaign, ChannelType } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

type CampaignChannel = 'whatsapp' | 'facebook' | 'instagram' | 'email';

export const CampaignsView: React.FC = () => {
  const { campaigns = [], createCampaign, toggleCampaignStatus, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Campaign Form
  const [name, setName] = useState('');
  const [targetSegment, setTargetSegment] = useState('Qualified Leads & Inquiries');
  const [channels, setChannels] = useState<CampaignChannel[]>([
    'whatsapp',
  ]);
  const [scheduledFor, setScheduledFor] = useState('2026-09-24 10:00 AM');
  const [message, setMessage] = useState(
    'Salam! We have just updated our autumn bespoke catalog with new velvet textures. Book your preview today.'
  );

  const filteredCampaigns = (campaigns || []).filter(
    (c) =>
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.targetSegment || c.audience || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleChannel = (ch: CampaignChannel) => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createCampaign({
      businessId: 'biz-sofana',
      name: name.trim(),
      audience: targetSegment,
      audienceCount: 1250,
      channel: channels[0] || 'whatsapp',
      channels,
      targetSegment,
      status: 'scheduled',
      scheduledAt: scheduledFor,
      scheduledFor,
      message,
    });
    setIsNewModalOpen(false);
    setName('');
    addToast('success', 'Campaign Scheduled', `Broadcast "${name}" is scheduled for dispatch.`);
  };

  const getChannelIcon = (ch?: string) => {
    switch ((ch || '').toLowerCase()) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Omnichannel Campaigns & Broadcasts
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Dispatch compliant broadcast announcements, product drop notifications, and seasonal re-engagement messages across WhatsApp, Instagram, Messenger, and Email.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Campaign</span>
        </button>
      </div>

      {/* Compliance Note */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Meta Cloud & WhatsApp Business Compliant:</strong> Approved pre-registered templates are used for WhatsApp broadcasts outside 24h customer support windows.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px] shrink-0">
          Opt-in Verified
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns by name or target audience..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {filteredCampaigns.length} total campaigns
        </span>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
            No campaigns found matching "{search}"
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const campChannels = (camp.channels && Array.isArray(camp.channels) && camp.channels.length > 0)
              ? camp.channels
              : [camp.channel || 'whatsapp'];

            return (
              <div
                key={camp.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{camp.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{camp.targetSegment || camp.audience || 'Target Segment'}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border capitalize ${
                        camp.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : camp.status === 'running' || (camp.status as string) === 'active'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {/* Channels row */}
                  <div className="flex items-center gap-2 my-3">
                    <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      Target Channels:
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {campChannels.map((ch) => (
                        <span
                          key={ch}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10.5px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 capitalize"
                        >
                          {getChannelIcon(ch)}
                          <span>{ch}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Message preview */}
                  {camp.message && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 italic mb-3 line-clamp-2">
                      "{camp.message}"
                    </div>
                  )}

                  {/* Stats Bar */}
                  <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center my-3">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Sent</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                        {(camp.sentCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Delivered</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                        {(camp.deliveredCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Read %</span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        {(camp.sentCount ?? 0) > 0 ? Math.round(((camp.readCount ?? 0) / (camp.sentCount || 1)) * 100) : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Replies</span>
                      <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                        {camp.convertedCount ?? camp.repliedCount ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{camp.scheduledFor || camp.scheduledAt || 'Scheduled'}</span>
                  </span>

                  <button
                    onClick={() => {
                      toggleCampaignStatus(camp.id);
                      addToast('info', 'Status Updated', `Campaign status changed for "${camp.name}"`);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 text-[11px] transition-colors"
                  >
                    {camp.status === 'running' || (camp.status as string) === 'active' ? 'Pause Campaign' : 'Trigger Dispatch'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Launch Omnichannel Broadcast"
        subtitle="Reach your customer audience across chosen messaging networks"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Campaign Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Autumn Bespoke Living Catalog Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Recipient Audience Segment</label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="All Customers & Leads (1,240)">All Customers & Leads (1,240)</option>
              <option value="VIP Customers (Spent > QAR 15,000)">VIP Customers (Spent &gt; QAR 15,000)</option>
              <option value="Qualified Leads & Inquiries">Qualified Leads & Inquiries</option>
              <option value="Past Showroom Visitors">Past Showroom Visitors</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Select Delivery Channels</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'whatsapp' as CampaignChannel, label: 'WhatsApp Cloud API', icon: <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> },
                { id: 'facebook' as CampaignChannel, label: 'Facebook Messenger', icon: <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" /> },
                { id: 'instagram' as CampaignChannel, label: 'Instagram DM', icon: <Instagram className="w-3.5 h-3.5 text-[#E1306C]" /> },
                { id: 'email' as CampaignChannel, label: 'Email Newsletter', icon: <Mail className="w-3.5 h-3.5 text-indigo-500" /> },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleToggleChannel(item.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left font-semibold transition-colors ${
                    channels.includes(item.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Broadcast Message</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Schedule Dispatch</label>
            <input
              type="text"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Schedule Campaign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
