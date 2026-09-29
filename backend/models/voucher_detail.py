from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Integer,
    SmallInteger,
    Numeric,
    String,
    Text,
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


class VoucherDetail(Base):
    __tablename__ = "voucher_details"

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

    chart_of_account_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    serial_no: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    particulars: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

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

    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ---------------------------------------------------------
    # Audit
    # ---------------------------------------------------------

    created_by: Mapped[str | None] = mapped_column(
        String(250),
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
        back_populates="voucher_details",
    )