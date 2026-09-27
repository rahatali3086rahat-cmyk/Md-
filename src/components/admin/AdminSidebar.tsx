import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../config/branding';
import {
  LayoutDashboard,
  Building2,
  WalletCards,
  CreditCard,
  Layers,
  TrendingUp,
  Gauge,
  ScrollText,
  Activity,
  LifeBuoy,
  Settings,
  Shield,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { NavView } from '../../types';

export const AdminSidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    saasClients,
    saasHealthServices,
  } = useApp();

  const warningServicesCount = saasHealthServices.filter((s) => s.status !== 'operational').length;

  const adminNavItems: { id: NavView; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-clients', label: 'Clients', icon: Building2, badge: saasClients.length, badgeColor: 'bg-indigo-600' },
    { id: 'admin-subscriptions', label: 'Subscriptions', icon: WalletCards },
    { id: 'admin-payments', label: 'Payments', icon: CreditCard },
    { id: 'admin-plans', label: 'Plans & Pricing', icon: Layers },
    { id: 'admin-revenue', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'admin-usage', label: 'Tenant Usage', icon: Gauge },
    { id: 'admin-logs', label: 'System Logs', icon: ScrollText },
    { id: 'admin-automation-health', label: 'Automation Health', icon: Activity, badge: warningServicesCount > 0 ? warningServicesCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'admin-support', label: 'Support & Tickets', icon: LifeBuoy },
    { id: 'admin-settings', label: 'Admin Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: NavView) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-950/50 shrink-0">
                {BRAND_CONFIG.logoLetter}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-black text-white tracking-tight block truncate">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-indigo-400 block truncate">
                  Admin Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Security Clearance Chip */}
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-900/60 flex items-center justify-between text-[11px] text-indigo-300">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-semibold">SaaS Owner Root</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            ScaleUp Management
          </p>
          <nav className="space-y-0.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'admin-overview' && currentView === 'admin');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white shadow-xs shrink-0 ${
                        item.badgeColor || 'bg-indigo-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Client Portal */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </aside>
    </>
  );
};
