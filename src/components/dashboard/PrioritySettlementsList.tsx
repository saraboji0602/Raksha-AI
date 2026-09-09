import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { Building2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const PrioritySettlementsList: React.FC = () => {
  const { settlements, setSelectedSettlementId, setCurrentPage } = useApp();

  // Sort by priority score descending
  const topPriorities = [...settlements]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800/60">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Today's Priority Action Queue</h3>
              <p className="text-[11px] text-slate-400">AI-ranked vulnerable habitations needing immediate administrative sanction</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('settlements')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All ({settlements.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority Rows */}
        <div className="divide-y divide-slate-800/80">
          {topPriorities.map((settlement, index) => (
            <div
              key={settlement.id}
              onClick={() => {
                setSelectedSettlementId(settlement.id);
                setCurrentPage('settlement-detail');
              }}
              className="py-3 px-2 hover:bg-slate-850/60 rounded-xl cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  #{index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {settlement.name}
                    </span>
                    <Badge variant="priority" level={settlement.priority} size="sm" />
                    {settlement.id === 'kadalpuram' && (
                      <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-700/60">
                        FLAGSHIP DEMO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{settlement.district}</span>
                    <span>•</span>
                    <span>Pop: {settlement.population.toLocaleString()} ({settlement.relocationPopulation.toLocaleString()} Relocate)</span>
                    <span>•</span>
                    <span className="text-slate-300">Confidence: {settlement.dataConfidence}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-red-400">
                    Risk: {settlement.overallRisk}/100
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold">
                    {settlement.aiRecommendation.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Priority formula evaluates: Risk × Exposure × Vulnerability × Low Resilience</span>
        </span>
        <button
          onClick={() => setCurrentPage('relocation')}
          className="text-cyan-400 hover:underline font-bold"
        >
          Open Allocation Optimizer →
        </button>
      </div>
    </div>
  );
};
