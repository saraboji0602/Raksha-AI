import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { HazardReportType, IncidentSeverity, DamageCategory } from '../../types';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Send, 
  ShieldAlert, 
  Droplets, 
  Route, 
  Zap, 
  Building2,
  Hammer,
  FileSpreadsheet
} from 'lucide-react';

export const CitizenReportHazard: React.FC<{ onReportSuccess?: () => void }> = ({ onReportSuccess }) => {
  const { getSelectedSettlement, submitCitizenHazardReport, submitCitizenDamageClaim, t } = useApp();
  const settlement = getSelectedSettlement();

  const [mode, setMode] = useState<'HAZARD' | 'RECOVERY_CLAIM'>('HAZARD');

  // Emergency Hazard Form State
  const [reportType, setReportType] = useState<HazardReportType>('FLOOD_INUNDATION');
  const [selectedMicroZoneId, setSelectedMicroZoneId] = useState<string>(settlement.microZones[0]?.id || 'kz-1');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [title, setTitle] = useState<string>('Heavy Sea Wave Ingress across Frontline Compound');
  const [description, setDescription] = useState<string>('Wave runup has reached 1.1m depth near old temple culvert. Sand embankment undercutting rapidly.');
  const [reporterName, setReporterName] = useState<string>('D. Praveen');
  const [reporterPhone, setReporterPhone] = useState<string>('+91 97891 33455');
  const [photoSelected, setPhotoSelected] = useState<boolean>(true);

  // Recovery Claim State
  const [damageCategory, setDamageCategory] = useState<DamageCategory>('HOUSING');
  const [claimLossLakhs, setClaimLossLakhs] = useState('12');
  const [affectedPersons, setAffectedPersons] = useState('6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'HAZARD') {
      submitCitizenHazardReport({
        reportType,
        title,
        description,
        settlementId: settlement.id,
        microZoneId: selectedMicroZoneId,
        severity,
        reporterName,
        reporterPhone
      });
    } else {
      submitCitizenDamageClaim({
        category: damageCategory,
        title: title || 'Post-Disaster Household Damage Claim',
        description,
        estimatedLossLakhs: Number(claimLossLakhs) || 10,
        settlementId: settlement.id,
        affectedPersons: Number(affectedPersons) || 5,
        reporterName,
        reporterPhone
      });
    }

    if (onReportSuccess) onReportSuccess();
  };

  const hazardOptions: { id: HazardReportType; label: string; icon: any }[] = [
    { id: 'FLOOD_INUNDATION', label: 'Flood / Wave Inundation', icon: Droplets },
    { id: 'BLOCKED_ROAD', label: 'Blocked / Submerged Road', icon: Route },
    { id: 'SCARP_EROSION_LANDSLIDE', label: 'Coastal Scarp Erosion / Breach', icon: AlertTriangle },
    { id: 'ELECTRICAL_HAZARD', label: 'Snapped Power Line / Pole Hazard', icon: Zap },
    { id: 'DAMAGED_BRIDGE_CULVERT', label: 'Damaged Culvert / Causeway', icon: ShieldAlert },
    { id: 'UNSAFE_SHELTER', label: 'Unsafe / Damaged Shelter Structure', icon: Building2 }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/70 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
            COMMUNITY DISASTER & RECOVERY INTAKE
          </span>
          <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 uppercase">
            DIRECT CITIZEN TRANSMISSION
          </span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {mode === 'HAZARD' ? t('reportHazardTitle') : 'Post-Disaster Reconstruction & Damage Claim'}
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Submit observed hazards, blocked causeways, or post-disaster household damage in {settlement.name}. Intake feeds into DDMA emergency and recovery queues.
        </p>

        {/* Mode Selector */}
        <div className="mt-4 flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('HAZARD')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'HAZARD'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Hazard Report</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('RECOVERY_CLAIM')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'RECOVERY_CLAIM'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Post-Disaster Damage Claim</span>
          </button>
        </div>
      </div>

      {/* Reporting Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-xs">
        
        {mode === 'HAZARD' ? (
          <>
            {/* Hazard Category */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                1. Select Hazard Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hazardOptions.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = reportType === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setReportType(opt.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/70 text-amber-200 font-bold ring-1 ring-amber-500'
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="text-[11px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity & Micro-zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  2. Observed Threat Severity
                </label>
                <div className="flex items-center gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(sev => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase border transition-all ${
                        severity === sev
                          ? sev === 'CRITICAL'
                            ? 'bg-red-600 text-white border-red-400'
                            : sev === 'HIGH'
                            ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-cyan-600 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  3. Micro-Zone Location
                </label>
                <select
                  value={selectedMicroZoneId}
                  onChange={(e) => setSelectedMicroZoneId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold outline-none focus:border-amber-500"
                >
                  {settlement.microZones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          /* Post-Disaster Damage Claim Controls */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  1. Damage Sector Category
                </label>
                <select
                  value={damageCategory}
                  onChange={(e) => setDamageCategory(e.target.value as DamageCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="HOUSING">Housing & Structural Damage</option>
                  <option value="ROADS_BRIDGES">Road, Culvert or Boundary Wall</option>
                  <option value="WATER_POWER_UTILITIES">Water, Power & Utilities</option>
                  <option value="HEALTHCARE_SCHOOLS">Healthcare & Schools</option>
                  <option value="SHELTERS">Shelters</option>
                  <option value="COASTAL_PROTECTION">Coastal Protection & Sea Wall</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  2. Estimated Financial Loss (₹ Lakhs)
                </label>
                <input
                  type="number"
                  required
                  value={claimLossLakhs}
                  onChange={(e) => setClaimLossLakhs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                3. Total Affected Family Members
              </label>
              <input
                type="number"
                required
                value={affectedPersons}
                onChange={(e) => setAffectedPersons(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Headline Summary
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inundated foundation cracks on beachfront dwelling"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what is damaged, extent of submergence, or immediate help required..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Photo Evidence */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Photo / Visual Evidence (Geotagged)
          </label>
          <div
            onClick={() => setPhotoSelected(!photoSelected)}
            className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-between transition-all ${
              photoSelected
                ? 'border-emerald-500/80 bg-emerald-950/20'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${photoSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {photoSelected ? '✓ Ground Photo Attached: ground_evidence_dossier.jpg' : 'Click to attach camera photo'}
                </div>
                <div className="text-[10px] text-slate-400">
                  GPS EXIF Tagged: 10.7621° N, 79.8432° E • Authenticated
                </div>
              </div>
            </div>

            <span className="text-[11px] text-cyan-400 font-bold underline">
              {photoSelected ? 'Change' : 'Attach'}
            </span>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
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
            <label className="text-[10px] text-slate-400 block mb-0.5">Mobile Contact (For Officer Verification)</label>
            <input
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98 ${
              mode === 'HAZARD'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{mode === 'HAZARD' ? t('reportSubmitBtn') : 'Submit Damage Claim to DDMA Recovery Center'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
