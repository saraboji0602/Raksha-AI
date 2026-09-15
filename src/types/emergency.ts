export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'SUBMITTED' 
  | 'RECEIVED' 
  | 'UNDER_REVIEW' 
  | 'ASSIGNED' 
  | 'EN_ROUTE' 
  | 'ON_SCENE' 
  | 'RESOLVED';

export type IncidentSource = 
  | 'CITIZEN_SOS' 
  | 'CITIZEN_HAZARD_REPORT' 
  | 'AUTOMATED_SENSOR' 
  | 'OFFICER_LOG';

export type EmergencyType = 
  | 'FLOOD_TRAPPED' 
  | 'MEDICAL_EMERGENCY' 
  | 'HOUSE_COLLAPSE_RISK' 
  | 'CUT_OFF_BY_WATER' 
  | 'CYCLONE_DAMAGE' 
  | 'EVACUATION_ASSISTANCE' 
  | 'GENERAL_HAZARD';

export interface VulnerableDemographics {
  elderlyCount: number;
  infantsChildrenCount: number;
  disabledCount: number;
  medicalNeedCount: number;
  pregnantCount?: number;
}

export interface IncidentTimelineEvent {
  stage: IncidentStatus;
  label: string;
  timestamp: string;
  notes?: string;
  actor?: string;
}

export interface AssignedResource {
  teamId: string;
  teamName: string;
  resourceType: 'RESCUE_BOAT' | 'AMBULANCE' | 'FIRE_RESCUE_VEHICLE' | 'SUPPLY_TRUCK' | 'VOLUNTEER_CORPS';
  dispatchedAt: string;
  etaMinutes: number;
  contactNumber: string;
  vehicleRegistration?: string;
}

export interface IncidentItem {
  id: string;
  title: string;
  type: EmergencyType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  settlementId: string;
  settlementName: string;
  microZoneId: string;
  microZoneName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  peopleCount: number;
  vulnerableCount: number;
  vulnerableDetails: VulnerableDemographics;
  description: string;
  priorityScore: number; // 0 - 100 deterministic score
  priorityBreakdown?: {
    severityWeight: number;
    peopleWeight: number;
    vulnerabilityWeight: number;
    zoneRiskWeight: number;
  };
  timestamp: string;
  reporterName?: string;
  reporterPhone?: string;
  assignedResource?: AssignedResource;
  timeline: IncidentTimelineEvent[];
  confidence: number; // 0 - 100
  photoEvidenceUrl?: string;
}

export type HazardReportType = 
  | 'FLOOD_INUNDATION' 
  | 'BLOCKED_ROAD' 
  | 'SCARP_EROSION_LANDSLIDE' 
  | 'DAMAGED_BRIDGE_CULVERT' 
  | 'ELECTRICAL_HAZARD' 
  | 'UNSAFE_SHELTER' 
  | 'WATER_CONTAMINATION';

export interface HazardReportItem {
  id: string;
  reportType: HazardReportType;
  title: string;
  description: string;
  settlementId: string;
  settlementName: string;
  microZoneId: string;
  microZoneName: string;
  severity: IncidentSeverity;
  status: 'SUBMITTED' | 'RECEIVED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'VERIFIED' | 'RESOLVED';
  timestamp: string;
  reporterName: string;
  reporterPhone: string;
  evidencePhotoPlaceholder?: string;
  confidenceScore: number;
  verifiedByOfficer?: boolean;
  officerVerificationNotes?: string;
}

export interface EmergencyShelter {
  id: string;
  name: string;
  code: string;
  settlementId: string;
  settlementName: string;
  district: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  distanceKm: number;
  capacity: number;
  currentOccupancy: number;
  remainingCapacity: number;
  status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL' | 'STANDBY';
  waterAvailable: boolean;
  medicalAvailable: boolean;
  electricityAvailable: boolean;
  sanitationAvailable: boolean;
  wheelchairAccessible: boolean;
  roadAccess: 'CLEAR' | 'CAUTION' | 'BLOCKED';
  suitabilityScore: number; // 0 - 100
  address: string;
  contactPerson: string;
  contactPhone: string;
  isPrimaryHavenCandidate?: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  code: string;
  fromLocation: string;
  toLocation: string;
  settlementId: string;
  status: 'OPEN' | 'CAUTION' | 'BLOCKED';
  blockageReason?: string;
  waterDepthMeters?: number;
  alternativeRouteId?: string;
  alternativeRouteName?: string;
  rerouteNotice?: string;
  lastUpdated: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'RESCUE_BOAT' | 'AMBULANCE' | 'FIRE_RESCUE_VEHICLE' | 'SUPPLY_TRUCK' | 'VOLUNTEER_CORPS';
  status: 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE';
  currentLocation: string;
  capacity: string;
  driverContact: string;
  assignedIncidentId?: string;
}

export interface EmergencyHelpline {
  id: string;
  name: string;
  number: string;
  agency: string;
  available24x7: boolean;
  category: 'RESCUE' | 'MEDICAL' | 'POLICE' | 'FIRE' | 'LOCAL_PANCHAYAT';
  description: string;
}
