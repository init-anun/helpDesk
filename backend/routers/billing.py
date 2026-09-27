from decimal import Decimal, ROUND_HALF_UP

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from db.database import get_db

from models.master_transaction import (
    MasterTransaction,
)

from models.voucher_detail import (
    VoucherDetail,
)

from models.voucher_sub_detail import (
    VoucherSubDetail,
)

from models.patient import Patient
from models.therapist import Therapist

from schemas.master_transaction import (
    MasterTransactionCreate,
    MasterTransactionUpdate,
    MasterTransactionResponse,
)


router = APIRouter(
    prefix="/billing",
    tags=["Billing"]
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def money(value):
    return Decimal(value).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


def calculate_sub_detail(sub_detail):
    quantity = money(sub_detail.quantity)
    rate = money(sub_detail.rate)
    discount = money(sub_detail.discount)

    gross_amount = quantity * rate

    taxable_amount = gross_amount - discount

    if taxable_amount < 0:
        taxable_amount = Decimal("0.00")

    tax_amount = (
        taxable_amount
        * money(sub_detail.tax_rate)
        / Decimal("100")
    )

    amount = taxable_amount + tax_amount

    return {
        "quantity": quantity,
        "rate": rate,
        "discount": discount,
        "tax_rate": money(sub_detail.tax_rate),
        "tax_amount": money(tax_amount),
        "amount": money(amount),
    }


def calculate_transaction(transaction):

    subtotal = Decimal("0.00")

    for detail in transaction.voucher_details:

        for sub_detail in detail.sub_details:

            subtotal += (
                money(sub_detail.quantity)
                * money(sub_detail.rate)
            )

    subtotal = money(subtotal)

    discount = money(transaction.discount)
    tax = money(transaction.tax)

    total = subtotal - discount + tax

    if total < 0:
        total = Decimal("0.00")

    paid = money(transaction.paid_amount)

    balance = total - paid

    if balance < 0:
        balance = Decimal("0.00")

    if paid <= 0:
        status = "unpaid"

    elif paid < total:
        status = "partial"

    else:
        status = "paid"

    return {
        "subtotal": subtotal,
        "discount": discount,
        "tax": tax,
        "total": money(total),
        "paid_amount": paid,
        "balance_amount": money(balance),
        "status": status,
    }


# =========================================================
# CREATE INVOICE
# =========================================================

@router.post(
    "/",
    response_model=MasterTransactionResponse
)
def create_invoice(
    data: MasterTransactionCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------------------
    # Check patient
    # -----------------------------------------

    if data.patient_id is not None:

        patient = db.query(Patient).filter(
            Patient.id == data.patient_id
        ).first()

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

    # -----------------------------------------
    # Check therapist
    # -----------------------------------------

    if data.therapist_id is not None:

        therapist = db.query(Therapist).filter(
            Therapist.id == data.therapist_id
        ).first()

        if not therapist:
            raise HTTPException(
                status_code=404,
                detail="Therapist not found"
            )

    # -----------------------------------------
    # Check duplicate invoice
    # -----------------------------------------

    existing = db.query(
        MasterTransaction
    ).filter(
        MasterTransaction.invoice_no == data.invoice_no
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists"
        )

    # -----------------------------------------
    # Create master
    # -----------------------------------------

    transaction = MasterTransaction(
        invoice_no=data.invoice_no,
        transaction_date=data.transaction_date,
        due_date=data.due_date,

        patient_id=data.patient_id,
        therapist_id=data.therapist_id,

        voucher_type=data.voucher_type,
        reference_no=data.reference_no,

        discount=data.discount,
        tax=data.tax,

        paid_amount=data.paid_amount,

        payment_method=data.payment_method,
        notes=data.notes,
    )

    db.add(transaction)
    db.flush()

    # -----------------------------------------
    # Create details
    # -----------------------------------------

    for detail_data in data.voucher_details:

        detail = VoucherDetail(
            transaction_id=transaction.id,

            line_no=detail_data.line_no,

            account_code=detail_data.account_code,
            account_name=detail_data.account_name,

            description=detail_data.description,

            debit=detail_data.debit,
            credit=detail_data.credit,
        )

        db.add(detail)
        db.flush()

        # -------------------------------------
        # Create sub-details
        # -------------------------------------

        for sub_data in detail_data.sub_details:

            calculated = calculate_sub_detail(
                sub_data
            )

            sub_detail = VoucherSubDetail(
                voucher_detail_id=detail.id,

                item_code=sub_data.item_code,
                item_name=sub_data.item_name,
                description=sub_data.description,

                quantity=calculated["quantity"],
                rate=calculated["rate"],
                discount=calculated["discount"],

                tax_rate=calculated["tax_rate"],
                tax_amount=calculated["tax_amount"],

                amount=calculated["amount"],
            )

            db.add(sub_detail)

    db.flush()

    # -----------------------------------------
    # Calculate totals
    # -----------------------------------------

    totals = calculate_transaction(
        transaction
    )

    transaction.subtotal = totals["subtotal"]
    transaction.discount = totals["discount"]
    transaction.tax = totals["tax"]

    transaction.total = totals["total"]

    transaction.paid_amount = totals["paid_amount"]
    transaction.balance_amount = totals["balance_amount"]

    transaction.status = totals["status"]

    db.commit()
    db.refresh(transaction)

    return transaction


# =========================================================
# GET ALL INVOICES
# =========================================================

@router.get(
    "/",
    response_model=list[MasterTransactionResponse]
)
def get_invoices(
    db: Session = Depends(get_db)
):

    transactions = db.query(
        MasterTransaction
    ).order_by(
        MasterTransaction.id.desc()
    ).all()

    return transactions


# =========================================================
# GET SINGLE INVOICE
# =========================================================

@router.get(
    "/{transaction_id}",
    response_model=MasterTransactionResponse
)
def get_invoice(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = db.query(
        MasterTransaction
    ).filter(
        MasterTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return transaction


# =========================================================
# UPDATE INVOICE
# =========================================================

@router.put(
    "/{transaction_id}",
    response_model=MasterTransactionResponse
)
def update_invoice(
    transaction_id: int,
    data: MasterTransactionUpdate,
    db: Session = Depends(get_db),
):

    transaction = db.query(
        MasterTransaction
    ).filter(
        MasterTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    # -----------------------------------------
    # Validate patient
    # -----------------------------------------

    if "patient_id" in update_data:

        if update_data["patient_id"] is not None:

            patient = db.query(Patient).filter(
                Patient.id == update_data["patient_id"]
            ).first()

            if not patient:
                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )

    # -----------------------------------------
    # Validate therapist
    # -----------------------------------------

    if "therapist_id" in update_data:

        if update_data["therapist_id"] is not None:

            therapist = db.query(Therapist).filter(
                Therapist.id == update_data["therapist_id"]
            ).first()

            if not therapist:
                raise HTTPException(
                    status_code=404,
                    detail="Therapist not found"
                )

    # -----------------------------------------
    # Update
    # -----------------------------------------

    for field, value in update_data.items():

        setattr(
            transaction,
            field,
            value
        )

    db.commit()
    db.refresh(transaction)

    # -----------------------------------------
    # Recalculate payment status
    # -----------------------------------------

    totals = calculate_transaction(
        transaction
    )

    transaction.subtotal = totals["subtotal"]
    transaction.total = totals["total"]
    transaction.balance_amount = totals["balance_amount"]

    transaction.status = totals["status"]

    db.commit()
    db.refresh(transaction)

    return transaction


# =========================================================
# DELETE INVOICE
# =========================================================

@router.delete(
    "/{transaction_id}"
)
def delete_invoice(
    transaction_id: int,
    db: Session = Depends(get_db),
):

    transaction = db.query(
        MasterTransaction
    ).filter(
        MasterTransaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    db.delete(transaction)
    db.commit()

    return {
        "message": "Invoice deleted successfully"
    }