import React, { useState } from 'react';
import { Settlement } from '../../types';
import { ScenarioService } from '../../services/scenarioService';
import { Coins, AlertOctagon, TrendingUp, Info, HelpCircle, FileText } from 'lucide-react';

export const CostOfInactionCard: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const assumptions = ScenarioService.getCostBreakdownAssumptions(settlement);

  const interventionCost = settlement.costRelocateCr;
  const inactionCost = settlement.costOfInactionCr;
  const netSavings = inactionCost - interventionCost;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800/60">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              COST OF INACTION & ECONOMIC JUSTIFICATION
            </h3>
            <p className="text-[11px] text-slate-400">
              Scenario-based estimate: Proactive planned intervention vs emergency disaster recovery
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors w-fit"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showAssumptions ? 'Hide Unit Assumptions' : 'View Unit Cost Assumptions'}</span>
        </button>
      </div>

      {/* Comparative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Intervention Cost */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Proactive Partial Relocation
            </span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">₹{interventionCost} Cr</div>
            <p className="text-[11px] text-slate-400 mt-0.5">One-time capital infrastructure & resettlement budget</p>
          </div>
          <span className="mt-3 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 w-fit">
            ✓ 76% Permanent Risk Reduction
          </span>
        </div>

        {/* 10-Yr Inaction Exposure */}
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/60 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-red-300 uppercase tracking-wide">
              10-Year Inaction Exposure
            </span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">₹{inactionCost} Cr</div>
            <p className="text-[11px] text-red-200/70 mt-0.5">Cumulative relief, sea breach damages & reconstruction losses</p>
          </div>
          <span className="mt-3 text-[10px] font-mono text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-800 w-fit">
            ⚠ Exposure continues to compound
          </span>
        </div>

        {/* Net Public Savings */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
              Estimated Net Public Savings
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">₹{netSavings} Cr</div>
            <p className="text-[11px] text-emerald-200/70 mt-0.5">Avoided damages over 10-year fiscal horizon</p>
          </div>
          <span className="mt-3 text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 w-fit">
            ★ ROI Ratio: 3.4x Benefit
          </span>
        </div>
      </div>

      {/* Assumptions Table Modal/Drawer */}
      {showAssumptions && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white uppercase tracking-wide">
              Transparent Unit Costing & Budget Assumptions
            </span>
            <span className="text-[10px] font-mono text-slate-400">Total: ₹{interventionCost} Cr</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-slate-800">
              <thead>
                <tr className="text-[10px] font-semibold text-slate-400 uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Unit Benchmark</th>
                  <th className="py-2 text-right">Total (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {assumptions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2 font-medium text-white">{item.item}</td>
                    <td className="py-2 font-mono">{item.quantity} {item.unit}</td>
                    <td className="py-2 font-mono">₹{item.unitCostLakhs} Lakhs</td>
                    <td className="py-2 text-right font-mono font-bold text-cyan-300">₹{item.totalCr} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
