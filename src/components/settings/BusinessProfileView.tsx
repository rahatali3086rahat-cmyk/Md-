import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Save, MapPin, Clock, Globe } from 'lucide-react';

export const BusinessProfileView: React.FC = () => {
  const { currentBusiness, updateBusinessProfile } = useApp();

  const [name, setName] = useState(currentBusiness?.name || 'Sofana Furniture');
  const [industry, setIndustry] = useState(currentBusiness?.industry || 'Furniture & Home Decor');
  const [country, setCountry] = useState(currentBusiness?.country || 'Qatar');
  const [currency, setCurrency] = useState(currentBusiness?.currency || 'QAR');
  const [timezone, setTimezone] = useState(currentBusiness?.timezone || 'Asia/Qatar (GMT+3)');
  const [workingHours, setWorkingHours] = useState(
    currentBusiness?.workingHours || 'Sunday to Thursday, 9:00 AM - 10:00 PM'
  );
  const [address, setAddress] = useState(currentBusiness?.address || 'Salwa Road, Doha, Qatar');
  const [email, setEmail] = useState(currentBusiness?.email || 'contact@sofanadesign.com');
  const [phone, setPhone] = useState(currentBusiness?.phone || '+974 5512 8844');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      industry,
      country,
      currency,
      timezone,
      workingHours,
      address,
      email,
      phone,
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Business Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Company metadata shared with AI agent for context-aware customer greetings.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Business Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Industry Vertical</label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Country / Market</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Primary Currency</label>
            <input
              type="text"
              required
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Timezone</label>
            <input
              type="text"
              required
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Official WhatsApp Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Support Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Store / Showroom Working Hours (AI Context)
          </label>
          <input
            type="text"
            required
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Showroom Physical Address
          </label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>
      </form>
    </div>
  );
};
