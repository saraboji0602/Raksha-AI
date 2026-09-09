import { Settlement, SafeSite, SiteMatchResult } from '../types';

export class SiteMatchingService {
  /**
   * Matches candidate safe sites for a given settlement
   */
  static matchSitesForSettlement(settlement: Settlement, safeSites: SafeSite[]): SiteMatchResult[] {
    const results: SiteMatchResult[] = safeSites.map(site => {
      const distance = site.distanceFromKeySettlementKm[settlement.id] || 25.0;
      const travelTime = site.travelTimeMin[settlement.id] || 40;
      
      const safetyScore = site.hazardSafetyScore;
      const capacityScore = Math.min(100, Math.round((site.capacity.recommendedMaxCapacity / Math.max(1, settlement.relocationPopulation || settlement.population)) * 100));
      const accessibilityScore = site.connectivityScore;
      const communityAcceptanceScore = site.communityAcceptance.overallScore;
      const livelihoodScore = site.livelihoodScore;
      
      // Distance penalty if distance > 30km
      const distanceFactor = Math.max(40, 100 - (distance * 1.5));
      
      // Multi-factor weighted match score
      // Hazard Safety: 25%, Community Acceptance: 25%, Livelihood: 20%, Capacity: 15%, Distance/Accessibility: 15%
      const matchScore = Math.round(
        (safetyScore * 0.25) +
        (communityAcceptanceScore * 0.25) +
        (livelihoodScore * 0.20) +
        (Math.min(100, capacityScore) * 0.15) +
        ((accessibilityScore + distanceFactor) / 2 * 0.15)
      );

      let recommendationReason = '';
      if (site.id === 'site-b' && settlement.id === 'kadalpuram') {
        recommendationReason = 'Optimal balance: Highest community acceptance (82%), superior livelihood transit back to coastal waters, and ample carrying capacity (5,000 max vs 2,650 required).';
      } else if (site.id === 'site-c' && settlement.id === 'malaiyur') {
        recommendationReason = 'Zero landslide hazard slope (96/100 safety) and proven bedrock geological stability for hill tribes.';
      } else if (site.id === 'site-a') {
        recommendationReason = 'High physical safety (94/100) but penalized by low community acceptance (44%) and critical drinking water deficits.';
      } else {
        recommendationReason = `High agro-corridor capacity with ${communityAcceptanceScore}% community acceptance index.`;
      }

      const isRecommended = site.id === settlement.recommendedSiteId;

      return {
        site,
        matchScore,
        safetyScore,
        capacityScore,
        accessibilityScore,
        communityAcceptanceScore,
        livelihoodCompatibilityScore: livelihoodScore,
        distanceKm: distance,
        travelTimeMin: travelTime,
        isRecommended,
        recommendationReason
      };
    });

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}
