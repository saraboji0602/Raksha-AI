import { Settlement, ScenarioImpact, CostBenefitAssumption } from '../types';

export class ScenarioService {
  /**
   * Generates comparative 4-scenario analysis for a settlement
   */
  static generateScenarios(settlement: Settlement): ScenarioImpact[] {
    const pop = settlement.population;
    const isKadalpuram = settlement.id === 'kadalpuram';

    return [
      {
        type: 'DO_NOTHING',
        name: 'Do Nothing (Status Quo)',
        investmentCr: 0.0,
        riskReductionPct: 0,
        residualRisk: Math.min(100, settlement.overallRisk + 4),
        residualRiskLevel: 'CRITICAL',
        populationProtectedOrRelocated: 0,
        exposedPopulationRemaining: settlement.exposedPopulation,
        infrastructureExposureRemainingCr: settlement.costOfInactionCr,
        implementationYears: 0,
        socialDisruptionLevel: 'VERY_LOW',
        costOfInactionCr: settlement.costOfInactionCr,
        netBenefitCr: -settlement.costOfInactionCr,
        isAIRecommended: false,
        description: 'Risk remains unmanaged and shoreline regression/slope shear accelerates. Cumulative disaster response and reconstruction will cost ₹' + settlement.costOfInactionCr + ' Cr over 10 years.',
        keyMitigations: ['Emergency post-disaster relief only', 'No structural risk reduction']
      },
      {
        type: 'PROTECT',
        name: 'In-Situ Protection Works',
        investmentCr: settlement.costProtectCr,
        riskReductionPct: 24,
        residualRisk: Math.round(settlement.overallRisk * 0.76),
        residualRiskLevel: 'HIGH',
        populationProtectedOrRelocated: isKadalpuram ? 2900 : Math.round(pop * 0.6),
        exposedPopulationRemaining: isKadalpuram ? 1920 : Math.round(pop * 0.4),
        infrastructureExposureRemainingCr: Math.round(settlement.costOfInactionCr * 0.65),
        implementationYears: 2,
        socialDisruptionLevel: 'VERY_LOW',
        costOfInactionCr: Math.round(settlement.costOfInactionCr * 0.76),
        netBenefitCr: Math.round(settlement.costOfInactionCr * 0.24 - settlement.costProtectCr),
        isAIRecommended: settlement.aiRecommendation === 'PROTECT',
        description: 'Hard engineering seawalls, groynes, or retaining walls built on-site. High initial protection, but vulnerable to extreme Category 4 surge breach.',
        keyMitigations: ['Submerged geotube breakwaters', 'Concrete seawall reinforcement', 'Drainage sluices']
      },
      {
        type: 'ADAPT',
        name: 'Ecological & Engineering Adaptation',
        investmentCr: settlement.costAdaptCr,
        riskReductionPct: 41,
        residualRisk: Math.round(settlement.overallRisk * 0.59),
        residualRiskLevel: 'MODERATE',
        populationProtectedOrRelocated: isKadalpuram ? 3700 : Math.round(pop * 0.8),
        exposedPopulationRemaining: isKadalpuram ? 1120 : Math.round(pop * 0.2),
        infrastructureExposureRemainingCr: Math.round(settlement.costOfInactionCr * 0.45),
        implementationYears: 3,
        socialDisruptionLevel: 'LOW',
        costOfInactionCr: Math.round(settlement.costOfInactionCr * 0.59),
        netBenefitCr: Math.round(settlement.costOfInactionCr * 0.41 - settlement.costAdaptCr),
        isAIRecommended: settlement.aiRecommendation === 'ADAPT',
        description: 'Nature-based coastal mangrove bio-shields combined with raised plinth stilt construction and storm-resistant community shelters.',
        keyMitigations: ['Mangrove bio-shield buffer', 'Raised plinth housing upgrades', 'High-capacity stormwater pumps']
      },
      {
        type: settlement.aiRecommendation === 'PARTIAL_RELOCATION' ? 'PARTIAL_RELOCATION' : 'FULL_RELOCATION',
        name: settlement.aiRecommendation === 'PARTIAL_RELOCATION' ? 'Intelligent Partial Relocation' : 'Full Planned Relocation',
        investmentCr: settlement.costRelocateCr,
        riskReductionPct: settlement.aiRecommendation === 'PARTIAL_RELOCATION' ? 76 : 91,
        residualRisk: settlement.aiRecommendation === 'PARTIAL_RELOCATION' ? 22 : 9,
        residualRiskLevel: 'LOW',
        populationProtectedOrRelocated: settlement.relocationPopulation || settlement.population,
        exposedPopulationRemaining: Math.max(0, settlement.population - (settlement.relocationPopulation || settlement.population)),
        infrastructureExposureRemainingCr: 6.0,
        implementationYears: 4,
        socialDisruptionLevel: settlement.aiRecommendation === 'PARTIAL_RELOCATION' ? 'MEDIUM' : 'HIGH',
        costOfInactionCr: 12.0,
        netBenefitCr: Math.round(settlement.costOfInactionCr * 0.76 - settlement.costRelocateCr),
        isAIRecommended: true,
        description: settlement.aiRecommendation === 'PARTIAL_RELOCATION'
          ? 'Relocate 2,650 residents in critical red micro-zones to Site B while adapting remaining southern zones. Minimizes social upheaval while neutralizing life-safety risk.'
          : 'Complete phased resettlement of 2,140 residents to geologically secure haven Site C.',
        keyMitigations: ['New disaster-resilient housing township at Safe Site', 'Livelihood transit corridor', 'De-risked land use transformation']
      }
    ];
  }

  /**
   * Calculates dynamic simulation response when the user moves the Investment Slider (₹ Cr)
   */
  static simulateCustomInvestment(settlement: Settlement, investmentCr: number) {
    const minCost = 5.0;
    const maxCost = 45.0;
    const ratio = Math.min(1.0, Math.max(0.0, (investmentCr - minCost) / (maxCost - minCost)));
    
    // Risk reduction scales logarithmically with investment
    const riskReductionPct = Math.min(94, Math.round(Math.pow(ratio, 0.65) * 94));
    const residualRisk = Math.max(6, Math.round(settlement.overallRisk * (1 - riskReductionPct / 100)));
    const populationProtected = Math.min(settlement.population, Math.round(settlement.population * (0.2 + ratio * 0.8)));
    
    let dynamicRecommendation = 'DO_NOTHING';
    if (investmentCr >= 25.0) {
      dynamicRecommendation = 'PARTIAL_RELOCATION';
    } else if (investmentCr >= 15.0) {
      dynamicRecommendation = 'ADAPT';
    } else if (investmentCr >= 8.0) {
      dynamicRecommendation = 'PROTECT';
    }

    return {
      investmentCr,
      riskReductionPct,
      residualRisk,
      populationProtected,
      dynamicRecommendation,
      avoidedDamageCr: Math.round((riskReductionPct / 100) * settlement.costOfInactionCr),
      netRoiCr: Math.round(((riskReductionPct / 100) * settlement.costOfInactionCr) - investmentCr)
    };
  }

  /**
   * Detailed transparent cost-benefit breakdown assumptions
   */
  static getCostBreakdownAssumptions(settlement: Settlement): CostBenefitAssumption[] {
    const isKadalpuram = settlement.id === 'kadalpuram';
    const relocatedUnits = isKadalpuram ? 510 : 440;

    return [
      {
        item: 'Disaster-Resilient Housing (Pucca RC Structure)',
        unit: 'per household unit',
        quantity: relocatedUnits,
        unitCostLakhs: 3.5,
        totalCr: Number(((relocatedUnits * 3.5) / 100).toFixed(2)),
        notes: 'PMAY-G compliant resilient construction standards'
      },
      {
        item: 'Internal Roads, Storm Drains & Street Lighting',
        unit: 'hectares developed',
        quantity: 12,
        unitCostLakhs: 25.0,
        totalCr: 3.0,
        notes: 'All-weather concrete roads and underground stormwater conduits'
      },
      {
        item: 'Potable Drinking Water Network & OHT Tank',
        unit: 'system capacity 0.6 MLD',
        quantity: 1,
        unitCostLakhs: 320.0,
        totalCr: 3.2,
        notes: 'Dedicated bulk supply feeder from state water grid'
      },
      {
        item: 'Primary Health Sub-centre & Community Hall',
        unit: 'civic infrastructure block',
        quantity: 1,
        unitCostLakhs: 180.0,
        totalCr: 1.8,
        notes: 'Equipped with 24x7 solar power backup and emergency shelter bay'
      },
      {
        item: 'Livelihood Transit & Cold Storage Infrastructure',
        unit: 'fishery/agro transit hub',
        quantity: 1,
        unitCostLakhs: 160.0,
        totalCr: 1.6,
        notes: 'Maintains economic continuity for daily commuting fishermen'
      },
      {
        item: 'Contingency & Social Transition Support Allowance',
        unit: 'per family stipend',
        quantity: relocatedUnits,
        unitCostLakhs: 0.12,
        totalCr: Number(((relocatedUnits * 0.12) / 100).toFixed(2)),
        notes: '3-month transitional subsistence support per household'
      }
    ];
  }
}
