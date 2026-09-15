export type AuditActionType = 
  | 'AI_RECOMMENDATION' 
  | 'FIELD_VERIFICATION_SUBMITTED' 
  | 'DATA_CONFLICT_DETECTED' 
  | 'HUMAN_DECISION_OVERRIDE' 
  | 'ROAD_STATUS_UPDATED' 
  | 'RECOVERY_SANCTIONED' 
  | 'SETTLEMENT_APPROVED' 
  | 'EMERGENCY_DISPATCHED';

export type ConflictResolutionChoice = 
  | 'ACCEPT_FIELD' 
  | 'ACCEPT_AI' 
  | 'MODIFY';

export type ConflictStatus = 
  | 'CONFLICT_DETECTED' 
  | 'UNDER_HUMAN_REVIEW' 
  | 'RESOLVED_ACCEPTED_FIELD' 
  | 'RESOLVED_ACCEPTED_AI' 
  | 'RESOLVED_MODIFIED';

export interface AuditActor {
  id: string;
  name: string;
  role: string;
  designation: string;
  badgeNumber: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: AuditActor;
  actionType: AuditActionType;
  title: string;
  targetEntityId: string;
  targetEntityType: 'SETTLEMENT' | 'ROAD' | 'SHELTER' | 'INCIDENT' | 'RECOVERY_PROJECT' | 'DATA_FEED';
  targetEntityName: string;
  previousValue: string;
  newValue: string;
  officialReason: string;
  statutoryBasis?: string; // e.g. "Section 30(2)(v) Disaster Management Act 2005"
  confidenceBefore?: number;
  confidenceAfter?: number;
  evidenceReference?: string;
}

export interface DataConflictItem {
  id: string;
  parameterName: string;
  locationName: string;
  settlementId: string;
  settlementName: string;
  
  // AI Sensor Observation
  aiValue: string;
  aiConfidence: number; // e.g. 82%
  aiSource: string; // e.g. "Satellite Synthetic Aperture Radar (SAR) Telemetry"
  aiTimestamp: string;
  
  // Field Officer Ground Truth
  fieldValue: string;
  fieldConfidence: number; // e.g. 96%
  fieldOfficerName: string;
  fieldOfficerBadge: string;
  fieldTimestamp: string;
  fieldEvidenceNotes: string;
  fieldGeotaggedPhotoUrl?: string;
  
  // Discrepancy details
  conflictSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  discrepancySummary: string;
  impactedWorkflows: string[]; // e.g. ["Safe Route Recalculation", "Evacuation Priority", "Citizen Notification"]
  status: ConflictStatus;
  
  // Human Resolution
  resolvedBy?: AuditActor;
  resolvedAt?: string;
  resolutionChoice?: ConflictResolutionChoice;
  officerDecisionReason?: string;
}

export interface AdministrativeReviewStep {
  id: string;
  stageName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'REJECTED';
  officerName?: string;
  officerDesignation?: string;
  timestamp?: string;
  notes?: string;
  legalSignOffRequired: boolean;
}
