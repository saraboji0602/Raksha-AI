"""
Data Quality & Validation Engine for RAKSHA-AI Dataset Ingestion.
Performs pre-ingestion checks:
- Missing values & required attributes
- Invalid coordinates & bounds [-90..90, -180..180]
- Geometry validity (via Shapely polygon topology)
- Duplicate detection
- Unit and range validation
- Structured Quality Report generation
"""

import csv
import io
import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from shapely.geometry import shape

from app.schemas.dataset import DatasetMetadataSchema, DatasetQualityReportSchema


class DataQualityEngine:
    """
    Core validation engine generating structured quality reports and sanitizing records.
    """

    @staticmethod
    def validate_csv_content(
        content: str,
        category: Optional[str] = None,
        required_columns: Optional[List[str]] = None,
    ) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        """
        Validates CSV content for completeness, coordinate limits, duplicates, and range boundaries.
        """
        if not content or not content.strip():
            return DatasetQualityReportSchema(
                total_records=0,
                valid_records=0,
                rejected_records=0,
                quality_score=0.0,
                issues_summary=["Empty CSV content."],
                validated_at=datetime.now(timezone.utc),
            ), []

        reader = csv.DictReader(io.StringIO(content.strip()))
        rows = list(reader)
        total = len(rows)

        if total == 0:
            return DatasetQualityReportSchema(
                total_records=0,
                valid_records=0,
                rejected_records=0,
                quality_score=0.0,
                issues_summary=["CSV contains headers but 0 data rows."],
                validated_at=datetime.now(timezone.utc),
            ), []

        valid_rows = []
        issues = []
        missing_geom = 0
        invalid_geom = 0
        duplicates = 0
        invalid_val = 0
        seen_ids = set()
        seen_rows = set()

        for idx, row in enumerate(rows, start=1):
            row_issues = []

            # 1. Required column validation
            if required_columns:
                for col in required_columns:
                    if col not in row or not str(row[col]).strip():
                        row_issues.append(f"Row {idx}: Missing required column '{col}'")
                        invalid_val += 1

            # 2. Duplicate detection
            # Check ID column if present
            row_id = row.get("id") or row.get("station_id") or row.get("facility_id") or row.get("zone_id")
            if row_id and str(row_id).strip():
                clean_id = str(row_id).strip()
                if clean_id in seen_ids:
                    duplicates += 1
                    row_issues.append(f"Row {idx}: Duplicate record ID '{clean_id}'.")
                else:
                    seen_ids.add(clean_id)
            else:
                # Full row tuple duplicate check
                row_tuple = tuple(sorted((k, str(v).strip()) for k, v in row.items()))
                if row_tuple in seen_rows:
                    duplicates += 1
                    row_issues.append(f"Row {idx}: Duplicate record row detected.")
                else:
                    seen_rows.add(row_tuple)

            # 3. Coordinate validation
            lat_key = next((k for k in row if k.lower() in ("latitude", "lat", "y")), None)
            lon_key = next((k for k in row if k.lower() in ("longitude", "lon", "lng", "x")), None)

            if lat_key and lon_key:
                raw_lat = str(row[lat_key]).strip()
                raw_lon = str(row[lon_key]).strip()

                if not raw_lat or not raw_lon:
                    missing_geom += 1
                    row_issues.append(f"Row {idx}: Missing latitude or longitude value.")
                else:
                    try:
                        lat_f = float(raw_lat)
                        lon_f = float(raw_lon)
                        if not (-90.0 <= lat_f <= 90.0):
                            invalid_geom += 1
                            row_issues.append(f"Row {idx}: Latitude {lat_f} out of bounds [-90, 90].")
                        if not (-180.0 <= lon_f <= 180.0):
                            invalid_geom += 1
                            row_issues.append(f"Row {idx}: Longitude {lon_f} out of bounds [-180, 180].")
                    except ValueError:
                        invalid_geom += 1
                        row_issues.append(f"Row {idx}: Coordinates must be numeric.")
            elif lat_key or lon_key:
                missing_geom += 1
                row_issues.append(f"Row {idx}: Incomplete coordinate pair.")

            # 4. Numeric range sanity checks
            for field_name, raw_val in row.items():
                if not raw_val or not str(raw_val).strip():
                    continue
                k_lower = field_name.lower()
                if any(kw in k_lower for kw in ("rainfall", "depth", "capacity", "population", "elevation")):
                    try:
                        val_num = float(raw_val)
                        if val_num < 0 and "elevation" not in k_lower:
                            invalid_val += 1
                            row_issues.append(f"Row {idx}: Negative value {val_num} for '{field_name}'.")
                    except ValueError:
                        pass

            if row_issues:
                issues.extend(row_issues)
            else:
                valid_rows.append(row)

        rejected = total - len(valid_rows)
        quality_score = round((len(valid_rows) / total) * 100.0, 1) if total > 0 else 0.0

        report = DatasetQualityReportSchema(
            total_records=total,
            valid_records=len(valid_rows),
            rejected_records=rejected,
            missing_geometry_count=missing_geom,
            duplicate_count=duplicates,
            invalid_value_count=invalid_val + invalid_geom,
            quality_score=quality_score,
            issues_summary=issues[:25],
            validated_at=datetime.now(timezone.utc),
        )

        return report, valid_rows

    @staticmethod
    def validate_geojson_content(
        content: str,
        category: Optional[str] = None,
    ) -> Tuple[DatasetQualityReportSchema, List[Dict[str, Any]]]:
        """
        Validates GeoJSON FeatureCollection, geometries, coordinates, and properties.
        """
        if not content or not content.strip():
            return DatasetQualityReportSchema(
                total_records=0,
                valid_records=0,
                rejected_records=0,
                quality_score=0.0,
                issues_summary=["Empty GeoJSON content."],
                validated_at=datetime.now(timezone.utc),
            ), []

        try:
            data = json.loads(content)
        except Exception as e:
            return DatasetQualityReportSchema(
                total_records=0,
                valid_records=0,
                rejected_records=0,
                quality_score=0.0,
                issues_summary=[f"Malformed JSON: {str(e)}"],
                validated_at=datetime.now(timezone.utc),
            ), []

        # Handle FeatureCollection, Feature, or list of JSON records
        features = []
        if isinstance(data, dict):
            if data.get("type") == "FeatureCollection":
                features = data.get("features", [])
            elif data.get("type") == "Feature":
                features = [data]
            else:
                items = data.get("records") or data.get("gauges") or data.get("stations") or data.get("sites") or []
                features = [
                    feat if (isinstance(feat, dict) and "geometry" in feat) else {
                        "type": "Feature",
                        "properties": feat,
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                float(feat.get("longitude") or feat.get("lon") or feat.get("lng") or 0.0),
                                float(feat.get("latitude") or feat.get("lat") or 0.0)
                            ]
                        } if isinstance(feat, dict) and (feat.get("latitude") is not None or feat.get("lat") is not None) and (feat.get("longitude") is not None or feat.get("lon") is not None or feat.get("lng") is not None) else None
                    }
                    for feat in items
                ]
        elif isinstance(data, list):
            features = [
                f if (isinstance(f, dict) and "geometry" in f) else {
                    "type": "Feature",
                    "properties": f,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            float(f.get("longitude") or f.get("lon") or f.get("lng") or 0.0),
                            float(f.get("latitude") or f.get("lat") or 0.0)
                        ]
                    } if isinstance(f, dict) and (f.get("latitude") is not None or f.get("lat") is not None) and (f.get("longitude") is not None or f.get("lon") is not None or f.get("lng") is not None) else None
                }
                for f in data
            ]

        total = len(features)
        if total == 0:
            return DatasetQualityReportSchema(
                total_records=0,
                valid_records=0,
                rejected_records=0,
                quality_score=0.0,
                issues_summary=["No features or records found in dataset."],
                validated_at=datetime.now(timezone.utc),
            ), []

        valid_features = []
        issues = []
        missing_geom = 0
        invalid_geom = 0
        duplicates = 0
        seen_ids = set()

        for idx, feat in enumerate(features, start=1):
            feat_issues = []

            if not isinstance(feat, dict):
                feat_issues.append(f"Record {idx}: Item is not a valid object.")
                issues.extend(feat_issues)
                continue

            geom = feat.get("geometry")
            if not geom or not isinstance(geom, dict) or not geom.get("coordinates"):
                missing_geom += 1
                feat_issues.append(f"Feature {idx}: Missing or empty geometry.")
            else:
                try:
                    s_geom = shape(geom)
                    if not s_geom.is_valid:
                        invalid_geom += 1
                        feat_issues.append(f"Feature {idx}: Invalid Shapely topology geometry.")
                except Exception as ex:
                    invalid_geom += 1
                    feat_issues.append(f"Feature {idx}: Geometry parsing failed ({str(ex)}).")

            # Check duplicate ID
            props = feat.get("properties", {}) if isinstance(feat.get("properties"), dict) else {}
            f_id = props.get("id") or props.get("zone_id") or props.get("habitation_id") or props.get("gauge_id") or props.get("site_id")
            if f_id:
                clean_f_id = str(f_id).strip()
                if clean_f_id in seen_ids:
                    duplicates += 1
                    feat_issues.append(f"Feature {idx}: Duplicate feature identifier '{clean_f_id}'.")
                else:
                    seen_ids.add(clean_f_id)

            if feat_issues:
                issues.extend(feat_issues)
            else:
                valid_features.append(feat)

        rejected = total - len(valid_features)
        quality_score = round((len(valid_features) / total) * 100.0, 1) if total > 0 else 0.0

        report = DatasetQualityReportSchema(
            total_records=total,
            valid_records=len(valid_features),
            rejected_records=rejected,
            missing_geometry_count=missing_geom,
            duplicate_count=duplicates,
            invalid_value_count=invalid_geom,
            quality_score=quality_score,
            issues_summary=issues[:25],
            validated_at=datetime.now(timezone.utc),
        )

        return report, valid_features

    @staticmethod
    def extract_metadata_from_payload(
        payload: Any,
        fallback_name: str = "Dataset",
        category: Optional[str] = None
    ) -> DatasetMetadataSchema:
        """
        Extracts provenance metadata from payload or assigns standard DEMO defaults.
        """
        meta_dict = {}
        if isinstance(payload, str):
            try:
                parsed = json.loads(payload)
                if isinstance(parsed, dict):
                    meta_dict = parsed.get("metadata", {})
            except Exception:
                pass
        elif isinstance(payload, dict):
            meta_dict = payload.get("metadata", {})

        return DatasetMetadataSchema(
            source=meta_dict.get("source") or f"Synthetic {category.capitalize() if category else 'Disaster'} Feed",
            source_type=meta_dict.get("source_type", "DEMO_SYNTHETIC"),
            source_status=meta_dict.get("source_status", "DEMO"),
            collection_date=meta_dict.get("collection_date", "2026-09-01"),
            last_updated=meta_dict.get("last_updated", "2026-09-15"),
            geographic_scope=meta_dict.get("geographic_scope", "Nagapattinam / Tamil Nadu Coast"),
            license=meta_dict.get("license", "Government Data License (Synthetic Prototype)"),
            resolution=meta_dict.get("resolution", "High Precision GIS Grid"),
            confidence=int(meta_dict.get("confidence", 92)),
            freshness=meta_dict.get("freshness", "Current Batch"),
            processing_status="PROCESSED_NORMALIZED"
        )
