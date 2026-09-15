from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.habitation import HabitationModel, MicroZoneModel
from app.models.safe_site import SafeSiteModel
from app.schemas.risk import (
    RiskDecompositionSchema,
    MicroZoneRiskResponse,
    PrioritizationItemSchema,
    PrioritizationListResponse,
    InterventionDecisionSchema,
    SafeSiteSuitabilitySchema,
    SafeSiteListResponse,
    ScenarioRunRequest,
    ScenarioRunResponse,
    DataQualitySummaryResponse,
)
from app.schemas.operational import MicroZoneListResponse, MicroZoneSchema, DecisionApprovalRequest, DecisionApprovalResponse, DecisionUpdateRequest
from app.services.risk_engine import CentralRiskEngine
from app.services.operational_service import OperationalService

router = APIRouter()


# ==========================================
# 1. RISK DECOMPOSITION ENDPOINTS
# ==========================================

@router.get("/risk", response_model=List[RiskDecompositionSchema], tags=["Risk Intelligence"], summary="Get decomposed explainable risk for all habitations", operation_id="list_habitations_risk_primary")
def list_habitations_risk(
    district: Optional[str] = Query(None, description="Filter by district"),
    min_risk: Optional[int] = Query(None, ge=0, le=100, description="Minimum overall risk score"),
    db: Session = Depends(get_db),
):
    query = db.query(HabitationModel)
    if district and district.upper() != "ALL":
        query = query.filter(HabitationModel.district.ilike(f"%{district}%"))
    if min_risk is not None:
        query = query.filter(HabitationModel.overall_risk >= min_risk)

    habitations = query.order_by(HabitationModel.overall_risk.desc()).all()
    return [CentralRiskEngine.decompose_explainable_risk(h) for h in habitations]


@router.get("/risk/habitations", response_model=List[RiskDecompositionSchema], tags=["Risk Intelligence"], summary="Get decomposed explainable risk for all habitations", operation_id="list_habitations_risk_alias")
def list_habitations_risk_alias(
    district: Optional[str] = Query(None, description="Filter by district"),
    min_risk: Optional[int] = Query(None, ge=0, le=100, description="Minimum overall risk score"),
    db: Session = Depends(get_db),
):
    return list_habitations_risk(district=district, min_risk=min_risk, db=db)


@router.get("/risk/{habitation_id}", response_model=RiskDecompositionSchema, tags=["Risk Intelligence"], summary="Get decomposed risk for a specific habitation", operation_id="get_habitation_risk_primary")
def get_habitation_risk(habitation_id: str, db: Session = Depends(get_db)):
    """
    Retrieves decomposed explainable risk profile for a single settlement by ID.
    """
    habitation = db.query(HabitationModel).filter(HabitationModel.id == habitation_id).first()
    if not habitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Habitation '{habitation_id}' not found.")
    return CentralRiskEngine.decompose_explainable_risk(habitation)


@router.get("/risk/{habitation_id}/explain", response_model=RiskDecompositionSchema, tags=["Risk Intelligence"], summary="Get explainable risk rationale for a specific habitation", operation_id="get_habitation_risk_explain")
def get_habitation_risk_explain(habitation_id: str, db: Session = Depends(get_db)):
    return get_habitation_risk(habitation_id=habitation_id, db=db)


@router.get("/risk/habitations/{habitation_id}", response_model=RiskDecompositionSchema, tags=["Risk Intelligence"], summary="Get decomposed risk for a specific habitation", operation_id="get_habitation_risk_alias")
def get_habitation_risk_alias(habitation_id: str, db: Session = Depends(get_db)):
    return get_habitation_risk(habitation_id=habitation_id, db=db)


# ==========================================
# 2. MICRO-ZONES INTELLIGENCE
# ==========================================

@router.get("/micro-zones", response_model=MicroZoneListResponse, tags=["Micro Zones"], summary="List all micro-zones across settlements", operation_id="list_micro_zones")
def list_micro_zones(
    habitation_id: Optional[str] = Query(None, description="Filter by habitation ID"),
    db: Session = Depends(get_db)
):
    """
    Retrieves all micro-zones with granular population exposure, scarp distance, and evacuation accessibility.
    """
    return OperationalService.list_micro_zones(db, habitation_id)


@router.get("/micro-zones/{id}", response_model=MicroZoneRiskResponse, tags=["Micro Zones"], summary="Get micro-zone risk decomposition", operation_id="get_micro_zone_risk_primary")
def get_micro_zone_risk(id: str, db: Session = Depends(get_db)):
    """
    Retrieves granular micro-zone risk, population exposure, and evacuation access.
    """
    zone = db.query(MicroZoneModel).filter(
        (MicroZoneModel.id == id) | (MicroZoneModel.zone_code.ilike(id))
    ).first()
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"MicroZone '{id}' not found.")
    return CentralRiskEngine.calculate_micro_zone_risk(zone)


@router.get("/risk/micro-zones/{id}", response_model=MicroZoneRiskResponse, tags=["Micro Zones"], summary="Get micro-zone risk decomposition", operation_id="get_micro_zone_risk_alias")
def get_micro_zone_risk_alias(id: str, db: Session = Depends(get_db)):
    return get_micro_zone_risk(id=id, db=db)



# ==========================================
# 3. DUAL PRIORITIZATION ENDPOINTS
# ==========================================

@router.get("/priorities", response_model=PrioritizationListResponse, tags=["Prioritization"], summary="Get dual prioritization matrix")
def get_priorities(db: Session = Depends(get_db)):
    """
    Returns dual-ranked prioritization queue:
    1. Emergency Urgency (imminent response)
    2. Long-Term Relocation Priority (high-vulnerability small settlements preserved)
    """
    return CentralRiskEngine.calculate_prioritization_matrix(db)


@router.get("/priorities/{id}", response_model=PrioritizationItemSchema, tags=["Prioritization"], summary="Get priority metrics for single habitation")
def get_single_priority(id: str, db: Session = Depends(get_db)):
    """
    Returns urgency and relocation priority scores for a single settlement.
    """
    matrix = CentralRiskEngine.calculate_prioritization_matrix(db)
    item = next((p for p in matrix.items if p.habitation_id == id), None)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Priority record for habitation '{id}' not found.")
    return item


# ==========================================
# 4. DECISION ENGINE (PROTECT / ADAPT / RELOCATE)
# ==========================================

@router.get("/decisions", response_model=List[InterventionDecisionSchema], tags=["Decisions"], summary="List Protect vs Adapt vs Relocate analyses across all settlements")
def list_all_decisions(db: Session = Depends(get_db)):
    """
    Evaluates 4 intervention pathways across all habitations with residual risk modeling.
    """
    habitations = db.query(HabitationModel).all()
    return [CentralRiskEngine.evaluate_intervention_decision(h) for h in habitations]


@router.get("/decisions/{habitation_id}", response_model=InterventionDecisionSchema, tags=["Decisions"], summary="Get Protect vs Adapt vs Relocate decision analysis")
def get_decision_analysis(habitation_id: str, db: Session = Depends(get_db)):
    """
    Evaluates 4 intervention pathways with cost-benefit analysis and residual risk modeling.
    """
    habitation = db.query(HabitationModel).filter(HabitationModel.id == habitation_id).first()
    if not habitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Habitation '{habitation_id}' not found.")
    return CentralRiskEngine.evaluate_intervention_decision(habitation)


@router.post("/decisions", response_model=DecisionApprovalResponse, tags=["Decisions"], summary="Submit statutory human decision approval")
def create_decision(req: DecisionApprovalRequest, db: Session = Depends(get_db)):
    """
    Records official human officer sign-off (APPROVE, MODIFY, REJECT) in the immutable statutory audit ledger.
    """
    return OperationalService.record_decision_approval(db, req)


@router.patch("/decisions/{id}", response_model=DecisionApprovalResponse, tags=["Decisions"], summary="Update statutory decision directive")
def update_decision(id: str, req: DecisionUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates decision status and logs directive change to the audit ledger.
    """
    approval_req = DecisionApprovalRequest(
        habitation_id=id,
        action=req.action or "MODIFY",
        approved_intervention=req.approved_intervention or "PARTIAL_RELOCATION",
        officer_name=req.officer_name or "District Collector & DM",
        officer_badge=req.officer_badge or "DIS-COL-TN-092",
        justification_reason=req.justification_reason or "Directive updated based on verified ground telemetry.",
    )
    return OperationalService.record_decision_approval(db, approval_req)


# ==========================================
# 5. WHAT-IF SCENARIO SIMULATOR
# ==========================================

@router.post("/scenarios/run", response_model=ScenarioRunResponse, tags=["Scenario Simulator"], summary="Run 5-policy what-if scenario simulation")
def run_scenario(request: ScenarioRunRequest, db: Session = Depends(get_db)):
    """
    Executes what-if simulation comparing DO NOTHING, PROTECT, ADAPT, PARTIAL RELOCATION, and FULL RELOCATION.
    """
    return CentralRiskEngine.run_scenario_simulation(db, request)


# ==========================================
# 6. DATA QUALITY & EVENT-TRIGGERED RECALCULATION
# ==========================================

@router.get("/data-quality", response_model=DataQualitySummaryResponse, tags=["Data Health"], summary="Get system-wide data quality & source provenance summary")
def get_data_quality(db: Session = Depends(get_db)):
    """
    Returns aggregated quality scores, active dataset catalog, and verified/demo breakdown.
    """
    return CentralRiskEngine.get_data_quality_summary(db)


@router.post("/risk/recalculate", tags=["Risk Intelligence"], summary="Trigger dynamic event-based risk recalculation")
def trigger_risk_recalculation(db: Session = Depends(get_db)):
    """
    Event-triggered recalculation across all habitations when new telemetry or hazard records are ingested.
    """
    return CentralRiskEngine.recalculate_all_habitations(db)

