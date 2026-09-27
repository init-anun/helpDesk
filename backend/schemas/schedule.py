from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ScheduleCreate(BaseModel):
    patient_id: int
    therapist_id: int
    scheduled_at: datetime
    duration_minutes: int = 60
    type: str
    notes: str | None = None
    status: str = "scheduled"


class ScheduleUpdate(BaseModel):
    patient_id: int | None = None
    therapist_id: int | None = None
    scheduled_at: datetime | None = None
    duration_minutes: int | None = None
    type: str | None = None
    notes: str | None = None
    status: str | None = None


class ScheduleResponse(BaseModel):
    id: int
    patient_id: int
    therapist_id: int
    scheduled_at: datetime
    duration_minutes: int
    type: str
    notes: str | None
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )