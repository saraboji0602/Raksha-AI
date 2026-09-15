import { 
  Settlement, 
  InterventionType, 
  PriorityLevel, 
  SystemScoringWeights, 
  ExplainableFactor, 
  CompoundHazardInteraction 
} from '../types';

export const DEFAULT_SCORING_WEIGHTS: SystemScoringWeights = {
  hazardWeight: 30,
  exposureWeight: 20,
  vulnerabilityWeight: 20,
  infrastructureWeight: 10,
  historicalWeight: 10,
  resilienceWeight: 10
};

export class RiskEngineService {
  /**
   * Evaluates compound multi-hazard interactions
   */
  static evaluateCompoundHazards(settlement: Settlement): CompoundHazardInteraction {
    const hazards = settlement.hazards || [];
    const floodHazard = hazards.find(h => h.type === 'flood');
    const cycloneHazard = hazards.find(h => h.type === 'cyclone');
    const erosionHazard = hazards.find(h => h.type === 'coastal_erosion');
    const landslideHazard = hazards.find(h => h.type === 'landslide');

    if (floodHazard && floodHazard.score >= 70 && cycloneHazard && cycloneHazard.score >= 70) {
      return {
        type: 'FLOOD_PLUS_CYCLONE',
        primaryHazard: 'cyclone',
        secondaryHazard: 'flood',
        interactionMultiplier: 1.28,
        explanation: 'Fluvial river discharge coupled with cyclonic storm surge prevents gravitational drainage, causing backwater estuarine inundation.'
      };
    }

    if (erosionHazard && erosionHazard.score >= 75 && cycloneHazard && cycloneHazard.score >= 70) {
      return {
        type: 'CYCLONE_PLUS_COASTAL_EROSION',
        primaryHazard: 'coastal_erosion',
        secondaryHazard: 'cyclone',
        interactionMultiplier: 1.32,
        explanation: 'Active shoreline scarp retreat reduces natural dune elevation, allowing cyclonic high-tide surge waves to penetrate 600m deeper inland.'
      };
    }

    if (floodHazard && floodHazard.score >= 70 && erosionHazard && erosionHazard.score >= 70) {
      return {
        type: 'FLOOD_PLUS_COASTAL_EROSION',
        primaryHazard: 'coastal_erosion',
        secondaryHazard: 'flood',
        interactionMultiplier: 1.22,
        explanation: 'Simultaneous coastal spit regression and estuarine river swelling cuts off north-south escape causeways.'
      };
    }

    if (landslideHazard && landslideHazard.score >= 75 && floodHazard && floodHazard.score >= 60) {
      return {
        type: 'LANDSLIDE_PLUS_HEAVY_RAIN',
        primaryHazard: 'landslide',
        secondaryHazard: 'flood',
        interactionMultiplier: 1.35,
        explanation: 'Pore-water saturation from heavy antecedent rainfall triggers slope liquefaction along critical crown slip circles.'
      };
    }

    return {
      type: 'NONE',
      primaryHazard: settlement.dominantHazard,
      secondaryHazard: 'multi_hazard',
      interactionMultiplier: 1.0,
      explanation: 'Primary hazard operates without severe multi-hazard synergistic amplification.'
    };
  }

  /**
   * Deterministic Risk Calculation with Configurable Weights & Compound Modifiers
   */
  static calculateCompositeRisk(
    settlement: Settlement,
    weights: SystemScoringWeights = DEFAULT_SCORING_WEIGHTS
  ): {
    calculatedRisk: number;
    priority: PriorityLevel;
    emergencyUrgency: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
    longTermPriority: 'HIGH' | 'MEDIUM' | 'LOW';
    relocationPriorityScore: number;
    recommendedIntervention: InterventionType;
    rationale: string;
    compoundHazard: CompoundHazardInteraction;
    explainableFactors: ExplainableFactor[];
  } {
    const totalWeight =
      weights.hazardWeight +
      weights.exposureWeight +
      weights.vulnerabilityWeight +
      weights.infrastructureWeight +
      weights.historicalWeight +
      weights.resilienceWeight;

    const compound = this.evaluateCompoundHazards(settlement);
    const normalizedHazard = Math.min(100, Math.round(settlement.overallRisk * compound.interactionMultiplier));
    const normalizedExposure = settlement.exposureScore;
    const normalizedVulnerability = settlement.vulnerabilityScore;
    const normalizedInfraFragility = 100 - (settlement.infrastructure.roads.accessScore + settlement.infrastructure.waterSupply.score) / 2;
    const normalizedHistorical = settlement.historicalEvents.length > 0 ? 85 : 40;
    const invertedResilience = 100 - settlement.resilienceScore;

    const weightedScore = (
      (normalizedHazard * weights.hazardWeight) +
      (normalizedExposure * weights.exposureWeight) +
      (normalizedVulnerability * weights.vulnerabilityWeight) +
      (normalizedInfraFragility * weights.infrastructureWeight) +
      (normalizedHistorical * weights.historicalWeight) +
      (invertedResilience * weights.resilienceWeight)
    ) / totalWeight;

    const calculatedRisk = Math.min(100, Math.max(1, Math.round(weightedScore)));

    // Urgency & Priority Dimensions
    let priority: PriorityLevel = 'MONITOR';
    let emergencyUrgency: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' = 'MEDIUM_TERM';
    let longTermPriority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (calculatedRisk >= 85) {
      priority = 'IMMEDIATE';
      emergencyUrgency = 'IMMEDIATE';
      longTermPriority = 'HIGH';
    } else if (calculatedRisk >= 70) {
      priority = 'SHORT_TERM';
      emergencyUrgency = 'SHORT_TERM';
      longTermPriority = 'HIGH';
    } else if (calculatedRisk >= 50) {
      priority = 'MEDIUM_TERM';
      emergencyUrgency = 'MEDIUM_TERM';
      longTermPriority = 'MEDIUM';
    } else {
      priority = 'MONITOR';
      emergencyUrgency = 'MEDIUM_TERM';
      longTermPriority = 'LOW';
    }

    const relocationPriorityScore = Math.min(100, Math.round(
      (calculatedRisk * 0.45) + 
      (settlement.exposureScore * 0.30) + 
      ((100 - settlement.resilienceScore) * 0.25)
    ));

    // Intervention decision rationale
    let recommendedIntervention: InterventionType = 'PROTECT';
    let rationale = '';

    if (settlement.dominantHazard === 'landslide' && calculatedRisk >= 85) {
      recommendedIntervention = 'FULL_RELOCATION';
      rationale = 'High slope shear instability with active crown tension cracks makes in-situ defense unfeasible. Full relocation is imperative for life safety.';
    } else if (calculatedRisk >= 85 && settlement.microZones.length > 1) {
      const hasZoneDifferences = settlement.microZones.some(z => z.riskScore >= 90) && settlement.microZones.some(z => z.riskScore < 75);
      if (hasZoneDifferences) {
        recommendedIntervention = 'PARTIAL_RELOCATION';
        rationale = 'Critical exposure is concentrated in frontline micro-zones while elevated/inland zones can be safeguarded with engineering adaptation.';
      } else {
        recommendedIntervention = 'FULL_RELOCATION';
        rationale = 'Uniform critical exposure across all zones leaves no safe internal buffer. Complete relocation recommended.';
      }
    } else if (calculatedRisk >= 70) {
      recommendedIntervention = 'ADAPT';
      rationale = 'Engineering adaptation (raised embankments, drainage sluices, plinth elevation) can mitigate over 60% of hazard impact while retaining community livelihoods.';
    } else {
      recommendedIntervention = 'PROTECT';
      rationale = 'High existing resilience and manageable hazard levels make targeted protection and early warning maintenance the most cost-effective approach.';
    }

    // Generate explainable factor contributions
    const explainableFactors: ExplainableFactor[] = [
      {
        factor: 'Primary Hazard Velocity & Depth',
        contribution: Math.round(normalizedHazard * 0.32),
        category: 'HAZARD',
        description: `Direct dynamic wave/fluvial threat intensity (${compound.type !== 'NONE' ? 'Compound Amplified' : 'Single Driver'})`,
        isCritical: normalizedHazard >= 80,
        dataSource: 'Synthetic Satellite InSAR + Hydrological Basin DEM',
        confidencePct: settlement.dataConfidence
      },
      {
        factor: 'Exposed Population & Density',
        contribution: Math.round(normalizedExposure * 0.26),
        category: 'EXPOSURE',
        description: `${settlement.exposedPopulation.toLocaleString()} of ${settlement.population.toLocaleString()} citizens situated in inundation envelope`,
        isCritical: settlement.exposedPercentage >= 75,
        dataSource: 'Synthetic Local Census Layer',
        confidencePct: 94
      },
      {
        factor: 'Socio-Structural Housing Vulnerability',
        contribution: Math.round(normalizedVulnerability * 0.22),
        category: 'VULNERABILITY',
        description: 'High proportion of non-engineered kutcha/semi-pucca housing lacking wave-break resistance',
        isCritical: normalizedVulnerability >= 75,
        dataSource: 'Field Verification Surveys',
        confidencePct: settlement.fieldVerified ? 95 : 72,
        hasDataGap: !settlement.fieldVerified
      },
      {
        factor: 'Infrastructure Bottleneck & Fragility',
        contribution: Math.round(normalizedInfraFragility * 0.12),
        category: 'INFRASTRUCTURE',
        description: settlement.evacBottleneck || 'Single evacuation causeway vulnerable to tidal submergence',
        isCritical: normalizedInfraFragility >= 60,
        dataSource: 'State PWD Road Network Layer',
        confidencePct: 91
      },
      {
        factor: 'Historical Recurrence Multiplier',
        contribution: Math.round(normalizedHistorical * 0.08),
        category: 'TERRAIN',
        description: `${settlement.historicalEvents.length} severe disaster declarations documented in past decade`,
        isCritical: settlement.historicalEvents.length >= 2,
        dataSource: 'DDMA Disaster Archive',
        confidencePct: 98
      }
    ];

    return {
      calculatedRisk,
      priority,
      emergencyUrgency,
      longTermPriority,
      relocationPriorityScore,
      recommendedIntervention,
      rationale,
      compoundHazard: compound,
      explainableFactors
    };
  }
}
