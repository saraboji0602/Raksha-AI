import { 
  EmergencyShelter, 
  RoadSegment, 
  EmergencyResource, 
  IncidentItem, 
  HazardReportItem, 
  EmergencyHelpline 
} from '../types';

export const INITIAL_SHELTERS: EmergencyShelter[] = [
  {
    id: 'shelter-site-b',
    name: 'Pothigai Resilient Haven (Primary Haven Site B)',
    code: 'SHELTER-TN-02-B',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram (Relocation Haven)',
    district: 'Nagapattinam Inland Sector',
    latitude: 10.8250,
    longitude: 79.6950,
    elevationMeters: 14.5,
    distanceKm: 18.4,
    capacity: 5000,
    currentOccupancy: 2650,
    remainingCapacity: 2350,
    status: 'OPEN',
    waterAvailable: true,
    medicalAvailable: true,
    electricityAvailable: true,
    sanitationAvailable: true,
    wheelchairAccessible: true,
    roadAccess: 'CLEAR',
    suitabilityScore: 94,
    address: 'Survey No. 142/3, Pothigai Plateau, SH-49 Inland Corridor',
    contactPerson: 'Thiru. M. Senthil Nathan (Tahsildar)',
    contactPhone: '+91 94451 98234',
    isPrimaryHavenCandidate: true
  },
  {
    id: 'shelter-ghss-cyclone',
    name: 'Govt Higher Secondary Multi-Purpose Cyclone Shelter',
    code: 'SHELTER-NGP-01',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram East Ridge',
    district: 'Nagapattinam',
    latitude: 10.7710,
    longitude: 79.8240,
    elevationMeters: 8.2,
    distanceKm: 2.8,
    capacity: 850,
    currentOccupancy: 790,
    remainingCapacity: 60,
    status: 'NEAR_CAPACITY',
    waterAvailable: true,
    medicalAvailable: true,
    electricityAvailable: true,
    sanitationAvailable: true,
    wheelchairAccessible: true,
    roadAccess: 'CLEAR',
    suitabilityScore: 82,
    address: 'East Coast Main Road, Near Panchayat Office',
    contactPerson: 'Dr. K. Radha (Camp Medical Officer)',
    contactPhone: '+91 98402 11987',
    isPrimaryHavenCandidate: false
  },
  {
    id: 'shelter-phc-relief',
    name: 'Kadalpuram Primary Health Centre Emergency Wing',
    code: 'SHELTER-NGP-02',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram Zone C Ridge',
    district: 'Nagapattinam',
    latitude: 10.7680,
    longitude: 79.8310,
    elevationMeters: 7.5,
    distanceKm: 1.6,
    capacity: 350,
    currentOccupancy: 350,
    remainingCapacity: 0,
    status: 'FULL',
    waterAvailable: true,
    medicalAvailable: true,
    electricityAvailable: true,
    sanitationAvailable: true,
    wheelchairAccessible: true,
    roadAccess: 'CAUTION',
    suitabilityScore: 68,
    address: 'Temple Ridge Road, Kadalpuram',
    contactPerson: 'Staff Nurse Anbarasi',
    contactPhone: '+91 94433 55123',
    isPrimaryHavenCandidate: false
  },
  {
    id: 'shelter-stanthony-hall',
    name: 'St. Anthony Community Relief Hall',
    code: 'SHELTER-NGP-03',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram Zone B Ingress',
    district: 'Nagapattinam',
    latitude: 10.7580,
    longitude: 79.8380,
    elevationMeters: 3.2,
    distanceKm: 0.9,
    capacity: 400,
    currentOccupancy: 120,
    remainingCapacity: 280,
    status: 'STANDBY',
    waterAvailable: true,
    medicalAvailable: false,
    electricityAvailable: true,
    sanitationAvailable: true,
    wheelchairAccessible: false,
    roadAccess: 'CAUTION',
    suitabilityScore: 55,
    address: 'Church Road, Fishermen Quarter',
    contactPerson: 'Fr. Joseph Amalraj',
    contactPhone: '+91 98841 77209',
    isPrimaryHavenCandidate: false
  }
];

export const INITIAL_ROADS: RoadSegment[] = [
  {
    id: 'road-causeway-a',
    name: 'Coastal Causeway Route A (Zone A Fishing Hamlet Link)',
    code: 'RD-NGP-01-A',
    fromLocation: 'Kadalpuram Beachfront Zone A',
    toLocation: 'East Coast Highway Junction',
    settlementId: 'kadalpuram',
    status: 'BLOCKED',
    blockageReason: 'Tidal Fluvial Surge Ingress (+1.4m water depth across 350m culvert causeway)',
    waterDepthMeters: 1.4,
    alternativeRouteId: 'road-inland-bypass-b',
    alternativeRouteName: 'Inland Elevated Bypass Route B (via SH-49 High Corridor)',
    rerouteNotice: 'Route updated: Primary Causeway is submerged by 1.4m wave surge. Proceed strictly via West Temple Elevated Ridge Road B.',
    lastUpdated: '12 mins ago (Live Gauge Sync)'
  },
  {
    id: 'road-inland-bypass-b',
    name: 'Inland Elevated Bypass Route B (Temple Ridge to SH-49)',
    code: 'RD-NGP-02-B',
    fromLocation: 'Kadalpuram Temple Ridge (Zone C)',
    toLocation: 'Pothigai Haven Site B / State Highway SH-49',
    settlementId: 'kadalpuram',
    status: 'OPEN',
    blockageReason: undefined,
    waterDepthMeters: 0.0,
    rerouteNotice: 'CLEAR & SAFE: 4-lane paved all-weather elevated evacuation corridor.',
    lastUpdated: '5 mins ago'
  },
  {
    id: 'road-canal-bank-c',
    name: 'South Canal Feeder Road (Zone B Canal Bank)',
    code: 'RD-NGP-03-C',
    fromLocation: 'Zone B Inland Canal Bank',
    toLocation: 'Town Hall Junction',
    settlementId: 'kadalpuram',
    status: 'CAUTION',
    blockageReason: 'Standing water +0.3m on shoulder; slow single-lane traffic only',
    waterDepthMeters: 0.3,
    alternativeRouteId: 'road-inland-bypass-b',
    alternativeRouteName: 'Inland Elevated Bypass Route B',
    rerouteNotice: 'Proceed with extreme caution; heavy vehicles advised to take Route B.',
    lastUpdated: '18 mins ago'
  }
];

export const INITIAL_EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    id: 'res-ndrf-boat-4',
    name: 'NDRF 04 Battalion Inflatable Rescue Boat Squad',
    type: 'RESCUE_BOAT',
    status: 'AVAILABLE',
    currentLocation: 'Nagapattinam Port Staging Base (4.2 km away)',
    capacity: '12 Persons / 800 kg per trip',
    driverContact: 'Commander R. K. Nair (+91 94450 12044)',
  },
  {
    id: 'res-sdrf-ambulance-2',
    name: 'SDRF 108 Advanced Life Support Ambulance Bay 2',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    currentLocation: 'District GH Hub (5.8 km away)',
    capacity: '2 Critical Stretcher + 4 Sitting + Oxygen Support',
    driverContact: 'EMT S. Murugan (+91 98401 22899)',
  },
  {
    id: 'res-fire-truck-1',
    name: 'TN Fire & Rescue Services Heavy Extraction Unit 1',
    type: 'FIRE_RESCUE_VEHICLE',
    status: 'AVAILABLE',
    currentLocation: 'Velankanni Fire Station (6.5 km away)',
    capacity: 'Heavy tree cutter, generator, 8 rescue crew',
    driverContact: 'Station Officer G. Pandian (+91 94432 88711)',
  },
  {
    id: 'res-supply-truck-1',
    name: 'Civil Supplies Disaster Relief Ration & Water Truck',
    type: 'SUPPLY_TRUCK',
    status: 'AVAILABLE',
    currentLocation: 'Nagapattinam Collectorate Yard (7.0 km away)',
    capacity: '5,000 Food Packets + 3,000L Potable Water Tank',
    driverContact: 'Supply Inspector V. Selvan (+91 94421 66544)',
  },
  {
    id: 'res-volunteer-team-a',
    name: 'Aapda Mitra Trained Youth Volunteer Corps (Team A)',
    type: 'VOLUNTEER_CORPS',
    status: 'AVAILABLE',
    currentLocation: 'Kadalpuram Village Knowledge Centre',
    capacity: '18 Trained First Responders with VHF Radios',
    driverContact: 'Team Leader D. Praveen (+91 97891 33455)',
  }
];

export const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'sos-kad-01',
    title: 'EMERGENCY SOS: Family Trapped in Kutcha House near Beach Scarp',
    type: 'FLOOD_TRAPPED',
    severity: 'CRITICAL',
    status: 'SUBMITTED',
    source: 'CITIZEN_SOS',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-1',
    microZoneName: 'Zone A (Coastal Fishing Hamlet)',
    landmark: 'Behind Old Mariamman Temple, Shoreline Road House #44',
    latitude: 10.7621,
    longitude: 79.8432,
    peopleCount: 6,
    vulnerableCount: 3,
    vulnerableDetails: {
      elderlyCount: 2,
      infantsChildrenCount: 1,
      disabledCount: 0,
      medicalNeedCount: 1,
      pregnantCount: 0
    },
    description: 'Surge water has entered compound reaching 1.2m depth. 78-year-old grandfather unable to walk and needs insulin. Wave action eroding front sand foundation.',
    priorityScore: 98,
    priorityBreakdown: {
      severityWeight: 30, // Critical
      peopleWeight: 22,
      vulnerabilityWeight: 26, // 2 elderly, 1 infant
      zoneRiskWeight: 20 // Frontline Zone A 96 risk
    },
    timestamp: '4 minutes ago',
    reporterName: 'K. Murugesan',
    reporterPhone: '+91 98421 90812',
    confidence: 96,
    timeline: [
      {
        stage: 'SUBMITTED',
        label: 'SOS Alert Transmitted by Citizen App',
        timestamp: '4 mins ago',
        notes: 'GPS locked within 4.5m accuracy. Emergency SOS packet received.'
      }
    ]
  },
  {
    id: 'sos-kad-02',
    title: 'MEDICAL SOS: Respiratory Distress in Cut-off Canal Cluster',
    type: 'MEDICAL_EMERGENCY',
    severity: 'HIGH',
    status: 'RECEIVED',
    source: 'CITIZEN_SOS',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-2',
    microZoneName: 'Zone B (Inland Canal Ingress)',
    landmark: 'Near North Canal Sluice Gate, Lane 3',
    latitude: 10.7594,
    longitude: 79.8398,
    peopleCount: 3,
    vulnerableCount: 2,
    vulnerableDetails: {
      elderlyCount: 1,
      infantsChildrenCount: 0,
      disabledCount: 1,
      medicalNeedCount: 2
    },
    description: 'Asthma patient running low on oxygen cylinders. Road waterlogged with 0.4m standing water.',
    priorityScore: 89,
    timestamp: '18 minutes ago',
    reporterName: 'S. Lakshmi',
    reporterPhone: '+91 94432 10887',
    confidence: 92,
    timeline: [
      {
        stage: 'SUBMITTED',
        label: 'SOS Alert Transmitted',
        timestamp: '18 mins ago'
      },
      {
        stage: 'RECEIVED',
        label: 'Acknowledged by DDMA Emergency Desk',
        timestamp: '15 mins ago',
        notes: 'Triaged by Medical Officer. Ambulance allocation queued.'
      }
    ]
  }
];

export const INITIAL_HAZARD_REPORTS: HazardReportItem[] = [
  {
    id: 'rep-01',
    reportType: 'BLOCKED_ROAD',
    title: 'Beachfront Culvert Causeway Completely Submerged (+1.4m)',
    description: 'Seawater combined with river overflow has overtopped the causeway bridge. 2 two-wheelers stuck. No heavy vehicles can cross.',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-1',
    microZoneName: 'Zone A (Coastal Fishing Hamlet)',
    severity: 'CRITICAL',
    status: 'VERIFIED',
    timestamp: '25 mins ago',
    reporterName: 'D. Praveen (Aapda Mitra Volunteer)',
    reporterPhone: '+91 97891 33455',
    confidenceScore: 95,
    verifiedByOfficer: true,
    officerVerificationNotes: 'Confirmed by Coastal Police Station beat officer. Route A marked BLOCKED in central state.'
  },
  {
    id: 'rep-02',
    reportType: 'ELECTRICAL_HAZARD',
    title: 'Snapped 11kV Distribution Line in Standing Water',
    description: 'High wind gust snapped branch onto 11kV line near canal bridge. Transformer sparking into water.',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-2',
    microZoneName: 'Zone B (Inland Canal Ingress)',
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW',
    timestamp: '38 mins ago',
    reporterName: 'M. Sankar',
    reporterPhone: '+91 98402 77123',
    confidenceScore: 88
  },
  {
    id: 'rep-03',
    reportType: 'SCARP_EROSION_LANDSLIDE',
    title: 'Severe Coastal Berm Scarp Slump (3.5m bank loss)',
    description: 'Wave runup undercut sandy scarp behind fisherman community shed. Ground cracking extending 8m inland.',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    microZoneId: 'kz-1',
    microZoneName: 'Zone A (Coastal Fishing Hamlet)',
    severity: 'HIGH',
    status: 'RECEIVED',
    timestamp: '1 hour ago',
    reporterName: 'V. Sundar',
    reporterPhone: '+91 94440 99812',
    confidenceScore: 91
  }
];

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    id: 'hl-ndrf',
    name: 'National Disaster Response Force (NDRF)',
    number: '1078',
    agency: 'NDRF Control Room',
    available24x7: true,
    category: 'RESCUE',
    description: 'National Level Disaster Operations & Flood Boat Rescue'
  },
  {
    id: 'hl-sdma',
    name: 'State Disaster Emergency Operation Centre (SDMA)',
    number: '1070',
    agency: 'Tamil Nadu SDMA Emergency Desk',
    available24x7: true,
    category: 'RESCUE',
    description: 'State Level Disaster Operations & Relief Coordination'
  },
  {
    id: 'hl-ddma',
    name: 'District Disaster Control Room (DDMA Nagapattinam)',
    number: '1077',
    agency: 'District Collectorate Control Room',
    available24x7: true,
    category: 'RESCUE',
    description: 'District Disaster Officer & Quick Response Team'
  },
  {
    id: 'hl-ambulance',
    name: 'Emergency Medical & Ambulance Service',
    number: '108',
    agency: 'Tamil Nadu 108 Emergency Service',
    available24x7: true,
    category: 'MEDICAL',
    description: 'Free 24x7 Ambulance & Critical Life Support Dispatch'
  },
  {
    id: 'hl-police',
    name: 'Coastal Security Police Emergency',
    number: '1093',
    agency: 'Coastal Security Group Police',
    available24x7: true,
    category: 'POLICE',
    description: 'Marine Coastal Search & Shoreline Evacuation Support'
  },
  {
    id: 'hl-fire',
    name: 'Fire & Rescue Services',
    number: '101',
    agency: 'TN Fire & Rescue Service',
    available24x7: true,
    category: 'FIRE',
    description: 'Structural Rescue, Tree Clearance & Dewatering Pumps'
  },
  {
    id: 'hl-panchayat',
    name: 'Kadalpuram Village Disaster Helpdesk',
    number: '04365-242200',
    agency: 'Kadalpuram Panchayat Council',
    available24x7: true,
    category: 'LOCAL_PANCHAYAT',
    description: 'Village Panchayat President & Community First Responders'
  }
];
