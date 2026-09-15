from sqlalchemy import Column, String, Integer, Float, Boolean, JSON, Text
from app.core.database import Base


class SafeSiteModel(Base):
    __tablename__ = "safe_sites"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    code = Column(String(64), nullable=False)
    district = Column(String(128), nullable=False, index=True)
    state = Column(String(64), default="Tamil Nadu")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    land_area_acres = Column(Float, default=10.0)
    current_land_use = Column(String(128), default="Government Wasteland (Gramanatham)")
    elevation_meters = Column(Float, default=15.0)
    distance_from_coast_km = Column(Float, default=10.0)
    slope_percentage = Column(Float, default=2.0)

    # Status & Suitability Scores
    status = Column(String(64), default="AI_IDENTIFIED")
    land_verification_status = Column(String(64), default="POTENTIALLY_SUITABLE")
    overall_score = Column(Integer, default=80)
    hazard_safety_score = Column(Integer, default=90)
    land_availability_score = Column(Integer, default=85)
    connectivity_score = Column(Integer, default=80)
    water_score = Column(Integer, default=75)
    healthcare_score = Column(Integer, default=70)
    education_score = Column(Integer, default=70)
    livelihood_score = Column(Integer, default=80)

    # Carrying Capacity
    capacity_recommended_max = Column(Integer, default=3000)
    allocated_population = Column(Integer, default=0)
    bottleneck_resource = Column(String(128), default="Potable Water Distribution")

    # Community Acceptance
    community_acceptance_score = Column(Integer, default=80)
    livelihood_type = Column(String(64), default="COASTAL_FISHING")

    # Financials & Time
    estimated_development_cost_cr = Column(Float, default=15.0)
    estimated_development_time_months = Column(Integer, default=18)

    # Distance / Travel time from key settlements
    distance_from_key_settlements = Column(JSON, nullable=True)  # {"kadalpuram": 18.4, "malaiyur": 45.0}
    travel_time_min = Column(JSON, nullable=True)               # {"kadalpuram": 32, "malaiyur": 75}
    road_quality = Column(String(64), default="PAVED_ALL_WEATHER")

    description = Column(Text, nullable=True)
    selection_rationale = Column(Text, nullable=True)
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")
