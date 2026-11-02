"""Create local demonstration users and sample civic records.

Run explicitly: python -m scripts.seed_demo
Never run this against a production database.
"""
from datetime import datetime, timedelta, timezone
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models import User, Department, CivicAsset, Incident, Complaint, ComplaintEvent

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    if db.query(User).count():
        print("Database already contains users. No seed data was changed.")
        raise SystemExit(0)
    departments = [
        Department(name="Water Supply Department", code="WATER", default_sla_hours=24),
        Department(name="Drainage Department", code="DRAIN", default_sla_hours=24),
        Department(name="Roads & Public Works", code="ROADS", default_sla_hours=72),
        Department(name="Solid Waste Management", code="WASTE", default_sla_hours=48),
        Department(name="Electrical & Street Lighting", code="LIGHT", default_sla_hours=48),
        Department(name="Municipal Helpdesk", code="HELP", default_sla_hours=72),
    ]
    db.add_all(departments)
    db.flush()
    users = [
        User(name="Aarav Sharma", email="citizen@jansutra.in", password_hash=hash_password("Citizen@123"), role="citizen", preferred_language="hi", ward="Ward 12"),
        User(name="Meera Verma", email="officer@jansutra.in", password_hash=hash_password("Officer@123"), role="officer", preferred_language="en", ward="Ward 12"),
        User(name="System Administrator", email="admin@jansutra.in", password_hash=hash_password("Admin@123"), role="admin", preferred_language="en"),
    ]
    db.add_all(users)
    db.flush()
    water = next(x for x in departments if x.code == "WATER")
    drain = next(x for x in departments if x.code == "DRAIN")
    db.add_all([
        CivicAsset(asset_code="BPL-W12-WTR-014", name="Ward 12 water distribution segment", asset_type="water", ward="Ward 12", address="Arera Colony, Ward 12", latitude=23.2156, longitude=77.4323, department_id=water.id),
        CivicAsset(asset_code="BPL-W12-DRN-008", name="Main Road storm drain", asset_type="drain", ward="Ward 12", address="Main Road, Ward 12", latitude=23.2181, longitude=77.4294, department_id=drain.id),
    ])
    inc1 = Incident(incident_code="INC-DEMO-1201", title="Water supply interruption — Ward 12", category="Water Supply", department="Water Supply Department", ward="Ward 12", priority="P1", status="in_progress", linked_complaints=2, summary="Two citizen reports indicate a possible local supply interruption. Field inspection requested.", created_at=datetime.now(timezone.utc)-timedelta(hours=8))
    inc2 = Incident(incident_code="INC-DEMO-1202", title="Drainage overflow near Main Road", category="Drainage & Sewerage", department="Drainage Department", ward="Ward 12", priority="P2", status="open", linked_complaints=1, summary="Drainage overflow reported near Main Road. Awaiting department acknowledgement.", created_at=datetime.now(timezone.utc)-timedelta(days=1))
    db.add_all([inc1, inc2])
    db.flush()
    complaints = [
        Complaint(complaint_code="JS-DEMO-1001", citizen_id=users[0].id, incident_id=inc1.id, title="Water supply unavailable since yesterday", description="Hamare area mein kal se paani nahi aa raha hai.", original_language="hinglish", category="Water Supply", department="Water Supply Department", ward="Ward 12", address="Arera Colony, near community park", priority="P1", status="in_progress", confidence=.88, routing_reason="Demo record: water-supply terms matched the Water Supply Department directory.", created_at=datetime.now(timezone.utc)-timedelta(hours=8)),
        Complaint(complaint_code="JS-DEMO-1002", citizen_id=users[0].id, incident_id=inc1.id, title="Low water pressure", description="There is very low water pressure in our lane.", original_language="en", category="Water Supply", department="Water Supply Department", ward="Ward 12", address="Arera Colony, Ward 12", priority="P2", status="acknowledged", confidence=.82, routing_reason="Demo record: water-supply terms matched the department directory.", created_at=datetime.now(timezone.utc)-timedelta(hours=7)),
        Complaint(complaint_code="JS-DEMO-1003", citizen_id=users[0].id, incident_id=inc2.id, title="Drainage water overflowing onto road", description="Naali ka paani sadak par aa raha hai.", original_language="hi", category="Drainage & Sewerage", department="Drainage Department", ward="Ward 12", address="Main Road, Ward 12", priority="P2", status="submitted", confidence=.85, routing_reason="Demo record: drainage terms matched the Drainage Department directory.", created_at=datetime.now(timezone.utc)-timedelta(days=1)),
    ]
    db.add_all(complaints)
    db.flush()
    for c in complaints:
        db.add(ComplaintEvent(complaint_id=c.id, actor_id=users[0].id, event_type="submitted", note="Demonstration record. Not an actual government complaint."))
    db.commit()
    print("Demo data created. Credentials: citizen@jansutra.in / Citizen@123; officer@jansutra.in / Officer@123; admin@jansutra.in / Admin@123")
finally:
    db.close()
