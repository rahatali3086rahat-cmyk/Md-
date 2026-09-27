import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Bot, MessageSquare, BookOpen, Smartphone } from 'lucide-react';

interface QuickActionsProps {
  onAddProductClick: () => void;
  onAddKnowledgeClick: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddProductClick,
  onAddKnowledgeClick,
}) => {
  const { setCurrentView } = useApp();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
      <button
        onClick={onAddProductClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition-colors whitespace-nowrap"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Product
      </button>

      <button
        onClick={() => setCurrentView('ai-agent')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-xs transition-colors whitespace-nowrap"
      >
        <Bot className="w-3.5 h-3.5 text-emerald-600" />
        Configure AI
      </button>

      <button
        onClick={() => setCurrentView('inbox')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-xs transition-colors whitespace-nowrap"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
        View Inbox
      </button>

      <button
        onClick={onAddKnowledgeClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-xs transition-colors whitespace-nowrap"
      >
        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
        Add Knowledge
      </button>

      <button
        onClick={() => setCurrentView('settings-whatsapp')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-xs transition-colors whitespace-nowrap"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        Connect WhatsApp
      </button>
    </div>
  );
};
