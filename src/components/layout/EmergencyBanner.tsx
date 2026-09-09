import React from 'react';
import { useApp } from '../../store/useAppStore';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { emergencyMode, setEmergencyMode } = useApp();

  if (!emergencyMode) return null;

  return (
    <div className="bg-red-950 border-b-2 border-red-600 px-4 py-2 text-white sticky top-0 z-50 animate-pulse shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-red-600 text-white flex-shrink-0 animate-bounce">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs uppercase bg-red-600 px-2 py-0.5 rounded text-white tracking-widest">
                CRITICAL EMERGENCY OPERATIONS ACTIVE
              </span>
              <span className="text-xs text-red-200 font-semibold">Priority 1 Evacuation Dispatch Protocol</span>
            </div>
            <p className="text-[11px] text-red-200/80">
              Immediate Red-Zone prioritization engaged for 3 critical coastal & hill habitations. Evacuation routes unlocked.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-900/80 border border-red-500/50 px-3 py-1 rounded text-xs font-mono font-bold text-red-100">
            <PhoneCall className="w-3.5 h-3.5 text-red-300" />
            <span>STATE CONTROL: 1077</span>
          </div>

          <button
            onClick={() => setEmergencyMode(false)}
            className="p-1 rounded bg-red-900 hover:bg-red-800 text-red-200 hover:text-white text-xs font-bold border border-red-700 transition-colors"
          >
            Exit Emergency Mode
          </button>
        </div>
      </div>
    </div>
  );
};
