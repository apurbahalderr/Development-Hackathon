def compute_final_score(
    image_similarity: float,
    location_similarity: float,
    time_similarity: float,
) -> float:
    """
    Combine individual similarity scores into a single final score.
    """

    final_score = (
        0.7 * image_similarity +
        0.2 * location_similarity +
        0.1 * time_similarity
    )

    # Rounded for clean output
    return round(final_score, 3)


def make_decision(final_score: float, threshold: float = 0.8) -> str:
    """
    Decide whether the image belongs to an existing incident
    or represents a new incident.
    """

    if final_score >= threshold:
        return "same_incident_image"
    else:
        return "new_incident_image"
