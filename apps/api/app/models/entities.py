from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


def now_utc():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(140))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(24), default="citizen")
    preferred_language: Mapped[str] = mapped_column(String(24), default="en")
    ward: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class Department(Base):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(140), unique=True)
    code: Mapped[str] = mapped_column(String(24), unique=True)
    contact_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    default_sla_hours: Mapped[int] = mapped_column(Integer, default=72)


class CivicAsset(Base):
    __tablename__ = "civic_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    asset_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(180))
    asset_type: Mapped[str] = mapped_column(String(60), index=True)
    ward: Mapped[str] = mapped_column(String(80), index=True)
    address: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)


class Incident(Base):
    __tablename__ = "master_incidents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(220))
    category: Mapped[str] = mapped_column(String(80), index=True)
    department: Mapped[str] = mapped_column(String(140))
    ward: Mapped[str] = mapped_column(String(80), index=True)
    priority: Mapped[str] = mapped_column(String(8), default="P2")
    status: Mapped[str] = mapped_column(String(40), default="open", index=True)
    linked_complaints: Mapped[int] = mapped_column(Integer, default=0)
    summary: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)


class Complaint(Base):
    __tablename__ = "complaints"
    __table_args__ = (Index("ix_complaint_ward_category", "ward", "category"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    complaint_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    citizen_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    incident_id: Mapped[int | None] = mapped_column(ForeignKey("master_incidents.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(220))
    description: Mapped[str] = mapped_column(Text)
    original_language: Mapped[str] = mapped_column(String(24), default="en")
    category: Mapped[str] = mapped_column(String(80), index=True)
    department: Mapped[str] = mapped_column(String(140))
    ward: Mapped[str] = mapped_column(String(80), index=True)
    address: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    priority: Mapped[str] = mapped_column(String(8), default="P2")
    status: Mapped[str] = mapped_column(String(40), default="submitted", index=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    routing_reason: Mapped[str] = mapped_column(Text, default="")
    assigned_to: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    resolution_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    citizen_verification: Mapped[str] = mapped_column(String(24), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)


class ComplaintEvent(Base):
    __tablename__ = "complaint_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    complaint_id: Mapped[int] = mapped_column(ForeignKey("complaints.id", ondelete="CASCADE"), index=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(String(60))
    note: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
