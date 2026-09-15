"""
Cyclone & Storm Track Adapter for RAKSHA-AI Ingestion.
"""

import json
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class CycloneAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="CycloneTrackAdapter", category="HAZARD")

    def fetch_raw_data(self) -> str:
        return json.dumps({
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "storm_id": "CYC-2026-03",
                        "storm_name": "Deep Depression 'Vayu-02'",
                        "max_wind_kmph": 110.0,
                        "central_pressure_hpa": 984.0,
                        "category": "Severe Cyclonic Storm"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [79.86, 11.22]
                    }
                }
            ]
        })

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        return DataQualityEngine.validate_geojson_content(payload, category="cyclone")

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for feat in valid_records:
            props = feat.get("properties", feat) if isinstance(feat, dict) else {}
            geom = feat.get("geometry", {}) if isinstance(feat, dict) else {}
            coords = geom.get("coordinates", [0.0, 0.0]) if isinstance(geom, dict) else [0.0, 0.0]
            lon = coords[0] if len(coords) > 0 else 0.0
            lat = coords[1] if len(coords) > 1 else 0.0

            normalized.append({
                "hazard_type": "cyclone",
                "storm_name": props.get("storm_name", "Synthetic Cyclone"),
                "category": props.get("category", "Severe Cyclonic Storm"),
                "max_wind_kmph": float(props.get("max_wind_kmph", 100.0)),
                "central_pressure_hpa": float(props.get("central_pressure_hpa", 990.0)),
                "latitude": float(props.get("latitude", lat)),
                "longitude": float(props.get("longitude", lon)),
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="IMD Regional Meteorological Forecast Feed (Synthetic)",
            source_type="SATELLITE_ATMOSPHERIC",
            source_status="DEMO",
            collection_date="2026-09-15",
            last_updated="2026-09-15 09:00",
            geographic_scope="Bay of Bengal / Kadalpuram Coast",
            license="Synthetic Hackathon Prototype License",
            resolution="0.1 Degree Numerical Grid",
            confidence=90,
            freshness="Current Track",
            processing_status="PROCESSED_NORMALIZED"
        )
