import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  CheckSquare2, 
  MapPin, 
  Camera, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Mic, 
  FileText,
  UserCheck,
  Compass
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FieldOfficerApp: React.FC = () => {
  const { 
    settlements, 
    selectedSettlementId, 
    setSelectedSettlementId, 
    submitFieldVerificationEvidence,
    addToast,
    setCurrentPage 
  } = useApp();

  const currentSettlement = settlements.find(s => s.id === selectedSettlementId) || settlements[0];

  const [gpsCaptured, setGpsCaptured] = useState(true);
  const [gpsCoords, setGpsCoords] = useState({ lat: currentSettlement.latitude, lng: currentSettlement.longitude, accuracy: 2.4 });
  const [photosUploaded, setPhotosUploaded] = useState<string[]>([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&fit=crop&q=80'
  ]);
  const [officerNotes, setOfficerNotes] = useState(
    'Inspected northern scarp. Active 3.4m wave retreat verified. Saltwater ingress has salinized 6 village drinking wells. Evacuation Bridge B-07 structure shows scour signs.'
  );
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Active coastal erosion scarp marks visible on ground', checked: true, severity: 'CRITICAL' },
    { id: 'c2', label: 'Estuarine drainage channels blocked by sand spit', checked: true, severity: 'HIGH' },
    { id: 'c3', label: 'Village drinking wells salinized by sea ingress', checked: true, severity: 'CRITICAL' },
    { id: 'c4', label: 'Emergency cyclone shelter roof & doors in operational condition', checked: false, severity: 'MEDIUM' },
    { id: 'c5', label: 'Single egress bridge B-07 clear of construction debris', checked: true, severity: 'HIGH' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleSimulateGPS = () => {
    setGpsCoords({
      lat: currentSettlement.latitude + (Math.random() - 0.5) * 0.002,
      lng: currentSettlement.longitude + (Math.random() - 0.5) * 0.002,
      accuracy: 1.8
    });
    addToast({
      type: 'info',
      title: 'GPS Locked with High Precision',
      description: `Coordinates locked: ${gpsCoords.lat.toFixed(4)} N, ${gpsCoords.lng.toFixed(4)} E (±1.8m)`
    });
  };

  const handleAddSimulatedPhoto = () => {
    setPhotosUploaded(prev => [
      ...prev,
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80'
    ]);
    addToast({
      type: 'success',
      title: 'Ground Photo Geotagged & Attached',
      description: 'Photo embedded with cryptographic timestamp and EXIF GPS coordinates.'
    });
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitFieldVerificationEvidence(currentSettlement.id, officerNotes);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile-Friendly Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
            <CheckSquare2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                HUMAN-IN-THE-LOOP GROUND VERIFICATION
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">
                FIELD OFFICER PORTAL
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Field Ground Truth Dossier: {currentSettlement.name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Field Officer: Insp. R. Sundaram (Badge: TN-DDMA-F04)
            </p>
          </div>
        </div>

        {/* Habitation Selector */}
        <select
          value={currentSettlement.id}
          onChange={(e) => setSelectedSettlementId(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer self-end sm:self-auto"
        >
          {settlements.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.district.split(' ')[0]})
            </option>
          ))}
        </select>
      </div>

      {/* Human-in-the-Loop Confidence Upgrade Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              CONFIDENCE UPGRADE ENGINE
            </span>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
              <span className="text-slate-400">Pre-Verification: 72%</span>
              <span className="text-cyan-400">→</span>
              <span className="text-emerald-400 font-mono text-base font-black">
                Post-Verification: 94% (HIGH)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Ground evidence corroborates AI satellite InSAR findings. Risk model calibrated with field truth.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 flex-shrink-0">
          ✓ MODEL CALIBRATED
        </span>
      </div>

      {/* Verification Steps Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: GPS & Field Checklist */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          {/* GPS Capture */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">GPS Geolocation Lock</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {gpsCoords.lat.toFixed(4)}° N, {gpsCoords.lng.toFixed(4)}° E (±{gpsCoords.accuracy}m)
                </span>
              </div>
            </div>

            <button
              onClick={handleSimulateGPS}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Re-Lock GPS
            </button>
          </div>

          {/* Observational Checklist */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Physical Hazard & Infrastructure Checklist
            </span>

            <div className="space-y-2">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    item.checked
                      ? 'bg-slate-950 border-cyan-500/60 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-medium leading-tight block">{item.label}</span>
                    <span className="text-[10px] font-mono font-bold text-rose-400 mt-0.5 block">
                      Severity: {item.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Geotagged Photos & Officer Notes */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Geotagged Photo Evidence ({photosUploaded.length})
              </span>

              <button
                onClick={handleAddSimulatedPhoto}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Add Ground Photo</span>
              </button>
            </div>

            {/* Photo thumbnails grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {photosUploaded.map((url, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-700 h-28 group">
                  <img src={url} alt="Field Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-mono font-bold text-white">Photo #{idx + 1}</span>
                    <span className="text-[9px] font-mono text-cyan-300">GPS EXIF Verified</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Officer Observation Notes */}
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Field Officer Technical Assessment
              </span>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                placeholder="Enter technical observations, ground measurements, and community consensus notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Status: <strong className="text-emerald-400">{currentSettlement.status}</strong>
            </span>

            <button
              onClick={handleSubmitVerification}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'Calibrating AI Model...' : 'Submit Verification & Boost Confidence'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
