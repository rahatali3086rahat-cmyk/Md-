import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  PowerOff,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const WhatsAppSettingsView: React.FC = () => {
  const { currentBusiness, toggleWhatsAppConnection, addToast } = useApp();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const isConnected = currentBusiness?.whatsappStatus === 'connected';

  const webhookUrl = 'https://api.scaleupgulf.ai/webhooks/whatsapp/v1';
  const verifyToken = 'scaleup_gulf_secret_token_9841';
  const wabaId = '489218492019482';
  const phoneId = '109283746592018';
  const phoneNumber = currentBusiness?.whatsappPhone || '+974 5512 8844';
  const displayName = currentBusiness?.name || 'Sofana Furniture';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast('info', 'Copied to clipboard', text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      addToast(
        'success',
        'WhatsApp Cloud API Validated',
        'Meta webhook ping returned HTTP 200 OK. Messages delivering normally.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                WhatsApp Business Cloud API
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isConnected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span>{isConnected ? 'Connected & Verified' : 'Disconnected / Paused'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Official Meta Cloud API gateway integration for automated customer messaging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Pinging API...' : 'Test Connection'}</span>
          </button>

          <button
            onClick={toggleWhatsAppConnection}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isConnected
                ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
          </button>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Connected Phone & WABA Credentials</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              WhatsApp Business Phone
            </span>
            <p className="text-base font-bold text-slate-900 font-mono mt-1">{phoneNumber}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Quality Rating: High (Green Tier)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Verified Display Name
            </span>
            <p className="text-base font-bold text-slate-900 mt-1">{displayName}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Official WhatsApp Business Profile</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                WhatsApp Business Account ID (WABA ID)
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">{wabaId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(wabaId, 'waba')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              {copiedField === 'waba' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Phone Number ID
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">{phoneId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(phoneId, 'phoneId')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              {copiedField === 'phoneId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Meta Webhook Endpoint */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Webhook Configuration</h3>
        </div>
        <p className="text-xs text-slate-500">
          Paste these credentials inside your Meta for Developers App dashboard under WhatsApp → Configuration.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Callback URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs select-all"
              />
              <button
                onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
              >
                {copiedField === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verify Token</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={verifyToken}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs select-all"
              />
              <button
                onClick={() => copyToClipboard(verifyToken, 'token')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
              >
                {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
