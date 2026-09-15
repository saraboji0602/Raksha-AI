import logging
from sqlalchemy.orm import Session
from app.models.habitation import HabitationModel, MicroZoneModel
from app.models.hazard import HazardDataModel, HazardLayerConfigModel
from app.models.safe_site import SafeSiteModel
from app.models.incident import ShelterModel, RoadSegmentModel

logger = logging.getLogger(__name__)

DEMO_LABEL = "DEMO / SYNTHETIC DATA"

def seed_database(db: Session) -> None:
    """
    Populates database with baseline deterministic demo/synthetic datasets if empty.
    """
    existing_count = db.query(HabitationModel).count()
    if existing_count > 0:
        logger.info("Database already contains %d habitations. Skipping seed.", existing_count)
        return

    logger.info("Seeding database with deterministic synthetic demo data...")

    # 1. Habitations
    kadalpuram = HabitationModel(
        id="kadalpuram",
        name="Kadalpuram",
        district="Nagapattinam Coastal Zone",
        state="Tamil Nadu",
        latitude=10.7654,
        longitude=79.8428,
        population=4820,
        households=912,
        area_sq_km=8.7,
        dominant_hazard="coastal_erosion",
        settlement_type="COASTAL",
        is_urban=False,
        overall_risk=72,
        baseline_risk=72,
        exposure_score=88,
        vulnerability_score=84,
        resilience_score=48,
        data_confidence=93,
        priority="IMMEDIATE",
        emergency_urgency="IMMEDIATE",
        long_term_priority="HIGH",
        priority_score=94,
        ai_recommendation="PARTIAL_RELOCATION",
        recommendation_reason="Extreme coastal erosion and compound storm surge risk affect northern micro-zones. 2,650 residents in Zone A require relocation to Site B while central & southern zones can be adapted with in-situ works.",
        status="ASSESSMENT",
        exposed_population=4210,
        exposed_percentage=87,
        children_count=620,
        elderly_count=410,
        special_assistance_count=185,
        female_headed_count=160,
        kutcha_house_count=510,
        relocation_population=2650,
        adaptation_population=1220,
        protection_population=950,
        recommended_site_id="site-b",
        cost_protect_cr=12.0,
        cost_adapt_cr=18.5,
        cost_relocate_cr=28.5,
        cost_of_inaction_cr=84.5,
        evacuation_time_min=35,
        primary_evac_route="State Highway SH-49 High Bypass (Safe Route B)",
        secondary_evac_route="Coastal Causeway (Route A - Inundation Risk)",
        evac_bottleneck="Culvert B-07 (Tidal Undertow Risk)",
        field_verified=True,
        field_verification_notes="Field audit confirmed 3.4m/yr coastal scarp retreat and salinization of 6 drinking wells.",
        verified_by="Thiru S. Murugesan (Revenue Inspector, Zone 4)",
        last_updated="2026-09-15 08:30 AM",
        data_classification=DEMO_LABEL
    )

    malaiyur = HabitationModel(
        id="malaiyur",
        name="Malaiyur",
        district="Nilgiri Hills Demonstration District",
        state="Tamil Nadu",
        latitude=11.4102,
        longitude=76.6950,
        population=2140,
        households=440,
        area_sq_km=5.2,
        dominant_hazard="landslide",
        settlement_type="HILL_SLOPE",
        is_urban=False,
        overall_risk=94,
        baseline_risk=94,
        exposure_score=92,
        vulnerability_score=89,
        resilience_score=36,
        data_confidence=91,
        priority="IMMEDIATE",
        emergency_urgency="IMMEDIATE",
        long_term_priority="HIGH",
        priority_score=96,
        ai_recommendation="FULL_RELOCATION",
        recommendation_reason="Deep-seated active slope shear cracks detected above upper settlement toe. Soil saturation index exceeds critical shear threshold. High risk of catastrophic debris flow.",
        status="PLANNING",
        exposed_population=1980,
        exposed_percentage=92,
        children_count=290,
        elderly_count=220,
        special_assistance_count=75,
        female_headed_count=60,
        kutcha_house_count=210,
        relocation_population=2140,
        adaptation_population=0,
        protection_population=0,
        recommended_site_id="site-c",
        cost_protect_cr=38.0,
        cost_adapt_cr=29.0,
        cost_relocate_cr=21.5,
        cost_of_inaction_cr=84.0,
        evacuation_time_min=65,
        primary_evac_route="Ghat Road SH-181 (Prone to rockfall)",
        secondary_evac_route="Tea Plantation Ridge Trail",
        evac_bottleneck="Hairpin Bend 14 (Active slope slip cut off)",
        field_verified=True,
        field_verification_notes="Geological survey verified 45mm crown tension crack expansion.",
        verified_by="Sr. Geologist Dr. K. Raman (SDMA Hill Taskforce)",
        last_updated="2026-09-07 04:15 PM",
        data_classification=DEMO_LABEL
    )

    aarupadi = HabitationModel(
        id="aarupadi",
        name="Aarupadi",
        district="Thanjavur Delta Demo District",
        state="Tamil Nadu",
        latitude=10.7870,
        longitude=79.1378,
        population=3620,
        households=780,
        area_sq_km=9.4,
        dominant_hazard="flood",
        settlement_type="RIVER_BASIN",
        is_urban=False,
        overall_risk=78,
        baseline_risk=78,
        exposure_score=84,
        vulnerability_score=68,
        resilience_score=52,
        data_confidence=94,
        priority="SHORT_TERM",
        emergency_urgency="SHORT_TERM",
        long_term_priority="MEDIUM",
        priority_score=79,
        ai_recommendation="ADAPT",
        recommendation_reason="Low-lying delta basin settlement prone to monsoon backwater. Sluice channel remodeling and raised plinth housing reduce exposure by 55%.",
        status="ASSESSMENT",
        exposed_population=2850,
        exposed_percentage=79,
        children_count=480,
        elderly_count=340,
        special_assistance_count=95,
        female_headed_count=110,
        kutcha_house_count=320,
        relocation_population=750,
        adaptation_population=2100,
        protection_population=770,
        recommended_site_id="site-d",
        cost_protect_cr=8.5,
        cost_adapt_cr=14.2,
        cost_relocate_cr=16.8,
        cost_of_inaction_cr=48.0,
        evacuation_time_min=40,
        primary_evac_route="Canal Embankment Road",
        secondary_evac_route="Paddy Field Dike Path",
        evac_bottleneck="Sluice Bridge 03 Submergence",
        field_verified=True,
        field_verification_notes="Verified silt accumulation in Vennar drainage tributary.",
        verified_by="Assistant Executive Engineer (PWD Water Resources)",
        last_updated="2026-09-08 10:00 AM",
        data_classification=DEMO_LABEL
    )

    db.add_all([kadalpuram, malaiyur, aarupadi])
    db.flush()

    # 2. Micro Zones for Kadalpuram
    kz1 = MicroZoneModel(
        id="kz-1",
        habitation_id="kadalpuram",
        name="North Fisherman Spit (Zone A)",
        zone_code="MZ-01-NORTH",
        population=2650,
        households=510,
        risk_score=96,
        risk_level="CRITICAL",
        primary_hazard="coastal_erosion",
        recommendation="PARTIAL_RELOCATION",
        reason="Direct wave attack line, high vulnerability kutcha houses, within 50m of high tide line.",
        coordinates=[[10.772, 79.840], [10.775, 79.845], [10.768, 79.848], [10.765, 79.842]],
        vulnerable_people_count=670,
        kutcha_houses_count=510,
        distance_to_coastline_meters=45.0
    )

    kz2 = MicroZoneModel(
        id="kz-2",
        habitation_id="kadalpuram",
        name="Central Panchayat Market (Zone B)",
        zone_code="MZ-02-CENTRAL",
        population=1220,
        households=232,
        risk_score=78,
        risk_level="HIGH",
        primary_hazard="cyclone",
        recommendation="ADAPT",
        reason="Elevated terrain (3.5m above MSL); storm proofing of roofs and drainage channels provides viable defense.",
        coordinates=[[10.765, 79.838], [10.768, 79.842], [10.762, 79.844], [10.760, 79.839]],
        vulnerable_people_count=325,
        kutcha_houses_count=140,
        distance_to_coastline_meters=380.0
    )

    kz3 = MicroZoneModel(
        id="kz-3",
        habitation_id="kadalpuram",
        name="Southern Inland Hamlet (Zone C)",
        zone_code="MZ-03-SOUTH",
        population=950,
        households=170,
        risk_score=58,
        risk_level="MODERATE",
        primary_hazard="flood",
        recommendation="PROTECT",
        reason="Sheltered behind mangrove belt; tidal bund restoration and sluice gate upgrade ensures safety.",
        coordinates=[[10.758, 79.835], [10.761, 79.839], [10.755, 79.841], [10.752, 79.837]],
        vulnerable_people_count=220,
        kutcha_houses_count=45,
        distance_to_coastline_meters=850.0
    )

    db.add_all([kz1, kz2, kz3])

    # 3. Hazard Data for Kadalpuram
    h1 = HazardDataModel(
        id="hz-k-1",
        habitation_id="kadalpuram",
        type="coastal_erosion",
        name="Shoreline Recession & Scarp Retreat",
        score=94,
        trend="INCREASING",
        confidence=96,
        last_updated="2026-09-08",
        source="Synthetic Sentinel InSAR & Survey of India",
        description="Shoreline regression rate measured at 3.4 m/year with active scarp collapse."
    )
    h2 = HazardDataModel(
        id="hz-k-2",
        habitation_id="kadalpuram",
        type="cyclone",
        name="Cyclonic Surge Inundation",
        score=88,
        trend="INCREASING",
        confidence=92,
        last_updated="2026-09-05",
        source="Synthetic IMD Coastal Hydrodynamic Model",
        description="Category 3/4 storm surge wave run-up penetrating up to 600m inland."
    )
    h3 = HazardDataModel(
        id="hz-k-3",
        habitation_id="kadalpuram",
        type="flood",
        name="Estuarine River Backwater Surge",
        score=78,
        trend="STABLE",
        confidence=90,
        last_updated="2026-08-28",
        source="Synthetic State Water Resources DEM",
        description="River backwater congestion during astronomical high tide events."
    )

    db.add_all([h1, h2, h3])

    # 4. Safe Sites
    site_b = SafeSiteModel(
        id="site-b",
        name="Pothigai Hills Greenfield Haven (Site B)",
        code="SS-NGP-02",
        district="Nagapattinam District (Inland)",
        state="Tamil Nadu",
        latitude=10.8420,
        longitude=79.7610,
        land_area_acres=28.5,
        current_land_use="Government Wasteland (Gramanatham Classification)",
        elevation_meters=18.5,
        distance_from_coast_km=14.5,
        slope_percentage=1.8,
        status="APPROVED_FOR_PLANNING",
        land_verification_status="POTENTIALLY_SUITABLE",
        overall_score=92,
        hazard_safety_score=98,
        land_availability_score=94,
        connectivity_score=88,
        water_score=86,
        healthcare_score=82,
        education_score=85,
        livelihood_score=89,
        capacity_recommended_max=5000,
        allocated_population=2650,
        bottleneck_resource="Potable Water Distribution Network",
        community_acceptance_score=84,
        livelihood_type="COASTAL_FISHING",
        estimated_development_cost_cr=28.5,
        estimated_development_time_months=18,
        distance_from_key_settlements={"kadalpuram": 18.4, "tharangambadi": 22.0},
        travel_time_min={"kadalpuram": 32, "tharangambadi": 38},
        road_quality="PAVED_ALL_WEATHER",
        description="High elevation tableland 14.5km inland with direct 4-lane SH-49 highway transit back to coastal harbor.",
        selection_rationale="Optimal combination of 98/100 disaster safety, available government revenue land, and strong community acceptance.",
        data_classification=DEMO_LABEL
    )

    site_c = SafeSiteModel(
        id="site-c",
        name="Bedrock Ridge Plateau (Site C)",
        code="SS-NIL-01",
        district="Nilgiri Foothills Haven",
        state="Tamil Nadu",
        latitude=11.3850,
        longitude=76.7420,
        land_area_acres=35.0,
        current_land_use="Revenue Forest Buffer Zone",
        elevation_meters=1420.0,
        distance_from_coast_km=95.0,
        slope_percentage=4.2,
        status="FIELD_ASSESSED",
        land_verification_status="POTENTIALLY_SUITABLE",
        overall_score=89,
        hazard_safety_score=96,
        land_availability_score=90,
        connectivity_score=78,
        water_score=84,
        healthcare_score=75,
        education_score=80,
        livelihood_score=82,
        capacity_recommended_max=3500,
        allocated_population=2140,
        bottleneck_resource="Internal Road Paving & Power Substation",
        community_acceptance_score=78,
        livelihood_type="AGRICULTURE",
        estimated_development_cost_cr=21.5,
        estimated_development_time_months=24,
        distance_from_key_settlements={"malaiyur": 12.5},
        travel_time_min={"malaiyur": 25},
        road_quality="PAVED_ALL_WEATHER",
        description="Geologically stable bedrock ridge outside all landslide slip zones.",
        selection_rationale="Zero landslide hazard slope with proven bedrock geological formation for hill habitations.",
        data_classification=DEMO_LABEL
    )

    db.add_all([site_b, site_c])

    # 5. Hazard Layer Configs
    hl1 = HazardLayerConfigModel(
        id="hl-flood",
        name="Flood Inundation & River Surge (DEM Basin)",
        hazard_type="flood",
        description="100-year flood envelope synthesized from 10m hydrological elevation model.",
        color="#3b82f6",
        visible=True,
        opacity=0.6,
        source="Synthetic State Water Resources DEM",
        resolution="10m Spatial Grid"
    )
    hl2 = HazardLayerConfigModel(
        id="hl-erosion",
        name="Coastal Erosion & Shoreline Retreat (InSAR)",
        hazard_type="coastal_erosion",
        description="High-resolution coastal displacement contours derived from satellite radar telemetry.",
        color="#f97316",
        visible=True,
        opacity=0.7,
        source="Synthetic Satellite InSAR Telemetry",
        resolution="5m Spatial Grid"
    )
    hl3 = HazardLayerConfigModel(
        id="hl-cyclone",
        name="Cyclonic Storm Surge Envelope (Hydrodynamic)",
        hazard_type="cyclone",
        description="Hydrodynamic storm surge simulation for Category 3/4 cyclonic landfall.",
        color="#ef4444",
        visible=True,
        opacity=0.65,
        source="Synthetic IMD Hydrodynamic Simulation",
        resolution="100m Coastal Buffer"
    )

    db.add_all([hl1, hl2, hl3])

    sh1 = ShelterModel(
        id="sh-01",
        name="Velankanni Multi-Hazard Cyclone Relief Camp",
        code="SHELTER-NGP-01",
        settlement_id="kadalpuram",
        settlement_name="Kadalpuram",
        district="Nagapattinam Coastal Zone",
        latitude=10.7712,
        longitude=79.8320,
        elevation_meters=8.5,
        distance_km=1.4,
        capacity=850,
        current_occupancy=320,
        status="OPEN",
        water_available=True,
        medical_available=True,
        electricity_available=True,
        sanitation_available=True,
        wheelchair_accessible=True,
        road_access="CLEAR"
    )
    sh2 = ShelterModel(
        id="sh-02",
        name="Panchayat Union School Cyclone Haven",
        code="SHELTER-NGP-02",
        settlement_id="kadalpuram",
        settlement_name="Kadalpuram",
        district="Nagapattinam Coastal Zone",
        latitude=10.7610,
        longitude=79.8340,
        elevation_meters=9.2,
        distance_km=2.1,
        capacity=1200,
        current_occupancy=410,
        status="OPEN",
        water_available=True,
        medical_available=True,
        electricity_available=True,
        sanitation_available=True,
        wheelchair_accessible=True,
        road_access="CLEAR"
    )
    db.add_all([sh1, sh2])

    db.commit()
    logger.info("Successfully seeded database with %d habitations, %d safe sites, and %d hazard records.", 3, 2, 3)
