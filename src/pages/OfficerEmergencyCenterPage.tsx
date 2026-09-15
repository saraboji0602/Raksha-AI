import React, { useState } from 'react';
import { useApp } from '../store/useAppStore';
import { 
  IncidentItem, 
  IncidentStatus, 
  EmergencyResource,
  EmergencyShelter,
  RoadSegment,
  HazardReportItem,
  IncidentTimelineEvent
} from '../types';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Route, 
  PhoneCall, 
  MapPin, 
  Send, 
  Sparkles, 
  UserCheck, 
  X,
  FileText,
  AlertCircle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const OfficerEmergencyCenterPage: React.FC = () => {
  const { 
    incidents, 
    hazardReports, 
    shelters, 
    roads, 
    emergencyResources, 
    assignResourceToIncident, 
    updateIncidentStatus, 
    updateHazardReportStatus,
    updateShelterOccupancy,
    toggleRoadBlockage,
    getSelectedSettlement,
    emergencyMode,
    setEmergencyMode,
    t 
  } = useApp();

  const settlement = getSelectedSettlement();

  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(incidents[0] || null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string>(emergencyResources[0]?.id || 'res-ndrf-boat-4');
  const [dispatchNotes, setDispatchNotes] = useState<string>('Dispatched via Inland Elevated Bypass Route B. Direct VHF channel open.');

  const activeSOSList = incidents.filter((i: IncidentItem) => i.status !== 'RESOLVED');

  const totalVulnerableUnderThreat = incidents.reduce((acc: number, inc: IncidentItem) => {
    return acc + inc.vulnerableCount;
  }, 0);

  const totalPeopleUnderThreat = incidents.reduce((acc: number, inc: IncidentItem) => {
    return acc + inc.peopleCount;
  }, 0);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    assignResourceToIncident(selectedIncident.id, selectedResourceId, dispatchNotes);
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Command Center Operations Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-2 border-red-500/80 shadow-2xl shadow-red-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-red-600 text-white animate-pulse flex-shrink-0">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-700 uppercase animate-pulse">
                OFFICER COMMAND OPERATIONS
              </span>
              <span className="text-[10px] font-mono text-slate-400">DDMA + NDRF INTEGRATED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {t('officerEmergencyTitle')}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Triage real-time citizen distress beacons, assign rescue boats and medical assets, track shelter occupancy headroom, and maintain shared road safety status.
            </p>
          </div>
        </div>

        {/* Emergency Mode Banner & Quick Toggle */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto flex-shrink-0">
          <div className="text-right text-xs">
            <div className="font-bold text-white">Emergency Mode</div>
            <div className="text-[10px] text-red-400 font-mono">High-Priority Life Safety</div>
          </div>
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-3 py-1.5 rounded-xl font-mono font-black text-xs transition-all ${
              emergencyMode
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {emergencyMode ? 'ACTIVE 🚨' : 'ENABLE'}
          </button>
        </div>
      </div>

      {/* Top Threat & Demographics KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-red-800/80 shadow-lg">
          <span className="text-[11px] text-red-400 font-bold uppercase block">Active SOS Beacons</span>
          <div className="font-mono font-black text-2xl text-white mt-1">
            {activeSOSList.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Requires immediate dispatch triage</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-amber-400 font-bold uppercase block">Vulnerable People Trapped</span>
          <div className="font-mono font-black text-2xl text-amber-400 mt-1">
            {totalVulnerableUnderThreat}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Elderly, infants, medical need</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-cyan-400 font-bold uppercase block">Total Trapped Citizens</span>
          <div className="font-mono font-black text-2xl text-cyan-300 mt-1">
            {totalPeopleUnderThreat}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Across frontline micro-zones</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-emerald-400 font-bold uppercase block">Available Rescue Assets</span>
          <div className="font-mono font-black text-2xl text-emerald-400 mt-1">
            {emergencyResources.filter((r: EmergencyResource) => r.status === 'AVAILABLE').length} / {emergencyResources.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Boats, ambulances, trucks</div>
        </div>
      </div>

      {/* Main Grid: SOS Queue & Detailed Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left SOS Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span>{t('liveSOSQueue')} ({incidents.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">Deterministic Scoring</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {incidents.map((inc: IncidentItem) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isResolved = inc.status === 'RESOLVED';

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-red-500 shadow-xl ring-1 ring-red-500/50'
                      : isResolved
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {inc.id}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                        inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {inc.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="font-mono font-black text-sm text-white bg-red-600 px-2 py-0.5 rounded-lg shadow-inner">
                      Priority: {inc.priorityScore}/100
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{inc.microZoneName} • {inc.landmark}</span>
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      <strong>{inc.peopleCount}</strong> Persons (<strong className="text-amber-300">{inc.vulnerableCount}</strong> Vuln)
                    </span>

                    <span className={`font-mono font-bold px-2 py-0.2 rounded text-[10px] ${
                      inc.status === 'ASSIGNED' || inc.status === 'EN_ROUTE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : inc.status === 'SUBMITTED'
                        ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Incident Detail & Dispatcher (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedIncident ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              {/* Selected Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400 uppercase">
                      ACTIVE RESCUE DISPATCHER
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {selectedIncident.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedIncident.title}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedIncident.settlementName} • {selectedIncident.microZoneName}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-medium">Deterministic Score</span>
                  <span className="font-mono font-black text-2xl text-white bg-red-600 px-3 py-1 rounded-xl shadow-inner mt-0.5">
                    {selectedIncident.priorityScore} / 100
                  </span>
                </div>
              </div>

              {/* Priority Score Breakdown Matrix */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Deterministic Priority Composition (Why {selectedIncident.priorityScore}/100?)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Severity (Max 30)</span>
                    <strong className="font-mono text-red-400 text-xs">
                      +{selectedIncident.priorityBreakdown?.severityWeight || 30} pts
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">People Count (Max 25)</span>
                    <strong className="font-mono text-cyan-400 text-xs">
                      +{selectedIncident.priorityBreakdown?.peopleWeight || 22} pts
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Vulnerabilities (Max 25)</span>
                    <strong className="font-mono text-amber-400 text-xs">
                      +{selectedIncident.priorityBreakdown?.vulnerabilityWeight || 26} pts
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Zone Hazard (Max 20)</span>
                    <strong className="font-mono text-purple-400 text-xs">
                      +{selectedIncident.priorityBreakdown?.zoneRiskWeight || 20} pts
                    </strong>
                  </div>
                </div>
              </div>

              {/* Description & Reporter Info */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Situation Report:</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{selectedIncident.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
                  <span>Reporter: <strong className="text-white">{selectedIncident.reporterName}</strong> ({selectedIncident.reporterPhone})</span>
                  <span>Landmark: <strong className="text-white">{selectedIncident.landmark}</strong></span>
                </div>
              </div>

              {/* Resource Assignment State */}
              {selectedIncident.assignedResource ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>DISPATCHED ASSET EN ROUTE</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded">
                      ETA ~{selectedIncident.assignedResource.etaMinutes} Mins
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>Unit: <strong className="text-white">{selectedIncident.assignedResource.teamName}</strong></div>
                    <div>Contact: <strong className="text-cyan-300 font-mono">{selectedIncident.assignedResource.contactNumber}</strong></div>
                  </div>

                  {/* Lifecycle status quick buttons */}
                  <div className="pt-2 border-t border-emerald-800/60 flex items-center gap-2">
                    <button
                      onClick={() => updateIncidentStatus(selectedIncident.id, 'ON_SCENE', 'Rescue unit arrived on scene.')}
                      className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                    >
                      Mark On Scene
                    </button>
                    <button
                      onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED', 'All 6 persons evacuated to Site B Haven.')}
                      className="px-3 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs transition-colors"
                    >
                      Mark Rescued / Resolved
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">No Rescue Asset Currently Assigned</h4>
                    <p className="text-[11px] text-slate-400">Citizen is waiting on live GPS telemetry tracker.</p>
                  </div>

                  <button
                    onClick={() => setIsDispatchModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Assign & Dispatch Unit</span>
                  </button>
                </div>
              )}

              {/* Timeline Audit Trail */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {t('timelineStage')}
                </span>
                <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  {selectedIncident.timeline.map((evt: IncidentTimelineEvent, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                      <span className="text-cyan-400 font-mono text-[10px] mt-0.5">[{evt.timestamp}]</span>
                      <div>
                        <strong>{evt.label}</strong> {evt.actor && <span className="text-slate-500">by {evt.actor}</span>}
                        {evt.notes && <p className="text-slate-400 text-[10px] mt-0.5">{evt.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500">
              Select an incident from the queue to view telemetry and dispatch units.
            </div>
          )}
        </div>
      </div>

      {/* Shared Shelter & Road Network Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-slate-800">
        {/* Live Shelter Capacity & Headroom Tracker */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{t('shelterMonitor')}</span>
              </h3>
              <p className="text-[11px] text-slate-400">Shared in real-time with Citizen Shelter Finder</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">{shelters.length} Shelters</span>
          </div>

          <div className="space-y-3">
            {shelters.map((sh: EmergencyShelter) => (
              <div key={sh.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-white">{sh.name}</strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    sh.status === 'FULL' ? 'bg-red-950 text-red-300' : sh.status === 'NEAR_CAPACITY' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {sh.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Occupancy: {sh.currentOccupancy} / {sh.capacity}</span>
                  <span className="text-emerald-400 font-bold">Headroom: +{sh.remainingCapacity}</span>
                </div>

                {/* Quick Simulation Occupancy Slider */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500">Simulate Influx:</span>
                  <input
                    type="range"
                    min="0"
                    max={sh.capacity}
                    step="50"
                    value={sh.currentOccupancy}
                    onChange={(e) => updateShelterOccupancy(sh.id, Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Road Network & Blockage Control */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Route className="w-4 h-4 text-emerald-400" />
                <span>{t('roadNetworkMonitor')}</span>
              </h3>
              <p className="text-[11px] text-slate-400">Toggle road blockages to verify live citizen safe rerouting</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{roads.length} Corridors</span>
          </div>

          <div className="space-y-3">
            {roads.map((rd: RoadSegment) => (
              <div key={rd.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-white">{rd.name}</strong>
                  <button
                    onClick={() => toggleRoadBlockage(rd.id)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold transition-all ${
                      rd.status === 'BLOCKED'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-emerald-600 text-slate-950 font-black'
                    }`}
                  >
                    {rd.status === 'BLOCKED' ? 'BLOCKED ❌' : 'OPEN & SAFE ✅'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {rd.rerouteNotice || rd.blockageReason || 'Normal traffic flow.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Hazard Reports Triage Queue */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Incoming Citizen Ground Hazard Reports ({hazardReports.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400">Direct reports submitted via Citizen Portal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hazardReports.map((rep: HazardReportItem) => (
            <div key={rep.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{rep.id}</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-slate-800">
                    {rep.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rep.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">By {rep.reporterName}</span>
                {rep.status !== 'VERIFIED' && (
                  <button
                    onClick={() => updateHazardReportStatus(rep.id, 'VERIFIED', 'Field team verified water level.')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                  >
                    Verify Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Resource Modal */}
      {isDispatchModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Dispatch Asset to {selectedIncident.id}</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Available Response Asset:</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none focus:border-red-500"
                >
                  {emergencyResources.map((res: EmergencyResource) => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Operational Dispatch Notes (Sent to Citizen Tracker):</label>
                <textarea
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Dispatch (Updates Citizen Live Tracker)</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
