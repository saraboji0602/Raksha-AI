import { SafeSite } from '../types';

export const INITIAL_SAFE_SITES: SafeSite[] = [
  {
    id: 'site-b',
    name: 'Pothigai Resilient Haven (Site B)',
    code: 'SAFE-ZONE-TN-02-B',
    district: 'Nagapattinam Inland Sector',
    state: 'Tamil Nadu',
    latitude: 10.8250,
    longitude: 79.6950,
    landAreaAcres: 145.0,
    currentLandUse: 'Non-agricultural Government Wasteland (Gramanatham classified)',
    elevationMeters: 14.5,
    distanceFromCoastKm: 18.4,
    slopePercentage: 1.8,
    
    status: 'COMMUNITY_CONSULTED',
    landVerificationStatus: 'POTENTIALLY_SUITABLE',
    overallScore: 91,
    hazardSafetyScore: 92,
    landAvailabilityScore: 95,
    connectivityScore: 88,
    waterScore: 84,
    healthcareScore: 86,
    educationScore: 82,
    livelihoodScore: 86,
    administrativeFeasibilityScore: 92,
    climateHorizonYears: 50,
    seaLevelRiseBufferMeters: 14.5,
    dataConfidenceScore: 94,
    
    capacity: {
      physicalLandCapacity: 6200,
      waterSupportedCapacity: 5400,
      infrastructureCapacity: 5100,
      healthcareCapacity: 5500,
      educationCapacity: 5200,
      roadNetworkCapacity: 5800,
      recommendedMaxCapacity: 5000,
      currentOccupancy: 0,
      remainingCapacity: 2350,
      bottleneckResource: 'Infrastructure (Water grid feeder extension required for >5,000)'
    },
    allocatedPopulation: 2650,
    
    communityAcceptance: {
      overallScore: 82,
      distanceScore: 85,
      livelihoodContinuityScore: 86,
      culturalCompatibilityScore: 88,
      schoolHealthcareScore: 84,
      socialNetworkScore: 80,
      livelihoodType: 'COASTAL_FISHING',
      primaryConcerns: [
        'Dedicated 18km bus transit connector to coast for active fishermen',
        'Cold storage depot & net mending yard at site',
        'Panchayat temple replica allotment'
      ]
    },
    
    infrastructureGaps: [
      {
        category: 'HOUSING',
        required: '950 Disaster-resilient 2BHK units (Pucca RC frame)',
        available: '0 (Greenfield site marked)',
        gapStatus: 'CRITICAL_GAP',
        estimatedCostCr: 14.25
      },
      {
        category: 'WATER',
        required: '0.6 MLD pipeline from Cauvery feeder grid',
        available: 'Existing 0.2 MLD local bore well',
        gapStatus: 'MODERATE_GAP',
        estimatedCostCr: 3.2
      },
      {
        category: 'HEALTHCARE',
        required: '1 Upgraded Primary Health Centre with ambulance bay',
        available: 'PHC located 2.8km away on SH-49',
        gapStatus: 'SATISFIED',
        estimatedCostCr: 1.5
      },
      {
        category: 'EDUCATION',
        required: 'Primary + Middle School extension campus',
        available: 'Govt Higher Secondary 1.9km away',
        gapStatus: 'MODERATE_GAP',
        estimatedCostCr: 2.1
      },
      {
        category: 'ROADS',
        required: '2.4km 4-lane link to State Highway SH-49',
        available: '2-lane blacktopped rural road',
        gapStatus: 'MODERATE_GAP',
        estimatedCostCr: 2.8
      },
      {
        category: 'POWER',
        required: '33/11 kV feeder substation line',
        available: '11 kV distribution line along perimeter',
        gapStatus: 'SATISFIED',
        estimatedCostCr: 1.2
      }
    ],
    
    estimatedDevelopmentCostCr: 25.05,
    estimatedDevelopmentTimeMonths: 18,
    
    distanceFromKeySettlementKm: {
      kadalpuram: 18.4,
      'velankanni-east': 21.2,
      tharangambadi: 24.5,
      muthupet: 31.0
    },
    travelTimeMin: {
      kadalpuram: 32,
      'velankanni-east': 36,
      tharangambadi: 42,
      muthupet: 48
    },
    roadQuality: 'PAVED_ALL_WEATHER',
    
    ecologicalSensitivity: 'LOW',
    environmentalClearanceRisk: 'MINIMAL',
    
    description: 'Elevated inland plateau outside all historical flood and cyclone storm surge envelopes. Ample government land with quick highway connectivity.',
    selectionRationale: 'Site B ranks highest for Kadalpuram because it combines superior hazard safety (92/100) with strong community acceptance (82/100) and feasible livelihood transit back to coastal waters.'
  },
  
  {
    id: 'site-a',
    name: 'Coastal High Ridge Sector (Site A)',
    code: 'SAFE-ZONE-TN-01-A',
    district: 'Nagapattinam Coastal Ridge',
    state: 'Tamil Nadu',
    latitude: 10.7410,
    longitude: 79.7920,
    landAreaAcres: 95.0,
    currentLandUse: 'Semi-arid scrubland',
    elevationMeters: 18.2,
    distanceFromCoastKm: 6.2,
    slopePercentage: 3.5,
    
    status: 'FIELD_ASSESSED',
    landVerificationStatus: 'NEEDS_LAND_VERIFICATION',
    overallScore: 79,
    hazardSafetyScore: 94,
    landAvailabilityScore: 78,
    connectivityScore: 91,
    waterScore: 62,
    healthcareScore: 74,
    educationScore: 70,
    livelihoodScore: 52,
    administrativeFeasibilityScore: 75,
    climateHorizonYears: 50,
    seaLevelRiseBufferMeters: 18.2,
    dataConfidenceScore: 78,
    hasUnverifiedLandStatus: true,
    
    capacity: {
      physicalLandCapacity: 3800,
      waterSupportedCapacity: 3200,
      infrastructureCapacity: 3400,
      healthcareCapacity: 3900,
      educationCapacity: 3500,
      roadNetworkCapacity: 4100,
      recommendedMaxCapacity: 3200,
      currentOccupancy: 0,
      remainingCapacity: 3200,
      bottleneckResource: 'Groundwater table depth (deep hard rock)'
    },
    allocatedPopulation: 0,
    
    communityAcceptance: {
      overallScore: 44,
      distanceScore: 92,
      livelihoodContinuityScore: 52,
      culturalCompatibilityScore: 65,
      schoolHealthcareScore: 68,
      socialNetworkScore: 42,
      livelihoodType: 'COASTAL_FISHING',
      primaryConcerns: [
        'Rocky terrain limits community gathering and backyard livestock',
        'High water scarcity reported by neighbouring hamlets',
        'Community perception of isolated scrub location'
      ]
    },
    
    infrastructureGaps: [
      {
        category: 'WATER',
        required: 'Deep intake water reservoir',
        available: 'No local perennial source',
        gapStatus: 'CRITICAL_GAP',
        estimatedCostCr: 4.8,
        hasDataGap: true
      }
    ],
    
    estimatedDevelopmentCostCr: 21.0,
    estimatedDevelopmentTimeMonths: 24,
    
    distanceFromKeySettlementKm: {
      kadalpuram: 7.2,
      'velankanni-east': 8.5
    },
    travelTimeMin: {
      kadalpuram: 14,
      'velankanni-east': 18
    },
    roadQuality: 'PAVED_ALL_WEATHER',
    
    ecologicalSensitivity: 'LOW',
    environmentalClearanceRisk: 'MINIMAL',
    
    description: 'Extremely safe ridge with high elevation (18.2m) close to current settlements, but suffers from severe water scarcity and lower community preference.',
    selectionRationale: 'High technical hazard safety (94/100) is offset by poor community acceptance (44/100) and severe water infrastructure deficits.'
  },
  
  {
    id: 'site-c',
    name: 'Hill-Safe Plateau C (Site C)',
    code: 'SAFE-ZONE-TN-03-C',
    district: 'Nilgiri Stable Foothills Corridor',
    state: 'Tamil Nadu',
    latitude: 11.3650,
    longitude: 76.7820,
    landAreaAcres: 88.0,
    currentLandUse: 'Gentle slope terraced government tea estate border',
    elevationMeters: 890.0,
    distanceFromCoastKm: 140.0,
    slopePercentage: 4.2,
    
    status: 'INFRASTRUCTURE_VALIDATED',
    landVerificationStatus: 'OWNERSHIP_VERIFICATION_REQUIRED',
    overallScore: 80,
    hazardSafetyScore: 96,
    landAvailabilityScore: 82,
    connectivityScore: 61,
    waterScore: 88,
    healthcareScore: 78,
    educationScore: 74,
    livelihoodScore: 74,
    administrativeFeasibilityScore: 84,
    climateHorizonYears: 50,
    seaLevelRiseBufferMeters: 890.0,
    dataConfidenceScore: 91,
    
    capacity: {
      physicalLandCapacity: 2700,
      waterSupportedCapacity: 3100,
      infrastructureCapacity: 2800,
      healthcareCapacity: 2900,
      educationCapacity: 2700,
      roadNetworkCapacity: 2600,
      recommendedMaxCapacity: 2600,
      currentOccupancy: 0,
      remainingCapacity: 460,
      bottleneckResource: 'Road network capacity along foothill link'
    },
    allocatedPopulation: 2140,
    
    communityAcceptance: {
      overallScore: 70,
      distanceScore: 65,
      livelihoodContinuityScore: 74,
      culturalCompatibilityScore: 82,
      schoolHealthcareScore: 76,
      socialNetworkScore: 75,
      livelihoodType: 'AGRICULTURE',
      primaryConcerns: [
        'Allocation of tea/horticulture nursery plots',
        'Bus service to Gudalur town market'
      ]
    },
    
    infrastructureGaps: [
      {
        category: 'HOUSING',
        required: '440 Hill-style prefabricated timber-concrete units',
        available: '0 units',
        gapStatus: 'CRITICAL_GAP',
        estimatedCostCr: 9.8
      }
    ],
    
    estimatedDevelopmentCostCr: 16.4,
    estimatedDevelopmentTimeMonths: 14,
    
    distanceFromKeySettlementKm: {
      malaiyur: 14.8
    },
    travelTimeMin: {
      malaiyur: 28
    },
    roadQuality: 'PAVED_ALL_WEATHER',
    
    ecologicalSensitivity: 'MODERATE',
    environmentalClearanceRisk: 'STANDARD_PERMITS',
    
    description: 'Geologically tested bedrock plateau completely free from shear planes or debris runout zones. Ideal for hillside community relocation.',
    selectionRationale: 'Highest slope safety score (96/100) and zero landslide vulnerability make it the prime relocation candidate for Malaiyur.'
  },
  
  {
    id: 'site-d',
    name: 'Kaveri Inland Agro-Corridor (Site D)',
    code: 'SAFE-ZONE-TN-04-D',
    district: 'Thanjavur-Trichy Elevated Corridor',
    state: 'Tamil Nadu',
    latitude: 10.8420,
    longitude: 78.9510,
    landAreaAcres: 190.0,
    currentLandUse: 'Semi-irrigated state agricultural development zone',
    elevationMeters: 42.0,
    distanceFromCoastKm: 78.0,
    slopePercentage: 1.1,
    
    status: 'APPROVED_FOR_PLANNING',
    landVerificationStatus: 'ADMINISTRATIVE_REVIEW_REQUIRED',
    overallScore: 87,
    hazardSafetyScore: 86,
    landAvailabilityScore: 98,
    connectivityScore: 77,
    waterScore: 94,
    healthcareScore: 82,
    educationScore: 85,
    livelihoodScore: 90,
    administrativeFeasibilityScore: 88,
    climateHorizonYears: 50,
    seaLevelRiseBufferMeters: 42.0,
    dataConfidenceScore: 96,
    
    capacity: {
      physicalLandCapacity: 6100,
      waterSupportedCapacity: 6400,
      infrastructureCapacity: 5800,
      healthcareCapacity: 5900,
      educationCapacity: 6000,
      roadNetworkCapacity: 6200,
      recommendedMaxCapacity: 5800,
      currentOccupancy: 0,
      remainingCapacity: 5800,
      bottleneckResource: 'Healthcare substation expansion'
    },
    allocatedPopulation: 0,
    
    communityAcceptance: {
      overallScore: 91,
      distanceScore: 82,
      livelihoodContinuityScore: 90,
      culturalCompatibilityScore: 95,
      schoolHealthcareScore: 92,
      socialNetworkScore: 92,
      livelihoodType: 'AGRICULTURE',
      primaryConcerns: [
        'Soil fertility suitability for paddy & pulses',
        'Canal irrigation water distribution share'
      ]
    },
    
    infrastructureGaps: [],
    estimatedDevelopmentCostCr: 19.5,
    estimatedDevelopmentTimeMonths: 12,
    
    distanceFromKeySettlementKm: {
      aarupadi: 19.5,
      maruthur: 28.0
    },
    travelTimeMin: {
      aarupadi: 26,
      maruthur: 38
    },
    roadQuality: 'EXCELLENT_HIGHWAY',
    
    ecologicalSensitivity: 'LOW',
    environmentalClearanceRisk: 'MINIMAL',
    
    description: 'High capacity agricultural reserve zone outside flood plains with fertile soil and excellent road connections.',
    selectionRationale: 'Highest community acceptance (91/100) and agrarian livelihood compatibility for delta farming communities.'
  }
];
