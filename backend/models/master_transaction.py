from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    String,
    Integer,
    Date,
    DateTime,
    Numeric,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base


class MasterTransaction(Base):
    __tablename__ = "master_transactions"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    organization_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )

    voucher_no: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    voucher_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    voucher_due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    ref_voucher_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    ref_voucher_no: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    receipt_no: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    manual_no: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    master_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    terms_conditions: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    payment_mode: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    payment_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    cheque_details: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    voucher_details: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    voucher_template_id: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    created_by: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    approved_by: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    approved_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    checked_by: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    checked_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    deleted_by: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    deleted_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    status: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )

    financial_year_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )

    master_acc_code: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    payment_month_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # -----------------------------------------------------
    # Relationships
    # -----------------------------------------------------

    voucher_details = relationship(
        "VoucherDetail",
        back_populates="transaction",
        cascade="all, delete-orphan",
    )

    voucher_sub_details = relationship(
        "VoucherSubDetail",
        back_populates="transaction",
        cascade="all, delete-orphan",
    )