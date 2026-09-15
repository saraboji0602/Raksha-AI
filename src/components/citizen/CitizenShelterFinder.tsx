import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { EmergencyShelter } from '../../types';
import { 
  Building2, 
  MapPin, 
  Users, 
  Droplets, 
  HeartPulse, 
  Zap, 
  Accessibility, 
  Route, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const CitizenShelterFinder: React.FC = () => {
  const { shelters, getSelectedSettlement, t } = useApp();
  const settlement = getSelectedSettlement();
  const [filterAccessibleOnly, setFilterAccessibleOnly] = useState(false);

  const filteredShelters = shelters.filter(s => {
    if (filterAccessibleOnly && !s.wheelchairAccessible) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/70 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
              REAL-TIME SHELTER NETWORK
            </span>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
              SHARED STATE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('citizenNavShelters')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Verified emergency shelters and candidate safe relocation havens for {settlement.name}. Real-time capacity and road access updated by DDMA.
          </p>
        </div>

        {/* Accessibility Filter Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 self-start md:self-auto flex-shrink-0">
          <button
            onClick={() => setFilterAccessibleOnly(!filterAccessibleOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterAccessibleOnly
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Wheelchair / Stretcher Accessible Only</span>
          </button>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShelters.map((shelter) => {
          const usagePct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          const isFull = shelter.status === 'FULL' || shelter.remainingCapacity === 0;
          const isNearCapacity = shelter.status === 'NEAR_CAPACITY';

          return (
            <div
              key={shelter.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                shelter.isPrimaryHavenCandidate
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                  : isFull
                  ? 'bg-slate-950/90 border-red-900/60 opacity-80'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {shelter.code}
                      </span>
                      {shelter.isPrimaryHavenCandidate && (
                        <span className="text-[10px] font-mono font-black bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>PRIMARY HAVEN (RECOMMENDED)</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight mt-1">
                      {shelter.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{shelter.address} • Elev: {shelter.elevationMeters}m MSL</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-xl border border-cyan-800">
                      {shelter.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Capacity Bar & Headroom */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Capacity & Headroom</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {shelter.currentOccupancy.toLocaleString()} / {shelter.capacity.toLocaleString()} ({usagePct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFull ? 'bg-red-500' : isNearCapacity ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, usagePct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">
                      Remaining Headroom: <strong className={isFull ? 'text-red-400' : 'text-emerald-400'}>+{shelter.remainingCapacity.toLocaleString()}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isFull
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : isNearCapacity
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {isFull ? 'FULL / REDIRECT' : isNearCapacity ? 'NEAR CAPACITY' : 'OPEN & SAFE'}
                    </span>
                  </div>
                </div>

                {/* Amenities Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] mb-3">
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    shelter.waterAvailable ? 'bg-slate-950 border-slate-800 text-emerald-300' : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                  }`}>
                    <Droplets className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>Drinking Water</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    shelter.medicalAvailable ? 'bg-slate-950 border-slate-800 text-emerald-300' : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                  }`}>
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>Medical Post</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    shelter.electricityAvailable ? 'bg-slate-950 border-slate-800 text-emerald-300' : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                  }`}>
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Generator Power</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    shelter.wheelchairAccessible ? 'bg-slate-950 border-slate-800 text-purple-300' : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                  }`}>
                    <Accessibility className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>Accessible Ramp</span>
                  </div>

                  <div className="p-2 rounded-xl border bg-slate-950 border-slate-800 text-slate-300 flex items-center gap-1.5 col-span-2 sm:col-span-2">
                    <Route className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>Road Access: <strong className={shelter.roadAccess === 'CLEAR' ? 'text-emerald-400' : 'text-amber-400'}>{shelter.roadAccess}</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-400 truncate">
                  <span>Officer in Charge: </span>
                  <strong className="text-white">{shelter.contactPerson}</strong>
                </div>

                <a
                  href={`tel:${shelter.contactPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-mono font-bold flex items-center gap-1 border border-slate-700 transition-colors flex-shrink-0"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
