from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class Therapist(Base):
    __tablename__ = "therapists"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    patients = relationship(
        "Patient",
        back_populates="therapist"
    )

    schedules = relationship(
        "Schedule",
        back_populates="therapist"
    )