from sqlalchemy import Column, String, Integer, Float, Boolean, JSON, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class DatasetModel(Base):
    __tablename__ = "datasets"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    category = Column(String(64), nullable=False, index=True)  # HAZARD, TERRAIN, EXPOSURE, VULNERABILITY, INFRASTRUCTURE, SAFE_SITE
    format = Column(String(32), nullable=False)  # CSV, JSON, GEOJSON, SHAPEFILE
    file_size_bytes = Column(Integer, default=0)
    record_count = Column(Integer, default=0)
    valid_record_count = Column(Integer, default=0)
    status = Column(String(32), default="INGESTED")  # PENDING, VALIDATED, INGESTED, FAILED
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    data_classification = Column(String(64), default="DEMO / SYNTHETIC DATA")

    metadata_rel = relationship("DatasetMetadataModel", back_populates="dataset", uselist=False, cascade="all, delete-orphan")
    quality_report = relationship("DatasetQualityReportModel", back_populates="dataset", uselist=False, cascade="all, delete-orphan")


class DatasetMetadataModel(Base):
    __tablename__ = "dataset_metadata"

    id = Column(String(64), primary_key=True, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=False, index=True)
    source = Column(String(128), nullable=False)
    source_type = Column(String(64), nullable=False)  # SATELLITE_INSAR, HYDROLOGY_GAUGE, CENSUS_SURVEY, CADASTRE
    source_status = Column(String(32), default="DEMO")  # VERIFIED, UNVERIFIED, DEMO, STALE, MISSING
    collection_date = Column(String(64), nullable=True)
    last_updated = Column(String(64), nullable=True)
    geographic_scope = Column(String(128), nullable=True)
    license = Column(String(128), default="Government Data License (Synthetic Prototype)")
    resolution = Column(String(64), default="Variable")
    confidence = Column(Integer, default=90)
    freshness = Column(String(64), default="Current Batch")
    processing_status = Column(String(64), default="PROCESSED_NORMALIZED")

    dataset = relationship("DatasetModel", back_populates="metadata_rel")


class DatasetQualityReportModel(Base):
    __tablename__ = "dataset_quality_reports"

    id = Column(String(64), primary_key=True, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=False, index=True)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    rejected_records = Column(Integer, default=0)
    missing_geometry_count = Column(Integer, default=0)
    duplicate_count = Column(Integer, default=0)
    invalid_value_count = Column(Integer, default=0)
    quality_score = Column(Float, default=100.0)
    issues_summary = Column(JSON, default=list)  # List of issue strings
    validated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    dataset = relationship("DatasetModel", back_populates="quality_report")


class HazardRecordModel(Base):
    __tablename__ = "hazard_records"

    id = Column(String(64), primary_key=True, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=True, index=True)
    hazard_type = Column(String(64), nullable=False, index=True)
    habitation_id = Column(String(64), nullable=True, index=True)
    location_name = Column(String(128), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    geometry_geojson = Column(JSON, nullable=True)
    severity = Column(String(32), default="MODERATE")
    intensity_value = Column(Float, default=0.0)
    unit = Column(String(32), default="m")
    timestamp = Column(String(64), nullable=True)
    source_status = Column(String(32), default="DEMO")


class ExposureRecordModel(Base):
    __tablename__ = "exposure_records"

    id = Column(String(64), primary_key=True, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=True, index=True)
    habitation_id = Column(String(64), nullable=False, index=True)
    total_population = Column(Integer, default=0)
    exposed_population = Column(Integer, default=0)
    households = Column(Integer, default=0)
    vulnerability_index = Column(Float, default=0.5)
    boundary_geojson = Column(JSON, nullable=True)
    source_status = Column(String(32), default="DEMO")


class InfrastructureRecordModel(Base):
    __tablename__ = "infrastructure_records"

    id = Column(String(64), primary_key=True, index=True)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=True, index=True)
    infra_type = Column(String(64), nullable=False)  # SHELTER, HEALTHCARE, ROAD, SCHOOL, WATER
    name = Column(String(128), nullable=False)
    habitation_id = Column(String(64), nullable=True, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    capacity = Column(Integer, default=0)
    status = Column(String(32), default="OPERATIONAL")
    source_status = Column(String(32), default="DEMO")
