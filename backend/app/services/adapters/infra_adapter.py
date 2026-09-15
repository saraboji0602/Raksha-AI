"""
Infrastructure, Lifeline & Shelter Adapter for RAKSHA-AI Ingestion.
"""

import os
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class InfrastructureAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="InfrastructureLifelineAdapter", category="INFRASTRUCTURE")

    def fetch_raw_data(self) -> str:
        sample_path = os.path.join(os.path.dirname(__file__), "../../../data/sample/sample_infrastructure.csv")
        if os.path.exists(sample_path):
            with open(sample_path, "r", encoding="utf-8") as f:
                return f.read()
        return "id,name,infra_type,latitude,longitude,capacity,status\n"

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        if payload.strip().startswith("{") or payload.strip().startswith("["):
            return DataQualityEngine.validate_geojson_content(payload, category="infrastructure")
        return DataQualityEngine.validate_csv_content(payload, category="infrastructure")

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for row in valid_records:
            props = row.get("properties", row) if isinstance(row, dict) else {}
            geom = row.get("geometry", {}) if isinstance(row, dict) else {}
            coords = geom.get("coordinates", [0.0, 0.0]) if isinstance(geom, dict) else [0.0, 0.0]
            lon = coords[0] if len(coords) > 0 else 0.0
            lat = coords[1] if len(coords) > 1 else 0.0

            normalized.append({
                "facility_id": str(props.get("id") or props.get("facility_id") or "INF-00"),
                "name": str(props.get("name") or props.get("facility_name") or "Public Facility"),
                "facility_type": str(props.get("infra_type") or props.get("facility_type") or "shelter").lower(),
                "capacity": int(props.get("capacity") or props.get("capacity_persons") or 0),
                "operational_status": str(props.get("status") or props.get("operational_status") or "OPERATIONAL").upper(),
                "latitude": float(props.get("latitude", lat)),
                "longitude": float(props.get("longitude", lon)),
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="District Disaster Management Authority (DDMA) Asset Registry (Synthetic)",
            source_type="CIVIC_SURVEY",
            source_status="DEMO",
            collection_date="2026-09-01",
            last_updated="2026-09-15",
            geographic_scope="Nagapattinam / Kadalpuram Civic Circle",
            license="Synthetic Hackathon Prototype License",
            resolution="Asset GPS Coordinates",
            confidence=96,
            freshness="Current Quarter",
            processing_status="PROCESSED_NORMALIZED"
        )
