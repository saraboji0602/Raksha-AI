import React from 'react';
import { useApp } from '../../store/useAppStore';
import { EMERGENCY_HELPLINES } from '../../data/emergencyData';
import { 
  PhoneCall, 
  ShieldCheck, 
  HeartPulse, 
  Flame, 
  Ship, 
  Building2, 
  CheckSquare2, 
  Sparkles,
  Info,
  Radio
} from 'lucide-react';

export const CitizenEmergencyHelp: React.FC<{ onOpenSOS?: () => void }> = ({ onOpenSOS }) => {
  const { getSelectedSettlement, t } = useApp();
  const settlement = getSelectedSettlement();

  const getHelplineIcon = (category: string) => {
    switch (category) {
      case 'MEDICAL': return HeartPulse;
      case 'FIRE': return Flame;
      case 'POLICE': return Ship;
      case 'LOCAL_PANCHAYAT': return Building2;
      case 'RESCUE':
      default: return Radio;
    }
  };

  const survivalChecklist = [
    { text: 'Keep waterproof pouch ready with Aadhaar, ration card, land patta, and medical records', essential: true },
    { text: 'Pack 3 days of essential prescription medications (insulin, blood pressure, asthma inhalers)', essential: true },
    { text: 'Charge mobile phones, power banks, and keep LED emergency torches ready', essential: true },
    { text: 'Ensure minimum 2 liters potable drinking water bottle per family member', essential: true },
    { text: 'Keep infants/kids warm clothing and dry baby food rations packed', essential: true },
    { text: 'Switch off main electrical circuit breaker before leaving the house to avoid electrocution', essential: true },
    { text: 'Untether backyard livestock and move them toward high ground at Temple Ridge', essential: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950/70 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
              EMERGENCY DIRECTORY & PROTOCOLS
            </span>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
              24x7 ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('citizenNavHelp')} for {settlement.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Verified emergency numbers, medical response contacts, and survival guidelines for coastal & estuarine habitations.
          </p>
        </div>

        {onOpenSOS && (
          <button
            onClick={onOpenSOS}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95 flex-shrink-0"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>TRANSMIT SOS BEACON</span>
          </button>
        )}
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {EMERGENCY_HELPLINES.map((hl) => {
          const Icon = getHelplineIcon(hl.category);
          const isPrimary = hl.number === '1078' || hl.number === '108';

          return (
            <div
              key={hl.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isPrimary
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {hl.agency}
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="24x7 Available" />
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{hl.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{hl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-mono font-black text-lg text-white">
                  {hl.number}
                </span>

                <a
                  href={`tel:${hl.number}`}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Evacuation Survival Checklist */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <CheckSquare2 className="w-4 h-4 text-emerald-400" />
            <span>Pre-Evacuation Family Survival Checklist (Before Leaving Home)</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">Essential Preparedness</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {survivalChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 text-[10px]">
                ✓
              </div>
              <span className="leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
