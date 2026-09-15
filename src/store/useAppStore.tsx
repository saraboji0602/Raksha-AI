import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Settlement, 
  SafeSite, 
  AlertItem, 
  UserProfile, 
  HazardType, 
  RiskLevel, 
  PriorityLevel, 
  InterventionType,
  LanguageCode,
  SystemScoringWeights,
  WhatChangedEvent,
  IncidentItem,
  HazardReportItem,
  EmergencyShelter,
  RoadSegment,
  EmergencyResource,
  IncidentStatus,
  EmergencyType,
  VulnerableDemographics,
  RecoveryItem,
  SectorDamageSummary,
  AuditLogEntry,
  DataConflictItem,
  AdministrativeReviewStep,
  FieldTaskItem,
  RecoveryStatus,
  DamageCategory
} from '../types';
import { MockDataService, CURRENT_USER } from '../services/mockDataService';
import { HAZARD_LAYERS_CONFIG, HazardLayerConfig } from '../data/hazardsData';
import { DEFAULT_SCORING_WEIGHTS, RiskEngineService } from '../services/riskEngineService';
import { TRANSLATIONS } from '../data/translations';
import { 
  INITIAL_SHELTERS, 
  INITIAL_ROADS, 
  INITIAL_EMERGENCY_RESOURCES, 
  INITIAL_INCIDENTS, 
  INITIAL_HAZARD_REPORTS 
} from '../data/emergencyData';
import { 
  INITIAL_RECOVERY_ITEMS, 
  SECTOR_DAMAGE_SUMMARIES 
} from '../data/recoveryData';
import { 
  INITIAL_DATA_CONFLICTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ADMIN_REVIEW_STEPS, 
  INITIAL_FIELD_TASKS 
} from '../data/auditData';
import { AIResponseMetadata, AIAssistantService } from '../services/aiAssistantService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metadata?: AIResponseMetadata;
}

export type ViewMode = 'OFFICER' | 'CITIZEN';

export interface AppState {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // View Mode (Officer vs Citizen)
  activeViewMode: ViewMode;
  setActiveViewMode: (mode: ViewMode) => void;
  
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  
  // Data
  settlements: Settlement[];
  selectedSettlementId: string;
  setSelectedSettlementId: (id: string) => void;
  getSelectedSettlement: () => Settlement;
  
  safeSites: SafeSite[];
  selectedSafeSiteId: string;
  setSelectedSafeSiteId: (id: string) => void;
  getSelectedSafeSite: () => SafeSite;
  
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  
  // Dynamic Simulation State
  kadalpuramSimulationMode: 'BASELINE' | 'RISING_RIVER_SURGE';
  toggleRisingRiverSimulation: () => void;
  whatChangedEvents: WhatChangedEvent[];
  
  // Shared Emergency Runtime State (Phase 2)
  incidents: IncidentItem[];
  hazardReports: HazardReportItem[];
  shelters: EmergencyShelter[];
  roads: RoadSegment[];
  emergencyResources: EmergencyResource[];
  activeCitizenSosId: string | null;
  setActiveCitizenSosId: (id: string | null) => void;
  
  // Emergency Actions
  triggerCitizenSOS: (data: {
    type: EmergencyType;
    peopleCount: number;
    vulnerableDetails: VulnerableDemographics;
    microZoneId: string;
    landmark: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
  }) => string;
  
  assignResourceToIncident: (incidentId: string, resourceId: string, notes?: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, notes?: string) => void;
  submitCitizenHazardReport: (reportData: {
    reportType: any;
    title: string;
    description: string;
    settlementId: string;
    microZoneId: string;
    severity: any;
    reporterName: string;
    reporterPhone: string;
  }) => void;
  updateHazardReportStatus: (reportId: string, status: any, notes?: string) => void;
  updateShelterOccupancy: (shelterId: string, newOccupancy: number) => void;
  toggleRoadBlockage: (roadId: string) => void;
  
  // Human in the Loop Override
  overrideSettlementDecision: (settlementId: string, intervention: InterventionType, reason: string) => void;
  approveSettlementDecision: (settlementId: string, notes?: string) => void;
  
  // Map and Layers
  hazardLayers: HazardLayerConfig[];
  toggleHazardLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  
  // Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterHazard: HazardType | 'ALL';
  setFilterHazard: (h: HazardType | 'ALL') => void;
  filterRiskLevel: RiskLevel | 'ALL';
  setFilterRiskLevel: (r: RiskLevel | 'ALL') => void;
  filterPriority: PriorityLevel | 'ALL';
  setFilterPriority: (p: PriorityLevel | 'ALL') => void;
  filterDistrict: string | 'ALL';
  setFilterDistrict: (d: string | 'ALL') => void;
  resetFilters: () => void;
  
  // System Configurations & Modes
  emergencyMode: boolean;
  setEmergencyMode: (enabled: boolean) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  
  scoringWeights: SystemScoringWeights;
  setScoringWeights: (weights: SystemScoringWeights) => void;
  
  // Modals and Drawers
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendUserChatMessage: (msg: string) => void;
  
  isDecisionTraceOpen: boolean;
  setIsDecisionTraceOpen: (open: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Demo Tour
  tourStep: number;
  isTourActive: boolean;
  startDemoTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  
  // Dynamic Simulation actions
  triggerSimulatedDataUpdate: () => void;
  submitFieldVerificationEvidence: (settlementId: string, notes: string) => void;
  
  // Phase 3: Recovery, Audit & Field Conflicts
  recoveryItems: RecoveryItem[];
  sectorDamageSummaries: SectorDamageSummary[];
  dataConflicts: DataConflictItem[];
  auditLogs: AuditLogEntry[];
  adminReviewSteps: AdministrativeReviewStep[];
  fieldTasks: FieldTaskItem[];
  selectedConflictId: string | null;
  setSelectedConflictId: (id: string | null) => void;
  isConflictModalOpen: boolean;
  setIsConflictModalOpen: (open: boolean) => void;
  
  // Phase 3 Actions
  resolveDataConflict: (conflictId: string, choice: 'ACCEPT_FIELD' | 'ACCEPT_AI' | 'MODIFY', rationale: string) => void;
  triggerRoadADataConflict: () => void;
  updateRecoveryStatus: (itemId: string, status: RecoveryStatus, progressPercentage: number, notes?: string) => void;
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  toggleAdminReviewStep: (stepId: string, notes?: string) => void;
  submitCitizenDamageClaim: (claim: {
    category: DamageCategory;
    title: string;
    description: string;
    estimatedLossLakhs: number;
    settlementId: string;
    affectedPersons: number;
    reporterName: string;
    reporterPhone: string;
  }) => void;
  updateFieldTaskStatus: (taskId: string, status: any, fieldNotes?: string) => void;
  
  // Phase 4: Decision Brief & Demo Reset
  isDecisionBriefOpen: boolean;
  setIsDecisionBriefOpen: (open: boolean) => void;
  resetToDemoBaseline: () => void;
}

const AppContext = createContext<AppState | null>(null);

const INITIAL_WHAT_CHANGED_EVENTS: WhatChangedEvent[] = [
  {
    id: 'wc-01',
    timestamp: '10 mins ago',
    title: 'Estuarine Water Level Ingress',
    parameter: 'Tidal Fluvial Level',
    beforeValue: '+0.8m MSL',
    afterValue: '+2.4m MSL',
    delta: '+1.6m surge',
    severity: 'CRITICAL',
    category: 'HAZARD',
    rationale: 'Combined astronomical high tide and monsoonal river swelling recorded at Northern Gauge N-04.'
  },
  {
    id: 'wc-02',
    timestamp: '12 mins ago',
    title: 'Kadalpuram Composite Risk Jump',
    parameter: 'Overall Multi-Hazard Risk',
    beforeValue: '72 / 100',
    afterValue: '91 / 100',
    delta: '+19 pts',
    severity: 'CRITICAL',
    category: 'RISK_SCORE',
    rationale: 'Compound synergy: Active coastal scarp retreat amplified by Category 4 cyclonic envelope.'
  },
  {
    id: 'wc-03',
    timestamp: '15 mins ago',
    title: 'Exposed Population Expansion',
    parameter: 'Inundation Envelope Population',
    beforeValue: '3,120 residents',
    afterValue: '4,210 residents',
    delta: '+1,090 persons',
    severity: 'WARNING',
    category: 'EXPOSURE',
    rationale: 'Frontline Zone A wave runup penetrated 120m further inland than dry season envelope.'
  },
  {
    id: 'wc-04',
    timestamp: '25 mins ago',
    title: 'Evacuation Route Bottleneck Alert',
    parameter: 'Bridge B-07 Status',
    beforeValue: 'Passable (All-Weather)',
    afterValue: 'Submergence Warning (+0.4m)',
    delta: 'Critical Bottleneck',
    severity: 'CRITICAL',
    category: 'INFRASTRUCTURE',
    rationale: 'Causeway elevation submerged during high wave surge; rerouting recommended via SH-49.'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('OFFICER');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  
  const [settlements, setSettlements] = useState<Settlement[]>(MockDataService.getSettlements());
  const [selectedSettlementId, setSelectedSettlementId] = useState<string>('kadalpuram');
  
  const [safeSites, setSafeSites] = useState<SafeSite[]>(MockDataService.getSafeSites());
  const [selectedSafeSiteId, setSelectedSafeSiteId] = useState<string>('site-b');
  
  const [alerts, setAlerts] = useState<AlertItem[]>(MockDataService.getAlerts());
  const [hazardLayers, setHazardLayers] = useState<HazardLayerConfig[]>(HAZARD_LAYERS_CONFIG);
  
  // Phase 1 Dynamic Simulation State
  const [kadalpuramSimulationMode, setKadalpuramSimulationMode] = useState<'BASELINE' | 'RISING_RIVER_SURGE'>('RISING_RIVER_SURGE');
  const [whatChangedEvents, setWhatChangedEvents] = useState<WhatChangedEvent[]>(INITIAL_WHAT_CHANGED_EVENTS);
  
  // Phase 2 Shared Emergency State
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [hazardReports, setHazardReports] = useState<HazardReportItem[]>(INITIAL_HAZARD_REPORTS);
  const [shelters, setShelters] = useState<EmergencyShelter[]>(INITIAL_SHELTERS);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS);
  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>(INITIAL_EMERGENCY_RESOURCES);
  const [activeCitizenSosId, setActiveCitizenSosId] = useState<string | null>('sos-kad-01');
  
  // Phase 3 Shared Recovery, Audit & Conflict State
  const [recoveryItems, setRecoveryItems] = useState<RecoveryItem[]>(INITIAL_RECOVERY_ITEMS);
  const [sectorDamageSummaries, setSectorDamageSummaries] = useState<SectorDamageSummary[]>(SECTOR_DAMAGE_SUMMARIES);
  const [dataConflicts, setDataConflicts] = useState<DataConflictItem[]>(INITIAL_DATA_CONFLICTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [adminReviewSteps, setAdminReviewSteps] = useState<AdministrativeReviewStep[]>(INITIAL_ADMIN_REVIEW_STEPS);
  const [fieldTasks, setFieldTasks] = useState<FieldTaskItem[]>(INITIAL_FIELD_TASKS);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>('conf-01');
  const [isConflictModalOpen, setIsConflictModalOpen] = useState<boolean>(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterHazard, setFilterHazard] = useState<HazardType | 'ALL'>('ALL');
  const [filterRiskLevel, setFilterRiskLevel] = useState<RiskLevel | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string | 'ALL'>('ALL');
  
  // System states
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [scoringWeights, setScoringWeights] = useState<SystemScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  
  // Modals & Chat
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isDecisionTraceOpen, setIsDecisionTraceOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: 'Namaste. I am RAKSHA Assistant. I provide explainable risk decompositions, justify relocation allocations, evaluate carrying capacities, and verify candidate safe havens. How may I assist your disaster management decision today?',
      timestamp: 'Just now'
    }
  ]);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Guided Demo Tour
  const [tourStep, setTourStep] = useState<number>(0);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getSelectedSettlement = (): Settlement => {
    return settlements.find(s => s.id === selectedSettlementId) || settlements[0];
  };

  const getSelectedSafeSite = (): SafeSite => {
    return safeSites.find(s => s.id === selectedSafeSiteId) || safeSites[0];
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    MockDataService.markAlertAsRead(id);
  };

  const toggleHazardLayer = (layerId: string) => {
    setHazardLayers(prev => prev.map(l => l.id === layerId ? { ...l, enabled: !l.enabled } : l));
  };

  const setLayerOpacity = (layerId: string, opacity: number) => {
    setHazardLayers(prev => prev.map(l => l.id === layerId ? { ...l, defaultOpacity: opacity } : l));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterHazard('ALL');
    setFilterRiskLevel('ALL');
    setFilterPriority('ALL');
    setFilterDistrict('ALL');
    addToast({
      type: 'info',
      title: 'Filters Reset',
      description: 'Showing all vulnerable habitations across district.'
    });
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  // Phase 2: Citizen Trigger SOS Action (Creates central incident with deterministic priority)
  const triggerCitizenSOS = (data: {
    type: EmergencyType;
    peopleCount: number;
    vulnerableDetails: VulnerableDemographics;
    microZoneId: string;
    landmark: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
  }): string => {
    const newId = 'sos-cit-' + Date.now().toString().slice(-4);
    const activeSettlement = getSelectedSettlement();
    const zone = activeSettlement.microZones.find(z => z.id === data.microZoneId) || activeSettlement.microZones[0];

    const vulnTotal = (data.vulnerableDetails.elderlyCount || 0) + 
                      (data.vulnerableDetails.infantsChildrenCount || 0) + 
                      (data.vulnerableDetails.disabledCount || 0) + 
                      (data.vulnerableDetails.medicalNeedCount || 0) + 
                      (data.vulnerableDetails.pregnantCount || 0);

    // Deterministic Priority Calculation (Formula: Sev + People + Vuln + ZoneRisk)
    const severityWeight = data.type === 'FLOOD_TRAPPED' || data.type === 'MEDICAL_EMERGENCY' ? 30 : 25;
    const peopleWeight = Math.min(25, data.peopleCount * 4);
    const vulnerabilityWeight = Math.min(25, (data.vulnerableDetails.elderlyCount * 6) + (data.vulnerableDetails.infantsChildrenCount * 5) + (data.vulnerableDetails.disabledCount * 7) + (data.vulnerableDetails.medicalNeedCount * 7));
    const zoneRiskWeight = zone ? Math.round((zone.riskScore / 100) * 20) : 18;
    const calculatedPriority = Math.min(100, Math.max(72, severityWeight + peopleWeight + vulnerabilityWeight + zoneRiskWeight));

    const newIncident: IncidentItem = {
      id: newId,
      title: `CITIZEN SOS: ${data.type.replace(/_/g, ' ')} (${data.peopleCount} People in ${zone?.name || 'Frontline'})`,
      type: data.type,
      severity: calculatedPriority >= 90 ? 'CRITICAL' : 'HIGH',
      status: 'SUBMITTED',
      source: 'CITIZEN_SOS',
      settlementId: activeSettlement.id,
      settlementName: activeSettlement.name,
      microZoneId: zone?.id || 'kz-1',
      microZoneName: zone?.name || 'Zone A (Coastal Hamlet)',
      landmark: data.landmark || 'Frontline coastal sector',
      latitude: activeSettlement.latitude + 0.002,
      longitude: activeSettlement.longitude + 0.003,
      peopleCount: data.peopleCount,
      vulnerableCount: vulnTotal,
      vulnerableDetails: data.vulnerableDetails,
      description: data.description || 'Citizen emergency distress beacon initiated.',
      priorityScore: calculatedPriority,
      priorityBreakdown: {
        severityWeight,
        peopleWeight,
        vulnerabilityWeight,
        zoneRiskWeight
      },
      timestamp: 'Just now',
      reporterName: data.reporterName || 'Citizen User',
      reporterPhone: data.reporterPhone || '+91 98401 XXXXX',
      confidence: 96,
      timeline: [
        {
          stage: 'SUBMITTED',
          label: 'SOS Alert Transmitted by Citizen App',
          timestamp: 'Just now',
          notes: 'High-accuracy GPS telemetry packet registered at DDMA Emergency Desk.'
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    setActiveCitizenSosId(newId);

    // Create system alert for Officer
    const newAlert: AlertItem = {
      id: 'alt-sos-' + Date.now(),
      title: `EMERGENCY SOS RECEIVED: ${activeSettlement.name}`,
      message: `${data.peopleCount} citizens (${vulnTotal} vulnerable) trapped in ${zone?.name}. Priority score: ${calculatedPriority}/100.`,
      severity: 'CRITICAL',
      category: 'RISK_ESCALATION',
      timestamp: 'Just now',
      settlementId: activeSettlement.id,
      settlementName: activeSettlement.name,
      read: false,
      actionUrl: '/emergency-center',
      actionLabel: 'Open Officer Emergency Center'
    };
    setAlerts(prev => [newAlert, ...prev]);

    addToast({
      type: 'warning',
      title: '🚨 Emergency SOS Broadcast Transmitted',
      description: `Disaster Command Desk alerted. Assigned Priority: ${calculatedPriority}/100.`
    });

    return newId;
  };

  // Phase 2: Officer Assign Resource Action
  const assignResourceToIncident = (incidentId: string, resourceId: string, notes?: string) => {
    const targetResource = emergencyResources.find(r => r.id === resourceId) || emergencyResources[0];

    setEmergencyResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        return { ...r, status: 'DISPATCHED', assignedIncidentId: incidentId };
      }
      return r;
    }));

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const assignedRes = {
          teamId: targetResource.id,
          teamName: targetResource.name,
          resourceType: targetResource.type,
          dispatchedAt: 'Just now',
          etaMinutes: 12,
          contactNumber: targetResource.driverContact
        };

        const newTimelineEvent = {
          stage: 'ASSIGNED' as IncidentStatus,
          label: `Dispatched ${targetResource.name}`,
          timestamp: 'Just now',
          notes: notes || 'Unit en route via Inland Elevated Bypass Route B. Direct VHF channel open.',
          actor: 'District Disaster Operations Officer'
        };

        return {
          ...inc,
          status: 'ASSIGNED',
          assignedResource: assignedRes,
          timeline: [...inc.timeline, newTimelineEvent]
        };
      }
      return inc;
    }));

    addToast({
      type: 'success',
      title: 'Rescue Resource Dispatched',
      description: `${targetResource.name} assigned. Citizen live status updated to EN ROUTE.`
    });
  };

  // Phase 2: Update Incident Status Lifecycle
  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const event = {
          stage: status,
          label: `Status transitioned to ${status.replace(/_/g, ' ')}`,
          timestamp: 'Just now',
          notes: notes || 'Operational milestone updated by DDMA Command Officer.'
        };
        return {
          ...inc,
          status,
          timeline: [...inc.timeline, event]
        };
      }
      return inc;
    }));

    addToast({
      type: 'info',
      title: 'Incident Status Updated',
      description: `Incident marked as ${status.replace(/_/g, ' ')}.`
    });
  };

  // Phase 2: Citizen Submit Hazard Report
  const submitCitizenHazardReport = (reportData: {
    reportType: any;
    title: string;
    description: string;
    settlementId: string;
    microZoneId: string;
    severity: any;
    reporterName: string;
    reporterPhone: string;
  }) => {
    const activeSettlement = getSelectedSettlement();
    const zone = activeSettlement.microZones.find(z => z.id === reportData.microZoneId) || activeSettlement.microZones[0];

    const newReport: HazardReportItem = {
      id: 'rep-' + Date.now().toString().slice(-4),
      reportType: reportData.reportType,
      title: reportData.title,
      description: reportData.description,
      settlementId: reportData.settlementId || activeSettlement.id,
      settlementName: activeSettlement.name,
      microZoneId: zone?.id || 'kz-1',
      microZoneName: zone?.name || 'Zone A',
      severity: reportData.severity || 'HIGH',
      status: 'SUBMITTED',
      timestamp: 'Just now',
      reporterName: reportData.reporterName || 'Citizen Reporter',
      reporterPhone: reportData.reporterPhone || '+91 94444 XXXXX',
      confidenceScore: 90
    };

    setHazardReports(prev => [newReport, ...prev]);

    addToast({
      type: 'success',
      title: 'Hazard Report Submitted',
      description: 'Your ground report is received by the DDMA control desk for verification.'
    });
  };

  // Phase 2: Officer Verify / Update Hazard Report Status
  const updateHazardReportStatus = (reportId: string, status: any, notes?: string) => {
    setHazardReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          verifiedByOfficer: status === 'VERIFIED' || status === 'RESOLVED',
          officerVerificationNotes: notes || 'Verified by District Emergency Operations Center.'
        };
      }
      return r;
    }));

    addToast({
      type: 'info',
      title: 'Hazard Report Triage Updated',
      description: `Report marked as ${status}.`
    });
  };

  // Phase 2: Update Shelter Occupancy
  const updateShelterOccupancy = (shelterId: string, newOccupancy: number) => {
    setShelters(prev => prev.map(s => {
      if (s.id === shelterId) {
        const remaining = Math.max(0, s.capacity - newOccupancy);
        let status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL' = 'OPEN';
        if (remaining === 0) status = 'FULL';
        else if (remaining < s.capacity * 0.15) status = 'NEAR_CAPACITY';

        return {
          ...s,
          currentOccupancy: newOccupancy,
          remainingCapacity: remaining,
          status
        };
      }
      return s;
    }));
  };

  // Phase 2: Toggle Road Blockage & Dynamic Rerouting
  const toggleRoadBlockage = (roadId: string) => {
    setRoads(prev => prev.map(r => {
      if (r.id === roadId) {
        const nextStatus = r.status === 'BLOCKED' ? 'OPEN' : 'BLOCKED';
        const waterDepth = nextStatus === 'BLOCKED' ? 1.4 : 0.0;
        return {
          ...r,
          status: nextStatus,
          waterDepthMeters: waterDepth,
          rerouteNotice: nextStatus === 'BLOCKED' 
            ? 'Route updated: Coastal Causeway is submerged by 1.4m tidal surge. Evacuate via Inland Route B.'
            : 'CLEAR & OPEN: Traffic operating normally on all lanes.',
          lastUpdated: 'Just now'
        };
      }
      return r;
    }));

    addToast({
      type: 'warning',
      title: 'Evacuation Route Status Toggled',
      description: 'Shared road network state updated. Citizen safe routing recalculated.'
    });
  };

  // Dynamic Rising River / Storm Surge Simulator Action
  const toggleRisingRiverSimulation = () => {
    if (kadalpuramSimulationMode === 'BASELINE') {
      setKadalpuramSimulationMode('RISING_RIVER_SURGE');
      setSettlements(prev => prev.map(s => {
        if (s.id === 'kadalpuram') {
          return {
            ...s,
            overallRisk: 91,
            exposedPopulation: 4210,
            exposedPercentage: 87,
            priority: 'IMMEDIATE',
            emergencyUrgency: 'IMMEDIATE',
            priorityScore: 94,
            aiRecommendation: 'PARTIAL_RELOCATION',
            lastUpdated: 'Just now (Simulated High Tide & River Rise)',
            microZones: s.microZones.map(z => {
              if (z.id === 'kz-1') {
                return { ...z, riskScore: 96, riskLevel: 'CRITICAL', recommendation: 'PARTIAL_RELOCATION' };
              }
              if (z.id === 'kz-2') {
                return { ...z, riskScore: 78, riskLevel: 'HIGH', recommendation: 'ADAPT' };
              }
              return { ...z, riskScore: 58, riskLevel: 'MODERATE', recommendation: 'PROTECT' };
            }),
            hazards: s.hazards.map(h => {
              if (h.type === 'coastal_erosion') return { ...h, score: 96, trend: 'INCREASING' };
              if (h.type === 'cyclone') return { ...h, score: 88, trend: 'INCREASING' };
              if (h.type === 'flood') return { ...h, score: 82, trend: 'INCREASING' };
              return h;
            })
          };
        }
        return s;
      }));

      const newEvent: WhatChangedEvent = {
        id: 'wc-sim-' + Date.now(),
        timestamp: 'Just now',
        title: 'Rising River & Tidal Surge Inundation Simulated',
        parameter: 'Kadalpuram Composite Threat',
        beforeValue: '72 (Baseline)',
        afterValue: '91 (Critical Red-Zone)',
        delta: '+19 pts surge',
        severity: 'CRITICAL',
        category: 'HAZARD',
        rationale: 'Estuarine river swelling coupled with coastal scarp erosion expands critical red zone across Zone A.'
      };

      setWhatChangedEvents(prev => [newEvent, ...prev.slice(0, 5)]);

      addToast({
        type: 'warning',
        title: 'Dynamic Red-Zone Surge Active: Kadalpuram Risk 91/100',
        description: 'River level +2.4m surge rise engaged. Frontline Zone A marked for Immediate Partial Relocation.'
      });
    } else {
      setKadalpuramSimulationMode('BASELINE');
      setSettlements(prev => prev.map(s => {
        if (s.id === 'kadalpuram') {
          return {
            ...s,
            overallRisk: 72,
            exposedPopulation: 3120,
            exposedPercentage: 64,
            priority: 'SHORT_TERM',
            emergencyUrgency: 'SHORT_TERM',
            priorityScore: 74,
            aiRecommendation: 'PARTIAL_RELOCATION',
            lastUpdated: 'Just now (Baseline Monsoonal State)',
            microZones: s.microZones.map(z => {
              if (z.id === 'kz-1') {
                return { ...z, riskScore: 82, riskLevel: 'HIGH', recommendation: 'PARTIAL_RELOCATION' };
              }
              if (z.id === 'kz-2') {
                return { ...z, riskScore: 64, riskLevel: 'HIGH', recommendation: 'ADAPT' };
              }
              return { ...z, riskScore: 48, riskLevel: 'MODERATE', recommendation: 'PROTECT' };
            }),
            hazards: s.hazards.map(h => {
              if (h.type === 'coastal_erosion') return { ...h, score: 82, trend: 'STABLE' };
              if (h.type === 'cyclone') return { ...h, score: 72, trend: 'STABLE' };
              if (h.type === 'flood') return { ...h, score: 65, trend: 'STABLE' };
              return h;
            })
          };
        }
        return s;
      }));

      const newEvent: WhatChangedEvent = {
        id: 'wc-base-' + Date.now(),
        timestamp: 'Just now',
        title: 'Restored Normal Monsoon Baseline',
        parameter: 'Kadalpuram Threat Level',
        beforeValue: '91 (Surge)',
        afterValue: '72 (Baseline)',
        delta: '-19 pts',
        severity: 'INFO',
        category: 'HAZARD',
        rationale: 'Estuarine river levels normalized. Standard operational monitoring restored.'
      };

      setWhatChangedEvents(prev => [newEvent, ...prev.slice(0, 5)]);

      addToast({
        type: 'info',
        title: 'Baseline State Restored: Kadalpuram Risk 72/100',
        description: 'Standard baseline monsoonal telemetry restored.'
      });
    }
  };

  // Human-in-the-Loop Override Action
  const overrideSettlementDecision = (settlementId: string, intervention: InterventionType, reason: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          humanReviewStatus: 'OFFICER_OVERRIDDEN',
          officerDecisionOverride: intervention,
          officerOverrideReason: reason,
          officerOverrideTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'Human Officer Authority Override Recorded',
      description: `Recommendation updated to ${intervention.replace('_', ' ')}. Audit timestamp logged.`
    });
  };

  const approveSettlementDecision = (settlementId: string, notes: string = 'Approved by DDMA District Collector.') => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          humanReviewStatus: 'OFFICER_APPROVED',
          officerOverrideReason: notes,
          officerOverrideTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'AI Recommendation Formally Sanctioned',
      description: `Officer approval logged in official DDMA decision ledger.`
    });
  };

  // Demo interactive simulator
  const triggerSimulatedDataUpdate = () => {
    setSettlements(prev => prev.map(s => {
      if (s.id === 'kadalpuram') {
        return {
          ...s,
          dataConfidence: 96,
          lastUpdated: 'Just now (Simulated live InSAR sync)'
        };
      }
      return s;
    }));
    
    addToast({
      type: 'warning',
      title: 'Satellite SAR Sensor Sync Received',
      description: 'Shoreline retreat updated for Kadalpuram. Confidence boosted to 96%.'
    });
  };

  const submitFieldVerificationEvidence = (settlementId: string, notes: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          dataConfidence: 94,
          fieldVerified: true,
          fieldVerificationNotes: notes,
          status: 'FIELD_VERIFIED'
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'Human-in-the-Loop Evidence Verified',
      description: `Field officer evidence submitted. Data confidence increased from 72% to 94%.`
    });
  };

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: 'aud-' + Math.random().toString(36).substring(2, 9),
      timestamp: 'Just now'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const resolveDataConflict = (conflictId: string, choice: 'ACCEPT_FIELD' | 'ACCEPT_AI' | 'MODIFY', rationale: string) => {
    const targetConflict = dataConflicts.find(c => c.id === conflictId);
    if (!targetConflict) return;

    const resolvedStatus = choice === 'ACCEPT_FIELD' 
      ? 'RESOLVED_ACCEPTED_FIELD' 
      : choice === 'ACCEPT_AI' 
        ? 'RESOLVED_ACCEPTED_AI' 
        : 'RESOLVED_MODIFIED';

    setDataConflicts(prev => prev.map(c => {
      if (c.id === conflictId) {
        return {
          ...c,
          status: resolvedStatus,
          resolutionChoice: choice,
          officerDecisionReason: rationale,
          resolvedBy: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            designation: currentUser.designation,
            badgeNumber: 'TN-IAS-2016-08'
          },
          resolvedAt: 'Just now'
        };
      }
      return c;
    }));

    setFieldTasks(prev => prev.map(task => {
      if (task.conflictId === conflictId) {
        return {
          ...task,
          status: 'VERIFIED',
          hasConflict: false
        };
      }
      return task;
    }));

    if (choice === 'ACCEPT_FIELD') {
      setRoads(prev => prev.map(r => {
        if (r.id === 'road-causeway-a' || r.name.includes('Causeway')) {
          return {
            ...r,
            isBlocked: true,
            currentDepthMeters: 1.4,
            capacityStatus: 'IMPASSABLE',
            fieldVerified: true,
            blockageReason: 'Field Officer Ground Truth (+1.4m tidal surge inundation). Route A blocked; traffic diverted via SH-49 High Bypass.'
          };
        }
        return r;
      }));

      setSettlements(prev => prev.map(s => {
        if (s.id === targetConflict.settlementId) {
          return {
            ...s,
            dataConfidence: 94,
            fieldVerified: true,
            fieldVerificationNotes: 'Field truth validated: Causeway submerged +1.4m. Partial relocation to Site B prioritised.'
          };
        }
        return s;
      }));

      addAuditLogEntry({
        actor: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          designation: currentUser.designation,
          badgeNumber: 'TN-IAS-2016-08'
        },
        actionType: 'HUMAN_DECISION_OVERRIDE',
        title: `Data Conflict Resolved: Accepted Ground Evidence for ${targetConflict.parameterName}`,
        targetEntityId: targetConflict.id,
        targetEntityType: 'ROAD',
        targetEntityName: targetConflict.locationName,
        previousValue: `AI Sensor Telemetry: ${targetConflict.aiValue} (${targetConflict.aiConfidence}%)`,
        newValue: `Field Officer Ground Truth: ${targetConflict.fieldValue} (${targetConflict.fieldConfidence}%)`,
        officialReason: rationale || 'Field physical measurement accepted over satellite radar model. Evacuation traffic diverted to Safe Route B.',
        statutoryBasis: 'Section 34(a) Disaster Management Act 2005 (Evacuation & Movement Control)',
        confidenceBefore: targetConflict.aiConfidence,
        confidenceAfter: targetConflict.fieldConfidence,
        evidenceReference: `Conflict Record #${targetConflict.id}`
      });

      addToast({
        type: 'success',
        title: 'Data Conflict Resolved & Synced',
        description: 'Field officer evidence accepted. Coastal Causeway Road A marked BLOCKED. Safe route rerouted to Route B.'
      });
    } else {
      addAuditLogEntry({
        actor: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          designation: currentUser.designation,
          badgeNumber: 'TN-IAS-2016-08'
        },
        actionType: 'HUMAN_DECISION_OVERRIDE',
        title: `Data Conflict Resolved: Retained AI Model for ${targetConflict.parameterName}`,
        targetEntityId: targetConflict.id,
        targetEntityType: 'ROAD',
        targetEntityName: targetConflict.locationName,
        previousValue: targetConflict.aiValue,
        newValue: targetConflict.aiValue + ' (Human Confirmed)',
        officialReason: rationale || 'Retained satellite radar model based on recent drone telemetry.',
        statutoryBasis: 'Section 30(2) Disaster Management Act 2005'
      });

      addToast({
        type: 'info',
        title: 'AI Model Retained',
        description: 'Decision logged in immutable audit trail.'
      });
    }
  };

  const triggerRoadADataConflict = () => {
    setDataConflicts(prev => prev.map(c => {
      if (c.id === 'conf-01') {
        return {
          ...c,
          status: 'CONFLICT_DETECTED'
        };
      }
      return c;
    }));
    setFieldTasks(prev => prev.map(t => {
      if (t.id === 'task-01') {
        return {
          ...t,
          status: 'CONFLICT_DETECTED',
          hasConflict: true
        };
      }
      return t;
    }));
    addToast({
      type: 'warning',
      title: 'Ground Discrepancy Flagged',
      description: 'Physical inspection (1.4m depth) contradicts AI telemetry (Road Open). Sent to Officer Command Center for decision.'
    });
  };

  const updateRecoveryStatus = (itemId: string, status: RecoveryStatus, progressPercentage: number, notes?: string) => {
    const item = recoveryItems.find(r => r.id === itemId);
    if (!item) return;

    setRecoveryItems(prev => prev.map(r => {
      if (r.id === itemId) {
        return {
          ...r,
          status,
          progressPercentage,
          lastUpdated: 'Just now'
        };
      }
      return r;
    }));

    addAuditLogEntry({
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        designation: currentUser.designation,
        badgeNumber: 'TN-IAS-2016-08'
      },
      actionType: 'RECOVERY_SANCTIONED',
      title: `Recovery Milestone Updated: ${item.infrastructureName}`,
      targetEntityId: item.id,
      targetEntityType: 'RECOVERY_PROJECT',
      targetEntityName: item.infrastructureName,
      previousValue: `Status: ${item.status}, Progress: ${item.progressPercentage}%`,
      newValue: `Status: ${status}, Progress: ${progressPercentage}%`,
      officialReason: notes || `Reconstruction milestone verified. Progress updated to ${progressPercentage}%.`,
      statutoryBasis: 'SDRF Reconstruction Guidelines / SDMA Sanction'
    });

    addToast({
      type: 'success',
      title: 'Recovery Milestone Recorded',
      description: `${item.infrastructureName} updated to ${status} (${progressPercentage}% complete).`
    });
  };

  const toggleAdminReviewStep = (stepId: string, notes?: string) => {
    setAdminReviewSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const nextStatus = step.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        return {
          ...step,
          status: nextStatus,
          officerName: currentUser.name,
          officerDesignation: currentUser.designation,
          timestamp: 'Just now',
          notes: notes || step.notes
        };
      }
      return step;
    }));

    addToast({
      type: 'success',
      title: 'Administrative Sign-Off Updated',
      description: 'Review step marked complete and appended to statutory audit trail.'
    });
  };

  const submitCitizenDamageClaim = (claim: {
    category: DamageCategory;
    title: string;
    description: string;
    estimatedLossLakhs: number;
    settlementId: string;
    affectedPersons: number;
    reporterName: string;
    reporterPhone: string;
  }) => {
    const severityFactor = claim.category === 'ROADS_BRIDGES' ? 90 : claim.category === 'HOUSING' ? 85 : 75;
    const popFactor = Math.min(100, claim.affectedPersons * 10);
    const calculatedPriority = Math.round((severityFactor * 0.35) + (popFactor * 0.40) + (80 * 0.25));

    const newItem: RecoveryItem = {
      id: 'rec-cit-' + Math.random().toString(36).substring(2, 7),
      settlementId: claim.settlementId,
      settlementName: settlements.find(s => s.id === claim.settlementId)?.name || 'Kadalpuram',
      microZoneId: 'kz-1',
      microZoneName: 'Zone A (Frontline)',
      damageCategory: claim.category,
      infrastructureName: claim.title,
      damageDescription: claim.description,
      severity: 'CRITICAL',
      populationImpact: claim.affectedPersons,
      vulnerablePopulationImpact: Math.ceil(claim.affectedPersons * 0.35),
      priorityScore: calculatedPriority,
      priorityBreakdown: {
        severityWeight: 28,
        populationImpactWeight: 24,
        vulnerablePopulationWeight: 22,
        infrastructureImportanceWeight: 16
      },
      status: 'ASSESSED',
      assignedTeam: 'District Reconstruction Cell & PWD',
      estimatedCostCr: Number((claim.estimatedLossLakhs / 100).toFixed(2)),
      spentCostCr: 0,
      progressPercentage: 0,
      repairTimelineWeeks: 12,
      reportedBy: claim.reporterName,
      reportedTimestamp: 'Just now',
      completionTargetDate: '2026-12-31'
    };

    setRecoveryItems(prev => [newItem, ...prev]);

    addAuditLogEntry({
      actor: {
        id: 'usr-cit-portal',
        name: claim.reporterName || 'Citizen Claimant',
        role: 'CITIZEN',
        designation: 'Affected Resident',
        badgeNumber: 'CIT-' + claim.reporterPhone.slice(-4)
      },
      actionType: 'AI_RECOMMENDATION',
      title: `Citizen Post-Disaster Damage Claim Intake: ${claim.title}`,
      targetEntityId: newItem.id,
      targetEntityType: 'RECOVERY_PROJECT',
      targetEntityName: claim.title,
      previousValue: 'Unreported',
      newValue: `Damage Claim Logged: ₹${claim.estimatedLossLakhs} Lakhs`,
      officialReason: `Citizen verified claim for ${claim.affectedPersons} individuals in ${claim.settlementId}. Intake queued for DDMA field inspection.`
    });

    addToast({
      type: 'success',
      title: 'Damage Claim Registered in Recovery Center',
      description: `Assessment ticket created with Priority Score ${calculatedPriority}. Sent to DDMA Reconstruction Cell.`
    });
  };

  const updateFieldTaskStatus = (taskId: string, status: any, fieldNotes?: string) => {
    setFieldTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          officerNotes: fieldNotes || t.officerNotes,
          timestamp: 'Just now'
        };
      }
      return t;
    }));

    addToast({
      type: 'info',
      title: 'Field Task Updated',
      description: `Task ${taskId} status updated to ${status}.`
    });
  };

  const [isDecisionBriefOpen, setIsDecisionBriefOpen] = useState<boolean>(false);

  const sendUserChatMessage = (queryText: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: 'Just now'
    };

    const currentSelected = settlements.find(s => s.id === selectedSettlementId) || settlements[0];
    const aiResult = AIAssistantService.processUserQuery(queryText, {
      activeViewMode,
      selectedSettlement: currentSelected,
      settlements,
      safeSites,
      incidents,
      roads,
      shelters,
      recoveryItems,
      fieldTasks,
      dataConflicts,
      simulationMode: kadalpuramSimulationMode
    });

    const assistantMsg: ChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'assistant',
      text: aiResult.text,
      timestamp: 'Just now',
      metadata: aiResult.metadata
    };

    setChatMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  const resetToDemoBaseline = () => {
    setSettlements(MockDataService.getSettlements());
    setSelectedSettlementId('kadalpuram');
    setSafeSites(MockDataService.getSafeSites());
    setSelectedSafeSiteId('site-b');
    setAlerts(MockDataService.getAlerts());
    setKadalpuramSimulationMode('BASELINE');
    setIncidents(INITIAL_INCIDENTS);
    setHazardReports(INITIAL_HAZARD_REPORTS);
    setShelters(INITIAL_SHELTERS);
    setRoads(INITIAL_ROADS);
    setEmergencyResources(INITIAL_EMERGENCY_RESOURCES);
    setActiveCitizenSosId('sos-kad-01');
    setRecoveryItems(INITIAL_RECOVERY_ITEMS);
    setSectorDamageSummaries(SECTOR_DAMAGE_SUMMARIES);
    setDataConflicts(INITIAL_DATA_CONFLICTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAdminReviewSteps(INITIAL_ADMIN_REVIEW_STEPS);
    setFieldTasks(INITIAL_FIELD_TASKS);
    setEmergencyMode(false);
    setCurrentPage('dashboard');

    addToast({
      type: 'info',
      title: 'Demo Baseline Restored',
      description: 'All 16 views reset to initial deterministic state (Kadalpuram Risk 72/100).'
    });
  };

  // Guided Tour
  const startDemoTour = () => {
    setIsTourActive(true);
    setTourStep(1);
    setCurrentPage('dashboard');
    addToast({
      type: 'info',
      title: '4-Minute Hackathon Demo Tour Started',
      description: 'Follow the top guided banner for a complete walkthrough.'
    });
  };

  const nextTourStep = () => {
    const next = tourStep + 1;
    setTourStep(next);
    switch (next) {
      case 2:
        setSelectedSettlementId('kadalpuram');
        setCurrentPage('settlement-detail');
        break;
      case 3:
        setCurrentPage('intervention');
        break;
      case 4:
        setSelectedSafeSiteId('site-b');
        setCurrentPage('safe-sites');
        break;
      case 5:
        setCurrentPage('relocation');
        break;
      case 6:
        setCurrentPage('simulator');
        break;
      case 7:
        setCurrentPage('emergency-center');
        break;
      case 8:
        setCurrentPage('recovery');
        break;
      case 9:
        setCurrentPage('prevention');
        break;
      case 10:
        setCurrentPage('audit');
        break;
      case 11:
        setActiveViewMode('CITIZEN');
        break;
      default:
        endTour();
        break;
    }
  };

  const prevTourStep = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activeViewMode,
        setActiveViewMode,
        currentUser,
        setCurrentUser,
        settlements,
        selectedSettlementId,
        setSelectedSettlementId,
        getSelectedSettlement,
        safeSites,
        selectedSafeSiteId,
        setSelectedSafeSiteId,
        getSelectedSafeSite,
        alerts,
        markAlertRead,
        kadalpuramSimulationMode,
        toggleRisingRiverSimulation,
        whatChangedEvents,
        incidents,
        hazardReports,
        shelters,
        roads,
        emergencyResources,
        activeCitizenSosId,
        setActiveCitizenSosId,
        triggerCitizenSOS,
        assignResourceToIncident,
        updateIncidentStatus,
        submitCitizenHazardReport,
        updateHazardReportStatus,
        updateShelterOccupancy,
        toggleRoadBlockage,
        overrideSettlementDecision,
        approveSettlementDecision,
        hazardLayers,
        toggleHazardLayer,
        setLayerOpacity,
        searchTerm,
        setSearchTerm,
        filterHazard,
        setFilterHazard,
        filterRiskLevel,
        setFilterRiskLevel,
        filterPriority,
        setFilterPriority,
        filterDistrict,
        setFilterDistrict,
        resetFilters,
        emergencyMode,
        setEmergencyMode,
        language,
        setLanguage,
        t,
        scoringWeights,
        setScoringWeights,
        isAIChatOpen,
        setIsAIChatOpen,
        chatMessages,
        sendUserChatMessage,
        isDecisionTraceOpen,
        setIsDecisionTraceOpen,
        toasts,
        addToast,
        removeToast,
        tourStep,
        isTourActive,
        startDemoTour,
        nextTourStep,
        prevTourStep,
        endTour,
        triggerSimulatedDataUpdate,
        submitFieldVerificationEvidence,
        recoveryItems,
        sectorDamageSummaries,
        dataConflicts,
        auditLogs,
        adminReviewSteps,
        fieldTasks,
        selectedConflictId,
        setSelectedConflictId,
        isConflictModalOpen,
        setIsConflictModalOpen,
        resolveDataConflict,
        triggerRoadADataConflict,
        updateRecoveryStatus,
        addAuditLogEntry,
        toggleAdminReviewStep,
        submitCitizenDamageClaim,
        updateFieldTaskStatus,
        isDecisionBriefOpen,
        setIsDecisionBriefOpen,
        resetToDemoBaseline
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

