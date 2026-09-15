"""
Datasets API Endpoints for RAKSHA-AI.
Exposes secure endpoints for validation, ingestion, and cataloging of disaster & geospatial datasets.
Supports both application/json payloads and multipart/form-data file uploads.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.dataset import (
    DatasetItemSchema,
    DatasetDetailSchema,
    DatasetListResponse,
    DatasetQualityReportSchema,
    DatasetMetadataSchema,
)
from app.services.ingestion_service import DatasetIngestionService

router = APIRouter()

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB limit


async def extract_request_data(request: Request) -> Dict[str, Any]:
    """Helper to extract content, filename, category, and metadata from either JSON or multipart form request."""
    content_type = request.headers.get("content-type", "").lower()
    
    if "application/json" in content_type:
        try:
            body = await request.json()
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON body.")
        return {
            "content": body.get("content", ""),
            "filename": body.get("filename", "dataset.json"),
            "category": body.get("category", "general"),
            "custom_metadata": body.get("custom_metadata"),
        }
    elif "multipart/form-data" in content_type:
        form = await request.form()
        uploaded_file = form.get("file")
        category = str(form.get("category_form") or form.get("category") or "general")
        
        if uploaded_file and hasattr(uploaded_file, "read"):
            raw_bytes = await uploaded_file.read()
            if len(raw_bytes) > MAX_FILE_SIZE_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024*1024)}MB."
                )
            try:
                content = raw_bytes.decode("utf-8")
            except UnicodeDecodeError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded file must be UTF-8 encoded text (CSV, JSON, GeoJSON)."
                )
            filename = getattr(uploaded_file, "filename", "uploaded_file.json") or "uploaded_file.json"
            return {
                "content": content,
                "filename": filename,
                "category": category,
                "custom_metadata": None,
            }
        else:
            raw_content = str(form.get("content") or "")
            filename = str(form.get("filename") or "uploaded_data.json")
            return {
                "content": raw_content,
                "filename": filename,
                "category": category,
                "custom_metadata": None,
            }
    else:
        # Fallback to attempt json parsing
        try:
            body = await request.json()
            return {
                "content": body.get("content", ""),
                "filename": body.get("filename", "dataset.json"),
                "category": body.get("category", "general"),
                "custom_metadata": body.get("custom_metadata"),
            }
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Request must be application/json or multipart/form-data."
            )


@router.post("/validate", summary="Validate dataset format and data quality")
async def validate_dataset(request: Request):
    """
    Validates CSV, JSON, or GeoJSON payloads against coordinate boundaries,
    geometry sanity, duplicate keys, and attribute validity.
    Does NOT write to database.
    """
    data = await extract_request_data(request)
    content = data.get("content", "")
    filename = data.get("filename", "")
    category = data.get("category", "general")

    if not content or not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content payload is empty or missing."
        )

    try:
        report = DatasetIngestionService.validate(content, filename, category)
        return report
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Validation processing failed: {str(exc)}")


@router.post("/ingest", status_code=status.HTTP_201_CREATED, summary="Ingest dataset into RAKSHA-AI catalog")
async def ingest_dataset(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Executes complete ingestion pipeline:
    1. Validates schema & geometry
    2. Generates quality report
    3. Normalizes records using domain adapter
    4. Persists dataset, metadata, quality report, and domain records to database
    """
    data = await extract_request_data(request)
    content = data.get("content", "")
    filename = data.get("filename", "")
    category = data.get("category", "general")
    custom_metadata = data.get("custom_metadata")

    if not content or not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content payload is empty or missing."
        )

    try:
        result = DatasetIngestionService.ingest(
            db=db,
            content=content,
            filename=filename,
            category=category,
            custom_metadata=custom_metadata,
        )
        return result
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Ingestion failed: {str(exc)}")


@router.get("", response_model=DatasetListResponse, summary="List all ingested datasets")
def list_datasets(
    category: Optional[str] = Query(None, description="Filter by category (flood, weather, infrastructure, etc.)"),
    limit: int = Query(50, ge=1, le=100, description="Max datasets to return"),
    db: Session = Depends(get_db),
):
    """
    Returns registered datasets with high-level quality scores and provenance tags.
    """
    datasets = DatasetIngestionService.list_datasets(db, limit=limit, category=category)
    items = []
    for d in datasets:
        items.append(
            DatasetItemSchema(
                id=d.id,
                name=d.name,
                category=d.category,
                format=d.format,
                file_size_bytes=d.file_size_bytes or 0,
                record_count=d.record_count or 0,
                valid_record_count=d.valid_record_count or 0,
                status=d.status,
                uploaded_at=d.uploaded_at,
                data_classification=d.data_classification or "DEMO / SYNTHETIC DATA",
            )
        )
    return DatasetListResponse(total=len(items), items=items)


@router.get("/{dataset_id}", response_model=DatasetDetailSchema, summary="Get dataset details & provenance")
def get_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves full dataset record including detailed provenance metadata and quality metrics.
    """
    dataset = DatasetIngestionService.get_dataset_by_id(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dataset '{dataset_id}' not found.")

    meta = None
    if dataset.metadata_rel:
        m = dataset.metadata_rel
        meta = DatasetMetadataSchema(
            source=m.source,
            source_type=m.source_type,
            source_status=m.source_status,
            geographic_scope=m.geographic_scope,
            resolution=m.resolution,
            confidence=m.confidence,
            freshness=m.freshness,
            license=m.license,
            processing_status=m.processing_status,
            collection_date=m.collection_date,
            last_updated=m.last_updated,
        )

    quality = None
    if dataset.quality_report:
        q = dataset.quality_report
        quality = DatasetQualityReportSchema(
            total_records=q.total_records,
            valid_records=q.valid_records,
            rejected_records=q.rejected_records,
            missing_geometry_count=q.missing_geometry_count,
            duplicate_count=q.duplicate_count,
            invalid_value_count=q.invalid_value_count,
            quality_score=q.quality_score,
            issues_summary=q.issues_summary or [],
            validated_at=q.validated_at,
        )

    return DatasetDetailSchema(
        id=dataset.id,
        name=dataset.name,
        category=dataset.category,
        format=dataset.format,
        file_size_bytes=dataset.file_size_bytes or 0,
        record_count=dataset.record_count or 0,
        valid_record_count=dataset.valid_record_count or 0,
        status=dataset.status,
        uploaded_at=dataset.uploaded_at,
        data_classification=dataset.data_classification or "DEMO / SYNTHETIC DATA",
        metadata_rel=meta,
        quality_report=quality,
    )


@router.get("/{dataset_id}/quality", response_model=DatasetQualityReportSchema, summary="Get dataset quality report")
def get_dataset_quality_report(
    dataset_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves the detailed validation report and rejection breakdown for a dataset.
    """
    quality = DatasetIngestionService.get_quality_report(db, dataset_id)
    if not quality:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Quality report for dataset '{dataset_id}' not found.")

    return DatasetQualityReportSchema(
        total_records=quality.total_records,
        valid_records=quality.valid_records,
        rejected_records=quality.rejected_records,
        missing_geometry_count=quality.missing_geometry_count,
        duplicate_count=quality.duplicate_count,
        invalid_value_count=quality.invalid_value_count,
        quality_score=quality.quality_score,
        issues_summary=quality.issues_summary or [],
        validated_at=quality.validated_at,
    )
