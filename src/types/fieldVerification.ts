export type VerificationStatus = 'PENDING' | 'IN_PROGRESS' | 'CONFIRMED' | 'MODIFIED' | 'REJECTED' | 'FLAGGED';

export interface FieldChecklistItem {
  id: string;
  category: 'HAZARD' | 'INFRASTRUCTURE' | 'VULNERABILITY' | 'RELOCATION';
  label: string;
  checked: boolean;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
}

export interface GroundPhotoEvidence {
  id: string;
  url: string;
  caption: string;
  tag: 'COASTAL_EROSION' | 'FLOOD_MARK' | 'SLOPE_CRACK' | 'DRAINAGE_BLOCK' | 'INFRASTRUCTURE_DAMAGE';
  timestamp: string;
  gpsCoords: [number, number];
}

export interface FieldVerificationSubmission {
  id: string;
  settlementId: string;
  settlementName: string;
  officerName: string;
  officerBadge: string;
  officerRole: string;
  timestamp: string;
  gpsLocation: { lat: number; lng: number; accuracyMeters: number };
  
  checklist: FieldChecklistItem[];
  photos: GroundPhotoEvidence[];
  voiceNoteDurationSec?: number;
  
  officerRiskAssessment: number; // 0 - 100
  hazardConfirmation: {
    confirmedHazards: string[];
    newHazardsDiscovered: string[];
    severityObserved: 'MATCHES_AI' | 'HIGHER_THAN_AI' | 'LOWER_THAN_AI';
  };
  
  generalObservations: string;
  recommendedAction: 'CONFIRM_AI_RECOMMENDATION' | 'ESCALATE_TO_FULL_RELOCATION' | 'DOWNGRADE_TO_ADAPT' | 'REQUEST_ENGINEERING_SURVEY';
  
  // Human in the Loop Impact
  preVerificationConfidence: number; // e.g. 72%
  postVerificationConfidence: number; // e.g. 94%
  confidenceBoostReason: string;
  status: VerificationStatus;
}
