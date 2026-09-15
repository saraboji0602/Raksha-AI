import { AuditLogEntry, DataConflictItem, FieldTaskItem, AdministrativeReviewStep } from '../types';

export const INITIAL_DATA_CONFLICTS: DataConflictItem[] = [
  {
    id: 'conf-01',
    parameterName: 'Coastal Causeway Route A (Passability Status)',
    locationName: 'Kadalpuram Beachfront Culvert B-07',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    
    // AI Observation
    aiValue: 'ROAD OPEN (Dry Season Baseline Envelope)',
    aiConfidence: 82,
    aiSource: 'Synthetic SAR Radar Gauge N-04 (14 days old)',
    aiTimestamp: '45 mins ago',
    
    // Field Officer Observation
    fieldValue: 'ROAD BLOCKED (+1.4m Wave Surge Ingress across 350m)',
    fieldConfidence: 96,
    fieldOfficerName: 'Insp. R. Sundaram',
    fieldOfficerBadge: 'TN-DDMA-F04',
    fieldTimestamp: '12 mins ago',
    fieldEvidenceNotes: 'Ground physical measurement with graduated water rod. Causeway culvert foundation undermined. 2 motorcycles abandoned in water. Severe undertow.',
    fieldGeotaggedPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    
    conflictSeverity: 'CRITICAL',
    discrepancySummary: 'AI telemetry indicated causeway was passable. Field officer physical verification proves tidal wave runup has submerged the road by 1.4m, posing catastrophic entrapment risk.',
    impactedWorkflows: [
      'Safe Route Evacuation Bypass (Reroute via SH-49)',
      'Immediate Citizen Notification Broadcast',
      'NDRF Rescue Boat Priority Elevation'
    ],
    status: 'CONFLICT_DETECTED'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2 hours ago',
    actor: {
      id: 'usr-collector',
      name: 'Thiru. S. Arunkumar, IAS',
      role: 'DDMA_OFFICER',
      designation: 'District Collector & Chairman DDMA',
      badgeNumber: 'TN-IAS-2016-08'
    },
    actionType: 'AI_RECOMMENDATION',
    title: 'Multi-Hazard Risk Assessment Evaluated for Kadalpuram',
    targetEntityId: 'kadalpuram',
    targetEntityType: 'SETTLEMENT',
    targetEntityName: 'Kadalpuram',
    previousValue: 'Baseline Monsoonal Risk: 72/100 (HIGH)',
    newValue: 'Simulated River Surge Inundation: 91/100 (CRITICAL)',
    officialReason: 'Compound risk model executed: coastal scarp retreat + Category 4 cyclonic envelope.',
    statutoryBasis: 'Section 30(2)(iii) Disaster Management Act 2005',
    confidenceBefore: 78,
    confidenceAfter: 82
  },
  {
    id: 'aud-02',
    timestamp: '1 hour ago',
    actor: {
      id: 'usr-field-04',
      name: 'Insp. R. Sundaram',
      role: 'FIELD_OFFICER',
      designation: 'Field Verification Officer',
      badgeNumber: 'TN-DDMA-F04'
    },
    actionType: 'FIELD_VERIFICATION_SUBMITTED',
    title: 'Ground Truth Dossier Submitted for Beachfront Scarp',
    targetEntityId: 'kadalpuram',
    targetEntityType: 'SETTLEMENT',
    targetEntityName: 'Kadalpuram Zone A',
    previousValue: 'Unverified InSAR Satellite Prediction',
    newValue: 'Ground Verified: 3.4m Scarp Loss & 6 Salinized Wells',
    officialReason: 'Physical ground inspection with laser rangefinder and conductivity probe.',
    confidenceBefore: 72,
    confidenceAfter: 94,
    evidenceReference: 'Dossier #FT-NGP-01 (EXIF Tagged Photos 1-4)'
  },
  {
    id: 'aud-03',
    timestamp: '40 mins ago',
    actor: {
      id: 'sys-engine',
      name: 'RAKSHA Data Verification Engine',
      role: 'SYSTEM_ADMIN',
      designation: 'Automated Truth Arbiter',
      badgeNumber: 'SYS-AUTOPROC'
    },
    actionType: 'DATA_CONFLICT_DETECTED',
    title: 'Discrepancy Flagged: Coastal Causeway Road A Status',
    targetEntityId: 'road-causeway-a',
    targetEntityType: 'ROAD',
    targetEntityName: 'Coastal Causeway Route A',
    previousValue: 'AI Sensor: Road OPEN (82% Confidence)',
    newValue: 'Field Officer: Road BLOCKED +1.4m (96% Confidence)',
    officialReason: 'Automated conflict detection: Field physical measurement contradicts synthetic satellite telemetry. Flagged for statutory human review.',
    confidenceBefore: 82,
    confidenceAfter: 96,
    evidenceReference: 'Conflict Record #conf-01'
  },
  {
    id: 'aud-04',
    timestamp: '25 mins ago',
    actor: {
      id: 'usr-collector',
      name: 'Thiru. S. Arunkumar, IAS',
      role: 'DDMA_OFFICER',
      designation: 'District Collector & Chairman DDMA',
      badgeNumber: 'TN-IAS-2016-08'
    },
    actionType: 'HUMAN_DECISION_OVERRIDE',
    title: 'Field Ground Truth Accepted & Safe Route Rerouted',
    targetEntityId: 'road-causeway-a',
    targetEntityType: 'ROAD',
    targetEntityName: 'Coastal Causeway Route A',
    previousValue: 'Road Status: OPEN',
    newValue: 'Road Status: BLOCKED (Reroute via SH-49 High Corridor)',
    officialReason: 'Officer human authority decision: Field evidence verified 1.4m deep water over causeway. Route A officially closed. Public reroute advisory broadcast.',
    statutoryBasis: 'Section 34(a) Disaster Management Act 2005 (Evacuation & Movement Control)',
    confidenceBefore: 82,
    confidenceAfter: 96
  },
  {
    id: 'aud-05',
    timestamp: '15 mins ago',
    actor: {
      id: 'usr-collector',
      name: 'Thiru. S. Arunkumar, IAS',
      role: 'DDMA_OFFICER',
      designation: 'District Collector & Chairman DDMA',
      badgeNumber: 'TN-IAS-2016-08'
    },
    actionType: 'SETTLEMENT_APPROVED',
    title: 'Formal Sanction: Partial Relocation of Zone A to Haven Site B',
    targetEntityId: 'kadalpuram',
    targetEntityType: 'SETTLEMENT',
    targetEntityName: 'Kadalpuram (Zone A & B)',
    previousValue: 'AI Recommendation: PARTIAL RELOCATION (Advisory)',
    newValue: 'Formally Sanctioned by District Collector (Statutory Directive)',
    officialReason: 'High risk (91/100), verified 3.4m scarp loss, and available headroom at Pothigai Haven (+2,350) make partial relocation strictly optimal.',
    statutoryBasis: 'Section 30(2)(v) Disaster Management Act 2005',
    confidenceBefore: 72,
    confidenceAfter: 94
  }
];

export const INITIAL_FIELD_TASKS: FieldTaskItem[] = [
  {
    id: 'task-01',
    incidentId: 'sos-kad-01',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-1',
    microZoneName: 'Zone A (Coastal Fishing Hamlet)',
    title: 'Verify Passability of Coastal Causeway Culvert B-07',
    taskType: 'ROAD_PASSABILITY',
    priority: 'IMMEDIATE',
    status: 'CONFLICT_DETECTED',
    expectedAiCondition: 'AI Sensor: Road OPEN (82% Confidence)',
    actualGroundObservation: 'Field Verified: Road BLOCKED by +1.4m Tidal Surge Ingress (96% Confidence)',
    aiConfidence: 82,
    fieldConfidence: 96,
    hasConflict: true,
    conflictId: 'conf-01',
    officerNotes: 'Physical measurement confirms 1.4m seawater depth over 350m road. Undertow active. Barricades required.',
    geotaggedPhotos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80'
    ],
    assignedOfficerName: 'Insp. R. Sundaram',
    assignedOfficerBadge: 'TN-DDMA-F04',
    timestamp: '12 mins ago'
  },
  {
    id: 'task-02',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-1',
    microZoneName: 'Zone A (Beachfront Scarp)',
    title: 'Ground Survey of Coastal Berm Retreat & Drinking Wells',
    taskType: 'EROSION_SCARP',
    priority: 'HIGH',
    status: 'VERIFIED',
    expectedAiCondition: 'AI Prediction: 2.8m/yr scarp erosion',
    actualGroundObservation: 'Field Verified: 3.4m/yr actual scarp retreat. 6 open wells contaminated with seawater.',
    aiConfidence: 78,
    fieldConfidence: 94,
    hasConflict: false,
    officerNotes: 'Erosion rate exceeds dry season model. Relocation of 950 households to Haven Site B is urgent.',
    geotaggedPhotos: [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&fit=crop&q=80'
    ],
    assignedOfficerName: 'Insp. R. Sundaram',
    assignedOfficerBadge: 'TN-DDMA-F04',
    timestamp: '1 hour ago'
  },
  {
    id: 'task-03',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-3',
    microZoneName: 'Zone C (Temple High Ridge)',
    title: 'Audit Primary Health Centre Relief Shelter Capacity',
    taskType: 'SHELTER_INSPECTION',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    expectedAiCondition: 'AI Capacity Model: 350 max capacity',
    actualGroundObservation: 'Field Verified: All 350 beds occupied. Standby medical inventory satisfactory.',
    aiConfidence: 92,
    fieldConfidence: 98,
    hasConflict: false,
    officerNotes: 'Camp operating smoothly. Additional evacuees must be redirected to Site B Haven.',
    geotaggedPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80'
    ],
    assignedOfficerName: 'Staff Nurse Anbarasi',
    assignedOfficerBadge: 'TN-HSD-8812',
    timestamp: '2 hours ago'
  }
];

export const INITIAL_ADMIN_REVIEW_STEPS: AdministrativeReviewStep[] = [
  {
    id: 'step-01',
    stageName: 'Grama Sabha Resolution & Community Consent (Section 16 RFCTLARR 2013)',
    status: 'COMPLETED',
    officerName: 'Panchayat President K. Velan',
    officerDesignation: 'Kadalpuram Village Panchayat Council',
    timestamp: 'Yesterday, 16:30 hrs',
    notes: '89% quorum recorded; unanimous consent for Zone A relocation to Site B Haven.',
    legalSignOffRequired: true
  },
  {
    id: 'step-02',
    stageName: 'Joint Field Verification & Geotechnical Foundation Sign-off',
    status: 'COMPLETED',
    officerName: 'Insp. R. Sundaram & Er. M. Rajesh',
    officerDesignation: 'Field Inspection Unit & PWD Geotechnical Wing',
    timestamp: 'Today, 09:15 hrs',
    notes: 'Site B (Pothigai High Haven) load-bearing capacity verified at 180 kN/m².',
    legalSignOffRequired: true
  },
  {
    id: 'step-03',
    stageName: 'Social Impact & Livelihood Transition Matrix Assessment',
    status: 'COMPLETED',
    officerName: 'Dr. V. Meenakshi',
    officerDesignation: 'District Social Welfare Officer',
    timestamp: 'Today, 11:00 hrs',
    notes: 'Cold-chain fish storage at Site B is within 1.2km; zero livelihood displacement observed.',
    legalSignOffRequired: true
  },
  {
    id: 'step-04',
    stageName: 'Coastal Zone Management Authority (TNCZMA) Clearance & Land Title Transfer',
    status: 'IN_PROGRESS',
    officerName: 'Tmt. S. Kavitha, IFS',
    officerDesignation: 'District Forest Officer & Member TNCZMA',
    timestamp: 'Pending Final Seal',
    notes: 'Haven Site B is beyond 500m HTL (Non-CRZ category). File submitted for statutory seal.',
    legalSignOffRequired: true
  },
  {
    id: 'step-05',
    stageName: 'District Disaster Management Authority (DDMA) Statutory Approval (Section 30 DMA 2005)',
    status: 'IN_PROGRESS',
    officerName: 'Thiru. S. Arunkumar, IAS',
    officerDesignation: 'District Collector & Chairman DDMA',
    timestamp: 'Under Review',
    notes: 'Ready for electronic digital signature once Step 04 is sealed.',
    legalSignOffRequired: true
  },
  {
    id: 'step-06',
    stageName: 'State Gazette Notification & SDRF Fund Allocation Tranche 1',
    status: 'PENDING',
    officerDesignation: 'Commissioner of Revenue Administration (Disaster Relief)',
    legalSignOffRequired: true
  }
];

