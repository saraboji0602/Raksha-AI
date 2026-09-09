import { Settlement, InterventionType, PriorityLevel, SystemScoringWeights } from '../types';

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
   * Deterministic Risk Calculation with Configurable Weights
   */
  static calculateCompositeRisk(
    settlement: Settlement,
    weights: SystemScoringWeights = DEFAULT_SCORING_WEIGHTS
  ): {
    calculatedRisk: number;
    priority: PriorityLevel;
    recommendedIntervention: InterventionType;
    rationale: string;
  } {
    const totalWeight =
      weights.hazardWeight +
      weights.exposureWeight +
      weights.vulnerabilityWeight +
      weights.infrastructureWeight +
      weights.historicalWeight +
      weights.resilienceWeight;

    const normalizedHazard = settlement.overallRisk;
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

    // Determine Priority Level
    let priority: PriorityLevel = 'MONITOR';
    if (calculatedRisk >= 85) {
      priority = 'IMMEDIATE';
    } else if (calculatedRisk >= 70) {
      priority = 'SHORT_TERM';
    } else if (calculatedRisk >= 50) {
      priority = 'MEDIUM_TERM';
    } else {
      priority = 'MONITOR';
    }

    // Determine Protect vs Adapt vs Partial vs Full Relocation
    let recommendedIntervention: InterventionType = 'PROTECT';
    let rationale = '';

    if (settlement.dominantHazard === 'landslide' && calculatedRisk >= 85) {
      recommendedIntervention = 'FULL_RELOCATION';
      rationale = 'High slope shear instability with active crown tension cracks makes in-situ defense unfeasible. Full relocation is imperative for life safety.';
    } else if (calculatedRisk >= 85 && settlement.microZones.length > 1) {
      // Check microzone variance
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

    return {
      calculatedRisk,
      priority,
      recommendedIntervention,
      rationale
    };
  }
}
