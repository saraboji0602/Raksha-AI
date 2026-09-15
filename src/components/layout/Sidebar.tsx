import React from 'react';
import { useApp } from '../../store/useAppStore';
import {
  LayoutDashboard,
  Map,
  Building2,
  GitBranch,
  ShieldCheck,
  Compass,
  Sliders,
  CheckSquare2,
  FileSpreadsheet,
  AlertTriangle,
  Database,
  Settings,
  HelpCircle,
  MessageSquareCode,
  Network,
  ChevronLeft,
  ChevronRight,
  Radio,
  Hammer,
  Scale
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  highlight?: boolean;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const {
    currentPage,
    setCurrentPage,
    t,
    alerts,
    incidents,
    dataConflicts,
    isAIChatOpen,
    setIsAIChatOpen,
    setIsDecisionTraceOpen,
    currentUser
  } = useApp();

  const unreadAlerts = alerts.filter(a => !a.read).length;
  const activeSOSCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const activeConflictsCount = dataConflicts.filter(c => c.status === 'CONFLICT_DETECTED').length;

  const navGroups: NavGroup[] = [
    {
      title: t('navGroupMonitor'),
      items: [
        { id: 'dashboard', label: t('navOverview'), icon: LayoutDashboard },
        { id: 'emergency-center', label: t('navEmergencyCenter'), icon: Radio, count: activeSOSCount, highlight: true },
        { id: 'risk', label: t('navRiskMap'), icon: Map, badge: 'GIS' },
        { id: 'settlements', label: t('navSettlements'), icon: Building2 },
        { id: 'alerts', label: t('navAlerts'), icon: AlertTriangle, count: unreadAlerts }
      ]
    },
    {
      title: t('navGroupAct'),
      items: [
        { id: 'field-verification', label: t('navFieldVerification'), icon: CheckSquare2, count: activeConflictsCount > 0 ? activeConflictsCount : undefined, highlight: true },
        { id: 'recovery', label: t('navRecovery'), icon: Hammer, highlight: true }
      ]
    },
    {
      title: t('navGroupPlan'),
      items: [
        { id: 'prevention', label: t('navPrevention'), icon: ShieldCheck, highlight: true, badge: 'AI' },
        { id: 'intervention', label: t('navIntervention'), icon: GitBranch },
        { id: 'safe-sites', label: t('navSafeSites'), icon: ShieldCheck },
        { id: 'relocation', label: t('navRelocationPlanner'), icon: Compass },
        { id: 'simulator', label: t('navSimulator'), icon: Sliders, highlight: true }
      ]
    },
    {
      title: t('navGroupVerify'),
      items: [
        { id: 'audit', label: t('navAudit'), icon: Scale },
        { id: 'data', label: t('navDataSources'), icon: Database }
      ]
    },
    {
      title: t('navGroupInsight'),
      items: [
        { id: 'reports', label: t('navReports'), icon: FileSpreadsheet },
        { id: 'settings', label: t('navSettings'), icon: Settings },
        { id: 'help', label: t('navHelp'), icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-300 z-20 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header / Collapser */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-3 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                COMMAND MENU
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors mx-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links with grouped sections */}
        <nav className="p-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {navGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {grp.title}
                </div>
              )}
              {grp.items.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || (item.id === 'settlements' && currentPage === 'settlement-detail');

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                    } ${item.highlight && !isActive ? 'hover:border-cyan-500/20' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-cyan-400'
                          : item.highlight
                          ? 'text-cyan-400 group-hover:text-cyan-300'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="truncate">{item.label}</span>

                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            {item.badge}
                          </span>
                        )}

                        {item.count !== undefined && item.count > 0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Features: Decision Trace & AI Assistant */}
      <div className="p-2 border-t border-slate-800 space-y-2 bg-slate-950/60">
        {/* Decision Trace Flow Modal Trigger */}
        <button
          onClick={() => setIsDecisionTraceOpen(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 text-xs font-semibold transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Explainable Decision Trace Flowchart"
        >
          <Network className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          {!collapsed && <span>Decision Trace (AI)</span>}
        </button>

        {/* AI Chat Assistant Trigger */}
        <button
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open RAKSHA AI Assistant"
        >
          <MessageSquareCode className="w-4 h-4 text-slate-950 flex-shrink-0" />
          {!collapsed && <span>RAKSHA Assistant</span>}
        </button>

        {/* User Mini Profile in expanded mode */}
        {!collapsed && (
          <div className="pt-2 px-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex flex-col truncate">
              <span className="font-bold text-white truncate">{currentUser.jurisdictionDistrict}</span>
              <span className="text-[10px] text-slate-500">{currentUser.jurisdictionState}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
};
