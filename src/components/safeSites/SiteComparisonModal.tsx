import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Modal } from '../common/Modal';
import { ShieldCheck, CheckCircle2, XCircle, Sparkles, Trophy } from 'lucide-react';

export const SiteComparisonModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { safeSites, setSelectedSafeSiteId, setCurrentPage } = useApp();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Safe Haven Multi-Criteria Comparison Matrix"
      subtitle="Comprehensive Suitability, Carrying Capacity & Community Acceptance Comparison"
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase">
                <th className="p-3">Evaluation Parameter</th>
                {safeSites.map(site => (
                  <th key={site.id} className="p-3 text-center min-w-[170px]">
                    <div className="flex flex-col items-center">
                      <span className="text-white text-xs">{site.name.split(' (')[0]}</span>
                      {site.id === 'site-b' && (
                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.2 rounded mt-0.5 border border-cyan-800">
                          ★ RECOMMENDED
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {/* Overall Suitability */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-white">Overall Suitability Score</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono font-bold text-emerald-400 text-sm">
                    {site.overallScore} / 100
                  </td>
                ))}
              </tr>

              {/* Hazard Safety */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-medium text-slate-300">Hazard Safety Score</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono font-bold text-white">
                    {site.hazardSafetyScore} / 100
                  </td>
                ))}
              </tr>

              {/* Community Acceptance */}
              <tr className="hover:bg-slate-900/50 bg-slate-950/40">
                <td className="p-3 font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Community Acceptance Index</span>
                </td>
                {safeSites.map(site => (
                  <td
                    key={site.id}
                    className={`p-3 text-center font-mono font-black text-sm ${
                      site.communityAcceptance.overallScore >= 80 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {site.communityAcceptance.overallScore}%
                  </td>
                ))}
              </tr>

              {/* Recommended Carrying Capacity */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-medium text-slate-300">Carrying Capacity (Max)</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono text-cyan-300 font-bold">
                    {site.capacity.recommendedMaxCapacity.toLocaleString()} persons
                  </td>
                ))}
              </tr>

              {/* Distance from Kadalpuram */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-medium text-slate-300">Distance from Kadalpuram</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono">
                    {site.distanceFromKeySettlementKm['kadalpuram'] || 25} km ({site.travelTimeMin['kadalpuram'] || 40}m)
                  </td>
                ))}
              </tr>

              {/* Livelihood Match */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-medium text-slate-300">Livelihood Continuity Match</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono font-semibold">
                    {site.livelihoodScore}%
                  </td>
                ))}
              </tr>

              {/* Development Cost */}
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-medium text-slate-300">Est. Infrastructure Budget</td>
                {safeSites.map(site => (
                  <td key={site.id} className="p-3 text-center font-mono font-bold text-white">
                    ₹{site.estimatedDevelopmentCostCr} Cr
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Selection Summary Banner */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-purple-200">
            <strong className="text-white block mb-0.5">Engine Winner: Site B (Pothigai Haven)</strong>
            While Site A offers slightly higher elevation (+3.7m), Site B is overwhelmingly superior for community adoption (82% vs 44%), avoids severe water scarcity deficits, and maintains essential coastal livelihood connectivity.
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              setSelectedSafeSiteId('site-b');
              setCurrentPage('relocation');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            Sanction Site B & Open Allocation Planner
          </button>
        </div>
      </div>
    </Modal>
  );
};
