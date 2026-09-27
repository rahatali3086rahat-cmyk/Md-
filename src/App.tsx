import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Auth Views
import { LoginView } from './components/auth/LoginView';
import { AdminLoginView } from './components/auth/AdminLoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { VerifyEmailView } from './components/auth/VerifyEmailView';

// Admin Shell
import { AdminLayout } from './components/admin/AdminLayout';

// Client Dashboard Views
import { DashboardView } from './components/dashboard/DashboardView';
import { InboxView } from './components/inbox/InboxView';
import { CustomerJourneyView } from './components/customers/CustomerJourneyView';
import { BookingsView } from './components/bookings/BookingsView';
import { ServicesView } from './components/services/ServicesView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { PaymentsView } from './components/payments/PaymentsView';
import { AutomationsView } from './components/automations/AutomationsView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { AIAgentView } from './components/ai-agent/AIAgentView';
import { ProductsView } from './components/products/ProductsView';
import { KnowledgeView } from './components/knowledge/KnowledgeView';
import { LeadsView } from './components/leads/LeadsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';

// Client Settings & Channels
import { ClientSettingsView } from './components/settings/ClientSettingsView';
import { ChannelsView } from './components/settings/ChannelsView';
import { SecurityView } from './components/settings/SecurityView';
import { WhatsAppSettingsView } from './components/settings/WhatsAppSettingsView';
import { BusinessProfileView } from './components/settings/BusinessProfileView';
import { TeamView } from './components/settings/TeamView';
import { BillingView } from './components/settings/BillingView';

const MainContent: React.FC = () => {
  const { currentView, currentUser } = useApp();

  // 1. Authentication Views Routing
  if (currentView === 'login') return <LoginView />;
  if (currentView === 'admin-login') return <AdminLoginView />;
  if (currentView === 'register') return <RegisterView />;
  if (currentView === 'forgot-password') return <ForgotPasswordView />;
  if (currentView === 'reset-password') return <ResetPasswordView />;
  if (currentView === 'verify-email') return <VerifyEmailView />;

  // 2. Unauthenticated check fallback (if user logged out)
  if (!currentUser) {
    if (currentView.startsWith('admin')) {
      return <AdminLoginView />;
    }
    return <LoginView />;
  }

  // 3. Admin Portal Routing (Role-based gate in AdminLayout)
  if (currentView.startsWith('admin')) {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
      </>
    );
  }

  // 4. Client Portal Rendering
  const renderClientView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'inbox':
        return <InboxView />;
      case 'customers':
        return <CustomerJourneyView />;
      case 'bookings':
        return <BookingsView />;
      case 'services':
        return <ServicesView />;
      case 'invoices':
        return <InvoicesView />;
      case 'payments':
        return <PaymentsView />;
      case 'automations':
        return <AutomationsView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'ai-agent':
        return <AIAgentView />;
      case 'products':
        return <ProductsView />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'leads':
        return <LeadsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <ClientSettingsView />;
      case 'channels':
      case 'settings-channels':
        return <ChannelsView />;
      case 'security':
      case 'settings-security':
        return <SecurityView />;
      case 'settings-whatsapp':
        return <WhatsAppSettingsView />;
      case 'settings-business':
        return <BusinessProfileView />;
      case 'settings-team':
        return <TeamView />;
      case 'settings-billing':
        return <BillingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100/60 dark:bg-slate-950 overflow-hidden font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-emerald-100 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors">
      {/* Client Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main
          className={`flex-1 overflow-y-auto ${
            currentView === 'inbox' ? 'p-3 sm:p-4' : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'
          }`}
        >
          <ErrorBoundary key={currentView}>
            {renderClientView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
