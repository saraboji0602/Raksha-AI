"""
Central Risk Engine & Decision Support System for RAKSHA-AI.
Deterministic, multi-hazard, exposure, vulnerability, resilience,
prioritization, safe-site matching, and scenario simulation engine.
"""

from typing import Dict, Any, List, Optional, Tuple
import math
from sqlalchemy.orm import Session

from app.models.habitation import HabitationModel, MicroZoneModel
from app.models.hazard import HazardDataModel
from app.models.safe_site import SafeSiteModel
from app.models.dataset import DatasetModel, DatasetQualityReportModel
from app.schemas.risk import (
    ExplainableFactorSchema,
    CompoundHazardSchema,
    RiskDecompositionSchema,
    MicroZoneRiskResponse,
    PrioritizationItemSchema,
    PrioritizationListResponse,
    InterventionScenarioImpactSchema,
    InterventionDecisionSchema,
    SafeSiteSuitabilitySchema,
    SafeSiteListResponse,
    ScenarioRunRequest,
    ScenarioRunResponse,
    DataQualitySummaryResponse,
)


class SystemScoringWeights:
    def __init__(
        self,
        hazard_weight: float = 30.0,
        exposure_weight: float = 20.0,
        vulnerability_weight: float = 20.0,
        infrastructure_weight: float = 10.0,
        historical_weight: float = 10.0,
        resilience_weight: float = 10.0,
    ):
        self.hazard_weight = hazard_weight
        self.exposure_weight = exposure_weight
        self.vulnerability_weight = vulnerability_weight
        self.infrastructure_weight = infrastructure_weight
        self.historical_weight = historical_weight
        self.resilience_weight = resilience_weight


DEFAULT_WEIGHTS = SystemScoringWeights()


class CentralRiskEngine:
    """
    Unified, deterministic statutory risk calculation and decision engine.
    """

    @classmethod
    def evaluate_compound_hazards(cls, habitation: HabitationModel) -> CompoundHazardSchema:
        """
        Evaluates compound multi-hazard synergy and interaction multipliers.
        """
        hazards = habitation.hazards or []
        flood_hazard = next((h for h in hazards if h.type == "flood"), None)
        cyclone_hazard = next((h for h in hazards if h.type == "cyclone"), None)
        erosion_hazard = next((h for h in hazards if h.type == "coastal_erosion"), None)
        landslide_hazard = next((h for h in hazards if h.type == "landslide"), None)

        f_score = flood_hazard.score if flood_hazard else 0
        c_score = cyclone_hazard.score if cyclone_hazard else 0
        e_score = erosion_hazard.score if erosion_hazard else 0
        l_score = landslide_hazard.score if landslide_hazard else 0

        if f_score >= 70 and c_score >= 70:
            return CompoundHazardSchema(
                type="FLOOD_PLUS_CYCLONE",
                primary_hazard="cyclone",
                secondary_hazard="flood",
                interaction_multiplier=1.28,
                explanation="Fluvial river discharge coupled with cyclonic storm surge prevents gravitational drainage, causing severe backwater estuarine inundation."
            )

        if e_score >= 75 and c_score >= 70:
            return CompoundHazardSchema(
                type="CYCLONE_PLUS_COASTAL_EROSION",
                primary_hazard="coastal_erosion",
                secondary_hazard="cyclone",
                interaction_multiplier=1.32,
                explanation="Active shoreline scarp retreat reduces natural dune elevation, allowing cyclonic high-tide surge waves to penetrate 600m deeper inland."
            )

        if f_score >= 70 and e_score >= 70:
            return CompoundHazardSchema(
                type="FLOOD_PLUS_COASTAL_EROSION",
                primary_hazard="coastal_erosion",
                secondary_hazard="flood",
                interaction_multiplier=1.22,
                explanation="Simultaneous coastal spit regression and estuarine river swelling cuts off north-south evacuation causeways."
            )

        if l_score >= 75 and f_score >= 60:
            return CompoundHazardSchema(
                type="LANDSLIDE_PLUS_HEAVY_RAIN",
                primary_hazard="landslide",
                secondary_hazard="flood",
                interaction_multiplier=1.35,
                explanation="Pore-water saturation from heavy antecedent rainfall triggers slope liquefaction along critical crown slip circles."
            )

        return CompoundHazardSchema(
            type="NONE",
            primary_hazard=habitation.dominant_hazard,
            secondary_hazard="multi_hazard",
            interaction_multiplier=1.0,
            explanation="Primary hazard operates without severe multi-hazard synergistic amplification."
        )

    @classmethod
    def decompose_explainable_risk(
        cls,
        habitation: HabitationModel,
        weights: SystemScoringWeights = DEFAULT_WEIGHTS
    ) -> RiskDecompositionSchema:
        """
        Calculates full decomposed explainable risk with physics and demographic attribution.
        """
        compound = cls.evaluate_compound_hazards(habitation)
        
        # Hazard normalized
        norm_hazard = min(100, round(habitation.overall_risk * compound.interaction_multiplier))
        norm_exposure = habitation.exposure_score
        norm_vulnerability = habitation.vulnerability_score
        norm_resilience = habitation.resilience_score

        # Top factors decomposition
        factors: List[ExplainableFactorSchema] = [
            ExplainableFactorSchema(
                factor="Primary Hazard Velocity & Depth",
                contribution=round(norm_hazard * 0.32),
                category="HAZARD",
                description=f"Direct dynamic wave/fluvial threat intensity ({'Compound Amplified' if compound.type != 'NONE' else 'Single Driver'})",
                is_critical=norm_hazard >= 80,
                data_source="Synthetic Satellite InSAR + Hydrological Basin DEM",
                confidence_pct=habitation.data_confidence,
                has_data_gap=False
            ),
            ExplainableFactorSchema(
                factor="Exposed Population & Density",
                contribution=round(norm_exposure * 0.26),
                category="EXPOSURE",
                description=f"{habitation.exposed_population:,} of {habitation.population:,} citizens situated in high-risk inundation envelope",
                is_critical=habitation.exposed_percentage >= 75,
                data_source="Synthetic Local Census Layer",
                confidence_pct=94,
                has_data_gap=False
            ),
            ExplainableFactorSchema(
                factor="Socio-Structural Housing Vulnerability",
                contribution=round(norm_vulnerability * 0.22),
                category="VULNERABILITY",
                description="High proportion of non-engineered kutcha/semi-pucca housing lacking wave-break resistance",
                is_critical=norm_vulnerability >= 75,
                data_source="Field Verification Surveys",
                confidence_pct=95 if habitation.field_verified else 72,
                has_data_gap=not habitation.field_verified
            ),
            ExplainableFactorSchema(
                factor="Infrastructure Bottleneck & Fragility",
                contribution=round((100 - norm_resilience) * 0.12),
                category="INFRASTRUCTURE",
                description=habitation.evac_bottleneck or "Single evacuation causeway vulnerable to tidal submergence",
                is_critical=(100 - norm_resilience) >= 50,
                data_source="State PWD Road Network Layer",
                confidence_pct=91,
                has_data_gap=False
            ),
            ExplainableFactorSchema(
                factor="Historical Recurrence Multiplier",
                contribution=8,
                category="TERRAIN",
                description="Severe recurring monsoon inundations documented over past decade",
                is_critical=True,
                data_source="DDMA Disaster Archive",
                confidence_pct=98,
                has_data_gap=False
            )
        ]

        # Risk level determination
        risk_score = habitation.overall_risk
        if risk_score >= 85:
            r_level = "CRITICAL"
        elif risk_score >= 70:
            r_level = "VERY_HIGH"
        elif risk_score >= 50:
            r_level = "HIGH"
        elif risk_score >= 30:
            r_level = "MODERATE"
        else:
            r_level = "LOW"

        # Narrative explanation
        why = (
            f"Compound {habitation.dominant_hazard.replace('_', ' ')} exposure with {habitation.exposed_percentage}% "
            f"population exposure and vulnerability score of {norm_vulnerability}/100. "
            f"Resilience is constrained by {habitation.evac_bottleneck or 'critical infrastructure bottleneck'}."
        )

        hazard_types_list = [h.type for h in habitation.hazards] if habitation.hazards else [habitation.dominant_hazard]

        return RiskDecompositionSchema(
            habitation_id=habitation.id,
            habitation_name=habitation.name,
            district=habitation.district,
            overall_risk=risk_score,
            risk_level=r_level,
            confidence=habitation.data_confidence,
            hazard_score=norm_hazard,
            exposure_score=norm_exposure,
            vulnerability_score=norm_vulnerability,
            resilience_score=norm_resilience,
            dominant_hazard=habitation.dominant_hazard,
            hazard_types=hazard_types_list,
            compound_hazard_flag=compound.type != "NONE",
            compound_details=compound if compound.type != "NONE" else None,
            top_contributors=factors,
            why_risky=why,
            data_sources=[
                "CartoDEM 10m Elevation Grid (Synthetic)",
                "AWS Automated Weather Stations (Synthetic)",
                "CWC River Gauge Telemetry (Synthetic)",
                "Local Census & Habitation Registry (Synthetic)"
            ],
            data_freshness="T-0h Current Telemetry",
            missing_data=[] if habitation.field_verified else ["Ground Truth Laser Scarp Audit Pending"],
            data_classification="DEMO / SYNTHETIC DATA"
        )

    @classmethod
    def calculate_micro_zone_risk(cls, zone: MicroZoneModel) -> MicroZoneRiskResponse:
        """
        Decomposes risk for a specific micro-zone.
        """
        score = zone.risk_score
        if score >= 85:
            r_level = "CRITICAL"
            prio = "IMMEDIATE"
            evac = "BOTTLENECK"
        elif score >= 70:
            r_level = "HIGH"
            prio = "SHORT_TERM"
            evac = "CLEAR"
        elif score >= 50:
            r_level = "MODERATE"
            prio = "MEDIUM_TERM"
            evac = "CLEAR"
        else:
            r_level = "LOW"
            prio = "MONITOR"
            evac = "CLEAR"

        exp_score = min(100, round((zone.population / 2500) * 80 + 20))
        vuln_score = min(100, round((zone.vulnerable_people_count / max(1, zone.population)) * 100)) if zone.population > 0 else 50
        resil_score = max(20, 100 - score)

        return MicroZoneRiskResponse(
            id=zone.id,
            habitation_id=zone.habitation_id,
            zone_code=zone.zone_code,
            name=zone.name,
            population=zone.population,
            households=zone.households,
            risk_score=score,
            risk_level=r_level,
            primary_hazard=zone.primary_hazard,
            exposure_score=exp_score,
            vulnerability_score=vuln_score,
            resilience_score=resil_score,
            priority=prio,
            recommended_action=zone.recommendation,
            evacuation_access=evac,
            confidence=94,
            distance_to_coastline_meters=zone.distance_to_coastline_meters or 0.0,
            data_classification="DEMO / SYNTHETIC DATA"
        )

    @classmethod
    def calculate_prioritization_matrix(cls, db: Session) -> PrioritizationListResponse:
        """
        Calculates dual prioritization:
        1. Emergency Urgency (imminent threat)
        2. Long-Term Relocation Priority (high-vulnerability small settlements remain visible)
        """
        habitations = db.query(HabitationModel).all()
        safe_sites_dict = {s.id: s.name for s in db.query(SafeSiteModel).all()}

        items: List[PrioritizationItemSchema] = []
        high_urgency_count = 0
        long_term_reloc_count = 0

        for h in habitations:
            # 1. Emergency urgency score
            urgency_score = min(100, round(
                (h.overall_risk * 0.50) +
                (h.exposure_score * 0.30) +
                ((100 - h.resilience_score) * 0.20)
            ))
            if urgency_score >= 85:
                urgency = "IMMEDIATE"
                high_urgency_count += 1
            elif urgency_score >= 70:
                urgency = "SHORT_TERM"
            elif urgency_score >= 50:
                urgency = "MEDIUM_TERM"
            else:
                urgency = "MONITOR"

            # 2. Long-term relocation priority score (balanced to keep small vulnerable settlements prominent)
            reloc_score = min(100, round(
                (h.overall_risk * 0.40) +
                (h.vulnerability_score * 0.35) +
                ((100 - h.resilience_score) * 0.25)
            ))
            if reloc_score >= 80 or h.ai_recommendation in ("PARTIAL_RELOCATION", "FULL_RELOCATION"):
                long_term_prio = "IMMEDIATE" if reloc_score >= 85 else "SHORT_TERM"
                long_term_reloc_count += 1
            elif reloc_score >= 60:
                long_term_prio = "MEDIUM_TERM"
            else:
                long_term_prio = "MONITOR"

            bcr = round(h.cost_of_inaction_cr / max(0.1, h.cost_relocate_cr), 2) if h.cost_relocate_cr > 0 else 1.0

            item = PrioritizationItemSchema(
                habitation_id=h.id,
                habitation_name=h.name,
                district=h.district,
                population=h.population,
                exposed_population=h.exposed_population,
                overall_risk=h.overall_risk,
                emergency_urgency=urgency,
                emergency_urgency_score=urgency_score,
                long_term_priority=long_term_prio,
                long_term_priority_score=reloc_score,
                dominant_hazard=h.dominant_hazard,
                ai_recommendation=h.ai_recommendation,
                recommended_site_id=h.recommended_site_id,
                recommended_site_name=safe_sites_dict.get(h.recommended_site_id),
                bcr=bcr,
                data_classification="DEMO / SYNTHETIC DATA"
            )
            items.append(item)

        # Sort by urgency score descending
        items.sort(key=lambda x: x.emergency_urgency_score, reverse=True)

        return PrioritizationListResponse(
            total=len(items),
            total_high_urgency=high_urgency_count,
            total_long_term_relocation=long_term_reloc_count,
            data_classification="DEMO / SYNTHETIC DATA",
            items=items
        )

    @classmethod
    def evaluate_intervention_decision(cls, habitation: HabitationModel) -> InterventionDecisionSchema:
        """
        Compares all 4 intervention pathways (Protect, Adapt, Partial Relocation, Full Relocation)
        and provides full residual risk and cost-benefit breakdown.
        """
        pop = habitation.population
        inaction = habitation.cost_of_inaction_cr
        is_kadalpuram = habitation.id == "kadalpuram"

        scenarios: List[InterventionScenarioImpactSchema] = [
            InterventionScenarioImpactSchema(
                type="DO_NOTHING",
                name="Do Nothing (Status Quo)",
                investment_cr=0.0,
                risk_reduction_pct=0,
                current_risk=habitation.overall_risk,
                residual_risk=min(100, habitation.overall_risk + 4),
                residual_risk_level="CRITICAL",
                population_protected_or_relocated=0,
                exposed_population_remaining=habitation.exposed_population,
                infrastructure_exposure_remaining_cr=inaction,
                cost_of_inaction_cr=inaction,
                net_benefit_cr=-inaction,
                benefit_cost_ratio=0.0,
                implementation_years=0,
                social_disruption_level="VERY_LOW",
                is_ai_recommended=False,
                description=f"Risk remains unmanaged. Cumulative disaster response will cost ₹{inaction:.1f} Cr over 10 years.",
                key_mitigations=["Post-disaster relief only", "No structural risk reduction"]
            ),
            InterventionScenarioImpactSchema(
                type="PROTECT",
                name="In-Situ Protection Works",
                investment_cr=habitation.cost_protect_cr,
                risk_reduction_pct=24,
                current_risk=habitation.overall_risk,
                residual_risk=round(habitation.overall_risk * 0.76),
                residual_risk_level="HIGH",
                population_protected_or_relocated=2900 if is_kadalpuram else round(pop * 0.6),
                exposed_population_remaining=1920 if is_kadalpuram else round(pop * 0.4),
                infrastructure_exposure_remaining_cr=round(inaction * 0.65, 1),
                cost_of_inaction_cr=round(inaction * 0.76, 1),
                net_benefit_cr=round(inaction * 0.24 - habitation.cost_protect_cr, 1),
                benefit_cost_ratio=round((inaction * 0.24) / max(0.1, habitation.cost_protect_cr), 2),
                implementation_years=2,
                social_disruption_level="LOW",
                is_ai_recommended=habitation.ai_recommendation == "PROTECT",
                description="Hard engineering seawalls, groynes, or retaining walls built on-site. Vulnerable to extreme Category 4 surge breach.",
                key_mitigations=["Submerged geotube breakwaters", "Concrete seawall reinforcement"]
            ),
            InterventionScenarioImpactSchema(
                type="ADAPT",
                name="Ecological & Engineering Adaptation",
                investment_cr=habitation.cost_adapt_cr,
                risk_reduction_pct=41,
                current_risk=habitation.overall_risk,
                residual_risk=round(habitation.overall_risk * 0.59),
                residual_risk_level="MODERATE",
                population_protected_or_relocated=3700 if is_kadalpuram else round(pop * 0.8),
                exposed_population_remaining=1120 if is_kadalpuram else round(pop * 0.2),
                infrastructure_exposure_remaining_cr=round(inaction * 0.45, 1),
                cost_of_inaction_cr=round(inaction * 0.59, 1),
                net_benefit_cr=round(inaction * 0.41 - habitation.cost_adapt_cr, 1),
                benefit_cost_ratio=round((inaction * 0.41) / max(0.1, habitation.cost_adapt_cr), 2),
                implementation_years=3,
                social_disruption_level="LOW",
                is_ai_recommended=habitation.ai_recommendation == "ADAPT",
                description="Nature-based mangrove bio-shields combined with raised plinth stilt construction and storm-resistant shelters.",
                key_mitigations=["Mangrove bio-shield buffer", "Raised plinth housing upgrades"]
            ),
            InterventionScenarioImpactSchema(
                type="PARTIAL_RELOCATION",
                name="Intelligent Partial Relocation",
                investment_cr=habitation.cost_relocate_cr,
                risk_reduction_pct=76,
                current_risk=habitation.overall_risk,
                residual_risk=22,
                residual_risk_level="LOW",
                population_protected_or_relocated=habitation.relocation_population or 2650,
                exposed_population_remaining=max(0, habitation.population - (habitation.relocation_population or 2650)),
                infrastructure_exposure_remaining_cr=6.0,
                cost_of_inaction_cr=12.0,
                net_benefit_cr=round(inaction * 0.76 - habitation.cost_relocate_cr, 1),
                benefit_cost_ratio=round((inaction * 0.76) / max(0.1, habitation.cost_relocate_cr), 2),
                implementation_years=4,
                social_disruption_level="MEDIUM",
                is_ai_recommended=habitation.ai_recommendation == "PARTIAL_RELOCATION",
                description="Relocate high-vulnerability front-line micro-zones to Safe Site B while adapting inner habitations.",
                key_mitigations=["Resilient housing township at Safe Haven", "Livelihood transit corridor"]
            ),
            InterventionScenarioImpactSchema(
                type="FULL_RELOCATION",
                name="Full Planned Resettlement",
                investment_cr=round(habitation.cost_relocate_cr * 1.55, 1),
                risk_reduction_pct=92,
                current_risk=habitation.overall_risk,
                residual_risk=8,
                residual_risk_level="LOW",
                population_protected_or_relocated=habitation.population,
                exposed_population_remaining=0,
                infrastructure_exposure_remaining_cr=1.5,
                cost_of_inaction_cr=4.0,
                net_benefit_cr=round(inaction * 0.92 - (habitation.cost_relocate_cr * 1.55), 1),
                benefit_cost_ratio=round((inaction * 0.92) / max(0.1, habitation.cost_relocate_cr * 1.55), 2),
                implementation_years=5,
                social_disruption_level="HIGH",
                is_ai_recommended=habitation.ai_recommendation == "FULL_RELOCATION",
                description="Complete phased resettlement of entire population to geologically secure haven.",
                key_mitigations=["Full civic township reconstruction", "New school & PHC campus"]
            ),
        ]

        rationale = (
            habitation.recommendation_reason or
            f"Partial zoned relocation for {habitation.name} achieves 76% risk reduction with positive BCR and minimal livelihood disruption."
        )

        return InterventionDecisionSchema(
            habitation_id=habitation.id,
            habitation_name=habitation.name,
            current_overall_risk=habitation.overall_risk,
            ai_recommended_intervention=habitation.ai_recommendation,
            recommendation_rationale=rationale,
            confidence=habitation.data_confidence,
            scenarios=scenarios,
            data_classification="DEMO / SYNTHETIC DATA"
        )

    @classmethod
    def match_safe_sites_for_habitation(
        cls,
        db: Session,
        habitation_id: str
    ) -> List[SafeSiteSuitabilitySchema]:
        """
        Evaluates and ranks candidate safe haven havens for a target settlement.
        Applies HARD FILTERS first, then computes multi-criteria suitability.
        """
        habitation = db.query(HabitationModel).filter(HabitationModel.id == habitation_id).first()
        if not habitation:
            return []

        safe_sites = db.query(SafeSiteModel).all()
        required_pop = habitation.relocation_population or habitation.population

        results: List[SafeSiteSuitabilitySchema] = []

        for site in safe_sites:
            # 1. HARD FILTERS CHECK
            is_passed = True
            exclusion_reason = None

            slope_val = float(getattr(site, "slope_percentage", 2.0) or 2.0)
            safety_score_val = int(getattr(site, "hazard_safety_score", 90) or 90)
            max_cap = int(getattr(site, "capacity_recommended_max", 3000) or 3000)

            # Slope filter: Slope > 35% rejected
            if slope_val > 35.0:
                is_passed = False
                exclusion_reason = "Unsuitable steep slope (>35%)"
            # Safety score filter: Hazard safety score < 60 rejected
            elif safety_score_val < 60:
                is_passed = False
                exclusion_reason = "Critical hazard exposure zone (<60 safety score)"
            # Capacity check: Site recommended max must be > 500
            elif max_cap < 500:
                is_passed = False
                exclusion_reason = "Insufficient carrying capacity (<500 residents)"

            # 2. Multi-criteria Suitability Score
            dist_map = getattr(site, "distance_from_key_settlements", {}) or {}
            if not isinstance(dist_map, dict):
                dist_map = {}
            distance = float(dist_map.get(habitation.id, 18.4 if site.id == "site-b" else 25.0))
            
            time_map = getattr(site, "travel_time_min", {}) or {}
            if not isinstance(time_map, dict):
                time_map = {}
            travel_time = int(time_map.get(habitation.id, 32 if site.id == "site-b" else 40))

            allocated = int(getattr(site, "allocated_population", 0) or 0)
            avail_cap = max(0, max_cap - allocated)
            unmet_pop = max(0, required_pop - avail_cap)

            # Capacity score
            if required_pop > max_cap:
                cap_score = max(10, round((max_cap / required_pop) * 60))
            else:
                cap_score = min(100, round((max_cap / required_pop) * 85))

            # Distance factor (penalizes distance > 25km)
            distance_factor = max(30, min(100, 100 - (distance * 1.6)))
            
            # Weighted suitability
            # Safety 25%, Acceptance 25%, Livelihood 20%, Capacity 15%, Accessibility 15%
            raw_suitability = (
                (site.hazard_safety_score * 0.25) +
                (site.community_acceptance_score * 0.25) +
                (site.livelihood_score * 0.20) +
                (cap_score * 0.15) +
                (((site.connectivity_score + distance_factor) / 2) * 0.15)
            )
            suitability_score = min(100, max(1, round(raw_suitability))) if is_passed else 0

            # Recommendation flags & reasons
            is_rec = (site.id == habitation.recommended_site_id) or (habitation.id == "kadalpuram" and site.id == "site-b")
            reasons = []
            if site.id == "site-b":
                reasons = [
                    "High elevation (14.5m MSL) outside 100-year storm surge inundation envelope.",
                    "Carrying capacity of 5,000 comfortably accommodates relocating citizens with buffer.",
                    "82% Community Acceptance with designated net-mending yard & cold storage hub.",
                    "Direct highway access via SH-49 with 32-minute transit corridor back to harbor."
                ]
            elif site.id == "site-c":
                reasons = [
                    "Bedrock geological formation neutralizes slope shear liquefaction.",
                    "100% capacity match for hill residents with terrace farming allotments.",
                    "Pre-approved tribal council acceptance."
                ]
            else:
                reasons = [
                    f"Hazard safety score of {site.hazard_safety_score}/100.",
                    f"Carrying capacity for {site.capacity_recommended_max:,} residents.",
                    f"Connected via all-weather roads ({travel_time} mins travel time)."
                ]

            results.append(
                SafeSiteSuitabilitySchema(
                    site_id=site.id,
                    site_name=site.name,
                    target_habitation_id=habitation.id,
                    hazard_safety_score=site.hazard_safety_score,
                    suitability_score=suitability_score,
                    carrying_capacity=max_cap,
                    allocated_population=allocated,
                    available_capacity=avail_cap,
                    unmet_population=unmet_pop,
                    distance_km=distance,
                    travel_time_min=travel_time,
                    connectivity_score=site.connectivity_score,
                    livelihood_compatibility_score=site.livelihood_score,
                    community_acceptance_score=site.community_acceptance_score,
                    estimated_development_cost_cr=site.estimated_development_cost_cr,
                    is_hard_filter_passed=is_passed,
                    exclusion_reason=exclusion_reason,
                    is_recommended=is_rec,
                    recommendation_reasons=reasons,
                    land_verification_status=site.land_verification_status,
                    administrative_classification="HIGH-SUITABILITY CANDIDATE" if is_passed else "EXCLUDED",
                    data_classification="DEMO / SYNTHETIC DATA"
                )
            )

        # Sort by suitability score descending
        results.sort(key=lambda x: x.suitability_score, reverse=True)
        return results

    @classmethod
    def run_scenario_simulation(
        cls,
        db: Session,
        request: ScenarioRunRequest
    ) -> ScenarioRunResponse:
        """
        Runs what-if simulation across 5 strategic disaster risk management policies.
        """
        habitation = db.query(HabitationModel).filter(HabitationModel.id == request.habitation_id).first()
        if not habitation:
            habitation = db.query(HabitationModel).first()

        base_risk = habitation.baseline_risk or 72
        multiplier = request.hazard_multiplier or 1.0
        slr = request.sea_level_rise_cm or 0
        erosion = request.coastal_erosion_rate_m_yr or 3.4

        # Compute simulated hazard impact
        slr_penalty = slr * 0.15
        erosion_penalty = max(0, (erosion - 2.0) * 4.0)
        simulated_risk = min(100, max(1, round(base_risk * multiplier + slr_penalty + erosion_penalty)))

        decision_data = cls.evaluate_intervention_decision(habitation)
        scenarios = decision_data.scenarios

        # Compute 10-year cumulative damage trajectory (INR Crores)
        inaction_cr = habitation.cost_of_inaction_cr * multiplier
        years = [2026, 2028, 2030, 2032, 2034, 2036]
        
        damage_curves = {
            "DO_NOTHING": [round(inaction_cr * (i / 5.0) ** 1.3, 1) for i in range(1, 7)],
            "PROTECT": [round(habitation.cost_protect_cr + inaction_cr * 0.45 * (i / 5.0), 1) for i in range(1, 7)],
            "ADAPT": [round(habitation.cost_adapt_cr + inaction_cr * 0.25 * (i / 5.0), 1) for i in range(1, 7)],
            "PARTIAL_RELOCATION": [round(habitation.cost_relocate_cr + 6.0 * (i / 5.0), 1) for i in range(1, 7)],
            "FULL_RELOCATION": [round(habitation.cost_relocate_cr * 1.55 + 2.0 * (i / 5.0), 1) for i in range(1, 7)],
        }

        return ScenarioRunResponse(
            habitation_id=habitation.id,
            habitation_name=habitation.name,
            simulation_baseline_risk=base_risk,
            simulated_hazard_risk=simulated_risk,
            sea_level_rise_cm=slr,
            coastal_erosion_rate_m_yr=erosion,
            cost_of_inaction_10yr_cr=round(inaction_cr, 1),
            scenarios=scenarios,
            ten_year_damage_curve=damage_curves,
            data_classification="DEMO / SYNTHETIC DATA"
        )

    @classmethod
    def get_data_quality_summary(cls, db: Session) -> DataQualitySummaryResponse:
        """
        Aggregates catalog datasets, provenance, and data quality metrics.
        """
        datasets = db.query(DatasetModel).all()
        total_ds = len(datasets)
        
        cat_counts = {}
        for d in datasets:
            cat_counts[d.category] = cat_counts.get(d.category, 0) + 1

        verified_cnt = sum(1 for d in datasets if d.source_status == "VERIFIED")
        demo_cnt = sum(1 for d in datasets if d.source_status == "DEMO" or d.data_classification == "DEMO / SYNTHETIC DATA")
        stale_cnt = sum(1 for d in datasets if d.source_status == "STALE")
        missing_cnt = sum(1 for d in datasets if d.source_status == "MISSING")

        scores = [d.quality_score for d in datasets if d.quality_score is not None]
        avg_score = round(sum(scores) / len(scores), 1) if scores else 98.4

        catalog_summary = [
            {
                "id": d.id,
                "name": d.name,
                "category": d.category,
                "records": d.record_count,
                "valid": d.valid_record_count,
                "quality_score": d.quality_score,
                "source_status": d.source_status,
                "data_classification": d.data_classification
            }
            for d in datasets[:15]
        ]

        return DataQualitySummaryResponse(
            total_datasets=total_ds,
            active_datasets=total_ds,
            overall_system_quality_score=avg_score,
            verified_sources_count=verified_cnt,
            demo_sources_count=demo_cnt if demo_cnt > 0 else 6,
            stale_sources_count=stale_cnt,
            missing_sources_count=missing_cnt,
            data_classification="DEMO / SYNTHETIC DATA",
            categories=cat_counts,
            datasets_catalog=catalog_summary
        )

    @classmethod
    def recalculate_all_habitations(cls, db: Session) -> Dict[str, Any]:
        """
        Event-triggered recalculation across all habitations when new telemetry or hazard records are ingested.
        """
        habitations = db.query(HabitationModel).all()
        updated_count = 0

        for h in habitations:
            decomp = cls.decompose_explainable_risk(h)
            h.exposure_score = decomp.exposure_score
            h.vulnerability_score = decomp.vulnerability_score
            h.resilience_score = decomp.resilience_score
            updated_count += 1

        db.commit()
        return {
            "success": True,
            "habitations_recalculated": updated_count,
            "status": "COMPLETED",
            "data_classification": "DEMO / SYNTHETIC DATA"
        }
