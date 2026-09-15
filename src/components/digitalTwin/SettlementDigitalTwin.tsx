import React from 'react';
import { useApp } from '../../store/useAppStore';
import { RiskBreakdownCard } from './RiskBreakdownCard';
import { ExplainableFactors } from './ExplainableFactors';
import { MicroZoneAnalysis } from './MicroZoneAnalysis';
import { WhoNeedsActionView } from './WhoNeedsActionView';
import { ExposureAnalysis } from './ExposureAnalysis';
import { VulnerabilityRadar } from './VulnerabilityRadar';
import { ResilienceBreakdown } from './ResilienceBreakdown';
import { EvacuationRoutesView } from './EvacuationRoutesView';
import { HistoricalDisasterTimeline } from './HistoricalDisasterTimeline';
import { GISMapView } from '../map/GISMapView';
import { WhatChangedPanel } from '../common/WhatChangedPanel';
import { Badge } from '../common/Badge';
import { 
  Building2, 
  MapPin, 
  GitBranch, 
  ShieldCheck, 
  Sliders, 
  CheckSquare2, 
  ArrowRight, 
  FileSpreadsheet,
  Network,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const SettlementDigitalTwin: React.FC = () => {
  const { 
    getSelectedSettlement, 
    setCurrentPage, 
    setSelectedSafeSiteId,
    setIsDecisionTraceOpen,
    kadalpuramSimulationMode,
    toggleRisingRiverSimulation,
    addToast 
  } = useApp();
  
  const settlement = getSelectedSettlement();
  const isKadalpuram = settlement.id === 'kadalpuram';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 flex-shrink-0 mt-1">
            <Building2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                SETTLEMENT DIGITAL TWIN
              </span>
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                ID: {settlement.id.toUpperCase()}
              </span>
              <Badge variant="risk" level={settlement.overallRisk >= 85 ? 'CRITICAL' : 'HIGH'} size="sm" />
              {isKadalpuram && (
                <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                  ★ FLAGSHIP DEMO
                </span>
              )}
              {settlement.compoundHazard && settlement.compoundHazard.type !== 'NONE' && (
                <span className="text-[10px] font-mono font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  COMPOUND HAZARD (1.32x)
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
              <span>{settlement.name}</span>
              <span className="text-base font-mono font-normal text-slate-400">
                (Risk: <strong className={settlement.overallRisk >= 85 ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>{settlement.overallRisk}/100</strong>)
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settlement.district}, {settlement.state} • Area: {settlement.areaSqKm} sq km • Pop: {settlement.population.toLocaleString()} ({settlement.households} households)</span>
            </p>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center flex-shrink-0">
          {isKadalpuram && (
            <button
              onClick={toggleRisingRiverSimulation}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-md ${
                kadalpuramSimulationMode === 'RISING_RIVER_SURGE'
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/40'
              }`}
              title="Simulate river level rise from baseline 72 to critical 91"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {kadalpuramSimulationMode === 'RISING_RIVER_SURGE' ? 'Surge Mode (91) Active' : 'Simulate River Surge (72 → 91)'}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsDecisionTraceOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Network className="w-4 h-4" />
            <span>Trace AI Decision</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('intervention');
              addToast({
                type: 'info',
                title: 'Intervention Engine Opened',
                description: `Evaluating Protect vs Adapt vs Relocate for ${settlement.name}.`
              });
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <GitBranch className="w-4 h-4 text-slate-950" />
            <span>Evaluate Intervention Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* "What Changed?" Intelligence Panel for Kadalpuram */}
      {isKadalpuram && (
        <WhatChangedPanel />
      )}

      {/* Row 1: GIS Map & Multi-Hazard Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <GISMapView height="490px" focusedSettlementId={settlement.id} showRelocationVector={true} />
        </div>
        <div className="lg:col-span-5">
          <RiskBreakdownCard settlement={settlement} />
        </div>
      </div>

      {/* Who Needs Action? View */}
      <WhoNeedsActionView settlement={settlement} />

      {/* Row 2: Explainable AI & Micro-Zone Disaggregation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplainableFactors settlement={settlement} />
        <MicroZoneAnalysis settlement={settlement} />
      </div>

      {/* Row 3: Exposure, Vulnerability Radar & Resilience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ExposureAnalysis settlement={settlement} />
        <VulnerabilityRadar settlement={settlement} />
        <ResilienceBreakdown settlement={settlement} />
      </div>

      {/* Row 4: Evacuation Routes & Historical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EvacuationRoutesView settlement={settlement} />
        <HistoricalDisasterTimeline settlement={settlement} />
      </div>

      {/* Bottom Sticky Action Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Current AI Recommendation:</span>
          <Badge variant="intervention" level={settlement.aiRecommendation} size="md" />
          <span className="text-xs text-slate-400 hidden sm:inline">
            → Recommended Destination: <strong className="text-cyan-400">Site B (Pothigai Haven)</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('safe-sites')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Find Safe Havens
          </button>
          <button
            onClick={() => setCurrentPage('intervention')}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Compare Interventions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
