from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.relocation import RelocationPriorityListResponse
from app.schemas.operational import RelocationMatchRequest, RelocationMatchResponse
from app.services.site_service import SiteOptimizationService
from app.services.operational_service import OperationalService

router = APIRouter()


@router.get("/relocation-priorities", response_model=RelocationPriorityListResponse, tags=["Relocation"], summary="Get Ranked Relocation Priorities & Cost-Benefit Ratios", operation_id="get_relocation_priorities_legacy")
def get_relocation_priorities_legacy(db: Session = Depends(get_db)) -> RelocationPriorityListResponse:
    return SiteOptimizationService.get_relocation_priorities(db)


@router.get("/relocation/priorities", response_model=RelocationPriorityListResponse, tags=["Relocation"], summary="Get Ranked Relocation Priorities & Cost-Benefit Ratios", operation_id="get_relocation_priorities_standard")
def get_relocation_priorities(db: Session = Depends(get_db)) -> RelocationPriorityListResponse:
    """
    Returns prioritized list of settlements requiring relocation, carrying capacity matches, and Benefit-Cost Ratios (BCR).
    """
    return SiteOptimizationService.get_relocation_priorities(db)


@router.post("/relocation/match", response_model=RelocationMatchResponse, tags=["Relocation"], summary="Match affected population to candidate safe sites")
def match_relocation(req: RelocationMatchRequest, db: Session = Depends(get_db)) -> RelocationMatchResponse:
    """
    Evaluates carrying capacity, distance, livelihood continuity, and matches vulnerable populations without over-allocation.
    """
    return OperationalService.match_relocation(db, req)


@router.get("/relocation/matches", response_model=List[Dict[str, Any]], tags=["Relocation"], summary="List all pre-computed safe site allocations")
def list_relocation_matches(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Retrieves global relocation allocation matrix across all vulnerable coastal habitations.
    """
    return OperationalService.list_relocation_matches(db)

