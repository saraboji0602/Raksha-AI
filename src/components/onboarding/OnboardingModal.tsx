import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { Modal } from '../common/Modal';
import { Shield, Sparkles, Map, GitBranch, Compass, ArrowRight, Check } from 'lucide-react';

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { startDemoTour } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Understand Modeled Multi-Hazard Risk',
      icon: Map,
      tagline: 'From Raw Satellite GIS to Vulnerability Twin',
      desc: 'RAKSHA-AI integrates InSAR coastal regression, hydrological DEMs, and census data to diagnose which specific habitations are in critical red-zones without relying on generic flood maps.'
    },
    {
      step: 2,
      title: 'Evaluate Protect vs Adapt vs Relocate',
      icon: GitBranch,
      tagline: 'Avoid Automatic Blanket Displacement',
      desc: 'Our AI Decision Engine evaluates micro-zones within habitations — determining if engineering adaptation can protect inland sectors while focusing relocation only on frontline extreme hazard zones.'
    },
    {
      step: 3,
      title: 'Discover Safe Havens & Carrying Capacity',
      icon: Compass,
      tagline: 'Social Compatibility & Carrying Capacity Bottlenecks',
      desc: 'Identifies verified inland safe havens honoring utility carrying capacities and maximizes community acceptance to ensure relocated citizens maintain their coastal or agrarian livelihoods.'
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to RAKSHA-AI Decision Intelligence"
      subtitle="AI-Driven Hazard Red-Zone Detection & Intelligent Relocation Prioritization"
      maxWidth="xl"
    >
      <div className="space-y-6 text-xs">
        {/* Step Visual Indicator */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          {steps.map(s => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-1 flex items-center gap-2 cursor-pointer pb-1 border-b-2 transition-all ${
                currentStep === s.step
                  ? 'border-cyan-500 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px]">
                {s.step}
              </span>
              <span className="truncate hidden sm:inline text-[11px]">Step {s.step}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
            <current.icon className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              {current.tagline}
            </span>
            <h3 className="text-base font-bold text-white mt-1">{current.title}</h3>
            <p className="text-slate-300 mt-2 leading-relaxed text-xs max-w-md mx-auto">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-semibold"
          >
            Skip to Dashboard
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  startDemoTour();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Launch 4-Min Demo Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
