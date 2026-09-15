export type DamageCategory = 
  | 'HOUSING' 
  | 'ROADS_BRIDGES' 
  | 'WATER_POWER_UTILITIES' 
  | 'HEALTHCARE_SCHOOLS' 
  | 'SHELTERS' 
  | 'COASTAL_PROTECTION';

export type DamageSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RecoveryStatus = 
  | 'REPORTED' 
  | 'ASSESSED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'VERIFIED' 
  | 'COMPLETED';

export interface RecoveryPriorityBreakdown {
  severityWeight: number; // Max 30
  populationImpactWeight: number; // Max 25
  vulnerablePopulationWeight: number; // Max 25
  infrastructureImportanceWeight: number; // Max 20
}

export interface RecoveryItem {
  id: string;
  incidentId?: string;
  settlementId: string;
  settlementName: string;
  microZoneId: string;
  microZoneName: string;
  damageCategory: DamageCategory;
  infrastructureName: string;
  damageDescription: string;
  severity: DamageSeverity;
  populationImpact: number;
  vulnerablePopulationImpact: number;
  priorityScore: number; // 0 - 100 deterministic formula
  priorityBreakdown: RecoveryPriorityBreakdown;
  status: RecoveryStatus;
  assignedTeam: string;
  contractorAgency?: string;
  estimatedCostCr: number;
  spentCostCr: number;
  progressPercentage: number;
  repairTimelineWeeks: number;
  reportedBy: string;
  reportedTimestamp: string;
  verifiedByOfficer?: string;
  verifiedTimestamp?: string;
  completionTargetDate: string;
  evidencePhotoUrl?: string;
}

export interface SectorDamageSummary {
  category: DamageCategory;
  label: string;
  totalAssetsDamaged: number;
  criticalCount: number;
  estimatedTotalCostCr: number;
  averageProgressPct: number;
  iconName: string;
}
