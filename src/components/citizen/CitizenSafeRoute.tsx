import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  Route, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Navigation,
  Compass,
  AlertCircle
} from 'lucide-react';

export const CitizenSafeRoute: React.FC = () => {
  const { roads, getSelectedSettlement, t } = useApp();
  const settlement = getSelectedSettlement();

  const primaryBlockedRoad = roads.find(r => r.status === 'BLOCKED');
  const safeOpenRoad = roads.find(r => r.status === 'OPEN') || roads[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/70 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
              INTELLIGENT EVACUATION ROUTING
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">
              LIVE NETWORK SYNC
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('citizenNavRoutes')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time road passability analysis for {settlement.name}. Dynamically avoids submerged culverts, washed-out causeways, and active scarp slumps.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs font-mono flex-shrink-0">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">Destination: <strong className="text-white">Site B Haven (18.4 km)</strong></span>
        </div>
      </div>

      {/* Critical Alert Banner if Primary Route Blocked */}
      {primaryBlockedRoad && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/90 to-slate-900 border-2 border-red-500/80 shadow-lg shadow-red-950/30 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-600 text-white flex-shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-red-300 uppercase">
                ACTIVE REROUTE ADVISORY
              </span>
              <span className="text-[10px] font-mono text-slate-400">Telemetry Updated {primaryBlockedRoad.lastUpdated}</span>
            </div>
            <h3 className="text-sm font-bold text-white">
              {primaryBlockedRoad.rerouteNotice || 'Route updated because Coastal Causeway is flooded.'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Blockage Reason:</strong> {primaryBlockedRoad.blockageReason} (Water Depth: +{primaryBlockedRoad.waterDepthMeters}m). Do NOT attempt two-wheeler or foot crossings.
            </p>
          </div>
        </div>
      )}

      {/* Route Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Route A - Blocked */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-red-900/60 flex flex-col justify-between opacity-85">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-400">ROUTE A (COASTAL CAUSEWAY)</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>BLOCKED ❌</span>
              </span>
            </div>

            <h4 className="text-sm font-bold text-white">
              Beachfront Causeway to East Coast Main Link
            </h4>
            <p className="text-xs text-slate-400">
              Passes through Zone A beachfront. Currently submerged by +1.4m tidal surge water across 350m low-lying culvert span.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs text-slate-400">
              <div>• Distance: <strong className="text-white font-mono">14.2 km</strong> (Shortest but submerged)</div>
              <div>• Water Depth: <strong className="text-red-400 font-mono">+1.4m Deep Ingress</strong></div>
              <div>• Passability: <strong className="text-red-400 font-bold">IMPENETRABLE</strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-red-400 font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>AVOID THIS ROAD — POLICE BARRICADE ACTIVE</span>
          </div>
        </div>

        {/* Route B - Safe & Open */}
        <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-950/40 flex flex-col justify-between ring-1 ring-emerald-500/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">ROUTE B (INLAND ELEVATED CORRIDOR)</span>
                <span className="text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 uppercase">
                  RECOMMENDED
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>OPEN & ALL-WEATHER SAFE ✅</span>
              </span>
            </div>

            <h4 className="text-sm font-bold text-white">
              Temple Ridge Link to State Highway SH-49 High Bypass
            </h4>
            <p className="text-xs text-slate-300">
              Elevated paved all-weather corridor (8.2m MSL). Completely outside 50-year storm surge and river flood boundaries.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs text-slate-300">
              <div>• Distance: <strong className="text-white font-mono">18.4 km</strong> to Pothigai Haven Site B</div>
              <div>• Elevation: <strong className="text-emerald-400 font-mono">8.2m - 14.5m Above MSL</strong></div>
              <div>• Transit Time: <strong className="text-cyan-300 font-mono">~32 mins</strong> by bus/car</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OFFICIALLY SANCTIONED SAFE CORRIDOR</span>
            </span>
            <span className="text-xs font-mono text-slate-400">SH-49 Patrols Active</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Checkpoint Navigation Guide */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Turn-by-Turn Safe Checkpoints (Kadalpuram → Site B)</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">Total: 18.4 km (4 Checkpoints)</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-white block">Checkpoint 1: Depart Frontline Zone A via Inland Path</strong>
              <p className="text-slate-400 mt-0.5">Move directly westward away from the beach. Do NOT take the South Coastal Causeway.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-white block">Checkpoint 2: Muster at Zone C (Temple High Ridge)</strong>
              <p className="text-slate-400 mt-0.5">Elevation +7.5m MSL. Transport muster vehicles and shuttle buses stationed at Panchayat grounds.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-white block">Checkpoint 3: Merge onto State Highway SH-49 Elevated Bypass</strong>
              <p className="text-slate-400 mt-0.5">4-lane paved all-weather highway with emergency police escort and traffic marshals.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-emerald-800/80 text-xs bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <strong className="text-emerald-300 block">Arrival: Pothigai Resilient Haven (Site B Safe Zone)</strong>
              <p className="text-slate-300 mt-0.5">Plateau elevation 14.5m MSL. Registration, medical checkup, and family shelter allocation on arrival.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
