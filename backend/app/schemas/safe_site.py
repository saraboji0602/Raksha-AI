from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class SafeSiteSchema(BaseModel):
    id: str
    name: str
    code: str
    district: str
    state: str = "Tamil Nadu"
    latitude: float
    longitude: float
    land_area_acres: float
    current_land_use: str
    elevation_meters: float
    distance_from_coast_km: float
    slope_percentage: float

    status: str
    land_verification_status: str
    overall_score: int
    hazard_safety_score: int
    land_availability_score: int
    connectivity_score: int
    water_score: int
    healthcare_score: int
    education_score: int
    livelihood_score: int

    capacity_recommended_max: int
    allocated_population: int
    bottleneck_resource: str

    community_acceptance_score: int
    livelihood_type: str

    estimated_development_cost_cr: float
    estimated_development_time_months: int

    distance_from_key_settlements: Optional[Dict[str, float]] = None
    travel_time_min: Optional[Dict[str, int]] = None
    road_quality: str

    description: Optional[str] = None
    selection_rationale: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class SafeSiteListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[SafeSiteSchema]

    model_config = ConfigDict(from_attributes=True)
