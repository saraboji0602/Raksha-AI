import React, { useState } from 'react';
import { useApp } from '../store/useAppStore';
import { 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  Trees, 
  Droplets, 
  Zap, 
  Truck, 
  Building2, 
  Fish, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers,
  Scale,
  Award,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

interface PreventionPackage {
  id: string;
  title: string;
  category: 'NATURE_BASED' | 'STRUCTURAL_ENGINEERING' | 'UTILITY_RESILIENCE' | 'LIVELIHOOD_HAVEN';
  description: string;
  estimatedCostCr: number;
  riskReductionPoints: number; // e.g. -18 points
  implementationMonths: number;
  communityAcceptancePct: number;
  icon: any;
  enabled: boolean;
  statutoryScheme: string;
}

export const PreventionPage: React.FC = () => {
  const { settlements, selectedSettlementId, setSelectedSettlementId, recoveryItems, addToast, t } = useApp();
  const settlement = settlements.find(s => s.id === selectedSettlementId) || settlements[0];

  const [packages, setPackages] = useState<PreventionPackage[]>([
    {
      id: 'prev-01',
      title: 'Automated Estuarine Sluice Gates & Canal Desilting',
      category: 'STRUCTURAL_ENGINEERING',
      description: 'Solar-automated tidal barrier gates at Northern Estuary Mouth to block astronomical sea surge while allowing monsoonal river outflow.',
      estimatedCostCr: 4.5,
      riskReductionPoints: 18,
      implementationMonths: 12,
      communityAcceptancePct: 94,
      icon: Droplets,
      enabled: true,
      statutoryScheme: 'National Cyclone Risk Mitigation Project (NCRMP)'
    },
    {
      id: 'prev-02',
      title: 'Elevated 4-Lane State Highway 49 High-Corridor Bypass',
      category: 'STRUCTURAL_ENGINEERING',
      description: 'Permanent all-weather elevated causeway (+3.8m MSL) replacing flood-prone Culvert B-07 to guarantee zero community evacuation isolation.',
      estimatedCostCr: 18.0,
      riskReductionPoints: 22,
      implementationMonths: 24,
      communityAcceptancePct: 98,
      icon: Truck,
      enabled: true,
      statutoryScheme: 'PMGSY Coastal Connectivity Mission'
    },
    {
      id: 'prev-03',
      title: '4.5km Mangrove Bio-Shield & Submerged Geotextile Reef',
      category: 'NATURE_BASED',
      description: 'Dense Rhizophora mangrove afforestation zone fronted by submerged wave-dissipating geotextile tubes to dampen 65% of cyclonic wave runup energy.',
      estimatedCostCr: 8.4,
      riskReductionPoints: 26,
      implementationMonths: 36,
      communityAcceptancePct: 91,
      icon: Trees,
      enabled: true,
      statutoryScheme: 'Green India Mission & CRZ Bio-Protection'
    },
    {
      id: 'prev-04',
      title: 'Cyclone Shelter Microgrid & 150-Bed High-Ridge Retrofit',
      category: 'UTILITY_RESILIENCE',
      description: '100kW rooftop solar microgrid with lithium battery bank, emergency satellite terminal, and secondary water filtration at Zone C Shelter.',
      estimatedCostCr: 3.2,
      riskReductionPoints: 12,
      implementationMonths: 8,
      communityAcceptancePct: 96,
      icon: Zap,
      enabled: true,
      statutoryScheme: 'State Disaster Mitigation Fund (SDMF)'
    },
    {
      id: 'prev-05',
      title: 'Cauvery Trunk Drinking Water Feeder Pipeline Network',
      category: 'UTILITY_RESILIENCE',
      description: '14km dedicated ductile iron drinking water main connecting to inland reservoirs, permanently replacing 6 salinized groundwater borewells.',
      estimatedCostCr: 5.6,
      riskReductionPoints: 15,
      implementationMonths: 14,
      communityAcceptancePct: 95,
      icon: Droplets,
      enabled: true,
      statutoryScheme: 'Jal Jeevan Mission (Coastal Resilient Component)'
    },
    {
      id: 'prev-06',
      title: 'Pothigai Haven Site B Cold-Chain Fisherfolk Livelihood Hub',
      category: 'LIVELIHOOD_HAVEN',
      description: 'Modern 50-tonne refrigerated seafood storage, net-mending sheds, and auction terminal within 1.2km of Haven Site B to preserve marine livelihoods.',
      estimatedCostCr: 6.8,
      riskReductionPoints: 14,
      implementationMonths: 18,
      communityAcceptancePct: 92,
      icon: Fish,
      enabled: true,
      statutoryScheme: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)'
    }
  ]);

  const togglePackage = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  // Calculations
  const activePackages = packages.filter(p => p.enabled);
  const totalCostCr = activePackages.reduce((sum, p) => sum + p.estimatedCostCr, 0);
  const rawReduction = activePackages.reduce((sum, p) => sum + p.riskReductionPoints, 0);
  
  // Exponential diminishing returns formula for multi-layer residual risk
  const baselineRisk = settlement.overallRisk; // e.g. 91
  const calculatedResidualRisk = Math.max(12, Math.round(baselineRisk * Math.exp(-rawReduction / 75)));
  const totalRiskDropped = baselineRisk - calculatedResidualRisk;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex-shrink-0">
            <Trees className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wide">
                LONG-TERM RESILIENCE & PREVENTION
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                BUILDING SYSTEMIC IMMUNITY
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Disaster Prevention & Residual Risk Reduction Engine
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Transforming post-disaster recovery intelligence into structural engineering, nature-based bio-shields, and permanent risk elimination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-medium">Target:</span>
          <select
            value={settlement.id}
            onChange={(e) => setSelectedSettlementId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer"
          >
            {settlements.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (Risk {s.overallRisk}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prevention Loop Flow Architecture */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            THE RAKSHA-AI CONTINUOUS PREVENTION FEEDBACK LOOP
          </span>
          <span className="text-[10px] font-mono text-slate-400">CLOSED-LOOP INTELLIGENCE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">1. RECOVERY DATA</span>
            <p className="font-bold text-white">₹50.5 Cr Damage</p>
            <p className="text-[10px] text-slate-400">Culvert scour, salinized wells</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">2. LIVE RISK MODEL</span>
            <p className="font-bold text-white">91 / 100 Risk</p>
            <p className="text-[10px] text-slate-400">Compound tide + river surge</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">3. WHAT CHANGED</span>
            <p className="font-bold text-white">3.4m Berm Retreat</p>
            <p className="text-[10px] text-slate-400">Ground verified by field officer</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-teal-400 uppercase block font-bold">4. PREVENTION PLAN</span>
            <p className="font-bold text-white">6 Multi-Layer Works</p>
            <p className="text-[10px] text-slate-400">Bio-shields + Sluice gates + Haven</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/50 text-center space-y-1 shadow-lg shadow-teal-950/30">
            <span className="text-[10px] font-mono text-teal-300 uppercase block font-black">5. RESIDUAL RISK</span>
            <p className="font-black text-2xl text-teal-300 font-mono">24 / 100</p>
            <p className="text-[10px] text-teal-400 font-bold">LOW (Permanent Safety)</p>
          </div>
        </div>
      </div>

      {/* Real-Time Risk Simulation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics & Projection Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                PREVENTION IMPACT SIMULATOR
              </span>
              <Badge variant="status" level="OPTIMIZED">
                {activePackages.length} ACTIVE WORKS
              </Badge>
            </div>

            {/* Risk Transition Visualizer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Current Risk without Prevention:</span>
                <span className="text-base font-bold text-rose-400 font-mono">{baselineRisk} / 100 (CRITICAL)</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Projected Residual Risk:</span>
                <span className="text-2xl font-black text-teal-300 font-mono">{calculatedResidualRisk} / 100 (LOW)</span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${calculatedResidualRisk}%` }} 
                  className="bg-teal-400 transition-all duration-500" 
                />
                <div 
                  style={{ width: `${totalRiskDropped}%` }} 
                  className="bg-emerald-500/30 transition-all duration-500" 
                />
              </div>

              <div className="text-[11px] text-emerald-400 flex items-center justify-between font-mono font-bold pt-1">
                <span>Total Risk Reduction Achieved:</span>
                <span>-{totalRiskDropped} Points (-{Math.round((totalRiskDropped / baselineRisk) * 100)}%)</span>
              </div>
            </div>

            {/* Total Budget & Execution Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Prevention Capital Cost:</span>
                <strong className="text-sm font-mono text-white">₹{totalCostCr.toFixed(1)} Crores</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">10-Year Inaction Loss Avoided:</span>
                <strong className="text-sm font-mono text-emerald-400">₹{settlement.costOfInactionCr} Crores</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Benefit-Cost Ratio (BCR):</span>
                <strong className="text-sm font-mono text-cyan-300">
                  {totalCostCr > 0 ? (settlement.costOfInactionCr / totalCostCr).toFixed(1) : '0.0'}x Return
                </strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-300">
            ✓ <strong>Statutory Alignment:</strong> Formulated under Section 31 of Disaster Management Act 2005 (District Disaster Management Plan).
          </div>
        </div>

        {/* Right 2 Columns: Prevention Packages Interactive Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Actionable Prevention Packages ({packages.length})
            </h3>
            <span className="text-xs text-slate-400">Toggle packages to simulate residual risk</span>
          </div>

          <div className="space-y-3">
            {packages.map(pkg => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  onClick={() => togglePackage(pkg.id)}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all ${
                    pkg.enabled
                      ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-950/20'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl border mt-0.5 flex-shrink-0 ${
                        pkg.enabled 
                          ? 'bg-teal-500/20 text-teal-400 border-teal-500/40' 
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                            {pkg.category.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            Risk Impact: -{pkg.riskReductionPoints} pts
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">
                          {pkg.title}
                        </h4>

                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                          <span>Scheme: <strong className="text-slate-300">{pkg.statutoryScheme}</strong></span>
                          <span>Timeline: <strong className="text-slate-300">{pkg.implementationMonths} mo</strong></span>
                          <span>Community Consent: <strong className="text-emerald-400">{pkg.communityAcceptancePct}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-white">
                        ₹{pkg.estimatedCostCr} Cr
                      </span>
                      <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        pkg.enabled ? 'bg-teal-500 justify-end' : 'bg-slate-800 justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
