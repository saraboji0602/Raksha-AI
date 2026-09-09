import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { EmergencyBanner } from './EmergencyBanner';
import { GuidedTourBanner } from '../common/GuidedTourBanner';
import { ToastContainer } from '../common/ToastContainer';
import { DecisionTraceModal } from './DecisionTraceModal';
import { AIChatDrawer } from '../aiAssistant/AIChatDrawer';
import { OnboardingModal } from '../onboarding/OnboardingModal';

// Pages
import { OverviewPage } from '../../pages/OverviewPage';
import { RiskIntelligencePage } from '../../pages/RiskIntelligencePage';
import { SettlementsPage } from '../../pages/SettlementsPage';
import { SettlementDetailPage } from '../../pages/SettlementDetailPage';
import { InterventionPage } from '../../pages/InterventionPage';
import { SafeSitesPage } from '../../pages/SafeSitesPage';
import { RelocationPlannerPage } from '../../pages/RelocationPlannerPage';
import { SimulatorPage } from '../../pages/SimulatorPage';
import { FieldVerificationPage } from '../../pages/FieldVerificationPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { AlertsPage } from '../../pages/AlertsPage';
import { DataSourcesPage } from '../../pages/DataSourcesPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { HelpPage } from '../../pages/HelpPage';

export const AppShell: React.FC = () => {
  const { currentPage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OverviewPage />;
      case 'risk':
        return <RiskIntelligencePage />;
      case 'settlements':
        return <SettlementsPage />;
      case 'settlement-detail':
        return <SettlementDetailPage />;
      case 'intervention':
        return <InterventionPage />;
      case 'safe-sites':
        return <SafeSitesPage />;
      case 'relocation':
        return <RelocationPlannerPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'field-verification':
        return <FieldVerificationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'data':
        return <DataSourcesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal Floating Notification Toasts */}
      <ToastContainer />

      {/* Emergency Alert Banner (when active) */}
      <EmergencyBanner />

      {/* Top Guided Hackathon Tour Banner (when active) */}
      <GuidedTourBanner />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto pb-16">
            {renderCurrentPage()}
          </main>

          {/* Footer Disclaimer */}
          <footer className="py-3 px-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-950 select-none">
            <div>
              RAKSHA-AI Decision Support Prototype • Synthetic Demonstration Data • DDMA / SDMA Decision-Engine
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="hover:text-cyan-400 text-slate-400 font-semibold transition-colors"
              >
                Onboarding Tour
              </button>
              <span>•</span>
              <span className="font-mono text-cyan-400/80">Smart India Hackathon 2026</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Universal Decision Trace Modal */}
      <DecisionTraceModal />

      {/* First-time Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Bottom-Right AI Assistant Chat Drawer */}
      <AIChatDrawer />
    </div>
  );
};
