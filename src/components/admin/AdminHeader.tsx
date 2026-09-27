import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Activity,
  Shield,
  Sun,
  Moon,
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  User,
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const {
    setIsMobileMenuOpen,
    theme,
    toggleTheme,
    currentUser,
    logout,
    setCurrentView,
    saasHealthServices,
    saasClients,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const healthyServices = saasHealthServices.filter((s) => s.status === 'operational').length;
  const totalServices = saasHealthServices.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminNotifications = [
    { id: '1', title: 'New Client Onboarded', time: '12m ago', desc: 'Pearl Bay Dining started 14-day evaluation', type: 'info' },
    { id: '2', title: 'Webhook Execution Peak', time: '35m ago', desc: 'n8n handled 1,420 automation runs successfully', type: 'success' },
    { id: '3', title: 'Payment Auto-Renewal', time: '2h ago', desc: 'Sofana Furniture Doha processed $1,250', type: 'success' },
    { id: '4', title: 'Subscription Attention', time: '1d ago', desc: 'Apex Gulf Real Estate payment card expired', type: 'warning' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 uppercase text-[10px] tracking-wider">
            SaaS Owner Control
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-medium">ScaleUp Gulf AI Global Core</span>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients, subscriptions, invoice IDs, or audit logs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/80 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Right: Health Ticker, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Switch to Client Workspace */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
          title="Return to Client Workspace / Dashboard"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Client Workspace</span>
        </button>

        {/* System Health Ticker */}
        <button
          onClick={() => setCurrentView('admin-automation-health')}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 text-xs font-semibold cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Services {healthyServices}/{totalServices} Operational</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">SaaS Admin Notifications</span>
                <span className="text-[10px] text-indigo-400 font-semibold">4 New</span>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {adminNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800/60 text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-white mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          title="Toggle light / dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {currentUser?.name || 'SaaS Executive Admin'}
              </span>
              <span className="text-[10px] text-indigo-400 font-medium block">
                Superadmin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <span className="text-xs font-bold text-white block">
                  {currentUser?.email || 'admin@scaleupgulf.ai'}
                </span>
                <span className="text-[10px] text-slate-400 block">Root System Role</span>
              </div>

              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-semibold cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Switch to Client Portal</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('admin-settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-semibold cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Global Platform Settings</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
