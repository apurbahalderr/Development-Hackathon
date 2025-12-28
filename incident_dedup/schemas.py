from pydantic import BaseModel
from typing import List
from datetime import datetime


class NewImage(BaseModel):
    image_id: str
    image_url: str
    latitude: float
    longitude: float
    timestamp: datetime


class CandidateImage(BaseModel):
    image_id: str
    incident_id: str
    image_url: str
    latitude: float
    longitude: float
    timestamp: datetime


class DeduplicationRequest(BaseModel):
    new_image: NewImage
    candidate_images: List[CandidateImage]


class ImageMatch(BaseModel):
    image_id: str
    incident_id: str
    similarity_score: float
    decision: str


class DeduplicationResponse(BaseModel):
    image_matches: List[ImageMatch]
