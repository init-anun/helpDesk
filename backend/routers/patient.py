import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from db.database import get_db

from models.sub_account import SubAccount

from schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
)


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


# =========================================================
# CREATE Patient
# =========================================================

@router.post(
    "/",
    response_model=PatientResponse
)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
):
    # Get the latest patient account code
    last_patient = (
        db.query(SubAccount)
        .filter(
            SubAccount.account_type == "PATIENT",
            SubAccount.sub_acc_code.isnot(None),
        )
        .order_by(SubAccount.id.desc())
        .first()
    )

    # Generate next patient number
    if last_patient and last_patient.sub_acc_code:
        try:
            last_number = int(
                last_patient.sub_acc_code.replace("PT-", "")
            )
        except ValueError:
            last_number = 0
    else:
        last_number = 0

    next_number = last_number + 1

    # Four digits: PT-0001, PT-0002, ...
    sub_acc_code = f"PT-{next_number:04d}"

    patient = SubAccount(
        sub_acc_code=sub_acc_code,
        name=data.name,
        phone=data.phone,
        age=data.age,
        gender=data.gender,
        address=data.address,
        condition=data.condition,
        package=data.package,
        status=data.status,
        account_type="PATIENT",
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


# =========================================================
# GET ALL PATIENTS
# =========================================================

@router.get(
    "/",
    response_model=list[PatientResponse]
)
def get_patients(
    db: Session = Depends(get_db),
):

    patients = db.query(
        SubAccount
    ).filter(
        SubAccount.account_type == "PATIENT"
    ).order_by(
        SubAccount.id.desc()
    ).all()

    return patients


# =========================================================
# GET ONE PATIENT
# =========================================================

@router.get(
    "/{patient_id}",
    response_model=PatientResponse
)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):

    patient = db.query(
        SubAccount
    ).filter(
        SubAccount.id == patient_id,
        SubAccount.account_type == "PATIENT"
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# =========================================================
# UPDATE PATIENT
# =========================================================

@router.put(
    "/{patient_id}",
    response_model=PatientResponse
)
def update_patient(
    patient_id: int,
    data: PatientUpdate,
    db: Session = Depends(get_db),
):

    patient = db.query(
        SubAccount
    ).filter(
        SubAccount.id == patient_id,
        SubAccount.account_type == "PATIENT"
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            patient,
            field,
            value
        )

    db.commit()
    db.refresh(patient)

    return patient


# =========================================================
# DELETE PATIENT
# =========================================================

@router.delete(
    "/{patient_id}"
)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):

    patient = db.query(
        SubAccount
    ).filter(
        SubAccount.id == patient_id,
        SubAccount.account_type == "patient"
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return {
        "message": "Patient deleted successfully"
    }