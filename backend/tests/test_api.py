from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    """Test health check returns 200 and connected status"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "database_status" in data
    assert data["data_classification"] == "DEMO / SYNTHETIC DATA"


def test_list_habitations_endpoint(client: TestClient):
    """Test listing habitations returns seeded settlements including Kadalpuram"""
    response = client.get("/api/habitations")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert data["data_classification"] == "DEMO / SYNTHETIC DATA"
    
    # Verify Kadalpuram is in the list
    kadalpuram = next((h for h in data["items"] if h["id"] == "kadalpuram"), None)
    assert kadalpuram is not None
    assert kadalpuram["name"] == "Kadalpuram"
    assert kadalpuram["overall_risk"] == 72
    assert kadalpuram["ai_recommendation"] == "PARTIAL_RELOCATION"


def test_get_habitation_detail_endpoint(client: TestClient):
    """Test retrieving detailed habitation with micro-zones"""
    response = client.get("/api/habitations/kadalpuram")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "kadalpuram"
    assert len(data["micro_zones"]) == 3
    assert len(data["hazards"]) >= 3
    assert data["micro_zones"][0]["zone_code"] == "MZ-01-NORTH"


def test_get_nonexistent_habitation(client: TestClient):
    """Test 404 on nonexistent habitation"""
    response = client.get("/api/habitations/nonexistent-id")
    assert response.status_code == 404


def test_list_hazards_endpoint(client: TestClient):
    """Test hazard layers and multi-hazard summaries"""
    response = client.get("/api/hazards")
    assert response.status_code == 200
    data = response.json()
    assert data["total_layers"] >= 3
    assert len(data["summaries"]) >= 4
    assert any(s["hazard_type"] == "coastal_erosion" for s in data["summaries"])


def test_list_safe_sites_endpoint(client: TestClient):
    """Test candidate safe haven listing"""
    response = client.get("/api/safe-sites")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    site_b = next((s for s in data["items"] if s["id"] == "site-b"), None)
    assert site_b is not None
    assert site_b["hazard_safety_score"] == 98
    assert site_b["capacity_recommended_max"] == 5000


def test_relocation_priorities_endpoint(client: TestClient):
    """Test relocation priorities calculation and BCR"""
    response = client.get("/api/relocation-priorities")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    assert data["total_relocating_citizens"] >= 4000
    assert data["average_bcr"] > 1.0
    assert len(data["items"]) >= 2
