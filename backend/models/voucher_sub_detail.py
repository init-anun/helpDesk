from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Integer,
    SmallInteger,
    Numeric,
    String,
    ForeignKey,
    DateTime,
    CHAR,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from db.database import Base


class VoucherSubDetail(Base):
    __tablename__ = "voucher_sub_details"

    # ---------------------------------------------------------
    # Primary Key
    # ---------------------------------------------------------

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    # ---------------------------------------------------------
    # Master Transaction
    # ---------------------------------------------------------

    master_transaction_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "master_transactions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ---------------------------------------------------------
    # Accounting
    # ---------------------------------------------------------

    serial_no: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    chart_of_account_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True,
    )

    sub_account_id: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
        index=True,
    )

    # ---------------------------------------------------------
    # Item
    # ---------------------------------------------------------

    item_description: Mapped[str | None] = mapped_column(
        String(250),
        nullable=True,
    )

    quantity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    unit_price: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    # ---------------------------------------------------------
    # Tax
    # ---------------------------------------------------------

    tax: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    tax_rate: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    # ---------------------------------------------------------
    # Transaction
    # ---------------------------------------------------------

    tr_code: Mapped[str | None] = mapped_column(
        CHAR(2),
        nullable=True,
    )

    dr_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    cr_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    # ---------------------------------------------------------
    # Audit
    # ---------------------------------------------------------

    created_by: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    discount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    line_item: Mapped[int | None] = mapped_column(
        SmallInteger,
        nullable=True,
    )

    updated_by: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # ---------------------------------------------------------
    # Relationship
    # ---------------------------------------------------------

    transaction = relationship(
        "MasterTransaction",
        back_populates="voucher_sub_details",
    )