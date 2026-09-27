import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  DollarSign,
  Package,
  Calendar,
  Edit2,
  Plus,
  UserPlus,
  Clock,
  CheckCircle2,
  X,
  History,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  ExternalLink,
  GitFork,
  CreditCard,
  CalendarCheck,
} from 'lucide-react';
import { LeadStatus } from '../../types';
import { ChannelType } from '../../types/omnichannel';

interface CustomerPanelProps {
  onCloseMobile?: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ onCloseMobile }) => {
  const {
    conversations,
    selectedConversationId,
    updateConversationLead,
    addToast,
    customers,
    setCurrentView,
    setSelectedCustomerId,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const currentConv = conversations.find((c) => c.id === selectedConversationId);

  // Match unified customer record if available
  const matchedCustomer = customers.find(
    (c) =>
      c.id === currentConv?.customerId ||
      c.name.toLowerCase() === currentConv?.customerName.toLowerCase() ||
      (currentConv?.customerPhone && c.phone === currentConv.customerPhone) ||
      (currentConv?.customerEmail && c.email === currentConv.customerEmail)
  );

  // Form states for Edit Lead
  const [editBudget, setEditBudget] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (!currentConv) {
    return (
      <div className="w-80 border-l border-slate-200/80 bg-white p-6 text-center text-slate-400 text-xs hidden xl:flex items-center justify-center">
        No conversation selected
      </div>
    );
  }

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateConversationLead(currentConv.id, { leadStatus: newStatus });
  };

  const openEditModal = () => {
    setEditBudget(currentConv.budget);
    setEditProduct(currentConv.interestedProduct);
    setEditNotes(currentConv.notes || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConversationLead(currentConv.id, {
      budget: editBudget,
      interestedProduct: editProduct,
      notes: editNotes,
    });
    setIsEditModalOpen(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const currentTags = currentConv.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      updateConversationLead(currentConv.id, {
        tags: [...currentTags, newTag.trim()],
      });
      addToast('success', 'Tag added', `Added "${newTag.trim()}"`);
    }
    setNewTag('');
    setIsTagModalOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = currentConv.tags || [];
    updateConversationLead(currentConv.id, {
      tags: currentTags.filter((t) => t !== tagToRemove),
    });
  };

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="w-3 h-3 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3 h-3 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3 h-3 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3 h-3 text-teal-600" />;
      case 'email':
        return <Mail className="w-3 h-3 text-indigo-600" />;
      default:
        return <MessageCircle className="w-3 h-3 text-emerald-600" />;
    }
  };

  const channelsList: ChannelType[] = matchedCustomer?.channels || [
    (currentConv.channel || 'whatsapp') as ChannelType,
  ];

  return (
    <div className="w-full lg:w-80 shrink-0 bg-white border-l border-slate-200/80 flex flex-col h-full overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GitFork className="w-3.5 h-3.5 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Unified Profile
          </h3>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile Overview */}
      <div className="p-4 border-b border-slate-100 text-center shrink-0 bg-slate-50/50">
        <div className="relative inline-block mx-auto mb-2">
          {currentConv.customerAvatar ? (
            <img
              src={currentConv.customerAvatar}
              alt={currentConv.customerName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center font-bold text-lg text-slate-700 mx-auto">
              {currentConv.customerName.charAt(0)}
            </div>
          )}
        </div>

        <h4 className="text-sm font-extrabold text-slate-900">{currentConv.customerName}</h4>
        
        {/* Contact info */}
        <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500 mt-1">
          {currentConv.customerPhone && (
            <div className="flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{currentConv.customerPhone}</span>
            </div>
          )}
          {currentConv.customerEmail && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[180px]">{currentConv.customerEmail}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{currentConv.location}</span>
          </div>
        </div>

        {/* Connected Channels row */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Channels:</span>
          {channelsList.map((ch) => (
            <span
              key={ch}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[10px] font-medium"
              title={`Active on ${ch}`}
            >
              {getChannelIcon(ch)}
              <span className="capitalize">{ch}</span>
            </span>
          ))}
        </div>

        {/* Omnichannel Journey shortcut */}
        {matchedCustomer && (
          <button
            onClick={() => {
              setSelectedCustomerId(matchedCustomer.id);
              setCurrentView('customers');
            }}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View Complete Journey</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-100 bg-white">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Total Spent</span>
            <CreditCard className="w-3 h-3 text-emerald-600" />
          </div>
          <p className="text-xs font-extrabold text-slate-900 mt-1">
            {matchedCustomer?.currency || 'QAR'} {matchedCustomer?.totalSpend?.toLocaleString() || '18,500'}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Bookings</span>
            <CalendarCheck className="w-3 h-3 text-blue-600" />
          </div>
          <p className="text-xs font-extrabold text-slate-900 mt-1">
            {matchedCustomer?.totalBookings || 2} completed
          </p>
        </div>
      </div>

      {/* CRM Details */}
      <div className="p-4 space-y-3.5 text-xs border-b border-slate-100">
        {/* Lead Status Select */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Lifecycle / Pipeline Stage
          </label>
          <select
            value={currentConv.leadStatus}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
            className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="new">New Lead</option>
            <option value="contacted">Contacted / Engaged</option>
            <option value="qualified">Qualified / Hot</option>
            <option value="won">Won / Converted Client</option>
            <option value="lost">Archived / Lost</option>
          </select>
        </div>

        {/* Interested Product */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Interested Offering
            </span>
            <Package className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="font-bold text-slate-900 text-xs">{currentConv.interestedProduct}</p>
        </div>

        {/* Budget */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Budget Range
            </span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="font-bold text-slate-900 text-xs">{currentConv.budget}</p>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Customer Tags
            </span>
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {currentConv.tags?.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-500 ml-0.5"
                  title="Remove tag"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={openEditModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Edit2 className="w-3 h-3 text-slate-500" />
          <span>Edit Lead Information</span>
        </button>
      </div>

      {/* History & Notes Section */}
      <div className="p-4 flex-1 space-y-2.5">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Context & AI Summary</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
          <p>{currentConv.historySummary || 'First interacted via omnichannel campaigns.'}</p>
        </div>

        {currentConv.notes && (
          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
            <p className="font-semibold mb-0.5">Staff Notes:</p>
            <p>{currentConv.notes}</p>
          </div>
        )}
      </div>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Lead"
        subtitle={`Update details for ${currentConv.customerName}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Interested Offering</label>
            <input
              type="text"
              value={editProduct}
              onChange={(e) => setEditProduct(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Estimated Budget</label>
            <input
              type="text"
              value={editBudget}
              onChange={(e) => setEditBudget(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
            <textarea
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Save Details
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Tag Modal */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Add Customer Tag"
        subtitle="Categorize this customer for omnichannel segmentation"
      >
        <form onSubmit={handleAddTag} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tag Name</label>
            <input
              type="text"
              placeholder="e.g. VIP, Luxury Buyer, Fast Close"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              autoFocus
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTagModalOpen(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Add Tag
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
