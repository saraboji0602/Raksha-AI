from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.habitation import HabitationModel
from app.models.safe_site import SafeSiteModel
from app.schemas.relocation import RelocationPriorityItemSchema, RelocationPriorityListResponse
from app.services.risk_service import RiskCalculationService


class SiteOptimizationService:
    @staticmethod
    def get_relocation_priorities(db: Session) -> RelocationPriorityListResponse:
        """
        Retrieves settlements requiring relocation, calculates BCR, and links allocated safe havens.
        """
        habitations = db.query(HabitationModel).filter(
            HabitationModel.ai_recommendation.in_(["PARTIAL_RELOCATION", "FULL_RELOCATION"])
        ).order_by(HabitationModel.overall_risk.desc()).all()

        safe_sites_dict = {s.id: s for s in db.query(SafeSiteModel).all()}

        items: List[RelocationPriorityItemSchema] = []
        total_citizens = 0
        total_budget = 0.0
        total_prevented = 0.0

        for h in habitations:
            site = safe_sites_dict.get(h.recommended_site_id) if h.recommended_site_id else None
            bcr = RiskCalculationService.get_relocation_benefit_cost_ratio(h)

            item = RelocationPriorityItemSchema(
                habitation_id=h.id,
                habitation_name=h.name,
                district=h.district,
                overall_risk=h.overall_risk,
                priority=h.priority,
                priority_score=h.priority_score,
                ai_recommendation=h.ai_recommendation,
                relocation_population=h.relocation_population,
                allocated_safe_site_id=site.id if site else None,
                allocated_safe_site_name=site.name if site else None,
                cost_relocate_cr=h.cost_relocate_cr,
                cost_of_inaction_cr=h.cost_of_inaction_cr,
                benefit_cost_ratio=bcr,
                status=h.status,
                field_verified=h.field_verified,
                data_classification="DEMO / SYNTHETIC DATA"
            )
            items.append(item)
            total_citizens += h.relocation_population
            total_budget += h.cost_relocate_cr
            total_prevented += h.cost_of_inaction_cr

        avg_bcr = round(total_prevented / total_budget, 2) if total_budget > 0 else 1.0

        return RelocationPriorityListResponse(
            total=len(items),
            total_relocating_citizens=total_citizens,
            total_estimated_budget_cr=round(total_budget, 2),
            total_prevented_loss_cr=round(total_prevented, 2),
            average_bcr=avg_bcr,
            data_classification="DEMO / SYNTHETIC DATA",
            items=items
        )
