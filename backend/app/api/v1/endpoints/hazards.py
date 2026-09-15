from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.habitation import HabitationModel
from app.models.hazard import HazardDataModel, HazardLayerConfigModel
from app.schemas.hazard import HazardListResponse, HazardSummarySchema, HazardLayerConfigSchema

router = APIRouter()


@router.get("", response_model=HazardListResponse, tags=["Hazards"], summary="List Hazard Layers and District Multi-Hazard Summaries")
def list_hazards(db: Session = Depends(get_db)) -> HazardListResponse:
    """
    Returns multi-hazard aggregated statistics and active GIS raster/vector layer configurations.
    """
    layers = db.query(HazardLayerConfigModel).all()

    # Aggregate hazard summaries across habitations
    hazard_types = ["coastal_erosion", "cyclone", "flood", "landslide", "heatwave"]
    summaries: List[HazardSummarySchema] = []

    for ht in hazard_types:
        haz_records = db.query(HazardDataModel).filter(HazardDataModel.type == ht).all()
        hab_count = len(haz_records)
        critical_count = sum(1 for h in haz_records if h.score >= 80)
        max_score = max((h.score for h in haz_records), default=0)
        avg_score = round(sum(h.score for h in haz_records) / hab_count, 1) if hab_count > 0 else 0.0

        names = {
            "coastal_erosion": "Coastal Erosion & Scarp Retreat",
            "cyclone": "Cyclonic Storm Surge & High Winds",
            "flood": "Monsoon Inundation & Fluvial Surge",
            "landslide": "Slope Instability & Debris Liquefaction",
            "heatwave": "Extreme Thermal Humidity Stress"
        }

        descriptions = {
            "coastal_erosion": "Active shoreline retreat threatening frontline coastal hamlets.",
            "cyclone": "Category 3/4 storm surge inundating estuarine habitations.",
            "flood": "Riverine runoff and backwater congestion during heavy downpours.",
            "landslide": "Crown tension cracks and pore-water saturation on steep hill slopes.",
            "heatwave": "Wet-bulb temperature spikes exceeding safe human physiological limits."
        }

        summaries.append(
            HazardSummarySchema(
                hazard_type=ht,
                name=names.get(ht, ht.title()),
                affected_habitations_count=hab_count,
                critical_habitations_count=critical_count,
                highest_risk_score=max_score,
                average_risk_score=avg_score,
                description=descriptions.get(ht, "Multi-hazard vector assessment.")
            )
        )

    return HazardListResponse(
        total_layers=len(layers),
        data_classification="DEMO / SYNTHETIC DATA",
        summaries=summaries,
        layers=[HazardLayerConfigSchema.model_validate(l) for l in layers]
    )
