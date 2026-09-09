import React from 'react';
import { useApp } from '../store/useAppStore';
import { ProtectAdaptRelocateCards } from '../components/intervention/ProtectAdaptRelocateCards';
import { CostOfInactionCard } from '../components/intervention/CostOfInactionCard';
import { GitBranch, Building2, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const InterventionPage: React.FC = () => {
  const { settlements, selectedSettlementId, setSelectedSettlementId, getSelectedSettlement, setCurrentPage } = useApp();
  const settlement = getSelectedSettlement();

  return (
    <div className="space-y-6">
      {/* Top Banner & Habitation Selector */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-purple-950/70 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0 mt-0.5">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wide">
                AI DECISION INTELLIGENCE CORE
              </span>
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 uppercase">
                PROTECT → ADAPT → RELOCATE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              What Should Authorities Do for {settlement.name}?
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Evaluating risk attenuation, capital feasibility, residual threat, and community livelihood continuity across 4 strategic options.
            </p>
          </div>
        </div>

        {/* Habitation Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-700/80 self-end sm:self-auto flex-shrink-0">
          <span className="text-xs text-slate-400 font-medium pl-1">Target:</span>
          <select
            value={settlement.id}
            onChange={(e) => setSelectedSettlementId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none cursor-pointer"
          >
            {settlements.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (Risk: {s.overallRisk})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Protect vs Adapt vs Relocate Cards */}
      <ProtectAdaptRelocateCards settlement={settlement} />

      {/* Cost of Inaction & Public Economics */}
      <CostOfInactionCard settlement={settlement} />
    </div>
  );
};
