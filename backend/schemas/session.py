from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from models.session import (
    SessionMode,
    SessionStatus,
    SessionType,
)


class SessionBase(BaseModel):
    patient_id: int

    therapist_id: int

    session_date: datetime

    duration_minutes: int | None = Field(
        default=None,
        ge=1,
        le=1440,
    )

    session_type: SessionType = (
        SessionType.INDIVIDUAL
    )

    status: SessionStatus = (
        SessionStatus.SCHEDULED
    )

    mode: SessionMode = (
        SessionMode.IN_PERSON
    )

    # ---------------------------------------------------------
    # Clinical information
    # ---------------------------------------------------------

    presenting_concerns: str | None = None

    session_goals: str | None = None

    interventions: str | None = None

    client_response: str | None = None

    progress_notes: str | None = None

    clinical_notes: str | None = None

    risk_assessment: str | None = None

    recommendations: str | None = None

    homework: str | None = None

    # ---------------------------------------------------------
    # Follow-up
    # ---------------------------------------------------------

    follow_up_required: bool = False

    next_session_date: datetime | None = None

    # ---------------------------------------------------------
    # Cancellation
    # ---------------------------------------------------------

    cancellation_reason: str | None = None

    # ---------------------------------------------------------
    # Additional notes
    # ---------------------------------------------------------

    therapist_notes: str | None = None

    @model_validator(mode="after")
    def validate_session(self):

        if (
            self.status == SessionStatus.CANCELLED
            and not self.cancellation_reason
        ):
            raise ValueError(
                "cancellation_reason is required "
                "when session is cancelled"
            )

        if (
            self.follow_up_required
            and not self.next_session_date
        ):
            raise ValueError(
                "next_session_date is required "
                "when follow_up_required is true"
            )

        if self.patient_id == self.therapist_id:
            raise ValueError(
                "patient_id and therapist_id "
                "cannot be the same"
            )

        return self


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    patient_id: int | None = None

    therapist_id: int | None = None

    session_date: datetime | None = None

    duration_minutes: int | None = Field(
        default=None,
        ge=1,
        le=1440,
    )

    session_type: SessionType | None = None

    status: SessionStatus | None = None

    mode: SessionMode | None = None

    presenting_concerns: str | None = None

    session_goals: str | None = None

    interventions: str | None = None

    client_response: str | None = None

    progress_notes: str | None = None

    clinical_notes: str | None = None

    risk_assessment: str | None = None

    recommendations: str | None = None

    homework: str | None = None

    follow_up_required: bool | None = None

    next_session_date: datetime | None = None

    cancellation_reason: str | None = None

    therapist_notes: str | None = None


class SessionResponse(BaseModel):
    id: int

    patient_id: int

    therapist_id: int

    session_date: datetime

    duration_minutes: int | None

    session_type: SessionType

    status: SessionStatus

    mode: SessionMode

    presenting_concerns: str | None

    session_goals: str | None

    interventions: str | None

    client_response: str | None

    progress_notes: str | None

    clinical_notes: str | None

    risk_assessment: str | None

    recommendations: str | None

    homework: str | None

    follow_up_required: bool

    next_session_date: datetime | None

    cancellation_reason: str | None

    therapist_notes: str | None

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True


class SessionListResponse(BaseModel):
    items: list[SessionResponse]

    total: int

    page: int

    page_size: int

    pages: int