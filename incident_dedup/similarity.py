import torch
import math
from datetime import datetime

def cosine_similarity(emb1: torch.Tensor, emb2: torch.Tensor) -> float:
    """
    Computes cosine similarity between two embedding vectors.
    Returns a value between 0 and 1.
    """

    # Normalize vectors
    emb1_norm = emb1 / emb1.norm()
    emb2_norm = emb2 / emb2.norm()

    # Cosine similarity
    similarity = torch.dot(emb1_norm, emb2_norm)

    return similarity.item()

def haversine_distance(lat1, lon1, lat2, lon2) -> float:
    """
    Computes distance (in meters) between two GPS points.
    """

    R = 6371000  # Earth radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)

    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def location_similarity(
    lat1, lon1, lat2, lon2
) -> float:
    """
    Converts geographic distance to similarity score (0–1).
    """

    distance = haversine_distance(lat1, lon1, lat2, lon2)

    if distance <= 50:
        return 1.0
    elif distance <= 150:
        return 0.7
    elif distance <= 300:
        return 0.4
    else:
        return 0.0


def time_similarity(
    t1: datetime,
    t2: datetime
) -> float:
    """
    Computes time similarity based on difference in minutes.
    """

    diff_seconds = abs((t1 - t2).total_seconds())
    diff_minutes = diff_seconds / 60

    if diff_minutes <= 5:
        return 1.0
    elif diff_minutes <= 15:
        return 0.6
    elif diff_minutes <= 30:
        return 0.3
    else:
        return 0.0
