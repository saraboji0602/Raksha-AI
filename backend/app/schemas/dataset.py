from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class DatasetMetadataSchema(BaseModel):
    source: str
    source_type: str
    source_status: str = "DEMO"  # VERIFIED, UNVERIFIED, DEMO, STALE, MISSING
    collection_date: Optional[str] = None
    last_updated: Optional[str] = None
    geographic_scope: Optional[str] = None
    license: Optional[str] = "Government Data License (Synthetic Prototype)"
    resolution: Optional[str] = "Variable"
    confidence: Optional[int] = 90
    freshness: Optional[str] = "Current Batch"
    processing_status: Optional[str] = "PROCESSED_NORMALIZED"

    model_config = ConfigDict(from_attributes=True)


class DatasetQualityReportSchema(BaseModel):
    total_records: int
    valid_records: int
    rejected_records: int
    missing_geometry_count: int = 0
    duplicate_count: int = 0
    invalid_value_count: int = 0
    quality_score: float = 100.0
    issues_summary: List[str] = Field(default_factory=list)
    validated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DatasetItemSchema(BaseModel):
    id: str
    name: str
    category: str
    format: str
    file_size_bytes: int
    record_count: int
    valid_record_count: int
    status: str
    uploaded_at: Optional[datetime] = None
    data_classification: str = "DEMO / SYNTHETIC DATA"
    metadata_rel: Optional[DatasetMetadataSchema] = None

    model_config = ConfigDict(from_attributes=True)


class DatasetDetailSchema(DatasetItemSchema):
    quality_report: Optional[DatasetQualityReportSchema] = None

    model_config = ConfigDict(from_attributes=True)


class DatasetListResponse(BaseModel):
    total: int
    data_classification: str = "DEMO / SYNTHETIC DATA"
    items: List[DatasetItemSchema]

    model_config = ConfigDict(from_attributes=True)


class DatasetValidateResponse(BaseModel):
    dataset_name: str
    format: str
    is_valid: bool
    quality_report: DatasetQualityReportSchema
    metadata: DatasetMetadataSchema
    data_classification: str = "DEMO / SYNTHETIC DATA"


class DatasetIngestResponse(BaseModel):
    success: bool
    dataset_id: str
    dataset_name: str
    records_ingested: int
    records_rejected: int
    quality_score: float
    status: str
    data_classification: str = "DEMO / SYNTHETIC DATA"
