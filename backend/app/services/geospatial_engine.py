"""
Geospatial Processing Engine for RAKSHA-AI.
Provides:
- Haversine distance calculations
- Point-in-polygon containment
- Polygon intersection ratio (overlap)
- Hazard-to-habitation matching & buffer analysis
"""

import math
from typing import List, Tuple, Dict, Any, Optional, Union
from shapely.geometry import Point, Polygon, MultiPolygon, shape


class GeospatialEngine:
    @staticmethod
    def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates great-circle distance between two GPS coordinates in kilometers.
        """
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @staticmethod
    def is_point_in_polygon(lat: float, lon: float, polygon_coords: List[List[float]]) -> bool:
        """
        Checks if a GPS point (lat, lon) is contained inside a coordinate polygon [[lon, lat], ...].
        """
        try:
            pt = Point(lon, lat)
            poly = Polygon(polygon_coords)
            return poly.contains(pt) or poly.touches(pt)
        except Exception:
            return False

    @staticmethod
    def calculate_polygon_intersection_area_ratio(
        poly1_coords: List[List[float]],
        poly2_coords: List[List[float]]
    ) -> float:
        """
        Returns overlap percentage [0.0 - 1.0] between two polygons relative to poly1 area.
        """
        try:
            p1 = Polygon(poly1_coords)
            p2 = Polygon(poly2_coords)
            if not p1.is_valid or not p2.is_valid:
                return 0.0
            inter = p1.intersection(p2)
            if inter.is_empty or p1.area == 0:
                return 0.0
            return round(inter.area / p1.area, 3)
        except Exception:
            return 0.0

    @staticmethod
    def match_hazard_to_habitation(
        habitation_or_lat: Union[Dict[str, Any], float],
        hazard_polygons_or_lon: Union[List[Dict[str, Any]], float],
        hazard_polygons_opt: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Matches active hazard polygons intersecting or within buffer zone of a habitation location.
        Supports both (dict, list) signature and (lat, lon, list) signature.
        """
        if isinstance(habitation_or_lat, dict):
            hab_dict = habitation_or_lat
            hab_lat = float(hab_dict.get("latitude") or hab_dict.get("lat") or 0.0)
            hab_lon = float(hab_dict.get("longitude") or hab_dict.get("lon") or 0.0)
            hazard_polygons = hazard_polygons_or_lon if isinstance(hazard_polygons_or_lon, list) else []
            hab_id = hab_dict.get("id") or hab_dict.get("habitation_id") or "unknown"
            hab_name = hab_dict.get("name") or "Unknown Settlement"
        else:
            hab_lat = float(habitation_or_lat)
            hab_lon = float(hazard_polygons_or_lon) if isinstance(hazard_polygons_or_lon, (int, float)) else 0.0
            hazard_polygons = hazard_polygons_opt or []
            hab_id = "point"
            hab_name = "Point Coordinates"

        intersecting = []
        pt = Point(hab_lon, hab_lat)

        for h in hazard_polygons:
            geom = h.get("geometry")
            if not geom and "geometry_geojson" in h:
                geom = h["geometry_geojson"]
            if not geom:
                continue
            try:
                poly = shape(geom)
                # Convert buffer in approx degrees (~0.005 deg ≈ 550m)
                if poly.contains(pt) or poly.touches(pt) or poly.distance(pt) < 0.005:
                    intersecting.append(h.get("properties", h))
            except Exception:
                continue

        return {
            "habitation_id": hab_id,
            "habitation_name": hab_name,
            "latitude": hab_lat,
            "longitude": hab_lon,
            "is_impacted": len(intersecting) > 0,
            "intersecting_hazards": intersecting,
        }
