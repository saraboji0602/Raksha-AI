export type HazardType = 
  | 'flood' 
  | 'landslide' 
  | 'cyclone' 
  | 'coastal_erosion' 
  | 'earthquake' 
  | 'drought' 
  | 'heatwave' 
  | 'multi_hazard';

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
}

export interface InfrastructureStatus {
  schools: { count: number; exposed: number; nearestKm: number };
  healthcare: { count: number; exposed: number; nearestKm: number; facilityType: string };
  waterSupply: { score: number; reliability: 'HIGH' | 'MEDIUM' | 'LOW'; nearestKm: number };
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
  exposureScore: number; // 0 - 100
  vulnerabilityScore: number; // 0 - 100
  resilienceScore: number; // 0 - 100
  dataConfidence: number; // 0 - 100 %
  
  // Prioritization & Action
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100
  aiRecommendation: InterventionType;
  recommendationReason: string;
  status: SettlementStatus;
  
  // Demographics breakdown
  exposedPopulation: number;
  exposedPercentage: number;
  childrenCount: number;
  elderlyCount: number;
  specialAssistanceCount: number;
  
  // Relocation Specs
  relocationPopulation: number;
  adaptationPopulation: number;
  protectionPopulation: number;
  recommendedSiteId: string;
  
  // Detailed subsystems
  hazards: HazardScore[];
  microZones: MicroZone[];
  infrastructure: InfrastructureStatus;
  historicalEvents: HistoricalDisasterEvent[];
  explainableFactors: ExplainableFactor[];
  
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
