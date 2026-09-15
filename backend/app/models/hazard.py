from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class HazardDataModel(Base):
    __tablename__ = "hazard_data"

    id = Column(String(64), primary_key=True, index=True)
    habitation_id = Column(String(64), ForeignKey("habitations.id"), nullable=False, index=True)
    type = Column(String(64), nullable=False)  # flood, cyclone, coastal_erosion, landslide, heatwave
    name = Column(String(128), nullable=False)
    score = Column(Integer, default=50)  # 0 - 100
    trend = Column(String(32), default="STABLE")  # INCREASING, STABLE, DECREASING
    confidence = Column(Integer, default=90)
    last_updated = Column(String(64), nullable=True)
    source = Column(String(128), default="Synthetic Satellite & Hydrology Grid")
    description = Column(Text, nullable=True)

    habitation = relationship("HabitationModel", back_populates="hazards")


class HazardLayerConfigModel(Base):
    __tablename__ = "hazard_layer_configs"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    hazard_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=True)
    color = Column(String(32), default="#ef4444")
    visible = Column(Boolean, default=True)
    opacity = Column(Float, default=0.6)
    source = Column(String(128), default="Synthetic Remote Sensing")
    resolution = Column(String(64), default="5m Spatial Grid")
