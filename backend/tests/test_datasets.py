"""
Comprehensive Test Suite for RAKSHA-AI Phase 2:
Data Ingestion Pipeline, Quality Engine, Geospatial Utilities, Adapters, and Dataset APIs.
"""

import io
import json
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from app.services.quality_engine import DataQualityEngine
from app.services.geospatial_engine import GeospatialEngine
from app.services.adapters import (
    FloodAdapter,
    WeatherAdapter,
    RiverAdapter,
    CycloneAdapter,
    TerrainAdapter,
    InfrastructureAdapter,
    get_adapter_for_category,
)

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "data" / "sample"


# ==========================================
# 1. QUALITY ENGINE UNIT TESTS
# ==========================================

def test_csv_validation_valid():
    """Test clean CSV passes quality check with 100% score"""
    csv_data = (
        "station_id,station_name,rainfall_1h_mm,rainfall_24h_mm,latitude,longitude\n"
        "ST-01,North Pier AWS,12.5,45.0,11.2345,79.8250\n"
        "ST-02,South Jetty AWS,18.0,62.5,11.2150,79.8190\n"
    )
    report, valid_records = DataQualityEngine.validate_csv_content(csv_data, category="weather")
    assert report.quality_score == 100.0
    assert report.total_records == 2
    assert report.valid_records == 2
    assert report.rejected_records == 0
    assert len(valid_records) == 2


def test_csv_validation_missing_coordinates():
    """Test CSV records with missing or invalid coordinates are rejected and logged"""
    csv_data = (
        "station_id,station_name,rainfall_1h_mm,rainfall_24h_mm,latitude,longitude\n"
        "ST-01,Valid Pier AWS,12.5,45.0,11.2345,79.8250\n"
        "ST-02,Missing Lat AWS,18.0,62.5,,79.8190\n"
        "ST-03,Out of Bounds AWS,5.0,10.0,195.0,79.8190\n"
    )
    report, valid_records = DataQualityEngine.validate_csv_content(csv_data, category="weather")
    assert report.total_records == 3
    assert report.valid_records == 1
    assert report.rejected_records == 2
    assert report.missing_geometry_count >= 1
    assert report.invalid_value_count >= 1
    assert report.quality_score == 33.3


def test_csv_validation_duplicate_records():
    """Test duplicate record rejection"""
    csv_data = (
        "id,name,latitude,longitude\n"
        "FAC-01,Cyclone Shelter North,11.2400,79.8200\n"
        "FAC-01,Cyclone Shelter North Duplicate,11.2400,79.8200\n"
    )
    report, valid_records = DataQualityEngine.validate_csv_content(csv_data, category="infrastructure")
    assert report.total_records == 2
    assert report.valid_records == 1
    assert report.rejected_records == 1
    assert report.duplicate_count == 1


def test_geojson_validation_valid():
    """Test valid GeoJSON FeatureCollection"""
    geojson_payload = json.dumps({
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "zone_id": "ZONE-NORTH",
                    "hazard_type": "flood",
                    "severity": "CRITICAL",
                    "water_depth_m": 2.4
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [79.820, 11.230],
                        [79.840, 11.230],
                        [79.840, 11.250],
                        [79.820, 11.250],
                        [79.820, 11.230]
                    ]]
                }
            }
        ]
    })
    report, valid_features = DataQualityEngine.validate_geojson_content(geojson_payload, category="flood")
    assert report.quality_score == 100.0
    assert report.total_records == 1
    assert report.valid_records == 1
    assert report.rejected_records == 0


def test_geojson_validation_invalid_geometry():
    """Test invalid / malformed geometry rejection in GeoJSON"""
    # Self-intersecting bowtie polygon: invalid topology
    geojson_payload = json.dumps({
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"zone_id": "BOWTIE-FAIL"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [0, 0],
                        [2, 2],
                        [2, 0],
                        [0, 2],
                        [0, 0]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {"zone_id": "MISSING-GEOM"},
                "geometry": None
            }
        ]
    })
    report, valid_features = DataQualityEngine.validate_geojson_content(geojson_payload, category="flood")
    assert report.total_records == 2
    assert report.valid_records == 0
    assert report.rejected_records == 2
    assert report.invalid_value_count >= 1
    assert report.missing_geometry_count >= 1


# ==========================================
# 2. GEOSPATIAL UTILITIES TESTS
# ==========================================

def test_haversine_distance():
    """Test haversine distance calculation between known coastal coordinates"""
    # Distance between Kadalpuram (11.2345, 79.8250) and Site B (11.2750, 79.8650) is ~6.2 km
    dist_km = GeospatialEngine.calculate_haversine_distance_km(11.2345, 79.8250, 11.2750, 79.8650)
    assert 6.0 <= dist_km <= 6.5


def test_point_in_polygon():
    """Test point-in-polygon containment using Shapely"""
    polygon_coords = [
        [79.80, 11.20],
        [79.90, 11.20],
        [79.90, 11.30],
        [79.80, 11.30],
        [79.80, 11.20]
    ]
    # Point inside polygon
    assert GeospatialEngine.is_point_in_polygon(11.25, 79.85, polygon_coords) is True
    # Point outside polygon
    assert GeospatialEngine.is_point_in_polygon(11.45, 79.85, polygon_coords) is False


def test_hazard_to_habitation_matching():
    """Test matching point habitation with flood hazard boundary"""
    habitation = {
        "id": "hab-test-01",
        "name": "Coastal Ward A",
        "latitude": 11.235,
        "longitude": 79.825
    }
    hazard_zone = {
        "hazard_id": "HAZ-FL-01",
        "hazard_type": "flood",
        "severity": "CRITICAL",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.820, 11.230],
                [79.840, 11.230],
                [79.840, 11.250],
                [79.820, 11.250],
                [79.820, 11.230]
            ]]
        }
    }
    match = GeospatialEngine.match_hazard_to_habitation(habitation, [hazard_zone])
    assert match["is_impacted"] is True
    assert len(match["intersecting_hazards"]) == 1
    assert match["intersecting_hazards"][0]["severity"] == "CRITICAL"


# ==========================================
# 3. ADAPTERS REGISTRY & NORMALIZATION TESTS
# ==========================================

def test_adapter_registry():
    """Test retrieving appropriate adapter from registry"""
    flood_adapter = get_adapter_for_category("flood")
    assert isinstance(flood_adapter, FloodAdapter)
    
    cyclone_adapter = get_adapter_for_category("cyclone")
    assert isinstance(cyclone_adapter, CycloneAdapter)

    infra_adapter = get_adapter_for_category("infrastructure")
    assert isinstance(infra_adapter, InfrastructureAdapter)


def test_adapters_normalization():
    """Test normalization across different hazard and terrain adapters"""
    # Weather
    w_adapter = WeatherAdapter()
    w_norm = w_adapter.normalize([{
        "station_id": "ST-99",
        "station_name": "Harbor AWS",
        "rainfall_1h_mm": "15.5",
        "rainfall_24h_mm": "55.0",
        "latitude": "11.24",
        "longitude": "79.83"
    }])[0]
    assert w_norm["rainfall_1h_mm"] == 15.5
    assert w_norm["rainfall_24h_mm"] == 55.0
    assert w_norm["data_classification"] == "DEMO / SYNTHETIC DATA"

    # Terrain
    t_adapter = TerrainAdapter()
    t_norm = t_adapter.normalize([{
        "properties": {
            "id": "TER-01",
            "elevation_m": "1.4",
            "slope_degrees": "0.5",
            "distance_to_coast": "120"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [79.82, 11.23]
        }
    }])[0]
    assert t_norm["elevation_m"] == 1.4
    assert t_norm["risk_classification"] == "CRITICAL_LOWLAND"


# ==========================================
# 4. DATASET API ENDPOINT TESTS
# ==========================================

def test_validate_api_json_body(client: TestClient):
    """Test POST /api/datasets/validate with JSON body"""
    payload = {
        "content": "station_id,station_name,rainfall_24h_mm,latitude,longitude\nAWS-1,Harbor Post,45.2,11.23,79.82\n",
        "filename": "stations.csv",
        "category": "weather"
    }
    response = client.post("/api/datasets/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VALID"
    assert data["format"] == "csv"
    assert data["quality_report"]["valid_records"] == 1
    assert data["metadata"]["source_status"] == "DEMO"


def test_validate_api_file_upload(client: TestClient):
    """Test POST /api/datasets/validate with multipart file upload"""
    csv_bytes = b"id,name,capacity,latitude,longitude\nFAC-01,Shelter North,1200,11.24,79.82\n"
    response = client.post(
        "/api/datasets/validate",
        files={"file": ("shelters.csv", io.BytesIO(csv_bytes), "text/csv")},
        data={"category": "infrastructure"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VALID"
    assert data["quality_report"]["total_records"] == 1


def test_ingest_and_retrieve_dataset(client: TestClient):
    """Test full ingestion workflow: POST /ingest -> GET /datasets -> GET /datasets/{id} -> GET /quality"""
    csv_bytes = (
        b"station_id,station_name,rainfall_1h_mm,rainfall_24h_mm,latitude,longitude\n"
        b"AWS-NORTH,North Kadalpuram AWS,22.0,85.0,11.2450,79.8310\n"
        b"AWS-SOUTH,South Beach AWS,31.5,115.0,11.2210,79.8180\n"
    )
    
    # 1. Ingest
    ingest_resp = client.post(
        "/api/datasets/ingest",
        files={"file": ("kadalpuram_aws_telemetry.csv", io.BytesIO(csv_bytes), "text/csv")},
        data={"category_form": "weather"}
    )
    assert ingest_resp.status_code == 201
    ingest_data = ingest_resp.json()
    assert "dataset_id" in ingest_data
    dataset_id = ingest_data["dataset_id"]
    assert ingest_data["status"] == "INGESTED"
    assert ingest_data["records_ingested"] == 2

    # 2. List datasets
    list_resp = client.get("/api/datasets")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    target = next((d for d in list_data["items"] if d["id"] == dataset_id), None)
    assert target is not None
    assert target["name"] == "kadalpuram_aws_telemetry"
    assert target["category"] == "weather"
    assert target["data_classification"] == "DEMO / SYNTHETIC DATA"

    # 3. Get dataset detail
    detail_resp = client.get(f"/api/datasets/{dataset_id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert detail_data["id"] == dataset_id
    assert detail_data["metadata_rel"]["source_status"] == "DEMO"
    assert detail_data["quality_report"]["valid_records"] == 2

    # 4. Get quality report directly
    quality_resp = client.get(f"/api/datasets/{dataset_id}/quality")
    assert quality_resp.status_code == 200
    quality_data = quality_resp.json()
    assert quality_data["quality_score"] == 100.0
    assert quality_data["valid_records"] == 2


def test_get_nonexistent_dataset(client: TestClient):
    """Test 404 for invalid dataset lookup"""
    response = client.get("/api/datasets/ds-nonexistent")
    assert response.status_code == 404


# ==========================================
# 5. TEST SAMPLE REPOSITORY DATASETS
# ==========================================

def test_sample_datasets_ingestion(client: TestClient):
    """Validate that all seeded sample datasets in backend/data/sample/ pass validation and ingestion"""
    sample_files = [
        ("sample_flood_zones.geojson", "flood"),
        ("sample_rainfall_stations.csv", "weather"),
        ("sample_river_gauges.json", "river"),
        ("sample_habitations.geojson", "habitation"),
        ("sample_infrastructure.csv", "infrastructure"),
        ("sample_safe_sites.json", "safe_site"),
    ]
    
    for filename, category in sample_files:
        file_path = SAMPLE_DIR / filename
        assert file_path.exists(), f"Sample dataset {filename} is missing!"
        
        content = file_path.read_text(encoding="utf-8")
        if filename.endswith(".csv"):
            report, valid_records = DataQualityEngine.validate_csv_content(content, category=category)
        else:
            report, valid_records = DataQualityEngine.validate_geojson_content(content, category=category)
        
        assert report.total_records > 0, f"Sample file {filename} has 0 total records"
        assert report.valid_records > 0, f"Sample file {filename} has 0 valid records: {report.issues_summary}"
        assert report.quality_score >= 50.0, f"Sample file {filename} has low quality score: {report.quality_score}"
