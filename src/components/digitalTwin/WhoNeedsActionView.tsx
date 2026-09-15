import React, { useState } from 'react';
import { Settlement, WhoNeedsActionItem } from '../../types';
import { useApp } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { 
  Users, 
  Baby, 
  UserCheck, 
  HeartHandshake, 
  ShieldAlert, 
  Home, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  GitBranch,
  Sparkles,
  Layers
} from 'lucide-react';

export const WhoNeedsActionView: React.FC<{ settlement: Settlement }> = ({ settlement }) => {
  const { setCurrentPage, setSelectedSafeSiteId, addToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PARTIAL_RELOCATION' | 'ADAPT' | 'PROTECT'>('ALL');

  const actionItems: WhoNeedsActionItem[] = settlement.whoNeedsAction || [
    {
      id: 'act-kz-01',
      zoneId: 'kz-1',
      zoneName: 'North Fisherman Spit (Zone A)',
      actionType: 'PARTIAL_RELOCATION',
      urgency: 'IMMEDIATE',
      affectedPopulation: settlement.relocationPopulation || 2650,
      affectedHouseholds: 510,
      vulnerableBreakdown: {
        children: 340,
        elderly: 220,
        specialAssistance: 110,
        femaleHeaded: 95
      },
      housingType: 'KUTCHA_THATCHED',
      targetDestinationSiteId: 'site-b',
      targetDestinationName: 'Site B (Pothigai Haven)',
      actionRationale: 'Direct wave attack corridor within 50m of High Tide Line. 3.4m/year coastal retreat makes in-situ defense unfeasible.'
    },
    {
      id: 'act-kz-02',
      zoneId: 'kz-2',
      zoneName: 'Central Panchayat Market (Zone B)',
      actionType: 'ADAPT',
      urgency: 'SHORT_TERM',
      affectedPopulation: settlement.adaptationPopulation || 1220,
      affectedHouseholds: 232,
      vulnerableBreakdown: {
        children: 170,
        elderly: 110,
        specialAssistance: 45,
        femaleHeaded: 40
      },
      housingType: 'SEMI_PUCCA',
      actionRationale: 'Elevated 3.5m MSL terrain. In-situ plinth elevation, stormwater sluice gates, and roof anchoring mitigate over 60% of damage.'
    },
    {
      id: 'act-kz-03',
      zoneId: 'kz-3',
      zoneName: 'Southern Inland Hamlet (Zone C)',
      actionType: 'PROTECT',
      urgency: 'MEDIUM_TERM',
      affectedPopulation: settlement.protectionPopulation || 950,
      affectedHouseholds: 170,
      vulnerableBreakdown: {
        children: 110,
        elderly: 80,
        specialAssistance: 30,
        femaleHeaded: 25
      },
      housingType: 'PUCCA_VULNERABLE',
      actionRationale: 'Naturally buffered behind dense mangrove bio-shield. Tidal bund reinforcement and early warning maintenance provides defense.'
    }
  ];

  const filteredItems = activeFilter === 'ALL' 
    ? actionItems 
    : actionItems.filter(item => item.actionType === activeFilter);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wide">
                HUMAN-CENTRIC DISAGGREGATION
              </span>
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 uppercase">
                WHO NEEDS ACTION?
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Targeted Interventions & Demographic Vulnerability Queues
            </h3>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeFilter === 'ALL' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({settlement.population.toLocaleString()})
          </button>
          <button
            onClick={() => setActiveFilter('PARTIAL_RELOCATION')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeFilter === 'PARTIAL_RELOCATION' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Relocate ({settlement.relocationPopulation?.toLocaleString() || 2650})
          </button>
          <button
            onClick={() => setActiveFilter('ADAPT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeFilter === 'ADAPT' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Adapt ({settlement.adaptationPopulation?.toLocaleString() || 1220})
          </button>
          <button
            onClick={() => setActiveFilter('PROTECT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeFilter === 'PROTECT' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Protect ({settlement.protectionPopulation?.toLocaleString() || 950})
          </button>
        </div>
      </div>

      {/* Aggregate Demographic Vulnerability Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <Baby className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Children (&lt;12 Yrs)</span>
            <div className="font-mono font-bold text-white text-sm">{settlement.childrenCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Senior Citizens</span>
            <div className="font-mono font-bold text-white text-sm">{settlement.elderlyCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Special Needs / Disabled</span>
            <div className="font-mono font-bold text-white text-sm">{settlement.specialAssistanceCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Home className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Kutcha / Thatched HH</span>
            <div className="font-mono font-bold text-white text-sm">{settlement.kutchaHouseCount || 510}</div>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isRelocate = item.actionType === 'PARTIAL_RELOCATION';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isRelocate
                  ? 'bg-purple-950/20 border-purple-700/60 shadow-lg shadow-purple-950/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="intervention" level={item.actionType} size="sm" />
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
                    item.urgency === 'IMMEDIATE' 
                      ? 'bg-red-950 text-red-300 border-red-800' 
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {item.urgency}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{item.zoneName}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.actionRationale}</p>

                {/* Numbers Box */}
                <div className="my-3 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Affected Citizens:</span>
                    <span className="font-bold text-white font-mono">{item.affectedPopulation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Households:</span>
                    <span className="font-bold text-slate-300 font-mono">{item.affectedHouseholds} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Housing Typology:</span>
                    <span className="font-semibold text-amber-400">{item.housingType.replace('_', ' ')}</span>
                  </div>
                  {item.targetDestinationName && (
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Target Haven:</span>
                      <span className="font-bold text-cyan-400">{item.targetDestinationName}</span>
                    </div>
                  )}
                </div>

                {/* Vulnerability Micro-Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    👶 {item.vulnerableBreakdown.children} Children
                  </span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    👵 {item.vulnerableBreakdown.elderly} Seniors
                  </span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ♿ {item.vulnerableBreakdown.specialAssistance} Special Needs
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                {isRelocate ? (
                  <button
                    onClick={() => {
                      if (item.targetDestinationSiteId) setSelectedSafeSiteId(item.targetDestinationSiteId);
                      setCurrentPage('relocation');
                      addToast({
                        type: 'info',
                        title: 'Navigating to Relocation Allocation',
                        description: `Planning allocation for ${item.affectedPopulation.toLocaleString()} residents of ${item.zoneName}.`
                      });
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/40 transition-all"
                  >
                    <span>Allocate to Site B</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPage('intervention');
                    }}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Engineering Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
