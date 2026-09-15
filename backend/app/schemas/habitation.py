from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict


class MicroZoneSchema(BaseModel):
    id: str
    name: str
    zone_code: str
    population: int
    households: int
    risk_score: int
    risk_level: str
    primary_hazard: str
    recommendation: str
    reason: Optional[str] = None
    coordinates: Optional[List[Any]] = None
    vulnerable_people_count: Optional[int] = 0
    kutcha_houses_count: Optional[int] = 0
    distance_to_coastline_meters: Optional[float] = 0.0

    model_config = ConfigDict(from_attributes=True)


class HazardScoreSchema(BaseModel):
    id: Optional[str] = None
    type: str
    name: str
    score: int
    trend: str
    confidence: int
    last_updated: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class HabitationSchema(BaseModel):
    id: str
    name: str
    district: str
    state: str = "Tamil Nadu"
    latitude: float
    longitude: float
    population: int
    households: int
    area_sq_km: float
    dominant_hazard: str
    settlement_type: str
    is_urban: bool = False

    overall_risk: int
    baseline_risk: int
    exposure_score: int
    vulnerability_score: int
    resilience_score: int
    data_confidence: int

    priority: str
    emergency_urgency: Optional[str] = "MEDIUM_TERM"
    long_term_priority: Optional[str] = "MEDIUM"
    priority_score: int
    ai_recommendation: str
    recommendation_reason: Optional[str] = None
    status: str

    exposed_population: int
    exposed_percentage: int
    children_count: int
    elderly_count: int
    special_assistance_count: int

    relocation_population: int
    adaptation_population: int
    protection_population: int
    recommended_site_id: Optional[str] = None

    cost_protect_cr: float
    cost_adapt_cr: float
    cost_relocate_cr: float
    cost_of_inaction_cr: float

    field_verified: bool = False
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class HabitationDetailSchema(HabitationSchema):
    primary_evac_route: Optional[str] = None
    secondary_evac_route: Optional[str] = None
    evac_bottleneck: Optional[str] = None
    evacuation_time_min: Optional[int] = 30
    field_verification_notes: Optional[str] = None
    verified_by: Optional[str] = None
    last_updated: Optional[str] = None

    micro_zones: List[MicroZoneSchema] = []
    hazards: List[HazardScoreSchema] = []

    model_config = ConfigDict(from_attributes=True)


class HabitationListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[HabitationSchema]

    model_config = ConfigDict(from_attributes=True)
