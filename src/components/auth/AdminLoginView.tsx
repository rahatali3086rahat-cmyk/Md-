import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, ArrowRight, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setCurrentView, addToast } = useApp();

  const [email, setEmail] = useState('admin@scaleupgulf.ai');
  const [password, setPassword] = useState('superadmin_master_scaleup_2026');
  const [securityPin, setSecurityPin] = useState('889922');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await loginAdmin(email, password);
      addToast('success', 'Admin Authorized', 'Authenticated into ScaleUp Gulf AI Executive Administration.');
    } catch (err: any) {
      addToast('error', 'Authentication Denied', err?.message || 'Access restricted to authorized admins.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@scaleupgulf.ai');
    setPassword('superadmin_master_scaleup_2026');
    setSecurityPin('889922');
    addToast('info', 'Admin Credentials Loaded', 'Ready to sign in as SaaS Executive Admin.');
  };

  return (
    <AuthLayout
      title="SaaS Executive Administration"
      subtitle="Restricted security portal for ScaleUp Gulf AI platform administrators and system operators"
      badgeText="Tier-1 Security Clearance"
      isAdmin={true}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notice */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-2.5 text-xs text-indigo-300">
          <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            This portal manages all tenant workspaces, subscriptions, system health, and revenue. All activities are logged to the audit ledger.
          </span>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Admin Corporate Email
          </label>
          <div className="relative">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scaleupgulf.ai"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Master Passphrase
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2FA Security Token / PIN */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Hardware / TOTP Security Token
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              placeholder="6-digit TOTP code"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 tracking-widest font-mono focus:border-indigo-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Auto-fill demo credentials button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            Auto-fill Admin Credentials
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Authenticate into Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Return to Client Portal Link */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Not a platform admin?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Return to Client Sign In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
