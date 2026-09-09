export interface GeneratedReport {
  id: string;
  title: string;
  reportType: 
    | 'DISTRICT_EXECUTIVE_SUMMARY' 
    | 'SETTLEMENT_DIGITAL_TWIN' 
    | 'SAFE_SITE_FEASIBILITY' 
    | 'SCENARIO_COST_BENEFIT' 
    | 'FIELD_VERIFICATION_AUDIT';
  district: string;
  settlementName?: string;
  dateGenerated: string;
  authorRole: string;
  summaryText: string;
  keyStats: { label: string; value: string }[];
  status: 'READY' | 'ARCHIVED';
  downloadFileName: string;
}

export const INITIAL_REPORTS: GeneratedReport[] = [
  {
    id: 'rep-01',
    title: 'District Disaster Risk & Relocation Prioritization Summary',
    reportType: 'DISTRICT_EXECUTIVE_SUMMARY',
    district: 'Nagapattinam Coastal Zone',
    dateGenerated: '2026-09-08',
    authorRole: 'DDMA Decision Intelligence Unit',
    summaryText: 'Comprehensive decision-support assessment across 128 analyzed habitations. 17 habitations classified in critical multi-hazard red zone, with 8 requiring immediate phased relocation to validated inland safe havens.',
    keyStats: [
      { label: 'Total Habitations Analyzed', value: '128' },
      { label: 'Critical Risk Habitations', value: '17' },
      { label: 'Immediate Relocation Settlements', value: '8' },
      { label: 'Total Exposed Population', value: '18,450' },
      { label: 'Validated Safe Relocation Sites', value: '14' },
      { label: 'Estimated Inaction Exposure', value: '₹342 Cr' }
    ],
    status: 'READY',
    downloadFileName: 'Nagapattinam_DDMA_Executive_Risk_Report_2026.pdf'
  },
  {
    id: 'rep-02',
    title: 'Settlement Digital Twin & Decision Dossier: Kadalpuram',
    reportType: 'SETTLEMENT_DIGITAL_TWIN',
    district: 'Nagapattinam Coastal Zone',
    settlementName: 'Kadalpuram',
    dateGenerated: '2026-09-08',
    authorRole: 'RAKSHA-AI Automated Decision Engine',
    summaryText: 'Multi-hazard exposure score 91/100 driven by 3.4m/yr coastal retreat and Category 4 cyclone surge envelope. Model recommends Partial Relocation: 2,650 residents from Zone A relocated to Site B; 1,220 in Zone B adapted with reinforced roofs and flood bunds; 950 in Zone C protected.',
    keyStats: [
      { label: 'Overall Risk Score', value: '91 / 100 (CRITICAL)' },
      { label: 'Data Confidence', value: '93% (High)' },
      { label: 'Relocated Population', value: '2,650 residents' },
      { label: 'Recommended Haven', value: 'Site B (Pothigai)' },
      { label: 'Estimated Implementation', value: '₹28.0 Cr' },
      { label: 'Avoided Exposure Cost', value: '₹96.0 Cr' }
    ],
    status: 'READY',
    downloadFileName: 'Kadalpuram_Digital_Twin_Intervention_Dossier.pdf'
  },
  {
    id: 'rep-03',
    title: 'Safe Haven Carrying Capacity & Suitability Audit: Site B',
    reportType: 'SAFE_SITE_FEASIBILITY',
    district: 'Nagapattinam Inland Sector',
    dateGenerated: '2026-09-07',
    authorRole: 'State Town & Country Planning Directorate',
    summaryText: 'Evaluation of 145 acres government wasteland at 14.5m MSL elevation. Multi-factor suitability score 91/100. Highest community acceptance (82/100) due to 18km transit connection to fishing grounds.',
    keyStats: [
      { label: 'Recommended Capacity', value: '5,000 residents' },
      { label: 'Hazard Safety Score', value: '92 / 100' },
      { label: 'Community Acceptance', value: '82%' },
      { label: 'Distance from Kadalpuram', value: '18.4 km' },
      { label: 'Est. Development Cost', value: '₹25.05 Cr' }
    ],
    status: 'READY',
    downloadFileName: 'Site_B_Carrying_Capacity_Audit.pdf'
  }
];
