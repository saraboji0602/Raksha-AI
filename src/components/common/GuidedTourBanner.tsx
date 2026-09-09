import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Play, ArrowRight, ArrowLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. National & District Overview Dashboard',
    desc: 'Review 128 vulnerable habitations, high-risk population counts, and interactive GIS hazard heatmaps.',
    actionLabel: 'Explore Kadalpuram Digital Twin'
  },
  {
    step: 2,
    title: '2. Flagship Settlement Digital Twin (Kadalpuram)',
    desc: 'Examine composite risk (91/100), explainable AI contributing factors (+24 coastal retreat), and infrastructure gaps.',
    actionLabel: 'Evaluate Intervention Engine'
  },
  {
    step: 3,
    title: '3. Protect vs Adapt vs Relocate Decision Engine',
    desc: 'Compare 4 strategic options: Protect (₹12 Cr), Adapt (₹19 Cr), Partial Relocate (₹28 Cr), and Full Relocate (₹41 Cr).',
    actionLabel: 'Discover Safe Haven Sites'
  },
  {
    step: 4,
    title: '4. Safe Relocation Sites & Carrying Capacity',
    desc: 'See why AI recommends Site B (Pothigai Haven) — combining 92/100 safety, 82% community acceptance, and 5,000 capacity.',
    actionLabel: 'Open Relocation Optimizer'
  },
  {
    step: 5,
    title: '5. Relocation Allocation & Phasing Planner',
    desc: 'Allocate 2,650 residents across 4 execution phases while retaining livelihood transit access to the coast.',
    actionLabel: 'Launch Scenario Simulator'
  },
  {
    step: 6,
    title: '6. What-If Scenario Simulator & Cost of Inaction',
    desc: 'Drag the investment slider to simulate dynamic risk reduction vs ₹96 Cr cost of waiting.',
    actionLabel: 'Test Field Verification'
  },
  {
    step: 7,
    title: '7. Human-in-the-Loop Field Verification',
    desc: 'Submit ground evidence and observe AI confidence instantly increase from 72% to 94%.',
    actionLabel: 'Generate Decision Reports'
  },
  {
    step: 8,
    title: '8. Executive Decision Dossiers & Export',
    desc: 'Generate printable official reports and CSV data exports for District & State authorities.',
    actionLabel: 'Complete Tour'
  }
];

export const GuidedTourBanner: React.FC = () => {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, endTour } = useApp();

  if (!isTourActive || tourStep === 0) return null;

  const current = TOUR_STEPS[tourStep - 1] || TOUR_STEPS[0];
  const total = TOUR_STEPS.length;

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/40 p-3 sm:px-6 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 uppercase">
                Hackathon Demo Tour • Step {tourStep} of {total}
              </span>
              <span className="text-sm font-bold text-white tracking-tight">{current.title}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">{current.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          {tourStep > 1 && (
            <button
              onClick={prevTourStep}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button
            onClick={nextTourStep}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <span>{current.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={endTour}
            title="Exit Demo Tour"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
