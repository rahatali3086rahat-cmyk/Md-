import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../config/branding';
import {
  Layers,
  Check,
  Zap,
  Sparkles,
  Bot,
  Building2,
  Shield,
  Edit2,
  ArrowRight,
} from 'lucide-react';

export const AdminPlansView: React.FC = () => {
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 250,
      priceAnnual: 200,
      description: 'Single-channel automation for emerging boutique businesses in Qatar & GCC.',
      features: [
        '1 WhatsApp Business API Number',
        '1,500 AI conversations / month',
        'Lead CRM & Stage tracking',
        'Basic Booking & Appointments',
        'Email notifications',
        'Community Support',
      ],
      activeSubscribers: 1,
      badge: null,
    },
    {
      id: 'pro',
      name: 'Professional',
      priceMonthly: 650,
      priceAnnual: 520,
      description: 'Omnichannel automation with CRM, appointment booking, and invoice generation.',
      features: [
        'WhatsApp + Instagram + Messenger',
        '6,000 AI conversations / month',
        'Full CRM Kanban pipeline',
        'Automated Invoices & Stripe links',
        'Google Calendar two-way sync',
        'Custom Knowledge Base (10 docs)',
        'Priority Gulf Support',
      ],
      activeSubscribers: 2,
      badge: 'Most Popular in GCC',
    },
    {
      id: 'business',
      name: 'Business',
      priceMonthly: 1250,
      priceAnnual: 990,
      description: 'Full omnichannel automation with custom n8n workflows and team collaboration.',
      features: [
        'All Omnichannel Channels + Webchat',
        '18,000 AI conversations / month',
        'n8n Custom Automation Webhooks',
        'Multi-Agent Inbox (5 Seats)',
        'Voice Note Audio Transcription',
        'Real-time WhatsApp Broadcasts',
        'Dedicated SLA Manager',
      ],
      activeSubscribers: 2,
      badge: 'High MRR Impact',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 2500,
      priceAnnual: 1990,
      description: 'Custom fine-tuned LLMs, dedicated infrastructure, and on-premise integrations.',
      features: [
        'Unlimited WhatsApp & Social Channels',
        '50,000+ AI conversations / month',
        'Custom Fine-Tuned Gemini Models',
        'Unlimited Team Seats & Roles',
        'White-label portal with Custom Domain',
        'PostgreSQL Dedicated Tenant Isolation',
        '24/7 Dedicated UAE & Qatar Account Exec',
      ],
      activeSubscribers: 1,
      badge: 'Enterprise Tier',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            ScaleUp Gulf AI — SaaS Plans & Pricing Tiers
          </h1>
          <p className="text-xs text-slate-400">
            Define subscription tiers, usage quotas, token limits, and customer feature gates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('info', 'Tier Configurator', 'Pricing schema synced to Stripe Product Catalog.')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Sync to Stripe Catalog
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-5 border flex flex-col justify-between relative transition-all ${
              plan.id === 'business'
                ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                : 'bg-slate-900/80 border-slate-800/80'
            }`}
          >
            <div>
              {plan.badge && (
                <div className="mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500 text-white shadow-xs">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-black text-white">{plan.name}</h3>
                <span className="text-xs font-bold text-slate-400">
                  {plan.activeSubscribers} Client{plan.activeSubscribers !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl font-black text-white">
                  ${activeTab === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{plan.description}</p>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Features & Quotas
                </span>
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800">
              <button
                onClick={() => addToast('info', 'Tier Editor', `Modifying ${plan.name} plan parameters`)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Configure Tier</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
