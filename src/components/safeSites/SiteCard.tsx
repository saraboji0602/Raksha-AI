import React, { useState } from 'react';
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
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Calendar
} from 'lucide-react';

export const SiteCard: React.FC<{
  site: SafeSite;
  settlement?: Settlement;
  isSelected?: boolean;
  onSelect?: () => void;
}> = ({ site, settlement, isSelected = false, onSelect }) => {
  const { setCurrentPage, setSelectedSafeSiteId } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  const distKm = settlement ? site.distanceFromKeySettlementKm[settlement.id] || 18.4 : 18.4;
  const travelMin = settlement ? site.travelTimeMin[settlement.id] || 32 : 32;
  const isRecommendedForCurrent = settlement?.recommendedSiteId === site.id || site.id === 'site-b';

  const getLandVerificationBadge = (status?: string) => {
    switch (status) {
      case 'POTENTIALLY_SUITABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            <FileCheck className="w-3 h-3 text-emerald-400" />
            POTENTIALLY SUITABLE
          </span>
        );
      case 'NEEDS_LAND_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            NEEDS LAND VERIFICATION
          </span>
        );
      case 'OWNERSHIP_VERIFICATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950/80 text-orange-300 border border-orange-700/60">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            OWNERSHIP VERIFICATION REQ.
          </span>
        );
      case 'ADMINISTRATIVE_REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-700/60">
            <FileCheck className="w-3 h-3 text-blue-400" />
            ADMINISTRATIVE REVIEW REQ.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <FileCheck className="w-3 h-3 text-slate-400" />
            GOVERNMENT PARCEL
          </span>
        );
    }
  };

  const headroom = site.capacity.remainingCapacity ?? (site.capacity.recommendedMaxCapacity - (site.allocatedPopulation || 0));

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {site.code}
              </span>
              {getLandVerificationBadge(site.landVerificationStatus)}
              {isRecommendedForCurrent && (
                <span className="text-[10px] font-mono font-black bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>AI RECOMMENDED #1</span>
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight mt-1">{site.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{site.district} • Elev: {site.elevationMeters}m MSL • Land: {site.landAreaAcres} Acres</span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-medium">Composite Score</span>
              <span className="font-mono font-black text-lg text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-800/80 shadow-inner">
                {site.overallScore} / 100
              </span>
            </div>
            {site.climateHorizonYears && (
              <span className="text-[10px] font-mono text-cyan-300/80 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                {site.climateHorizonYears}-Year Zero-Flood Buffer
              </span>
            )}
          </div>
        </div>

        {/* Distance & Travel Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Route className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance: <strong className="text-white font-mono">{distKm} km</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Transit: <strong className="text-white font-mono">{travelMin} mins</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">Road: <strong className="text-emerald-400">{site.roadQuality.replace(/_/g, ' ')}</strong></span>
          </div>

          <div className="text-[11px] font-mono px-2 py-0.5 bg-cyan-950/60 border border-cyan-800/50 rounded text-cyan-300">
            Headroom: <strong className="text-white font-bold">+{headroom.toLocaleString()}</strong>
          </div>
        </div>

        {/* 4 Pillars Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
          <ScoreGauge score={site.hazardSafetyScore} label="Hazard Safety" variant="safety" size="sm" />
          <ScoreGauge score={site.connectivityScore} label="Road Access" variant="safety" size="sm" />
          <ScoreGauge score={site.waterScore} label="Water Grid" variant="safety" size="sm" />
          <ScoreGauge score={site.communityAcceptance.overallScore} label="Community Preference" variant="acceptance" size="sm" />
        </div>

        {/* Why this site rationale box */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 mb-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>EXPLAINABLE SELECTION RATIONALE</span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 underline font-medium"
            >
              <span>{showDetails ? 'Hide analysis' : 'View full breakdown'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {site.selectionRationale}
          </p>

          {showDetails && (
            <div className="pt-2 mt-2 border-t border-purple-800/30 text-xs space-y-2">
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Current Land Status: </span>
                {site.currentLandUse}
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Bottleneck Constraint: </span>
                {site.capacity.bottleneckResource}
              </div>
              {site.communityAcceptance.primaryConcerns.length > 0 && (
                <div className="text-[11px]">
                  <span className="font-bold text-amber-300">Key Community Conditions: </span>
                  <ul className="list-disc list-inside text-slate-400 pl-1 mt-0.5 space-y-0.5">
                    {site.communityAcceptance.primaryConcerns.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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

