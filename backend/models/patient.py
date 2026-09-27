from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    gender: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    address: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    condition: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    package: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="active",
        nullable=False
    )

    therapist_id: Mapped[int | None] = mapped_column(
        ForeignKey("therapists.id"),
        nullable=True
    )

    therapist = relationship(
        "Therapist",
        back_populates="patients"
    )

    schedules = relationship(
        "Schedule",
        back_populates="patient"
    )