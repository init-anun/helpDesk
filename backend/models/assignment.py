from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    patient_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("sub_accounts.id"),
        nullable=False
    )

    therapist_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("sub_accounts.id"),
        nullable=False
    )

    # session_id: Mapped[int] = mapped_column(
    #     Integer,
    #     ForeignKey("sessions.id"),
    #     nullable=False
    # )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False
    )

    created_at: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    updated_at: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
