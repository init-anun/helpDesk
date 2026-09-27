from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.therapist import Therapist
from schemas.therapist import (
    TherapistCreate,
    TherapistUpdate
)

router = APIRouter(
    prefix="/therapists",
    tags=["Therapists"]
)


@router.post("/")
def create_therapist(
    data: TherapistCreate,
    db: Session = Depends(get_db)
):
    therapist = Therapist(
        name=data.name,
        phone=data.phone,
        email=data.email
    )

    db.add(therapist)
    db.commit()
    db.refresh(therapist)

    return therapist


@router.get("/")
def get_therapists(
    db: Session = Depends(get_db)
):
    return db.query(Therapist).all()


@router.get("/{therapist_id}")
def get_therapist(
    therapist_id: int,
    db: Session = Depends(get_db)
):
    therapist = db.get(
        Therapist,
        therapist_id
    )

    if not therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )

    return therapist


@router.put("/{therapist_id}")
def update_therapist(
    therapist_id: int,
    data: TherapistUpdate,
    db: Session = Depends(get_db)
):
    therapist = db.get(
        Therapist,
        therapist_id
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
        setattr(therapist, key, value)

    db.commit()
    db.refresh(therapist)

    return therapist


@router.delete("/{therapist_id}")
def delete_therapist(
    therapist_id: int,
    db: Session = Depends(get_db)
):
    therapist = db.get(
        Therapist,
        therapist_id
    )

    if not therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )

    db.delete(therapist)
    db.commit()

    return {
        "message": "Therapist deleted successfully"
    }