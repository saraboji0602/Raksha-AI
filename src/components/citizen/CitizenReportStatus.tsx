import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  UserCheck, 
  FileText, 
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { CitizenSOSTracker } from './CitizenSOSTracker';

export const CitizenReportStatus: React.FC<{ onNewReport?: () => void; onNewSOS?: () => void }> = ({
  onNewReport,
  onNewSOS
}) => {
  const { hazardReports, incidents, activeCitizenSosId, t } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            VERIFIED BY FIELD OFFICER
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            RESOLVED / MITIGATED
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
            <Clock className="w-3 h-3 text-amber-400" />
            UNDER DDMA REVIEW
          </span>
        );
      case 'SUBMITTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3 h-3 text-slate-400" />
            SUBMITTED TO CONTROL ROOM
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/70 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
              TRANSPARENT STATUS TRACKER
            </span>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
              AUDITABLE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {t('citizenNavStatus')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Track official lifecycle updates for your distress beacons and community hazard submissions. Connected directly to District Collectorate decision logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNewSOS && (
            <button
              onClick={onNewSOS}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>New SOS</span>
            </button>
          )}

          {onNewReport && (
            <button
              onClick={onNewReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
            >
              + Report Hazard
            </button>
          )}
        </div>
      </div>

      {/* Active SOS Tracker Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span>Active SOS Distress Beacons</span>
        </h3>
        <CitizenSOSTracker incidentId={activeCitizenSosId || undefined} onNewSOS={onNewSOS} />
      </div>

      {/* Submitted Hazard Reports */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Submitted Hazard & Damage Reports ({hazardReports.length})</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Synchronized with Officer Queue</span>
        </div>

        <div className="space-y-3">
          {hazardReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {rep.id}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-700 uppercase">
                      {rep.reportType.replace(/_/g, ' ')}
                    </span>
                    {getStatusBadge(rep.status)}
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{rep.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{rep.settlementName} • {rep.microZoneName}</span>
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">{rep.timestamp}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Confidence {rep.confidenceScore}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rep.description}
              </p>

              {rep.officerVerificationNotes && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300 flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Officer Verification Log:</strong>
                    <span>{rep.officerVerificationNotes}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
