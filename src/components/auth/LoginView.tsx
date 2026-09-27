import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, ArrowRight, CheckCircle2, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginClient, setCurrentView, addToast } = useApp();

  const [email, setEmail] = useState('jassim@sofanafurniture.qa');
  const [password, setPassword] = useState('scaleup_gulf_demo_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('warning', 'Credentials Required', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginClient(email, password);
      addToast('success', 'Welcome Back', 'Logged into ScaleUp Gulf AI Client Portal.');
    } catch (err: any) {
      addToast('error', 'Login Failed', err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoClient = () => {
    setEmail('jassim@sofanafurniture.qa');
    setPassword('scaleup_gulf_demo_2026');
    addToast('info', 'Demo Credentials Loaded', 'Ready to sign in as Sofana Furniture.');
  };

  return (
    <AuthLayout
      title="Client Portal Sign In"
      subtitle="Access your omnichannel conversations, AI automations, bookings, and customer pipeline"
      badgeText="Business Workspace"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Business Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yourcompany.qa"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setCurrentView('forgot-password')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden transition-colors"
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

        {/* Remember me & Quick demo */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-400">Remember this device</span>
          </label>

          <button
            type="button"
            onClick={fillDemoClient}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2"
          >
            Auto-fill Demo
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* 1-Click Direct Demo Access */}
        <button
          type="button"
          onClick={() => {
            loginClient('jassim@sofanafurniture.qa', 'scaleup_gulf_demo_2026');
          }}
          className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700/60 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>1-Click Instant Workspace Access</span>
        </button>

        {/* Register link */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Don't have a business account?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('register')}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Create an Account
          </button>
        </div>

        {/* Admin Portal Gateway Link */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={() => setCurrentView('admin-login')}
            className="text-[11px] text-slate-500 hover:text-indigo-400 font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Are you a ScaleUp Gulf AI owner/admin? Sign in here</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
