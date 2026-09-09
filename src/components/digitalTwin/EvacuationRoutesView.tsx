import React from 'react';
import { Settlement } from '../../types';
import { Route, AlertTriangle, Clock, Milestone, Shield, CheckCircle } from 'lucide-react';

export const EvacuationRoutesView: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-950 text-yellow-400 border border-yellow-800/60">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Evacuation Routes & Choke Points</h3>
            <p className="text-[11px] text-slate-400">Transit egress bottlenecks during active surge/cyclone events</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
          <Clock className="w-3.5 h-3.5" />
          <span>Est. Transit: {settlement.evacuationTimeMin} mins</span>
        </div>
      </div>

      {/* Routes & Bottleneck Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Primary Route */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wide">Primary Route</span>
              <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="text-sm font-bold text-white">{settlement.primaryEvacRoute}</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Elevated paved state highway corridor providing direct transit to inland relief centers.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Heavy vehicle accessible</span>
          </div>
        </div>

        {/* Secondary Route */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-300 uppercase tracking-wide">Secondary Route</span>
              <span className="font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                RESTRICTED
              </span>
            </div>
            <div className="text-sm font-bold text-white">{settlement.secondaryEvacRoute}</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Canal embankment causeway track; submersed during high-tide &gt;1.5m spring tides.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Light vehicles only during dry hours</span>
          </div>
        </div>

        {/* Critical Bottleneck */}
        <div className="p-3.5 rounded-xl bg-red-950/25 border border-red-800/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-red-400 uppercase tracking-wide">Critical Choke Point</span>
              <span className="font-mono text-[10px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800 font-bold">
                HIGH RISK
              </span>
            </div>
            <div className="text-sm font-bold text-white">{settlement.evacBottleneck}</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Single lane structure prone to waterlogging and vehicle jams during panic evacuations.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-red-900/50 text-[10px] text-red-300 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Requires SDRF boat deployment standby</span>
          </div>
        </div>
      </div>
    </div>
  );
};
