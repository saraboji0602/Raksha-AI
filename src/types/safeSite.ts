export type SiteValidationStatus = 
  | 'AI_IDENTIFIED' 
  | 'FIELD_ASSESSED' 
  | 'INFRASTRUCTURE_VALIDATED' 
  | 'COMMUNITY_CONSULTED' 
  | 'APPROVED_FOR_PLANNING';

export type LandVerificationStatus = 
  | 'POTENTIALLY_SUITABLE' 
  | 'NEEDS_LAND_VERIFICATION' 
  | 'OWNERSHIP_VERIFICATION_REQUIRED' 
  | 'ADMINISTRATIVE_REVIEW_REQUIRED';

export interface CarryingCapacityBreakdown {
  physicalLandCapacity: number; // Max population based on sq m/person
  waterSupportedCapacity: number;
  infrastructureCapacity: number;
  healthcareCapacity: number;
  educationCapacity: number;
  roadNetworkCapacity: number;
  recommendedMaxCapacity: number; // Constrained by bottleneck
  currentOccupancy?: number;
  remainingCapacity?: number;
  bottleneckResource: string;
  isOverCapacity?: boolean;
}

export interface InfrastructureGap {
  category: 'HOUSING' | 'WATER' | 'HEALTHCARE' | 'EDUCATION' | 'POWER' | 'ROADS' | 'COMMUNICATION';
  required: string;
  available: string;
  gapStatus: 'SATISFIED' | 'MODERATE_GAP' | 'CRITICAL_GAP';
  estimatedCostCr: number;
  hasDataGap?: boolean;
}

export interface CommunityAcceptanceMetrics {
  overallScore: number; // 0 - 100
  distanceScore: number;
  livelihoodContinuityScore: number; // Fishing / Agriculture / Industrial
  culturalCompatibilityScore: number;
  schoolHealthcareScore: number;
  socialNetworkScore: number;
  livelihoodType: 'COASTAL_FISHING' | 'AGRICULTURE' | 'AGRI_ALLIED' | 'SERVICES_URBAN';
  primaryConcerns: string[];
}

export interface SafeSite {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  landAreaAcres: number;
  currentLandUse: string;
  elevationMeters: number;
  distanceFromCoastKm: number;
  slopePercentage: number;
  
  // Status & Scores
  status: SiteValidationStatus;
  landVerificationStatus?: LandVerificationStatus;
  overallScore: number; // 0 - 100
  hazardSafetyScore: number; // 0 - 100
  landAvailabilityScore: number;
  connectivityScore: number;
  waterScore: number;
  healthcareScore: number;
  educationScore: number;
  livelihoodScore: number;
  administrativeFeasibilityScore?: number;
  
  // Climate Horizon
  climateHorizonYears?: number; // e.g. 50 years zero-flood envelope
  seaLevelRiseBufferMeters?: number;
  
  // Carrying Capacity
  capacity: CarryingCapacityBreakdown;
  allocatedPopulation: number;
  
  // Community Acceptance
  communityAcceptance: CommunityAcceptanceMetrics;
  
  // Infrastructure Specs
  infrastructureGaps: InfrastructureGap[];
  estimatedDevelopmentCostCr: number;
  estimatedDevelopmentTimeMonths: number;
  
  // Distance / Accessibility from target settlements
  distanceFromKeySettlementKm: { [settlementId: string]: number };
  travelTimeMin: { [settlementId: string]: number };
  roadQuality: 'EXCELLENT_HIGHWAY' | 'PAVED_ALL_WEATHER' | 'RURAL_UPGRADE_NEEDED';
  
  // Environmental Considerations
  ecologicalSensitivity: 'LOW' | 'MODERATE' | 'HIGH';
  environmentalClearanceRisk: 'MINIMAL' | 'REQUIRES_CRZ_CLEARANCE' | 'STANDARD_PERMITS';
  
  // Data Gap Tracking
  dataConfidenceScore?: number;
  hasUnverifiedLandStatus?: boolean;
  
  description: string;
  selectionRationale: string;
}

export interface SiteMatchResult {
  site: SafeSite;
  matchScore: number;
  safetyScore: number;
  capacityScore: number;
  accessibilityScore: number;
  communityAcceptanceScore: number;
  livelihoodCompatibilityScore: number;
  distanceKm: number;
  travelTimeMin: number;
  isRecommended: boolean;
  recommendationReason: string;
  carryingCapacityHeadroom?: number;
  whyRecommendedPoints?: string[];
}
