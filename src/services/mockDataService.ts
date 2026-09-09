import { Settlement, SafeSite, AlertItem, UserProfile } from '../types';
import { INITIAL_SETTLEMENTS } from '../data/settlementsData';
import { INITIAL_SAFE_SITES } from '../data/safeSitesData';
import { INITIAL_ALERTS } from '../data/alertsData';
import { INITIAL_REPORTS, GeneratedReport } from '../data/reportsData';

export const CURRENT_USER: UserProfile = {
  id: 'usr-ddma-01',
  name: 'Thiru. S. Arunkumar, IAS',
  email: 'collector.nagapattinam@tn.gov.in',
  role: 'DDMA_OFFICER',
  designation: 'District Collector & Chairman DDMA',
  jurisdictionDistrict: 'Nagapattinam Coastal Zone',
  jurisdictionState: 'Tamil Nadu',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  badgeNumber: 'TN-IAS-2016-042'
};

export class MockDataService {
  private static settlements: Settlement[] = [...INITIAL_SETTLEMENTS];
  private static safeSites: SafeSite[] = [...INITIAL_SAFE_SITES];
  private static alerts: AlertItem[] = [...INITIAL_ALERTS];
  private static reports: GeneratedReport[] = [...INITIAL_REPORTS];

  static getSettlements(): Settlement[] {
    return this.settlements;
  }

  static getSettlementById(id: string): Settlement | undefined {
    return this.settlements.find(s => s.id === id);
  }

  static getSafeSites(): SafeSite[] {
    return this.safeSites;
  }

  static getSafeSiteById(id: string): SafeSite | undefined {
    return this.safeSites.find(s => s.id === id);
  }

  static getAlerts(): AlertItem[] {
    return this.alerts;
  }

  static getReports(): GeneratedReport[] {
    return this.reports;
  }

  static addReport(report: GeneratedReport) {
    this.reports.unshift(report);
  }

  static markAlertAsRead(id: string) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.read = true;
  }

  static updateSettlementConfidence(settlementId: string, newConfidence: number, notes: string) {
    const settlement = this.settlements.find(s => s.id === settlementId);
    if (settlement) {
      settlement.dataConfidence = newConfidence;
      settlement.fieldVerified = true;
      settlement.fieldVerificationNotes = notes;
      settlement.status = 'FIELD_VERIFIED';
    }
  }

  /**
   * Predefined domain intelligence for RAKSHA Assistant chat
   */
  static getAIChatResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('why') && q.includes('kadalpuram')) {
      return `Kadalpuram has a critical multi-hazard score of 91/100, driven mainly by coastal erosion (3.4m/yr shoreline regression), cyclonic storm surge exposure (Category 4 envelope), repeated historical flooding (4 events in 8 years), and low resilience (fragile single-bridge egress). 
      
The model recommends **PARTIAL RELOCATION** because Zone A (Northern Spit) is within 50m of active wave attacks where engineering seawalls are cost-ineffective, while Zones B and C can be safely retained through plinth elevation and drainage sluices. Safe Haven Site B (Pothigai) is recommended for the 2,650 relocated residents.`;
    }

    if (q.includes('site b') || (q.includes('why') && q.includes('site'))) {
      return `Site B (Pothigai Resilient Haven) is ranked #1 for Kadalpuram because:
1. **Hazard Safety**: 92/100 (located 18.4km inland at 14.5m elevation, zero surge risk).
2. **Community Acceptance**: 82% (highest among all sites, compared to 44% for Site A).
3. **Livelihood Continuity**: 86% match — planned 18km transit corridor allows fishermen daily access to coastal docks.
4. **Carrying Capacity**: 5,000 residents max capacity safely accommodates the 2,650 relocating citizens without over-stressing the water grid.`;
    }

    if (q.includes('immediate') || q.includes('highest priority') || q.includes('queue')) {
      return `Currently, **3 habitations** are in the **IMMEDIATE RELOCATION QUEUE**:
1. **Malaiyur** (Risk: 94/100, Priority Score: 96) — Critical 45mm tension crack landslide threat (2,140 residents → Site C).
2. **Kadalpuram** (Risk: 91/100, Priority Score: 94) — Active coastal erosion & storm surge (2,650 residents → Site B).
3. **Pamban Island Sector 4** (Risk: 93/100, Priority Score: 95) — Dual cyclonic wave surge exposure (2,200 residents → Site B).`;
    }

    if (q.includes('adapt') || q.includes('what happens if we adapt')) {
      return `If authorities choose **ADAPTATION** for Kadalpuram instead of Partial Relocation:
- **Investment Required**: ₹19.0 Cr (vs ₹28.0 Cr for Partial Relocation)
- **Risk Reduction**: 41% (Residual risk remains Moderate at 54/100)
- **Population Protected**: 3,700 residents
- **Drawback**: Frontline Zone A will remain exposed to future catastrophic breach in Category 4+ cyclonic surge, leading to estimated future inaction losses of ₹48+ Cr.`;
    }

    if (q.includes('inaction') || q.includes('cost of waiting')) {
      return `The **Cost of Inaction** represents the cumulative 10-year projected disaster relief, emergency evacuation, and infrastructure reconstruction losses if no proactive intervention is executed. For Kadalpuram, inaction is estimated at **₹96.0 Cr**, compared to a one-time proactive relocation investment of **₹28.0 Cr** (net savings of ₹68.0 Cr).`;
    }

    if (q.includes('malaiyur') || q.includes('landslide')) {
      return `Malaiyur (Nilgiri Hills) is flagged for **FULL RELOCATION** (2,140 people to Hill-Safe Site C). InSAR and piezometer sensors detected a 45mm active crown tension crack on a 38° steep slope above the settlement, indicating severe risk of catastrophic debris avalanche.`;
    }

    return `RAKSHA-AI analyzes multi-hazard risk, population exposure, and community resilience to recommend whether settlements should be **PROTECTED**, **ADAPTED**, or **RELOCATED**. You can ask about specific settlements (e.g. Kadalpuram, Malaiyur, Aarupadi), Safe Site comparisons, carrying capacities, or scenario cost-benefits.`;
  }
}
