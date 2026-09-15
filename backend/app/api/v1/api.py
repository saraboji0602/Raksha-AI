from fastapi import APIRouter
from app.api.v1.endpoints import health, habitations, hazards, safe_sites, relocation, datasets, risk, operational

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(habitations.router, prefix="/habitations")
api_router.include_router(hazards.router, prefix="/hazards")
api_router.include_router(safe_sites.router, prefix="/safe-sites")
api_router.include_router(relocation.router)
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets & Ingestion"])
api_router.include_router(risk.router)
api_router.include_router(operational.router)

