from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal, Optional

from priority_llm_classifier import classify_priority


app = FastAPI(
    title="Incident Priority Service",
    description="ML-based incident priority classification",
    version="1.0"
)


# -------------------------
# Request Schema
# -------------------------

class PriorityRequest(BaseModel):
    incident_id: str
    incident_type: str
    description: str

    # Accept either naming from backend
    report_count: Optional[int] = None
    duplicates: Optional[int] = None

    image_attached: bool
    time_since_report_minutes: int


# -------------------------
# Response Schema
# -------------------------

class PriorityResponse(BaseModel):
    incident_id: str
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    confidence: float
    reason: str
    method: Literal["HARD_RULE", "LLM"]


# -------------------------
# API Endpoint
# -------------------------

@app.post("/priority/classify", response_model=PriorityResponse)
def classify_incident(payload: PriorityRequest):
    data = payload.dict()

    # -------------------------
    # 🔁 MAPPING LOGIC
    # -------------------------
    # Prefer report_count, fallback to duplicates
    if data.get("report_count") is None:
        data["report_count"] = data.get("duplicate", 1)

    # Safety clamp (must be >= 1)
    if data["report_count"] < 1:
        data["report_count"] = 1

    # Remove duplicate key before ML (clean input)
    data.pop("duplicate", None)

    result = classify_priority(data)
    return result
