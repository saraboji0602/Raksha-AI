import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Camera, 
  Clock, 
  UserCheck, 
  Cpu, 
  Navigation, 
  ArrowRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const DataConflictResolutionModal: React.FC = () => {
  const { 
    isConflictModalOpen, 
    setIsConflictModalOpen, 
    dataConflicts, 
    selectedConflictId, 
    resolveDataConflict,
    currentUser,
    t
  } = useApp();

  const conflict = dataConflicts.find(c => c.id === selectedConflictId) || dataConflicts[0];
  const [rationale, setRationale] = useState<string>(
    'Field physical inspection confirms 1.4m tidal surge inundation across causeway. Satellite radar model out-of-date. Accepting ground truth to avoid entrapping evacuating citizens.'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isConflictModalOpen || !conflict) return null;

  const isResolved = conflict.status.startsWith('RESOLVED');

  const handleResolve = (choice: 'ACCEPT_FIELD' | 'ACCEPT_AI') => {
    setIsProcessing(true);
    setTimeout(() => {
      resolveDataConflict(conflict.id, choice, rationale);
      setIsProcessing(false);
      setIsConflictModalOpen(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  STATUTORY HUMAN DECISION REQUIRED
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 uppercase">
                  {conflict.conflictSeverity} CONFLICT
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Data Conflict Arbiter: {conflict.parameterName}
              </h2>
              <p className="text-xs text-slate-300">
                Location: {conflict.locationName} • Habitation: {conflict.settlementName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConflictModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Discrepancy Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-200 leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">Discrepancy Analysis:</strong>
              {conflict.discrepancySummary}
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Stream A: AI Remote Sensor */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-950/80 border-b border-l border-cyan-800 text-[10px] font-mono text-cyan-300 rounded-bl-xl font-bold">
                REMOTE SENSOR STREAM
              </div>

              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>AI Radar / Satellite Telemetry</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-3">
                  <span className="text-[11px] text-slate-400 block">Reported State:</span>
                  <span className="text-sm font-bold text-white font-mono block mt-0.5">
                    {conflict.aiValue}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Telemetry Source:</span>
                    <span className="font-mono text-slate-200">{conflict.aiSource}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {conflict.aiTimestamp}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Model Confidence:</span>
                    <span className="font-mono font-bold text-cyan-400">{conflict.aiConfidence}%</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                ⚠️ <span className="text-slate-300 font-semibold">Sensor Limitation:</span> SAR Radar pass occurred during low-tide dry envelope. Lacks sub-hourly wave runup resolution.
              </div>
            </div>

            {/* Stream B: Field Officer Physical Ground Truth */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-lg shadow-emerald-950/20">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-950 border-b border-l border-emerald-700 text-[10px] font-mono text-emerald-300 rounded-bl-xl font-bold">
                PHYSICAL GROUND TRUTH
              </div>

              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Field Verification Inspection</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 mb-3">
                  <span className="text-[11px] text-emerald-400 block">Ground Measured State:</span>
                  <span className="text-sm font-bold text-white font-mono block mt-0.5">
                    {conflict.fieldValue}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Inspecting Officer:</span>
                    <span className="font-bold text-white">{conflict.fieldOfficerName} ({conflict.fieldOfficerBadge})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Verification Time:</span>
                    <span className="font-mono text-emerald-300 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-emerald-400" /> {conflict.fieldTimestamp}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Ground Confidence:</span>
                    <span className="font-mono font-black text-emerald-400">{conflict.fieldConfidence}% (CALIBRATED)</span>
                  </div>
                </div>
              </div>

              {/* Photo Evidence & Notes */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block mb-0.5">Officer Ground Note:</strong>
                  "{conflict.fieldEvidenceNotes}"
                </p>

                {conflict.fieldGeotaggedPhotoUrl && (
                  <div className="relative rounded-xl overflow-hidden h-24 border border-emerald-500/30">
                    <img 
                      src={conflict.fieldGeotaggedPhotoUrl} 
                      alt="Field Proof" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                        <Camera className="w-3 h-3" /> EXIF GPS Tagged: Culvert B-07 Inundation (+1.4m)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Cascading Automated Workflow Impact */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
              Workflows Automatically Updated on Decision:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {conflict.impactedWorkflows.map((wf, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{wf}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Human Decision Override Rationale */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Officer Official Statutory Rationale (Logged into Immutable Audit Ledger):
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              disabled={isResolved}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed disabled:opacity-60"
              placeholder="Enter statutory justification under Disaster Management Act 2005..."
            />
          </div>

          {isResolved && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong>Conflict Resolved:</strong> Resolved by {conflict.resolvedBy?.name || 'District Collector'} on {conflict.resolvedAt || 'Today'}.
                <div className="text-[11px] text-slate-300 mt-0.5">Choice: {conflict.resolutionChoice} • {conflict.officerDecisionReason}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Deciding Authority:</span>
            <strong className="text-white">{currentUser.name} ({currentUser.role})</strong>
          </div>

          {!isResolved ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleResolve('ACCEPT_AI')}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors disabled:opacity-50"
              >
                Retain AI Model (Advisory)
              </button>

              <button
                onClick={() => handleResolve('ACCEPT_FIELD')}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Resolving & Syncing...' : 'Accept Field Evidence (High Confidence 96%)'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConflictModalOpen(false)}
              className="px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
