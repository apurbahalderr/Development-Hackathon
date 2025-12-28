import torch
from incident_dedup.similarity import cosine_similarity, location_similarity, time_similarity

from datetime import datetime

def test_cosine_similarity_identical():
    a = torch.tensor([1.0, 0.0])
    b = torch.tensor([1.0, 0.0])
    sim = cosine_similarity(a, b)
    assert sim == 1.0

def test_location_similarity_close():
    sim = location_similarity(20.353, 85.817, 20.353, 85.817)
    assert sim == 1.0

def test_time_similarity_close():
    t1 = datetime.fromisoformat("2025-01-01T10:00:00")
    t2 = datetime.fromisoformat("2025-01-01T10:04:00")
    sim = time_similarity(t1, t2)
    assert sim == 1.0
