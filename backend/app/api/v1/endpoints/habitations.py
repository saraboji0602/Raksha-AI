from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.habitation import HabitationModel
from app.schemas.habitation import HabitationSchema, HabitationDetailSchema, HabitationListResponse

router = APIRouter()


@router.get("", response_model=HabitationListResponse, tags=["Habitations"], summary="List Vulnerable Habitations")
def list_habitations(
    district: Optional[str] = Query(None, description="Filter by district name"),
    hazard_type: Optional[str] = Query(None, description="Filter by dominant hazard"),
    min_risk: Optional[int] = Query(None, ge=0, le=100, description="Filter by minimum risk score"),
    db: Session = Depends(get_db)
) -> HabitationListResponse:
    """
    Retrieves prioritized list of disaster-vulnerable habitations across the district.
    Personal identifiers are omitted for data privacy.
    """
    query = db.query(HabitationModel)

    if district and district.upper() != "ALL":
        query = query.filter(HabitationModel.district.ilike(f"%{district}%"))
    if hazard_type and hazard_type.upper() != "ALL":
        query = query.filter(HabitationModel.dominant_hazard == hazard_type.lower())
    if min_risk is not None:
        query = query.filter(HabitationModel.overall_risk >= min_risk)

    items = query.order_by(HabitationModel.overall_risk.desc()).all()

    return HabitationListResponse(
        total=len(items),
        data_classification="DEMO / SYNTHETIC DATA",
        items=[HabitationSchema.model_validate(h) for h in items]
    )


@router.get("/{id}", response_model=HabitationDetailSchema, tags=["Habitations"], summary="Get Habitation Digital Twin Details")
def get_habitation(id: str, db: Session = Depends(get_db)) -> HabitationDetailSchema:
    """
    Retrieves deep Digital Twin profile for a specific habitation including micro-zones and hazard breakdowns.
    """
    habitation = db.query(HabitationModel).filter(HabitationModel.id == id).first()
    if not habitation:
        raise HTTPException(status_code=404, detail=f"Habitation with ID '{id}' not found.")

    return HabitationDetailSchema.model_validate(habitation)
