from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from db.database import get_db
from models.schedule import Schedule
from models.sub_account import SubAccount
from schemas.schedule import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)


router = APIRouter(
    prefix="/schedules",
    tags=["Schedules"],
)


def get_patient(
    db: Session,
    patient_id: int,
) -> SubAccount:
    patient = (
        db.query(SubAccount)
        .filter(
            SubAccount.id == patient_id,
            SubAccount.account_type == "patient",
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient


def get_therapist(
    db: Session,
    therapist_id: int,
) -> SubAccount:
    therapist = (
        db.query(SubAccount)
        .filter(
            SubAccount.id == therapist_id,
            SubAccount.account_type == "therapist",
        )
        .first()
    )

    if not therapist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found",
        )

    return therapist


# ---------------------------------------------------------
# CREATE
# ---------------------------------------------------------

@router.post(
    "/",
    response_model=ScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule(
    schedule_data: ScheduleCreate,
    db: Session = Depends(get_db),
):
    # Validate patient
    get_patient(
        db,
        schedule_data.patient_id,
    )

    # Validate therapist
    get_therapist(
        db,
        schedule_data.therapist_id,
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


# ---------------------------------------------------------
# GET ALL
# ---------------------------------------------------------

@router.get(
    "/",
    response_model=list[ScheduleResponse],
)
def get_schedules(
    db: Session = Depends(get_db),
):
    return (
        db.query(Schedule)
        .order_by(Schedule.scheduled_at)
        .all()
    )


# ---------------------------------------------------------
# GET ONE
# ---------------------------------------------------------

@router.get(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    return schedule


# ---------------------------------------------------------
# UPDATE
# ---------------------------------------------------------

@router.put(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def update_schedule(
    schedule_id: int,
    schedule_data: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    update_data = schedule_data.model_dump(
        exclude_unset=True
    )

    # Validate patient if being changed
    if "patient_id" in update_data:
        get_patient(
            db,
            update_data["patient_id"],
        )

    # Validate therapist if being changed
    if "therapist_id" in update_data:
        get_therapist(
            db,
            update_data["therapist_id"],
        )

    for field, value in update_data.items():
        setattr(schedule, field, value)

    db.commit()
    db.refresh(schedule)

    return schedule


# ---------------------------------------------------------
# DELETE
# ---------------------------------------------------------

@router.delete(
    "/{schedule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    db.delete(schedule)
    db.commit()

    return None