import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'risk' | 'resilience' | 'safety' | 'acceptance';
  invertColors?: boolean; // If true, lower is better (like risk)
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  sublabel,
  size = 'md',
  variant = 'risk',
  invertColors = false
}) => {
  const radius = size === 'lg' ? 44 : size === 'md' ? 34 : 24;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#38bdf8'; // cyan

  if (variant === 'risk') {
    if (score >= 85) strokeColor = '#ef4444'; // Red critical
    else if (score >= 70) strokeColor = '#f97316'; // Orange
    else if (score >= 50) strokeColor = '#eab308'; // Yellow
    else strokeColor = '#10b981'; // Green
  } else if (variant === 'resilience' || variant === 'safety' || variant === 'acceptance') {
    if (score >= 80) strokeColor = '#10b981'; // Green
    else if (score >= 60) strokeColor = '#eab308'; // Yellow
    else strokeColor = '#ef4444'; // Red low resilience
  }

  const dim = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg className="transform -rotate-90" width={dim} height={dim}>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-bold font-mono text-white text-base lg:text-lg">{score}</span>
          <span className="text-[9px] uppercase font-semibold text-slate-400">/100</span>
        </div>
      </div>

      <span className="text-xs font-semibold text-slate-200 mt-2 uppercase tracking-wide">{label}</span>
      {sublabel && <span className="text-[11px] text-slate-400 mt-0.5">{sublabel}</span>}
    </div>
  );
};
