from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_current_user, get_optional_user, require_roles
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, hash_password
from app.models import User, Complaint, ComplaintEvent, Incident, Department
from app.schemas.api import LoginInput, LoginOut, RegisterInput, UserOut, ComplaintCreate, TriageInput, StatusUpdate, VerificationInput
from app.services.intelligence import classify_complaint, find_related_incident

router = APIRouter()


def code(prefix: str) -> str:
    return f"{prefix}-{datetime.now(timezone.utc):%y%m%d}-{uuid4().hex[:6].upper()}"


def complaint_payload(item: Complaint, db: Session):
    citizen = db.get(User, item.citizen_id)
    return {
        "id": item.id, "complaint_code": item.complaint_code, "incident_id": item.incident_id,
        "title": item.title, "description": item.description, "original_language": item.original_language,
        "category": item.category, "department": item.department, "ward": item.ward,
        "address": item.address, "priority": item.priority, "status": item.status,
        "confidence": item.confidence, "routing_reason": item.routing_reason,
        "citizen_verification": item.citizen_verification, "resolution_note": item.resolution_note,
        "created_at": item.created_at, "updated_at": item.updated_at,
        "citizen_name": citizen.name if citizen else None,
    }


@router.post("/auth/login", response_model=LoginOut)
def login(payload: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    return {"access_token": create_access_token(str(user.id)), "user": user}


@router.post("/auth/register", response_model=LoginOut, status_code=201)
def register(payload: RegisterInput, db: Session = Depends(get_db)):
    existing = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(
        name=payload.name.strip(), email=payload.email.lower(), password_hash=hash_password(payload.password),
        role="citizen", preferred_language=payload.preferred_language, ward=payload.ward,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(str(user.id)), "user": user}


@router.get("/auth/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.get("/departments")
def departments(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    rows = db.query(Department).order_by(Department.name).all()
    return [{"id": x.id, "name": x.name, "code": x.code, "default_sla_hours": x.default_sla_hours} for x in rows]


@router.post("/assistant/triage")
def assistant_triage(payload: TriageInput, _user: User | None = Depends(get_optional_user)):
    analysis = classify_complaint(payload.message)
    language = analysis["language"] if not payload.language or payload.language == "auto" else payload.language
    replies = {
        "hi": f"मैंने आपकी बात समझ ली। यह समस्या सम्भवतः {analysis['category']} से जुड़ी है। कृपया बताएं कि समस्या कहाँ है — इलाका, सड़क या नज़दीकी लैंडमार्क और वार्ड बताएं।",
        "hinglish": f"Samajh gaya. Ye issue likely {analysis['category']} se related hai. Ab location batayein — area, street ya nearby landmark aur ward number.",
        "en": f"Thanks, I have understood the report. It appears related to {analysis['category']}. Where is the issue located? Share the locality, street or a nearby landmark and ward.",
    }
    return {
        "analysis": analysis,
        "language": language,
        "assistant_reply": replies.get(language, replies["en"]),
        "next_step": "location",
        "disclaimer": "Category and department are automated suggestions and may be reviewed by municipal staff.",
    }


@router.post("/complaints", status_code=201)
def create_complaint(payload: ComplaintCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    analysis = classify_complaint(payload.description)
    category = analysis["category"]
    incident = find_related_incident(db, category, payload.ward)
    title = payload.title or f"{category}: {payload.address[:90]}"
    if incident:
        incident.updated_at = datetime.now(timezone.utc)
        if analysis["priority"] == "P1":
            incident.priority = "P1"
    else:
        incident = Incident(
            incident_code=code("INC"), title=title[:220], category=category,
            department=analysis["department"], ward=payload.ward,
            priority=analysis["priority"], status="open", linked_complaints=0,
            summary="Master incident created from a citizen report. Related complaints may be linked after review.",
        )
        db.add(incident)
        db.flush()
    complaint = Complaint(
        complaint_code=code("JS"), citizen_id=user.id, incident_id=incident.id,
        title=title[:220], description=payload.description, original_language=payload.language or analysis["language"],
        category=category, department=analysis["department"], ward=payload.ward,
        address=payload.address, latitude=payload.latitude, longitude=payload.longitude,
        priority=analysis["priority"], status="submitted", confidence=analysis["confidence"],
        routing_reason=analysis["routing_reason"],
    )
    incident.linked_complaints += 1
    db.add(complaint)
    db.flush()
    db.add(ComplaintEvent(complaint_id=complaint.id, actor_id=user.id, event_type="submitted", note="Complaint received and analysed."))
    db.commit()
    db.refresh(complaint)
    response_language = payload.language or analysis["language"]
    localized_ack = {
        "hi": "आपकी शिकायत दर्ज कर ली गई है। संबंधित विभाग को सुझाया गया है। आप अपनी शिकायत की स्थिति यहाँ देख सकते हैं।",
        "hinglish": "Aapki complaint register ho gayi hai. Relevant department ko suggest kiya gaya hai. Aap yahin status track kar sakte hain.",
        "en": "Your report has been received. A department has been suggested, and you can track progress in your workspace.",
    }.get(response_language, "Your report has been received.")
    return complaint_payload(complaint, db) | {"analysis": analysis, "incident_code": incident.incident_code, "citizen_acknowledgement": localized_ack}


@router.get("/complaints")
def list_complaints(
    mine: bool = Query(default=False),
    status_filter: str | None = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=250),
    db: Session = Depends(get_db), user: User = Depends(get_current_user),
):
    query = db.query(Complaint)
    if user.role == "citizen" or mine:
        query = query.filter(Complaint.citizen_id == user.id)
    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    rows = query.order_by(Complaint.created_at.desc()).limit(limit).all()
    return [complaint_payload(row, db) for row in rows]


@router.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.get(Complaint, complaint_id)
    if not item or (user.role == "citizen" and item.citizen_id != user.id):
        raise HTTPException(status_code=404, detail="Complaint not found")
    events = db.query(ComplaintEvent).filter(ComplaintEvent.complaint_id == item.id).order_by(ComplaintEvent.created_at.asc()).all()
    return complaint_payload(item, db) | {"events": [{"event_type": e.event_type, "note": e.note, "created_at": e.created_at} for e in events]}


@router.patch("/complaints/{complaint_id}/status")
def update_status(
    complaint_id: int, payload: StatusUpdate, db: Session = Depends(get_db),
    user: User = Depends(require_roles("officer", "admin")),
):
    allowed = {"acknowledged", "investigating", "in_progress", "resolved", "reopened", "rejected"}
    if payload.status not in allowed:
        raise HTTPException(status_code=422, detail=f"Status must be one of: {', '.join(sorted(allowed))}")
    item = db.get(Complaint, complaint_id)
    if not item:
        raise HTTPException(status_code=404, detail="Complaint not found")
    previous = item.status
    item.status = payload.status
    item.updated_at = datetime.now(timezone.utc)
    if payload.status == "resolved":
        item.resolution_note = payload.note or "Resolution evidence submitted for citizen verification."
        item.citizen_verification = "pending"
    db.add(ComplaintEvent(complaint_id=item.id, actor_id=user.id, event_type="status_changed", note=f"{previous} → {payload.status}. {payload.note}".strip()))
    if item.incident_id:
        incident = db.get(Incident, item.incident_id)
        if incident:
            incident.status = "in_progress" if payload.status not in {"resolved", "rejected"} else "awaiting_verification"
            incident.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return complaint_payload(item, db)


@router.post("/complaints/{complaint_id}/verify")
def verify_resolution(
    complaint_id: int, payload: VerificationInput, db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.get(Complaint, complaint_id)
    if not item or (user.role == "citizen" and item.citizen_id != user.id):
        raise HTTPException(status_code=404, detail="Complaint not found")
    if item.status != "resolved":
        raise HTTPException(status_code=409, detail="This complaint is not awaiting resolution verification")
    item.citizen_verification = payload.result
    if payload.result == "confirmed":
        item.status = "closed"
        event_type = "citizen_confirmed"
    elif payload.result == "disputed":
        item.status = "reopened"
        event_type = "citizen_disputed"
    else:
        item.status = "in_progress"
        event_type = "partial_resolution"
    item.updated_at = datetime.now(timezone.utc)
    db.add(ComplaintEvent(complaint_id=item.id, actor_id=user.id, event_type=event_type, note=payload.note))
    if item.incident_id:
        incident = db.get(Incident, item.incident_id)
        if incident:
            # Incident closes only when every linked complaint has been citizen-confirmed.
            linked = db.query(Complaint).filter(Complaint.incident_id == incident.id).all()
            incident.status = "closed" if linked and all(c.id == item.id and item.status == "closed" or c.status == "closed" for c in linked) else "open"
            incident.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return complaint_payload(item, db)


@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db), _user: User = Depends(require_roles("officer", "admin"))):
    rows = db.query(Incident).order_by(Incident.updated_at.desc()).limit(150).all()
    return [{
        "id": x.id, "incident_code": x.incident_code, "title": x.title, "category": x.category,
        "department": x.department, "ward": x.ward, "priority": x.priority, "status": x.status,
        "linked_complaints": x.linked_complaints, "summary": x.summary,
        "created_at": x.created_at, "updated_at": x.updated_at,
    } for x in rows]


@router.get("/analytics/overview")
def analytics(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    complaint_q = db.query(Complaint)
    incident_q = db.query(Incident)
    if user.role == "citizen":
        complaint_q = complaint_q.filter(Complaint.citizen_id == user.id)
        complaint_total = complaint_q.count()
        return {
            "total_complaints": complaint_total,
            "active_complaints": complaint_q.filter(Complaint.status.notin_(["closed", "rejected"])).count(),
            "awaiting_verification": complaint_q.filter(Complaint.status == "resolved").count(),
            "closed_complaints": complaint_q.filter(Complaint.status == "closed").count(),
        }
    total = complaint_q.count()
    active = complaint_q.filter(Complaint.status.notin_(["closed", "rejected"])).count()
    resolved = complaint_q.filter(Complaint.status.in_(["resolved", "closed"])).count()
    disputed = complaint_q.filter(Complaint.citizen_verification == "disputed").count()
    return {
        "total_complaints": total,
        "active_complaints": active,
        "resolved_complaints": resolved,
        "resolution_rate": round((resolved / total) * 100, 1) if total else 0,
        "open_incidents": incident_q.filter(Incident.status.notin_(["closed", "rejected"])).count(),
        "disputed_resolutions": disputed,
        "priority_one": complaint_q.filter(Complaint.priority == "P1", Complaint.status.notin_(["closed", "rejected"])).count(),
    }
