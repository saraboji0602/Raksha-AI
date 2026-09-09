import React from 'react';
import { RiskLevel, PriorityLevel, InterventionType } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'risk' | 'priority' | 'intervention' | 'status' | 'custom';
  level?: RiskLevel | PriorityLevel | InterventionType | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'custom',
  level,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-md',
    lg: 'text-sm px-3 py-1.5 font-bold rounded-lg'
  }[size];

  let colorClasses = 'bg-slate-800 text-slate-200 border border-slate-700';

  if (variant === 'risk') {
    switch (level) {
      case 'CRITICAL':
        colorClasses = 'bg-red-950/80 text-red-400 border border-red-700/60 shadow-sm shadow-red-950';
        break;
      case 'VERY_HIGH':
        colorClasses = 'bg-orange-950/80 text-orange-400 border border-orange-700/60';
        break;
      case 'HIGH':
        colorClasses = 'bg-amber-950/80 text-amber-400 border border-amber-700/60';
        break;
      case 'MODERATE':
        colorClasses = 'bg-yellow-950/80 text-yellow-400 border border-yellow-700/60';
        break;
      case 'LOW':
        colorClasses = 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60';
        break;
    }
  } else if (variant === 'priority') {
    switch (level) {
      case 'IMMEDIATE':
        colorClasses = 'bg-red-600 text-white font-bold border border-red-400 animate-pulse';
        break;
      case 'SHORT_TERM':
        colorClasses = 'bg-orange-600/90 text-white font-semibold border border-orange-400';
        break;
      case 'MEDIUM_TERM':
        colorClasses = 'bg-amber-600/80 text-slate-950 font-semibold border border-amber-300';
        break;
      case 'MONITOR':
        colorClasses = 'bg-slate-700 text-slate-200 font-medium border border-slate-600';
        break;
    }
  } else if (variant === 'intervention') {
    switch (level) {
      case 'PARTIAL_RELOCATION':
        colorClasses = 'bg-purple-950/90 text-purple-300 border border-purple-600 font-bold';
        break;
      case 'FULL_RELOCATION':
        colorClasses = 'bg-rose-950/90 text-rose-300 border border-rose-600 font-bold';
        break;
      case 'ADAPT':
        colorClasses = 'bg-blue-950/90 text-blue-300 border border-blue-600 font-semibold';
        break;
      case 'PROTECT':
        colorClasses = 'bg-emerald-950/90 text-emerald-300 border border-emerald-600 font-semibold';
        break;
      case 'DO_NOTHING':
        colorClasses = 'bg-slate-800 text-slate-400 border border-slate-700';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase tracking-wide ${sizeClasses} ${colorClasses} ${className}`}>
      {children || level}
    </span>
  );
};
