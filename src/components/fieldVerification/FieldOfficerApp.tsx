import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  CheckSquare2, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Layers,
  FileText,
  UserCheck,
  Zap,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FieldOfficerApp: React.FC = () => {
  const { 
    settlements, 
    selectedSettlementId, 
    setSelectedSettlementId, 
    submitFieldVerificationEvidence,
    fieldTasks,
    updateFieldTaskStatus,
    triggerRoadADataConflict,
    setSelectedConflictId,
    setIsConflictModalOpen,
    dataConflicts,
    addToast
  } = useApp();

  const currentSettlement = settlements.find(s => s.id === selectedSettlementId) || settlements[0];
  const [activeTaskId, setActiveTaskId] = useState<string>(fieldTasks[0]?.id || 'task-01');

  const selectedTask = fieldTasks.find(t => t.id === activeTaskId) || fieldTasks[0];

  const [gpsCaptured, setGpsCaptured] = useState(true);
  const [gpsCoords, setGpsCoords] = useState({ lat: currentSettlement.latitude, lng: currentSettlement.longitude, accuracy: 2.4 });
  const [measuredDepth, setMeasuredDepth] = useState('1.4');
  const [photosUploaded, setPhotosUploaded] = useState<string[]>([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&fit=crop&q=80'
  ]);
  const [officerNotes, setOfficerNotes] = useState(
    'Inspected northern beachfront culvert B-07. Physical graduated water rod confirms +1.4m surge water over 350m span. Submergence undermines foundation. Recommend immediate closure & diversion to SH-49.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateGPS = () => {
    setGpsCoords({
      lat: currentSettlement.latitude + 0.0012,
      lng: currentSettlement.longitude + 0.0008,
      accuracy: 1.8
    });
    addToast({
      type: 'info',
      title: 'GPS High-Precision Lock Achieved',
      description: `Coordinates locked: ${(currentSettlement.latitude + 0.0012).toFixed(4)}° N, ${(currentSettlement.longitude + 0.0008).toFixed(4)}° E (±1.8m accuracy)`
    });
  };

  const handleAddPhoto = () => {
    setPhotosUploaded(prev => [
      ...prev,
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80'
    ]);
    addToast({
      type: 'success',
      title: 'Ground Photo Geotagged',
      description: 'Image embedded with tamper-proof EXIF GPS timestamp and surveyor badge signature.'
    });
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitFieldVerificationEvidence(currentSettlement.id, officerNotes);
      updateFieldTaskStatus(activeTaskId, 'VERIFIED', officerNotes);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
            <CheckSquare2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                HUMAN-IN-THE-LOOP GROUND VERIFICATION
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">
                ACTIVE FIELD SURVEY UNIT
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Field Officer Verification & Truth Grounding Portal
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Surveyor: Insp. R. Sundaram (Badge: TN-DDMA-F04) • Location: {currentSettlement.name}
            </p>
          </div>
        </div>

        {/* Habitation Filter */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400">Habitation:</span>
          <select
            value={currentSettlement.id}
            onChange={(e) => setSelectedSettlementId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer"
          >
            {settlements.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.district.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confidence Elevation Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              HUMAN-CALIBRATED TRUTH ENGINE
            </span>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
              <span className="text-slate-400">Pre-Survey AI Baseline: 72%</span>
              <span className="text-cyan-400">→</span>
              <span className="text-emerald-400 font-mono text-base font-black">
                Post-Survey Verified Confidence: 94% (STATUTORY READY)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Field observations ground truth satellite observations, eliminating hallucination risks prior to evacuation notices.
            </p>
          </div>
        </div>

        {/* Conflict Demo Trigger Button */}
        <button
          onClick={triggerRoadADataConflict}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 flex-shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Simulate Ground Discrepancy (Road A)</span>
        </button>
      </div>

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assigned Tasks List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Assigned Verification Tasks ({fieldTasks.length})
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">LIVE SYNC</span>
            </div>

            <div className="space-y-2.5">
              {fieldTasks.map(task => {
                const isSelected = task.id === activeTaskId;
                return (
                  <div
                    key={task.id}
                    onClick={() => setActiveTaskId(task.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/30' 
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                        {task.taskType}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                        task.status === 'CONFLICT_DETECTED' 
                          ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' 
                          : task.status === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {task.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {task.microZoneName}
                    </p>

                    {task.hasConflict && (
                      <div className="mt-2 p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-[10px] text-amber-300">
                        <span className="flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Discrepancy Flagged
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConflictId('conf-01');
                            setIsConflictModalOpen(true);
                          }}
                          className="text-amber-400 hover:underline font-bold"
                        >
                          Resolve →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Active Task Inspection Workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            
            {/* Task Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  ACTIVE TASK INSPECTION DOSSIER
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedTask.title}
                </h3>
                <span className="text-xs text-cyan-400 font-mono">
                  Target: {selectedTask.settlementName} ({selectedTask.microZoneName})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Assigned To:</span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {selectedTask.assignedOfficerName}
                </span>
              </div>
            </div>

            {/* AI Remote Sensor vs Field Measured Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block mb-1">
                  Expected AI Telemetry Condition
                </span>
                <p className="text-xs font-mono text-slate-200">
                  {selectedTask.expectedAiCondition}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                  <span>Confidence: <strong>{selectedTask.aiConfidence}%</strong></span>
                  <span>Model: SAR InSAR / Radar</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block mb-1">
                  Actual Physical Ground Observation
                </span>
                <p className="text-xs font-mono font-bold text-white">
                  {selectedTask.actualGroundObservation}
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 flex justify-between">
                  <span>Verified Confidence: <strong>{selectedTask.fieldConfidence}%</strong></span>
                  <span>Method: Physical Rod & EXIF</span>
                </div>
              </div>
            </div>

            {/* Live Measurements & Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* GPS Geotag Lock */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Survey Geolocation</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {gpsCoords.lat.toFixed(4)}° N, {gpsCoords.lng.toFixed(4)}° E (±{gpsCoords.accuracy}m)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateGPS}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Re-Lock GPS
                </button>
              </div>

              {/* Water Depth / Physical Measurement */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Measured Water Ingress Depth</span>
                  <span className="text-[11px] text-slate-400">Graduated Surveyor Rod</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={measuredDepth}
                    onChange={(e) => setMeasuredDepth(e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center outline-none focus:border-cyan-500"
                  />
                  <span className="text-xs text-slate-400 font-mono">meters</span>
                </div>
              </div>
            </div>

            {/* Geotagged Photo Evidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Geotagged Photo Evidence ({photosUploaded.length})
                </span>

                <button
                  onClick={handleAddPhoto}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Attach Ground Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {photosUploaded.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-700 h-28 group">
                    <img src={url} alt="Field Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-mono font-bold text-white">Proof #{idx + 1}</span>
                      <span className="text-[9px] font-mono text-cyan-300">EXIF Authenticated</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Assessment Notes */}
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Field Officer Technical Assessment & Ground Justification
              </span>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                placeholder="Enter physical observations, culvert scour measurements, and evacuation advice..."
              />
            </div>

            {/* Submit Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Task Status:</span>
                <Badge variant="status" level={selectedTask.status}>
                  {selectedTask.status}
                </Badge>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {selectedTask.hasConflict && (
                  <button
                    onClick={() => {
                      setSelectedConflictId('conf-01');
                      setIsConflictModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Open Conflict Arbiter</span>
                  </button>
                )}

                <button
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Syncing with Command Desk...' : 'Submit Ground Truth Dossier'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
