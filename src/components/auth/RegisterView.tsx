import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { Building2, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { registerClient, setCurrentView, addToast } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [industry, setIndustry] = useState('Luxury Retail & Furniture');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !businessName.trim()) {
      addToast('warning', 'Missing Fields', 'Please fill in Company Name, Email, and Password.');
      return;
    }

    setLoading(true);
    try {
      await registerClient({
        businessName,
        ownerName: ownerName.trim() || businessName.trim(),
        industry,
        email,
        phone: phone || '+974 5512 8844',
        password,
      });
      addToast('success', 'Account Created & Dashboard Ready', `Welcome, ${ownerName || businessName}! Your business workspace is active.`);
      setCurrentView('dashboard');
    } catch (err: any) {
      addToast('error', 'Registration Failed', err?.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    setBusinessName('Prestige Gulf Interiors');
    setOwnerName('Rahat Ali');
    setIndustry('Luxury Retail & Furniture');
    setEmail('rahatali3086rahat@gmail.com');
    setPhone('+974 5512 8844');
    setPassword('scaleup_demo_2026');
    setAgreeTerms(true);
    addToast('info', 'Sample Data Filled', 'Ready to provision your business workspace.');
  };

  return (
    <AuthLayout
      title="Create Your Business Account"
      subtitle="Start automating WhatsApp, Instagram, Messenger, and customer bookings in minutes"
      badgeText="14-Day Free Evaluation"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Company / Showroom Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Al-Mirqab Luxury Interiors"
              className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Fahad Al-Husseini"
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Industry Category
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
            >
              <option value="Luxury Retail & Furniture">Luxury Retail & Furniture</option>
              <option value="Healthcare & Specialized Clinics">Healthcare & Clinics</option>
              <option value="Real Estate & Property">Real Estate & Property</option>
              <option value="Automotive Dealership">Automotive Dealership</option>
              <option value="Hospitality & Dining">Hospitality & Dining</option>
              <option value="Legal & Professional Services">Legal & Professional</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.qa"
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+974 5512 8844"
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Create Master Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-sm border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 leading-tight">
              I agree to Terms & Meta WABA compliance
            </span>
          </label>

          <button
            type="button"
            onClick={fillSampleData}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Auto-fill Sample
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account & Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            registerClient({
              businessName: businessName.trim() || 'Gulf Luxury Living',
              ownerName: ownerName.trim() || 'Rahat Ali',
              industry: industry || 'Luxury Retail & Furniture',
              email: email.trim() || 'rahatali3086rahat@gmail.com',
              phone: phone.trim() || '+974 5512 8844',
              password: password.trim() || 'scaleup_demo_2026',
            });
            addToast('success', 'Workspace Initialized', 'Welcome to your ScaleUp Gulf AI Client Dashboard.');
          }}
          className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700/60 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>1-Click Launch Evaluation Account</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Sign In Here
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
