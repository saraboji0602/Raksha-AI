"""
River Gauges & Hydrology Adapter for RAKSHA-AI Ingestion.
"""

import json
import os
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class RiverAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="RiverDischargeAdapter", category="HAZARD")

    def fetch_raw_data(self) -> str:
        sample_path = os.path.join(os.path.dirname(__file__), "../../../data/sample/sample_river_gauges.json")
        if os.path.exists(sample_path):
            with open(sample_path, "r", encoding="utf-8") as f:
                return f.read()
        return json.dumps({"gauges": []})

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        return DataQualityEngine.validate_geojson_content(payload, category="river")

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in valid_records:
            props = item.get("properties", item)
            normalized.append({
                "hazard_type": "river_discharge",
                "station_id": props.get("gauge_id", "RIV-UNKNOWN"),
                "location_name": props.get("gauge_name", "River Gauge"),
                "river_basin": props.get("river_basin", "Cauvery Delta"),
                "water_level_m": float(props.get("current_level_m", 0.0)),
                "danger_level_m": float(props.get("danger_level_m", 0.0)),
                "discharge_cusecs": float(props.get("discharge_cusecs", 0.0)),
                "status": props.get("status", "NORMAL"),
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="Central Water Commission / River Gauge Network (Synthetic)",
            source_type="HYDROLOGY_GAUGE",
            source_status="DEMO",
            collection_date="2026-09-15",
            last_updated="2026-09-15 08:30",
            geographic_scope="Cauvery Lower Basin & Delta Distributaries",
            license="Synthetic Hackathon Prototype License",
            resolution="Automated Sluice Telemetry",
            confidence=94,
            freshness="Real-Time Telemetry",
            processing_status="PROCESSED_NORMALIZED"
        )
