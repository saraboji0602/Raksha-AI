import React from 'react';
import { HelpCircle, Shield, GitBranch, Compass, Sliders, Database, CheckCircle2 } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const topics = [
    {
      title: '1. What is the Protect → Adapt → Relocate Decision Engine?',
      icon: GitBranch,
      content: 'Unlike traditional disaster mapping tools that only draw red zones and prescribe generic evacuations, RAKSHA-AI evaluates whether a habitation can be defended (PROTECT), upgraded with nature-based defenses and stilt architecture (ADAPT), or requires zoned or complete resettlement (RELOCATE).'
    },
    {
      title: '2. Why Micro-Zone Disaggregation Matters',
      icon: Shield,
      content: 'Habitations frequently have varied topography. In Kadalpuram, frontline Zone A suffers 3.4m/year coastal regression, while inland Zone C is protected by mangroves. Disaggregation avoids displacing entire villages when partial zoned relocation achieves total life safety.'
    },
    {
      title: '3. How Safe Havens & Carrying Capacities Are Audited',
      icon: Compass,
      content: 'Candidate sites are scored across Hazard Safety (92+), Road Connectivity, Water Grids, Healthcare, and Community Acceptance. Carrying capacity is strictly constrained by the lowest critical infrastructure bottleneck (e.g. water distribution feeder).'
    },
    {
      title: '4. What Does Data Confidence Mean?',
      icon: Database,
      content: 'Confidence reflects dataset recency, spatial resolution, and field verification. Satellite InSAR alone provides ~72% confidence; when ground officers submit geotagged photos and checklist confirmations, confidence elevates to 94%.'
    },
    {
      title: '5. Understanding the 10-Year Cost of Inaction',
      icon: Sliders,
      content: 'The Cost of Inaction represents cumulative projected emergency relief, sea breach damages, and emergency rebuilding costs over 10 years if authorities do not proactively intervene. Proactive relocation delivers massive public expenditure savings.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              DOCUMENTATION & METHODOLOGY
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              How RAKSHA-AI Decision Intelligence Works
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-800">
          Statutory Decision Support
        </span>
      </div>

      <div className="space-y-4">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{t.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-9">{t.content}</p>
            </div>
          );
        })}
      </div>

      {/* Official Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-center leading-relaxed">
        <strong>Statutory Notice: </strong>
        RAKSHA-AI is an AI-assisted decision-support prototype. Recommendations must be validated by authorized district and state disaster management authorities (NDMA/SDMA/DDMA) and field verification teams prior to administrative sanction.
      </div>
    </div>
  );
};
