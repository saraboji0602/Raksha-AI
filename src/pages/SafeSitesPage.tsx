import React, { useState } from 'react';
import { useApp } from '../store/useAppStore';
import { SiteCard } from '../components/safeSites/SiteCard';
import { SiteComparisonModal } from '../components/safeSites/SiteComparisonModal';
import { ShieldCheck, Sparkles, Scale, Compass, MapPin, Layers } from 'lucide-react';

export const SafeSitesPage: React.FC = () => {
  const { 
    safeSites, 
    selectedSafeSiteId, 
    setSelectedSafeSiteId, 
    getSelectedSettlement,
    setCurrentPage,
    addToast 
  } = useApp();

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const settlement = getSelectedSettlement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/70 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                SAFE HAVEN DISCOVERY & CAPACITY AUDIT
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">
                ZERO HAZARD ENVELOPE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Candidate Safe Relocation Havens
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Evaluating multi-factor terrain safety, physical land area, water feeder capacities, and community acceptance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-end sm:self-auto active:scale-95"
        >
          <Scale className="w-4 h-4 text-slate-950" />
          <span>Compare All Candidate Sites</span>
        </button>
      </div>

      {/* Target Settlement Association Context Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>
            Evaluating Relocation Destinations for: <strong className="text-white">{settlement.name}</strong> ({settlement.relocationPopulation.toLocaleString()} relocating citizens)
          </span>
        </div>
        <span className="font-mono text-cyan-400 font-bold">
          Target Haven: Site B (Pothigai Haven)
        </span>
      </div>

      {/* Candidate Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {safeSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            settlement={settlement}
            isSelected={selectedSafeSiteId === site.id}
            onSelect={() => {
              setSelectedSafeSiteId(site.id);
              addToast({
                type: 'success',
                title: `Safe Haven Selected: ${site.name}`,
                description: `Suitability: ${site.overallScore}/100 • Community Acceptance: ${site.communityAcceptance.overallScore}%`
              });
            }}
          />
        ))}
      </div>

      {/* Comparison Modal */}
      <SiteComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
};
