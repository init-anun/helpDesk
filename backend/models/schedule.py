from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False
    )

    therapist_id: Mapped[int] = mapped_column(
        ForeignKey("therapists.id"),
        nullable=False
    )

    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=60,
        nullable=False
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="scheduled",
        nullable=False
    )

    patient = relationship(
        "Patient",
        back_populates="schedules"
    )

    therapist = relationship(
        "Therapist",
        back_populates="schedules"
    )