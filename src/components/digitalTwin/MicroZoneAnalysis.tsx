import React, { useState } from 'react';
import { Settlement, MicroZone } from '../../types';
import { Badge } from '../common/Badge';
import { Layers, Users, ShieldAlert, ArrowRight, CheckCircle2, Home } from 'lucide-react';

export const MicroZoneAnalysis: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const [selectedZone, setSelectedZone] = useState<MicroZone | null>(
    settlement.microZones.length > 0 ? settlement.microZones[0] : null
  );

  if (settlement.microZones.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-center py-8">
        <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white">Uniform Risk Zone Profile</h4>
        <p className="text-xs text-slate-400 mt-1">Single micro-zone classification across {settlement.areaSqKm} sq km.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Intra-Settlement Micro-Zone Disaggregation
            </h3>
            <p className="text-[11px] text-slate-400">
              Avoids blanket village displacement through granular risk zoning
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-700/60 uppercase">
          CORE INNOVATION
        </span>
      </div>

      {/* Micro-Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {settlement.microZones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;

          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {zone.zoneCode}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight">{zone.name}</h4>
                  </div>
                  <Badge variant="risk" level={zone.riskLevel} size="sm" />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 my-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population:</span>
                    <span className="font-bold text-white font-mono">{zone.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Households:</span>
                    <span className="font-bold text-white font-mono">{zone.households}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hazard Score:</span>
                    <span className="font-bold text-red-400 font-mono">{zone.riskScore} / 100</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Action:</span>
                <Badge variant="intervention" level={zone.recommendation} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Micro-Zone Detail View */}
      {selectedZone && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Zoning Decision Justification: {selectedZone.name}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {selectedZone.population.toLocaleString()} residents affected
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {selectedZone.reason}
          </p>
        </div>
      )}
    </div>
  );
};
