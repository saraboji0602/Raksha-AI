"""
Operational Endpoints for RAKSHA-AI:
- /data-health
- /system/status
- /reports (Field Verification)
- /sos (Emergency Citizen Beacons)
- /alerts (CAP-Compatible Early Warning)
- /shelters & /routes & /evacuation-status
- /audit-logs (Statutory Audit Trail)
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.operational import (
    DataHealthResponse,
    SystemStatusResponse,
    FieldReportCreateRequest,
    FieldReportVerifyRequest,
    FieldReportSchema,
    FieldReportListResponse,
    SOSCreateRequest,
    SOSUpdateRequest,
    SOSIncidentSchema,
    SOSIncidentListResponse,
    AlertSchema,
    AlertListResponse,
    AlertCreateRequest,
    AlertUpdateRequest,
    ShelterSchema,
    ShelterListResponse,
    EvacuationStatusResponse,
    EvacuationPlanCreateRequest,
    EvacuationPlanSchema,
    EvacuationPlanListResponse,
    AuditLogCreateRequest,
    AuditLogSchema,
    AuditLogListResponse,
    ResourceSchema,
    ResourceListResponse,
    ResourceCreateRequest,
    ResourceAssignRequest,
    ResourceUpdateRequest,
    FieldTeamSchema,
    FieldTeamListResponse,
    FieldTeamAssignRequest,
    FieldTeamStatusUpdateRequest,
    IncidentCreateRequest,
    IncidentUpdateRequest,
    IncidentSchema,
    IncidentListResponse,
    CommunityReportCreateRequest,
    CommunityReportActionRequest,
    CommunityReportSchema,
    CommunityReportListResponse,
    RegionalSummaryResponse,
    DecisionApprovalRequest,
    DecisionApprovalResponse,
)
from app.services.operational_service import OperationalService

router = APIRouter()



# ==========================================
# 1. DATA HEALTH & SYSTEM STATUS
# ==========================================

@router.get("/data-health", response_model=DataHealthResponse, tags=["Data Health"], summary="Get real vs demo data source health matrix")
def get_data_health(db: Session = Depends(get_db)):
    """
    Returns verified connection status (CONNECTED, NOT_CONNECTED, DEMO, STALE) for all statutory feeds.
    """
    return OperationalService.get_data_health(db)


@router.get("/system/status", response_model=SystemStatusResponse, tags=["System"], summary="Get system operating mode & governance state")
def get_system_status(db: Session = Depends(get_db)):
    """
    Exposes current system operating mode (DEMO, HYBRID, LIVE), PostGIS state, and governance notices.
    """
    return OperationalService.get_system_status(db)


# ==========================================
# 2. FIELD VERIFICATION REPORTS
# ==========================================

@router.post("/reports", response_model=FieldReportSchema, status_code=status.HTTP_201_CREATED, tags=["Field Verification"], summary="Submit ground truth field report", operation_id="create_field_report_legacy")
def create_field_report_legacy(req: FieldReportCreateRequest, db: Session = Depends(get_db)):
    return OperationalService.create_field_report(db, req)


@router.post("/field-reports", response_model=FieldReportSchema, status_code=status.HTTP_201_CREATED, tags=["Field Verification"], summary="Submit ground truth field report", operation_id="create_field_report")
def create_field_report(req: FieldReportCreateRequest, db: Session = Depends(get_db)):
    """
    Submits ground truth sensor or officer observation to the central intelligence database.
    """
    return OperationalService.create_field_report(db, req)


@router.get("/reports", response_model=FieldReportListResponse, tags=["Field Verification"], summary="List field reports", operation_id="list_field_reports_legacy")
def list_field_reports_legacy(
    settlement_id: Optional[str] = Query(None, description="Filter by habitation ID"),
    db: Session = Depends(get_db)
):
    return OperationalService.list_field_reports(db, settlement_id)


@router.get("/field-reports", response_model=FieldReportListResponse, tags=["Field Verification"], summary="List field reports", operation_id="list_field_reports")
def list_field_reports(
    settlement_id: Optional[str] = Query(None, description="Filter by habitation ID"),
    db: Session = Depends(get_db)
):
    """
    Retrieves all field verification reports and ground truth evidence logs.
    """
    return OperationalService.list_field_reports(db, settlement_id)


@router.post("/reports/{report_id}/verify", response_model=FieldReportSchema, tags=["Field Verification"], summary="Verify field report & update evidence confidence", operation_id="verify_field_report_legacy")
def verify_field_report_legacy(report_id: str, req: FieldReportVerifyRequest, db: Session = Depends(get_db)):
    try:
        return OperationalService.verify_field_report(db, report_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/field-reports/{report_id}/verify", response_model=FieldReportSchema, tags=["Field Verification"], summary="Verify field report & update evidence confidence", operation_id="verify_field_report_post")
def verify_field_report_post(report_id: str, req: FieldReportVerifyRequest, db: Session = Depends(get_db)):
    try:
        return OperationalService.verify_field_report(db, report_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/field-reports/{report_id}", response_model=FieldReportSchema, tags=["Field Verification"], summary="Verify/update field report", operation_id="verify_field_report_patch")
def verify_field_report_patch(report_id: str, req: FieldReportVerifyRequest, db: Session = Depends(get_db)):
    """
    Statutorily verifies a field report, updating confidence and recording in audit ledger.
    """
    try:
        return OperationalService.verify_field_report(db, report_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))



# ==========================================
# 3. EMERGENCY SOS BEACONS
# ==========================================

@router.post("/sos", response_model=SOSIncidentSchema, status_code=status.HTTP_201_CREATED, tags=["SOS"], summary="Submit citizen emergency SOS beacon")
def create_sos(req: SOSCreateRequest, db: Session = Depends(get_db)):
    """
    Submits citizen emergency beacon to priority queue.
    """
    return OperationalService.create_sos(db, req)


@router.get("/sos", response_model=SOSIncidentListResponse, tags=["SOS"], summary="List active SOS emergency incidents")
def list_sos(
    status_filter: Optional[str] = Query(None, description="Filter by status (SENT, ACKNOWLEDGED, ASSIGNED, RESOLVED)"),
    db: Session = Depends(get_db)
):
    """
    Retrieves emergency SOS queue ranked by priority and vulnerability count.
    """
    return OperationalService.list_sos(db, status_filter)


@router.patch("/sos/{sos_id}", response_model=SOSIncidentSchema, tags=["SOS"], summary="Update SOS incident status or assign team")
def update_sos(sos_id: str, req: SOSUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates emergency beacon status and logs assignment in audit ledger.
    """
    try:
        return OperationalService.update_sos(db, sos_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ==========================================
# 4. CAP-COMPATIBLE STATUTORY ALERTS
# ==========================================

@router.get("/alerts", response_model=AlertListResponse, tags=["Alerts"], summary="Get CAP-compatible early warning alerts")
def list_alerts(db: Session = Depends(get_db)):
    """
    Returns Common Alerting Protocol (CAP) compliant warnings formatted with multilingual messages.
    """
    return OperationalService.list_alerts(db)


@router.post("/alerts", response_model=AlertSchema, status_code=status.HTTP_201_CREATED, tags=["Alerts"], summary="Broadcast CAP-compatible warning")
def create_alert(req: AlertCreateRequest, db: Session = Depends(get_db)):
    """
    Publishes a Common Alerting Protocol compliant warning with English, Tamil, and Hindi instructions.
    """
    return OperationalService.create_alert(db, req)


@router.patch("/alerts/{alert_id}", response_model=AlertSchema, tags=["Alerts"], summary="Update alert severity or instructions")
def update_alert(alert_id: str, req: AlertUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates an active emergency broadcast.
    """
    try:
        return OperationalService.update_alert(db, alert_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ==========================================
# 5. SHELTERS & EVACUATION ROUTES
# ==========================================

@router.get("/shelters", response_model=ShelterListResponse, tags=["Shelters"], summary="List emergency shelters and occupancy")
def list_shelters(
    settlement_id: Optional[str] = Query(None, description="Filter by settlement"),
    db: Session = Depends(get_db)
):
    """
    Returns relief shelters, real carrying capacity, and accessibility features.
    """
    return OperationalService.list_shelters(db, settlement_id)


@router.get("/shelters/{id}", response_model=ShelterSchema, tags=["Shelters"], summary="Get details for a specific shelter")
def get_shelter(id: str, db: Session = Depends(get_db)):
    """
    Retrieves carrying capacity, water/power/food amenities, and accessibility status for a shelter.
    """
    try:
        return OperationalService.get_shelter(db, id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/evacuation-status", response_model=EvacuationStatusResponse, tags=["Evacuation"], summary="Get safest evacuation routes and road blockages")
def get_evacuation_status(
    settlement_id: Optional[str] = Query("kadalpuram", description="Target settlement"),
    db: Session = Depends(get_db)
):
    """
    Calculates safest evacuation egress corridor, identifies road blockages, and directs traffic around hazards.
    """
    return OperationalService.get_evacuation_status(db, settlement_id or "kadalpuram")


@router.get("/evacuation/plans", response_model=EvacuationPlanListResponse, tags=["Evacuation"], summary="List active evacuation convoy plans")
def list_evacuation_plans(
    settlement_id: Optional[str] = Query(None, description="Filter by settlement"),
    db: Session = Depends(get_db)
):
    """
    Returns verified evacuation plans with safest route paths, transport requirements, and ETA.
    """
    return OperationalService.list_evacuation_plans(db, settlement_id)


@router.post("/evacuation/plans", response_model=EvacuationPlanSchema, status_code=status.HTTP_201_CREATED, tags=["Evacuation"], summary="Create official evacuation convoy plan")
def create_evacuation_plan(req: EvacuationPlanCreateRequest, db: Session = Depends(get_db)):
    """
    Issues official evacuation order allocating evacuees to safest designated shelter.
    """
    return OperationalService.create_evacuation_plan(db, req)


# ==========================================
# 6. STATUTORY AUDIT TRAIL
# ==========================================

@router.get("/audit", response_model=AuditLogListResponse, tags=["Audit"], summary="Get immutable statutory decision audit trail", operation_id="list_audit_logs")
def list_audit_logs(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Retrieves legal audit ledger under Disaster Management Act 2005.
    """
    return OperationalService.list_audit_logs(db, limit)


@router.get("/audit-logs", response_model=AuditLogListResponse, tags=["Audit"], summary="Get immutable statutory decision audit trail", operation_id="list_audit_logs_legacy")
def list_audit_logs_legacy(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return OperationalService.list_audit_logs(db, limit)


@router.post("/audit", response_model=AuditLogSchema, status_code=status.HTTP_201_CREATED, tags=["Audit"], summary="Record statutory audit log entry", operation_id="create_audit_log")
def create_audit_log(req: AuditLogCreateRequest, db: Session = Depends(get_db)):
    """
    Appends an official officer or AI decision record to the immutable audit ledger.
    """
    row = OperationalService.log_audit_entry(db, req)
    db.commit()
    return row


@router.post("/audit-logs", response_model=AuditLogSchema, status_code=status.HTTP_201_CREATED, tags=["Audit"], summary="Record statutory audit log entry", operation_id="create_audit_log_legacy")
def create_audit_log_legacy(req: AuditLogCreateRequest, db: Session = Depends(get_db)):
    row = OperationalService.log_audit_entry(db, req)
    db.commit()
    return row


# ==========================================
# 7. EMERGENCY RESCUE RESOURCES
# ==========================================

@router.get("/resources", response_model=ResourceListResponse, tags=["Resources"], summary="List emergency rescue and relief resources")
def list_resources(
    category: Optional[str] = Query(None, description="Filter by category (RESCUE, MEDICAL, TRANSPORT, EQUIPMENT, RELIEF)"),
    db: Session = Depends(get_db)
):
    """
    Retrieves operational status of boats, ambulances, heavy pumps, and satcom equipment.
    """
    return OperationalService.list_resources(db, category)


@router.post("/resources", response_model=ResourceSchema, status_code=status.HTTP_201_CREATED, tags=["Resources"], summary="Create emergency rescue resource")
def create_resource(req: ResourceCreateRequest, db: Session = Depends(get_db)):
    """
    Registers newly procured or deployed emergency equipment/team in resource catalog.
    """
    return OperationalService.create_resource(db, req)


@router.post("/resources/{resource_id}/assign", response_model=ResourceSchema, tags=["Resources"], summary="Assign rescue resource to incident")
def assign_resource(resource_id: str, req: ResourceAssignRequest, db: Session = Depends(get_db)):
    """
    Dispatches a rescue resource to an active incident and logs audit record.
    """
    try:
        return OperationalService.assign_resource(db, resource_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/resources/{resource_id}", response_model=ResourceSchema, tags=["Resources"], summary="Update resource status or readiness")
def update_resource(resource_id: str, req: ResourceUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates resource availability status or battery/fuel percentage.
    """
    try:
        return OperationalService.update_resource(db, resource_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ==========================================
# 8. FIELD TEAMS & SQUADS
# ==========================================

@router.get("/field-teams", response_model=FieldTeamListResponse, tags=["Resources"], summary="List SDRF, NDRF, and Field Squads")
def list_field_teams(db: Session = Depends(get_db)):
    """
    Returns deployment readiness of field squads and rescue task forces.
    """
    return OperationalService.list_field_teams(db)


@router.post("/field-teams/{team_id}/assign", response_model=FieldTeamSchema, tags=["Resources"], summary="Assign field team to incident")
def assign_field_team(team_id: str, req: FieldTeamAssignRequest, db: Session = Depends(get_db)):
    """
    Deploys a field squad to an incident with SLA timer and audit logging.
    """
    try:
        return OperationalService.assign_field_team(db, team_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/field-teams/{team_id}", response_model=FieldTeamSchema, tags=["Resources"], summary="Update field team status")
def update_field_team_status(team_id: str, req: FieldTeamStatusUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates team status (STANDBY, DEPLOYED, RESTING, OFFLINE).
    """
    try:
        return OperationalService.update_field_team_status(db, team_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ==========================================
# 9. INCIDENT COMMAND OPERATIONS
# ==========================================

@router.post("/incidents", response_model=IncidentSchema, status_code=status.HTTP_201_CREATED, tags=["Incidents"], summary="Create operational incident")
def create_incident(req: IncidentCreateRequest, db: Session = Depends(get_db)):
    """
    Logs an emergency incident in the officer command queue with SLA triage.
    """
    return OperationalService.create_incident(db, req)


@router.get("/incidents", response_model=IncidentListResponse, tags=["Incidents"], summary="List all operational incidents")
def list_incidents(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    settlement_id: Optional[str] = Query(None, description="Filter by settlement"),
    db: Session = Depends(get_db)
):
    """
    Returns all operational incidents prioritized by severity and people at risk.
    """
    return OperationalService.list_incidents(db, status_filter, settlement_id)


@router.get("/incidents/{incident_id}", response_model=IncidentSchema, tags=["Incidents"], summary="Get incident details")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    """
    Retrieves details for a single incident.
    """
    try:
        return OperationalService.get_incident(db, incident_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/incidents/{incident_id}", response_model=IncidentSchema, tags=["Incidents"], summary="Update incident status, severity, team or notes")
def update_incident(incident_id: str, req: IncidentUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates incident lifecycle (OPEN, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, ESCALATED, RESOLVED, CLOSED).
    """
    try:
        return OperationalService.update_incident(db, incident_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ==========================================
# 10. COMMUNITY CITIZEN REPORTS
# ==========================================

@router.post("/community-reports", response_model=CommunityReportSchema, status_code=status.HTTP_201_CREATED, tags=["Community Reports"], summary="Submit citizen community report")
def create_community_report(req: CommunityReportCreateRequest, db: Session = Depends(get_db)):
    """
    Records a hazard report submitted by citizens or local informants.
    """
    return OperationalService.create_community_report(db, req)


@router.get("/community-reports", response_model=CommunityReportListResponse, tags=["Community Reports"], summary="List community reports")
def list_community_reports(
    settlement_id: Optional[str] = Query(None, description="Filter by settlement ID"),
    db: Session = Depends(get_db)
):
    """
    Retrieves community reports pending or verified by officer desk.
    """
    return OperationalService.list_community_reports(db, settlement_id)


@router.post("/community-reports/{report_id}/action", response_model=CommunityReportSchema, tags=["Community Reports"], summary="Action community report", operation_id="action_community_report")
def action_community_report(report_id: str, req: CommunityReportActionRequest, db: Session = Depends(get_db)):
    """
    Executes an action on a community report (VERIFY, REJECT, REQUEST_MORE_INFORMATION, MARK_DUPLICATE).
    """
    try:
        return OperationalService.action_community_report(db, report_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/community-reports/{report_id}", response_model=CommunityReportSchema, tags=["Community Reports"], summary="Update/verify community report", operation_id="update_community_report_patch")
def update_community_report_patch(report_id: str, req: CommunityReportActionRequest, db: Session = Depends(get_db)):
    try:
        return OperationalService.action_community_report(db, report_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))



# ==========================================
# 11. REGIONAL AGGREGATION COMMAND VIEW
# ==========================================

@router.get("/regional/summary", response_model=RegionalSummaryResponse, tags=["Regional Command"], summary="Get state/district regional command summary")
def get_regional_summary(db: Session = Depends(get_db)):
    """
    Aggregates habitations, critical settlements, people at risk, shelter headroom, and relocation demand/capacity.
    """
    return OperationalService.get_regional_summary(db)


# ==========================================
# 12. STATUTORY DECISION APPROVAL
# ==========================================

@router.post("/decisions/approve", response_model=DecisionApprovalResponse, tags=["Decisions"], summary="Record statutory human decision approval")
def approve_decision(req: DecisionApprovalRequest, db: Session = Depends(get_db)):
    """
    Records official human officer sign-off (APPROVE, MODIFY, REJECT) with mandatory justification in the audit ledger.
    """
    return OperationalService.record_decision_approval(db, req)


