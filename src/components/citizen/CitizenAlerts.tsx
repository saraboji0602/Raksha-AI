import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export const CitizenAlerts: React.FC<{ onNavigateToShelters?: () => void; onNavigateToRoutes?: () => void }> = ({
  onNavigateToShelters,
  onNavigateToRoutes
}) => {
  const { alerts, markAlertRead, getSelectedSettlement, t } = useApp();
  const settlement = getSelectedSettlement();

  const personalizedCitizenAlerts = [
    {
      id: 'cit-alt-01',
      title: 'CRITICAL WARNING: Estuarine Wave Surge Inundation Active',
      hazard: 'CYCLONIC_SURGE',
      severity: 'CRITICAL',
      timestamp: '6 mins ago',
      affectedZone: 'Zone A (Coastal Hamlet) & Zone B (Canal Bank)',
      why: 'Astronomical high tide coupled with Category 4 storm surge has breached the 1.2m beachfront berm. Water depth rising at 15cm/hr.',
      whatToDo: 'Move elderly family members, infants, and vital identity documents immediately to higher ground at Temple Ridge (Zone C). Do not enter coastal waters.',
      whereToGo: 'Pothigai Resilient Haven (Site B) via Inland Elevated Bypass Route B.',
      actionType: 'EVACUATE'
    },
    {
      id: 'cit-alt-02',
      title: 'EVACUATION ROUTE ADVISORY: Beachfront Causeway Submerged',
      hazard: 'ROAD_BLOCKAGE',
      severity: 'WARNING',
      timestamp: '15 mins ago',
      affectedZone: 'Beachfront Causeway Road A',
      why: 'Tidal surge has submerged 350m of the culvert causeway with +1.4m of seawater. Heavy undertow reported.',
      whatToDo: 'Avoid Route A completely. Strictly follow the West Temple bypass toward State Highway SH-49.',
      whereToGo: 'Follow the illuminated blue evacuation signboards to Checkpoint 2 (Zone C Temple Ridge).',
      actionType: 'REROUTE'
    },
    {
      id: 'cit-alt-03',
      title: 'SHELTER NOTICE: PHC Community Shelter Reached Full Capacity',
      hazard: 'SHELTER_CAPACITY',
      severity: 'INFO',
      timestamp: '35 mins ago',
      affectedZone: 'Temple Ridge Sector',
      why: 'Kadalpuram Primary Health Centre Emergency Ward has filled all 350 emergency beds.',
      whatToDo: 'Do not head to PHC unless in need of urgent triage trauma medical care.',
      whereToGo: 'Proceed directly to Pothigai Haven Site B (2,350 headroom remaining) or Govt Higher Secondary Multi-Purpose Shelter.',
      actionType: 'SHELTER'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-red-950/70 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">
              PERSONALIZED DISASTER ALERTS
            </span>
            <span className="text-[10px] font-mono font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 uppercase">
              LIVE DISPATCH FEED
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('citizenNavAlerts')} for {settlement.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Targeted advisories generated from the centralized risk engine and field telemetry. Every alert details why it happened, what action to take, and where to go.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/90 px-3 py-1.5 rounded-2xl border border-red-700 self-start sm:self-auto flex-shrink-0">
          {personalizedCitizenAlerts.length} Active Advisories
        </span>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {personalizedCitizenAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
              alert.severity === 'CRITICAL'
                ? 'bg-slate-900 border-red-500 shadow-2xl shadow-red-950/30 ring-1 ring-red-500/50'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-600 text-white animate-pulse'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-700 uppercase">
                      {alert.affectedZone}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {alert.title}
                  </h3>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold self-start sm:self-auto uppercase ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {alert.severity} ACTION REQUIRED
              </span>
            </div>

            {/* The 3 Core Citizen Questions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Question 1: Why */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. {t('whyQuestion')}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {alert.why}
                </p>
              </div>

              {/* Question 2: What Should I Do */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. {t('whatShouldIDoQuestion')}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {alert.whatToDo}
                </p>
              </div>

              {/* Question 3: Where Should I Go */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. {t('whereShouldIGoQuestion')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.whereToGo}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
              {onNavigateToRoutes && (
                <button
                  onClick={onNavigateToRoutes}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View Safe Route Bypass</span>
                </button>
              )}

              {onNavigateToShelters && (
                <button
                  onClick={onNavigateToShelters}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Find Available Shelter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
