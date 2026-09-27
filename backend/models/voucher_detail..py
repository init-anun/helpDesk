from decimal import Decimal

from sqlalchemy import (
    String,
    Integer,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from db.database import Base


class VoucherDetail(Base):
    __tablename__ = "voucher_details"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    transaction_id: Mapped[int] = mapped_column(
        ForeignKey(
            "master_transactions.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    line_no: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    account_code: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    account_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    debit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    credit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    transaction = relationship(
        "MasterTransaction",
        back_populates="voucher_details"
    )

    sub_details = relationship(
        "VoucherSubDetail",
        back_populates="voucher_detail",
        cascade="all, delete-orphan"
    )