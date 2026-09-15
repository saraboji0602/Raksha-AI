import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  Shield, 
  Search, 
  Bell, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  Globe, 
  AlertTriangle,
  Layers,
  MapPin,
  Building2,
  ChevronDown,
  Activity,
  PhoneCall
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TopBar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    searchTerm,
    setSearchTerm,
    settlements,
    safeSites,
    selectedSettlementId,
    setSelectedSettlementId,
    setSelectedSafeSiteId,
    setCurrentPage,
    alerts,
    activeViewMode,
    setActiveViewMode,
    incidents,
    emergencyMode,
    setEmergencyMode,
    language,
    setLanguage,
    t,
    startDemoTour,
    kadalpuramSimulationMode,
    toggleRisingRiverSimulation,
    setIsAIChatOpen,
    currentUser,
    filterDistrict,
    setFilterDistrict,
    addToast,
    setIsDecisionBriefOpen,
    resetToDemoBaseline
  } = useApp();


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const unreadAlerts = alerts.filter(a => !a.read);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchTerm.trim() === '' ? [] : [
    ...settlements
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.district.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(s => ({
        type: 'SETTLEMENT',
        id: s.id,
        title: s.name,
        subtitle: `${s.district} • Risk ${s.overallRisk}/100 • Pop: ${s.population.toLocaleString()}`,
        badge: s.aiRecommendation
      })),
    ...safeSites
      .filter(st => st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.district.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(st => ({
        type: 'SAFE_SITE',
        id: st.id,
        title: st.name,
        subtitle: `${st.district} • Safety ${st.hazardSafetyScore}/100 • Cap: ${st.capacity.recommendedMaxCapacity.toLocaleString()}`,
        badge: 'SAFE_HAVEN'
      }))
  ].slice(0, 6);

  const handleSelectResult = (result: { type: string; id: string }) => {
    if (result.type === 'SETTLEMENT') {
      setSelectedSettlementId(result.id);
      setCurrentPage('settlement-detail');
      addToast({
        type: 'info',
        title: 'Settlement Selected',
        description: `Navigating to Digital Twin.`
      });
    } else {
      setSelectedSafeSiteId(result.id);
      setCurrentPage('safe-sites');
    }
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 text-slate-100 sticky top-0 z-30 backdrop-blur-md">
      {/* Top Banner: Product Pipeline Ribbon */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1 bg-slate-950 border-b border-slate-800/80 text-[10px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">PIPELINE:</span>
          <span className="text-slate-300">
            DETECT <span className="text-cyan-500">→</span> UNDERSTAND <span className="text-cyan-500">→</span> WARN <span className="text-cyan-500">→</span> ACT <span className="text-cyan-500">→</span> VERIFY <span className="text-cyan-500">→</span> RESPOND <span className="text-cyan-500">→</span> RECOVER <span className="text-cyan-500">→</span> RELOCATE <span className="text-cyan-500">→</span> PREVENT
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Deterministic Engine: <strong className="text-white">Active</strong></span>
          </span>
          <span>•</span>
          <span>Data: <strong className="text-cyan-400">Synthetic Sensor Feed</strong></span>
          <span>•</span>
          <span className="text-slate-400">
            "Understand the risk. Prioritize the people. Find the safer option. Act with evidence."
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 gap-2 sm:gap-4">
        {/* Left Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            title="Toggle Sidebar"
          >
            <Layers className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.5]" />
              <MapPin className="w-2.5 h-2.5 absolute top-1.5 right-1.5 text-slate-950 fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent font-mono">
                  RAKSHA-AI
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-700/50 uppercase">
                  DEMO / SYNTHETIC DATA
                </span>
              </div>
              <span className="hidden md:inline-block text-[10px] text-slate-400 font-medium tracking-tight">
                From Hazard Detection to Safe Relocation Decisions
              </span>
            </div>
          </div>
        </div>

        {/* Habitation Selector Quick Switcher */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-semibold">Active Settlement:</span>
          <select
            value={selectedSettlementId}
            onChange={(e) => {
              setSelectedSettlementId(e.target.value);
              addToast({
                type: 'info',
                title: 'Settlement Switched',
                description: `Digital Twin focused on ${e.target.options[e.target.selectedIndex].text.split(' (')[0]}.`
              });
            }}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
          >
            {settlements.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.name} ({s.overallRisk}/100)
              </option>
            ))}
          </select>
        </div>

        {/* Global Search Bar with Autocomplete Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search habitations (e.g. Kadalpuram), candidate havens..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-cyan-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Autocomplete Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>QUICK RESULTS</span>
                <span>Press to open</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectResult(res)}
                    className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {res.type === 'SETTLEMENT' ? (
                        <Building2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">{res.title}</div>
                        <div className="text-[10px] text-slate-400">{res.subtitle}</div>
                      </div>
                    </div>
                    <Badge size="sm" variant="intervention" level={res.badge} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Switcher: Officer vs Citizen Portal */}
          <button
            onClick={() => {
              const nextMode = activeViewMode === 'OFFICER' ? 'CITIZEN' : 'OFFICER';
              setActiveViewMode(nextMode);
              addToast({
                type: 'info',
                title: nextMode === 'CITIZEN' ? 'Citizen Safety Portal Active' : 'Officer Command Center Active',
                description: nextMode === 'CITIZEN' ? 'Citizen view for public alerts, SOS beacons, shelters, and routes.' : 'Official DDMA command operations center.'
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 font-black text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            title="Toggle between Officer Command Portal & Citizen Safety View"
          >
            <span>{activeViewMode === 'OFFICER' ? '📱' : '🏛️'}</span>
            <span className="hidden sm:inline">
              {activeViewMode === 'OFFICER' ? 'Citizen Safety View' : 'Officer Command Portal'}
            </span>
          </button>

          {/* Quick Officer Emergency Center Shortcut */}
          {activeViewMode === 'OFFICER' && (
            <button
              onClick={() => setCurrentPage('emergency-center')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/80 text-xs font-bold transition-all"
              title="Open Officer Emergency Center"
            >
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Emergency Center</span>
              {incidents.filter(i => i.status !== 'RESOLVED').length > 0 && (
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-black">
                  {incidents.filter(i => i.status !== 'RESOLVED').length}
                </span>
              )}
            </button>
          )}

          {/* Simulate Rising River Demo Switch */}
          <button
            onClick={toggleRisingRiverSimulation}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-md ${
              kadalpuramSimulationMode === 'RISING_RIVER_SURGE'
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-cyan-300 border-slate-700'
            }`}
            title="Simulate river rise & dynamic red-zone expansion (Risk 72 ⇄ 91)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
            <span>
              {kadalpuramSimulationMode === 'RISING_RIVER_SURGE' ? 'Surge: 91 Risk' : 'Simulate Surge: 72→91'}
            </span>
          </button>

          {/* Decision Brief Modal Trigger */}
          <button
            onClick={() => setIsDecisionBriefOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/40 shadow-md transition-all active:scale-95"
            title="Open Judge-Ready Executive Disaster Decision Dossier"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('decisionBriefBtn') || 'Decision Brief'}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              resetToDemoBaseline();
              addToast({
                type: 'success',
                title: 'Demo Reset to Baseline',
                description: 'Kadalpuram restored to Risk 72/100 baseline state.'
              });
            }}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            title="Reset simulation, conflicts, and state to clean demo baseline"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('resetDemoBtn') || 'Reset Demo'}</span>
          </button>

          {/* Quick Demo Tour Launch */}
          <button
            onClick={startDemoTour}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            title="Launch 4-Minute Hackathon Demo Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>4-Min Demo Tour</span>
          </button>

          {/* Emergency Operations Mode Switch */}
          <button
            onClick={() => {
              const next = !emergencyMode;
              setEmergencyMode(next);
              addToast({
                type: next ? 'error' : 'info',
                title: next ? 'Emergency Operations Mode Active' : 'Emergency Mode Deactivated',
                description: next ? 'Red zone priority queues and evacuation routes highlighted.' : 'Standard operational view restored.'
              });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              emergencyMode
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
            title="Toggle Emergency Operations Mode"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${emergencyMode ? 'text-white' : 'text-red-400'}`} />
            <span className="hidden sm:inline">{emergencyMode ? 'EMERGENCY' : 'Emergency'}</span>
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

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="System Alerts & Escalations"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-850">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Alerts & Smart Escalations ({unreadAlerts.length})
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage('alerts');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                  {alerts.slice(0, 4).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        if (alert.settlementId) setSelectedSettlementId(alert.settlementId);
                        if (alert.siteId) setSelectedSafeSiteId(alert.siteId);
                        if (alert.actionUrl) {
                          setCurrentPage(alert.actionUrl.includes('settlements') ? 'settlement-detail' : alert.actionUrl.replace('/', ''));
                        }
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !alert.read ? 'bg-slate-850/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-cyan-400">{alert.category.replace('_', ' ')}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Mini Badge */}
          <div
            onClick={() => setCurrentPage('settings')}
            className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-90"
            title="User Profile & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-slate-950 font-bold text-xs border border-cyan-400">
              SA
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-tight">Thiru. S. Arunkumar</span>
              <span className="text-[10px] text-cyan-400 font-mono font-medium">DDMA Chairman</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

