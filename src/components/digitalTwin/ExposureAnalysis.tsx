import React from 'react';
import { Settlement } from '../../types';
import { Users, Baby, HeartPulse, Building2, School, Hospital, Droplet, Milestone } from 'lucide-react';

export const ExposureAnalysis: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Population & Asset Exposure</h3>
            <p className="text-[11px] text-slate-400">Demographic vulnerability and physical infrastructure in hazard zone</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
          {settlement.exposedPercentage}% EXPOSED
        </span>
      </div>

      {/* Demographic Exposure Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Exposed</span>
          </div>
          <div className="font-bold text-lg text-white font-mono">{settlement.exposedPopulation.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">{settlement.exposedPercentage}% of total population</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Baby className="w-3.5 h-3.5 text-amber-400" />
            <span>Children (&lt;10 yrs)</span>
          </div>
          <div className="font-bold text-lg text-white font-mono">{settlement.childrenCount}</div>
          <div className="text-[10px] text-slate-500">Requires school transit</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Elderly (&gt;60 yrs)</span>
          </div>
          <div className="font-bold text-lg text-white font-mono">{settlement.elderlyCount}</div>
          <div className="text-[10px] text-slate-500">Requires medical priority</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Special Assistance</span>
          </div>
          <div className="font-bold text-lg text-white font-mono">{settlement.specialAssistanceCount}</div>
          <div className="text-[10px] text-slate-500">Evacuation wheelchair support</div>
        </div>
      </div>

      {/* Critical Infrastructure Exposure */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Critical Infrastructure in Hazard Envelope
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold text-white block">Schools</span>
                <span className="text-[10px] text-slate-400">Total: {settlement.infrastructure.schools.count}</span>
              </div>
            </div>
            <span className="font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
              {settlement.infrastructure.schools.exposed} in Red Zone
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hospital className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-bold text-white block">Healthcare</span>
                <span className="text-[10px] text-slate-400">{settlement.infrastructure.healthcare.facilityType}</span>
              </div>
            </div>
            <span className="font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
              {settlement.infrastructure.healthcare.exposed} in Red Zone
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Milestone className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-white block">Road Egress</span>
                <span className="text-[10px] text-slate-400">Score: {settlement.infrastructure.roads.accessScore}/100</span>
              </div>
            </div>
            <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              {settlement.infrastructure.roads.primaryRouteBlocked ? 'Blocked' : 'Vulnerable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
