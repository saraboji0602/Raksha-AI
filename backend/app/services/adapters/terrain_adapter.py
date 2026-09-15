"""
Terrain & Digital Elevation Adapter for RAKSHA-AI Ingestion.
"""

import json
from typing import Dict, Any, List, Tuple
from app.services.adapters.base import DataSourceAdapter
from app.services.quality_engine import DataQualityEngine
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class TerrainAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__(adapter_name="TerrainElevationAdapter", category="TERRAIN")

    def fetch_raw_data(self) -> str:
        return json.dumps({
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "id": "TER-01",
                        "elevation_m": 1.4,
                        "slope_degrees": 0.5,
                        "distance_to_coast": 120.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [79.825, 11.234]
                    }
                }
            ]
        })

    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        if payload.strip().startswith("{") or payload.strip().startswith("["):
            return DataQualityEngine.validate_geojson_content(payload, category="terrain")
        return DataQualityEngine.validate_csv_content(payload, category="terrain")

    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for feat in valid_records:
            props = feat.get("properties", feat) if isinstance(feat, dict) else {}
            geom = feat.get("geometry", {}) if isinstance(feat, dict) else {}
            coords = geom.get("coordinates", [0.0, 0.0]) if isinstance(geom, dict) else [0.0, 0.0]
            lon = coords[0] if len(coords) > 0 else 0.0
            lat = coords[1] if len(coords) > 1 else 0.0

            elev = float(props.get("elevation_m") or props.get("elevation") or 0.0)
            slope = float(props.get("slope_degrees") or props.get("slope") or 0.0)
            risk_class = "CRITICAL_LOWLAND" if elev < 2.0 else ("MODERATE_TERRAIN" if elev < 6.0 else "UPLAND_SAFE")

            normalized.append({
                "id": str(props.get("id") or props.get("terrain_id") or "TER-00"),
                "elevation_m": elev,
                "slope_degrees": slope,
                "distance_to_coast": float(props.get("distance_to_coast") or props.get("distance_to_coast_m") or 0.0),
                "risk_classification": risk_class,
                "latitude": float(props.get("latitude", lat)),
                "longitude": float(props.get("longitude", lon)),
                "source_status": "DEMO",
                "data_classification": "DEMO / SYNTHETIC DATA"
            })
        return normalized

    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        return DatasetMetadataSchema(
            source="Survey of India / CartoDEM Elevation (Synthetic)",
            source_type="CADASTRE_ELEVATION",
            source_status="DEMO",
            collection_date="2026-09-01",
            last_updated="2026-09-15",
            geographic_scope="Nagapattinam / Kadalpuram Coastal Grid",
            license="Synthetic Hackathon Prototype License",
            resolution="10-meter DEM Spatial Grid",
            confidence=92,
            freshness="Static Baseline",
            processing_status="PROCESSED_NORMALIZED"
        )
