import json
from priority_classification.priority_llm_classifier import classify_priority



def test_hard_rule_medical_emergency():
    payload = {
        "incident_id": "T1",
        "incident_type": "Medical Emergency",
        "description": "Person unconscious",
        "report_count": 1,
        "image_attached": False,
        "time_since_report_minutes": 3
    }

    result = classify_priority(payload)

    assert result["priority"] == "HIGH"
    assert result["method"] == "HARD_RULE"


def test_fire_incident():
    payload = {
        "incident_id": "T2",
        "incident_type": "Fire",
        "description": "Fire broke out in shop",
        "report_count": 2,
        "image_attached": True,
        "time_since_report_minutes": 10
    }

    result = classify_priority(payload)

    assert result["priority"] == "HIGH"


def test_minor_accident():
    payload = {
        "incident_id": "T3",
        "incident_type": "Road Accident",
        "description": "Two cars collided, no injury",
        "report_count": 1,
        "image_attached": True,
        "time_since_report_minutes": 20
    }

    result = classify_priority(payload)

    assert result["priority"] in ["MEDIUM", "LOW"]


def test_low_priority_infrastructure():
    payload = {
        "incident_id": "T4",
        "incident_type": "Infrastructure",
        "description": "Streetlight not working",
        "report_count": 1,
        "image_attached": False,
        "time_since_report_minutes": 200
    }

    result = classify_priority(payload)

    assert result["priority"] == "LOW"


def test_response_schema():
    payload = {
        "incident_id": "T5",
        "incident_type": "Crime",
        "description": "Robbery reported near mall",
        "report_count": 2,
        "image_attached": False,
        "time_since_report_minutes": 15
    }

    result = classify_priority(payload)

    # Schema checks
    assert "incident_id" in result
    assert "priority" in result
    assert "confidence" in result
    assert "reason" in result
