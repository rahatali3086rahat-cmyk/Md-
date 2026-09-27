import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ChevronUp, ShieldCheck, Sparkles } from 'lucide-react';
import { AIAgentConfig } from '../../types';

export const BehaviorToggles: React.FC = () => {
  const { aiConfig, updateAISettings } = useApp();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [advancedText, setAdvancedText] = useState(
    aiConfig?.advancedInstructions ||
      `You are the AI sales assistant for our business.
Always use verified business information.
Never make up prices, stock, delivery times, or policies.`
  );

  if (!aiConfig) return null;

  const toggleSetting = (key: keyof AIAgentConfig) => {
    const currentVal = !!aiConfig[key];
    updateAISettings({ [key]: !currentVal });
  };

  const handleSaveAdvanced = () => {
    updateAISettings({ advancedInstructions: advancedText });
  };

  const settingsItems = [
    {
      key: 'autoReply' as keyof AIAgentConfig,
      label: 'AI automatically replies',
      desc: 'Bot answers incoming customer messages without delay',
    },
    {
      key: 'useProducts' as keyof AIAgentConfig,
      label: 'Use product information',
      desc: 'Reads real-time pricing, stock, and specs from catalog',
    },
    {
      key: 'useKnowledge' as keyof AIAgentConfig,
      label: 'Use knowledge base',
      desc: 'References FAQs, shipping, delivery policies and hours',
    },
    {
      key: 'captureLeads' as keyof AIAgentConfig,
      label: 'Capture leads',
      desc: 'Detects budget, timeline, and customer contact intent',
    },
    {
      key: 'humanHandoff' as keyof AIAgentConfig,
      label: 'Human handoff',
      desc: 'Transfers chat to live agent upon customer request',
    },
    {
      key: 'neverInventPrices' as keyof AIAgentConfig,
      label: 'Never invent prices',
      desc: 'Strict guardrail against hallucinating pricing or discounts',
    },
    {
      key: 'neverInventStock' as keyof AIAgentConfig,
      label: 'Never invent stock',
      desc: 'Prevents confirming availability if inventory is 0',
    },
    {
      key: 'requireHumanApproval' as keyof AIAgentConfig,
      label: 'Require human approval for sensitive actions',
      desc: 'Requests team confirmation for custom quotes or refunds',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">AI Behavior & Guardrails</h3>
        </div>
        <p className="text-xs text-slate-500">
          Enforce enterprise constraints, factual grounding, and automated handoffs.
        </p>
      </div>

      {/* Grid of 8 Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item) => {
          const isEnabled = !!aiConfig[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleSetting(item.key)}
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white flex items-start justify-between gap-3 cursor-pointer transition-all"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Expandable Advanced Instructions */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">
              Advanced System Instructions & Context Prompt
            </span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="p-4 bg-white space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              These instructions dictate how the AI model conducts itself across all WhatsApp customer chats.
            </p>
            <textarea
              rows={5}
              value={advancedText}
              onChange={(e) => setAdvancedText(e.target.value)}
              placeholder="You are the AI sales assistant for our business..."
              className="w-full p-3 text-xs font-mono bg-slate-50 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden transition-all"
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                {advancedText.length} characters
              </span>
              <button
                type="button"
                onClick={handleSaveAdvanced}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Save Prompt Instructions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
