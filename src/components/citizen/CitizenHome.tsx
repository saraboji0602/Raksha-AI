import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Route, 
  Radio, 
  PhoneCall, 
  FileText, 
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const CitizenHome: React.FC<{
  onOpenSOS: () => void;
  onNavigateTab: (tab: string) => void;
}> = ({ onOpenSOS, onNavigateTab }) => {
  const { 
    getSelectedSettlement, 
    settlements, 
    setSelectedSettlementId, 
    shelters, 
    roads, 
    kadalpuramSimulationMode, 
    t 
  } = useApp();
  
  const settlement = getSelectedSettlement();
  const currentRisk = settlement.overallRisk;
  const isSurgeActive = kadalpuramSimulationMode === 'RISING_RIVER_SURGE' && settlement.id === 'kadalpuram';

  // Dynamic "What Should I Do Now?" Action
  const getActionRecommendation = () => {
    if (currentRisk >= 90) {
      return {
        title: t('actionEvacuateNow'),
        subtitle: 'Water level rising above safe thresholds. Move with family toward designated haven.',
        severity: 'CRITICAL',
        color: 'bg-red-600 text-white border-red-500 shadow-red-950/40',
        badge: 'IMMEDIATE EVACUATION'
      };
    } else if (currentRisk >= 70) {
      return {
        title: t('actionPrepareToMove'),
        subtitle: 'High coastal wave exposure. Pack vital documents, medicines, and prepare for evacuation.',
        severity: 'HIGH',
        color: 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-950/40',
        badge: 'PREPARE TO MOVE'
      };
    } else {
      return {
        title: t('actionStayAlert'),
        subtitle: 'Area currently stable. Monitor official weather bulletins and maintain emergency kit.',
        severity: 'MODERATE',
        color: 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/40',
        badge: 'STAY ALERT'
      };
    }
  };

  const currentAction = getActionRecommendation();
  const primaryHaven = shelters.find(s => s.isPrimaryHavenCandidate) || shelters[0];
  const primaryRoad = roads.find(r => r.status === 'BLOCKED') || roads[0];

  return (
    <div className="space-y-6">
      {/* 1. WHERE AM I & RISK STATUS HERO CARD */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {t('whereAmI')}
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                GPS LOCATION LOCKED
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {settlement.name}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                ({settlement.district}, {settlement.state})
              </span>
            </div>
          </div>

          {/* Quick Settlement Switcher for Demo */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 pl-1 font-semibold">Change Area:</span>
            <select
              value={settlement.id}
              onChange={(e) => setSelectedSettlementId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              {settlements.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Risk {s.overallRisk}/100)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. CURRENT SAFETY STATUS & SCORE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Current Threat Level</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black font-mono ${
                currentRisk >= 90 ? 'text-red-500' : currentRisk >= 70 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentRisk}
              </span>
              <span className="text-slate-500 font-mono text-sm">/ 100</span>
            </div>
            <div className="mt-2">
              <Badge 
                variant="risk" 
                level={currentRisk >= 90 ? 'CRITICAL' : currentRisk >= 75 ? 'HIGH' : currentRisk >= 50 ? 'MODERATE' : 'LOW'} 
                size="sm" 
              />
            </div>
          </div>


          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Dominant Threat</span>
            <div className="text-base font-bold text-white mt-1 capitalize">
              {settlement.dominantHazard.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Wave surge ingress & scarp retreat
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Exposed Population</span>
            <div className="text-xl font-black font-mono text-cyan-300 mt-1">
              {settlement.exposedPopulation.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {settlement.exposedPercentage}% of {settlement.population.toLocaleString()} residents
            </div>
          </div>
        </div>

        {/* 3. WHY IS MY AREA AT RISK? (Plain Language Explanation) */}
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>{t('whyRiskExplanation')}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isSurgeActive 
              ? 'Active monsoonal river swelling combined with astronomical high tide (+2.4m surge) has breached frontline coastal sand berms. Zone A and B are experiencing rapid ground inundation.'
              : 'Historical monsoon records and satellite shoreline tracking show 3.4m/year coastal scarp erosion with high exposure to cyclonic wave runup.'}
          </p>
        </div>
      </div>

      {/* 4. "WHAT SHOULD I DO NOW?" DYNAMIC ACTION CARD */}
      <div className={`p-6 rounded-3xl border-2 shadow-2xl transition-all ${currentAction.color}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/30 border border-white/20">
                {currentAction.badge}
              </span>
              <span className="text-xs font-semibold opacity-90">Official DDMA Action Advisory</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              {currentAction.title}
            </h3>
            <p className="text-xs opacity-90 max-w-2xl leading-relaxed">
              {currentAction.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigateTab('citizen-routes')}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/30 flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Safe Evacuation Route</span>
            </button>

            <button
              onClick={() => onNavigateTab('citizen-shelters')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Find Safe Haven</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. BIG SOS BUTTON & EMERGENCY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BIG RED SOS BUTTON */}
        <div
          onClick={onOpenSOS}
          className="p-6 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 border-2 border-red-400 text-white shadow-2xl shadow-red-600/40 cursor-pointer flex flex-col justify-between transition-all group active:scale-98"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                <Radio className="w-7 h-7 text-white animate-pulse" />
              </div>
              <span className="text-[10px] font-mono font-black bg-black/40 px-2.5 py-1 rounded-full uppercase border border-white/20">
                1-TAP BEACON
              </span>
            </div>

            <h3 className="text-xl font-black tracking-tight mt-2">
              {t('sendSOSQuick')}
            </h3>
            <p className="text-xs text-red-100 leading-relaxed">
              Directly alerts DDMA Disaster Command Room & NDRF rescue boats with your exact GPS telemetry and family demographics.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between font-bold text-xs">
            <span>Press for Immediate Rescue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* NEAREST SAFE SHELTER CARD */}
        <div
          onClick={() => onNavigateTab('citizen-shelters')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between transition-all group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {primaryHaven.distanceKm} km away
              </span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-tight mt-1">
              {primaryHaven.name}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Elev: {primaryHaven.elevationMeters}m MSL • Remaining Headroom: <strong className="text-emerald-400 font-mono">+{primaryHaven.remainingCapacity.toLocaleString()}</strong>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span>View All {shelters.length} Shelters</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* SAFE ROUTE CARD */}
        <div
          onClick={() => onNavigateTab('citizen-routes')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between transition-all group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Route className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                ROAD A BLOCKED
              </span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-tight mt-1">
              Inland Elevated Bypass (Route B)
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Coastal Causeway submerged by 1.4m surge. Proceed strictly via Temple Ridge bypass link.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>View Checkpoint Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ACTIONS: REPORT HAZARD & 24x7 HELPLINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div
          onClick={() => onNavigateTab('citizen-report')}
          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t('reportHazardQuick')}</div>
              <div className="text-[10px] text-slate-400">Report flooded roads, downed lines, or scarp erosion</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        <div
          onClick={() => onNavigateTab('citizen-help')}
          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t('emergencyHelpQuick')}</div>
              <div className="text-[10px] text-slate-400">NDRF (1078), SDRF (1070), Ambulance (108)</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
