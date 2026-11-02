from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.core.security import hash_password
from app.models import User


def test_complaint_lifecycle_and_role_access():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        session = TestingSession()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestingSession() as session:
        session.add_all([
            User(name="Test Citizen", email="citizen@example.com", password_hash=hash_password("CitizenTest@123"), role="citizen", ward="Ward 12"),
            User(name="Test Officer", email="officer@example.com", password_hash=hash_password("OfficerTest@123"), role="officer", ward="Ward 12"),
        ])
        session.commit()

    try:
        with TestClient(app) as client:
            registered = client.post("/api/v1/auth/register", json={
                "name": "New Citizen", "email": "newcitizen@example.com", "password": "StrongPass123",
                "preferred_language": "hi", "ward": "Ward 10"
            })
            assert registered.status_code == 201
            assert registered.json()["user"]["role"] == "citizen"
            assert client.post("/api/v1/auth/register", json={
                "name": "New Citizen", "email": "newcitizen@example.com", "password": "StrongPass123",
                "preferred_language": "hi", "ward": "Ward 10"
            }).status_code == 409

            citizen_login = client.post("/api/v1/auth/login", json={"email": "citizen@example.com", "password": "CitizenTest@123"})
            assert citizen_login.status_code == 200
            citizen_headers = {"Authorization": f"Bearer {citizen_login.json()['access_token']}"}

            triage = client.post("/api/v1/assistant/triage", headers=citizen_headers, json={
                "message": "Hamare area mein paani nahi aa raha hai", "language": "hi"
            })
            assert triage.status_code == 200
            assert triage.json()["analysis"]["category"] == "Water Supply"
            assert "वार्ड" in triage.json()["assistant_reply"]

            created = client.post("/api/v1/complaints", headers=citizen_headers, json={
                "description": "Hamare area mein paani nahi aa raha hai",
                "ward": "Ward 12", "address": "Test Lane, Ward 12", "language": "hinglish"
            })
            assert created.status_code == 201
            body = created.json()
            assert body["category"] == "Water Supply"
            assert body["complaint_code"].startswith("JS-")

            second = client.post("/api/v1/complaints", headers=citizen_headers, json={
                "description": "No water supply in my lane since morning",
                "ward": "Ward 12", "address": "Another lane, Ward 12", "language": "en"
            })
            assert second.status_code == 201
            assert second.json()["incident_id"] == body["incident_id"]

            # Citizens cannot access the municipal incident register.
            assert client.get("/api/v1/incidents", headers=citizen_headers).status_code == 403

            officer_login = client.post("/api/v1/auth/login", json={"email": "officer@example.com", "password": "OfficerTest@123"})
            officer_headers = {"Authorization": f"Bearer {officer_login.json()['access_token']}"}
            updated = client.patch(f"/api/v1/complaints/{body['id']}/status", headers=officer_headers, json={"status": "resolved", "note": "Field work completed"})
            assert updated.status_code == 200
            assert updated.json()["status"] == "resolved"

            verified = client.post(f"/api/v1/complaints/{body['id']}/verify", headers=citizen_headers, json={"result": "confirmed", "note": "Service restored"})
            assert verified.status_code == 200
            assert verified.json()["status"] == "closed"
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()
