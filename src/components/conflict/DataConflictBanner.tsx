import React from 'react';
import { useApp } from '../../store/useAppStore';
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DataConflictBanner: React.FC = () => {
  const { dataConflicts, setSelectedConflictId, setIsConflictModalOpen, activeViewMode } = useApp();

  const activeConflict = dataConflicts.find(c => c.status === 'CONFLICT_DETECTED' || c.status === 'UNDER_HUMAN_REVIEW');

  if (!activeConflict || activeViewMode !== 'OFFICER') return null;

  return (
    <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 border-b border-amber-500/40 px-4 py-2.5 shadow-lg animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-200">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-amber-400 uppercase tracking-wide mr-2">
              ⚠️ DATA CONFLICT DETECTED:
            </span>
            <span className="text-white font-medium">
              Physical ground measurement on <strong className="text-amber-300">{activeConflict.locationName}</strong> contradicts AI satellite model ({activeConflict.fieldValue} vs {activeConflict.aiValue}).
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedConflictId(activeConflict.id);
            setIsConflictModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 flex-shrink-0"
        >
          <span>Review & Resolve Conflict</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
