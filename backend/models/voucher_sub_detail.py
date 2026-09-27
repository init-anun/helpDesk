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


class VoucherSubDetail(Base):
    __tablename__ = "voucher_sub_details"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    voucher_detail_id: Mapped[int] = mapped_column(
        ForeignKey(
            "voucher_details.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    item_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    item_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=1,
        nullable=False
    )

    rate: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    discount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    tax_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=0,
        nullable=False
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    voucher_detail = relationship(
        "VoucherDetail",
        back_populates="sub_details"
    )