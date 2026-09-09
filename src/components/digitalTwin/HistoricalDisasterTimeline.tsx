import React from 'react';
import { Settlement } from '../../types';
import { History, AlertTriangle, Calendar, Users, Landmark } from 'lucide-react';

export const HistoricalDisasterTimeline: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  if (settlement.historicalEvents.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-center py-6">
        <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white">Historical Records Archive</h4>
        <p className="text-xs text-slate-400 mt-1">No major historical disaster declarations recorded in district gazette.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Decadal Historical Disaster Chronology</h3>
            <p className="text-[11px] text-slate-400">Ground impact records from district disaster archives</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-cyan-400">
          {settlement.historicalEvents.length} Major Recorded Events
        </span>
      </div>

      {/* Horizontal / Vertical Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-3 pl-5 space-y-4">
        {settlement.historicalEvents.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Year Bubble */}
            <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-500 text-cyan-400 font-mono text-[9px] font-bold flex items-center justify-center">
              ●
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-cyan-400 text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    {evt.year}
                  </span>
                  <span className="font-bold text-white text-xs">{evt.title}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  Severity: <span className="text-red-400">{evt.severity}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-snug">{evt.impactDesc}</p>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-mono">
                {evt.displacedCount > 0 && (
                  <span className="text-amber-300">
                    Displaced: {evt.displacedCount.toLocaleString()} persons
                  </span>
                )}
                {evt.damageEstCr > 0 && (
                  <span className="text-slate-300">
                    Infrastructure Loss: ₹{evt.damageEstCr} Cr
                  </span>
                )}
                {evt.fatalities > 0 && (
                  <span className="text-rose-400 font-bold">
                    Fatalities: {evt.fatalities}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
