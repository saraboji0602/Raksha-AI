import React, { useState } from 'react';
import { Settlement, InterventionType } from '../../types';
import { useApp } from '../../store/useAppStore';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Network, 
  Database, 
  ShieldCheck, 
  UserCheck,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ExplainableFactors: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const { 
    setIsDecisionTraceOpen, 
    overrideSettlementDecision, 
    approveSettlementDecision 
  } = useApp();

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionType>(settlement.aiRecommendation);
  const [overrideReason, setOverrideReason] = useState('');

  const handleSaveOverride = () => {
    if (!overrideReason.trim()) return;
    overrideSettlementDecision(settlement.id, selectedIntervention, overrideReason);
    setIsOverrideModalOpen(false);
  };

  const handleApprove = () => {
    approveSettlementDecision(settlement.id, 'DDMA Field Officer & Collector Verified.');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                EXPLAINABLE AI RISK & DECISION AUDIT
              </h3>
              <p className="text-[11px] text-slate-400">
                100% transparent algorithmic feature attribution & human oversight
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDecisionTraceOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 transition-colors self-start sm:self-auto"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Trace Logic Graph</span>
          </button>
        </div>

        {/* 4 Essential Questions Tabs / Sections */}
        <div className="space-y-3 mt-3">
          {/* 1. WHY? */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                1. WHY IS RISK SCORE {settlement.overallRisk}/100?
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Feature Weight Breakdown</span>
            </div>

            <div className="space-y-2">
              {settlement.explainableFactors.map((factor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{factor.factor}</span>
                    <span className="font-mono font-bold text-red-400">+{factor.contribution} pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        factor.isCritical ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, factor.contribution * 3.5)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">{factor.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. HOW CONFIDENT & WHERE DID DATA COME FROM? */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                2. DATA SOURCES & CONFIDENCE ({settlement.dataConfidence}%)
              </span>
              <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 uppercase">
                DEMO / SYNTHETIC DATA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Satellite SAR InSAR</div>
                  <div className="text-[10px] text-slate-400">Shoreline Scarp Retreat Rate</div>
                </div>
                <span className="font-mono font-bold text-emerald-400">95% Conf</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Regional Met-Ocean Vector</div>
                  <div className="text-[10px] text-slate-400">Category 4 Storm Surge</div>
                </div>
                <span className="font-mono font-bold text-emerald-400">92% Conf</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Basin DEM 5m Model</div>
                  <div className="text-[10px] text-slate-400">Estuarine Fluvial Runoff</div>
                </div>
                <span className="font-mono font-bold text-emerald-400">89% Conf</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Ground Truth Field Audit</div>
                  <div className="text-[10px] text-slate-400">Verified by DDMA Field Team</div>
                </div>
                <span className="font-mono font-bold text-cyan-400">✓ Verified</span>
              </div>
            </div>
          </div>

          {/* 3. CAN HUMAN REVIEW / OVERRIDE? */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                3. HUMAN-IN-THE-LOOP AUTHORITY
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Status: <strong className="text-cyan-400">{settlement.humanReviewStatus || 'PENDING_OFFICER_REVIEW'}</strong>
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              "AI recommends. Human authority decides." Official relocation sanction requires authorized district collector approval.
            </p>

            {settlement.officerDecisionOverride && (
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-200">
                <strong>Officer Override Active:</strong> Changed to {settlement.officerDecisionOverride} ({settlement.officerOverrideReason}) at {settlement.officerOverrideTimestamp}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleApprove}
                className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sanction AI Recommendation</span>
              </button>

              <button
                onClick={() => setIsOverrideModalOpen(true)}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Override
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Override Modal */}
      {isOverrideModalOpen && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500 shadow-2xl space-y-3 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-sm">Human Authority Decision Override</span>
            <button onClick={() => setIsOverrideModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Select Alternative Strategic Intervention:</label>
            <select
              value={selectedIntervention}
              onChange={(e) => setSelectedIntervention(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none"
            >
              <option value="PROTECT">PROTECT (In-Situ Hard Defense)</option>
              <option value="ADAPT">ADAPT (In-Situ Plinth & Drainage Upgrade)</option>
              <option value="PARTIAL_RELOCATION">PARTIAL RELOCATION (Relocate Red Zones Only)</option>
              <option value="FULL_RELOCATION">FULL RELOCATION (Complete Village Resettlement)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Official Justification / Rationale:</label>
            <textarea
              rows={2}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="State administrative or field rationale for overriding algorithmic recommendation..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsOverrideModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOverride}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Save Override & Log Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

