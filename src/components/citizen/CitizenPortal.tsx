import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { CitizenHome } from './CitizenHome';
import { CitizenAlerts } from './CitizenAlerts';
import { CitizenSOSTracker } from './CitizenSOSTracker';
import { CitizenSOSModal } from './CitizenSOSModal';
import { CitizenShelterFinder } from './CitizenShelterFinder';
import { CitizenSafeRoute } from './CitizenSafeRoute';
import { CitizenReportHazard } from './CitizenReportHazard';
import { CitizenReportStatus } from './CitizenReportStatus';
import { CitizenEmergencyHelp } from './CitizenEmergencyHelp';
import { 
  Home, 
  Bell, 
  Radio, 
  Building2, 
  Route, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  Shield, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const { 
    activeViewMode, 
    setActiveViewMode, 
    getSelectedSettlement, 
    language, 
    setLanguage, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('citizen-home');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);

  const settlement = getSelectedSettlement();

  const navTabs = [
    { id: 'citizen-home', label: t('citizenNavHome'), icon: Home },
    { id: 'citizen-alerts', label: t('citizenNavAlerts'), icon: Bell, badge: '3' },
    { id: 'citizen-sos', label: t('citizenNavSOS'), icon: Radio, highlight: true },
    { id: 'citizen-shelters', label: t('citizenNavShelters'), icon: Building2 },
    { id: 'citizen-routes', label: t('citizenNavRoutes'), icon: Route },
    { id: 'citizen-report', label: t('citizenNavReport'), icon: FileText },
    { id: 'citizen-status', label: t('citizenNavStatus'), icon: CheckCircle2 },
    { id: 'citizen-help', label: t('citizenNavHelp'), icon: PhoneCall }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'citizen-home':
        return (
          <CitizenHome
            onOpenSOS={() => setIsSOSModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'citizen-alerts':
        return (
          <CitizenAlerts
            onNavigateToShelters={() => setActiveTab('citizen-shelters')}
            onNavigateToRoutes={() => setActiveTab('citizen-routes')}
          />
        );
      case 'citizen-sos':
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 border border-red-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase">
                  CITIZEN RESCUE LIFELINE
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Emergency Distress Beacon & Unit Tracker
                </h2>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Transmit New SOS</span>
              </button>
            </div>
            <CitizenSOSTracker onNewSOS={() => setIsSOSModalOpen(true)} />
          </div>
        );
      case 'citizen-shelters':
        return <CitizenShelterFinder />;
      case 'citizen-routes':
        return <CitizenSafeRoute />;
      case 'citizen-report':
        return (
          <CitizenReportHazard
            onReportSuccess={() => setActiveTab('citizen-status')}
          />
        );
      case 'citizen-status':
        return (
          <CitizenReportStatus
            onNewReport={() => setActiveTab('citizen-report')}
            onNewSOS={() => setIsSOSModalOpen(true)}
          />
        );
      case 'citizen-help':
        return (
          <CitizenEmergencyHelp
            onOpenSOS={() => setIsSOSModalOpen(true)}
          />
        );
      default:
        return (
          <CitizenHome
            onOpenSOS={() => setIsSOSModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Citizen Top App Bar */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent font-mono">
                  RAKSHA CITIZEN
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-800 uppercase">
                  PUBLIC SAFETY
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                {settlement.name} Emergency Portal
              </span>
            </div>
          </div>

          {/* Right Controls: SOS button, Language Switcher & Officer Mode Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick 1-Tap SOS Button */}
            <button
              onClick={() => setIsSOSModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 animate-pulse transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {(['en', 'ta', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[11px] font-bold rounded uppercase transition-colors ${
                    language === lang
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Switch to Officer Mode */}
            <button
              onClick={() => setActiveViewMode('OFFICER')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Switch to DDMA Officer Command Portal"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline">Officer Portal</span>
            </button>
          </div>
        </div>

        {/* Citizen Sub-Navigation Bar */}
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : tab.highlight
                    ? 'bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : tab.highlight ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="text-[9px] font-mono px-1.5 rounded-full bg-red-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto pb-16">
        {renderActiveTabContent()}
      </main>

      {/* Interactive Citizen SOS Trigger Modal */}
      <CitizenSOSModal
        isOpen={isSOSModalOpen}
        onClose={() => {
          setIsSOSModalOpen(false);
          setActiveTab('citizen-status');
        }}
      />
    </div>
  );
};
