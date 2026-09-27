import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Plus,
  Clock,
  DollarSign,
  Tag,
  CheckCircle2,
  Trash2,
  Edit,
  Sparkles,
  Search,
} from 'lucide-react';
import { ServiceItem, GlobalCurrency } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

export const ServicesView: React.FC = () => {
  const { servicesList, createService, updateService, deleteService, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(350);
  const [currency, setCurrency] = useState('QAR');
  const [category, setCategory] = useState('Consultation');

  const filteredServices = servicesList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(60);
    setPrice(350);
    setCurrency('QAR');
    setCategory('Consultation');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description);
    setDurationMinutes(s.durationMinutes);
    setPrice(s.price);
    setCurrency(s.currency);
    setCategory(s.category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await updateService(editingService.id, {
        name,
        description,
        durationMinutes,
        price,
        currency: currency as GlobalCurrency,
        category,
      });
    } else {
      await createService({
        businessId: 'biz-sofana',
        name,
        description,
        durationMinutes,
        price,
        currency: currency as GlobalCurrency,
        category,
        isActive: true,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete service "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Services & Appointment Catalog
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Configure bookable consultations, appointments, and custom sessions that your AI agent can propose and schedule directly during conversations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search service offerings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                  {srv.category}
                </span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {srv.currency} {srv.price.toLocaleString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{srv.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                {srv.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{srv.durationMinutes} mins</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  title="Edit Service"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add Service Offering'}
        subtitle="Services will be automatically bookable across chat channels"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Service Title</label>
            <input
              type="text"
              required
              placeholder="e.g. VIP Interior Consultation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Min)</label>
              <input
                type="number"
                required
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Price</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              >
                <option value="QAR">QAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BDT">BDT</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Styling, Consultation, Fitting"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="What this service covers and what customers should prepare..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
