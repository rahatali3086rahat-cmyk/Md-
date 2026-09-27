import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemHealthService } from '../../data/mockAdmin';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Zap,
  Globe,
  Bot,
  Mail,
  CreditCard,
  Database,
  Radio,
} from 'lucide-react';

export const AdminSystemHealthView: React.FC = () => {
  const { saasHealthServices, pingHealthService, addToast } = useApp();

  const [pingingId, setPingingId] = useState<string | null>(null);

  const handlePing = async (service: SystemHealthService) => {
    setPingingId(service.id);
    try {
      await pingHealthService(service.id);
      addToast(
        'success',
        'Service Pinged',
        `${service.name} responded in ${service.latencyMs}ms with status: ${service.status}`
      );
    } catch {
      addToast('error', 'Ping Failed', `Failed to reach ${service.name}`);
    } finally {
      setPingingId(null);
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'srv-n8n':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'srv-supabase':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'srv-api':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'srv-whatsapp':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'srv-email':
        return <Mail className="w-5 h-5 text-indigo-400" />;
      case 'srv-stripe':
        return <CreditCard className="w-5 h-5 text-purple-400" />;
      case 'srv-gemini':
        return <Bot className="w-5 h-5 text-indigo-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: SystemHealthService['status']) => {
    switch (status) {
      case 'operational':
        return {
          color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'Operational',
        };
      case 'warning':
        return {
          color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'Degraded / Retrying',
        };
      case 'down':
        return {
          color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
          dot: 'bg-rose-400',
          label: 'Outage',
        };
    }
  };

  const operationalCount = saasHealthServices.filter((s) => s.status === 'operational').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Infrastructure & Automation Health
          </h1>
          <p className="text-xs text-slate-400">
            Live telemetry for n8n orchestrators, PostgreSQL multi-tenancy, WhatsApp WABA Cloud API, and Gemini AI engines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Overall Health: <strong className="text-emerald-400">{operationalCount}/{saasHealthServices.length} Normal</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {saasHealthServices.map((service) => {
          const badge = getStatusBadge(service.status);
          const isPinging = pingingId === service.id;

          return (
            <div
              key={service.id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{service.name}</h3>
                      <span className="text-[11px] text-slate-400 block">{service.category}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${badge.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-slate-400">
                    <span>Uptime (30d SLA)</span>
                    <strong className="text-slate-200">{service.uptimePercentage || service.uptime90d}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Measured Latency</span>
                    <strong className="text-slate-200">{service.latencyMs} ms</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Telemetry Heartbeat</span>
                    <span className="text-slate-400 font-mono text-[11px]">{service.lastCheck || service.lastChecked}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {service.id === 'srv-n8n' ? 'Self-hosted webhook cluster' : 'High availability SLA'}
                </span>

                <button
                  onClick={() => handlePing(service)}
                  disabled={isPinging}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging...' : 'Ping Test'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
