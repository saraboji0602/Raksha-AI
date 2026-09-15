import { Settlement } from '../types';

export const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'kadalpuram',
    name: 'Kadalpuram',
    district: 'Nagapattinam Coastal Zone',
    state: 'Tamil Nadu',
    latitude: 10.7654,
    longitude: 79.8428,
    population: 4820,
    households: 912,
    areaSqKm: 8.7,
    dominantHazard: 'coastal_erosion',
    settlementType: 'COASTAL',
    isUrban: false,
    
    overallRisk: 72,
    baselineRisk: 72,
    exposureScore: 88,
    vulnerabilityScore: 84,
    resilienceScore: 48,
    dataConfidence: 93,
    
    priority: 'IMMEDIATE',
    emergencyUrgency: 'IMMEDIATE',
    longTermPriority: 'HIGH',
    priorityScore: 94,
    aiRecommendation: 'PARTIAL_RELOCATION',
    recommendationReason: 'Extreme coastal erosion and compound storm surge risk affect northern micro-zones. 2,650 residents in Zone A require relocation to Site B while central & southern zones can be adapted with in-situ works.',
    status: 'ASSESSMENT',
    humanReviewStatus: 'PENDING_OFFICER_REVIEW',
    
    exposedPopulation: 4210,
    exposedPercentage: 87,
    childrenCount: 620,
    elderlyCount: 410,
    specialAssistanceCount: 185,
    femaleHeadedCount: 160,
    kutchaHouseCount: 510,
    
    relocationPopulation: 2650,
    adaptationPopulation: 1220,
    protectionPopulation: 950,
    recommendedSiteId: 'site-b',

    compoundHazard: {
      type: 'CYCLONE_PLUS_COASTAL_EROSION',
      primaryHazard: 'coastal_erosion',
      secondaryHazard: 'cyclone',
      interactionMultiplier: 1.32,
      explanation: 'Active shoreline scarp retreat reduces natural dune elevation, allowing cyclonic high-tide surge waves to penetrate 600m deeper inland.'
    },

    dataConfidenceRecords: [
      {
        sourceName: 'Synthetic Satellite InSAR Coastal Deformation Grid',
        sourceType: 'SYNTHETIC_SATELLITE',
        timestamp: '2026-09-15 08:30',
        freshnessMinutes: 12,
        confidenceScore: 95,
        status: 'CONFIRMED',
        isDemoSynthetic: true
      },
      {
        sourceName: 'Synthetic Regional Met-Ocean Storm Surge Vector',
        sourceType: 'SYNTHETIC_MET_GRID',
        timestamp: '2026-09-15 09:00',
        freshnessMinutes: 8,
        confidenceScore: 92,
        status: 'CONFIRMED',
        isDemoSynthetic: true
      },
      {
        sourceName: 'Basin Hydrological 5m Digital Elevation Model',
        sourceType: 'DEM_BASIN',
        timestamp: '2026-08-28 14:00',
        freshnessMinutes: 1440,
        confidenceScore: 89,
        status: 'CONFIRMED',
        isDemoSynthetic: true
      },
      {
        sourceName: 'Ground Truth DDMA Field Officer Verification Audit',
        sourceType: 'FIELD_VERIFICATION',
        timestamp: '2026-09-08 11:30',
        freshnessMinutes: 720,
        confidenceScore: 94,
        status: 'CONFIRMED',
        isDemoSynthetic: true
      }
    ],

    whoNeedsAction: [
      {
        id: 'act-kz-01',
        zoneId: 'kz-1',
        zoneName: 'North Fisherman Spit (Zone A)',
        actionType: 'PARTIAL_RELOCATION',
        urgency: 'IMMEDIATE',
        affectedPopulation: 2650,
        affectedHouseholds: 510,
        vulnerableBreakdown: {
          children: 340,
          elderly: 220,
          specialAssistance: 110,
          femaleHeaded: 95
        },
        housingType: 'KUTCHA_THATCHED',
        targetDestinationSiteId: 'site-b',
        targetDestinationName: 'Site B (Pothigai Haven)',
        actionRationale: 'Direct wave attack corridor within 50m of High Tide Line. 3.4m/year scarp regression makes structural protection technically unviable.'
      },
      {
        id: 'act-kz-02',
        zoneId: 'kz-2',
        zoneName: 'Central Panchayat Market (Zone B)',
        actionType: 'ADAPT',
        urgency: 'SHORT_TERM',
        affectedPopulation: 1220,
        affectedHouseholds: 232,
        vulnerableBreakdown: {
          children: 170,
          elderly: 110,
          specialAssistance: 45,
          femaleHeaded: 40
        },
        housingType: 'SEMI_PUCCA',
        actionRationale: 'Elevated 3.5m MSL terrain. In-situ plinth elevation, stormwater sluice gates, and roof anchoring mitigate over 60% of cyclonic surge damage.'
      },
      {
        id: 'act-kz-03',
        zoneId: 'kz-3',
        zoneName: 'Southern Inland Hamlet (Zone C)',
        actionType: 'PROTECT',
        urgency: 'MEDIUM_TERM',
        affectedPopulation: 950,
        affectedHouseholds: 170,
        vulnerableBreakdown: {
          children: 110,
          elderly: 80,
          specialAssistance: 30,
          femaleHeaded: 25
        },
        housingType: 'PUCCA_VULNERABLE',
        actionRationale: 'Naturally buffered behind dense mangrove bio-shield. Tidal bund reinforcement and early warning maintenance provides comprehensive defense.'
      }
    ],
    
    costProtectCr: 12.0,
    costAdaptCr: 19.0,
    costRelocateCr: 28.0,
    costOfInactionCr: 96.0,
    
    evacuationTimeMin: 45,
    primaryEvacRoute: 'SH-49 Northbound Embankment Road',
    secondaryEvacRoute: 'Coastal Canal Causeway Route (Submerged during high tide)',
    evacBottleneck: 'Bridge B-07 (Over-capacity & flood exposure during cyclonic surge)',
    
    lastUpdated: '2026-09-15 09:30 AM',
    fieldVerified: true,
    fieldVerificationNotes: 'Field officer verified active 1.8m coastal scarp erosion and water table salinity in Northern Habitation cluster.',
    verifiedBy: 'Insp. R. Sundaram (DDMA Field Team 4)',
    
    hazards: [
      {
        type: 'coastal_erosion',
        name: 'Coastal Ingress & Erosion',
        score: 96,
        trend: 'INCREASING',
        confidence: 95,
        lastUpdated: '2026-09-05',
        source: 'Synthetic Satellite SAR InSAR + Field Gauge',
        description: 'Shoreline retreat rate measured at 3.4m/year along northern spit.'
      },
      {
        type: 'cyclone',
        name: 'Cyclonic Storm Surge',
        score: 88,
        trend: 'INCREASING',
        confidence: 92,
        lastUpdated: '2026-09-06',
        source: 'Synthetic Met Ocean Grid',
        description: 'Zone within 3m storm surge inundation envelope for Category 4 cyclonic events.'
      },
      {
        type: 'flood',
        name: 'Estuarine Fluvial Flooding',
        score: 82,
        trend: 'STABLE',
        confidence: 89,
        lastUpdated: '2026-08-28',
        source: 'Hydrological Basin DEM 5m',
        description: 'Backwater congestion during simultaneous high tide and river discharge.'
      },
      {
        type: 'heatwave',
        name: 'Humid Heat Stress',
        score: 52,
        trend: 'INCREASING',
        confidence: 85,
        lastUpdated: '2026-08-15',
        source: 'ERA5 Demo Downscaled',
        description: 'Wet-bulb temperatures approaching 31°C during pre-monsoon.'
      },
      {
        type: 'landslide',
        name: 'Slope Instability',
        score: 24,
        trend: 'STABLE',
        confidence: 90,
        lastUpdated: '2026-07-20',
        source: 'GSI Slope Angle Data',
        description: 'Flat coastal alluvial topography; negligible landslide hazard.'
      }
    ],
    
    microZones: [
      {
        id: 'kz-1',
        name: 'North Fisherman Spit (Zone A)',
        zoneCode: 'MZ-01-NORTH',
        population: 2650,
        households: 510,
        riskScore: 96,
        riskLevel: 'CRITICAL',
        primaryHazard: 'coastal_erosion',
        recommendation: 'PARTIAL_RELOCATION',
        reason: 'Direct wave attack line, high vulnerability kutcha houses, within 50m of high tide line.',
        coordinates: [
          [10.772, 79.840],
          [10.775, 79.845],
          [10.768, 79.848],
          [10.765, 79.842]
        ],
        vulnerablePeopleCount: 670,
        kutchaHousesCount: 510,
        distanceToCoastlineMeters: 45
      },
      {
        id: 'kz-2',
        name: 'Central Panchayat Market (Zone B)',
        zoneCode: 'MZ-02-CENTRAL',
        population: 1220,
        households: 232,
        riskScore: 78,
        riskLevel: 'HIGH',
        primaryHazard: 'cyclone',
        recommendation: 'ADAPT',
        reason: 'Elevated terrain (3.5m above MSL); storm proofing of roofs and drainage channels provides viable defense.',
        coordinates: [
          [10.765, 79.838],
          [10.768, 79.842],
          [10.762, 79.844],
          [10.760, 79.839]
        ],
        vulnerablePeopleCount: 325,
        kutchaHousesCount: 140,
        distanceToCoastlineMeters: 380
      },
      {
        id: 'kz-3',
        name: 'Southern Inland Hamlet (Zone C)',
        zoneCode: 'MZ-03-SOUTH',
        population: 950,
        households: 170,
        riskScore: 58,
        riskLevel: 'MODERATE',
        primaryHazard: 'flood',
        recommendation: 'PROTECT',
        reason: 'Sheltered behind mangrove belt; tidal bund restoration and sluice gate upgrade ensures safety.',
        coordinates: [
          [10.758, 79.835],
          [10.761, 79.839],
          [10.755, 79.841],
          [10.752, 79.837]
        ],
        vulnerablePeopleCount: 220,
        kutchaHousesCount: 45,
        distanceToCoastlineMeters: 850
      }
    ],
    
    infrastructure: {
      schools: { count: 3, exposed: 2, nearestKm: 0.4 },
      healthcare: { count: 1, exposed: 1, nearestKm: 1.2, facilityType: 'Primary Health Sub-centre' },
      waterSupply: { score: 38, reliability: 'LOW', nearestKm: 2.1, sourceNote: 'Local groundwater saline intrusion observed' },
      roads: { accessScore: 42, primaryRouteBlocked: false, bottleneckNotes: 'Bridge B-07 flood prone; single lane exit road R-12', nearestHighwayKm: 6.4 },
      emergencyShelters: { count: 1, capacity: 450, nearestKm: 0.9 },
      powerReliability: 54,
      telecomCoverage: 76
    },
    
    historicalEvents: [
      {
        year: 2018,
        title: 'Severe Cyclonic Storm Gaja Impact',
        type: 'cyclone',
        severity: 'Very Severe',
        impactDesc: 'Damaged 420 thatched roofs, 3km shoreline breach, saltwater intrusion into 8 village wells.',
        fatalities: 2,
        displacedCount: 1800,
        damageEstCr: 8.4
      },
      {
        year: 2020,
        title: 'Monsoon Tidal Wave Ingress',
        type: 'coastal_erosion',
        severity: 'High',
        impactDesc: 'Permanent loss of 28 meters of beachfront land and 12 frontline fishing huts.',
        fatalities: 0,
        displacedCount: 450,
        damageEstCr: 3.2
      },
      {
        year: 2022,
        title: 'Cyclone Mandous Surge Surge',
        type: 'cyclone',
        severity: 'Moderate',
        impactDesc: 'Flooded primary school and cut off bridge B-07 for 36 hours.',
        fatalities: 0,
        displacedCount: 890,
        damageEstCr: 4.1
      },
      {
        year: 2024,
        title: 'Extreme Flash Flood & Backwater Congestion',
        type: 'flood',
        severity: 'High',
        impactDesc: 'Waterlogged Zone A for 5 days; emergency drinking water dropped via boats.',
        fatalities: 1,
        displacedCount: 1400,
        damageEstCr: 5.6
      },
      {
        year: 2026,
        title: 'Pre-Monsoon Red-Zone Assessment',
        type: 'multi_hazard',
        severity: 'Critical Assessment',
        impactDesc: 'AI decision engine flagged urgent intervention required before upcoming cyclonic season.',
        fatalities: 0,
        displacedCount: 0,
        damageEstCr: 0
      }
    ],
    
    explainableFactors: [
      {
        factor: 'Coastal Erosion Line Retreat Rate',
        contribution: 24,
        category: 'HAZARD',
        description: 'Zone A scarp within 50m of active wave front with 3.4m/yr coastal retreat.',
        isCritical: true,
        dataSource: 'Synthetic Satellite InSAR + Gauge telemetry',
        confidencePct: 95
      },
      {
        factor: 'High Density Population in Inundation Envelope',
        contribution: 19,
        category: 'EXPOSURE',
        description: '2,650 residents reside below 2.0m contour line with high exposure risk.',
        isCritical: true,
        dataSource: 'Synthetic Census Demographic Survey',
        confidencePct: 94
      },
      {
        factor: 'Repeated Historical Cyclone & Surge Flooding',
        contribution: 17,
        category: 'HAZARD',
        description: '4 major flooding & surge events in past 8 years causing cumulative damage.',
        isCritical: true,
        dataSource: 'State Disaster Archive Logs',
        confidencePct: 98
      },
      {
        factor: 'Evacuation Route Fragility (Bridge B-07)',
        contribution: 13,
        category: 'RESILIENCE',
        description: 'Single outbound bridge B-07 submerses at +1.2m surge, trapping northern sector.',
        isCritical: false,
        dataSource: 'PWD Road Infrastructure Survey',
        confidencePct: 91
      },
      {
        factor: 'Sub-centre Health Facility in Red Zone',
        contribution: 9,
        category: 'VULNERABILITY',
        description: 'Sole PHC sub-centre is inside tidal surge zone, crippling first response.',
        isCritical: false,
        dataSource: 'District Health Registry',
        confidencePct: 88
      },
      {
        factor: 'Housing Fragility (Kutcha / Semi-Pucca %)',
        contribution: 8,
        category: 'VULNERABILITY',
        description: '64% structures have tin/thatch roofs prone to high wind shearing.',
        isCritical: false,
        dataSource: 'Field Verification Audit (Verified)',
        confidencePct: 95
      }
    ]
  },
  
  {
    id: 'malaiyur',
    name: 'Malaiyur',
    district: 'Nilgiri Hills Demonstration District',
    state: 'Tamil Nadu',
    latitude: 11.4102,
    longitude: 76.6950,
    population: 2140,
    households: 440,
    areaSqKm: 5.2,
    dominantHazard: 'landslide',
    settlementType: 'HILL_SLOPE',
    isUrban: false,
    
    overallRisk: 94,
    exposureScore: 92,
    vulnerabilityScore: 89,
    resilienceScore: 36,
    dataConfidence: 91,
    
    priority: 'IMMEDIATE',
    priorityScore: 96,
    aiRecommendation: 'FULL_RELOCATION',
    recommendationReason: 'Deep-seated active slope shear cracks detected above upper settlement toe. Soil saturation index exceeds critical shear threshold. High risk of catastrophic debris flow. Complete relocation to Hill-Safe Site C strongly recommended.',
    status: 'PLANNING',
    
    exposedPopulation: 1980,
    exposedPercentage: 92,
    childrenCount: 290,
    elderlyCount: 220,
    specialAssistanceCount: 75,
    
    relocationPopulation: 2140,
    adaptationPopulation: 0,
    protectionPopulation: 0,
    recommendedSiteId: 'site-c',
    
    costProtectCr: 38.0,
    costAdaptCr: 29.0,
    costRelocateCr: 21.5,
    costOfInactionCr: 84.0,
    
    evacuationTimeMin: 65,
    primaryEvacRoute: 'Ghat Road SH-181 (Prone to rockfall)',
    secondaryEvacRoute: 'Tea Plantation Ridge Trail (Footpath only)',
    evacBottleneck: 'Hairpin Bend 14 (Active slope slip cut off)',
    
    lastUpdated: '2026-09-07 04:15 PM',
    fieldVerified: true,
    fieldVerificationNotes: 'Geological survey verified 45mm crown tension crack expansion after continuous rain.',
    verifiedBy: 'Sr. Geologist Dr. K. Raman (SDMA Hill Taskforce)',
    
    hazards: [
      {
        type: 'landslide',
        name: 'Slope Debris Flow & Slip',
        score: 98,
        trend: 'INCREASING',
        confidence: 96,
        lastUpdated: '2026-09-06',
        source: 'Synthetic Geological InSAR & Piezometer',
        description: 'Slope gradient 38 degrees with weathered gneiss overburden on slip plane.'
      },
      {
        type: 'flood',
        name: 'Flash Torrential Ravine Runoff',
        score: 72,
        trend: 'INCREASING',
        confidence: 88,
        lastUpdated: '2026-09-02',
        source: 'Synthetic Basin Hydrograph',
        description: 'High velocity sediment laden torrents during cloudburst events.'
      },
      {
        type: 'cyclone',
        name: 'High Wind Velocity Shear',
        score: 45,
        trend: 'STABLE',
        confidence: 82,
        lastUpdated: '2026-08-10',
        source: 'Synthetic IMD Hill Station',
        description: 'Gale force winds during southwest monsoon transitions.'
      }
    ],
    
    microZones: [
      {
        id: 'mz-1',
        name: 'Upper Slope Habitation',
        zoneCode: 'ML-01-UPPER',
        population: 1350,
        households: 275,
        riskScore: 98,
        riskLevel: 'CRITICAL',
        primaryHazard: 'landslide',
        recommendation: 'FULL_RELOCATION',
        reason: 'Directly in the runout path of crown shear plane.',
        coordinates: [[11.412, 76.692], [11.415, 76.696], [11.410, 76.698], [11.408, 76.693]]
      },
      {
        id: 'mz-2',
        name: 'Lower Valley Settlement',
        zoneCode: 'ML-02-LOWER',
        population: 790,
        households: 165,
        riskScore: 91,
        riskLevel: 'CRITICAL',
        primaryHazard: 'landslide',
        recommendation: 'FULL_RELOCATION',
        reason: 'High debris damming & flood accumulation risk at ravine outlet.',
        coordinates: [[11.407, 76.690], [11.409, 76.694], [11.404, 76.696], [11.402, 76.691]]
      }
    ],
    
    infrastructure: {
      schools: { count: 1, exposed: 1, nearestKm: 0.2 },
      healthcare: { count: 0, exposed: 0, nearestKm: 9.4, facilityType: 'Nil (9.4km to Taluk Hospital)' },
      waterSupply: { score: 45, reliability: 'MEDIUM', nearestKm: 0.8 },
      roads: { accessScore: 28, primaryRouteBlocked: true, bottleneckNotes: 'Single ghat road blocked during heavy rain slips', nearestHighwayKm: 14.2 },
      emergencyShelters: { count: 0, capacity: 0, nearestKm: 7.5 },
      powerReliability: 35,
      telecomCoverage: 48
    },
    
    historicalEvents: [
      {
        year: 2019,
        title: 'Nilgiri Landslip Avalanche',
        type: 'landslide',
        severity: 'High',
        impactDesc: 'Destroyed 14 hillside homes, road blocked for 11 days, airlift required.',
        fatalities: 4,
        displacedCount: 650,
        damageEstCr: 12.0
      },
      {
        year: 2024,
        title: 'Upper Slope Tension Crack Activation',
        type: 'landslide',
        severity: 'Critical Alert',
        impactDesc: 'Tension crack opened 600m across tea slope above village.',
        fatalities: 0,
        displacedCount: 300,
        damageEstCr: 2.1
      }
    ],
    
    explainableFactors: [
      {
        factor: 'Active Slope Shear Tension Cracks (>45mm)',
        contribution: 32,
        category: 'HAZARD',
        description: 'Tension fissures actively widening across crown zone above habitations.',
        isCritical: true
      },
      {
        factor: 'Steep Slope Angle (38° gradient)',
        contribution: 25,
        category: 'TERRAIN',
        description: 'Unstable overburden sitting on slick bedrock plane.',
        isCritical: true
      },
      {
        factor: 'Zero Local Emergency Shelter & Remote Health Access (9.4km)',
        contribution: 20,
        category: 'RESILIENCE',
        description: 'Medical evacuation requires 9.4km traverse on slip-prone single lane road.',
        isCritical: true
      },
      {
        factor: 'Single Ingress/Egress Route Vulnerability',
        contribution: 17,
        category: 'INFRASTRUCTURE',
        description: 'Road blockages isolate village entirely during monsoon downpours.',
        isCritical: false
      }
    ]
  },
  
  {
    id: 'aarupadi',
    name: 'Aarupadi',
    district: 'Thanjavur Delta Demo District',
    state: 'Tamil Nadu',
    latitude: 10.7870,
    longitude: 79.1378,
    population: 3620,
    households: 780,
    areaSqKm: 9.4,
    dominantHazard: 'flood',
    settlementType: 'RIVER_BASIN',
    isUrban: false,
    
    overallRisk: 78,
    exposureScore: 84,
    vulnerabilityScore: 68,
    resilienceScore: 61,
    dataConfidence: 89,
    
    priority: 'SHORT_TERM',
    priorityScore: 76,
    aiRecommendation: 'ADAPT',
    recommendationReason: 'Extensive seasonal riverine flooding occurs, but engineering adaptation (elevated ring bunds, desilted irrigation drains, and stilt community centers) can mitigate 74% of residual risk without disrupting agricultural livelihoods.',
    status: 'CONSULTATION',
    
    exposedPopulation: 2950,
    exposedPercentage: 81,
    childrenCount: 480,
    elderlyCount: 330,
    specialAssistanceCount: 95,
    
    relocationPopulation: 0,
    adaptationPopulation: 3620,
    protectionPopulation: 0,
    recommendedSiteId: 'site-d',
    
    costProtectCr: 8.5,
    costAdaptCr: 14.2,
    costRelocateCr: 32.0,
    costOfInactionCr: 58.0,
    
    evacuationTimeMin: 30,
    primaryEvacRoute: 'Delta Highway MDR-204',
    secondaryEvacRoute: 'Canal Bank Paved Track',
    evacBottleneck: 'Causeway C-11 (Floods at 1.0m discharge)',
    
    lastUpdated: '2026-09-08 09:00 AM',
    fieldVerified: true,
    fieldVerificationNotes: 'Panchayat consensus strongly favors ring bund embankment and raised platform livestock shelters over relocation.',
    verifiedBy: 'Planning Officer M. Revathi',
    
    hazards: [
      {
        type: 'flood',
        name: 'Riverine Overflow & Waterlogging',
        score: 89,
        trend: 'INCREASING',
        confidence: 94,
        lastUpdated: '2026-09-04',
        source: 'CWC Gauge Synthetic Sync',
        description: 'Vennar tributary overflow during simultaneous dam discharge and monsoon peak.'
      },
      {
        type: 'cyclone',
        name: 'Depression Rainfall',
        score: 64,
        trend: 'STABLE',
        confidence: 86,
        lastUpdated: '2026-08-25',
        source: 'Synthetic IMD Grid',
        description: 'Heavy rainfall events causing localized agricultural drainage backflow.'
      }
    ],
    
    microZones: [
      {
        id: 'ap-1',
        name: 'Riverbank Cluster',
        zoneCode: 'AP-01-BANK',
        population: 1800,
        households: 390,
        riskScore: 82,
        riskLevel: 'HIGH',
        primaryHazard: 'flood',
        recommendation: 'ADAPT',
        reason: 'Raise plinth levels and construct 2.4km reinforced embankment bund.',
        coordinates: [[10.785, 79.135], [10.789, 79.140], [10.784, 79.142], [10.781, 79.137]]
      },
      {
        id: 'ap-2',
        name: 'Agri Hamlet Central',
        zoneCode: 'AP-02-AGRI',
        population: 1820,
        households: 390,
        riskScore: 68,
        riskLevel: 'MODERATE',
        primaryHazard: 'flood',
        recommendation: 'ADAPT',
        reason: 'Install high-capacity drainage sluices to rapidly evacuate water into drainage canals.',
        coordinates: [[10.780, 79.134], [10.783, 79.138], [10.778, 79.141], [10.776, 79.136]]
      }
    ],
    
    infrastructure: {
      schools: { count: 2, exposed: 1, nearestKm: 0.6 },
      healthcare: { count: 1, exposed: 0, nearestKm: 2.4, facilityType: 'Rural Dispensary' },
      waterSupply: { score: 72, reliability: 'HIGH', nearestKm: 0.4 },
      roads: { accessScore: 68, primaryRouteBlocked: false, bottleneckNotes: 'Culvert on MDR-204 needs widening', nearestHighwayKm: 3.2 },
      emergencyShelters: { count: 2, capacity: 900, nearestKm: 0.5 },
      powerReliability: 74,
      telecomCoverage: 88
    },
    
    historicalEvents: [
      {
        year: 2021,
        title: 'Northeast Monsoon Flood Inundation',
        type: 'flood',
        severity: 'Moderate',
        impactDesc: 'Paddy fields inundated for 9 days; homes spared due to localized sandbagging.',
        fatalities: 0,
        displacedCount: 420,
        damageEstCr: 4.5
      }
    ],
    
    explainableFactors: [
      {
        factor: 'Seasonal Riverine Flood Plain Exposure',
        contribution: 30,
        category: 'HAZARD',
        description: 'Settlement sits on low flat delta basin adjacent to Vennar distributor.',
        isCritical: true
      },
      {
        factor: 'High Livelihood Ties to Surrounding Paddy Fields',
        contribution: 22,
        category: 'VULNERABILITY',
        description: '92% of households rely on adjacent farm land; relocation causes severe livelihood collapse.',
        isCritical: true
      },
      {
        factor: 'High Adaptation Feasibility (Ring Bund & Sluice)',
        contribution: 18,
        category: 'RESILIENCE',
        description: 'Topographical modeling shows +1.8m ring bund completely shields central habitations.',
        isCritical: false
      }
    ]
  },
  
  {
    id: 'maruthur',
    name: 'Maruthur',
    district: 'Tiruchirappalli Demo District',
    state: 'Tamil Nadu',
    latitude: 10.8240,
    longitude: 78.6856,
    population: 1920,
    households: 410,
    areaSqKm: 6.8,
    dominantHazard: 'flood',
    settlementType: 'RIVER_BASIN',
    isUrban: false,
    
    overallRisk: 54,
    exposureScore: 58,
    vulnerabilityScore: 48,
    resilienceScore: 78,
    dataConfidence: 94,
    
    priority: 'MONITOR',
    priorityScore: 46,
    aiRecommendation: 'PROTECT',
    recommendationReason: 'Moderate hazard exposure with high local resilience, pucca housing (78%), active flood early warning systems, and redundant road access. In-situ protection and maintenance of existing drainage bunds is optimal.',
    status: 'ASSESSMENT',
    
    exposedPopulation: 850,
    exposedPercentage: 44,
    childrenCount: 220,
    elderlyCount: 160,
    specialAssistanceCount: 40,
    
    relocationPopulation: 0,
    adaptationPopulation: 0,
    protectionPopulation: 1920,
    recommendedSiteId: 'site-d',
    
    costProtectCr: 3.2,
    costAdaptCr: 7.0,
    costRelocateCr: 18.0,
    costOfInactionCr: 14.0,
    
    evacuationTimeMin: 18,
    primaryEvacRoute: 'NH-83 Elevated Highway link',
    secondaryEvacRoute: 'East Panchayat Paved Arterial',
    evacBottleneck: 'None reported; dual wide exits',
    
    lastUpdated: '2026-09-08 08:30 AM',
    fieldVerified: true,
    fieldVerificationNotes: 'Drainage channels recently desilted under MGNREGS; community volunteer disaster squad active.',
    verifiedBy: 'Block Development Officer S. Prakash',
    
    hazards: [
      {
        type: 'flood',
        name: 'Flash Minor Overflow',
        score: 56,
        trend: 'DECREASING',
        confidence: 94,
        lastUpdated: '2026-09-01',
        source: 'District Irrigation Log',
        description: 'Treated drainage canals successfully divert peak monsoon discharge.'
      }
    ],
    
    microZones: [
      {
        id: 'mr-1',
        name: 'Main Village Settlement',
        zoneCode: 'MR-01-MAIN',
        population: 1920,
        households: 410,
        riskScore: 54,
        riskLevel: 'MODERATE',
        primaryHazard: 'flood',
        recommendation: 'PROTECT',
        reason: 'Reinforce minor embankment and maintain early warning telemetry.',
        coordinates: [[10.822, 78.683], [10.826, 78.688], [10.821, 78.690], [10.819, 78.685]]
      }
    ],
    
    infrastructure: {
      schools: { count: 2, exposed: 0, nearestKm: 0.3 },
      healthcare: { count: 1, exposed: 0, nearestKm: 0.8, facilityType: 'Primary Health Centre' },
      waterSupply: { score: 88, reliability: 'HIGH', nearestKm: 0.2 },
      roads: { accessScore: 88, primaryRouteBlocked: false, bottleneckNotes: 'All weather asphalt roads', nearestHighwayKm: 0.9 },
      emergencyShelters: { count: 2, capacity: 1100, nearestKm: 0.4 },
      powerReliability: 91,
      telecomCoverage: 96
    },
    
    historicalEvents: [
      {
        year: 2020,
        title: 'Cauvery High Discharge Inundation',
        type: 'flood',
        severity: 'Low',
        impactDesc: 'Lowland farmland flooded for 2 days; residential habitations completely secure.',
        fatalities: 0,
        displacedCount: 0,
        damageEstCr: 0.6
      }
    ],
    
    explainableFactors: [
      {
        factor: 'High Local Resilience & Infrastructure Access',
        contribution: -22,
        category: 'RESILIENCE',
        description: 'High PHC access, redundant elevated highways, and strong shelter capacity.',
        isCritical: false
      },
      {
        factor: 'Pucca Concrete Housing Dominance (78%)',
        contribution: -15,
        category: 'VULNERABILITY',
        description: 'Structural integrity shields against extreme monsoonal downpours.',
        isCritical: false
      }
    ]
  },
  
  {
    id: 'velankanni-east',
    name: 'Velankanni East Spit',
    district: 'Nagapattinam Coastal Zone',
    state: 'Tamil Nadu',
    latitude: 10.6820,
    longitude: 79.8510,
    population: 3120,
    households: 620,
    areaSqKm: 4.8,
    dominantHazard: 'cyclone',
    settlementType: 'COASTAL',
    isUrban: false,
    
    overallRisk: 88,
    exposureScore: 86,
    vulnerabilityScore: 82,
    resilienceScore: 50,
    dataConfidence: 90,
    
    priority: 'IMMEDIATE',
    priorityScore: 89,
    aiRecommendation: 'PARTIAL_RELOCATION',
    recommendationReason: 'Direct open ocean exposure to storm surge and tidal breach during cyclonic tracks.',
    status: 'ASSESSMENT',
    
    exposedPopulation: 2680,
    exposedPercentage: 86,
    childrenCount: 390,
    elderlyCount: 280,
    specialAssistanceCount: 110,
    
    relocationPopulation: 1800,
    adaptationPopulation: 880,
    protectionPopulation: 440,
    recommendedSiteId: 'site-b',
    
    costProtectCr: 10.5,
    costAdaptCr: 16.0,
    costRelocateCr: 24.5,
    costOfInactionCr: 78.0,
    
    evacuationTimeMin: 40,
    primaryEvacRoute: 'SH-67 Coastal Corridor',
    secondaryEvacRoute: 'Saltpan Track',
    evacBottleneck: 'Causeway across Vellayar estuary',
    
    lastUpdated: '2026-09-08 10:15 AM',
    fieldVerified: true,
    
    hazards: [
      { type: 'cyclone', name: 'Cyclone Storm Surge', score: 91, trend: 'INCREASING', confidence: 92, lastUpdated: '2026-09-06', source: 'IMD Coastal', description: 'Surge height 3.2m envelope' },
      { type: 'coastal_erosion', name: 'Beachfront Ingress', score: 85, trend: 'INCREASING', confidence: 88, lastUpdated: '2026-09-01', source: 'Satellite SAR', description: 'Sand bar erosion' }
    ],
    microZones: [],
    infrastructure: {
      schools: { count: 2, exposed: 1, nearestKm: 0.5 },
      healthcare: { count: 1, exposed: 1, nearestKm: 1.8, facilityType: 'Sub-centre' },
      waterSupply: { score: 42, reliability: 'LOW', nearestKm: 1.5 },
      roads: { accessScore: 50, primaryRouteBlocked: false, bottleneckNotes: 'Low bridge', nearestHighwayKm: 4.5 },
      emergencyShelters: { count: 1, capacity: 500, nearestKm: 0.8 },
      powerReliability: 60,
      telecomCoverage: 78
    },
    historicalEvents: [],
    explainableFactors: [
      { factor: 'Storm Surge Vulnerability', contribution: 26, category: 'HAZARD', description: 'Frontline low-lying coastal spit', isCritical: true }
    ]
  },
  
  {
    id: 'muthupet',
    name: 'Muthupet Mangrove Edge',
    district: 'Tiruvarur Demo District',
    state: 'Tamil Nadu',
    latitude: 10.4020,
    longitude: 79.5100,
    population: 2840,
    households: 560,
    areaSqKm: 7.1,
    dominantHazard: 'flood',
    settlementType: 'DELTA',
    isUrban: false,
    
    overallRisk: 82,
    exposureScore: 80,
    vulnerabilityScore: 76,
    resilienceScore: 54,
    dataConfidence: 88,
    
    priority: 'SHORT_TERM',
    priorityScore: 81,
    aiRecommendation: 'PARTIAL_RELOCATION',
    recommendationReason: 'Lagoon edge backwater flooding and salinity intrusion threatens northern fishing hamlets.',
    status: 'ASSESSMENT',
    
    exposedPopulation: 2200,
    exposedPercentage: 77,
    childrenCount: 340,
    elderlyCount: 250,
    specialAssistanceCount: 80,
    
    relocationPopulation: 1450,
    adaptationPopulation: 950,
    protectionPopulation: 440,
    recommendedSiteId: 'site-b',
    
    costProtectCr: 9.0,
    costAdaptCr: 14.5,
    costRelocateCr: 21.0,
    costOfInactionCr: 64.0,
    
    evacuationTimeMin: 35,
    primaryEvacRoute: 'Muthupet-Mannargudi Road',
    secondaryEvacRoute: 'Lagoon Embankment Road',
    evacBottleneck: 'Lagoon culvert bridge',
    
    lastUpdated: '2026-09-07 02:20 PM',
    fieldVerified: false,
    
    hazards: [
      { type: 'flood', name: 'Lagoon Inundation', score: 86, trend: 'INCREASING', confidence: 89, lastUpdated: '2026-09-02', source: 'Hydro Model', description: 'Tidal backflow' }
    ],
    microZones: [],
    infrastructure: {
      schools: { count: 1, exposed: 1, nearestKm: 0.7 },
      healthcare: { count: 1, exposed: 0, nearestKm: 3.1, facilityType: 'Dispensary' },
      waterSupply: { score: 48, reliability: 'MEDIUM', nearestKm: 1.2 },
      roads: { accessScore: 52, primaryRouteBlocked: false, bottleneckNotes: 'Culvert prone to overflow', nearestHighwayKm: 5.0 },
      emergencyShelters: { count: 1, capacity: 400, nearestKm: 1.0 },
      powerReliability: 65,
      telecomCoverage: 80
    },
    historicalEvents: [],
    explainableFactors: []
  },
  
  {
    id: 'pamban-sector4',
    name: 'Pamban Island Sector 4',
    district: 'Ramanathapuram Demo District',
    state: 'Tamil Nadu',
    latitude: 9.2810,
    longitude: 79.2150,
    population: 2950,
    households: 590,
    areaSqKm: 3.9,
    dominantHazard: 'cyclone',
    settlementType: 'COASTAL',
    isUrban: false,
    
    overallRisk: 93,
    exposureScore: 94,
    vulnerabilityScore: 88,
    resilienceScore: 42,
    dataConfidence: 92,
    
    priority: 'IMMEDIATE',
    priorityScore: 95,
    aiRecommendation: 'PARTIAL_RELOCATION',
    recommendationReason: 'Narrow island spit exposed to dual Gulf of Mannar and Palk Bay cyclonic swells.',
    status: 'PLANNING',
    
    exposedPopulation: 2750,
    exposedPercentage: 93,
    childrenCount: 410,
    elderlyCount: 310,
    specialAssistanceCount: 130,
    
    relocationPopulation: 2200,
    adaptationPopulation: 500,
    protectionPopulation: 250,
    recommendedSiteId: 'site-b',
    
    costProtectCr: 14.0,
    costAdaptCr: 21.0,
    costRelocateCr: 31.0,
    costOfInactionCr: 110.0,
    
    evacuationTimeMin: 55,
    primaryEvacRoute: 'Pamban Bridge Roadway',
    secondaryEvacRoute: 'None (Island isolation risk)',
    evacBottleneck: 'Pamban Bridge closure in >70km/h winds',
    
    lastUpdated: '2026-09-08 12:00 PM',
    fieldVerified: true,
    
    hazards: [
      { type: 'cyclone', name: 'Cyclonic Storm & Wave Surge', score: 95, trend: 'INCREASING', confidence: 94, lastUpdated: '2026-09-06', source: 'IMD Radar', description: 'Exposed to dual bay wave fronts' }
    ],
    microZones: [],
    infrastructure: {
      schools: { count: 2, exposed: 2, nearestKm: 0.4 },
      healthcare: { count: 1, exposed: 1, nearestKm: 2.0, facilityType: 'PHC Subcentre' },
      waterSupply: { score: 32, reliability: 'LOW', nearestKm: 3.0 },
      roads: { accessScore: 35, primaryRouteBlocked: false, bottleneckNotes: 'Sea bridge shutdown threshold', nearestHighwayKm: 0.5 },
      emergencyShelters: { count: 1, capacity: 600, nearestKm: 0.6 },
      powerReliability: 45,
      telecomCoverage: 70
    },
    historicalEvents: [],
    explainableFactors: []
  },
  
  {
    id: 'tharangambadi',
    name: 'Tharangambadi Historic Shore',
    district: 'Mayiladuthurai Demo District',
    state: 'Tamil Nadu',
    latitude: 11.0280,
    longitude: 79.8540,
    population: 3400,
    households: 710,
    areaSqKm: 5.8,
    dominantHazard: 'coastal_erosion',
    settlementType: 'COASTAL',
    isUrban: true,
    
    overallRisk: 79,
    exposureScore: 81,
    vulnerabilityScore: 72,
    resilienceScore: 65,
    dataConfidence: 91,
    
    priority: 'SHORT_TERM',
    priorityScore: 78,
    aiRecommendation: 'ADAPT',
    recommendationReason: 'Submerged geotube breakwaters and heritage revetment walls provide 68% risk reduction with minimal relocation.',
    status: 'ASSESSMENT',
    
    exposedPopulation: 2400,
    exposedPercentage: 70,
    childrenCount: 380,
    elderlyCount: 290,
    specialAssistanceCount: 70,
    
    relocationPopulation: 650,
    adaptationPopulation: 2150,
    protectionPopulation: 600,
    recommendedSiteId: 'site-b',
    
    costProtectCr: 9.5,
    costAdaptCr: 15.8,
    costRelocateCr: 26.0,
    costOfInactionCr: 62.0,
    
    evacuationTimeMin: 25,
    primaryEvacRoute: 'SH-22 Inbound Highway',
    secondaryEvacRoute: 'Fort Ring Road',
    evacBottleneck: 'Old Town narrow archway',
    
    lastUpdated: '2026-09-08 07:45 AM',
    fieldVerified: true,
    
    hazards: [
      { type: 'coastal_erosion', name: 'Coastal Scarp Retreat', score: 84, trend: 'STABLE', confidence: 91, lastUpdated: '2026-09-03', source: 'Coastal Survey', description: 'High tidal action against historical seawall' }
    ],
    microZones: [],
    infrastructure: {
      schools: { count: 3, exposed: 1, nearestKm: 0.4 },
      healthcare: { count: 2, exposed: 0, nearestKm: 1.0, facilityType: 'Community Health Centre' },
      waterSupply: { score: 65, reliability: 'MEDIUM', nearestKm: 0.8 },
      roads: { accessScore: 72, primaryRouteBlocked: false, bottleneckNotes: 'Heritage street width', nearestHighwayKm: 2.1 },
      emergencyShelters: { count: 2, capacity: 850, nearestKm: 0.5 },
      powerReliability: 75,
      telecomCoverage: 88
    },
    historicalEvents: [],
    explainableFactors: []
  }
];
