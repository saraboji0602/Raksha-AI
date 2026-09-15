import { Settlement, SafeSite, IncidentItem, RoadSegment, EmergencyShelter, RecoveryItem, FieldTaskItem, DataConflictItem } from '../types';

export interface AIResponseMetadata {
  whyExplanation: string;
  confidenceScore: number;
  dataSourceProvenance: string;
  humanReviewStatus: string;
  suggestedAction?: string;
}

export interface AIProcessedMessage {
  text: string;
  metadata: AIResponseMetadata;
}

export class AIAssistantService {
  /**
   * Generates a context-grounded explainable response based on live system state
   */
  static processUserQuery(
    query: string,
    context: {
      activeViewMode: 'OFFICER' | 'CITIZEN';
      selectedSettlement: Settlement;
      settlements: Settlement[];
      safeSites: SafeSite[];
      incidents: IncidentItem[];
      roads: RoadSegment[];
      shelters: EmergencyShelter[];
      recoveryItems: RecoveryItem[];
      fieldTasks: FieldTaskItem[];
      dataConflicts: DataConflictItem[];
      simulationMode: 'BASELINE' | 'RISING_RIVER_SURGE';
    }
  ): AIProcessedMessage {
    const q = query.toLowerCase().trim();
    const { selectedSettlement, settlements, safeSites, incidents, roads, shelters, recoveryItems, simulationMode, activeViewMode } = context;

    // --- CITIZEN PERSONA RESPONSES ---
    if (activeViewMode === 'CITIZEN' || q.includes('my risk') || q.includes('my area') || q.includes('i do') || q.includes('nearest shelter')) {
      if (q.includes('risk') || q.includes('red') || q.includes('why is my area')) {
        const riskTier = selectedSettlement.overallRisk >= 75 ? 'CRITICAL' : selectedSettlement.overallRisk >= 50 ? 'HIGH' : 'MODERATE';
        return {
          text: `Your habitation **${selectedSettlement.name}** is currently at **${selectedSettlement.overallRisk}/100 (${riskTier})** risk. The estuarine river surge gauge is reading +2.4m above mean sea level. Frontline Zone A is experiencing wave runup inundation up to 1.1m depth.`,
          metadata: {
            whyExplanation: `Astronomical high tide coupled with +1.6m monsoonal fluvial river discharge penetrating 120m past high tide line.`,
            confidenceScore: selectedSettlement.dataConfidence,
            dataSourceProvenance: 'Northern Gauge N-04 + Ground Inspection Dossier #FT-NGP-01',
            humanReviewStatus: 'Verified by Field Officer Insp. R. Sundaram (TN-DDMA-F04)',
            suggestedAction: 'Move to designated higher ground or nearest shelter immediately.'
          }
        };
      }

      if (q.includes('shelter') || q.includes('where should i go') || q.includes('where to go')) {
        const bestShelter = shelters.find(s => s.settlementId === selectedSettlement.id && s.currentOccupancy < s.capacity) || shelters[0];
        const headroom = bestShelter.capacity - bestShelter.currentOccupancy;
        return {
          text: `The nearest safe shelter for you is **${bestShelter.name}** (${bestShelter.distanceKm} km away). It currently has **${headroom} available spaces** remaining (${bestShelter.currentOccupancy}/${bestShelter.capacity} occupied). Amenities include potable water, medical post, backup power generator, and clean sanitation.`,
          metadata: {
            whyExplanation: `Located on an elevated ridge (+8.5m MSL) outside the 100-year storm surge envelope with dedicated medical staff.`,
            confidenceScore: 98,
            dataSourceProvenance: 'District Disaster Management Authority (DDMA) Live Shelter Telemetry',
            humanReviewStatus: 'Audited by Relief Camp Officer Staff Nurse Anbarasi',
            suggestedAction: `Follow the marked green evacuation corridor towards ${bestShelter.name}.`
          }
        };
      }

      if (q.includes('route') || q.includes('road') || q.includes('path') || q.includes('change')) {
        const blockedRoad = roads.find(r => r.status === 'BLOCKED');
        return {
          text: `⚠️ **Route Advisory:** The **Coastal Causeway (Route A)** is **BLOCKED** due to +1.4m seawater inundation. All traffic and pedestrians are automatically rerouted to **Safe Route B (State Highway 49 Elevated Bypass)**, which is 100% clear, elevated, and all-weather passable.`,
          metadata: {
            whyExplanation: `Field officer measured 1.4m deep undertow over 350m span at Culvert B-07. Route A closed to prevent citizen entrapment.`,
            confidenceScore: 96,
            dataSourceProvenance: 'Physical Measurement by Field Officer & Traffic Police Desk',
            humanReviewStatus: 'Statutory Evacuation Rerouting Order under Section 34(a) DMA 2005',
            suggestedAction: 'Take SH-49 High Bypass exclusively. Do not attempt crossing Coastal Causeway.'
          }
        };
      }

      if (q.includes('what should i do') || q.includes('action') || q.includes('now')) {
        return {
          text: `**Immediate Citizen Safety Checklist for ${selectedSettlement.name}:**\n1. **Evacuate Frontline Zone A:** Move inland immediately if you reside within 200m of the coast.\n2. **Avoid Coastal Causeway:** Use the SH-49 Elevated Corridor.\n3. **Relief Shelter:** Proceed to ${shelters[0]?.name || 'Government Relief Camp'}.\n4. **Emergency Rescue:** If trapped by water, press the red **EMERGENCY SOS** button in this portal.`,
          metadata: {
            whyExplanation: `Preemptive evacuation advisory issued for Zone A to prevent tidal surge isolation during tonight's high tide peak.`,
            confidenceScore: 94,
            dataSourceProvenance: 'DDMA Integrated Early Warning & Advisory Dispatch',
            humanReviewStatus: 'Sanctioned by District Collector',
            suggestedAction: 'Follow designated green evacuation corridors.'
          }
        };
      }
    }

    // --- OFFICER COMMAND PERSONA RESPONSES ---
    if (q.includes('first') || q.includes('priority') || q.includes('which habitation') || q.includes('which settlement')) {
      const topSettlement = settlements.slice().sort((a, b) => b.overallRisk - a.overallRisk)[0];
      return {
        text: `**${topSettlement.name}** requires immediate priority action. Its composite risk score is **${topSettlement.overallRisk}/100 (CRITICAL)** with **${topSettlement.population.toLocaleString()} exposed residents** and ${topSettlement.relocationPopulation.toLocaleString()} frontline citizens in the direct surge envelope.`,
        metadata: {
          whyExplanation: `Compound multi-hazard vulnerability: Frontline scarp retreat (3.4m/yr) + tidal fluvial backwater swelling + single egress causeway vulnerable to submergence.`,
          confidenceScore: topSettlement.dataConfidence,
          dataSourceProvenance: 'Synthetic Multi-Hazard Risk Model + Field Ground Truth #FT-NGP-01',
          humanReviewStatus: 'Approved by District Collector for Partial Relocation to Site B',
          suggestedAction: 'Sanction Phase 1 relocation package and dispatch NDRF boat standby.'
        }
      };
    }

    if (q.includes('why is kadalpuram') || q.includes('kadalpuram risk') || (q.includes('why') && q.includes('kadalpuram'))) {
      return {
        text: `**Kadalpuram Risk Decomposition (${selectedSettlement.overallRisk}/100):**\n• **Exposure Score (94/100):** 950 kutcha fishing dwellings located within 80m of the active high-tide scarp.\n• **Vulnerability Score (88/100):** 480 elderly, infants, and disabled residents; 6 salinized drinking wells.\n• **Resilience Score (42/100):** Low seawall elevation (+1.2m MSL) and single low-lying causeway access.\n• **Dynamic Factor:** ${simulationMode === 'RISING_RIVER_SURGE' ? 'Rising River Surge added +19 points due to estuarine backwater runup.' : 'Baseline coastal monsoonal exposure.'}`,
        metadata: {
          whyExplanation: `Synergistic compound hazard: Cyclonic envelope coincides with estuarine runoff barrier.`,
          confidenceScore: selectedSettlement.dataConfidence,
          dataSourceProvenance: 'Sentinel-1 InSAR + Survey of India 1m LiDAR + Ground Water Board',
          humanReviewStatus: 'Calibrated from 72% to 94% following physical surveyor inspection.',
          suggestedAction: 'Execute Partial Relocation of Zone A to Haven Site B.'
        }
      };
    }

    if (q.includes('site b') || q.includes('safe site') || q.includes('haven') || q.includes('pothigai')) {
      const siteB = safeSites.find(s => s.id === 'site-b') || safeSites[0];
      const headroom = siteB.capacity.recommendedMaxCapacity - siteB.allocatedPopulation;
      return {
        text: `**Site B (${siteB.name})** is recommended with a **Suitability Index of ${siteB.hazardSafetyScore}/100** because:\n1. **Elevation:** +18.5m MSL (Completely outside 100-year cyclone & flood envelopes).\n2. **Geotechnical:** Verified load-bearing foundation (180 kN/m² non-expansive clay).\n3. **Capacity:** Carrying capacity of ${siteB.capacity.recommendedMaxCapacity.toLocaleString()} (Available headroom: +${headroom.toLocaleString()}).\n4. **Livelihood Continuity:** Only 1.2 km from the new cold-chain fishing terminal, preserving maritime incomes.`,
        metadata: {
          whyExplanation: `Multi-criteria decision matrix scored Site B highest across disaster safety (98%), land tenure (94%), and community acceptance (89%).`,
          confidenceScore: 94,
          dataSourceProvenance: 'PWD Geotechnical Wing + TNCZMA Non-CRZ Land Registry',
          humanReviewStatus: 'Statutory Administrative Checklist Step 02 Signed Off',
          suggestedAction: 'Sanction Tranche 1 2BHK permanent resilient housing construction.'
        }
      };
    }

    if (q.includes('incident') || q.includes('sos') || q.includes('rescue')) {
      const topIncident = incidents.find(i => i.status !== 'RESOLVED') || incidents[0];
      return {
        text: `Highest priority incident is **${topIncident.title}** (Priority Score: **${topIncident.priorityScore}/100**).\n• **Location:** ${topIncident.settlementName} (${topIncident.microZoneName})\n• **Citizens Trapped:** ${topIncident.peopleCount} individuals (${topIncident.vulnerableDetails.elderlyCount} elderly, ${topIncident.vulnerableDetails.infantsChildrenCount} infants, ${topIncident.vulnerableDetails.medicalNeedCount} medical need)\n• **Assigned Unit:** ${topIncident.assignedResource?.teamName || 'NDRF Quick Response Team 04'}`,
        metadata: {
          whyExplanation: `Algorithm prioritizes high vulnerable demographics (elderly + infants + medical) in rapidly rising floodwater (+1.4m).`,
          confidenceScore: 98,
          dataSourceProvenance: 'Citizen SOS Distress Beacon + Verified Phone Callback',
          humanReviewStatus: 'Resource Dispatched by Emergency Command Desk',
          suggestedAction: 'Deploy amphibious rescue craft via elevated SH-49 corridor.'
        }
      };
    }

    if (q.includes('field') || q.includes('verify') || q.includes('ground truth') || q.includes('sundaram')) {
      return {
        text: `**Field Verification Dossier (Insp. R. Sundaram - TN-DDMA-F04):**\n1. **Coastal Causeway Road A:** Submerged by +1.4m wave surge over 350m. Scour detected on Culvert B-07.\n2. **Beachfront Berm:** 3.4m/yr actual scarp retreat measured with laser rangefinder.\n3. **Potable Water:** 6 frontline drinking wells salinized by sea ingress.\n4. **Data Calibration:** Field truth upgraded settlement confidence from 72% to 94%.`,
        metadata: {
          whyExplanation: `Empirical on-site ground verification eliminates synthetic model uncertainty before statutory sanction.`,
          confidenceScore: 94,
          dataSourceProvenance: 'Field Inspection Dossier #FT-NGP-01 (EXIF GPS Tagged Photos)',
          humanReviewStatus: 'Accepted by District Collector; Road A officially marked BLOCKED.',
          suggestedAction: 'Route all emergency traffic to Route B High Bypass.'
        }
      };
    }

    if (q.includes('cost of inaction') || q.includes('do nothing') || q.includes('protect vs adapt')) {
      return {
        text: `**Cost of Inaction Analysis (10-Year Horizon):**\n• **DO NOTHING:** Cumulative loss of **₹${selectedSettlement.costOfInactionCr} Cr** in recurrent relief, structural rebuilding, and catastrophic mortality risk.\n• **PROTECT (₹${selectedSettlement.costProtectCr} Cr):** Seawalls fail against projected 2050 Sea Level Rise (+0.6m).\n• **PARTIAL RELOCATION (₹${selectedSettlement.costRelocateCr} Cr):** Permanent risk elimination for 950 frontline households with an 82% residual risk drop and 100% life-safety guarantee.`,
        metadata: {
          whyExplanation: `Relocation is mathematically optimal (Benefit-Cost Ratio 4.2x) compared to recurrent post-disaster SDRF compensation payouts.`,
          confidenceScore: 91,
          dataSourceProvenance: 'Disaster Economics Loss Exceedance Curve (LEC) Simulation',
          humanReviewStatus: 'SDMA Multi-Year Resilience Strategy Guideline Compliant',
          suggestedAction: 'Adopt Partial Relocation + Nature-Based Bio-Shield protection.'
        }
      };
    }

    if (q.includes('prevention') || q.includes('long term') || q.includes('future')) {
      return {
        text: `**Long-Term Disaster Prevention Roadmap for ${selectedSettlement.name}:**\n1. **Estuarine Drainage Automation:** Sluice gates & canal desilting (Prevents +1.2m fluvial backwater surge).\n2. **Mangrove Bio-Shield:** 4.5km coastal mangrove buffer + submerged rip-rap breakwater.\n3. **Elevated SH-49 Corridor:** Permanent 4-lane elevated causeway ensuring zero flood cutoff.\n4. **Expected Outcome:** Drives residual multi-hazard risk down from **91/100 to 24/100 (LOW)**.`,
        metadata: {
          whyExplanation: `Transforms the disaster lifecycle from reactive response to permanent structural and ecological mitigation.`,
          confidenceScore: 92,
          dataSourceProvenance: 'RAKSHA Prevention Engine & Coastal Zone Masterplan',
          humanReviewStatus: 'Statutory R&R Framework Alignment',
          suggestedAction: 'Open the Prevention Engine view to simulate residual risk reductions.'
        }
      };
    }

    // Default intelligent synthesis
    return {
      text: `Based on live intelligence for **${selectedSettlement.name}**, the overall risk is **${selectedSettlement.overallRisk}/100**. AI recommendation is **${selectedSettlement.aiRecommendation.replace('_', ' ')}** for ${selectedSettlement.relocationPopulation.toLocaleString()} residents to **Site B (Pothigai Haven)**, preventing ₹${selectedSettlement.costOfInactionCr} Cr in future inaction damages.`,
      metadata: {
        whyExplanation: `Multi-criteria evaluation combining exposure (94), vulnerability (88), and verified 3.4m scarp retreat.`,
        confidenceScore: selectedSettlement.dataConfidence,
        dataSourceProvenance: 'Integrated Multi-Hazard Risk & Digital Twin Engine',
        humanReviewStatus: selectedSettlement.humanReviewStatus || 'Pending Human Review',
        suggestedAction: 'Inspect Decision Brief or Scenario Simulator for policy comparisons.'
      }
    };
  }
}
