import React, { useState } from 'react';
import { Settlement, InterventionType } from '../../types';
import { useApp } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  Clock, 
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

export const ProtectAdaptRelocateCards: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const { setSelectedSafeSiteId, setCurrentPage, addToast } = useApp();
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionType>(settlement.aiRecommendation);

  const pop = settlement.population;
  const isKadalpuram = settlement.id === 'kadalpuram';

  const strategies = [
    {
      id: 'PROTECT' as InterventionType,
      title: 'PROTECT (In-Situ Hard Defense)',
      tagline: 'Hard engineering seawalls, groynes & bunds',
      riskReductionPct: 24,
      costCr: settlement.costProtectCr,
      popProtected: isKadalpuram ? 2900 : Math.round(pop * 0.6),
      complexity: 'MODERATE',
      timeYears: 2,
      residualRisk: 'HIGH (69/100)',
      socialDisruption: 'VERY LOW',
      isRecommended: settlement.aiRecommendation === 'PROTECT',
      borderColor: 'border-emerald-600/60 hover:border-emerald-500',
      activeBg: 'bg-emerald-950/40',
      description: 'Reinforce concrete seawall, submerge geotubes, and upgrade storm drainage channels.',
      drawbacks: 'Vulnerable to extreme Category 4 surge overtopping; requires high annual maintenance.'
    },
    {
      id: 'ADAPT' as InterventionType,
      title: 'ADAPT (Ecological & Stilt Upgrades)',
      tagline: 'Nature-based bio-shields + elevated plinth homes',
      riskReductionPct: 41,
      costCr: settlement.costAdaptCr,
      popProtected: isKadalpuram ? 3700 : Math.round(pop * 0.8),
      complexity: 'HIGH',
      timeYears: 3,
      residualRisk: 'MEDIUM (54/100)',
      socialDisruption: 'LOW',
      isRecommended: settlement.aiRecommendation === 'ADAPT',
      borderColor: 'border-blue-600/60 hover:border-blue-500',
      activeBg: 'bg-blue-950/40',
      description: 'Plant 150m mangrove bio-shield buffer, elevate housing on concrete stilts (+1.8m), install solar pumping.',
      drawbacks: 'Frontline northern micro-zone still experiences severe tidal erosion; partial long-term vulnerability remains.'
    },
    {
      id: 'PARTIAL_RELOCATION' as InterventionType,
      title: 'PARTIAL RELOCATION (Zoned Resettlement)',
      tagline: 'Relocate critical red-zone while adapting safer zones',
      riskReductionPct: 76,
      costCr: settlement.costRelocateCr,
      popProtected: isKadalpuram ? 4450 : Math.round(pop * 0.92),
      complexity: 'VERY HIGH',
      timeYears: 4,
      residualRisk: 'LOW (22/100)',
      socialDisruption: 'MEDIUM (Targeted to Zone A)',
      isRecommended: settlement.aiRecommendation === 'PARTIAL_RELOCATION',
      borderColor: 'border-purple-500 hover:border-purple-400 ring-2 ring-purple-500/50',
      activeBg: 'bg-purple-950/50',
      description: `Relocate ${settlement.relocationPopulation.toLocaleString()} residents in frontline Zone A to Safe Haven Site B; adapt remaining ${settlement.adaptationPopulation.toLocaleString()} residents in-situ.`,
      drawbacks: 'Requires inter-agency transit corridor coordination between inland haven and coastline.'
    },
    {
      id: 'FULL_RELOCATION' as InterventionType,
      title: 'FULL RELOCATION (Complete Town Relocation)',
      tagline: 'Complete village decommissioning & resettlement',
      riskReductionPct: 91,
      costCr: Math.round(settlement.costRelocateCr * 1.45),
      popProtected: settlement.population,
      complexity: 'EXTREME',
      timeYears: 5,
      residualRisk: 'VERY LOW (9/100)',
      socialDisruption: 'HIGH (Entire Community)',
      isRecommended: settlement.aiRecommendation === 'FULL_RELOCATION',
      borderColor: 'border-rose-600/60 hover:border-rose-500',
      activeBg: 'bg-rose-950/40',
      description: `Complete resettlement of all ${settlement.population.toLocaleString()} residents to new integrated inland township.`,
      drawbacks: 'High fiscal cost and major disruption to cultural ties and traditional community identity.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 4 Cards Strategy Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {strategies.map((strat) => {
          const isSelected = selectedIntervention === strat.id;

          return (
            <div
              key={strat.id}
              onClick={() => setSelectedIntervention(strat.id)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? `${strat.activeBg} ${strat.borderColor} shadow-2xl`
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {strat.isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-cyan-600 text-slate-950 font-black text-[9px] font-mono px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>AI RECOMMENDED</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="intervention" level={strat.id} size="sm" />
                </div>

                <h4 className="text-base font-bold text-white tracking-tight mt-1">{strat.title.split(' (')[0]}</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{strat.tagline}</p>

                {/* Core Metrics */}
                <div className="my-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Risk Reduction:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{strat.riskReductionPct}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Estimated Cost:</span>
                    </span>
                    <span className="font-mono font-bold text-white">₹{strat.costCr} Cr</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Timeframe:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">{strat.timeYears} Years</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Residual Risk:</span>
                    <span className="font-mono font-bold text-slate-300 text-[11px]">{strat.residualRisk}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Social Disruption:</span>
                    <span className="font-semibold text-slate-300 text-[11px]">{strat.socialDisruption}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{strat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {isSelected ? 'Selected for Plan' : 'Click to evaluate'}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                      : 'border-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation Deep Justification Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0 mt-1">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wide">
                AI DECISION ENGINE RATIONALE
              </span>
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Confidence: {settlement.dataConfidence}%
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">
              Why Partial Relocation is Optimal for {settlement.name}
            </h4>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
              Northern Zone A is exposed to extreme wave attack & 3.4m/yr coastal retreat, where hard defenses will inevitably fail during Category 4 cyclones. However, Zones B & C possess natural elevation and mangrove shielding. Relocating 2,650 residents to Site B eliminates critical life-safety hazards while preserving socio-economic livelihoods and saving ₹68.0 Cr compared to the cost of waiting.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => {
              setSelectedSafeSiteId('site-b');
              setCurrentPage('safe-sites');
              addToast({
                type: 'info',
                title: 'Safe Haven Matching Opened',
                description: 'Evaluating Site B carrying capacity and connectivity.'
              });
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <span>Match Safe Haven (Site B)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage('relocation')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Allocation Planner
          </button>
        </div>
      </div>
    </div>
  );
};
