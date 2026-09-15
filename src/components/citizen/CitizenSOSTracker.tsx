import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  Radio, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Truck, 
  Users, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CitizenSOSTracker: React.FC<{ incidentId?: string; onNewSOS?: () => void }> = ({ incidentId, onNewSOS }) => {
  const { incidents, activeCitizenSosId, t } = useApp();
  
  const targetId = incidentId || activeCitizenSosId || incidents[0]?.id;
  const incident = incidents.find(i => i.id === targetId) || incidents[0];

  if (!incident) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <Radio className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
        <h3 className="text-sm font-bold text-white">No Active SOS Signal</h3>
        <p className="text-xs text-slate-400">All emergency channels are clear.</p>
        {onNewSOS && (
          <button
            onClick={onNewSOS}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
          >
            Transmit Emergency SOS
          </button>
        )}
      </div>
    );
  }

  const steps = [
    { key: 'SUBMITTED', label: 'SOS Transmitted', subtext: 'GPS lock & distress packet sent' },
    { key: 'RECEIVED', label: 'Received by DDMA', subtext: 'Triaged by Operations Desk' },
    { key: 'ASSIGNED', label: 'Rescue Team Dispatched', subtext: incident.assignedResource ? incident.assignedResource.teamName : 'Assigning nearest asset' },
    { key: 'EN_ROUTE', label: 'En Route to Location', subtext: incident.assignedResource ? `ETA ~${incident.assignedResource.etaMinutes} mins` : 'Navigating high route' },
    { key: 'RESOLVED', label: 'On Scene / Rescued', subtext: 'Evacuation to safe haven' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'RECEIVED':
      case 'UNDER_REVIEW': return 1;
      case 'ASSIGNED': return 2;
      case 'EN_ROUTE': return 3;
      case 'ON_SCENE':
      case 'RESOLVED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(incident.status);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-red-500/80 shadow-2xl shadow-red-950/40 space-y-5">
      {/* Live SOS Beacon Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-red-600 text-white animate-pulse flex-shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-700 uppercase animate-pulse">
                LIVE RESCUE TRACKER
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {incident.id}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              {incident.title}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{incident.settlementName} • {incident.microZoneName} • {incident.landmark}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-red-950/80 p-2.5 rounded-2xl border border-red-800/80 self-start sm:self-auto">
          <span className="text-xs text-red-300 font-medium">Assigned Priority:</span>
          <span className="font-mono font-black text-lg text-white bg-red-600 px-2.5 py-0.5 rounded-xl shadow-inner">
            {incident.priorityScore} / 100
          </span>
        </div>
      </div>

      {/* Real-Time Stepper */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Incident Response Lifecycle
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-red-950/60 border-red-500 shadow-md ring-1 ring-red-500'
                    : isCompleted
                    ? 'bg-slate-950/80 border-emerald-800/80 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[10px] text-slate-400">STEP 0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="font-bold text-white text-xs leading-snug">{step.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{step.subtext}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatched Unit Card (if assigned) */}
      {incident.assignedResource ? (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>DISPATCHED RESCUE UNIT EN ROUTE</span>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
              ETA ~{incident.assignedResource.etaMinutes} Minutes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Unit Assigned:</span>
              <strong className="text-white">{incident.assignedResource.teamName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Dispatched At:</span>
              <strong className="text-slate-200">{incident.assignedResource.dispatchedAt}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Direct Emergency Contact:</span>
              <a
                href={`tel:${incident.assignedResource.contactNumber}`}
                className="text-cyan-400 font-mono font-bold hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{incident.assignedResource.contactNumber}</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Triage in progress at DDMA Control Room. Nearest boat squad being assigned.</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Queue #1</span>
        </div>
      )}

      {/* Detailed Demographic Tally & Timeline Log */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="font-bold text-slate-300 block">Family & Persons Under Rescue:</span>
          <div className="text-slate-400 space-y-0.5 text-[11px]">
            <div>Total Persons: <strong className="text-white">{incident.peopleCount}</strong></div>
            <div>Elderly (65+): <strong className="text-amber-300">{incident.vulnerableDetails.elderlyCount}</strong></div>
            <div>Infants/Children: <strong className="text-cyan-300">{incident.vulnerableDetails.infantsChildrenCount}</strong></div>
            <div>Medical/Oxygen Need: <strong className="text-rose-300">{incident.vulnerableDetails.medicalNeedCount}</strong></div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="font-bold text-slate-300 block">Live Telemetry Timeline:</span>
          <div className="space-y-1 text-[11px] max-h-24 overflow-y-auto">
            {incident.timeline.map((evt, idx) => (
              <div key={idx} className="text-slate-400 flex items-start gap-1.5">
                <span className="text-cyan-400 font-mono text-[10px] flex-shrink-0 mt-0.5">[{evt.timestamp}]</span>
                <span>{evt.label} {evt.notes && <em className="text-slate-500">({evt.notes})</em>}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
