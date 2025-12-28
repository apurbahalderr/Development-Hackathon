from fastapi.testclient import TestClient
from text_dedup.app import app
client = TestClient(app)


def test_first_incident_not_duplicate():
    response = client.post(
        "/incident",
        json={
            "text": "Fire reported in a residential building",
            "area_id": "sector_21",
            "timestamp": "2025-12-28T18:40:00"
        }
    )
    assert response.status_code == 200
    assert response.json()["duplicate"] is False


def test_similar_incident_duplicate():
    response = client.post(
        "/incident",
        json={
            "text": "Fire accident in an apartment",
            "area_id": "sector_21",
            "timestamp": "2025-12-28T18:45:00"
        }
    )
    assert response.status_code == 200
    assert response.json()["duplicate"] is True


def test_different_area_not_duplicate():
    response = client.post(
        "/incident",
        json={
            "text": "Fire accident in an apartment",
            "area_id": "sector_99",
            "timestamp": "2025-12-28T18:50:00"
        }
    )
    assert response.status_code == 200
    assert response.json()["duplicate"] is False


def test_missing_location_fails():
    response = client.post(
        "/incident",
        json={
            "text": "Fire incident",
            "timestamp": "2025-12-28T19:00:00"
        }
    )
    assert response.status_code == 400
