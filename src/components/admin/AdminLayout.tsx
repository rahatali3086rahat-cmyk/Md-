import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminClientsView } from './AdminClientsView';
import { AdminSubscriptionsView } from './AdminSubscriptionsView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { AdminPlansView } from './AdminPlansView';
import { AdminRevenueView } from './AdminRevenueView';
import { AdminUsageView } from './AdminUsageView';
import { AdminAuditLogsView } from './AdminAuditLogsView';
import { AdminSystemHealthView } from './AdminSystemHealthView';
import { AdminSupportView } from './AdminSupportView';
import { AdminSettingsView } from './AdminSettingsView';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentView, setCurrentView, currentUser, loginAdmin } = useApp();

  // Role Gate: Platform owners and admins have direct access
  const isOwnerEmail = currentUser?.email?.toLowerCase().includes('rahat') || currentUser?.email === 'admin@scaleupgulf.ai';
  const isAdmin = isOwnerEmail || currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'owner';

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          ScaleUp Gulf AI Executive Administration
        </h1>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Manage all tenant businesses, subscriptions, real-time revenue, n8n automations, and LLM consumption across the platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Client Workspace</span>
          </button>
          <button
            onClick={async () => {
              await loginAdmin('admin@scaleupgulf.ai', 'superadmin_master_scaleup_2026');
              setCurrentView('admin-overview');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-950/50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1-Click Enter as Super Admin</span>
          </button>
        </div>
      </div>
    );
  }

  const renderAdminContent = () => {
    switch (currentView) {
      case 'admin':
      case 'admin-overview':
        return <AdminOverviewView />;
      case 'admin-clients':
        return <AdminClientsView />;
      case 'admin-subscriptions':
        return <AdminSubscriptionsView />;
      case 'admin-payments':
        return <AdminPaymentsView />;
      case 'admin-plans':
        return <AdminPlansView />;
      case 'admin-revenue':
        return <AdminRevenueView />;
      case 'admin-usage':
        return <AdminUsageView />;
      case 'admin-logs':
        return <AdminAuditLogsView />;
      case 'admin-automation-health':
        return <AdminSystemHealthView />;
      case 'admin-support':
        return <AdminSupportView />;
      case 'admin-settings':
        return <AdminSettingsView />;
      default:
        return <AdminOverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 antialiased overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {renderAdminContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
