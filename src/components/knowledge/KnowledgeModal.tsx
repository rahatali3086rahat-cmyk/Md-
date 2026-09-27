import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { KnowledgeItem } from '../../types';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: KnowledgeItem | null;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
}) => {
  const { addKnowledgeItem, updateKnowledgeItem } = useApp();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Delivery');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (itemToEdit) {
      setQuestion(itemToEdit.question);
      setAnswer(itemToEdit.answer);
      setCategory(itemToEdit.category);
      setIsActive(itemToEdit.isActive);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('Delivery');
      setIsActive(true);
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (itemToEdit) {
      updateKnowledgeItem(itemToEdit.id, {
        question,
        answer,
        category,
        isActive,
      });
    } else {
      addKnowledgeItem({
        question,
        answer,
        category,
        isActive,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}
      subtitle="Define accurate business information, FAQs, and store policies for WhatsApp AI"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Question / Topic Heading
          </label>
          <input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are your delivery fees and delivery windows?"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="Delivery">Delivery & Shipping</option>
            <option value="Store Policies">Store Policies & Returns</option>
            <option value="Showroom">Showroom & Working Hours</option>
            <option value="Warranty">Warranty & Guarantees</option>
            <option value="Payment">Payment Methods & Installments</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Detailed Verified Answer (AI Reference)
          </label>
          <textarea
            rows={5}
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write clear, unambiguous instructions. The AI will adhere strictly to this text without guessing."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span className="text-xs font-semibold text-slate-800">
              Active (AI automatically uses this entry in WhatsApp replies)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            {itemToEdit ? 'Save Changes' : 'Add Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
