from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.patient import Patient
from models.therapist import Therapist
from schemas.patient import PatientCreate, PatientUpdate

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post("/")
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db)
):
    if data.therapist_id:
        therapist = db.get(
            Therapist,
            data.therapist_id
        )

        if not therapist:
            raise HTTPException(
                status_code=404,
                detail="Therapist not found"
            )

    patient = Patient(
        name=data.name,
        phone=data.phone,
        age=data.age,
        gender=data.gender,
        address=data.address,
        condition=data.condition,
        therapist_id=data.therapist_id,
        package=data.package,
        status=data.status
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.get("/")
def get_patients(
    db: Session = Depends(get_db)
):
    return db.query(Patient).all()


@router.get("/{patient_id}")
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@router.put("/{patient_id}")
def update_patient(
    patient_id: int,
    data: PatientUpdate,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    if data.therapist_id:
        therapist = db.get(
            Therapist,
            data.therapist_id
        )

        if not therapist:
            raise HTTPException(
                status_code=404,
                detail="Therapist not found"
            )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return patient


@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

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