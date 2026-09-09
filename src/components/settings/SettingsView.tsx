import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Settings, Sliders, Shield, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SCORING_WEIGHTS } from '../../services/riskEngineService';

export const SettingsView: React.FC = () => {
  const { scoringWeights, setScoringWeights, addToast } = useApp();

  const totalWeight =
    scoringWeights.hazardWeight +
    scoringWeights.exposureWeight +
    scoringWeights.vulnerabilityWeight +
    scoringWeights.infrastructureWeight +
    scoringWeights.historicalWeight +
    scoringWeights.resilienceWeight;

  const handleResetDefaults = () => {
    setScoringWeights(DEFAULT_SCORING_WEIGHTS);
    addToast({
      type: 'info',
      title: 'Scoring Weights Reset to Government Benchmark',
      description: 'Default multi-criteria decision parameters applied.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              SYSTEM CONFIGURATION & POLICY WEIGHTS
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Decision Engine Multi-Criteria Calibration
            </h2>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Warning banner */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-white mb-0.5">Statutory Parameter Calibration:</strong>
          Modifying scoring weights recalculates prototype multi-hazard risk scores and relocation prioritization queues in real-time. Ensure total weight sums to 100%.
        </div>
      </div>

      {/* Weights Sliders Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Scoring Criteria Weight Distribution
          </h3>
          <span
            className={`font-mono font-bold text-sm px-3 py-1 rounded-xl border ${
              totalWeight === 100
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-rose-950 text-rose-300 border-rose-800'
            }`}
          >
            Total: {totalWeight}% {totalWeight === 100 ? '✓ Balanced' : '⚠ Must Equal 100%'}
          </span>
        </div>

        <div className="space-y-4">
          {/* Hazard */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Hazard Severity & Inundation Line (InSAR / Hydro)</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.hazardWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={scoringWeights.hazardWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, hazardWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>

          {/* Exposure */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Population Exposure & Inundation Density</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.exposureWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={scoringWeights.exposureWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, exposureWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>

          {/* Vulnerability */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Socio-Economic & Housing Vulnerability</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.vulnerabilityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={scoringWeights.vulnerabilityWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, vulnerabilityWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>

          {/* Infrastructure Fragility */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Infrastructure Egress Fragility & Chokepoints</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.infrastructureWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={scoringWeights.infrastructureWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, infrastructureWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>

          {/* Historical Events */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Decadal Historical Disaster Frequency</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.historicalWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={scoringWeights.historicalWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, historicalWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>

          {/* Resilience */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Local Adaptive Capacity & Shelter Defense</span>
              <span className="font-mono text-cyan-400 font-bold">{scoringWeights.resilienceWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={scoringWeights.resilienceWeight}
              onChange={(e) => setScoringWeights({ ...scoringWeights, resilienceWeight: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
