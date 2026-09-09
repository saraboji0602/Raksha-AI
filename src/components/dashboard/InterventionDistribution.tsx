import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GitBranch } from 'lucide-react';
import { useApp } from '../../store/useAppStore';

const COLORS: Record<string, string> = {
  'Partial Relocation': '#a855f7', // Purple
  'Full Relocation': '#ef4444', // Red
  'Adaptation': '#3b82f6', // Blue
  'Protection': '#10b981' // Green
};

export const InterventionDistribution: React.FC = () => {
  const { settlements, setCurrentPage } = useApp();

  let partialCount = 0;
  let fullCount = 0;
  let adaptCount = 0;
  let protectCount = 0;

  settlements.forEach(s => {
    if (s.aiRecommendation === 'PARTIAL_RELOCATION') partialCount++;
    else if (s.aiRecommendation === 'FULL_RELOCATION') fullCount++;
    else if (s.aiRecommendation === 'ADAPT') adaptCount++;
    else protectCount++;
  });

  const data = [
    { name: 'Partial Relocation', value: partialCount },
    { name: 'Full Relocation', value: fullCount },
    { name: 'Adaptation', value: adaptCount },
    { name: 'Protection', value: protectCount }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/60">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Intervention Strategy Split</h3>
              <p className="text-[11px] text-slate-400">Balanced decisions vs indiscriminate relocation</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('intervention')}
            className="text-[11px] text-cyan-400 font-bold hover:underline"
          >
            Engine →
          </button>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
              <span>{item.name}</span>
            </span>
            <span className="font-bold text-white font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
