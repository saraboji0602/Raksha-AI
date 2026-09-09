import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

const TREND_DATA = [
  { year: '2018', observed: 72, current: null, projection: null },
  { year: '2020', observed: 78, current: null, projection: null },
  { year: '2022', observed: 82, current: null, projection: null },
  { year: '2024', observed: 86, current: null, projection: null },
  { year: '2026 (Now)', observed: 91, current: 91, projection: 91 },
  { year: '2028 (Do Nothing)', observed: null, current: null, projection: 96 },
  { year: '2030 (Do Nothing)', observed: null, current: null, projection: 99 }
];

export const RiskTrendChart: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Decadal Risk Escalation Trend</h3>
              <p className="text-[11px] text-slate-400">Observed InSAR regression vs Projected Inaction curve</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
            +19 pts / 8 yrs
          </span>
        </div>

        <div className="h-52 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="observedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="observed"
                stroke="#ef4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#observedGrad)"
                name="Observed Coastal Risk"
              />
              <Line
                type="monotone"
                dataKey="projection"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Projected Inaction Risk"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
        <span>● Red: Verified Satellite History</span>
        <span>--- Amber: Scenario Inaction Trajectory</span>
      </div>
    </div>
  );
};
