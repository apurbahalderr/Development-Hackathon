from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from text_dedup.encoder import TextEncoder
from text_dedup.filtering import filter_recent_incidents
from text_dedup.dedup_logic import is_duplicate_incident


app = FastAPI(title="Incident Text Dedup Service")

encoder = TextEncoder()

# -----------------------------
# Mock database (in-memory)
# -----------------------------
PAST_INCIDENTS = []


# -----------------------------
# Request schema
# -----------------------------
class IncidentRequest(BaseModel):
    text: str
    timestamp: str

    area_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# -----------------------------
# Response schema
# -----------------------------
class IncidentResponse(BaseModel):
    duplicate: bool


# -----------------------------
# API endpoint
# -----------------------------
@app.post("/incident", response_model=IncidentResponse)
def report_incident(req: IncidentRequest):

    # Validate location input
    if not req.area_id and (req.latitude is None or req.longitude is None):
        raise HTTPException(
            status_code=400,
            detail="Either area_id or both latitude and longitude must be provided"
        )

    try:
        incident_time = datetime.fromisoformat(req.timestamp)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid timestamp format")

    # Build new incident object
    new_incident = {
        "text": req.text,
        "timestamp": incident_time
    }

    if req.area_id:
        new_incident["area_id"] = req.area_id
    else:
        new_incident["latitude"] = req.latitude
        new_incident["longitude"] = req.longitude

    # Step 1: filter relevant incidents
    recent_incidents = filter_recent_incidents(
        new_incident,
        PAST_INCIDENTS
    )

    # Step 2: encode text
    new_embedding = encoder.encode(req.text)

    past_embeddings = [
        encoder.encode(incident["text"])
        for incident in recent_incidents
    ]

    # Step 3: dedup decision
    duplicate_flag = is_duplicate_incident(
        new_embedding,
        past_embeddings
    )

    # Step 4: store incident (always store)
    PAST_INCIDENTS.append(new_incident)

    return {"duplicate": duplicate_flag}
