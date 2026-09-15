from pydantic import BaseModel, ConfigDict
from typing import Optional


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    project_name: str = "RAKSHA-AI Decision Intelligence Platform"
    environment: str = "development"
    database_status: str = "connected"
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    success: bool = True
    message: str
    data_classification: str = "DEMO / SYNTHETIC DATA"
