"""
Incident, Emergency SOS, Field Reports, Alerts, Shelters, and Road Segments Models for RAKSHA-AI.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, JSON, Text, DateTime
from app.core.database import Base


class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    type = Column(String(64), nullable=False)  # FLOOD_TRAPPED, MEDICAL_EMERGENCY, INFRASTRUCTURE_COLLAPSE, etc.
    severity = Column(String(32), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String(32), default="SENT")  # SENT, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, RESOLVED
    source = Column(String(64), default="CITIZEN_SOS")

    settlement_id = Column(String(64), nullable=False, index=True)
    settlement_name = Column(String(128), nullable=False)
    micro_zone_id = Column(String(64), nullable=True)
    micro_zone_name = Column(String(128), nullable=True)
    landmark = Column(String(255), nullable=True)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    people_count = Column(Integer, default=1)
    vulnerable_count = Column(Integer, default=0)
    vulnerable_details = Column(JSON, nullable=True)  # {"elderlyCount": 2, "infantsChildrenCount": 1}
    description = Column(Text, nullable=True)
    priority_score = Column(Integer, default=75)

    timestamp = Column(String(64), nullable=True)
    reporter_name = Column(String(128), default="Citizen Beacon")  # Masked synthetic
    reporter_phone = Column(String(64), default="+91 94440 XXXXX")  # Masked synthetic
    assigned_team = Column(String(128), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class FieldReportModel(Base):
    __tablename__ = "field_reports"

    id = Column(String(64), primary_key=True, index=True)
    settlement_id = Column(String(64), nullable=False, index=True)
    settlement_name = Column(String(128), nullable=False)
    location_name = Column(String(128), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    report_type = Column(String(64), nullable=False)  # FLOOD_DEPTH, COASTAL_EROSION, INFRASTRUCTURE, CASUALTY
    description = Column(Text, nullable=False)
    measured_value = Column(Float, nullable=True)
    unit = Column(String(32), nullable=True)
    source = Column(String(64), default="FIELD_OFFICER")
    reporter_name = Column(String(128), default="Field Inspector")
    status = Column(String(32), default="REPORTED")  # REPORTED, UNDER_REVIEW, VERIFIED, REJECTED
    confidence = Column(Integer, default=90)
    verified_by = Column(String(128), nullable=True)
    verification_notes = Column(Text, nullable=True)
    timestamp = Column(String(64), nullable=True)
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    identifier = Column(String(128), nullable=False, unique=True, index=True)
    sender = Column(String(128), default="RAKSHA-AI Statutory Decision Core")
    sent_at = Column(String(64), nullable=False)
    status = Column(String(32), default="ACTUAL")  # ACTUAL, EXERCISE, SYSTEM, TEST
    msg_type = Column(String(32), default="ALERT")  # ALERT, UPDATE, CANCEL
    scope = Column(String(32), default="PUBLIC")
    
    event = Column(String(128), nullable=False)
    urgency = Column(String(32), default="IMMEDIATE")  # IMMEDIATE, EXPECTED, FUTURE
    severity = Column(String(32), default="SEVERE")  # EXTREME, SEVERE, MODERATE, MINOR
    certainty = Column(String(32), default="OBSERVED")  # OBSERVED, LIKELY, POSSIBLE
    
    headline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    instruction = Column(Text, nullable=False)
    area_description = Column(String(255), nullable=False)
    affected_settlement_ids = Column(JSON, default=list)  # ["kadalpuram"]
    local_messages = Column(JSON, default=dict)  # {"en": "...", "ta": "...", "hi": "..."}
    
    confidence = Column(Integer, default=94)
    source = Column(String(128), default="CAP-compatible Statutory Early Warning Pipeline")
    disclaimer = Column(String(255), default="CAP-compatible alert output designed for integration with existing warning infrastructure.")
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")


class ShelterModel(Base):
    __tablename__ = "emergency_shelters"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(64), nullable=False)
    settlement_id = Column(String(64), nullable=False, index=True)
    settlement_name = Column(String(128), nullable=False)
    district = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_meters = Column(Float, default=8.0)
    distance_km = Column(Float, default=1.0)
    capacity = Column(Integer, default=500)
    current_occupancy = Column(Integer, default=0)
    status = Column(String(32), default="OPEN")  # OPEN, NEAR_CAPACITY, FULL
    water_available = Column(Boolean, default=True)
    medical_available = Column(Boolean, default=True)
    electricity_available = Column(Boolean, default=True)
    sanitation_available = Column(Boolean, default=True)
    wheelchair_accessible = Column(Boolean, default=True)
    road_access = Column(String(32), default="CLEAR")


class RoadSegmentModel(Base):
    __tablename__ = "road_segments"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(64), nullable=False)
    from_location = Column(String(128), nullable=False)
    to_location = Column(String(128), nullable=False)
    settlement_id = Column(String(64), nullable=False, index=True)
    status = Column(String(32), default="OPEN")  # OPEN, CAUTION, BLOCKED
    blockage_reason = Column(String(255), nullable=True)
    water_depth_meters = Column(Float, default=0.0)
    alternative_route_name = Column(String(128), nullable=True)
    reroute_notice = Column(String(255), nullable=True)


class ResourceModel(Base):
    __tablename__ = "emergency_resources"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    type = Column(String(64), nullable=False)  # RESCUE_BOAT, AMBULANCE, SDRF_RESCUE_TRUCK, etc.
    category = Column(String(64), default="RESCUE")  # RESCUE, MEDICAL, TRANSPORT, EQUIPMENT, RELIEF
    status = Column(String(32), default="AVAILABLE")  # AVAILABLE, ASSIGNED, IN_USE, UNAVAILABLE
    capacity_rating = Column(String(64), default="Standard")
    station_location = Column(String(128), default="Nagapattinam Staging Yard")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    fuel_or_battery_percent = Column(Integer, default=100)
    assigned_incident_id = Column(String(64), nullable=True)
    assigned_to = Column(String(128), nullable=True)
    contact_channel = Column(String(64), default="VHF Channel 16")
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class FieldTeamModel(Base):
    __tablename__ = "field_teams"

    id = Column(String(64), primary_key=True, index=True)
    team_name = Column(String(128), nullable=False)
    team_lead = Column(String(128), nullable=False)
    cadre = Column(String(64), default="SDRF")  # SDRF, NDRF, COASTAL_POLICE, HEALTH, REVENUE
    personnel_count = Column(Integer, default=6)
    status = Column(String(32), default="STANDBY")  # STANDBY, DEPLOYED, RESTING, OFFLINE
    current_assignment = Column(String(255), nullable=True)
    assigned_incident_id = Column(String(64), nullable=True)
    base_station = Column(String(128), default="Nagapattinam Emergency Ops Base")
    contact_vhf = Column(String(64), default="VHF Ch 08")
    equipped_vehicles = Column(JSON, default=list)
    tasks_count = Column(Integer, default=0)
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class CommunityReportModel(Base):
    __tablename__ = "community_reports"

    id = Column(String(64), primary_key=True, index=True)
    settlement_id = Column(String(64), nullable=False, index=True)
    settlement_name = Column(String(128), nullable=False)
    hazard_type = Column(String(64), nullable=False)  # FLOODING, WATER_LEVEL, BLOCKED_ROAD, etc.
    location_name = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    photo_url = Column(String(255), nullable=True)
    reporter_name = Column(String(128), default="Citizen Informant")
    reporter_phone = Column(String(64), default="+91 98840 XXXXX")
    source = Column(String(64), default="CITIZEN_APP")
    confidence = Column(Integer, default=80)
    status = Column(String(32), default="REPORTED")  # REPORTED, VERIFIED, REJECTED, MORE_INFO_REQUESTED, DUPLICATE
    duplicate_of_id = Column(String(64), nullable=True)
    verified_by = Column(String(128), nullable=True)
    action_notes = Column(Text, nullable=True)
    timestamp = Column(String(64), nullable=True)
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

