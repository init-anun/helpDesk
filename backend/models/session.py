from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class SessionType(str, Enum):
    INITIAL_ASSESSMENT = "initial_assessment"
    INDIVIDUAL = "individual"
    COUPLES = "couples"
    FAMILY = "family"
    GROUP = "group"
    FOLLOW_UP = "follow_up"
    CRISIS = "crisis"


class SessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class SessionMode(str, Enum):
    IN_PERSON = "in_person"
    TELEHEALTH = "telehealth"
    PHONE = "phone"


class TherapySession(Base):
    __tablename__ = "therapy_sessions"

    # =========================================================
    # PRIMARY KEY
    # =========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # =========================================================
    # PARTICIPANTS
    #
    # Both patient and therapist are SubAccounts.
    # No relationships are added to SubAccount.
    # =========================================================

    patient_id: Mapped[int] = mapped_column(
        ForeignKey(
            "sub_accounts.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    therapist_id: Mapped[int] = mapped_column(
        ForeignKey(
            "sub_accounts.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    # =========================================================
    # SESSION INFORMATION
    # =========================================================

    session_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    duration_minutes: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    session_type: Mapped[SessionType] = mapped_column(
        SQLEnum(SessionType),
        nullable=False,
        default=SessionType.INDIVIDUAL,
        index=True,
    )

    status: Mapped[SessionStatus] = mapped_column(
        SQLEnum(SessionStatus),
        nullable=False,
        default=SessionStatus.SCHEDULED,
        index=True,
    )

    mode: Mapped[SessionMode] = mapped_column(
        SQLEnum(SessionMode),
        nullable=False,
        default=SessionMode.IN_PERSON,
    )

    # =========================================================
    # CLINICAL INFORMATION
    # =========================================================

    presenting_concerns: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    session_goals: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    interventions: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    client_response: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    progress_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    clinical_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    risk_assessment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommendations: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    homework: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # =========================================================
    # FOLLOW-UP
    # =========================================================

    follow_up_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    next_session_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # =========================================================
    # CANCELLATION
    # =========================================================

    cancellation_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # =========================================================
    # ADDITIONAL THERAPIST NOTES
    # =========================================================

    therapist_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # =========================================================
    # AUDIT
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )