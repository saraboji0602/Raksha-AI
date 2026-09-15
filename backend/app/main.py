import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app import models
from app.api.v1.api import api_router
from app.seeds.seed_data import seed_database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("raksha-ai-backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data if empty
    logger.info("Initializing RAKSHA-AI Database Schema...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    
    yield
    # Shutdown
    logger.info("Shutting down RAKSHA-AI Backend Service.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Statutory Decision Support Platform for Multi-Hazard Assessment, Safe Haven Selection, and Resilient Relocation.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration for Vite Frontend & Local Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/api/docs", include_in_schema=False)
def api_docs_redirect():
    return RedirectResponse(url="/docs")


@app.get("/api/openapi.json", include_in_schema=False)
def api_openapi_redirect():
    return RedirectResponse(url="/openapi.json")


@app.get("/", tags=["System"], summary="Root Health & Identity")
def root():
    return {
        "name": "RAKSHA-AI",
        "status": "operational",
        "mode": "DEMO"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

