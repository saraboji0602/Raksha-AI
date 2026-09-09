import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  badge?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-cyan-400',
  onClick,
  badge,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md ${
        onClick ? 'cursor-pointer hover:bg-slate-850 hover:shadow-cyan-950/20' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</span>
            {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || badge) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-semibold ${
                  trend.isNeutral
                    ? 'text-slate-400'
                    : trend.isPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}

          {badge && (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
