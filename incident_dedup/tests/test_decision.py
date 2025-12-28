from incident_dedup.decision import compute_final_score, make_decision


def test_compute_final_score():
    score = compute_final_score(
        image_similarity=0.8,
        location_similarity=1.0,
        time_similarity=1.0
    )
    assert 0 <= score <= 1

def test_make_decision_same_incident():
    decision = make_decision(0.8, threshold=0.75)
    assert decision == "same_incident_image"

def test_make_decision_new_incident():
    decision = make_decision(0.6, threshold=0.75)
    assert decision == "new_incident_image"
