from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.schedule import Schedule
from models.patient import Patient
from models.therapist import Therapist
from schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)


router = APIRouter(
    prefix="/schedules",
    tags=["Schedules"]
)


# =========================
# CREATE
# =========================

@router.post(
    "/",
    response_model=ScheduleResponse
)
def create_schedule(
    schedule_data: ScheduleCreate,
    db: Session = Depends(get_db)
):
    # Check patient
    patient = db.query(Patient).filter(
        Patient.id == schedule_data.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # Check therapist
    therapist = db.query(Therapist).filter(
        Therapist.id == schedule_data.therapist_id
    ).first()

    if not therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )

    schedule = Schedule(
        patient_id=schedule_data.patient_id,
        therapist_id=schedule_data.therapist_id,
        scheduled_at=schedule_data.scheduled_at,
        duration_minutes=schedule_data.duration_minutes,
        type=schedule_data.type,
        notes=schedule_data.notes,
        status=schedule_data.status,
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return schedule


# =========================
# GET ALL
# =========================

@router.get(
    "/",
    response_model=list[ScheduleResponse]
)
def get_schedules(
    db: Session = Depends(get_db)
):
    schedules = db.query(Schedule).all()

    return schedules


# =========================
# GET ONE
# =========================

@router.get(
    "/{schedule_id}",
    response_model=ScheduleResponse
)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(
        Schedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    return schedule


# =========================
# UPDATE
# =========================

@router.put(
    "/{schedule_id}",
    response_model=ScheduleResponse
)
def update_schedule(
    schedule_id: int,
    schedule_data: ScheduleUpdate,
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(
        Schedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    update_data = schedule_data.model_dump(
        exclude_unset=True
    )

    # Check patient if changing patient
    if "patient_id" in update_data:

        patient = db.query(Patient).filter(
            Patient.id == update_data["patient_id"]
        ).first()

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

    # Check therapist if changing therapist
    if "therapist_id" in update_data:

        therapist = db.query(Therapist).filter(
            Therapist.id == update_data["therapist_id"]
        ).first()

        if not therapist:
            raise HTTPException(
                status_code=404,
                detail="Therapist not found"
            )

    # Update fields
    for field, value in update_data.items():
        setattr(schedule, field, value)

    db.commit()
    db.refresh(schedule)

    return schedule


# =========================
# DELETE
# =========================

@router.delete(
    "/{schedule_id}"
)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(
        Schedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    db.delete(schedule)
    db.commit()

    return {
        "message": "Schedule deleted successfully"
    }