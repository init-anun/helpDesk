from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from schemas.voucher_sub_detail import (
    VoucherSubDetailCreate,
    VoucherSubDetailResponse,
)


class VoucherDetailCreate(BaseModel):
    line_no: int

    account_code: str
    account_name: str

    description: str | None = None

    debit: Decimal = 0
    credit: Decimal = 0

    sub_details: list[VoucherSubDetailCreate] = []


class VoucherDetailResponse(BaseModel):
    id: int
    transaction_id: int

    line_no: int

    account_code: str
    account_name: str
    description: str | None

    debit: Decimal
    credit: Decimal

    sub_details: list[VoucherSubDetailResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )