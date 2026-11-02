"""Transparent baseline civic-intelligence pipeline.

This deterministic baseline is intentionally explainable. A trained model can be
loaded later without changing the API contract; see training/train_classifier.py.
It is not a substitute for verified jurisdiction data or human review.
"""
from __future__ import annotations
import re
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import Any

CATEGORY_RULES: dict[str, dict[str, Any]] = {
    "Water Supply": {
        "department": "Water Supply Department", "asset": "water",
        "terms": ["water", "paani", "पानी", "nal", "नल", "supply", "pipeline", "leak", "leakage", "contaminated", "गंदा पानी", "jal"]
    },
    "Drainage & Sewerage": {
        "department": "Drainage Department", "asset": "drain",
        "terms": ["drain", "drainage", "naali", "नाली", "sewage", "sewer", "overflow", "जलभराव", "gutter", "blockage"]
    },
    "Roads & Potholes": {
        "department": "Roads & Public Works", "asset": "road",
        "terms": ["road", "pothole", "गड्ढा", "sadak", "सड़क", "footpath", "crack", "broken road"]
    },
    "Waste Management": {
        "department": "Solid Waste Management", "asset": "waste",
        "terms": ["garbage", "kachra", "कचरा", "waste", "bin", "rubbish", "litter", "dump"]
    },
    "Street Lighting": {
        "department": "Electrical & Street Lighting", "asset": "light",
        "terms": ["streetlight", "street light", "light not working", "street lamp", "अंधेरा", "light band", "bulb", "lamp"]
    },
    "Electricity": {
        "department": "Electrical Services", "asset": "electricity",
        "terms": ["electricity", "power cut", "bijli", "बिजली", "transformer", "wire", "current"]
    },
    "Public Infrastructure": {
        "department": "Public Infrastructure Department", "asset": "public asset",
        "terms": ["park", "public toilet", "school building", "bench", "playground", "public property"]
    },
}

HINDI_TERMS = ["पानी", "नाली", "सड़क", "गड्ढा", "कचरा", "बिजली", "जलभराव", "अंधेरा", "शिकायत"]
HINGLISH_TERMS = ["paani", "hamare", "hamara", "yahan", "nahi", "nahi aa", "band hai", "sadak", "kachra", "naali", "bijli"]
URGENT_TERMS = ["danger", "dangerous", "accident", "electrocution", "fire", "injury", "school", "hospital", "flood", "सेफ्टी", "खतरा", "बच्चे", "बच्चों"]


def detect_language(text: str) -> str:
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    lowered = text.lower()
    if any(term in lowered for term in HINGLISH_TERMS):
        return "hinglish"
    return "en"


def classify_complaint(text: str) -> dict[str, Any]:
    from app.services.ml_model import predict_category
    lowered = text.lower()
    scores: list[tuple[int, str]] = []
    for category, data in CATEGORY_RULES.items():
        hits = sum(1 for term in data["terms"] if term.lower() in lowered)
        if category == "Drainage & Sewerage" and any(t in lowered for t in ["नाली", "naali", "drain", "sewer", "sewage", "overflow"]):
            hits += 2  # Prefer the explicit drainage entity in phrases such as “naali ka paani”.
        scores.append((hits, category))
    scores.sort(reverse=True)
    hits, category = scores[0]
    model_prediction = predict_category(text)
    if hits == 0 and model_prediction and model_prediction[0] in CATEGORY_RULES and model_prediction[1] >= 0.58:
        category = model_prediction[0]
        department = CATEGORY_RULES[category]["department"]
        confidence = min(0.78, model_prediction[1])
        reason = "The optional trained text model suggested this category. Human review is recommended because the keyword rules found no strong signal."
    elif hits == 0:
        category = "General Civic Issue"
        department = "Municipal Helpdesk"
        confidence = 0.36
        reason = "No strong category signal was found. Routed to the municipal helpdesk for human triage."
    else:
        department = CATEGORY_RULES[category]["department"]
        confidence = min(0.94, 0.58 + (hits * 0.10))
        reason = f"Matched {hits} civic-language signal(s) for {category}. Department suggestion is based on the configured routing directory."
    urgent = any(term in lowered for term in URGENT_TERMS)
    priority = "P1" if urgent else ("P2" if hits > 0 else "P3")
    return {
        "category": category,
        "department": department,
        "language": detect_language(text),
        "confidence": round(confidence, 2),
        "priority": priority,
        "routing_reason": reason,
        "model_type": "hybrid-rules-and-optional-tfidf-model" if model_prediction else "explainable-rules-baseline",
        "ml_suggestion": ({"category": model_prediction[0], "confidence": round(model_prediction[1], 3)} if model_prediction else None),
    }


def find_related_incident(db, category: str, ward: str):
    """Conservative starter rule: same category + same ward + open incident.

    Production deployments should replace this with semantic, spatial and temporal
    matching backed by reviewed labels. No automatic merge occurs across wards.
    """
    from app.models import Incident
    if category == "General Civic Issue":
        return None
    cutoff = datetime.now(timezone.utc) - timedelta(days=14)
    return db.query(Incident).filter(
        Incident.category == category,
        Incident.ward == ward,
        Incident.created_at >= cutoff,
        Incident.status.in_(["open", "investigating", "in_progress"]),
    ).order_by(Incident.created_at.desc()).first()
