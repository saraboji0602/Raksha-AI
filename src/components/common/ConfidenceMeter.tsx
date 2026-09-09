import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  fieldVerified?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  size = 'md',
  showLabel = true,
  fieldVerified = false
}) => {
  let level = 'HIGH';
  let color = 'text-emerald-400 bg-emerald-500';
  let border = 'border-emerald-500/40';

  if (score < 70) {
    level = 'LOW';
    color = 'text-rose-400 bg-rose-500';
    border = 'border-rose-500/40';
  } else if (score < 85) {
    level = 'MEDIUM';
    color = 'text-amber-400 bg-amber-500';
    border = 'border-amber-500/40';
  }

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>DATA CONFIDENCE</span>
        </div>
        <span className={`font-mono font-bold text-sm ${color.split(' ')[0]}`}>{score}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${color.split(' ')[1]}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
          <span className="font-semibold text-slate-300 uppercase tracking-wide">{level} CONFIDENCE</span>
          {fieldVerified ? (
            <span className="text-emerald-400 font-medium">✓ Field Verified</span>
          ) : (
            <span className="text-amber-400 font-medium">⚠ Satellite / InSAR Only</span>
          )}
        </div>
      )}
    </div>
  );
};
