"""
Comprehensive Test Suite for RAKSHA-AI Phase 3:
Central Risk Engine, Multi-Hazard Analysis, Exposure, Vulnerability, Resilience,
Dual Prioritization, Safe-Site Matching & Hard Filters, Scenario Simulator, and APIs.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.habitation import HabitationModel, MicroZoneModel
from app.models.safe_site import SafeSiteModel
from app.services.risk_engine import CentralRiskEngine, SystemScoringWeights


# ==========================================
# 1. RISK ENGINE UNIT TESTS
# ==========================================

def test_explainable_risk_decomposition(db: Session):
    """Test deterministic explainable risk decomposition for Kadalpuram"""
    kadalpuram = db.query(HabitationModel).filter(HabitationModel.id == "kadalpuram").first()
    assert kadalpuram is not None

    decomp = CentralRiskEngine.decompose_explainable_risk(kadalpuram)
    assert decomp.habitation_id == "kadalpuram"
    assert decomp.overall_risk == 72
    assert decomp.risk_level in ("CRITICAL", "VERY_HIGH", "HIGH")
    assert decomp.dominant_hazard == "coastal_erosion"
    assert decomp.exposure_score == 88
    assert decomp.vulnerability_score == 84
    assert decomp.resilience_score == 48
    assert len(decomp.top_contributors) >= 4
    assert decomp.data_classification == "DEMO / SYNTHETIC DATA"
    assert "CartoDEM" in decomp.data_sources[0]


def test_compound_hazard_multipliers(db: Session):
    """Test compound multi-hazard interaction multipliers and synergy classification"""
    kadalpuram = db.query(HabitationModel).filter(HabitationModel.id == "kadalpuram").first()
    compound = CentralRiskEngine.evaluate_compound_hazards(kadalpuram)
    
    # Kadalpuram has compound interaction (Flood + Cyclone or Cyclone + Coastal Erosion)
    assert compound.type in ("FLOOD_PLUS_CYCLONE", "CYCLONE_PLUS_COASTAL_EROSION")
    assert compound.interaction_multiplier >= 1.20
    assert len(compound.explanation) > 10


def test_micro_zone_risk_calculation(db: Session):
    """Test micro-zone granular risk and evacuation bottleneck identification"""
    north_zone = db.query(MicroZoneModel).filter(
        (MicroZoneModel.id == "kz-1") | (MicroZoneModel.zone_code == "MZ-01-NORTH")
    ).first()
    assert north_zone is not None

    mz_resp = CentralRiskEngine.calculate_micro_zone_risk(north_zone)
    assert mz_resp.zone_code == "MZ-01-NORTH"
    assert mz_resp.risk_score == 96
    assert mz_resp.risk_level == "CRITICAL"
    assert mz_resp.priority == "IMMEDIATE"
    assert mz_resp.recommended_action == "PARTIAL_RELOCATION"
    assert mz_resp.evacuation_access == "BOTTLENECK"


def test_dual_prioritization_logic(db: Session):
    """Test dual prioritization queue: Emergency Urgency + Long-Term Relocation Priority"""
    prio_list = CentralRiskEngine.calculate_prioritization_matrix(db)
    assert prio_list.total >= 3
    assert prio_list.total_high_urgency >= 1
    assert prio_list.total_long_term_relocation >= 2

    # Check Kadalpuram priority scores
    kadal = next((item for item in prio_list.items if item.habitation_id == "kadalpuram"), None)
    assert kadal is not None
    assert kadal.emergency_urgency in ("IMMEDIATE", "SHORT_TERM")
    assert kadal.long_term_priority in ("IMMEDIATE", "SHORT_TERM")
    assert kadal.bcr >= 2.5  # ₹84.5 Cr / ₹28.5 Cr = ~2.96


def test_intervention_decision_scenarios(db: Session):
    """Test 4-scenario decision analysis (Protect vs Adapt vs Relocate) with residual risk and BCR"""
    kadalpuram = db.query(HabitationModel).filter(HabitationModel.id == "kadalpuram").first()
    decision = CentralRiskEngine.evaluate_intervention_decision(kadalpuram)

    assert decision.ai_recommended_intervention == "PARTIAL_RELOCATION"
    assert len(decision.scenarios) == 5

    # Check Do Nothing
    do_nothing = next(s for s in decision.scenarios if s.type == "DO_NOTHING")
    assert do_nothing.investment_cr == 0.0
    assert do_nothing.residual_risk >= kadalpuram.overall_risk

    # Check Partial Relocation
    partial_reloc = next(s for s in decision.scenarios if s.type == "PARTIAL_RELOCATION")
    assert partial_reloc.is_ai_recommended is True
    assert partial_reloc.residual_risk == 22
    assert partial_reloc.risk_reduction_pct == 76
    assert partial_reloc.benefit_cost_ratio > 2.0


def test_safe_site_matching_and_hard_filters(db: Session):
    """Test safe haven matching, capacity allocation, and hard exclusion filter execution"""
    matches = CentralRiskEngine.match_safe_sites_for_habitation(db, "kadalpuram")
    assert len(matches) >= 1

    # Site B should be #1 recommended haven for Kadalpuram
    top_match = matches[0]
    assert top_match.site_id == "site-b"
    assert top_match.is_recommended is True
    assert top_match.is_hard_filter_passed is True
    assert top_match.carrying_capacity == 5000
    assert top_match.available_capacity >= 2000
    assert top_match.suitability_score >= 80


# ==========================================
# 2. REST API ENDPOINTS INTEGRATION TESTS
# ==========================================

def test_api_list_habitations_risk(client: TestClient):
    """Test GET /api/risk/habitations"""
    response = client.get("/api/risk/habitations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert any(h["habitation_id"] == "kadalpuram" for h in data)
    assert data[0]["data_classification"] == "DEMO / SYNTHETIC DATA"


def test_api_get_habitation_risk_detail(client: TestClient):
    """Test GET /api/risk/habitations/kadalpuram"""
    response = client.get("/api/risk/habitations/kadalpuram")
    assert response.status_code == 200
    data = response.json()
    assert data["habitation_id"] == "kadalpuram"
    assert data["overall_risk"] == 72
    assert len(data["top_contributors"]) >= 4
    assert data["compound_hazard_flag"] is True


def test_api_get_micro_zone_risk(client: TestClient):
    """Test GET /api/risk/micro-zones/mz-01-north and kz-1"""
    response = client.get("/api/risk/micro-zones/mz-01-north")
    assert response.status_code == 200
    data = response.json()
    assert data["zone_code"] == "MZ-01-NORTH"
    assert data["risk_score"] == 96
    assert data["recommended_action"] == "PARTIAL_RELOCATION"


def test_api_get_priorities_matrix(client: TestClient):
    """Test GET /api/priorities and GET /api/priorities/kadalpuram"""
    response = client.get("/api/priorities")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert data["total_high_urgency"] >= 1

    single_resp = client.get("/api/priorities/kadalpuram")
    assert single_resp.status_code == 200
    single_data = single_resp.json()
    assert single_data["habitation_id"] == "kadalpuram"
    assert single_data["emergency_urgency_score"] >= 70


def test_api_get_decision_analysis(client: TestClient):
    """Test GET /api/decisions/kadalpuram"""
    response = client.get("/api/decisions/kadalpuram")
    assert response.status_code == 200
    data = response.json()
    assert data["habitation_id"] == "kadalpuram"
    assert data["ai_recommended_intervention"] == "PARTIAL_RELOCATION"
    assert len(data["scenarios"]) == 5


def test_api_safe_site_suitability(client: TestClient):
    """Test GET /api/safe-sites/site-b/suitability"""
    response = client.get("/api/safe-sites/site-b/suitability?habitation_id=kadalpuram")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["site_id"] == "site-b"
    assert data[0]["is_recommended"] is True
    assert data[0]["suitability_score"] >= 80


def test_api_post_scenario_simulation(client: TestClient):
    """Test POST /api/scenarios/run"""
    payload = {
        "habitation_id": "kadalpuram",
        "hazard_multiplier": 1.25,
        "sea_level_rise_cm": 25,
        "coastal_erosion_rate_m_yr": 4.2
    }
    response = client.post("/api/scenarios/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["habitation_id"] == "kadalpuram"
    assert data["simulated_hazard_risk"] >= 72
    assert "DO_NOTHING" in data["ten_year_damage_curve"]
    assert len(data["ten_year_damage_curve"]["DO_NOTHING"]) == 6


def test_api_data_quality_summary(client: TestClient):
    """Test GET /api/data-quality"""
    response = client.get("/api/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_system_quality_score"] > 0
    assert data["data_classification"] == "DEMO / SYNTHETIC DATA"


def test_api_trigger_risk_recalculation(client: TestClient):
    """Test POST /api/risk/recalculate"""
    response = client.post("/api/risk/recalculate")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["habitations_recalculated"] >= 3
