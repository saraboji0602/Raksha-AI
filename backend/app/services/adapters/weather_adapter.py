"""
Weather & Rainfall Adapter for RAKSHA-AI Ingestion.
"""

import os
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class WeatherAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="WeatherRainfallAdapter", category="HAZARD")

    def fetch_raw_data(self) -> str:
        sample_path = os.path.join(os.path.dirname(__file__), "../../../data/sample/sample_rainfall_stations.csv")
        if os.path.exists(sample_path):
            with open(sample_path, "r", encoding="utf-8") as f:
                return f.read()
        return "station_id,station_name,district,latitude,longitude,rainfall_24h_mm,status\n"

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        required = ["station_id", "station_name", "latitude", "longitude", "rainfall_24h_mm"]
        return DataQualityEngine.validate_csv_content(payload, category="weather", required_columns=required)

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for row in valid_records:
            normalized.append({
                "hazard_type": "rainfall",
                "station_id": row.get("station_id"),
                "location_name": row.get("station_name"),
                "district": row.get("district"),
                "latitude": float(row.get("latitude", 0.0)),
                "longitude": float(row.get("longitude", 0.0)),
                "rainfall_1h_mm": float(row.get("rainfall_1h_mm", 0.0)),
                "rainfall_24h_mm": float(row.get("rainfall_24h_mm", 0.0)),
                "rainfall_72h_mm": float(row.get("rainfall_72h_mm", row.get("rainfall_24h_mm", 0.0))),
                "status": row.get("status", "NORMAL"),
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="Automated Weather Station (AWS) Grid (Synthetic)",
            source_type="METEOROLOGICAL_TELEMETRY",
            source_status="DEMO",
            collection_date="2026-09-15",
            last_updated="2026-09-15 08:00",
            geographic_scope="Tamil Nadu Coastal & Hill Observation Posts",
            license="Synthetic Hackathon Prototype License",
            resolution="Station Point Observations",
            confidence=95,
            freshness="Hourly Telemetry",
            processing_status="PROCESSED_NORMALIZED"
        )
