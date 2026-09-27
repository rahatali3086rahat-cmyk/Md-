import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KnowledgeModal } from './KnowledgeModal';
import { EmptyState } from '../common/EmptyState';
import { Badge } from '../common/Badge';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { KnowledgeItem } from '../../types';

export const KnowledgeView: React.FC = () => {
  const { knowledgeItems, deleteKnowledgeItem, updateKnowledgeItem } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const categories = ['All', 'Delivery', 'Store Policies', 'Showroom', 'Warranty', 'Payment'];

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleToggleActive = (item: KnowledgeItem) => {
    updateKnowledgeItem(item.id, { isActive: !item.isActive });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Knowledge Base & Verified Policies
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The factual ground-truth used by the AI agent to answer WhatsApp customer questions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Entry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs, policies, warranty rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No knowledge entries found"
          description="No knowledge entries have been added. Add your first policy or FAQ so the AI can answer customer questions accurately."
          actionLabel="Add Knowledge"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        item.isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Draft'}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-start gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item.question}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {item.answer}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Grounded for WhatsApp AI replies
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteKnowledgeItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <KnowledgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={selectedItem}
      />
    </div>
  );
};
