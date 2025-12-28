from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

SIMILARITY_THRESHOLD = 0.80


def is_duplicate_incident(
    new_embedding,
    past_incidents_embeddings: list
) -> bool:

    if not past_incidents_embeddings:
        return False

    new_vec = np.array(new_embedding).reshape(1, -1)

    for past_vec in past_incidents_embeddings:
        past_vec = np.array(past_vec).reshape(1, -1)
        similarity = cosine_similarity(new_vec, past_vec)[0][0]

        if similarity >= SIMILARITY_THRESHOLD:
            return True

    return False
