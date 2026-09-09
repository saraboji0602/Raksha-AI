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
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const ScenarioSimulator: React.FC = () => {
  const { settlements, selectedSettlementId, setSelectedSettlementId, addToast, setCurrentPage } = useApp();
  const currentSettlement = settlements.find(s => s.id === selectedSettlementId) || settlements[0];

  const [investmentCr, setInvestmentCr] = useState<number>(28);
  const [selectedScenarioTab, setSelectedScenarioTab] = useState<'PARTIAL_RELOCATION' | 'ADAPT' | 'PROTECT' | 'DO_NOTHING'>('PARTIAL_RELOCATION');

  const scenarios = ScenarioService.generateScenarios(currentSettlement);
  const simResult = ScenarioService.simulateCustomInvestment(currentSettlement, investmentCr);

  const comparisonChartData = scenarios.map(s => ({
    name: s.name.split(' (')[0],
    investment: s.investmentCr,
    riskReduction: s.riskReductionPct,
    protectedPop: Math.round(s.populationProtectedOrRelocated / 100),
    residualRisk: s.residualRisk
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
                INTERACTIVE AI
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Dynamic Policy & Budget Impact Modeling
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore how capital allocation thresholds shift risk curves, population protection rates, and public savings.
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
            <span className="text-xs text-slate-400 font-mono">Current Budget:</span>
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
              {simResult.residualRisk <= 30 ? 'Low Risk Zone' : 'Moderate Exposure'}
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
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Dynamic Strategy</span>
            <div className="mt-1">
              <Badge variant="intervention" level={simResult.dynamicRecommendation} size="sm" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Avoids ₹{simResult.avoidedDamageCr} Cr damage</div>
          </div>
        </div>
      </div>

      {/* Comparative 4-Scenario Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {scenarios.map((scen) => {
          const isSelected = selectedScenarioTab === scen.type;

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
                    <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                      OPTIMAL
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{scen.name}</h4>
                <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                  Budget: <strong className="text-white">₹{scen.investmentCr} Cr</strong>
                </div>

                <div className="my-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Reduction:</span>
                    <span className="font-mono font-bold text-emerald-400">{scen.riskReductionPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Residual Risk:</span>
                    <span className="font-mono font-bold text-slate-300">{scen.residualRisk} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Citizens Protected:</span>
                    <span className="font-mono font-bold text-white">{scen.populationProtectedOrRelocated.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">{scen.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Residual Risk: <strong>{scen.residualRiskLevel}</strong></span>
                <span className="font-mono text-cyan-400 font-bold">{scen.implementationYears} Yrs</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario Comparison Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Multi-Scenario Tradeoff Benchmark</h3>
            <p className="text-[11px] text-slate-400">Comparing Capital Cost (₹ Cr) vs Modeled Risk Reduction (%)</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">Decision Tradeoff Space</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
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
              <Bar dataKey="investment" fill="#38bdf8" name="Capital Investment (₹ Cr)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="riskReduction" fill="#10b981" name="Risk Reduction (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="residualRisk" fill="#ef4444" name="Residual Risk Score (/100)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
