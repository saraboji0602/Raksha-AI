import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const WhatChangedPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { 
    whatChangedEvents, 
    kadalpuramSimulationMode, 
    toggleRisingRiverSimulation 
  } = useApp();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                "WHAT CHANGED?" INTELLIGENCE FEED
              </span>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 uppercase">
                REAL-TIME DELTA
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Recent Hazard & Risk Telemetry Deltas
            </h3>
          </div>
        </div>

        {/* Dynamic Simulator Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRisingRiverSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${
              kadalpuramSimulationMode === 'RISING_RIVER_SURGE'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-500 shadow-red-950/50'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 border-cyan-400 shadow-cyan-950/50'
            }`}
            title="Toggle between normal monsoon baseline (Risk 72) and monsoonal river rise / surge (Risk 91)"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>
              {kadalpuramSimulationMode === 'RISING_RIVER_SURGE'
                ? 'Simulating Surge (Risk 91) ⇄ Reset Baseline (72)'
                : 'Baseline (Risk 72) ⇄ Simulate River Surge (91)'}
            </span>
          </button>
        </div>
      </div>

      {/* Events Grid / List */}
      <div className={`mt-4 grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'}`}>
        {whatChangedEvents.map((evt) => {
          const isCritical = evt.severity === 'CRITICAL';

          return (
            <div
              key={evt.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'bg-red-950/20 border-red-800/60 text-slate-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{evt.timestamp}</span>
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {evt.delta}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-tight">{evt.title}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5">{evt.parameter}</div>

                {/* Before vs After Comparison */}
                <div className="my-2.5 p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase">Before</span>
                    <span className="text-slate-300 font-bold">{evt.beforeValue}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] text-slate-500 uppercase">After</span>
                    <span className={`font-bold ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                      {evt.afterValue}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{evt.rationale}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                <span>Source: Synthetic Telemetry</span>
                <span className="text-cyan-400 uppercase font-semibold">{evt.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
