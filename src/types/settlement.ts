export type HazardType = 
  | 'flood' 
  | 'landslide' 
  | 'cyclone' 
  | 'coastal_erosion' 
  | 'earthquake' 
  | 'drought' 
  | 'heatwave' 
  | 'multi_hazard';

export type CompoundHazardType =
  | 'FLOOD_PLUS_CYCLONE'
  | 'FLOOD_PLUS_COASTAL_EROSION'
  | 'CYCLONE_PLUS_COASTAL_EROSION'
  | 'LANDSLIDE_PLUS_HEAVY_RAIN'
  | 'NONE';

export type RiskLevel = 'CRITICAL' | 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';

export type PriorityLevel = 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'MONITOR';

export type InterventionType = 'PROTECT' | 'ADAPT' | 'PARTIAL_RELOCATION' | 'FULL_RELOCATION';

export type SettlementStatus = 
  | 'ASSESSMENT' 
  | 'FIELD_VERIFIED' 
  | 'CONSULTATION' 
  | 'PLANNING' 
  | 'INFRASTRUCTURE' 
  | 'RELOCATION_IN_PROGRESS' 
  | 'COMPLETED' 
  | 'POST_RELOCATION_MONITORING';

export type HumanReviewStatus = 
  | 'PENDING_OFFICER_REVIEW'
  | 'OFFICER_APPROVED'
  | 'OFFICER_OVERRIDDEN'
  | 'FIELD_AUDIT_REQUESTED';

export interface CompoundHazardInteraction {
  type: CompoundHazardType;
  primaryHazard: HazardType;
  secondaryHazard: HazardType;
  interactionMultiplier: number; // e.g. 1.25x compounded threat
  explanation: string;
}

export interface WhatChangedEvent {
  id: string;
  timestamp: string;
  title: string;
  parameter: string;
  beforeValue: string | number;
  afterValue: string | number;
  delta: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'HAZARD' | 'RISK_SCORE' | 'INFRASTRUCTURE' | 'EXPOSURE' | 'CONFIDENCE';
  rationale: string;
}

export interface DataConfidenceRecord {
  sourceName: string;
  sourceType: 'SYNTHETIC_SATELLITE' | 'SYNTHETIC_MET_GRID' | 'DEM_BASIN' | 'FIELD_VERIFICATION' | 'CENSUS_MOCK';
  timestamp: string;
  freshnessMinutes: number;
  confidenceScore: number;
  status: 'CONFIRMED' | 'DATA_GAP' | 'CONDITIONAL';
  dataGaps?: string[];
  isDemoSynthetic: boolean;
}

export interface HazardScore {
  type: HazardType;
  name: string;
  score: number; // 0 - 100
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  confidence: number;
  lastUpdated: string;
  source: string;
  description: string;
}

export interface MicroZone {
  id: string;
  name: string;
  zoneCode: string;
  population: number;
  households: number;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryHazard: HazardType;
  recommendation: InterventionType;
  reason: string;
  coordinates: [number, number][]; // Polygon coordinates
  vulnerablePeopleCount?: number;
  kutchaHousesCount?: number;
  distanceToCoastlineMeters?: number;
}

export interface InfrastructureStatus {
  schools: { count: number; exposed: number; nearestKm: number };
  healthcare: { count: number; exposed: number; nearestKm: number; facilityType: string };
  waterSupply: { score: number; reliability: 'HIGH' | 'MEDIUM' | 'LOW'; nearestKm: number; sourceNote?: string };
  roads: { accessScore: number; primaryRouteBlocked: boolean; bottleneckNotes: string; nearestHighwayKm: number };
  emergencyShelters: { count: number; capacity: number; nearestKm: number };
  powerReliability: number; // 0 - 100
  telecomCoverage: number; // 0 - 100
}

export interface HistoricalDisasterEvent {
  year: number;
  title: string;
  type: HazardType;
  severity: string;
  impactDesc: string;
  fatalities: number;
  displacedCount: number;
  damageEstCr: number;
}

export interface ExplainableFactor {
  factor: string;
  contribution: number; // e.g. +24
  category: 'HAZARD' | 'EXPOSURE' | 'VULNERABILITY' | 'RESILIENCE' | 'TERRAIN' | 'INFRASTRUCTURE';
  description: string;
  isCritical: boolean;
  dataSource?: string;
  confidencePct?: number;
  hasDataGap?: boolean;
}

export interface WhoNeedsActionItem {
  id: string;
  zoneId: string;
  zoneName: string;
  actionType: InterventionType | 'EVACUATION';
  urgency: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
  affectedPopulation: number;
  affectedHouseholds: number;
  vulnerableBreakdown: {
    children: number;
    elderly: number;
    specialAssistance: number;
    femaleHeaded: number;
  };
  housingType: 'KUTCHA_THATCHED' | 'SEMI_PUCCA' | 'PUCCA_VULNERABLE';
  targetDestinationSiteId?: string;
  targetDestinationName?: string;
  actionRationale: string;
}

export interface Settlement {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  households: number;
  areaSqKm: number;
  dominantHazard: HazardType;
  settlementType: 'COASTAL' | 'HILL_SLOPE' | 'RIVER_BASIN' | 'URBAN_SLOPE' | 'DELTA';
  isUrban: boolean;
  
  // Scoring
  overallRisk: number; // 0 - 100
  baselineRisk?: number; // Starting baseline (e.g. 72 for Kadalpuram)
  exposureScore: number; // 0 - 100
  vulnerabilityScore: number; // 0 - 100
  resilienceScore: number; // 0 - 100
  dataConfidence: number; // 0 - 100 %
  
  // Prioritization & Action
  priority: PriorityLevel;
  emergencyUrgency?: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
  longTermPriority?: 'HIGH' | 'MEDIUM' | 'LOW';
  priorityScore: number; // 0 - 100
  aiRecommendation: InterventionType;
  recommendationReason: string;
  status: SettlementStatus;
  
  // Human in the loop
  humanReviewStatus?: HumanReviewStatus;
  officerDecisionOverride?: InterventionType;
  officerOverrideReason?: string;
  officerOverrideTimestamp?: string;
  
  // Demographics breakdown
  exposedPopulation: number;
  exposedPercentage: number;
  childrenCount: number;
  elderlyCount: number;
  specialAssistanceCount: number;
  femaleHeadedCount?: number;
  kutchaHouseCount?: number;
  
  // Relocation Specs
  relocationPopulation: number;
  adaptationPopulation: number;
  protectionPopulation: number;
  recommendedSiteId: string;
  
  // Compound Hazard
  compoundHazard?: CompoundHazardInteraction;
  
  // Data Records & Confidence
  dataConfidenceRecords?: DataConfidenceRecord[];
  
  // Detailed subsystems
  hazards: HazardScore[];
  microZones: MicroZone[];
  infrastructure: InfrastructureStatus;
  historicalEvents: HistoricalDisasterEvent[];
  explainableFactors: ExplainableFactor[];
  whoNeedsAction?: WhoNeedsActionItem[];
  
  // Financials (in INR Crores)
  costProtectCr: number;
  costAdaptCr: number;
  costRelocateCr: number;
  costOfInactionCr: number;
  
  // Evacuation & Routes
  evacuationTimeMin: number;
  primaryEvacRoute: string;
  secondaryEvacRoute: string;
  evacBottleneck: string;
  
  // Audit / Time
  lastUpdated: string;
  fieldVerified: boolean;
  fieldVerificationNotes?: string;
  verifiedBy?: string;
}
