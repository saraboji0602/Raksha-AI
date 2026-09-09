import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  Shield, 
  Search, 
  Bell, 
  Play, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  Globe, 
  AlertTriangle,
  Layers,
  FileText,
  MapPin,
  Building2,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TopBar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    searchTerm,
    setSearchTerm,
    settlements,
    safeSites,
    setSelectedSettlementId,
    setSelectedSafeSiteId,
    setCurrentPage,
    alerts,
    emergencyMode,
    setEmergencyMode,
    language,
    setLanguage,
    t,
    startDemoTour,
    triggerSimulatedDataUpdate,
    setIsAIChatOpen,
    currentUser,
    filterDistrict,
    setFilterDistrict,
    addToast
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
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-700/50 uppercase">
                  DEMO DATA
                </span>
              </div>
              <span className="hidden md:inline-block text-[10px] text-slate-400 font-medium tracking-tight">
                Disaster Red-Zone Detection & Intelligent Relocation Engine
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar with Autocomplete Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search settlements (e.g. Kadalpuram), sites, reports..."
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
          {/* Quick Demo Tour Launch */}
          <button
            onClick={startDemoTour}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            title="Launch 4-Minute Hackathon Demo Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>4-Min Demo Tour</span>
          </button>

          {/* Simulate Sensor Data Update */}
          <button
            onClick={triggerSimulatedDataUpdate}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 font-medium transition-colors"
            title="Simulate Real-time Satellite InSAR sensor ingestion"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate InSAR</span>
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
            title="Toggle Emergency Mode"
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
