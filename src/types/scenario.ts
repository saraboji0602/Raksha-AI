import { InterventionType, RiskLevel } from './settlement';

export interface ScenarioImpact {
  type: InterventionType | 'DO_NOTHING';
  name: string;
  investmentCr: number;
  riskReductionPct: number;
  residualRisk: number; // 0 - 100
  residualRiskLevel: RiskLevel;
  populationProtectedOrRelocated: number;
  exposedPopulationRemaining: number;
  infrastructureExposureRemainingCr: number;
  implementationYears: number;
  socialDisruptionLevel: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  costOfInactionCr: number;
  netBenefitCr: number;
  isAIRecommended: boolean;
  description: string;
  keyMitigations: string[];
}

export interface SimulationParameters {
  settlementId: string;
  customInvestmentCr: number;
  hazardSeverityMultiplier: number; // 1.0 = baseline, 1.5 = extreme monsoon/cyclone
  timelineYears: number;
  relocationPercentage: number;
  adaptationLevel: number;
}

export interface CostBenefitAssumption {
  item: string;
  unit: string;
  quantity: number;
  unitCostLakhs: number;
  totalCr: number;
  notes: string;
}
