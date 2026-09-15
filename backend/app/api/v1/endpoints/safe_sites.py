from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.safe_site import SafeSiteModel
from app.schemas.safe_site import SafeSiteSchema, SafeSiteListResponse

router = APIRouter()


@router.get("", response_model=SafeSiteListResponse, tags=["Safe Sites"], summary="List Candidate Safe Resettlement Havens")
def list_safe_sites(
    min_safety_score: Optional[int] = Query(None, ge=0, le=100, description="Minimum hazard safety score"),
    min_capacity: Optional[int] = Query(None, ge=0, description="Minimum population carrying capacity"),
    db: Session = Depends(get_db)
) -> SafeSiteListResponse:
    """
    Retrieves vetted candidate safe havens with carrying capacities, land tenure classification, and development budgets.
    """
    query = db.query(SafeSiteModel)

    if min_safety_score is not None:
        query = query.filter(SafeSiteModel.hazard_safety_score >= min_safety_score)
    if min_capacity is not None:
        query = query.filter(SafeSiteModel.capacity_recommended_max >= min_capacity)

    items = query.order_by(SafeSiteModel.hazard_safety_score.desc()).all()

    return SafeSiteListResponse(
        total=len(items),
        data_classification="DEMO / SYNTHETIC DATA",
        items=[SafeSiteSchema.model_validate(s) for s in items]
    )


@router.get("/{id}", response_model=SafeSiteSchema, tags=["Safe Sites"], summary="Get Safe Resettlement Site Details")
def get_safe_site(id: str, db: Session = Depends(get_db)) -> SafeSiteSchema:
    """
    Retrieves details for a specific candidate safe haven.
    """
    site = db.query(SafeSiteModel).filter(
        (SafeSiteModel.id == id) | (SafeSiteModel.code.ilike(id))
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Safe site '{id}' not found.")
    return SafeSiteSchema.model_validate(site)


@router.get("/{id}/suitability", tags=["Safe Sites"], summary="Get Safe Haven Suitability for Settlement")
def get_safe_site_suitability(
    id: str,
    habitation_id: Optional[str] = Query("kadalpuram", description="Target settlement ID to evaluate against"),
    db: Session = Depends(get_db)
):
    """
    Evaluates candidate safe haven suitability, carrying capacity headroom, livelihood preservation, and hard exclusion criteria.
    """
    from app.services.risk_engine import CentralRiskEngine
    matches = CentralRiskEngine.match_safe_sites_for_habitation(db, habitation_id)
    filtered = [m for m in matches if m.site_id == id]
    if not filtered:
        raise HTTPException(status_code=404, detail=f"Safe site '{id}' not found.")
    return filtered

