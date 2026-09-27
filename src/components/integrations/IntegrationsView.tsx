import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Globe,
  MessageSquare,
  Instagram,
  Mail,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Workflow,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Settings,
  ExternalLink,
  ChevronRight,
  X,
  Key,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'Channel' | 'Booking' | 'Finance' | 'Automation' | 'Tools';
  description: string;
  status: 'Connected' | 'Not Connected' | 'Error';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  details: string;
  configFields: { label: string; key: string; placeholder: string; type?: string; value: string }[];
}

export const IntegrationsView: React.FC = () => {
  const { currentBusiness, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'channels' | 'tools'>('all');
  const [selectedConfig, setSelectedConfig] = useState<IntegrationItem | null>(null);

  const [integrationsList, setIntegrationsList] = useState<IntegrationItem[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      category: 'Channel',
      description: 'Official Meta Cloud API for automated conversations, template broadcasts, and catalog checkout.',
      status: 'Connected',
      icon: Globe,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      details: 'Connected Phone: +974 5512 8844 (WABA ID: 94827104)',
      configFields: [
        { label: 'Meta App ID', key: 'appId', placeholder: '1029384756', value: '1029384756' },
        { label: 'System User Access Token', key: 'token', placeholder: 'EAABw...', type: 'password', value: 'EAABw982347182937491823749812739' },
        { label: 'WhatsApp Business Account ID', key: 'wabaId', placeholder: '94827104', value: '94827104' },
      ],
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      category: 'Channel',
      description: 'Engage visitors and run click-to-Messenger marketing funnels directly with Gemini automation.',
      status: 'Connected',
      icon: MessageSquare,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      details: 'Connected Page: Sofana Living Interiors (14.2k followers)',
      configFields: [
        { label: 'Page ID', key: 'pageId', placeholder: '1092837465', value: '1092837465' },
        { label: 'Page Access Token', key: 'pageToken', placeholder: 'EAACx...', type: 'password', value: 'EAACx99823479182374' },
      ],
    },
    {
      id: 'instagram',
      name: 'Instagram Direct Messages',
      category: 'Channel',
      description: 'Auto-reply to luxury product DMs, story mentions, and reels comments with product links.',
      status: 'Connected',
      icon: Instagram,
      iconBg: 'bg-pink-500/20',
      iconColor: 'text-pink-400',
      details: 'Account: @sofanahome.qa (Verified Business)',
      configFields: [
        { label: 'Instagram Account ID', key: 'igId', placeholder: '178414002348', value: '178414002348' },
        { label: 'Webhook Verification Token', key: 'webhookSecret', placeholder: 'whsec_...', type: 'password', value: 'whsec_ig_99281' },
      ],
    },
    {
      id: 'webchat',
      name: 'Website Live Chat Widget',
      category: 'Channel',
      description: 'Embeddable real-time customer widget with omnichannel sync, brand themes, and lead capture.',
      status: 'Connected',
      icon: Zap,
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-400',
      details: 'Script active on: https://sofanafurniture.qa',
      configFields: [
        { label: 'Primary Brand Color', key: 'brandColor', placeholder: '#10b981', value: '#10b981' },
        { label: 'Welcome Greeting', key: 'greeting', placeholder: 'Welcome! How can we assist?', value: 'Marhaba! Welcome to Sofana Living Doha.' },
      ],
    },
    {
      id: 'email',
      name: 'Corporate Email (SMTP / Resend)',
      category: 'Tools',
      description: 'Transactional email notifications for VIP booking confirmations, invoices, and payment receipts.',
      status: 'Connected',
      icon: Mail,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      details: 'Sender: concierge@sofanafurniture.qa via Resend API',
      configFields: [
        { label: 'Resend / SMTP API Key', key: 'apiKey', placeholder: 're_12345...', type: 'password', value: 're_live_99283746152' },
        { label: 'Sender Address', key: 'sender', placeholder: 'support@yourdomain.com', value: 'concierge@sofanafurniture.qa' },
      ],
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar Two-Way Sync',
      category: 'Booking',
      description: 'Real-time showroom appointment scheduling with conflict collision prevention and automated invites.',
      status: 'Connected',
      icon: Calendar,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      details: 'Synced with: VIP Interior Consultations (Primary Calendar)',
      configFields: [
        { label: 'Calendar ID', key: 'calId', placeholder: 'primary', value: 'primary' },
        { label: 'Meeting Buffer (Minutes)', key: 'buffer', placeholder: '15', value: '15' },
      ],
    },
    {
      id: 'stripe',
      name: 'Stripe Gateway & Checkout',
      category: 'Finance',
      description: 'Generate secure, currency-localized payment links inside WhatsApp chats for instant settlement.',
      status: 'Connected',
      icon: CreditCard,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      details: 'Account: acct_1N0Qx9... (QAR, AED, USD enabled)',
      configFields: [
        { label: 'Stripe Secret Key', key: 'stripeSecret', placeholder: 'sk_live_...', type: 'password', value: 'sk_live_9918237192837' },
        { label: 'Webhook Signing Secret', key: 'whsec', placeholder: 'whsec_...', type: 'password', value: 'whsec_stripe_88291' },
      ],
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets Live Sync',
      category: 'Tools',
      description: 'Automatic streaming of new CRM leads, booking dates, and orders into custom Google Spreadsheets.',
      status: 'Not Connected',
      icon: FileSpreadsheet,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      details: 'Click connect to link Google Drive spreadsheet',
      configFields: [
        { label: 'Spreadsheet ID', key: 'sheetId', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', value: '' },
        { label: 'Target Sheet Tab', key: 'tabName', placeholder: 'Inbound Leads', value: 'Inbound Leads' },
      ],
    },
    {
      id: 'n8n',
      name: 'n8n Workflow Automation Engine',
      category: 'Automation',
      description: 'Trigger complex low-code automations, webhook bridges, ERP syncs, and custom WhatsApp message routes.',
      status: 'Connected',
      icon: Workflow,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      details: 'Webhook: https://n8n.scaleupgulf.internal/webhook/waba-incoming',
      configFields: [
        { label: 'n8n Webhook URL', key: 'webhookUrl', placeholder: 'https://...', value: 'https://n8n.scaleupgulf.internal/webhook/waba-incoming' },
        { label: 'API Bearer Secret', key: 'apiKey', placeholder: 'secret-token', type: 'password', value: 'scaleup_n8n_secret_token_992' },
      ],
    },
  ]);

  const handleToggleConnect = (item: IntegrationItem) => {
    const newStatus = item.status === 'Connected' ? 'Not Connected' : 'Connected';
    setIntegrationsList((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
    addToast(
      newStatus === 'Connected' ? 'success' : 'info',
      `${item.name} ${newStatus}`,
      `Integration state updated for ${currentBusiness?.name || 'Workspace'}.`
    );
  };

  const handleSaveConfig = () => {
    if (!selectedConfig) return;
    addToast('success', 'Configuration Saved', `${selectedConfig.name} settings updated securely.`);
    setSelectedConfig(null);
  };

  const filteredIntegrations = integrationsList.filter((item) => {
    if (activeTab === 'channels') return item.category === 'Channel';
    if (activeTab === 'tools') return item.category !== 'Channel';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Omnichannel & Platform Integrations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Connect communication channels, payment gateways, calendar systems, and n8n webhook pipelines
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All (9)
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tools & Automation
          </button>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => {
          const Icon = item.icon;
          const isConnected = item.status === 'Connected';

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                      <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{item.status}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 mb-4">
                  {item.details}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedConfig(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>

                <button
                  onClick={() => handleToggleConnect(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isConnected
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {selectedConfig && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedConfig.iconBg} ${selectedConfig.iconColor}`}>
                  <selectedConfig.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedConfig.name} Configuration
                  </h3>
                  <span className="text-xs text-slate-400">Scoped to {currentBusiness?.name || 'Workspace'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedConfig(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {selectedConfig.configFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedConfig(null)}
                className="py-2 px-3 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Save Integration Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
