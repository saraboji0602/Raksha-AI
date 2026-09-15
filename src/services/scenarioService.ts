import { Settlement, ScenarioImpact, CostBenefitAssumption } from '../types';

export class ScenarioService {
  /**
   * Generates comparative 4-scenario analysis for a settlement
   */
  static generateScenarios(settlement: Settlement): ScenarioImpact[] {
    const pop = settlement.population;
    const isKadalpuram = settlement.id === 'kadalpuram';
    const inaction = settlement.costOfInactionCr;

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
        infrastructureExposureRemainingCr: inaction,
        implementationYears: 0,
        socialDisruptionLevel: 'VERY_LOW',
        costOfInactionCr: inaction,
        netBenefitCr: -inaction,
        isAIRecommended: false,
        description: `Risk remains unmanaged. Cumulative disaster response, emergency relief, and reconstruction will cost ₹${inaction} Cr over 10 years with recurrent human displacement.`,
        keyMitigations: ['Emergency post-disaster relief only', 'No structural risk reduction', 'Zero resilience gain']
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
        infrastructureExposureRemainingCr: Math.round(inaction * 0.65),
        implementationYears: 2,
        socialDisruptionLevel: 'LOW',
        costOfInactionCr: Math.round(inaction * 0.76),
        netBenefitCr: Math.round(inaction * 0.24 - settlement.costProtectCr),
        isAIRecommended: settlement.aiRecommendation === 'PROTECT',
        description: 'Hard engineering seawalls, groynes, or retaining walls built on-site. Moderate short-term protection, but vulnerable to extreme Category 4 surge breach.',
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
        infrastructureExposureRemainingCr: Math.round(inaction * 0.45),
        implementationYears: 3,
        socialDisruptionLevel: 'LOW',
        costOfInactionCr: Math.round(inaction * 0.59),
        netBenefitCr: Math.round(inaction * 0.41 - settlement.costAdaptCr),
        isAIRecommended: settlement.aiRecommendation === 'ADAPT',
        description: 'Nature-based coastal mangrove bio-shields combined with raised plinth stilt construction and storm-resistant community shelters.',
        keyMitigations: ['Mangrove bio-shield buffer', 'Raised plinth housing upgrades', 'High-capacity stormwater pumps']
      },
      {
        type: 'PARTIAL_RELOCATION',
        name: 'Intelligent Partial Relocation',
        investmentCr: settlement.costRelocateCr,
        riskReductionPct: 76,
        residualRisk: 22,
        residualRiskLevel: 'LOW',
        populationProtectedOrRelocated: settlement.relocationPopulation || 2650,
        exposedPopulationRemaining: Math.max(0, settlement.population - (settlement.relocationPopulation || 2650)),
        infrastructureExposureRemainingCr: 6.0,
        implementationYears: 4,
        socialDisruptionLevel: 'MEDIUM',
        costOfInactionCr: 12.0,
        netBenefitCr: Math.round(inaction * 0.76 - settlement.costRelocateCr),
        isAIRecommended: settlement.aiRecommendation === 'PARTIAL_RELOCATION',
        description: 'Relocate high-vulnerability front-line micro-zones to Safe Site B while adapting inner habitations. Minimizes community disruption while neutralizing life-safety risk.',
        keyMitigations: ['New disaster-resilient housing township at Safe Site', 'Livelihood transit corridor', 'De-risked land use transformation']
      },
      {
        type: 'FULL_RELOCATION',
        name: 'Full Planned Resettlement',
        investmentCr: Math.round(settlement.costRelocateCr * 1.55),
        riskReductionPct: 92,
        residualRisk: 8,
        residualRiskLevel: 'LOW',
        populationProtectedOrRelocated: settlement.population,
        exposedPopulationRemaining: 0,
        infrastructureExposureRemainingCr: 1.5,
        implementationYears: 5,
        socialDisruptionLevel: 'HIGH',
        costOfInactionCr: 4.0,
        netBenefitCr: Math.round(inaction * 0.92 - Math.round(settlement.costRelocateCr * 1.55)),
        isAIRecommended: settlement.aiRecommendation === 'FULL_RELOCATION',
        description: 'Complete phased resettlement of entire population to geologically secure haven. Eliminates all primary hazard exposure with comprehensive civil rebuild.',
        keyMitigations: ['Full new master-planned township', 'Complete civic amenities & utilities', 'Total zone restoration & buffer creation']
      }
    ];
  }

  /**
   * Generates 10-year cumulative disaster damage trajectory across policies
   */
  static getTenYearTrajectory(settlement: Settlement) {
    const baseAnnual = settlement.costOfInactionCr / 10;
    const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return years.map(yr => {
      // Compounding disaster cost curves
      const doNothing = Math.round(baseAnnual * yr * (1 + 0.04 * yr));
      const protect = Math.round((settlement.costProtectCr) + (baseAnnual * 0.65 * yr));
      const adapt = Math.round((settlement.costAdaptCr) + (baseAnnual * 0.45 * yr));
      const partialReloc = Math.round((settlement.costRelocateCr) + (baseAnnual * 0.18 * yr));
      const fullReloc = Math.round((settlement.costRelocateCr * 1.55) + (baseAnnual * 0.05 * yr));

      return {
        year: `Yr ${yr}`,
        'Do Nothing': doNothing,
        'Protect': protect,
        'Adapt': adapt,
        'Partial Relocation': partialReloc,
        'Full Relocation': fullReloc
      };
    });
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
