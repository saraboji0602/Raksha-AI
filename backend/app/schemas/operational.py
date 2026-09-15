"""
Operational Pydantic Schemas for RAKSHA-AI.
Covers Data Health, System Mode, Field Verification, Emergency SOS,
CAP Alerts, Evacuation Routes, Shelters, and Statutory Audit Logs.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# 1. DATA HEALTH & SYSTEM STATUS
# ==========================================

class DataHealthItemSchema(BaseModel):
    source_name: str
    category: str
    endpoint_config: str
    connection_status: str  # CONNECTED, NOT_CONNECTED, STALE, ERROR, DEMO
    source_type: str
    freshness: str
    last_successful_update: str
    record_count: int
    confidence: int
    error_message: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class DataHealthResponse(BaseModel):
    total_sources: int
    connected_sources: int
    not_connected_sources: int
    demo_sources: int
    system_data_mode: str  # DEMO, HYBRID, LIVE
    data_classification: str = "DEMO / SYNTHETIC DATA"
    sources: List[DataHealthItemSchema]

    model_config = ConfigDict(from_attributes=True)


class SystemStatusResponse(BaseModel):
    name: str = "RAKSHA-AI"
    backend: str = "operational"
    status: str = "operational"
    database_status: str = "connected"
    postgis_status: str = "available"
    postgis_enabled: bool = True
    system_mode: str = "HYBRID"  # DEMO, HYBRID, LIVE
    mode: str = "HYBRID"
    data_provenance: str = "DEMO / SYNTHETIC DATA"
    data_classification: str = "DEMO / SYNTHETIC DATA"
    version: str = "2.0.0-PROD-READY"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    active_habitations_count: int
    total_datasets_count: int
    data_health_summary: Dict[str, int]
    governance_notice: str = "AI RECOMMENDATION — HUMAN APPROVAL REQUIRED"

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 2. FIELD VERIFICATION
# ==========================================

class FieldReportCreateRequest(BaseModel):
    settlement_id: str = Field(..., description="Habitation ID (e.g. kadalpuram)")
    settlement_name: Optional[str] = Field(default="Kadalpuram")
    location_name: Optional[str] = Field(default="Frontline Scarp")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    report_type: str = Field(..., description="FLOOD_DEPTH, COASTAL_EROSION, INFRASTRUCTURE, CASUALTY")
    description: str = Field(..., description="Observation description")
    measured_value: Optional[float] = Field(default=None, description="Numerical sensor or field observation value")
    unit: Optional[str] = Field(default="m")
    reporter_name: Optional[str] = Field(default="Field Revenue Inspector")


class FieldReportVerifyRequest(BaseModel):
    verified_by: str = Field(..., description="Official inspector / officer badge name")
    status: str = Field(default="VERIFIED", description="VERIFIED or REJECTED")
    verification_notes: Optional[str] = Field(default="Verified on ground with precision GPS instrument.")
    statutory_action_required: Optional[bool] = Field(default=True)


class FieldReportSchema(BaseModel):
    id: str
    settlement_id: str
    settlement_name: str
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    report_type: str
    description: str
    measured_value: Optional[float] = None
    unit: Optional[str] = None
    source: str
    reporter_name: str
    status: str  # REPORTED, UNDER_REVIEW, VERIFIED, REJECTED
    confidence: int
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None
    timestamp: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class FieldReportListResponse(BaseModel):
    total: int
    total_verified: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[FieldReportSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 3. EMERGENCY SOS
# ==========================================

class SOSCreateRequest(BaseModel):
    settlement_id: str = Field(default="kadalpuram")
    settlement_name: Optional[str] = Field(default="Kadalpuram")
    title: str = Field(default="Emergency Evacuation Assistance Required")
    type: str = Field(default="FLOOD_TRAPPED", description="FLOOD_TRAPPED, MEDICAL_EMERGENCY, INFRASTRUCTURE_COLLAPSE")
    severity: str = Field(default="HIGH", description="CRITICAL, HIGH, MEDIUM, LOW")
    landmark: Optional[str] = Field(default="Near North Pier Jetty")
    latitude: Optional[float] = Field(default=10.772)
    longitude: Optional[float] = Field(default=79.840)
    people_count: int = Field(default=4)
    vulnerable_count: int = Field(default=2)
    vulnerable_details: Optional[Dict[str, Any]] = Field(default=None)
    description: Optional[str] = Field(default="Tidal surge backwater breached access road.")
    reporter_phone: Optional[str] = Field(default="+91 94440 XXXXX")


class SOSUpdateRequest(BaseModel):
    status: str = Field(..., description="SENT, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, RESOLVED")
    assigned_team: Optional[str] = Field(default=None)
    resolution_notes: Optional[str] = Field(default=None)


class SOSIncidentSchema(BaseModel):
    id: str
    title: str
    type: str
    severity: str
    status: str
    source: str
    settlement_id: str
    settlement_name: str
    micro_zone_name: Optional[str] = None
    landmark: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    people_count: int
    vulnerable_count: int
    vulnerable_details: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    priority_score: int
    timestamp: Optional[str] = None
    assigned_team: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class SOSIncidentListResponse(BaseModel):
    total: int
    pending_count: int
    resolved_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[SOSIncidentSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 4. CAP-COMPATIBLE STATUTORY ALERTS
# ==========================================

class AlertSchema(BaseModel):
    id: str
    identifier: str
    sender: str
    sent_at: str
    status: str
    msg_type: str
    scope: str
    event: str
    urgency: str
    severity: str
    certainty: str
    headline: str
    description: str
    instruction: str
    area_description: str
    affected_settlement_ids: List[str] = []
    local_messages: Dict[str, str] = {}
    confidence: int
    source: str
    disclaimer: str = "CAP-compatible alert output designed for integration with existing warning infrastructure."
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class AlertListResponse(BaseModel):
    total: int
    active_alerts: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[AlertSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 5. SHELTERS & EVACUATION ROUTES
# ==========================================

class ShelterSchema(BaseModel):
    id: str
    name: str
    code: str
    settlement_id: str
    settlement_name: str
    district: str
    latitude: float
    longitude: float
    elevation_meters: float
    distance_km: float
    capacity: int
    current_occupancy: int
    available_capacity: int
    status: str  # OPEN, NEAR_CAPACITY, FULL
    water_available: bool = True
    medical_available: bool = True
    electricity_available: bool = True
    sanitation_available: bool = True
    wheelchair_accessible: bool = True
    road_access: str = "CLEAR"
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class ShelterListResponse(BaseModel):
    total: int
    total_capacity: int
    total_occupied: int
    available_shelter_capacity: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[ShelterSchema]

    model_config = ConfigDict(from_attributes=True)


class RouteSegmentSchema(BaseModel):
    id: str
    name: str
    code: str
    from_location: str
    to_location: str
    settlement_id: str
    status: str  # OPEN, CAUTION, BLOCKED
    blockage_reason: Optional[str] = None
    water_depth_meters: float = 0.0
    alternative_route_name: Optional[str] = None
    reroute_notice: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class EvacuationStatusResponse(BaseModel):
    settlement_id: str
    settlement_name: str
    overall_evacuation_status: str  # SAFE, COMPROMISED, SEVERED
    safest_route_name: str
    estimated_evac_time_min: int
    primary_route_status: str
    active_blockages_count: int
    shelters_available: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    routes: List[RouteSegmentSchema]
    shelters: List[ShelterSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 6. STATUTORY AUDIT TRAIL
# ==========================================

class AuditLogCreateRequest(BaseModel):
    actor_name: str = Field(..., description="Officer or system component name")
    actor_role: str = Field(default="District Collector / SDMA Officer")
    action_type: str = Field(..., description="AI_RECOMMENDATION, OFFICER_MODIFICATION, FIELD_VERIFICATION, SITE_ALLOCATION, ALERT_ISSUANCE, SOS_ASSIGNMENT")
    title: str = Field(..., description="Action summary")
    target_entity_id: str = Field(..., description="Entity identifier (e.g. kadalpuram)")
    target_entity_type: str = Field(default="HABITATION")
    target_entity_name: str = Field(default="Kadalpuram")
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    official_reason: Optional[str] = None
    confidence_before: Optional[int] = None
    confidence_after: Optional[int] = None
    evidence_reference: Optional[str] = None


class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    actor_name: str
    actor_role: str
    action_type: str
    title: str
    target_entity_id: str
    target_entity_type: str
    target_entity_name: str
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    official_reason: Optional[str] = None
    statutory_basis: str
    confidence_before: Optional[int] = None
    confidence_after: Optional[int] = None
    evidence_reference: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class AuditLogListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[AuditLogSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 7. RESCUE & EMERGENCY RESOURCES
# ==========================================

class ResourceSchema(BaseModel):
    id: str
    name: str
    type: str  # RESCUE_BOAT, AMBULANCE, SDRF_RESCUE_TRUCK, etc.
    category: str
    status: str  # AVAILABLE, ASSIGNED, IN_USE, UNAVAILABLE
    capacity_rating: str
    station_location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    fuel_or_battery_percent: int = 100
    assigned_incident_id: Optional[str] = None
    assigned_to: Optional[str] = None
    contact_channel: str = "VHF Channel 16"
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class ResourceListResponse(BaseModel):
    total: int
    available_count: int
    assigned_count: int
    in_use_count: int
    unavailable_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[ResourceSchema]

    model_config = ConfigDict(from_attributes=True)


class ResourceAssignRequest(BaseModel):
    incident_id: str
    assigned_to: Optional[str] = Field(default="Frontline Operations Unit")
    dispatch_notes: Optional[str] = Field(default="Dispatched via safest inland bypass corridor.")


class ResourceUpdateRequest(BaseModel):
    status: str = Field(..., description="AVAILABLE, ASSIGNED, IN_USE, UNAVAILABLE")
    fuel_or_battery_percent: Optional[int] = None
    assigned_incident_id: Optional[str] = None
    assigned_to: Optional[str] = None


# ==========================================
# 8. FIELD TEAMS & SQUAD MANAGEMENT
# ==========================================

class FieldTeamSchema(BaseModel):
    id: str
    team_name: str
    team_lead: str
    cadre: str  # SDRF, NDRF, COASTAL_POLICE, HEALTH, REVENUE
    personnel_count: int
    status: str  # STANDBY, DEPLOYED, RESTING, OFFLINE
    current_assignment: Optional[str] = None
    assigned_incident_id: Optional[str] = None
    base_station: str
    contact_vhf: str
    equipped_vehicles: List[str] = []
    tasks_count: int = 0
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class FieldTeamListResponse(BaseModel):
    total: int
    deployed_count: int
    standby_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[FieldTeamSchema]

    model_config = ConfigDict(from_attributes=True)


class FieldTeamAssignRequest(BaseModel):
    incident_id: str
    task_description: str
    sla_minutes: Optional[int] = Field(default=30)


class FieldTeamStatusUpdateRequest(BaseModel):
    status: str = Field(..., description="STANDBY, DEPLOYED, RESTING, OFFLINE")
    current_assignment: Optional[str] = None


# ==========================================
# 9. INCIDENT COMMAND LIFECYCLE
# ==========================================

class IncidentCreateRequest(BaseModel):
    title: str = Field(..., description="Incident title")
    type: str = Field(default="FLOOD_TRAPPED", description="FLOOD_TRAPPED, MEDICAL_EMERGENCY, ROAD_BLOCKAGE, INFRASTRUCTURE_DAMAGE, COASTAL_EROSION, CYCLONE, LANDSLIDE, SHELTER_OVERLOAD, OTHER")
    severity: str = Field(default="HIGH", description="CRITICAL, HIGH, MEDIUM, LOW")
    settlement_id: str = Field(default="kadalpuram")
    settlement_name: Optional[str] = Field(default="Kadalpuram")
    micro_zone_name: Optional[str] = Field(default="Zone A - Coastal Spit")
    landmark: Optional[str] = Field(default="North Jetty Causeway")
    latitude: Optional[float] = Field(default=10.772)
    longitude: Optional[float] = Field(default=79.840)
    people_count: int = Field(default=1)
    vulnerable_count: int = Field(default=0)
    vulnerable_details: Optional[Dict[str, Any]] = None
    description: str = Field(..., description="Detailed situation description")
    assigned_team: Optional[str] = None
    reporter_name: Optional[str] = Field(default="Officer Command Dispatch")
    reporter_phone: Optional[str] = Field(default="+91 94440 XXXXX")


class IncidentUpdateRequest(BaseModel):
    status: Optional[str] = Field(default=None, description="OPEN, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, ESCALATED, RESOLVED, CLOSED")
    severity: Optional[str] = None
    assigned_team: Optional[str] = None
    resolution_notes: Optional[str] = None
    priority_score: Optional[int] = None


class IncidentSchema(BaseModel):
    id: str
    title: str
    type: str
    severity: str
    status: str
    source: str
    settlement_id: str
    settlement_name: str
    micro_zone_name: Optional[str] = None
    landmark: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    people_count: int
    vulnerable_count: int
    vulnerable_details: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    priority_score: int
    timestamp: Optional[str] = None
    reporter_name: Optional[str] = None
    assigned_team: Optional[str] = None
    resolution_notes: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class IncidentListResponse(BaseModel):
    total: int
    active_count: int
    critical_count: int
    resolved_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[IncidentSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 10. CITIZEN COMMUNITY REPORTS
# ==========================================

class CommunityReportCreateRequest(BaseModel):
    settlement_id: str = Field(default="kadalpuram")
    settlement_name: Optional[str] = Field(default="Kadalpuram")
    hazard_type: str = Field(..., description="FLOODING, WATER_LEVEL, BLOCKED_ROAD, LANDSLIDE, FIRE, DAMAGED_BRIDGE, INFRASTRUCTURE_DAMAGE, SHELTER_OVERCROWDING, OTHER")
    location_name: str = Field(..., description="Location landmark or micro-zone")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: str = Field(..., description="Citizen hazard observation")
    photo_url: Optional[str] = None
    reporter_name: Optional[str] = Field(default="Citizen Informant")
    reporter_phone: Optional[str] = Field(default="+91 98840 XXXXX")


class CommunityReportActionRequest(BaseModel):
    action: str = Field(..., description="VERIFY, REJECT, REQUEST_MORE_INFORMATION, MARK_DUPLICATE")
    verified_by: str = Field(default="District Disaster Control Desk")
    notes: Optional[str] = Field(default="Processed and validated by officer desk.")
    duplicate_of_id: Optional[str] = None


class CommunityReportSchema(BaseModel):
    id: str
    settlement_id: str
    settlement_name: str
    hazard_type: str
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: str
    photo_url: Optional[str] = None
    reporter_name: str
    source: str
    confidence: int
    status: str  # REPORTED, VERIFIED, REJECTED, MORE_INFO_REQUESTED, DUPLICATE
    duplicate_of_id: Optional[str] = None
    verified_by: Optional[str] = None
    action_notes: Optional[str] = None
    timestamp: Optional[str] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class CommunityReportListResponse(BaseModel):
    total: int
    verified_count: int
    unverified_count: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[CommunityReportSchema]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 11. ALERT CREATION (CAP-COMPATIBLE)
# ==========================================

class AlertCreateRequest(BaseModel):
    event: str = Field(..., description="Disaster or hazard title")
    urgency: str = Field(default="IMMEDIATE", description="IMMEDIATE, EXPECTED, FUTURE")
    severity: str = Field(default="SEVERE", description="EXTREME, SEVERE, MODERATE, MINOR")
    certainty: str = Field(default="OBSERVED", description="OBSERVED, LIKELY, POSSIBLE")
    headline: str = Field(..., description="Short broadcast headline")
    description: str = Field(..., description="Full warning description")
    instruction: str = Field(..., description="Action instructions (what to do / what not to do)")
    area_description: str = Field(..., description="Affected administrative jurisdiction")
    affected_settlement_ids: List[str] = Field(default=["kadalpuram"])
    sender: Optional[str] = Field(default="District Disaster Management Authority (DDMA)")


# ==========================================
# 12. REGIONAL COMMAND AGGREGATION
# ==========================================

class HabitationSummaryItem(BaseModel):
    id: str
    name: str
    district: str
    taluk: str
    population: int
    exposed_population: int
    risk_score: int
    risk_level: str
    emergency_urgency: str
    dominant_hazard: str
    active_incidents: int
    data_classification: str = "DEMO / SYNTHETIC DATA"


class RegionalSummaryResponse(BaseModel):
    state: str = "Tamil Nadu"
    region: str = "Coastal & Delta Corridor"
    total_habitations: int
    critical_habitations_count: int
    total_population_at_risk: int
    immediate_priority_count: int
    active_incidents_count: int
    unresolved_sos_count: int
    total_shelter_capacity: int
    occupied_shelter_capacity: int
    available_shelter_headroom: int
    total_relocation_demand: int
    available_relocation_capacity: int
    unmet_relocation_capacity: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    habitations: List[HabitationSummaryItem]

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 13. STATUTORY DECISION APPROVAL
# ==========================================

class DecisionApprovalRequest(BaseModel):
    habitation_id: str
    action: str = Field(..., description="APPROVE, MODIFY, REJECT")
    approved_intervention: str = Field(..., description="PROTECT, ADAPT, PARTIAL_RELOCATION, FULL_RELOCATION")
    officer_name: str = Field(..., description="Designated authorized officer name")
    officer_badge: str = Field(..., description="Official designation and badge number")
    justification_reason: str = Field(..., description="Mandatory statutory justification under DM Act 2005")
    confidence_acknowledged: int = Field(default=93)


class DecisionApprovalResponse(BaseModel):
    success: bool
    audit_log_id: str
    habitation_id: str
    status: str
    governance_message: str = "AI RECOMMENDATION — HUMAN DECISION RECORDED IN STATUTORY AUDIT LEDGER"
    timestamp: str


# ==========================================
# 14. RESOURCES, EVACUATION & RELOCATION EXPANSION
# ==========================================

class ResourceCreateRequest(BaseModel):
    name: str = Field(..., description="Resource name or identifier")
    category: str = Field(..., description="RESCUE, MEDICAL, TRANSPORT, EQUIPMENT, RELIEF")
    type: str = Field(..., description="Specific equipment or unit type")
    quantity: int = Field(default=1, ge=1)
    capacity: Optional[int] = Field(default=None)
    location_name: str = Field(default="District Disaster HQ")
    latitude: float = Field(default=8.12)
    longitude: float = Field(default=77.55)
    status: str = Field(default="AVAILABLE")
    notes: Optional[str] = Field(default="Ready for immediate tactical dispatch")


class EvacuationPlanCreateRequest(BaseModel):
    settlement_id: str = Field(..., description="Origin settlement ID (e.g. kadalpuram)")
    target_shelter_id: str = Field(..., description="Designated shelter ID")
    designated_route_id: Optional[str] = Field(default="corridor-spit-inland")
    evacuee_count: int = Field(..., ge=1, description="Number of citizens in evacuation convoy")
    priority_tier: str = Field(default="IMMEDIATE")
    transport_requirement: str = Field(default="12 Disaster Evacuation Buses, 4 High-Clearance Wading Trucks")
    officer_notes: Optional[str] = Field(default="Evacuation initiated via high-ground bypass route avoiding flooded sluice gate.")


class EvacuationPlanSchema(BaseModel):
    id: str
    settlement_id: str
    settlement_name: str
    target_shelter_id: str
    target_shelter_name: str
    designated_route_id: Optional[str] = None
    designated_route_name: str
    route_risk_level: str
    evacuee_count: int
    transport_requirement: str
    estimated_travel_time_minutes: int
    route_confidence_score: int
    status: str = "APPROVED"
    timestamp: str
    human_approval_status: str = "APPROVED_BY_OFFICER"

    model_config = ConfigDict(from_attributes=True)


class EvacuationPlanListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[EvacuationPlanSchema]


class RelocationMatchRequest(BaseModel):
    habitation_id: str = Field(..., description="Origin vulnerable habitation ID")
    candidate_site_ids: Optional[List[str]] = Field(default=None)
    priority_policy: str = Field(default="BALANCED_LIVELIHOOD_SAFETY")


class RelocationMatchResponse(BaseModel):
    habitation_id: str
    habitation_name: str
    total_demand_population: int
    allocated_population: int
    unmet_population: int
    allocation_status: str
    matched_sites: List[Dict[str, Any]]
    data_classification: str = "DEMO / SYNTHETIC DATA"
    timestamp: str


class AlertUpdateRequest(BaseModel):
    severity: Optional[str] = None
    status: Optional[str] = None
    action_en: Optional[str] = None
    action_ta: Optional[str] = None
    action_hi: Optional[str] = None
    notes: Optional[str] = None


class DecisionUpdateRequest(BaseModel):
    action: Optional[str] = None
    approved_intervention: Optional[str] = None
    justification_reason: Optional[str] = None
    officer_name: Optional[str] = None
    officer_badge: Optional[str] = None


class MicroZoneSchema(BaseModel):
    id: str
    habitation_id: str
    zone_code: str
    name: str
    risk_level: str
    risk_score: int
    population: int
    exposed_population: Optional[int] = 0
    vulnerability_score: Optional[float] = 0.0
    dominant_hazard: Optional[str] = "COASTAL_EROSION"
    primary_hazard: Optional[str] = "COASTAL_EROSION"
    scarp_retreat_distance_meters: Optional[float] = 0.0
    evacuation_access: Optional[str] = "CLEAR"
    confidence: Optional[int] = 90
    recommended_action: Optional[str] = "PROTECT"
    recommendation: Optional[str] = "PROTECT"
    reason: Optional[str] = None
    vulnerable_people_count: Optional[int] = 0
    kutcha_houses_count: Optional[int] = 0
    distance_to_coastline_meters: Optional[float] = 0.0
    coordinates: Optional[Any] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)



class MicroZoneListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[MicroZoneSchema]


