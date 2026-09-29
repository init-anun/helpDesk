from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class SubAccount(Base):
    __tablename__ = "sub_accounts"

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

    account_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True
    )

    # Patient-specific fields

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

    patient_schedules = relationship(
        "Schedule",
        foreign_keys="Schedule.patient_id",
        back_populates="patient",
    )

    therapist_schedules = relationship(
        "Schedule",
        foreign_keys="Schedule.therapist_id",
        back_populates="therapist",
    )