import React from 'react';
import { Settlement } from '../../types';
import { Badge } from '../common/Badge';
import { ScoreGauge } from '../common/ScoreGauge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Wind, 
  Waves, 
  Droplets, 
  Mountain, 
  Flame 
} from 'lucide-react';

export const RiskBreakdownCard: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'coastal_erosion':
        return Waves;
      case 'cyclone':
        return Wind;
      case 'flood':
        return Droplets;
      case 'landslide':
        return Mountain;
      case 'heatwave':
        return Flame;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                COMPOSITE MULTI-HAZARD RISK
              </span>
              <Badge variant="risk" level={settlement.overallRisk >= 85 ? 'CRITICAL' : 'HIGH'} size="sm" />
            </div>
            <h2 className="text-2xl font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
              <span>{settlement.overallRisk}</span>
              <span className="text-sm font-normal text-slate-400">/ 100</span>
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                CRITICAL RED-ZONE
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="intervention" level={settlement.aiRecommendation} size="md" />
            <Badge variant="priority" level={settlement.priority} size="md" />
          </div>
        </div>

        {/* 4 Core Pillars Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-4">
          <ScoreGauge score={settlement.overallRisk} label="Overall Risk" variant="risk" size="sm" />
          <ScoreGauge score={settlement.exposureScore} label="Exposure" variant="risk" size="sm" />
          <ScoreGauge score={settlement.vulnerabilityScore} label="Vulnerability" variant="risk" size="sm" />
          <ScoreGauge score={settlement.resilienceScore} label="Resilience" variant="resilience" size="sm" />
        </div>

        {/* Multi-Hazard Breakdown Progress Bars */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Hazard Factor Intensity Breakdown
          </span>

          {settlement.hazards.map((hazard) => {
            const Icon = getHazardIcon(hazard.type);
            const isDominant = hazard.type === settlement.dominantHazard;

            return (
              <div key={hazard.type} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-white">{hazard.name}</span>
                    {isDominant && (
                      <span className="text-[9px] font-mono bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-800 uppercase font-bold">
                        DOMINANT DRIVER
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-200">{hazard.score} / 100</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hazard.score >= 85
                        ? 'bg-red-500'
                        : hazard.score >= 70
                        ? 'bg-orange-500'
                        : hazard.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${hazard.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{hazard.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidence footer */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <ConfidenceMeter score={settlement.dataConfidence} fieldVerified={settlement.fieldVerified} />
      </div>
    </div>
  );
};
