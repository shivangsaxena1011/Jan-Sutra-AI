from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    role: str
    preferred_language: str
    ward: str | None = None


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=140)
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    preferred_language: str = Field(default="en", pattern="^(en|hi|hinglish)$")
    ward: str = Field(min_length=2, max_length=80)

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if not any(ch.islower() for ch in value) or not any(ch.isupper() for ch in value) or not any(ch.isdigit() for ch in value):
            raise ValueError("Password must include an uppercase letter, lowercase letter and number")
        return value


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TriageInput(BaseModel):
    message: str = Field(min_length=12, max_length=5000)
    language: str | None = Field(default=None, pattern="^(en|hi|hinglish|auto)$")


class ComplaintCreate(BaseModel):
    description: str = Field(min_length=12, max_length=5000)
    title: str | None = Field(default=None, max_length=220)
    ward: str = Field(min_length=2, max_length=80)
    address: str = Field(min_length=4, max_length=255)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    language: str | None = Field(default=None, max_length=24)


class StatusUpdate(BaseModel):
    status: str
    note: str = Field(default="", max_length=2000)


class VerificationInput(BaseModel):
    result: str = Field(pattern="^(confirmed|disputed|partial)$")
    note: str = Field(default="", max_length=2000)


class ComplaintOut(BaseModel):
    id: int
    complaint_code: str
    incident_id: int | None
    title: str
    description: str
    original_language: str
    category: str
    department: str
    ward: str
    address: str
    priority: str
    status: str
    confidence: float
    routing_reason: str
    citizen_verification: str
    resolution_note: str | None
    created_at: datetime
    updated_at: datetime
    citizen_name: str | None = None


class IncidentOut(BaseModel):
    id: int
    incident_code: str
    title: str
    category: str
    department: str
    ward: str
    priority: str
    status: str
    linked_complaints: int
    summary: str
    created_at: datetime
    updated_at: datetime
