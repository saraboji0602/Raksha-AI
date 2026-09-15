from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class HazardSummarySchema(BaseModel):
    hazard_type: str
    name: str
    affected_habitations_count: int
    critical_habitations_count: int
    highest_risk_score: int
    average_risk_score: float
    description: str

    model_config = ConfigDict(from_attributes=True)


class HazardLayerConfigSchema(BaseModel):
    id: str
    name: str
    hazard_type: str
    description: Optional[str] = None
    color: str
    visible: bool = True
    opacity: float = 0.6
    source: str
    resolution: str

    model_config = ConfigDict(from_attributes=True)


class HazardListResponse(BaseModel):
    total_layers: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    summaries: List[HazardSummarySchema]
    layers: List[HazardLayerConfigSchema]

    model_config = ConfigDict(from_attributes=True)
