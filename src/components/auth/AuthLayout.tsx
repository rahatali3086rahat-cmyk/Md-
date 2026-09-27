import React from 'react';
import { BRAND_CONFIG } from '../../config/branding';
import { ShieldCheck, Sparkles, Bot, Lock, Globe } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  isAdmin?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badgeText,
  isAdmin = false,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300 p-4 sm:p-6 lg:p-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${
              isAdmin
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-indigo-900/30'
                : 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-900/30'
            }`}>
              {BRAND_CONFIG.logoLetter}
            </div>
            <div className="text-left">
              <span className="text-xl font-black tracking-tight text-white block">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 block">
                {isAdmin ? 'SaaS Executive Administration' : 'Enterprise Automation Platform'}
              </span>
            </div>
          </div>

          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 border border-slate-800 text-slate-300 shadow-xs mb-3">
              {isAdmin ? <Lock className="w-3.5 h-3.5 text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1.5">
            {title}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {children}
        </div>

        {/* Security / Partner Footer */}
        <div className="mt-8 text-center flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit TLS Encryption</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gulf Data Sovereignty Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
