import { Settlement } from '../types';

export class ReportGenerator {
  /**
   * Generates CSV string of settlements
   */
  static exportSettlementsToCSV(settlements: Settlement[]): string {
    const headers = [
      'Settlement ID',
      'Name',
      'District',
      'State',
      'Population',
      'Households',
      'Dominant Hazard',
      'Overall Risk (0-100)',
      'Exposure Score',
      'Vulnerability Score',
      'Resilience Score',
      'Data Confidence (%)',
      'Priority Queue',
      'AI Recommendation',
      'Relocation Population',
      'Recommended Site ID',
      'Protect Cost (Cr)',
      'Adapt Cost (Cr)',
      'Relocate Cost (Cr)',
      'Cost of Inaction (Cr)',
      'Field Verified'
    ];

    const rows = settlements.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.district}"`,
      `"${s.state}"`,
      s.population,
      s.households,
      `"${s.dominantHazard}"`,
      s.overallRisk,
      s.exposureScore,
      s.vulnerabilityScore,
      s.resilienceScore,
      s.dataConfidence,
      `"${s.priority}"`,
      `"${s.aiRecommendation}"`,
      s.relocationPopulation,
      `"${s.recommendedSiteId || 'N/A'}"`,
      s.costProtectCr,
      s.costAdaptCr,
      s.costRelocateCr,
      s.costOfInactionCr,
      s.fieldVerified ? 'YES' : 'NO'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  /**
   * Triggers file download in browser
   */
  static downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
