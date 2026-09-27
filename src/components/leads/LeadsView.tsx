import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Users2,
  Search,
  Filter,
  Download,
  MessageSquare,
  DollarSign,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  Globe,
  Instagram,
  Zap,
  X,
  User,
  Plus,
  ArrowRightLeft,
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus, selectConversationAndOpenInbox, addToast } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // CRM Pipeline stages required: New, Qualified, Contacted, Proposal, Booked, Won, Lost
  const pipelineStages: { id: LeadStatus | 'proposal' | 'booked'; label: string; color: string; bgHeader: string }[] = [
    { id: 'new', label: 'New Inquiries', color: 'border-slate-500 text-slate-400', bgHeader: 'bg-slate-800/60' },
    { id: 'qualified', label: 'Qualified (Hot)', color: 'border-purple-500 text-purple-400', bgHeader: 'bg-purple-950/40' },
    { id: 'contacted', label: 'Contacted', color: 'border-blue-500 text-blue-400', bgHeader: 'bg-blue-950/40' },
    { id: 'proposal', label: 'Proposal Sent', color: 'border-amber-500 text-amber-400', bgHeader: 'bg-amber-950/40' },
    { id: 'booked', label: 'Showroom Booked', color: 'border-indigo-500 text-indigo-400', bgHeader: 'bg-indigo-950/40' },
    { id: 'won', label: 'Deals Won', color: 'border-emerald-500 text-emerald-400', bgHeader: 'bg-emerald-950/40' },
    { id: 'lost', label: 'Lost', color: 'border-rose-500 text-rose-400', bgHeader: 'bg-rose-950/40' },
  ];

  const getNormalizedStage = (lead: Lead): string => {
    if ((lead as any).stage) return (lead as any).stage;
    return lead.status;
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.product.toLowerCase().includes(search.toLowerCase()) ||
      lead.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || getNormalizedStage(lead) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLeads = leads.length;
  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const wonCount = leads.filter((l) => l.status === 'won').length;

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Location', 'Product', 'Budget', 'Status', 'Created'];
    const rows = filteredLeads.map((l) => [
      l.name,
      l.phone,
      l.location,
      l.product,
      l.budget,
      l.status,
      l.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scaleup_gulf_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Exported', `Exported ${filteredLeads.length} leads successfully.`);
  };

  const handleStageChange = (leadId: string, newStage: string) => {
    updateLeadStatus(leadId, newStage as LeadStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStage as LeadStatus });
    }
    addToast('info', 'Lead Stage Updated', `Moved lead to ${newStage.toUpperCase()}.`);
  };

  const getSourceIcon = (source?: string) => {
    switch (source?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'messenger':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'webchat':
      case 'website':
        return <Zap className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Omnichannel Leads & CRM Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prospects automatically qualified with budget, timeline, and purchase intent across WhatsApp, Instagram, and Website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Kanban vs Table switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Inquiries</span>
          <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{totalLeads}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.4% qualified this month</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">High-Intent Leads</span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400 tracking-tight mt-1">
            {qualifiedCount}
          </p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Budget confirmed &gt; 5,000 QAR</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Active Outreach</span>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight mt-1">{contactedCount}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Proposal or consultation set</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Deals Won</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">{wonCount}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Deposits settled via Stripe / POS</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {(['all', 'new', 'qualified', 'contacted', 'won', 'lost'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s === 'all' ? 'All Leads' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {pipelineStages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => {
              const currentStage = getNormalizedStage(l);
              return currentStage === stage.id || (stage.id === 'proposal' && l.status === 'contacted' && l.notes?.includes('proposal'));
            });

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col max-h-[700px]"
              >
                {/* Stage Header */}
                <div className={`p-3.5 rounded-t-2xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between ${stage.bgHeader}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full border-2 ${stage.color}`} />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {stage.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          {lead.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {getSourceIcon(lead.source)}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{lead.location}</span>
                      </p>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] mb-2">
                        <div className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold">INTEREST</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{lead.product}</div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {lead.budget}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {lead.conversationId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectConversationAndOpenInbox(lead.conversationId!);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              title="Open live chat"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-600 text-[11px]">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Lead / Contact</th>
                  <th className="py-3.5 px-5">Source</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">Product Intent</th>
                  <th className="py-3.5 px-5">Budget Value</th>
                  <th className="py-3.5 px-5">Stage</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="font-bold text-slate-900 dark:text-white hover:text-emerald-500 text-left"
                      >
                        {lead.name}
                      </button>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.phone}</p>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 capitalize">
                        {getSourceIcon(lead.source)}
                        <span>{lead.source || 'WhatsApp'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{lead.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-medium text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {lead.product}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-semibold text-emerald-700 dark:text-emerald-400">
                      {lead.budget}
                    </td>

                    <td className="py-3.5 px-5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStageChange(lead.id, e.target.value)}
                        className="text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-1 px-2 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                      >
                        <option value="new">New</option>
                        <option value="qualified">Qualified</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {lead.conversationId && (
                        <button
                          onClick={() => selectConversationAndOpenInbox(lead.conversationId!)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Details Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedLead.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedLead.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value="new">New Inquiries</option>
                    <option value="qualified">Qualified (Hot)</option>
                    <option value="contacted">Contacted</option>
                    <option value="won">Deals Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interested Product</span>
                    <strong className="text-slate-900 dark:text-white">{selectedLead.product}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Budget</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{selectedLead.budget}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <strong className="text-slate-900 dark:text-white">{selectedLead.location}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Acquisition Source</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      {getSourceIcon(selectedLead.source)}
                      <span>{selectedLead.source || 'WhatsApp'}</span>
                    </div>
                  </div>
                </div>

                {selectedLead.notes && (
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                      AI Lead Qualification Summary
                    </label>
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-purple-900 dark:text-purple-300 leading-relaxed">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              {selectedLead.conversationId && (
                <button
                  onClick={() => {
                    selectConversationAndOpenInbox(selectedLead.conversationId!);
                    setSelectedLead(null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Thread</span>
                </button>
              )}
              <button
                onClick={() => setSelectedLead(null)}
                className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
