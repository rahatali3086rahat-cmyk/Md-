import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaaSClient, SaaSSubscription } from '../../data/mockAdmin';
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  X,
  Mail,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  Bot,
  Zap,
  Lock,
  UserCheck,
  Ban,
  DollarSign,
} from 'lucide-react';

export const AdminClientsView: React.FC = () => {
  const {
    saasClients,
    saasSubscriptions,
    saasPayments,
    updateClientStatus,
    updateClientPlan,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<SaaSClient | null>(null);
  const [editPlanModalClient, setEditPlanModalClient] = useState<SaaSClient | null>(null);
  const [selectedPlanChoice, setSelectedPlanChoice] = useState<SaaSClient['plan']>('Business');

  // Filter clients
  const filteredClients = saasClients.filter((client) => {
    const matchesSearch =
      client.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPlan = planFilter === 'all' || client.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleToggleStatus = async (client: SaaSClient) => {
    const newStatus = client.status === 'active' ? 'suspended' : 'active';
    await updateClientStatus(client.id, newStatus);
    addToast(
      newStatus === 'active' ? 'success' : 'warning',
      `Client ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
      `${client.businessName} status is now ${newStatus}.`
    );
    if (selectedClient?.id === client.id) {
      setSelectedClient({ ...client, status: newStatus });
    }
  };

  const handlePlanSave = async () => {
    if (!editPlanModalClient) return;
    await updateClientPlan(editPlanModalClient.id, selectedPlanChoice);
    addToast(
      'success',
      'Plan Updated',
      `${editPlanModalClient.businessName} upgraded/downgraded to ${selectedPlanChoice} tier.`
    );
    if (selectedClient?.id === editPlanModalClient.id) {
      setSelectedClient({ ...selectedClient, plan: selectedPlanChoice });
    }
    setEditPlanModalClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            SaaS Client & Tenant Management
          </h1>
          <p className="text-xs text-slate-400">
            Control platform access, plans, billing statuses, and multi-tenant quotas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Total Tenants: <strong className="text-white">{saasClients.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search business, owner, or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="trial">Trialing</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Plan filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Business">Business</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Owner & Contact</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">MRR</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="font-bold text-white hover:text-indigo-400 flex items-center gap-2 text-left cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{client.businessName}</span>
                    </button>
                    <span className="text-[10px] text-slate-500 block pl-6">{client.industry}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-medium text-white">{client.ownerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{client.ownerEmail}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-bold text-[11px]">
                      {client.plan}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize ${
                        client.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : client.status === 'trial'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        client.status === 'active' ? 'bg-emerald-400' : client.status === 'trial' ? 'bg-blue-400' : 'bg-rose-400'
                      }`} />
                      <span>{client.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-200">
                    ${client.mrr}/mo
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {client.createdDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {client.lastActivity || client.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                        title="View complete client record"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setEditPlanModalClient(client);
                          setSelectedPlanChoice(client.plan);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                        title="Change plan tier"
                      >
                        Plan
                      </button>

                      <button
                        onClick={() => handleToggleStatus(client)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          client.status === 'active'
                            ? 'text-rose-400 hover:bg-rose-950/40'
                            : 'text-emerald-400 hover:bg-emerald-950/40'
                        }`}
                        title={client.status === 'active' ? 'Suspend client' : 'Activate client'}
                      >
                        {client.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No SaaS clients matched your criteria.
          </div>
        )}
      </div>

      {/* Client Detail Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-black text-white">{selectedClient.businessName}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      selectedClient.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedClient.industry} • Tenant ID: {selectedClient.id}</p>
                </div>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tenant Privacy Notice */}
              <div className="mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tenant Privacy Isolation Active:</strong> Individual WhatsApp/Instagram end-user messages are strictly encrypted under PostgreSQL RLS and cannot be read from the SaaS Admin panel. Only consumption aggregates are exposed.
                </span>
              </div>

              {/* Owner & Contact Card */}
              <div className="mb-6 bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Owner Information</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Authorized Owner</span>
                    <span className="font-semibold text-slate-200">{selectedClient.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Email</span>
                    <span className="font-semibold text-slate-200">{selectedClient.ownerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Phone</span>
                    <span className="font-semibold text-slate-200">{selectedClient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Account Created</span>
                    <span className="font-semibold text-slate-200">{selectedClient.createdDate}</span>
                  </div>
                </div>
              </div>

              {/* Subscription & Plan Card */}
              <div className="mb-6 bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Subscription & MRR</h3>
                  <button
                    onClick={() => {
                      setEditPlanModalClient(selectedClient);
                      setSelectedPlanChoice(selectedClient.plan);
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Change Tier
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Plan</span>
                    <span className="font-black text-indigo-400 text-sm">{selectedClient.plan}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">MRR</span>
                    <span className="font-black text-emerald-400 text-sm">${selectedClient.mrr}/mo</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Next Renewal</span>
                    <span className="font-black text-white text-xs mt-0.5 block">{selectedClient.renewalDate}</span>
                  </div>
                </div>
              </div>

              {/* Usage & Consumption Telemetry */}
              <div className="mb-6 bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Monthly Usage Telemetry</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                      <span>WhatsApp Cloud API Messages</span>
                      <span>{selectedClient.usage.whatsappMessages.toLocaleString()} / {selectedClient.usage.whatsappLimit.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, Math.round((selectedClient.usage.whatsappMessages / selectedClient.usage.whatsappLimit) * 100))}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                      <span>AI Model Tokens (Gemini 2.5)</span>
                      <span>{selectedClient.usage.aiTokensUsed.toLocaleString()} / {selectedClient.usage.aiTokensLimit.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, Math.round((selectedClient.usage.aiTokensUsed / selectedClient.usage.aiTokensLimit) * 100))}%` }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                      <span>n8n Webhook Invocations</span>
                      <span>{selectedClient.usage.webhookCalls.toLocaleString()} calls</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-2/5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Omnichannel Integrations */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Connected Channels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.channelsConnected.map((chan) => (
                    <span
                      key={chan}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>{chan}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleToggleStatus(selectedClient)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedClient.status === 'active'
                    ? 'bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600/30'
                    : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30'
                }`}
              >
                {selectedClient.status === 'active' ? 'Suspend Account' : 'Activate Account'}
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Switcher Modal */}
      {editPlanModalClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                Modify SaaS Plan for {editPlanModalClient.businessName}
              </h3>
              <button
                onClick={() => setEditPlanModalClient(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Select the new tier to update billing, AI token allotments, and feature gates.
            </p>

            <div className="space-y-2 mb-6">
              {(['Starter', 'Professional', 'Business', 'Enterprise'] as const).map((tier) => (
                <label
                  key={tier}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPlanChoice === tier
                      ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="planChoice"
                      checked={selectedPlanChoice === tier}
                      onChange={() => setSelectedPlanChoice(tier)}
                      className="text-indigo-500 focus:ring-indigo-500"
                    />
                    <span>{tier} Plan</span>
                  </div>
                  <span className="text-slate-300">
                    {tier === 'Starter' ? '$250/mo' : tier === 'Professional' ? '$650/mo' : tier === 'Business' ? '$1,250/mo' : '$2,500/mo'}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditPlanModalClient(null)}
                className="py-2 px-3 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePlanSave}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Apply Plan Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
