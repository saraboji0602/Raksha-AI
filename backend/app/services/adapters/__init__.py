"""
Adapter registry and exports for RAKSHA-AI Dataset Ingestion.
"""

from typing import Dict, Optional, Type
from app.services.adapters.base import DataSourceAdapter
from app.services.adapters.flood_adapter import FloodAdapter
from app.services.adapters.weather_adapter import WeatherAdapter
from app.services.adapters.river_adapter import RiverAdapter
from app.services.adapters.cyclone_adapter import CycloneAdapter
from app.services.adapters.terrain_adapter import TerrainAdapter
from app.services.adapters.infra_adapter import InfrastructureAdapter

ADAPTER_REGISTRY: Dict[str, Type[DataSourceAdapter]] = {
    "flood": FloodAdapter,
    "hazard_flood": FloodAdapter,
    "weather": WeatherAdapter,
    "rainfall": WeatherAdapter,
    "river": RiverAdapter,
    "hydrology": RiverAdapter,
    "cyclone": CycloneAdapter,
    "storm": CycloneAdapter,
    "terrain": TerrainAdapter,
    "elevation": TerrainAdapter,
    "infrastructure": InfrastructureAdapter,
    "shelter": InfrastructureAdapter,
    "shelters": InfrastructureAdapter,
    "facilities": InfrastructureAdapter,
}


def get_adapter_for_category(category: str) -> Optional[DataSourceAdapter]:
    """
    Factory function to retrieve initialized adapter instance for a dataset category.
    """
    cleaned = (category or "").strip().lower()
    adapter_cls = ADAPTER_REGISTRY.get(cleaned)
    if adapter_cls:
        return adapter_cls()
    return None


__all__ = [
    "DataSourceAdapter",
    "FloodAdapter",
    "WeatherAdapter",
    "RiverAdapter",
    "CycloneAdapter",
    "TerrainAdapter",
    "InfrastructureAdapter",
    "ADAPTER_REGISTRY",
    "get_adapter_for_category",
]
