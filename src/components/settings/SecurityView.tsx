import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Key,
  Webhook,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const SecurityView: React.FC = () => {
  const { addToast } = useApp();

  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Backend API', prefix: 'wsk_live_9a7f...', created: '2026-08-12', status: 'active' },
    { id: 'key-2', name: 'n8n Workflow Integration', prefix: 'wsk_live_4b2c...', created: '2026-09-01', status: 'active' },
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 'wh-1', url: 'https://api.sofanaliving.com/webhooks/whatsapp', events: ['messages.received', 'booking.created'], status: 'healthy', successRate: '99.8%' },
    { id: 'wh-2', url: 'https://n8n.internal.net/webhook/crm-sync', events: ['lead.status_updated', 'invoice.paid'], status: 'healthy', successRate: '100%' },
  ]);

  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const [isNewWebhookModalOpen, setIsNewWebhookModalOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    addToast('success', 'Copied to Clipboard', `${label} copied.`);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `wsk_live_${Math.random().toString(36).substring(2, 8)}...`,
      created: new Date().toISOString().slice(0, 10),
      status: 'active',
    };
    setApiKeys([...apiKeys, newKey]);
    setIsNewKeyModalOpen(false);
    setNewKeyName('');
    addToast('success', 'API Key Created', 'Store this key safely; it will not be shown again in full.');
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const newWh = {
      id: `wh-${Date.now()}`,
      url: newWebhookUrl,
      events: ['messages.received', 'invoice.paid'],
      status: 'healthy',
      successRate: '100%',
    };
    setWebhooks([...webhooks, newWh]);
    setIsNewWebhookModalOpen(false);
    setNewWebhookUrl('');
    addToast('success', 'Webhook Registered', 'Endpoint will receive event payloads in real-time.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Security, Webhooks & Developer Access
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Configure Meta Cloud API verify tokens, webhook event endpoints for WhatsApp/Instagram/Messenger, and manage developer API keys.
          </p>
        </div>
      </div>

      {/* Meta Webhook Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Webhook className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Meta Cloud API Inbound Webhook Configuration
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Paste these credentials into your Meta for Developers App Dashboard under WhatsApp &gt; Configuration &gt; Webhook.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Callback URL
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-slate-800 font-semibold truncate">
                https://api.whatsai.app/v1/webhooks/meta/biz-sofana
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    'https://api.whatsai.app/v1/webhooks/meta/biz-sofana',
                    'Meta Callback URL'
                  )
                }
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Verify Token
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-slate-800 font-semibold truncate">
                wsk_verify_sofana_atelier_secure_9012
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    'wsk_verify_sofana_atelier_secure_9012',
                    'Meta Verify Token'
                  )
                }
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Outbound Webhooks Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Outbound Event Webhooks</h3>
            <p className="text-xs text-slate-400">
              Forward live customer messages, leads, and payment events to your CRM or custom servers
            </p>
          </div>
          <button
            onClick={() => setIsNewWebhookModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Webhook</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
            >
              <div>
                <div className="font-mono font-bold text-slate-900">{wh.url}</div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                  <span>Subscribed:</span>
                  {wh.events.map((e) => (
                    <span
                      key={e}
                      className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px]"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Healthy ({wh.successRate})</span>
                </span>
                <button
                  onClick={() => setWebhooks(webhooks.filter((w) => w.id !== wh.id))}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer API Keys */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Developer API Keys</h3>
            <p className="text-xs text-slate-400">
              Access the WhatsAI programmatic API for custom automations and backend integrations
            </p>
          </div>
          <button
            onClick={() => setIsNewKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {apiKeys.map((k) => (
            <div
              key={k.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
            >
              <div>
                <div className="font-bold text-slate-900">{k.name}</div>
                <div className="font-mono text-slate-500 text-[11px] mt-0.5">{k.prefix}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Created: {k.created}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                  {k.status}
                </span>
                <button
                  onClick={() => setApiKeys(apiKeys.filter((item) => item.id !== k.id))}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isNewKeyModalOpen}
        onClose={() => setIsNewKeyModalOpen(false)}
        title="Generate Developer API Key"
        subtitle="Provide a descriptive label for this integration token"
      >
        <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Key Label</label>
            <input
              type="text"
              required
              placeholder="e.g. Zapier Production Sync"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewKeyModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
            >
              Generate Key
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isNewWebhookModalOpen}
        onClose={() => setIsNewWebhookModalOpen(false)}
        title="Register Outbound Webhook"
        subtitle="HTTPS endpoint where JSON event payloads will be sent"
      >
        <form onSubmit={handleCreateWebhook} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Endpoint URL</label>
            <input
              type="url"
              required
              placeholder="https://yourdomain.com/webhooks/whatsai"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewWebhookModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Register Webhook
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
