import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { EmergencyType, VulnerableDemographics } from '../../types';
import { 
  AlertTriangle, 
  Users, 
  HeartHandshake, 
  MapPin, 
  Phone, 
  User, 
  ShieldAlert, 
  X, 
  Sparkles,
  Baby,
  Accessibility,
  HeartPulse,
  Radio,
  Send
} from 'lucide-react';

export const CitizenSOSModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { getSelectedSettlement, triggerCitizenSOS, t } = useApp();
  const settlement = getSelectedSettlement();

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('FLOOD_TRAPPED');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [selectedMicroZoneId, setSelectedMicroZoneId] = useState<string>(settlement.microZones[0]?.id || 'kz-1');
  const [landmark, setLandmark] = useState<string>('Behind Old Mariamman Temple, Shoreline Road');
  const [description, setDescription] = useState<string>('Surge water entering house compound reaching 1.2m depth. Ground foundation eroding.');
  const [reporterName, setReporterName] = useState<string>('K. Murugesan');
  const [reporterPhone, setReporterPhone] = useState<string>('+91 98421 90812');

  const [elderlyCount, setElderlyCount] = useState<number>(2);
  const [infantsCount, setInfantsCount] = useState<number>(1);
  const [disabledCount, setDisabledCount] = useState<number>(0);
  const [medicalNeedCount, setMedicalNeedCount] = useState<number>(1);
  const [pregnantCount, setPregnantCount] = useState<number>(0);

  if (!isOpen) return null;

  const handleTransmitSOS = (e: React.FormEvent) => {
    e.preventDefault();
    const vulnerableDetails: VulnerableDemographics = {
      elderlyCount,
      infantsChildrenCount: infantsCount,
      disabledCount,
      medicalNeedCount,
      pregnantCount
    };

    triggerCitizenSOS({
      type: emergencyType,
      peopleCount,
      vulnerableDetails,
      microZoneId: selectedMicroZoneId,
      landmark,
      description,
      reporterName,
      reporterPhone
    });

    onClose();
  };

  const emergencyTypeOptions: { id: EmergencyType; label: string; icon: any; color: string }[] = [
    { id: 'FLOOD_TRAPPED', label: 'Trapped by Inundation / High Water', icon: AlertTriangle, color: 'border-red-500 bg-red-950/40 text-red-300' },
    { id: 'MEDICAL_EMERGENCY', label: 'Critical Medical / Oxygen Distress', icon: HeartPulse, color: 'border-rose-500 bg-rose-950/40 text-rose-300' },
    { id: 'HOUSE_COLLAPSE_RISK', label: 'House / Roof Structural Collapse', icon: ShieldAlert, color: 'border-amber-500 bg-amber-950/40 text-amber-300' },
    { id: 'CUT_OFF_BY_WATER', label: 'Islanded / Submerged Access Road', icon: MapPin, color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl shadow-red-950/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-slate-900 to-red-900 border-b border-red-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white animate-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-700 uppercase">
                  DIRECT RESCUE BEACON
                </span>
                <span className="text-[10px] font-mono text-slate-400">DDMA + NDRF CHANNEL</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                {t('sosTitle')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleTransmitSOS} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Emergency Nature Selector */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-2">
              1. {t('sosTypeLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {emergencyTypeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = emergencyType === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setEmergencyType(opt.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-950/80 ring-1 ring-red-500 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className="text-[11px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* People Count & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                2. Total People Requiring Rescue
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6, 8, 12].map(n => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setPeopleCount(n)}
                    className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs border transition-all ${
                      peopleCount === n
                        ? 'bg-red-600 text-white border-red-400'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {n}{n === 12 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                3. Habitation Sector / Micro-Zone
              </label>
              <select
                value={selectedMicroZoneId}
                onChange={(e) => setSelectedMicroZoneId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold outline-none focus:border-red-500"
              >
                {settlement.microZones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Risk: {z.riskScore}/100)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vulnerable Group Counter Checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-red-950/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-red-400" />
                <span>Vulnerable Family Members (Boosts Dispatch Priority)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Deterministic Triage</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Elderly (65+)</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setElderlyCount(Math.max(0, elderlyCount - 1))}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{elderlyCount}</span>
                  <button
                    type="button"
                    onClick={() => setElderlyCount(elderlyCount + 1)}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Infants</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{infantsCount}</span>
                  <button
                    type="button"
                    onClick={() => setInfantsCount(infantsCount + 1)}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Accessibility className="w-3.5 h-3.5 text-purple-400" />
                  <span>Disabled</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDisabledCount(Math.max(0, disabledCount - 1))}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{disabledCount}</span>
                  <button
                    type="button"
                    onClick={() => setDisabledCount(disabledCount + 1)}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>Medical Need</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMedicalNeedCount(Math.max(0, medicalNeedCount - 1))}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{medicalNeedCount}</span>
                  <button
                    type="button"
                    onClick={() => setMedicalNeedCount(medicalNeedCount + 1)}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-pink-400" />
                  <span>Pregnant</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPregnantCount(Math.max(0, pregnantCount - 1))}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{pregnantCount}</span>
                  <button
                    type="button"
                    onClick={() => setPregnantCount(pregnantCount + 1)}
                    className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Exact Landmark & Description */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Specific Landmark / Door No.
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Old Temple, Shoreline Road #44"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Urgent Situation Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Water level, medical condition, special assistance needed..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Reporter Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Mobile Contact</label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Transmit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{t('sosTransmitBtn')}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Instant telemetry sync • Directly alerts District Collectorate Emergency Control Desk
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
