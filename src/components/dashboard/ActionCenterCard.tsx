import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  ArrowRight, 
  Clock 
} from 'lucide-react';

export const ActionCenterCard: React.FC = () => {
  const { setCurrentPage } = useApp();

  const actions = [
    {
      title: 'Field Verifications Pending',
      count: 8,
      desc: 'Ground truth evidence required for high-risk habitations',
      icon: ClipboardCheck,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      actionPage: 'field-verification'
    },
    {
      title: 'Safe Haven Site Audits Pending',
      count: 4,
      desc: 'Water grid feeder clearance for Site B expansion',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      actionPage: 'safe-sites'
    },
    {
      title: 'Decision Reports Awaiting Sanction',
      count: 6,
      desc: 'Executive relocation dossiers generated for DDMA approval',
      icon: FileText,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      actionPage: 'reports'
    },
    {
      title: 'Active Relocation Phasing Plans',
      count: 3,
      desc: 'Phased household transit roadmaps in planning stage',
      icon: MapPin,
      color: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
      actionPage: 'relocation'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Executive Action Center</h3>
              <p className="text-[11px] text-slate-400">Operational tasks and statutory administrative workflow</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">21 Pending Tasks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {actions.map((act, i) => {
            const Icon = act.icon;
            return (
              <div
                key={i}
                onClick={() => setCurrentPage(act.actionPage)}
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2 rounded-lg border ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {act.count}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {act.desc}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                  <span>Take Action</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
