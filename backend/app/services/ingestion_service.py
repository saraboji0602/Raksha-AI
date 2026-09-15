"""
Dataset Ingestion Service for RAKSHA-AI.
Orchestrates the entire ingestion pipeline:
DATASET -> VALIDATION -> NORMALIZATION -> GEOSPATIAL PROCESSING -> QUALITY CHECK -> DATABASE -> RISK ENGINE
"""

import json
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.models.dataset import (
    DatasetModel,
    DatasetMetadataModel,
    DatasetQualityReportModel,
    HazardRecordModel,
    ExposureRecordModel,
    InfrastructureRecordModel,
)
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema
from app.services.quality_engine import DataQualityEngine
from app.services.geospatial_engine import GeospatialEngine
from app.services.adapters import get_adapter_for_category, DataSourceAdapter

logger = logging.getLogger(__name__)


class DatasetIngestionService:
    """
    Service responsible for validating, normalizing, geoprocessing,
    and persisting dataset packages and records into RAKSHA-AI.
    """

    @classmethod
    def detect_format(cls, filename: str, content: str) -> str:
        """Determines format safely from filename extension or content inspection."""
        fn_lower = filename.lower()
        if fn_lower.endswith(".geojson") or fn_lower.endswith(".geo.json"):
            return "geojson"
        if fn_lower.endswith(".csv"):
            return "csv"
        if fn_lower.endswith(".json"):
            try:
                parsed = json.loads(content)
                if isinstance(parsed, dict) and parsed.get("type") in ("FeatureCollection", "Feature"):
                    return "geojson"
            except Exception:
                pass
            return "json"

        stripped = content.strip()
        if stripped.startswith("{") or stripped.startswith("["):
            try:
                parsed = json.loads(content)
                if isinstance(parsed, dict) and parsed.get("type") in ("FeatureCollection", "Feature"):
                    return "geojson"
                return "json"
            except Exception:
                pass
        return "csv"

    @classmethod
    def validate(
        cls,
        content: str,
        filename: str,
        category: str = "general",
        format_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Runs validation and quality checking without persisting to the database.
        Returns the structured quality report, extracted metadata, and validation status.
        """
        fmt = format_type or cls.detect_format(filename, content)
        adapter: Optional[DataSourceAdapter] = get_adapter_for_category(category)

        if adapter:
            quality_report_schema, valid_records = adapter.validate(content)
            extracted_meta = adapter.get_provenance_metadata()
            normalized_records = adapter.normalize(valid_records)
        else:
            if fmt == "csv":
                quality_report_schema, valid_records = DataQualityEngine.validate_csv_content(content, category=category)
            else:
                quality_report_schema, valid_records = DataQualityEngine.validate_geojson_content(content, category=category)
            
            extracted_meta = DataQualityEngine.extract_metadata_from_payload(content, fallback_name=filename, category=category)
            normalized_records = valid_records

        is_valid = quality_report_schema.quality_score >= 50.0 and quality_report_schema.valid_records > 0

        return {
            "status": "VALID" if is_valid else "INVALID",
            "format": fmt,
            "category": category,
            "quality_report": quality_report_schema.model_dump(),
            "metadata": extracted_meta.model_dump(),
            "sample_records": normalized_records[:5] if normalized_records else [],
        }

    @classmethod
    def ingest(
        cls,
        db: Session,
        content: str,
        filename: str,
        category: str = "general",
        custom_metadata: Optional[Dict[str, Any]] = None,
        format_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes full ingestion pipeline:
        1. VALIDATE & QUALITY CHECK
        2. PERSIST METADATA & DATASET RECORD
        3. INSERT SPECIALIZED CATEGORY RECORDS
        """
        validation_result = cls.validate(content, filename, category, format_type)
        quality_data = validation_result["quality_report"]
        meta_data = validation_result["metadata"]
        fmt = validation_result["format"]

        if custom_metadata:
            meta_data.update({k: v for k, v in custom_metadata.items() if v is not None})

        dataset_id = f"ds-{uuid.uuid4().hex[:8]}"
        dataset_name = Path(filename).stem

        # 1. Create Dataset model
        dataset_row = DatasetModel(
            id=dataset_id,
            name=dataset_name,
            category=category,
            format=fmt,
            file_size_bytes=len(content.encode("utf-8")),
            record_count=quality_data.get("total_records", 0),
            valid_record_count=quality_data.get("valid_records", 0),
            status="INGESTED" if validation_result["status"] == "VALID" else "FAILED",
            uploaded_at=datetime.now(timezone.utc),
            data_classification="DEMO / SYNTHETIC DATA",
        )
        db.add(dataset_row)

        # 2. Create Dataset Metadata model
        metadata_row = DatasetMetadataModel(
            id=f"meta-{uuid.uuid4().hex[:8]}",
            dataset_id=dataset_id,
            source=meta_data.get("source", "Synthetic Government-Grade GIS Feed"),
            source_type=meta_data.get("source_type", "DEMO_SYNTHETIC"),
            source_status=meta_data.get("source_status", "DEMO"),
            collection_date=str(meta_data.get("collection_date", "2026-09-01")),
            last_updated=str(meta_data.get("last_updated", "2026-09-15")),
            geographic_scope=meta_data.get("geographic_scope", "Nagapattinam / Kadalpuram Coast"),
            license=meta_data.get("license", "Government Data License (Synthetic Prototype)"),
            resolution=meta_data.get("resolution", "High Precision GIS Grid"),
            confidence=int(meta_data.get("confidence", 92)),
            freshness=meta_data.get("freshness", "Current Batch"),
            processing_status="PROCESSED_NORMALIZED",
        )
        db.add(metadata_row)

        # 3. Create Dataset Quality Report model
        quality_row = DatasetQualityReportModel(
            id=f"qr-{uuid.uuid4().hex[:8]}",
            dataset_id=dataset_id,
            total_records=quality_data.get("total_records", 0),
            valid_records=quality_data.get("valid_records", 0),
            rejected_records=quality_data.get("rejected_records", 0),
            missing_geometry_count=quality_data.get("missing_geometry_count", 0),
            duplicate_count=quality_data.get("duplicate_count", 0),
            invalid_value_count=quality_data.get("invalid_value_count", 0),
            quality_score=quality_data.get("quality_score", 0.0),
            issues_summary=quality_data.get("issues_summary", []),
            validated_at=datetime.now(timezone.utc),
        )
        db.add(quality_row)

        # 4. Insert Child Domain Records
        adapter = get_adapter_for_category(category)
        normalized_records = validation_result.get("sample_records", [])
        if adapter:
            # Re-normalize full valid list
            _, valid_records = adapter.validate(content)
            normalized_records = adapter.normalize(valid_records)

        for rec in normalized_records:
            lat = rec.get("latitude")
            lon = rec.get("longitude")
            
            if category in ("flood", "hazard_flood", "cyclone", "storm", "weather", "rainfall", "river", "hydrology"):
                h_rec = HazardRecordModel(
                    id=f"haz-{uuid.uuid4().hex[:8]}",
                    dataset_id=dataset_id,
                    hazard_type=rec.get("hazard_type", category),
                    habitation_id=rec.get("habitation_id"),
                    location_name=rec.get("location_name") or rec.get("storm_name") or rec.get("station_id"),
                    latitude=lat,
                    longitude=lon,
                    geometry_geojson=rec.get("geometry"),
                    severity=rec.get("severity") or rec.get("category") or "MODERATE",
                    intensity_value=rec.get("intensity_value") or rec.get("rainfall_24h_mm") or rec.get("water_level_m") or 0.0,
                    unit=rec.get("unit", "m"),
                    source_status=rec.get("source_status", "DEMO"),
                )
                db.add(h_rec)
            elif category in ("infrastructure", "shelter", "shelters", "facilities"):
                i_rec = InfrastructureRecordModel(
                    id=f"inf-{uuid.uuid4().hex[:8]}",
                    dataset_id=dataset_id,
                    infra_type=rec.get("facility_type", "shelter"),
                    name=rec.get("name", "Public Facility"),
                    habitation_id=rec.get("habitation_id"),
                    latitude=lat,
                    longitude=lon,
                    capacity=rec.get("capacity", 0),
                    status=rec.get("operational_status", "OPERATIONAL"),
                    source_status=rec.get("source_status", "DEMO"),
                )
                db.add(i_rec)

        db.commit()
        db.refresh(dataset_row)

        return {
            "dataset_id": dataset_id,
            "status": dataset_row.status,
            "records_ingested": dataset_row.valid_record_count,
            "records_rejected": quality_data.get("rejected_records", 0),
            "quality_score": quality_row.quality_score,
            "metadata": {
                "source": metadata_row.source,
                "source_status": metadata_row.source_status,
                "geographic_scope": metadata_row.geographic_scope,
                "freshness": metadata_row.freshness,
            },
            "quality_report": quality_data,
        }

    @classmethod
    def list_datasets(cls, db: Session, limit: int = 50, category: Optional[str] = None) -> List[DatasetModel]:
        """Queries all ingested datasets from the database."""
        query = db.query(DatasetModel)
        if category:
            query = query.filter(DatasetModel.category == category)
        return query.order_by(DatasetModel.uploaded_at.desc()).limit(limit).all()

    @classmethod
    def get_dataset_by_id(cls, db: Session, dataset_id: str) -> Optional[DatasetModel]:
        """Retrieves a single dataset and its relationships by ID."""
        return db.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()

    @classmethod
    def get_quality_report(cls, db: Session, dataset_id: str) -> Optional[DatasetQualityReportModel]:
        """Retrieves the quality report for a specific dataset ID."""
        return db.query(DatasetQualityReportModel).filter(DatasetQualityReportModel.dataset_id == dataset_id).first()
