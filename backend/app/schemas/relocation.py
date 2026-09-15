from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class RelocationPriorityItemSchema(BaseModel):
    habitation_id: str
    habitation_name: str
    district: str
    overall_risk: int
    priority: str
    priority_score: int
    ai_recommendation: str
    relocation_population: int
    allocated_safe_site_id: Optional[str] = None
    allocated_safe_site_name: Optional[str] = None
    cost_relocate_cr: float
    cost_of_inaction_cr: float
    benefit_cost_ratio: float
    status: str
    field_verified: bool
    data_classification: str = "DEMO / SYNTHETIC DATA"

    model_config = ConfigDict(from_attributes=True)


class RelocationPriorityListResponse(BaseModel):
    total: int
    total_relocating_citizens: int
    total_estimated_budget_cr: float
    total_prevented_loss_cr: float
    average_bcr: float
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[RelocationPriorityItemSchema]

    model_config = ConfigDict(from_attributes=True)
