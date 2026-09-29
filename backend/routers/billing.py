from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from db.database import get_db

from models.master_transaction import MasterTransaction
from models.voucher_detail import VoucherDetail
from models.voucher_sub_detail import VoucherSubDetail

from schemas.master_transaction import (
    MasterTransactionCreate,
    MasterTransactionUpdate,
    MasterTransactionResponse,
)


router = APIRouter(
    prefix="/billing",
    tags=["Billing"],
)


# =========================================================
# CREATE TRANSACTION
# =========================================================

@router.post(
    "/",
    response_model=MasterTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    data: MasterTransactionCreate,
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Check duplicate voucher number
    # -----------------------------------------------------

    existing = (
        db.query(MasterTransaction)
        .filter(
            MasterTransaction.voucher_no == data.voucher_no
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voucher number already exists",
        )

    # -----------------------------------------------------
    # Create master transaction
    # -----------------------------------------------------

    transaction = MasterTransaction(
        organization_id=data.organization_id,
        voucher_no=data.voucher_no,
        voucher_date=data.voucher_date,
        voucher_due_date=data.voucher_due_date,
        ref_voucher_id=data.ref_voucher_id,
        ref_voucher_no=data.ref_voucher_no,
        receipt_no=data.receipt_no,
        manual_no=data.manual_no,
        master_amount=data.master_amount,
        terms_conditions=data.terms_conditions,
        payment_mode=data.payment_mode,
        payment_date=data.payment_date,
        cheque_details=data.cheque_details,
        voucher_details=data.voucher_details,
        voucher_template_id=data.voucher_template_id,
        created_by=data.created_by,
        approved_by=data.approved_by,
        approved_date=data.approved_date,
        checked_by=data.checked_by,
        checked_date=data.checked_date,
        deleted_by=data.deleted_by,
        deleted_date=data.deleted_date,
        status=data.status,
        financial_year_id=data.financial_year_id,
        master_acc_code=data.master_acc_code,
        payment_month_id=data.payment_month_id,
    )

    db.add(transaction)
    db.flush()

    # -----------------------------------------------------
    # Create voucher details
    # -----------------------------------------------------

    for detail_data in data.voucher_details_rows:

        detail = VoucherDetail(
            master_transaction_id=transaction.id,
            chart_of_account_id=detail_data.chart_of_account_id,
            serial_no=detail_data.serial_no,
            particulars=detail_data.particulars,
            tr_code=detail_data.tr_code,
            dr_amount=detail_data.dr_amount,
            cr_amount=detail_data.cr_amount,
            remarks=detail_data.remarks,
            created_by=detail_data.created_by,
            created_at=detail_data.created_at,
            updated_at=detail_data.updated_at,
            line_item=detail_data.line_item,
            updated_by=detail_data.updated_by,
        )

        db.add(detail)

    # -----------------------------------------------------
    # Create voucher sub-details
    # -----------------------------------------------------

    for sub_data in data.voucher_sub_details:

        sub_detail = VoucherSubDetail(
            master_transaction_id=transaction.id,
            serial_no=sub_data.serial_no,
            chart_of_account_id=sub_data.chart_of_account_id,
            sub_account_id=sub_data.sub_account_id,
            item_description=sub_data.item_description,
            quantity=sub_data.quantity,
            unit_price=sub_data.unit_price,
            tax=sub_data.tax,
            tax_rate=sub_data.tax_rate,
            tr_code=sub_data.tr_code,
            dr_amount=sub_data.dr_amount,
            cr_amount=sub_data.cr_amount,
            created_by=sub_data.created_by,
            created_at=sub_data.created_at,
            updated_at=sub_data.updated_at,
            discount=sub_data.discount,
            line_item=sub_data.line_item,
            updated_by=sub_data.updated_by,
        )

        db.add(sub_detail)

    db.commit()
    db.refresh(transaction)

    return transaction


# =========================================================
# GET ALL TRANSACTIONS
# =========================================================

@router.get(
    "/",
    response_model=list[MasterTransactionResponse],
)
def get_transactions(
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(MasterTransaction)
        .order_by(
            MasterTransaction.id.desc()
        )
        .all()
    )

    return transactions


# =========================================================
# GET SINGLE TRANSACTION
# =========================================================

@router.get(
    "/{transaction_id}",
    response_model=MasterTransactionResponse,
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = (
        db.query(MasterTransaction)
        .filter(
            MasterTransaction.id == transaction_id
        )
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return transaction


# =========================================================
# UPDATE TRANSACTION
# =========================================================

@router.put(
    "/{transaction_id}",
    response_model=MasterTransactionResponse,
)
def update_transaction(
    transaction_id: int,
    data: MasterTransactionUpdate,
    db: Session = Depends(get_db),
):
    transaction = (
        db.query(MasterTransaction)
        .filter(
            MasterTransaction.id == transaction_id
        )
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    # -----------------------------------------------------
    # Check duplicate voucher number
    # -----------------------------------------------------

    if "voucher_no" in update_data:

        existing = (
            db.query(MasterTransaction)
            .filter(
                MasterTransaction.voucher_no
                == update_data["voucher_no"],
                MasterTransaction.id != transaction_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Voucher number already exists",
            )

    # -----------------------------------------------------
    # Update master transaction
    # -----------------------------------------------------

    for field, value in update_data.items():

        # Detail collections are handled separately
        if field in {
            "voucher_details_rows",
            "voucher_sub_details",
        }:
            continue

        setattr(
            transaction,
            field,
            value,
        )

    # -----------------------------------------------------
    # Replace voucher details
    # -----------------------------------------------------

    if "voucher_details_rows" in update_data:

        db.query(VoucherDetail).filter(
            VoucherDetail.master_transaction_id
            == transaction_id
        ).delete(
            synchronize_session=False
        )

        for detail_data in (
            update_data["voucher_details_rows"]
        ):

            detail = VoucherDetail(
                master_transaction_id=transaction_id,
                chart_of_account_id=detail_data[
                    "chart_of_account_id"
                ],
                serial_no=detail_data[
                    "serial_no"
                ],
                particulars=detail_data.get(
                    "particulars"
                ),
                tr_code=detail_data.get(
                    "tr_code"
                ),
                dr_amount=detail_data.get(
                    "dr_amount"
                ),
                cr_amount=detail_data.get(
                    "cr_amount"
                ),
                remarks=detail_data.get(
                    "remarks"
                ),
                created_by=detail_data.get(
                    "created_by"
                ),
                created_at=detail_data.get(
                    "created_at"
                ),
                updated_at=detail_data.get(
                    "updated_at"
                ),
                line_item=detail_data.get(
                    "line_item"
                ),
                updated_by=detail_data.get(
                    "updated_by"
                ),
            )

            db.add(detail)

    # -----------------------------------------------------
    # Replace voucher sub-details
    # -----------------------------------------------------

    if "voucher_sub_details" in update_data:

        db.query(VoucherSubDetail).filter(
            VoucherSubDetail.master_transaction_id
            == transaction_id
        ).delete(
            synchronize_session=False
        )

        for sub_data in (
            update_data["voucher_sub_details"]
        ):

            sub_detail = VoucherSubDetail(
                master_transaction_id=transaction_id,
                serial_no=sub_data[
                    "serial_no"
                ],
                chart_of_account_id=sub_data[
                    "chart_of_account_id"
                ],
                sub_account_id=sub_data.get(
                    "sub_account_id"
                ),
                item_description=sub_data.get(
                    "item_description"
                ),
                quantity=sub_data.get(
                    "quantity"
                ),
                unit_price=sub_data.get(
                    "unit_price"
                ),
                tax=sub_data.get(
                    "tax"
                ),
                tax_rate=sub_data.get(
                    "tax_rate"
                ),
                tr_code=sub_data.get(
                    "tr_code"
                ),
                dr_amount=sub_data.get(
                    "dr_amount"
                ),
                cr_amount=sub_data.get(
                    "cr_amount"
                ),
                created_by=sub_data.get(
                    "created_by"
                ),
                created_at=sub_data.get(
                    "created_at"
                ),
                updated_at=sub_data.get(
                    "updated_at"
                ),
                discount=sub_data.get(
                    "discount"
                ),
                line_item=sub_data.get(
                    "line_item"
                ),
                updated_by=sub_data.get(
                    "updated_by"
                ),
            )

            db.add(sub_detail)

    db.commit()
    db.refresh(transaction)

    return transaction


# =========================================================
# DELETE TRANSACTION
# =========================================================

@router.delete(
    "/{transaction_id}",
)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = (
        db.query(MasterTransaction)
        .filter(
            MasterTransaction.id == transaction_id
        )
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    db.delete(transaction)
    db.commit()

    return {
        "message": "Transaction deleted successfully"
    }