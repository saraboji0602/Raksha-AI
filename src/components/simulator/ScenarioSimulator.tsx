import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { ScenarioService } from '../../services/scenarioService';
import { Badge } from '../common/Badge';
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  Coins, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Scale,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';

export const ScenarioSimulator: React.FC = () => {
  const { settlements, selectedSettlementId, setSelectedSettlementId, addToast, setCurrentPage } = useApp();
  const currentSettlement = settlements.find(s => s.id === selectedSettlementId) || settlements[0];

  const [investmentCr, setInvestmentCr] = useState<number>(28);
  const [selectedScenarioTab, setSelectedScenarioTab] = useState<'PARTIAL_RELOCATION' | 'ADAPT' | 'PROTECT' | 'DO_NOTHING' | 'FULL_RELOCATION'>('PARTIAL_RELOCATION');

  const scenarios = ScenarioService.generateScenarios(currentSettlement);
  const simResult = ScenarioService.simulateCustomInvestment(currentSettlement, investmentCr);
  const tenYearTrajectory = ScenarioService.getTenYearTrajectory(currentSettlement);
  const costBreakdown = ScenarioService.getCostBreakdownAssumptions(currentSettlement);

  const comparisonChartData = scenarios.map(s => ({
    name: s.name.split(' (')[0],
    investment: s.investmentCr,
    riskReduction: s.riskReductionPct,
    protectedPop: Math.round(s.populationProtectedOrRelocated / 100),
    residualRisk: s.residualRisk,
    inactionCost: s.costOfInactionCr
  }));

  return (
    <div className="space-y-6">
      {/* Header & Settlement Selector */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/70 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                WHAT-IF DISASTER & INTERVENTION SIMULATOR
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                5-POLICY DECISION MATRIX
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Dynamic Policy & Cost of Inaction Modeling
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Model multi-hazard mitigation economics for <strong className="text-white">{currentSettlement.name}</strong>. Compare 5 strategic interventions against the compounding fiscal and human cost of doing nothing.
            </p>
          </div>
        </div>

        {/* Settlement Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-700/80 self-end md:self-center flex-shrink-0">
          <span className="text-xs text-slate-400 font-medium pl-1">Habitation:</span>
          <select
            value={currentSettlement.id}
            onChange={(e) => setSelectedSettlementId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none cursor-pointer"
          >
            {settlements.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.district.split(' ')[0]}) - Risk {s.overallRisk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cost of Inaction Callout Banner */}
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
              10-YEAR PROJECTED COST OF INACTION
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">
              Taking no preventive action will cost <span className="text-rose-400 font-mono font-bold">₹{currentSettlement.costOfInactionCr} Cr</span> in recurrent emergency response, infrastructure loss, and citizen displacement.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase">ROI of Prevention</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              +{(currentSettlement.costOfInactionCr / (currentSettlement.costRelocateCr || 1)).toFixed(1)}x Net Savings
            </div>
          </div>
        </div>
      </div>

      {/* WOW MOMENT: Dynamic Interactive Investment Slider */}
      <div className="p-5 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Simulate Public Budget Investment (₹ Cr)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Drag the slider to dynamically observe risk reduction and AI recommendation transitions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Simulated Budget:</span>
            <span className="font-mono font-black text-2xl text-cyan-400 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-700/60 shadow-inner">
              ₹{investmentCr} Cr
            </span>
          </div>
        </div>

        {/* The Range Slider */}
        <div className="px-2 py-2">
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={investmentCr}
            onChange={(e) => setInvestmentCr(Number(e.target.value))}
            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none border border-slate-700"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>₹0 Cr (Do Nothing)</span>
            <span>₹12 Cr (Protect)</span>
            <span>₹19 Cr (Adapt)</span>
            <span>₹28 Cr (Partial Relocation)</span>
            <span>₹45 Cr (Full Relocation)</span>
          </div>
        </div>

        {/* Dynamic Simulation KPI Outputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Risk Reduction</span>
            <div className="font-mono font-black text-xl text-emerald-400 mt-0.5">
              {simResult.riskReductionPct}%
            </div>
            <div className="text-[10px] text-slate-500">Modeled threat attenuation</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Residual Risk</span>
            <div className="font-mono font-black text-xl text-amber-400 mt-0.5">
              {simResult.residualRisk} / 100
            </div>
            <div className="text-[10px] text-slate-500">
              {simResult.residualRisk <= 30 ? 'Low Residual Exposure' : 'Moderate Exposure'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Population Protected</span>
            <div className="font-mono font-black text-xl text-cyan-300 mt-0.5">
              {simResult.populationProtected.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">of {currentSettlement.population.toLocaleString()} citizens</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Optimal Strategy</span>
            <div className="mt-1">
              <Badge variant="intervention" level={simResult.dynamicRecommendation} size="sm" />
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">Avoids ₹{simResult.avoidedDamageCr} Cr loss</div>
          </div>
        </div>
      </div>

      {/* Comparative 5-Scenario Analysis Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            5-Policy Decision Matrix & Cost of Inaction Comparison
          </h3>
          <span className="text-xs text-slate-400 font-mono">Select a policy to analyze details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {scenarios.map((scen) => {
            const isSelected = selectedScenarioTab === scen.type;
            const bcr = scen.investmentCr > 0 ? (Math.round((scen.riskReductionPct / 100) * currentSettlement.costOfInactionCr) / scen.investmentCr).toFixed(1) : '0.0';

            return (
              <div
                key={scen.type}
                onClick={() => setSelectedScenarioTab(scen.type as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-850 border-cyan-500 shadow-xl ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="intervention" level={scen.type} size="sm" />
                    {scen.isAIRecommended && (
                      <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">{scen.name}</h4>
                  <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                    Capex: <strong className="text-white">₹{scen.investmentCr} Cr</strong>
                  </div>

                  <div className="my-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Cut:</span>
                      <span className="font-mono font-bold text-emerald-400">+{scen.riskReductionPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Residual:</span>
                      <span className="font-mono font-bold text-slate-300">{scen.residualRisk}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Benefit/Cost:</span>
                      <span className="font-mono font-bold text-cyan-400">{bcr}x BCR</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">{scen.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Residual: <strong className="text-slate-300">{scen.residualRiskLevel}</strong></span>
                  <span className="font-mono text-cyan-400 font-bold">{scen.implementationYears} Yrs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10-Year Cumulative Damage & Fiscal Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">10-Year Cumulative Loss Trajectory</h3>
              </div>
              <p className="text-[11px] text-slate-400">Compounding disaster damage (₹ Cr) vs upfront prevention costs</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">Inaction vs Action</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tenYearTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Do Nothing" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Protect" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Adapt" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Partial Relocation" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Full Relocation" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Scenario Tradeoff Benchmark Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Capital Cost vs Risk Attenuation</h3>
              </div>
              <p className="text-[11px] text-slate-400">Comparing Capital Cost (₹ Cr) vs Modeled Risk Reduction (%)</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">Tradeoff Space</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="investment" fill="#38bdf8" name="Capex (₹ Cr)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="riskReduction" fill="#10b981" name="Risk Reduction (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="residualRisk" fill="#ef4444" name="Residual Risk (/100)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Relocation / Prevention Itemized Budget Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Itemized Public Expenditure & Resettlement Model (Kadalpuram → Site B)
              </h3>
              <p className="text-[11px] text-slate-400">Auditable civil engineering cost assumptions compliant with PMAY-G and SDRF guidelines</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Total Package: ₹{costBreakdown.reduce((acc, c) => acc + c.totalCr, 0).toFixed(2)} Cr
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950/60">
                <th className="py-2.5 px-3">Infrastructure / Mitigation Line Item</th>
                <th className="py-2.5 px-3">Metric Unit</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹ Lakhs)</th>
                <th className="py-2.5 px-3 text-right">Allocation (₹ Cr)</th>
                <th className="py-2.5 px-3">Standards & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {costBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{item.item}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.unit}</td>
                  <td className="py-2.5 px-3 font-mono text-right">{item.quantity}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-300">₹{item.unitCostLakhs} L</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-cyan-400">₹{item.totalCr} Cr</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
