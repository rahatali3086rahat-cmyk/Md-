import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessProfileView } from './BusinessProfileView';
import { ChannelsView } from './ChannelsView';
import { WhatsAppSettingsView } from './WhatsAppSettingsView';
import { TeamView } from './TeamView';
import { BillingView } from './BillingView';
import { SecurityView } from './SecurityView';
import {
  Building2,
  Share2,
  Bot,
  Users,
  CreditCard,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export const ClientSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'channels' | 'whatsapp' | 'team' | 'billing' | 'security'
  >('profile');

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'channels', label: 'Omnichannel Setup', icon: Share2 },
    { id: 'whatsapp', label: 'WhatsApp Cloud API', icon: Globe },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Workspace Settings & Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your business profile, Meta WhatsApp credentials, team permissions, and SaaS subscription
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'profile' && <BusinessProfileView />}
        {activeTab === 'channels' && <ChannelsView />}
        {activeTab === 'whatsapp' && <WhatsAppSettingsView />}
        {activeTab === 'team' && <TeamView />}
        {activeTab === 'billing' && <BillingView />}
        {activeTab === 'security' && <SecurityView />}
      </div>
    </div>
  );
};
