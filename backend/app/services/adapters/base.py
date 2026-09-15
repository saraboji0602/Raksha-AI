"""
Base Adapter Interface for RAKSHA-AI Data Source Adapters.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple
from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class DataSourceAdapter(ABC):
    """
    Abstract Base Class for all real/synthetic data source adapters.
    Standardizes ingestion, validation, normalization, and provenance tracking.
    """

    def __init__(self, adapter_name: str, category: str):
        self.adapter_name = adapter_name
        self.category = category

    @abstractmethod
    def fetch_raw_data(self) -> str:
        """
        Simulates fetching raw payload from external data feed or local sample file.
        """
        pass

    @abstractmethod
    def validate(self, payload: str) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        """
        Validates structure, coordinate bounds, and geometry topology.
        """
        pass

    @abstractmethod
    def normalize(self, valid_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalizes raw attributes to canonical RAKSHA-AI schema format.
        """
        pass

    @abstractmethod
    def get_provenance_metadata(self) -> DatasetMetadataSchema:
        """
        Returns provenance metadata and source status (VERIFIED/DEMO/etc).
        """
        pass
