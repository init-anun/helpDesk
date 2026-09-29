from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db
from models.session import (
    TherapySession,
    SessionStatus,
    SessionType,
)
from models.sub_account import SubAccount

from schemas.session import (
    SessionCreate,
    SessionListResponse,
    SessionResponse,
    SessionUpdate,
)


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

async def get_session_or_404(
    session_id: int,
    db: AsyncSession,
) -> TherapySession:

    result = await db.execute(
        select(TherapySession).where(
            TherapySession.id == session_id
        )
    )

    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    return session


async def validate_sub_accounts(
    patient_id: int,
    therapist_id: int,
    db: AsyncSession,
):
    if patient_id == therapist_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Patient and therapist cannot "
                "be the same account"
            ),
        )

    # Verify patient
    patient_result = await db.execute(
        select(SubAccount.id).where(
            SubAccount.id == patient_id
        )
    )

    patient_exists = (
        patient_result.scalar_one_or_none()
    )

    if patient_exists is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient account not found",
        )

    # Verify therapist
    therapist_result = await db.execute(
        select(SubAccount.id).where(
            SubAccount.id == therapist_id
        )
    )

    therapist_exists = (
        therapist_result.scalar_one_or_none()
    )

    if therapist_exists is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist account not found",
        )


# ============================================================
# LIST SESSIONS
# ============================================================

@router.get(
    "",
    response_model=SessionListResponse,
)
async def get_sessions(
    patient_id: int | None = Query(
        default=None,
    ),

    therapist_id: int | None = Query(
        default=None,
    ),

    session_type: SessionType | None = Query(
        default=None,
    ),

    session_status: SessionStatus | None = Query(
        default=None,
        alias="status",
    ),

    date_from: datetime | None = Query(
        default=None,
    ),

    date_to: datetime | None = Query(
        default=None,
    ),

    page: int = Query(
        default=1,
        ge=1,
    ),

    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    db: AsyncSession = Depends(get_db),
):
    conditions = []

    # --------------------------------------------------------
    # Filters
    # --------------------------------------------------------

    if patient_id is not None:
        conditions.append(
            TherapySession.patient_id == patient_id
        )

    if therapist_id is not None:
        conditions.append(
            TherapySession.therapist_id == therapist_id
        )

    if session_type is not None:
        conditions.append(
            TherapySession.session_type
            == session_type
        )

    if session_status is not None:
        conditions.append(
            TherapySession.status
            == session_status
        )

    if date_from is not None:
        conditions.append(
            TherapySession.session_date
            >= date_from
        )

    if date_to is not None:
        conditions.append(
            TherapySession.session_date
            <= date_to
        )

    # --------------------------------------------------------
    # Count
    # --------------------------------------------------------

    count_query = select(
        func.count(TherapySession.id)
    )

    if conditions:
        count_query = count_query.where(
            *conditions
        )

    count_result = await db.execute(
        count_query
    )

    total = count_result.scalar_one()

    # --------------------------------------------------------
    # Data
    # --------------------------------------------------------

    offset = (page - 1) * page_size

    query = (
        select(TherapySession)
        .order_by(
            TherapySession.session_date.desc()
        )
        .offset(offset)
        .limit(page_size)
    )

    if conditions:
        query = query.where(*conditions)

    result = await db.execute(query)

    sessions = result.scalars().all()

    pages = (
        (total + page_size - 1) // page_size
        if total > 0
        else 0
    )

    return SessionListResponse(
        items=sessions,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


# ============================================================
# PATIENT SESSION HISTORY
# ============================================================

@router.get(
    "/patient/{patient_id}",
    response_model=SessionListResponse,
)
async def get_patient_session_history(
    patient_id: int,

    page: int = Query(
        default=1,
        ge=1,
    ),

    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    db: AsyncSession = Depends(get_db),
):
    # --------------------------------------------------------
    # Verify SubAccount
    # --------------------------------------------------------

    account_result = await db.execute(
        select(SubAccount.id).where(
            SubAccount.id == patient_id
        )
    )

    account_exists = (
        account_result.scalar_one_or_none()
    )

    if account_exists is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient account not found",
        )

    # --------------------------------------------------------
    # Count
    # --------------------------------------------------------

    count_result = await db.execute(
        select(
            func.count(TherapySession.id)
        ).where(
            TherapySession.patient_id
            == patient_id
        )
    )

    total = count_result.scalar_one()

    # --------------------------------------------------------
    # Query
    # --------------------------------------------------------

    offset = (page - 1) * page_size

    result = await db.execute(
        select(TherapySession)
        .where(
            TherapySession.patient_id
            == patient_id
        )
        .order_by(
            TherapySession.session_date.desc()
        )
        .offset(offset)
        .limit(page_size)
    )

    sessions = result.scalars().all()

    pages = (
        (total + page_size - 1) // page_size
        if total > 0
        else 0
    )

    return SessionListResponse(
        items=sessions,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


# ============================================================
# GET SINGLE SESSION
# ============================================================

@router.get(
    "/{session_id}",
    response_model=SessionResponse,
)
async def get_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await get_session_or_404(
        session_id,
        db,
    )


# ============================================================
# CREATE SESSION
# ============================================================

@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_session(
    data: SessionCreate,
    db: AsyncSession = Depends(get_db),
):
    # --------------------------------------------------------
    # Validate patient + therapist
    # --------------------------------------------------------

    await validate_sub_accounts(
        patient_id=data.patient_id,
        therapist_id=data.therapist_id,
        db=db,
    )

    # --------------------------------------------------------
    # Create session
    # --------------------------------------------------------

    session = TherapySession(
        **data.model_dump()
    )

    db.add(session)

    await db.commit()

    await db.refresh(session)

    return session


# ============================================================
# UPDATE SESSION
# ============================================================

@router.put(
    "/{session_id}",
    response_model=SessionResponse,
)
async def update_session(
    session_id: int,

    data: SessionUpdate,

    db: AsyncSession = Depends(get_db),
):
    session = await get_session_or_404(
        session_id,
        db,
    )

    update_data = data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # Determine final participant IDs
    # --------------------------------------------------------

    patient_id = update_data.get(
        "patient_id",
        session.patient_id,
    )

    therapist_id = update_data.get(
        "therapist_id",
        session.therapist_id,
    )

    # --------------------------------------------------------
    # Validate participants if changed
    # --------------------------------------------------------

    if (
        "patient_id" in update_data
        or "therapist_id" in update_data
    ):
        await validate_sub_accounts(
            patient_id=patient_id,
            therapist_id=therapist_id,
            db=db,
        )

    # --------------------------------------------------------
    # Update fields
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            session,
            field,
            value,
        )

    await db.commit()

    await db.refresh(session)

    return session


# ============================================================
# DELETE SESSION
# ============================================================

@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_session(
    session_id: int,

    db: AsyncSession = Depends(get_db),
):
    session = await get_session_or_404(
        session_id,
        db,
    )

    await db.delete(session)

    await db.commit()

    return None