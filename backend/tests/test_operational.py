"""
Comprehensive Test Suite for RAKSHA-AI Phase 4:
Data Health, System Status, Field Reports, SOS Lifecycles,
CAP Alerts, Shelters & Evacuation Routes, and Statutory Audit Trail.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.habitation import HabitationModel
from app.models.incident import FieldReportModel, IncidentModel


def test_data_health_endpoint(client: TestClient):
    """Test GET /api/data-health returns explicit connected and not-connected status"""
    response = client.get("/api/data-health")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sources"] >= 8
    assert data["connected_sources"] >= 4
    assert data["not_connected_sources"] >= 2  # IMD radar & NCCR pending
    assert data["demo_sources"] >= 2
    assert data["data_classification"] == "DEMO / SYNTHETIC DATA"

    # Check unverified / pending credentials flag
    radar_source = next((s for s in data["sources"] if "Cyclone" in s["source_name"]), None)
    assert radar_source is not None
    assert radar_source["connection_status"] == "NOT_CONNECTED"
    assert "credentials" in radar_source["error_message"].lower() or "not configured" in radar_source["error_message"].lower()


def test_system_status_endpoint(client: TestClient):
    """Test GET /api/system/status returns system mode and governance notices"""
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["system_mode"] in ("DEMO", "HYBRID", "LIVE")
    assert data["status"] == "OPERATIONAL"
    assert data["postgis_enabled"] is True
    assert "HUMAN APPROVAL REQUIRED" in data["governance_notice"]


def test_field_reports_lifecycle(client: TestClient, db: Session):
    """Test POST /api/reports -> GET /api/reports -> POST /api/reports/{id}/verify"""
    # 1. Submit report
    payload = {
        "settlement_id": "kadalpuram",
        "settlement_name": "Kadalpuram",
        "location_name": "North Fishermen Spit",
        "latitude": 10.772,
        "longitude": 79.840,
        "report_type": "COASTAL_EROSION",
        "description": "High tide scarp breach measured at 3.6m regression with GPS.",
        "measured_value": 3.6,
        "unit": "m",
        "reporter_name": "Inspector S. Murugesan"
    }
    create_resp = client.post("/api/reports", json=payload)
    assert create_resp.status_code == 201
    rep_data = create_resp.json()
    assert "id" in rep_data
    report_id = rep_data["id"]
    assert rep_data["status"] == "REPORTED"

    # 2. List reports
    list_resp = client.get("/api/reports?settlement_id=kadalpuram")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    assert any(r["id"] == report_id for r in list_data["items"])

    # 3. Verify report
    verify_payload = {
        "verified_by": "District Collector Tmt. K. Vani IAS",
        "status": "VERIFIED",
        "verification_notes": "Statutory ground truth verification signed and recorded in district registry."
    }
    verify_resp = client.post(f"/api/reports/{report_id}/verify", json=verify_payload)
    assert verify_resp.status_code == 200
    verify_data = verify_resp.json()
    assert verify_data["status"] == "VERIFIED"
    assert verify_data["confidence"] == 98
    assert verify_data["verified_by"] == "District Collector Tmt. K. Vani IAS"


def test_sos_lifecycle(client: TestClient):
    """Test POST /api/sos -> GET /api/sos -> PATCH /api/sos/{id}"""
    # 1. Submit SOS
    sos_payload = {
        "settlement_id": "kadalpuram",
        "settlement_name": "Kadalpuram",
        "title": "Elderly citizens stranded at North Spit",
        "type": "FLOOD_TRAPPED",
        "severity": "CRITICAL",
        "landmark": "Near Lighthouse Pier",
        "people_count": 5,
        "vulnerable_count": 3,
        "description": "Rising surge water cutting off main spit road."
    }
    create_resp = client.post("/api/sos", json=sos_payload)
    assert create_resp.status_code == 201
    sos_data = create_resp.json()
    assert "id" in sos_data
    sos_id = sos_data["id"]
    assert sos_data["status"] == "SENT"
    assert sos_data["priority_score"] >= 85

    # 2. List SOS incidents
    list_resp = client.get("/api/sos")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    target = next((item for item in list_data["items"] if item["id"] == sos_id), None)
    assert target is not None

    # 3. Update / Assign SOS
    patch_payload = {
        "status": "ASSIGNED",
        "assigned_team": "SDRF Coastal Unit 04",
        "resolution_notes": "Inflatable rescue boat dispatched."
    }
    patch_resp = client.patch(f"/api/sos/{sos_id}", json=patch_payload)
    assert patch_resp.status_code == 200
    updated_data = patch_resp.json()
    assert updated_data["status"] == "ASSIGNED"
    assert updated_data["assigned_team"] == "SDRF Coastal Unit 04"


def test_cap_alerts_endpoint(client: TestClient):
    """Test GET /api/alerts returns CAP-compatible multilingual alerts"""
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    alert = data["items"][0]
    assert alert["severity"] in ("EXTREME", "SEVERE", "MODERATE")
    assert "CAP-compatible" in alert["disclaimer"]
    assert "ta" in alert["local_messages"]
    assert "hi" in alert["local_messages"]
    assert len(alert["affected_settlement_ids"]) >= 1


def test_shelters_and_evacuation_status(client: TestClient):
    """Test GET /api/shelters and GET /api/evacuation-status"""
    # 1. Shelters
    shelters_resp = client.get("/api/shelters?settlement_id=kadalpuram")
    assert shelters_resp.status_code == 200
    sh_data = shelters_resp.json()
    assert sh_data["total"] >= 2
    assert sh_data["total_capacity"] >= 1500
    assert sh_data["available_shelter_capacity"] > 0

    # 2. Evacuation Status
    evac_resp = client.get("/api/evacuation-status?settlement_id=kadalpuram")
    assert evac_resp.status_code == 200
    evac_data = evac_resp.json()
    assert evac_data["settlement_name"] == "Kadalpuram"
    assert evac_data["overall_evacuation_status"] in ("COMPROMISED", "SAFE")
    assert "Safe Route B" in evac_data["safest_route_name"]
    assert evac_data["active_blockages_count"] >= 1
    assert len(evac_data["routes"]) >= 2


def test_statutory_audit_logs(client: TestClient):
    """Test GET /api/audit-logs and POST /api/audit-logs"""
    # 1. Post audit log
    audit_payload = {
        "actor_name": "District Revenue Officer Thiru P. Selvam",
        "actor_role": "Authorizing Officer",
        "action_type": "SITE_ALLOCATION",
        "title": "Approved 2,650 Citizen Allocation to Safe Haven Site B",
        "target_entity_id": "site-b",
        "target_entity_name": "Pothigai Hills Haven",
        "previous_value": "ALLOCATED: 0",
        "new_value": "ALLOCATED: 2650",
        "official_reason": "Statutory disaster risk mitigation directive approved under DM Act Section 30."
    }
    create_resp = client.post("/api/audit-logs", json=audit_payload)
    assert create_resp.status_code == 201
    log_data = create_resp.json()
    assert "id" in log_data
    assert "DM Act" in log_data["statutory_basis"] or "Disaster Management Act" in log_data["statutory_basis"]

    # 2. List audit logs
    list_resp = client.get("/api/audit-logs")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    assert any("SITE_ALLOCATION" in item["action_type"] for item in list_data["items"])


def test_resources_endpoints(client: TestClient):
    """Test GET /api/resources -> POST /api/resources/{id}/assign -> PATCH /api/resources/{id}"""
    # 1. List
    resp = client.get("/api/resources")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 4
    assert data["available_count"] >= 1
    res_id = data["items"][0]["id"]

    # 2. Assign
    assign_resp = client.post(f"/api/resources/{res_id}/assign", json={
        "incident_id": "inc-test-01",
        "assigned_to": "Zone A Rescue Sector",
        "dispatch_notes": "Deploying motorized raft unit."
    })
    assert assign_resp.status_code == 200
    assigned_data = assign_resp.json()
    assert assigned_data["status"] == "ASSIGNED"
    assert assigned_data["assigned_incident_id"] == "inc-test-01"

    # 3. Patch status back to available
    patch_resp = client.patch(f"/api/resources/{res_id}", json={
        "status": "AVAILABLE",
        "fuel_or_battery_percent": 95
    })
    assert patch_resp.status_code == 200
    patch_data = patch_resp.json()
    assert patch_data["status"] == "AVAILABLE"
    assert patch_data["assigned_incident_id"] is None


def test_field_teams_endpoints(client: TestClient):
    """Test GET /api/field-teams -> POST /api/field-teams/{id}/assign -> PATCH /api/field-teams/{id}"""
    # 1. List
    resp = client.get("/api/field-teams")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 3
    team_id = data["items"][0]["id"]

    # 2. Assign
    assign_resp = client.post(f"/api/field-teams/{team_id}/assign", json={
        "incident_id": "inc-test-02",
        "task_description": "Evacuate high-risk vulnerable households in Sector 1",
        "sla_minutes": 25
    })
    assert assign_resp.status_code == 200
    assigned_data = assign_resp.json()
    assert assigned_data["status"] == "DEPLOYED"
    assert assigned_data["assigned_incident_id"] == "inc-test-02"

    # 3. Update status
    patch_resp = client.patch(f"/api/field-teams/{team_id}", json={
        "status": "STANDBY",
        "current_assignment": "Resting at staging base"
    })
    assert patch_resp.status_code == 200
    patch_data = patch_resp.json()
    assert patch_data["status"] == "STANDBY"


def test_incident_command_endpoints(client: TestClient):
    """Test POST /api/incidents -> GET /api/incidents -> PATCH /api/incidents/{id}"""
    # 1. Create incident
    create_resp = client.post("/api/incidents", json={
        "title": "Breach at North Jetty Causeway",
        "type": "ROAD_BLOCKAGE",
        "severity": "HIGH",
        "settlement_id": "kadalpuram",
        "settlement_name": "Kadalpuram",
        "description": "Culvert submerged under 0.6m tidal surge.",
        "people_count": 12,
        "vulnerable_count": 4,
        "landmark": "Near Culvert B-07"
    })
    assert create_resp.status_code == 201
    inc_data = create_resp.json()
    inc_id = inc_data["id"]
    assert inc_data["status"] == "OPEN"
    assert inc_data["priority_score"] >= 75

    # 2. Get details
    get_resp = client.get(f"/api/incidents/{inc_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == inc_id

    # 3. Patch incident
    patch_resp = client.patch(f"/api/incidents/{inc_id}", json={
        "status": "IN_PROGRESS",
        "assigned_team": "SDRF Squad Alpha",
        "resolution_notes": "Team on site with dewatering pump."
    })
    assert patch_resp.status_code == 200
    updated = patch_resp.json()
    assert updated["status"] == "IN_PROGRESS"
    assert updated["assigned_team"] == "SDRF Squad Alpha"


def test_community_reports_endpoints(client: TestClient):
    """Test POST /api/community-reports -> GET /api/community-reports -> POST /api/community-reports/{id}/action"""
    # 1. Create community report
    create_resp = client.post("/api/community-reports", json={
        "settlement_id": "kadalpuram",
        "hazard_type": "FLOODING",
        "location_name": "Near Fish Market Ward 2",
        "description": "Rising salt water entering alleyways.",
        "reporter_name": "Village Elder Raman"
    })
    assert create_resp.status_code == 201
    rep_data = create_resp.json()
    rep_id = rep_data["id"]
    assert rep_data["status"] == "REPORTED"

    # 2. List
    list_resp = client.get("/api/community-reports?settlement_id=kadalpuram")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1

    # 3. Verify action
    action_resp = client.post(f"/api/community-reports/{rep_id}/action", json={
        "action": "VERIFY",
        "verified_by": "Inspector M. Selvam",
        "notes": "Verified high tide breach on site."
    })
    assert action_resp.status_code == 200
    action_data = action_resp.json()
    assert action_data["status"] == "VERIFIED"
    assert action_data["confidence"] > 80


def test_create_alert_endpoint(client: TestClient):
    """Test POST /api/alerts broadcast"""
    alert_payload = {
        "event": "Cyclonic Tidal Surge Red Alert",
        "urgency": "IMMEDIATE",
        "severity": "EXTREME",
        "certainty": "OBSERVED",
        "headline": "Severe coastal tidal surge inundating low-lying spit sectors.",
        "description": "High tide backwater breaching culvert B-07 and threatening frontline dwellings.",
        "instruction": "Evacuate immediately via SH-49 High Bypass to Pothigai Hills Safe Haven.",
        "area_description": "Kadalpuram Coastline and Low-Lying Estuary Margins",
        "affected_settlement_ids": ["kadalpuram"]
    }
    resp = client.post("/api/alerts", json=alert_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "RAKSHA-CAP-2026" in data["identifier"]
    assert data["severity"] == "EXTREME"
    assert "ta" in data["local_messages"]
    assert "hi" in data["local_messages"]


def test_regional_summary_endpoint(client: TestClient):
    """Test GET /api/regional/summary"""
    resp = client.get("/api/regional/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["state"] == "Tamil Nadu"
    assert data["total_habitations"] >= 1
    assert data["total_population_at_risk"] > 0
    assert data["available_shelter_headroom"] >= 0
    assert len(data["habitations"]) >= 1


def test_decision_approval_endpoint(client: TestClient):
    """Test POST /api/decisions/approve"""
    approval_payload = {
        "habitation_id": "kadalpuram",
        "action": "APPROVE",
        "approved_intervention": "FULL_RELOCATION",
        "officer_name": "Dr. S. K. Narayanan IAS",
        "officer_badge": "DIS-COL-TN-092",
        "justification_reason": "Coastal scarp erosion irreversible; Site B allocation approved under DM Act 2005.",
        "confidence_acknowledged": 94
    }
    resp = client.post("/decisions/approve", json=approval_payload)
    if resp.status_code == 404:
        # Check if route is /api/decisions/approve
        resp = client.post("/api/decisions/approve", json=approval_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "HUMAN DECISION RECORDED" in data["governance_message"]

