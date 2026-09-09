import React from 'react';
import { CarryingCapacityBreakdown } from '../../types';
import { Users, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const CarryingCapacityMeter: React.FC<{ capacity: CarryingCapacityBreakdown; allocated?: number }> = ({
  capacity,
  allocated = 2650
}) => {
  const maxCap = capacity.recommendedMaxCapacity;
  const usagePct = Math.min(100, Math.round((allocated / maxCap) * 100));

  const capacityMetrics = [
    { label: 'Physical Land Area', cap: capacity.physicalLandCapacity, color: 'bg-emerald-500' },
    { label: 'Water Feeder Supply', cap: capacity.waterSupportedCapacity, color: 'bg-cyan-500' },
    { label: 'Road Network Throughput', cap: capacity.roadNetworkCapacity, color: 'bg-blue-500' },
    { label: 'Health Sub-centre Grid', cap: capacity.healthcareCapacity, color: 'bg-purple-500' }
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider">CARRYING CAPACITY AUDIT</span>
        </div>
        <span className="font-mono font-bold text-cyan-300">
          {allocated.toLocaleString()} / {maxCap.toLocaleString()} Allocated ({usagePct}%)
        </span>
      </div>

      {/* Main Usage Bar */}
      <div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              usagePct > 90 ? 'bg-red-500' : usagePct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0 (Empty)</span>
          <span>Recommended Cap: {maxCap.toLocaleString()} Persons</span>
        </div>
      </div>

      {/* Subsystem Capacities */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        {capacityMetrics.map(m => (
          <div key={m.label} className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">{m.label}</span>
            <span className="font-mono font-bold text-white text-xs">{m.cap.toLocaleString()} persons</span>
          </div>
        ))}
      </div>

      {/* Bottleneck Warning */}
      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-[11px] text-cyan-300 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Capacity Constraint: </span>
          <span>{capacity.bottleneckResource}. Recommended capacity strictly honors lowest critical utility threshold.</span>
        </div>
      </div>
    </div>
  );
};
