from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.schemas.common import HealthResponse
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"], summary="System Health & Datastore Status")
def get_health(db: Session = Depends(get_db)) -> HealthResponse:
    """
    Checks backend connectivity, database status, and returns environment metadata.
    """
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return HealthResponse(
        status="ok",
        version="1.0.0",
        project_name=settings.PROJECT_NAME,
        environment=settings.ENVIRONMENT,
        database_status=db_status,
        data_classification=settings.DATA_CLASSIFICATION
    )
