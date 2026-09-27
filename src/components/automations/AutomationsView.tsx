import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Zap,
  Clock,
  CheckCircle2,
  Trash2,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  Copy,
  CalendarCheck,
} from 'lucide-react';
import { AutomationRule, AutomationTemplate, FollowUpSequence } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

export const AutomationsView: React.FC = () => {
  const {
    automations,
    automationTemplates,
    followUps,
    toggleAutomation,
    createAutomation,
    useAutomationTemplate,
    deleteAutomation,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'followups'>('workflows');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Workflow Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('New WhatsApp Inquiry from Ad');
  const [category, setCategory] = useState('Lead Qualification');
  const [triggerChannel, setTriggerChannel] = useState<'whatsapp' | 'facebook' | 'instagram' | 'website' | 'email'>('whatsapp');

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAutomation({
      businessId: 'biz-sofana',
      name,
      description,
      triggerEvent,
      triggerChannel,
      category,
      blocks: [
        {
          id: 'blk-1',
          type: 'trigger',
          label: triggerEvent,
          description: `Dispatched when customer messages via ${triggerChannel}`,
          config: {},
        },
        {
          id: 'blk-2',
          type: 'ai_action',
          label: 'AI Intent Extraction & Catalog Proposal',
          description: 'Qualifies customer budget and suggests tailored room pieces',
          config: {},
        },
      ],
      isActive: true,
    });
    setIsNewModalOpen(false);
    setName('');
    setDescription('');
  };

  const getChannelIcon = (ch: string) => {
    switch (ch.toLowerCase()) {
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
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Workflow className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Omnichannel Automations & Workflows
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Design multi-channel event triggers, automated lead qualifications, booking invites, cross-channel handoffs, and timed follow-ups without code.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'workflows'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Workflows ({automations.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'templates'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Template Library ({automationTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'followups'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          Scheduled Follow-up Queue ({followUps.length})
        </button>
      </div>

      {/* Tab 1: Active Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Trigger: {rule.triggerEvent}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAutomation(rule.id)}
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border flex items-center gap-1 transition-colors ${
                        rule.isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {rule.isActive ? (
                        <>
                          <Play className="w-2.5 h-2.5 fill-emerald-600" /> Active
                        </>
                      ) : (
                        <>
                          <Pause className="w-2.5 h-2.5 fill-slate-400" /> Paused
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4">
                    {rule.description}
                  </p>

                  {/* Actions / Blocks preview */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700 mb-3">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Workflow Blocks</div>
                    {rule.blocks.map((blk, i) => (
                      <div key={blk.id || i} className="flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="capitalize font-semibold text-slate-800">
                          {blk.label}
                        </span>
                        {blk.channel && blk.channel !== 'all' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 capitalize font-medium flex items-center gap-1">
                            {getChannelIcon(blk.channel)}
                            {blk.channel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {rule.executionCount.toLocaleString()} times triggered
                  </span>
                  <button
                    onClick={() => deleteAutomation(rule.id)}
                    className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Pre-built Templates */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase">
                    {tpl.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {tpl.channels.map((c) => (
                      <span key={c}>{getChannelIcon(c)}</span>
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{tpl.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {tpl.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 mb-4">
                  <span className="font-bold text-slate-700 block mb-0.5">Trigger:</span>
                  <span>{tpl.triggerDesc}</span>
                </div>
              </div>

              <button
                onClick={() => useAutomationTemplate(tpl.id)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Install Workflow</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Scheduled Follow-ups Queue */}
      {activeTab === 'followups' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Follow-up Sequences & Sequences Queue
            </h3>
            <span className="text-xs text-slate-400">
              {followUps.length} automated multi-channel sequences configured
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {followUps.map((seq) => (
              <div
                key={seq.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{seq.name}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-slate-100 text-[10px] font-medium text-slate-700 capitalize">
                        Target: {seq.targetSegment}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                      {seq.steps.map((st, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                          {getChannelIcon(st.channel)}
                          <span>Step {st.stepNumber}: {st.delayText}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    {seq.scheduledCount} queued / {seq.sentCount} delivered
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold capitalize">
                    {seq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Workflow Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create Custom Workflow"
        subtitle="Configure trigger condition and automated response"
      >
        <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Workflow Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Luxury Catalog Delivery & VIP Tag"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Channel</label>
            <select
              value={triggerChannel}
              onChange={(e) => setTriggerChannel(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            >
              <option value="whatsapp">WhatsApp Business</option>
              <option value="facebook">Facebook Messenger</option>
              <option value="instagram">Instagram Direct</option>
              <option value="website">Website Chat Widget</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">When this happens (Trigger)</label>
            <select
              value={triggerEvent}
              onChange={(e) => setTriggerEvent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            >
              <option value="New WhatsApp Inquiry from Ad">New WhatsApp Inquiry from Ad</option>
              <option value="Instagram Story Reply or DM">Instagram Story Reply or DM</option>
              <option value="Quote Sent but Unpaid after 24h">Quote Sent but Unpaid after 24h</option>
              <option value="Consultation Finished in Showroom">Consultation Finished in Showroom</option>
              <option value="Website Visitor clicks Consultation">Website Visitor clicks Consultation</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Workflow Description</label>
            <textarea
              rows={2}
              required
              placeholder="Summary of what the workflow executes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Save & Activate Workflow
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
