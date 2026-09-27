from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class VoucherSubDetailCreate(BaseModel):
    item_code: str | None = None
    item_name: str
    description: str | None = None

    quantity: Decimal = 1
    rate: Decimal = 0
    discount: Decimal = 0

    tax_rate: Decimal = 0


class VoucherSubDetailUpdate(BaseModel):
    item_code: str | None = None
    item_name: str | None = None
    description: str | None = None

    quantity: Decimal | None = None
    rate: Decimal | None = None
    discount: Decimal | None = None

    tax_rate: Decimal | None = None


class VoucherSubDetailResponse(BaseModel):
    id: int
    voucher_detail_id: int

    item_code: str | None
    item_name: str
    description: str | None

    quantity: Decimal
    rate: Decimal
    discount: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    amount: Decimal

    model_config = ConfigDict(
        from_attributes=True
    )