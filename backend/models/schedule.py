from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from db.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey(
            "sub_accounts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    therapist_id: Mapped[int] = mapped_column(
        ForeignKey(
            "sub_accounts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=60,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="scheduled",
        index=True,
    )

    patient = relationship(
        "SubAccount",
        foreign_keys=[patient_id],
        back_populates="patient_schedules",
    )

    therapist = relationship(
        "SubAccount",
        foreign_keys=[therapist_id],
        back_populates="therapist_schedules",
    )