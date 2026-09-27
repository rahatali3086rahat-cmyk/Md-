import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BehaviorToggles } from './BehaviorToggles';
import { AITestPlayground } from './AITestPlayground';
import { Bot, Sparkles, Check, Save, Loader2 } from 'lucide-react';

export const AIAgentView: React.FC = () => {
  const { aiConfig, updateAISettings } = useApp();

  const [agentName, setAgentName] = useState(aiConfig?.agentName || 'WhatsAI Assistant');
  const [businessRole, setBusinessRole] = useState(aiConfig?.businessRole || 'Sales & Customer Support');
  const [languages, setLanguages] = useState<string[]>(
    aiConfig?.languages || ['English', 'Arabic', 'Bengali']
  );
  const [tone, setTone] = useState<'Friendly' | 'Professional' | 'Concise'>(
    aiConfig?.tone || 'Friendly'
  );
  const [primaryGoal, setPrimaryGoal] = useState(aiConfig?.primaryGoal || 'Generate Leads');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>(
    aiConfig?.secondaryGoals || ['Answer Questions', 'Recommend Products', 'Book Appointments', 'Transfer to Human']
  );

  useEffect(() => {
    if (aiConfig) {
      setAgentName(aiConfig.agentName || 'WhatsAI Assistant');
      setBusinessRole(aiConfig.businessRole || 'Sales & Customer Support');
      if (aiConfig.languages && aiConfig.languages.length > 0) {
        setLanguages(aiConfig.languages);
      }
      if (aiConfig.tone) {
        setTone(aiConfig.tone);
      }
      if (aiConfig.primaryGoal) {
        setPrimaryGoal(aiConfig.primaryGoal);
      }
      if (aiConfig.secondaryGoals && aiConfig.secondaryGoals.length > 0) {
        setSecondaryGoals(aiConfig.secondaryGoals);
      }
    }
  }, [aiConfig]);

  if (!aiConfig) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading AI Agent Configuration...</p>
      </div>
    );
  }

  const availableLanguages = ['English', 'Arabic', 'Bengali', 'Hindi', 'Urdu', 'French'];
  const allSecondaryGoals = [
    'Answer Questions',
    'Recommend Products',
    'Book Appointments',
    'Transfer to Human',
    'Check Order Status',
    'Collect Reviews',
  ];

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const toggleSecondaryGoal = (goal: string) => {
    if (secondaryGoals.includes(goal)) {
      setSecondaryGoals(secondaryGoals.filter((g) => g !== goal));
    } else {
      setSecondaryGoals([...secondaryGoals, goal]);
    }
  };

  const handleSaveConfig = () => {
    updateAISettings({
      agentName,
      businessRole,
      languages,
      tone,
      primaryGoal,
      secondaryGoals,
    });
  };

  const toggleActiveStatus = () => {
    updateAISettings({ isActive: !aiConfig.isActive });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Active Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                AI Agent Configuration
              </h2>
              <button
                onClick={toggleActiveStatus}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  aiConfig.isActive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    aiConfig.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{aiConfig.isActive ? 'Active' : 'Paused'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the personality, target objectives, and knowledge grounding of your automated agent.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveConfig}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Grid: Left Configuration & Right Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: General Profile, Languages, Tone, Goals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agent Persona Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Agent Identity & Role</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                  placeholder="e.g. WhatsAI Assistant"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Role
                </label>
                <input
                  type="text"
                  value={businessRole}
                  onChange={(e) => setBusinessRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Sales & Customer Support"
                />
              </div>
            </div>

            {/* Language Multi-Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Supported Languages (Multi-select)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((lang) => {
                  const isSelected = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Communication Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Friendly', 'Professional', 'Concise'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      tone === t
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-1 ring-emerald-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary & Secondary Goals */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Goal
                </label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Generate Leads">Generate Leads & Qualify Buyers</option>
                  <option value="Customer Support">Answer FAQs & Instant Support</option>
                  <option value="Product Sales">Direct Product Recommendations & Catalog Sales</option>
                  <option value="Book Appointments">Schedule Showroom Visits & Consultations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Secondary Goals
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSecondaryGoals.map((goal) => {
                    const isSelected = secondaryGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleSecondaryGoal(goal)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>{goal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Settings Component */}
          <BehaviorToggles />
        </div>

        {/* Right Side: AI Test Playground */}
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <AITestPlayground />
          </div>
        </div>
      </div>
    </div>
  );
};
