from typing import List, Dict, Any
from app.models.habitation import HabitationModel


class RiskCalculationService:
    @staticmethod
    def calculate_priority_score(habitation: HabitationModel) -> int:
        """
        Deterministic prioritization score based on overall risk, exposure, and vulnerability.
        """
        weighted = (
            (habitation.overall_risk * 0.45) +
            (habitation.exposure_score * 0.30) +
            ((100 - habitation.resilience_score) * 0.25)
        )
        return min(100, max(1, round(weighted)))

    @staticmethod
    def get_relocation_benefit_cost_ratio(habitation: HabitationModel) -> float:
        """
        Benefit-Cost Ratio (BCR) = Prevented Inaction Loss / Relocation Capex
        """
        if habitation.cost_relocate_cr <= 0:
            return 1.0
        ratio = habitation.cost_of_inaction_cr / habitation.cost_relocate_cr
        return round(ratio, 2)
