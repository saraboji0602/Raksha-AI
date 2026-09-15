"""
Flood Inundation & Coastal Hazard Adapter for RAKSHA-AI Ingestion.
"""

import json
import os
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class FloodAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="FloodInundationAdapter", category="HAZARD")

    def fetch_raw_data(self) -> str:
        sample_path = os.path.join(os.path.dirname(__file__), "../../../data/sample/sample_flood_zones.geojson")
        if os.path.exists(sample_path):
            with open(sample_path, "r", encoding="utf-8") as f:
                return f.read()
        return json.dumps({"type": "FeatureCollection", "features": []})

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        return DataQualityEngine.validate_geojson_content(payload, category="flood")

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for feat in valid_records:
            props = feat.get("properties", {})
            geom = feat.get("geometry", {})
            normalized.append({
                "hazard_type": "flood",
                "hazard_id": props.get("zone_id", "FL-UNKNOWN"),
                "habitation_id": props.get("habitation_id"),
                "severity": props.get("severity", "HIGH"),
                "intensity_value": float(props.get("water_depth_m", 1.0)),
                "unit": "meters",
                "geometry": geom,
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="Synthetic Hydrodynamic Inundation Model DEM-10m",
            source_type="HYDROLOGY",
            source_status="DEMO",
            collection_date="2026-09-01",
            last_updated="2026-09-15",
            geographic_scope="Nagapattinam & Cauvery Delta",
            license="Synthetic Hackathon Prototype License",
            resolution="10m Grid",
            confidence=92,
            freshness="Current Batch",
            processing_status="PROCESSED_NORMALIZED"
        )
