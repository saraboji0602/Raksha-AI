import React from 'react';
import { SafeSite, Settlement } from '../../types';
import { useApp } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { ScoreGauge } from '../common/ScoreGauge';
import { CarryingCapacityMeter } from './CarryingCapacityMeter';
import { CommunityAcceptanceCard } from './CommunityAcceptanceCard';
import { 
  ShieldCheck, 
  MapPin, 
  Route, 
  Clock, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const SiteCard: React.FC<{
  site: SafeSite;
  settlement?: Settlement;
  isSelected?: boolean;
  onSelect?: () => void;
}> = ({ site, settlement, isSelected = false, onSelect }) => {
  const { setCurrentPage, setSelectedSafeSiteId } = useApp();
  const distKm = settlement ? site.distanceFromKeySettlementKm[settlement.id] || 18.4 : 18.4;
  const travelMin = settlement ? site.travelTimeMin[settlement.id] || 32 : 32;

  const isRecommendedForCurrent = settlement?.recommendedSiteId === site.id || site.id === 'site-b';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {site.code}
              </span>
              {isRecommendedForCurrent && (
                <span className="text-[10px] font-mono font-black bg-gradient-to-r from-purple-600 to-cyan-600 text-slate-950 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>AI RECOMMENDED</span>
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight mt-1">{site.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{site.district} • Elev: {site.elevationMeters}m MSL • Land: {site.landAreaAcres} Acres</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-mono font-black text-lg text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-800/80 shadow-inner">
              {site.overallScore} / 100
            </span>
          </div>
        </div>

        {/* Distance & Travel Badge */}
        <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs mb-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Route className="w-3.5 h-3.5 text-cyan-400" />
            <span>Distance from target: <strong className="text-white font-mono">{distKm} km</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Transit Time: <strong className="text-white font-mono">{travelMin} mins</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Road: <strong className="text-emerald-400">{site.roadQuality.replace('_', ' ')}</strong></span>
        </div>

        {/* 4 Pillars Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
          <ScoreGauge score={site.hazardSafetyScore} label="Hazard Safety" variant="safety" size="sm" />
          <ScoreGauge score={site.connectivityScore} label="Road Access" variant="safety" size="sm" />
          <ScoreGauge score={site.waterScore} label="Water Grid" variant="safety" size="sm" />
          <ScoreGauge score={site.communityAcceptance.overallScore} label="Community Acceptance" variant="acceptance" size="sm" />
        </div>

        {/* Carrying Capacity Component */}
        <CarryingCapacityMeter
          capacity={site.capacity}
          allocated={site.allocatedPopulation || (settlement?.relocationPopulation || 2650)}
        />

        {/* Community Acceptance Component */}
        <div className="mt-3">
          <CommunityAcceptanceCard site={site} />
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          <span>Est. Development Cost: </span>
          <strong className="text-white font-mono font-bold">₹{site.estimatedDevelopmentCostCr} Cr</strong>
          <span className="text-slate-500"> ({site.estimatedDevelopmentTimeMonths} months)</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelect && (
            <button
              onClick={onSelect}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isSelected ? '✓ Selected Relocation Haven' : 'Select Haven'}
            </button>
          )}

          <button
            onClick={() => {
              setSelectedSafeSiteId(site.id);
              setCurrentPage('relocation');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <span>Allocate Population</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
