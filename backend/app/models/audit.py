from sqlalchemy import Column, String, Integer, Float, Boolean, JSON, Text
from app.core.database import Base


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(String(64), nullable=False)
    actor_name = Column(String(128), nullable=False)
    actor_role = Column(String(128), nullable=False)
    action_type = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    target_entity_id = Column(String(64), nullable=False)
    target_entity_type = Column(String(64), nullable=False)
    target_entity_name = Column(String(128), nullable=False)
    previous_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=True)
    official_reason = Column(Text, nullable=True)
    statutory_basis = Column(String(255), default="Section 30(2)(v) Disaster Management Act 2005")
    confidence_before = Column(Integer, nullable=True)
    confidence_after = Column(Integer, nullable=True)
    evidence_reference = Column(String(128), nullable=True)


class DataConflictModel(Base):
    __tablename__ = "data_conflicts"

    id = Column(String(64), primary_key=True, index=True)
    parameter_name = Column(String(128), nullable=False)
    location_name = Column(String(128), nullable=False)
    settlement_id = Column(String(64), nullable=False, index=True)
    settlement_name = Column(String(128), nullable=False)

    ai_value = Column(String(128), nullable=False)
    ai_confidence = Column(Integer, default=80)
    ai_source = Column(String(128), default="Satellite Synthetic Aperture Radar (SAR)")

    field_value = Column(String(128), nullable=False)
    field_confidence = Column(Integer, default=95)
    field_officer_name = Column(String(128), default="Revenue Inspector")

    discrepancy_reason = Column(Text, nullable=True)
    impact_level = Column(String(32), default="HIGH")
    status = Column(String(64), default="CONFLICT_DETECTED")
    resolved_choice = Column(String(64), nullable=True)
    resolution_rationale = Column(Text, nullable=True)
