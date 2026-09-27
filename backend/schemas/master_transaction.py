from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from schemas.voucher_detail import (
    VoucherDetailCreate,
    VoucherDetailResponse,
)


class MasterTransactionCreate(BaseModel):

    invoice_no: str

    transaction_date: date

    due_date: date | None = None

    patient_id: int | None = None

    therapist_id: int | None = None

    voucher_type: str = "invoice"

    reference_no: str | None = None

    discount: Decimal = 0

    tax: Decimal = 0

    paid_amount: Decimal = 0

    payment_method: str | None = None

    notes: str | None = None

    voucher_details: list[VoucherDetailCreate] = []


class MasterTransactionUpdate(BaseModel):

    transaction_date: date | None = None

    due_date: date | None = None

    patient_id: int | None = None

    therapist_id: int | None = None

    reference_no: str | None = None

    discount: Decimal | None = None

    tax: Decimal | None = None

    paid_amount: Decimal | None = None

    status: str | None = None

    payment_method: str | None = None

    notes: str | None = None


class MasterTransactionResponse(BaseModel):

    id: int

    invoice_no: str

    transaction_date: date

    due_date: date | None

    patient_id: int | None
    therapist_id: int | None

    voucher_type: str
    reference_no: str | None

    subtotal: Decimal
    discount: Decimal
    tax: Decimal

    total: Decimal
    paid_amount: Decimal
    balance_amount: Decimal

    status: str
    payment_method: str | None
    notes: str | None

    voucher_details: list[VoucherDetailResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )