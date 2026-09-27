import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../config/branding';
import {
  Settings,
  Shield,
  Key,
  Server,
  Database,
  Lock,
  Globe,
  Bell,
  CheckCircle2,
  Save,
  AlertTriangle,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { addToast } = useApp();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState('whsec_scaleup_gulf_live_99482');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [logRetentionDays, setLogRetentionDays] = useState(90);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Admin Configuration Saved', 'Global ScaleUp Gulf AI platform rules updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Global SaaS Platform Settings
        </h1>
        <p className="text-xs text-slate-400">
          Root security controls, server-side Gemini AI orchestration, and multi-tenant infrastructure flags
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Availability */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Platform Lifecycle & Availability</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Public Client Self-Registration</span>
                <span className="text-[11px] text-slate-400">
                  Allow new businesses to register for 14-day trials via /register
                </span>
              </div>
              <input
                type="checkbox"
                checked={allowSignups}
                onChange={(e) => setAllowSignups(e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded-sm bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-slate-400">
                  Reroute non-admin traffic to scheduled maintenance page
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-rose-500 rounded-sm bg-slate-900 border-slate-700 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* AI & Orchestration Engine */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>AI Orchestrator & Multi-Tenant Boundaries</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Default LLM Model Engine
              </label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Low Latency, Recommended)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Complex Reasoning & Multilingual)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Admin Audit Log Retention
              </label>
              <select
                value={logRetentionDays}
                onChange={(e) => setLogRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days (SLA Standard)</option>
                <option value={365}>1 Year (Enterprise Compliance)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <label className="block text-slate-400 font-semibold mb-1 text-xs">
              Global n8n Shared Webhook Secret
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-950/50"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
