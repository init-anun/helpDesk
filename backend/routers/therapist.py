from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from db.database import get_db

from models.sub_account import SubAccount

from schemas.therapist import (
    TherapistCreate,
    TherapistUpdate,
    TherapistResponse,
)


router = APIRouter(
    prefix="/therapists",
    tags=["Therapists"]
)


# =========================================================
# CREATE THERAPIST
# =========================================================

@router.post(
    "/",
    response_model=TherapistResponse
)
def create_therapist(
    data: TherapistCreate,
    db: Session = Depends(get_db),
):

    therapist = SubAccount(
        name=data.name,
        phone=data.phone,
        email=data.email,

        status=data.status,

        account_type="therapist",
    )

    db.add(therapist)
    db.commit()
    db.refresh(therapist)

    return therapist


# =========================================================
# GET ALL THERAPISTS
# =========================================================

@router.get(
    "/",
    response_model=list[TherapistResponse]
)
def get_therapists(
    db: Session = Depends(get_db),
):

    therapists = db.query(
        SubAccount
    ).filter(
        SubAccount.account_type == "therapist"
    ).order_by(
        SubAccount.id.desc()
    ).all()

    return therapists


# =========================================================
# GET ONE THERAPIST
# =========================================================

@router.get(
    "/{therapist_id}",
    response_model=TherapistResponse
)
def get_therapist(
    therapist_id: int,
    db: Session = Depends(get_db),
):

    therapist = db.query(
        SubAccount
    ).filter(
        SubAccount.id == therapist_id,
        SubAccount.account_type == "therapist"
    ).first()

    if not therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )

    return therapist


# =========================================================
# UPDATE THERAPIST
# =========================================================

@router.put(
    "/{therapist_id}",
    response_model=TherapistResponse
)
def update_therapist(
    therapist_id: int,
    data: TherapistUpdate,
    db: Session = Depends(get_db),
):

    therapist = db.query(
        SubAccount
    ).filter(
        SubAccount.id == therapist_id,
        SubAccount.account_type == "therapist"
    ).first()

    if not therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            therapist,
            field,
            value
        )

    db.commit()
    db.refresh(therapist)

    return therapist


# =========================================================
# DELETE THERAPIST
# =========================================================

@router.delete(
    "/{therapist_id}"
)
def delete_therapist(
    therapist_id: int,
    db: Session = Depends(get_db),
):

    therapist = db.query(
        SubAccount
    ).filter(
        SubAccount.id == therapist_id,
        SubAccount.account_type == "therapist"
    ).first()

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