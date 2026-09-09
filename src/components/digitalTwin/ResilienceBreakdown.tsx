import React from 'react';
import { Settlement } from '../../types';
import { ShieldCheck, ShieldAlert, Wifi, Zap, Droplet, Home, Route } from 'lucide-react';

export const ResilienceBreakdown: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const infra = settlement.infrastructure;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Adaptive Capacity & Resilience</h3>
              <p className="text-[11px] text-slate-400">Low resilience increases relocation urgency</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            Resilience: {settlement.resilienceScore}/100 ({settlement.resilienceScore < 50 ? 'LOW' : 'MODERATE'})
          </span>
        </div>

        {/* Infrastructure Metrics List */}
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold text-white block">Cyclone Shelter Capacity</span>
                <span className="text-[10px] text-slate-400">{infra.emergencyShelters.count} shelter ({infra.emergencyShelters.capacity} persons)</span>
              </div>
            </div>
            <span className="font-mono font-bold text-amber-400">
              Covers {Math.round((infra.emergencyShelters.capacity / settlement.population) * 100)}% pop
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-bold text-white block">Egress Route Redundancy</span>
                <span className="text-[10px] text-slate-400">Single route ({settlement.primaryEvacRoute})</span>
              </div>
            </div>
            <span className="font-mono font-bold text-rose-400">Fragile (Bridge B-07)</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold text-white block">Drinking Water Security</span>
                <span className="text-[10px] text-slate-400">Score: {infra.waterSupply.score}/100</span>
              </div>
            </div>
            <span className="font-mono font-bold text-amber-400">Reliability: {infra.waterSupply.reliability}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Early Warning Telemetry</span>
                <span className="text-[10px] text-slate-400">Telecom grid: {infra.telecomCoverage}%</span>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl">
        <span className="font-bold text-amber-300">Resilience Gap: </span>
        <span>Low shelter capacity (450 of 4,820) combined with bridge flooding during tidal surge makes relocation safer than in-situ sheltering.</span>
      </div>
    </div>
  );
};
