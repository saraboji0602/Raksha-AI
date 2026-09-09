import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { PhasingRoadmap } from './PhasingRoadmap';
import { 
  Compass, 
  Users, 
  ShieldCheck, 
  Home, 
  ArrowRight, 
  Sparkles, 
  Route, 
  Coins, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const RelocationOptimizer: React.FC = () => {
  const { getSelectedSettlement, getSelectedSafeSite, setCurrentPage, addToast } = useApp();
  const settlement = getSelectedSettlement();
  const safeSite = getSelectedSafeSite();

  const [relocateCount, setRelocateCount] = useState<number>(settlement.relocationPopulation || 2650);
  const [adaptCount, setAdaptCount] = useState<number>(settlement.adaptationPopulation || 1220);
  const [protectCount, setProtectCount] = useState<number>(settlement.protectionPopulation || 950);

  const totalPop = settlement.population;
  const safeSiteCapacity = safeSite.capacity.recommendedMaxCapacity;

  return (
    <div className="space-y-6">
      {/* Top Banner / Objective Function */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                RELOCATION ALLOCATION OPTIMIZER
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                MULTI-OBJECTIVE OPTIMAL
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Target Habitation: {settlement.name} → Destination: {safeSite.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Minimizes: [ Relocation Cost × Travel Distance × Social Disruption ] while Maximizing: [ Life Safety × Community Acceptance × Livelihood Continuity ].
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'success',
              title: 'Allocation Plan Formally Sanctioned',
              description: `${relocateCount.toLocaleString()} residents queued for Phase 1-3 resettlement to ${safeSite.name}.`
            });
            setCurrentPage('reports');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-end md:self-center flex-shrink-0 active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>Sanction Relocation Plan</span>
        </button>
      </div>

      {/* Population Allocation Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Zone A: Relocate */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-600/70 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="intervention" level="PARTIAL_RELOCATION" size="sm" />
              <span className="text-xs font-mono font-bold text-purple-300">Frontline Zone A</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">Relocate to Safe Haven</h4>
            <p className="text-xs text-slate-400 mt-0.5">Critical wave attack and active coastal regression corridor</p>

            <div className="my-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Allocated Citizens:</span>
                <span className="font-mono font-bold text-white text-base">{relocateCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Households:</span>
                <span className="font-mono font-bold text-slate-200">510 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination Haven:</span>
                <span className="font-bold text-cyan-400">{safeSite.name.split(' (')[0]}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Haven Capacity Left:</span>
                <span className="font-mono font-bold text-emerald-400">{(safeSiteCapacity - relocateCount).toLocaleString()} seats</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            ✓ Full 2BHK disaster-resilient township allocation at 14.5m MSL.
          </div>
        </div>

        {/* Zone B: Adapt */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-600/70 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="intervention" level="ADAPT" size="sm" />
              <span className="text-xs font-mono font-bold text-blue-300">Central Zone B</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">Adapt In-Situ</h4>
            <p className="text-xs text-slate-400 mt-0.5">Elevated market & central panchayat zone (3.5m above MSL)</p>

            <div className="my-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Adapted Citizens:</span>
                <span className="font-mono font-bold text-white text-base">{adaptCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Households:</span>
                <span className="font-mono font-bold text-slate-200">232 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Engineering Package:</span>
                <span className="font-bold text-cyan-300">Plinth Elevation + Mangroves</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Upgrade Budget:</span>
                <span className="font-mono font-bold text-white">₹7.2 Cr</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            ✓ Retains central market economic activity without physical displacement.
          </div>
        </div>

        {/* Zone C: Protect */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-600/70 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="intervention" level="PROTECT" size="sm" />
              <span className="text-xs font-mono font-bold text-emerald-300">Inland Zone C</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">Protect In-Situ</h4>
            <p className="text-xs text-slate-400 mt-0.5">Sheltered southern inland hamlet with dense natural bio-shield</p>

            <div className="my-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Protected Citizens:</span>
                <span className="font-mono font-bold text-white text-base">{protectCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Households:</span>
                <span className="font-mono font-bold text-slate-200">170 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Defense Package:</span>
                <span className="font-bold text-emerald-400">Tidal Bund & Sluice Gate</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Upgrade Budget:</span>
                <span className="font-mono font-bold text-white">₹2.8 Cr</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            ✓ Natural mangrove forest barrier prevents coastal surge intrusion.
          </div>
        </div>
      </div>

      {/* Phasing Roadmap Component */}
      <PhasingRoadmap />
    </div>
  );
};
