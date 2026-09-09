import React from 'react';
import { Clock, Calendar, CheckCircle2, Milestone, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const PhasingRoadmap: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      duration: '0 – 6 Months',
      title: 'Immediate High-Risk De-risking & Ground Surveys',
      badge: 'URGENT',
      badgeColor: 'bg-red-950 text-red-300 border-red-800',
      milestones: [
        'Biometric household mapping of 510 frontline families in Zone A',
        'Panchayat community consensus agreement signing for Site B',
        'Site B boundary fencing, land leveling & water bore well grid setup',
        'Emergency SDRF early warning telemetry installation at Bridge B-07'
      ],
      budgetCr: 3.5
    },
    {
      phase: 'Phase 2',
      duration: '6 – 18 Months',
      title: 'Resilient Infrastructure & Housing Construction',
      badge: 'CAPITAL WORKS',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      milestones: [
        'Construction of 510 Pucca RC 2BHK disaster-resilient housing units',
        '18km direct all-weather highway link paving to coastal docks',
        'Cold storage facility & net mending yard commissioning at Site B',
        '0.6 MLD piped water feeder connection from state utility grid'
      ],
      budgetCr: 18.2
    },
    {
      phase: 'Phase 3',
      duration: '18 – 36 Months',
      title: 'Gradual Resettlement, Livelihood Transition & Decommissioning',
      badge: 'TRANSITION',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      milestones: [
        'Phased family transition with daily dedicated fishery bus passes',
        'Primary & higher secondary school admissions enrollment at Site B',
        'Conversion of vacated Zone A spit into dense Mangrove Bio-Shield park',
        'Plinth elevation and drainage sluice upgrade completion for Zones B & C'
      ],
      budgetCr: 6.35
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <Milestone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              36-Month Relocation & Transition Phasing Roadmap
            </h3>
            <p className="text-[11px] text-slate-400">
              Structured execution timeline to eliminate abrupt displacement trauma
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
          Total Phased Budget: ₹28.05 Cr
        </span>
      </div>

      {/* Horizontal Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-cyan-400 text-xs">{p.phase} ({p.duration})</span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-2.5 leading-snug">{p.title}</h4>

              <div className="space-y-1.5 text-xs text-slate-300">
                {p.milestones.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Tranche Budget:</span>
              <span className="font-mono font-bold text-white">₹{p.budgetCr} Cr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Relocation Monitoring Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-slate-300">
            <strong>Post-Relocation Monitoring: </strong>
            Track community livelihood continuity, water grid stability, and school attendance quarterly.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex-shrink-0">
          Target Status: STABLE
        </span>
      </div>
    </div>
  );
};
