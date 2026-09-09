import React from 'react';
import { SafeSite } from '../../types';
import { Users2, HeartHandshake, CheckCircle2, AlertTriangle, Compass, Sparkles } from 'lucide-react';

export const CommunityAcceptanceCard: React.FC<{ site: SafeSite }> = ({ site }) => {
  const acc = site.communityAcceptance;

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white uppercase tracking-wider">COMMUNITY ACCEPTANCE INDEX</span>
        </div>
        <span
          className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded border ${
            acc.overallScore >= 80
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
              : 'bg-rose-950 text-rose-300 border-rose-800'
          }`}
        >
          {acc.overallScore}% Acceptance
        </span>
      </div>

      {/* Factors Progress Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Livelihood Continuity</span>
          <span className="font-mono font-bold text-cyan-300 text-sm">{acc.livelihoodContinuityScore}%</span>
          <div className="text-[9px] text-slate-500">Coastal fishing transit</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Social Cohesion</span>
          <span className="font-mono font-bold text-emerald-300 text-sm">{acc.socialNetworkScore}%</span>
          <div className="text-[9px] text-slate-500">Panchayat unit cluster</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Cultural Fit</span>
          <span className="font-mono font-bold text-amber-300 text-sm">{acc.culturalCompatibilityScore}%</span>
          <div className="text-[9px] text-slate-500">Temple & common grounds</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Civic Services</span>
          <span className="font-mono font-bold text-purple-300 text-sm">{acc.schoolHealthcareScore}%</span>
          <div className="text-[9px] text-slate-500">Near higher secondary</div>
        </div>
      </div>

      {/* Primary Community Consultations & Demands */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Panchayat Consultation Key Inclusions:
        </span>
        <div className="space-y-1">
          {acc.primaryConcerns.map((concern, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{concern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiator Highlight Banner */}
      {site.id === 'site-b' && (
        <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">AI Decision Intelligence Note: </span>
            <span>Site B (82% acceptance) is preferred over Site A (44% acceptance) because forced relocation to culturally disconnected scrubland causes community resistance, whereas Site B ensures livelihood continuity.</span>
          </div>
        </div>
      )}
    </div>
  );
};
