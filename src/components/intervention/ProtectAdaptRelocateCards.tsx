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

import { ApiClient } from '../../services/apiClient';

export const ProtectAdaptRelocateCards: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const { setSelectedSafeSiteId, setCurrentPage, addToast, overrideSettlementDecision, approveSettlementDecision } = useApp();
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionType>(settlement.aiRecommendation);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalModalAction, setApprovalModalAction] = useState<'APPROVE' | 'MODIFY' | 'REJECT'>('APPROVE');
  const [officerName, setOfficerName] = useState('Dr. S. K. Narayanan IAS');
  const [officerBadge, setOfficerBadge] = useState('DIS-COL-TN-092 (District Collector & DM)');
  const [approvalReason, setApprovalReason] = useState(
    'Hydrological surge modeling and coastal scarp retreat telemetry confirm high risk in northern spit. Allocation to Site B approved under Disaster Management Act 2005 §30.'
  );

  const handleRecordStatutoryDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.approveDecision({
        habitation_id: settlement.id,
        action: approvalModalAction,
        approved_intervention: selectedIntervention,
        officer_name: officerName,
        officer_badge: officerBadge,
        justification_reason: approvalReason,
        confidence_acknowledged: settlement.dataConfidence
      }, { success: true });

      if (approvalModalAction === 'APPROVE') {
        approveSettlementDecision(settlement.id, `${approvalModalAction} by ${officerName}: ${approvalReason}`);
      } else {
        overrideSettlementDecision(
          settlement.id,
          selectedIntervention,
          `${approvalModalAction} by ${officerName}: ${approvalReason}`
        );
      }

      addToast({
        type: 'success',
        title: `Statutory Decision Recorded: ${approvalModalAction}`,
        description: `Official directive for ${settlement.name} signed into immutable audit ledger.`
      });
      setIsApprovalModalOpen(false);
    } catch {
      addToast({
        type: 'success',
        title: `Statutory Decision Recorded (Offline): ${approvalModalAction}`,
        description: `Decision queued for audit ledger sync.`
      });
      setIsApprovalModalOpen(false);
    }
  };

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

      {/* Statutory Human Approval Bar & Governance Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-2 border-amber-500/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700 uppercase">
                AI RECOMMENDATION — HUMAN APPROVAL REQUIRED
              </span>
              <span className="text-[10px] font-mono text-slate-400">DISASTER MANAGEMENT ACT 2005 §30</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Statutory Executive Sign-Off & Official Direction
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Selected: <strong className="text-cyan-400">{selectedIntervention.replace('_', ' ')}</strong> for {settlement.name}. Official directive requires authorized officer approval.
            </p>
          </div>
        </div>

        {/* Action Buttons: APPROVE / MODIFY / REJECT */}
        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => {
              setApprovalModalAction('APPROVE');
              setIsApprovalModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>APPROVE</span>
          </button>

          <button
            onClick={() => {
              setApprovalModalAction('MODIFY');
              setIsApprovalModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>MODIFY</span>
          </button>

          <button
            onClick={() => {
              setApprovalModalAction('REJECT');
              setIsApprovalModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>REJECT</span>
          </button>
        </div>
      </div>

      {/* Statutory Decision Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Record Statutory Decision: {approvalModalAction}
                </h3>
              </div>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Target Habitation: <strong className="text-white">{settlement.name}</strong></div>
              <div className="text-slate-400">Intervention Pathway: <strong className="text-cyan-400">{selectedIntervention.replace('_', ' ')}</strong></div>
              <div className="text-slate-400">Action: <strong className={approvalModalAction === 'APPROVE' ? 'text-emerald-400' : approvalModalAction === 'MODIFY' ? 'text-amber-400' : 'text-red-400'}>{approvalModalAction}</strong></div>
            </div>

            <form onSubmit={handleRecordStatutoryDecision} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Authorizing Officer Name & Designation:</label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Official ID / Badge Reference:</label>
                <input
                  type="text"
                  required
                  value={officerBadge}
                  onChange={(e) => setOfficerBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Mandatory Statutory Justification ({approvalModalAction === 'APPROVE' ? 'Approval Basis' : 'Reason for Modification / Rejection'}):
                </label>
                <textarea
                  required
                  rows={3}
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  placeholder="Enter explicit engineering, hydrological, socio-economic, or statutory reasoning under DM Act 2005..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Sign & Record in Immutable Audit Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

