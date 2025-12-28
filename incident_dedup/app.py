from fastapi import FastAPI, HTTPException
from typing import List

from schemas import (
    DeduplicationRequest,
    DeduplicationResponse,
    ImageMatch
)

from image_encoder import encode_image_from_url
from similarity import (
    cosine_similarity,
    location_similarity,
    time_similarity
)
from decision import (
    compute_final_score,
    make_decision
)

app = FastAPI(
    title="Incident Image Deduplication Service",
    description="Detects duplicate incident images using image, location, and time similarity",
    version="1.0"
)


@app.post("/deduplicate-image", response_model=DeduplicationResponse)
def deduplicate_image(request: DeduplicationRequest):

    # -------------------------------
    # Encode NEW image (critical)
    # -------------------------------
    try:
        new_embedding = encode_image_from_url(
            request.new_image.image_url
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process new_image: {str(e)}"
        )

    image_matches: List[ImageMatch] = []

    # -------------------------------
    # Process each candidate safely
    # -------------------------------
    for candidate in request.candidate_images:
        try:
            candidate_embedding = encode_image_from_url(
                candidate.image_url
            )

            img_sim = cosine_similarity(
                new_embedding,
                candidate_embedding
            )

            loc_sim = location_similarity(
                request.new_image.latitude,
                request.new_image.longitude,
                candidate.latitude,
                candidate.longitude
            )

            time_sim = time_similarity(
                request.new_image.timestamp,
                candidate.timestamp
            )

            final_score = compute_final_score(
                img_sim,
                loc_sim,
                time_sim
            )

            decision = make_decision(final_score,threshold=0.75)

            image_matches.append(
                ImageMatch(
                    image_id=candidate.image_id,
                    incident_id=candidate.incident_id,
                    similarity_score=final_score,
                    decision=decision
                )
            )

        except Exception as e:
            # Candidate failed → mark it safely
            image_matches.append(
                ImageMatch(
                    image_id=candidate.image_id,
                    incident_id=candidate.incident_id,
                    similarity_score=0.0,
                    decision="error_processing_candidate"
                )
            )

    return DeduplicationResponse(
        image_matches=image_matches
    )
