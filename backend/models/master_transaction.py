from datetime import date
from decimal import Decimal

from sqlalchemy import (
    String,
    Integer,
    Date,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from db.database import Base


class MasterTransaction(Base):
    __tablename__ = "master_transactions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    invoice_no: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    transaction_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    patient_id: Mapped[int | None] = mapped_column(
        ForeignKey("patients.id"),
        nullable=True
    )

    therapist_id: Mapped[int | None] = mapped_column(
        ForeignKey("therapists.id"),
        nullable=True
    )

    voucher_type: Mapped[str] = mapped_column(
        String(30),
        default="invoice",
        nullable=False
    )

    reference_no: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    discount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    tax: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    total: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    paid_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    balance_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="unpaid",
        nullable=False
    )

    payment_method: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    patient = relationship(
        "Patient"
    )

    therapist = relationship(
        "Therapist"
    )

    voucher_details = relationship(
        "VoucherDetail",
        back_populates="transaction",
        cascade="all, delete-orphan"
    )