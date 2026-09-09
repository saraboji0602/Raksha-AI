import React from 'react';
import { Settlement } from '../../types';
import { useApp } from '../../store/useAppStore';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, Network } from 'lucide-react';

export const ExplainableFactors: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const { setIsDecisionTraceOpen } = useApp();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                WHY IS THIS SETTLEMENT HIGH RISK?
              </h3>
              <p className="text-[11px] text-slate-400">Explainable AI feature attribution & rank-ordered risk drivers</p>
            </div>
          </div>

          <button
            onClick={() => setIsDecisionTraceOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>View Methodology</span>
          </button>
        </div>

        {/* Explainable factor contribution rows */}
        <div className="space-y-2">
          {settlement.explainableFactors.map((factor, index) => {
            const isPositive = factor.contribution > 0;
            return (
              <div
                key={index}
                className={`p-3 rounded-xl border transition-all ${
                  factor.isCritical
                    ? 'bg-red-950/25 border-red-800/50'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{index + 1}</span>
                    <span className="text-xs font-bold text-white">{factor.factor}</span>
                  </div>

                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                      isPositive
                        ? factor.isCritical
                          ? 'bg-red-900/80 text-red-200 border border-red-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isPositive ? `+${factor.contribution}` : factor.contribution} pts
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">{factor.description}</p>

                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 uppercase font-mono">
                  <span>Category: {factor.category}</span>
                  {factor.isCritical && (
                    <span className="text-red-400 font-bold flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Primary Threat
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl flex items-center justify-between">
        <span>Transparent Multi-Factor Decomposition</span>
        <span className="text-cyan-400 font-mono font-bold">Sum: {settlement.overallRisk} pts</span>
      </div>
    </div>
  );
};
