from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class HabitationModel(Base):
    __tablename__ = "habitations"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    district = Column(String(128), nullable=False, index=True)
    state = Column(String(64), default="Tamil Nadu")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer, nullable=False)
    households = Column(Integer, nullable=False)
    area_sq_km = Column(Float, default=1.0)
    dominant_hazard = Column(String(64), nullable=False)
    settlement_type = Column(String(64), default="COASTAL")
    is_urban = Column(Boolean, default=False)

    # Risk & Scores
    overall_risk = Column(Integer, default=50)
    baseline_risk = Column(Integer, default=50)
    exposure_score = Column(Integer, default=50)
    vulnerability_score = Column(Integer, default=50)
    resilience_score = Column(Integer, default=50)
    data_confidence = Column(Integer, default=90)
    
    # Priority & Action
    priority = Column(String(32), default="MEDIUM_TERM")
    emergency_urgency = Column(String(32), default="MEDIUM_TERM")
    long_term_priority = Column(String(32), default="MEDIUM")
    priority_score = Column(Integer, default=50)
    ai_recommendation = Column(String(64), default="PROTECT")
    recommendation_reason = Column(Text, nullable=True)
    status = Column(String(64), default="ASSESSMENT")

    # Demographics & Exposed Pop
    exposed_population = Column(Integer, default=0)
    exposed_percentage = Column(Integer, default=0)
    children_count = Column(Integer, default=0)
    elderly_count = Column(Integer, default=0)
    special_assistance_count = Column(Integer, default=0)
    female_headed_count = Column(Integer, default=0)
    kutcha_house_count = Column(Integer, default=0)

    # Relocation Allocations
    relocation_population = Column(Integer, default=0)
    adaptation_population = Column(Integer, default=0)
    protection_population = Column(Integer, default=0)
    recommended_site_id = Column(String(64), nullable=True)

    # Financial Estimates (INR Crores)
    cost_protect_cr = Column(Float, default=0.0)
    cost_adapt_cr = Column(Float, default=0.0)
    cost_relocate_cr = Column(Float, default=0.0)
    cost_of_inaction_cr = Column(Float, default=0.0)

    # Evacuation Details
    evacuation_time_min = Column(Integer, default=30)
    primary_evac_route = Column(String(255), nullable=True)
    secondary_evac_route = Column(String(255), nullable=True)
    evac_bottleneck = Column(String(255), nullable=True)

    # Audit & Verification
    field_verified = Column(Boolean, default=False)
    field_verification_notes = Column(Text, nullable=True)
    verified_by = Column(String(128), nullable=True)
    last_updated = Column(String(64), nullable=True)
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")

    # Relationships
    micro_zones = relationship("MicroZoneModel", back_populates="habitation", cascade="all, delete-orphan")
    hazards = relationship("HazardDataModel", back_populates="habitation", cascade="all, delete-orphan")


class MicroZoneModel(Base):
    __tablename__ = "micro_zones"

    id = Column(String(64), primary_key=True, index=True)
    habitation_id = Column(String(64), ForeignKey("habitations.id"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    zone_code = Column(String(64), nullable=False)
    population = Column(Integer, default=0)
    households = Column(Integer, default=0)
    risk_score = Column(Integer, default=50)
    risk_level = Column(String(32), default="MODERATE")
    primary_hazard = Column(String(64), nullable=False)
    recommendation = Column(String(64), default="PROTECT")
    reason = Column(Text, nullable=True)
    coordinates = Column(JSON, nullable=True)  # Polygon coordinates list [[lat, lng], ...]
    vulnerable_people_count = Column(Integer, default=0)
    kutcha_houses_count = Column(Integer, default=0)
    distance_to_coastline_meters = Column(Float, default=0.0)

    habitation = relationship("HabitationModel", back_populates="micro_zones")
