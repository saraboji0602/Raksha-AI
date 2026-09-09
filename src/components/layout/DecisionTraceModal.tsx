import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Modal } from '../common/Modal';
import { 
  Database, 
  Map, 
  AlertTriangle, 
  Users, 
  Cpu, 
  GitBranch, 
  ShieldCheck, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  FileCheck2,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export const DecisionTraceModal: React.FC = () => {
  const { isDecisionTraceOpen, setIsDecisionTraceOpen, getSelectedSettlement } = useApp();
  const settlement = getSelectedSettlement();

  const pipelineSteps = [
    {
      step: 1,
      title: 'Multimodal Data Ingestion',
      icon: Database,
      badge: 'GIS + Remote Sensing',
      desc: 'Synthetic InSAR shoreline retreat (3.4m/yr), IMD storm surge envelope, and CWC hydrological runoff DEM layers.',
      output: 'Validated Spatial Inputs'
    },
    {
      step: 2,
      title: 'Multi-Hazard Exposure Fusion',
      icon: Layers,
      badge: 'Hazard Engine',
      desc: 'Spatial overlay of coastal erosion (96), cyclonic surge (88), and fluvial flooding (82) calculating 91/100 composite risk.',
      output: `Hazard Score: ${settlement.overallRisk}/100`
    },
    {
      step: 3,
      title: 'Vulnerability & Resilience Modeling',
      icon: Users,
      badge: 'Demographics + Infrastructure',
      desc: '4,210 exposed residents (87%), 64% semi-pucca housing, single bridge B-07 egress choke point.',
      output: `Vulnerability: ${settlement.vulnerabilityScore}/100 | Resilience: ${settlement.resilienceScore}/100`
    },
    {
      step: 4,
      title: 'Micro-Zone Disaggregation',
      icon: Cpu,
      badge: 'Digital Twin AI',
      desc: 'Zone A (North Spit): Extreme wave attack -> Relocate. Zone B (Central): High surge -> Adapt. Zone C (South): Mangrove shielded -> Protect.',
      output: 'Targeted Interventions (Not Blank Village Evacuation)'
    },
    {
      step: 5,
      title: 'Protect vs Adapt vs Relocate Engine',
      icon: GitBranch,
      badge: 'Decision Engine',
      desc: 'Evaluates hard defense vs nature-based adaptation vs resettlement economics. Selects Partial Relocation for maximum cost-effectiveness.',
      output: `Recommendation: ${settlement.aiRecommendation.replace('_', ' ')}`
    },
    {
      step: 6,
      title: 'Safe Site Discovery & Carrying Capacity',
      icon: ShieldCheck,
      badge: 'Carrying Capacity Registry',
      desc: 'Site B (Pothigai Haven) selected: 92/100 hazard safety, 5,000 capacity, and 82% community acceptance with fishery transit access.',
      output: 'Recommended Haven: Site B'
    },
    {
      step: 7,
      title: 'Human-in-the-Loop Field Verification',
      icon: CheckCircle2,
      badge: 'Ground Truth Validation',
      desc: 'Field inspection confirms active scarp erosion and water table salinity. Data confidence upgraded from 72% to 94%.',
      output: 'Confidence: 94% (Verified)'
    },
    {
      step: 8,
      title: 'Actionable Government Relocation Dossier',
      icon: FileCheck2,
      badge: 'DDMA / SDMA Action',
      desc: 'Generates 4-phase resettlement roadmap, infrastructure gap budget (₹28.0 Cr), avoiding ₹96.0 Cr cost of inaction.',
      output: 'Ready for Administrative Sanction'
    }
  ];

  return (
    <Modal
      isOpen={isDecisionTraceOpen}
      onClose={() => setIsDecisionTraceOpen(false)}
      title="RAKSHA-AI Decision Trace & Explainability Architecture"
      subtitle={`End-to-End Auditable Decision Pipeline for ${settlement.name}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Transparent & Explainable Government AI</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                No black boxes. Every risk score, priority ranking, and relocation recommendation is mapped to traceable physical evidence.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            AUDITABLE
          </span>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="relative border-l-2 border-cyan-500/30 ml-4 pl-6 space-y-6">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative group">
                {/* Step Circle Indicator */}
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-500 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shadow-md shadow-cyan-500/30">
                  {step.step}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <h5 className="text-sm font-bold text-white">{step.title}</h5>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                      {step.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Pipeline Output:</span>
                    <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {step.output}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => setIsDecisionTraceOpen(false)}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            Close Trace Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};
