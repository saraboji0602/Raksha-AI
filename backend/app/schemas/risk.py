"""
Risk Engine & Decision Intelligence Pydantic Schemas for RAKSHA-AI.
Covers decomposed explainable risk, multi-hazard, exposure, vulnerability,
resilience, dual-prioritization, safe-site suitability, and scenario simulations.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ExplainableFactorSchema(BaseModel):
    factor: str
    contribution: int  # e.g. +24
    category: str  # HAZARD, EXPOSURE, VULNERABILITY, RESILIENCE, INFRASTRUCTURE
    description: str
    is_critical: bool = False
    data_source: Optional[str] = None
    confidence_pct: Optional[int] = 90
    has_data_gap: bool = False

    model_config = ConfigDict(from_attributes=True)


class CompoundHazardSchema(BaseModel):
    type: str  # FLOOD_PLUS_CYCLONE, CYCLONE_PLUS_COASTAL_EROSION, etc.
    primary_hazard: str
    secondary_hazard: str
    interaction_multiplier: float
    explanation: str

    model_config = ConfigDict(from_attributes=True)


class RiskDecompositionSchema(BaseModel):
    habitation_id: str
    habitation_name: str
    district: str
    overall_risk: int
    risk_level: str  # CRITICAL, VERY_HIGH, HIGH, MODERATE, LOW
    confidence: int  # 0-100%
    
    # Sub-component scores
    hazard_score: int
    exposure_score: int
    vulnerability_score: int
    resilience_score: int
    
    # Multi-hazard metadata
    dominant_hazard: str
    hazard_types: List[str] = []
    compound_hazard_flag: bool = False
    compound_details: Optional[CompoundHazardSchema] = None
    
    # Explainability
    top_contributors: List[ExplainableFactorSchema] = []
    why_risky: str
    data_sources: List[str] = []
    data_freshness: str = "T-0h Current Telemetry"
    missing_data: List[str] = []
    
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class MicroZoneRiskResponse(BaseModel):
    id: str
    habitation_id: str
    zone_code: str
    name: str
    population: int
    households: int
    risk_score: int
    risk_level: str
    primary_hazard: str
    exposure_score: int
    vulnerability_score: int
    resilience_score: int
    priority: str  # IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR
    recommended_action: str  # PROTECT, ADAPT, PARTIAL_RELOCATION, FULL_RELOCATION
    evacuation_access: str  # CLEAR, BOTTLENECK, SEVERED
    confidence: int
    distance_to_coastline_meters: float = 0.0
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class PrioritizationItemSchema(BaseModel):
    habitation_id: str
    habitation_name: str
    district: str
    population: int
    exposed_population: int
    overall_risk: int
    emergency_urgency: str  # IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR
    emergency_urgency_score: int  # 0-100
    long_term_priority: str  # IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR
    long_term_priority_score: int  # 0-100
    dominant_hazard: str
    ai_recommendation: str
    recommended_site_id: Optional[str] = None
    recommended_site_name: Optional[str] = None
    bcr: float
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class PrioritizationListResponse(BaseModel):
    total: int
    total_high_urgency: int
    total_long_term_relocation: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[PrioritizationItemSchema]

    model_config = ConfigDict(from_attributes=True)


class InterventionScenarioImpactSchema(BaseModel):
    type: str  # DO_NOTHING, PROTECT, ADAPT, PARTIAL_RELOCATION, FULL_RELOCATION
    name: str
    investment_cr: float
    risk_reduction_pct: int
    current_risk: int
    residual_risk: int
    residual_risk_level: str
    population_protected_or_relocated: int
    exposed_population_remaining: int
    infrastructure_exposure_remaining_cr: float
    cost_of_inaction_cr: float
    net_benefit_cr: float
    benefit_cost_ratio: float
    implementation_years: int
    social_disruption_level: str  # VERY_LOW, LOW, MEDIUM, HIGH
    is_ai_recommended: bool
    description: str
    key_mitigations: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class InterventionDecisionSchema(BaseModel):
    habitation_id: str
    habitation_name: str
    current_overall_risk: int
    ai_recommended_intervention: str  # PROTECT, ADAPT, PARTIAL_RELOCATION, FULL_RELOCATION
    recommendation_rationale: str
    confidence: int
    scenarios: List[InterventionScenarioImpactSchema]
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class SafeSiteSuitabilitySchema(BaseModel):
    site_id: str
    site_name: str
    target_habitation_id: str
    hazard_safety_score: int
    suitability_score: int  # 0-100 match
    carrying_capacity: int
    allocated_population: int
    available_capacity: int
    unmet_population: int
    distance_km: float
    travel_time_min: int
    connectivity_score: int
    livelihood_compatibility_score: int
    community_acceptance_score: int
    estimated_development_cost_cr: float
    is_hard_filter_passed: bool
    exclusion_reason: Optional[str] = None
    is_recommended: bool
    recommendation_reasons: List[str] = []
    land_verification_status: str
    administrative_classification: str
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class SafeSiteListResponse(BaseModel):
    total: int
    total_haven_capacity: int
    total_allocated: int
    total_available_capacity: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[SafeSiteSuitabilitySchema]

    model_config = ConfigDict(from_attributes=True)


class ScenarioRunRequest(BaseModel):
    habitation_id: str = Field(default="kadalpuram", description="Target settlement identifier")
    hazard_multiplier: Optional[float] = Field(default=1.0, description="What-if surge/hazard intensity scalar [0.5 - 2.0]")
    sea_level_rise_cm: Optional[int] = Field(default=0, description="Simulated sea level rise addition in cm")
    coastal_erosion_rate_m_yr: Optional[float] = Field(default=3.4, description="Shoreline regression rate in meters per year")
    custom_mitigation_package: Optional[List[str]] = Field(default=None, description="Enabled engineering or nature-based packages")


class ScenarioRunResponse(BaseModel):
    habitation_id: str
    habitation_name: str
    simulation_baseline_risk: int
    simulated_hazard_risk: int
    sea_level_rise_cm: int
    coastal_erosion_rate_m_yr: float
    cost_of_inaction_10yr_cr: float
    scenarios: List[InterventionScenarioImpactSchema]
    ten_year_damage_curve: Dict[str, List[float]] = {}
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class DataQualitySummaryResponse(BaseModel):
    total_datasets: int
    active_datasets: int
    overall_system_quality_score: float
    verified_sources_count: int
    demo_sources_count: int
    stale_sources_count: int
    missing_sources_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    categories: Dict[str, int] = {}
    datasets_catalog: List[Dict[str, Any]] = []

    model_config = ConfigDict(from_attributes=True)
