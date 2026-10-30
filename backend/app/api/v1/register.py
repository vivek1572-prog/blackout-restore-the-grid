"""
BLACKOUT: RESTORE THE GRID
Participant Registration API Controller (Phase 3B)
Sphinx @ MNIT Jaipur
"""

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.limiter import limiter
from app.database import get_db
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantRead,
    RegistrationResponse,
)
from app.services.participant_service import upsert_participant

router = APIRouter(prefix="/register", tags=["Registration"])
settings = get_settings()


@router.post(
    "",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register participant or update existing registration by College ID",
    description=(
        "Registers a participant using strictly the three confirmed fields: Full Name, College ID, and College Name. "
        "If a record with the same College ID already exists, it updates that record (HTTP 200 OK) "
        "rather than creating a duplicate. New registrations return HTTP 201 Created. "
        "Protected by 120 requests/minute/IP rate limit."
    ),
    responses={
        201: {"description": "New participant registered successfully."},
        200: {"description": "Existing participant record updated successfully."},
        422: {"description": "Validation error (missing field, invalid length, or unexpected extra fields)."},
        429: {"description": "Too many requests. Rate limit of 120 requests/minute exceeded."},
    },
)
@limiter.limit(settings.rate_limit_register)
def register_operator(
    request: Request,
    payload: ParticipantCreate,
    response: Response,
    db: Session = Depends(get_db),
) -> RegistrationResponse:
    """
    Intake handler for participant registration.
    Rate-limited per client IP (120 requests/minute).
    """
    participant, is_created = upsert_participant(db, payload)

    if is_created:
        response.status_code = status.HTTP_201_CREATED
        action_type = "created"
    else:
        response.status_code = status.HTTP_200_OK
        action_type = "updated"

    # Map database model attributes to schema
    operator_data = ParticipantRead(
        id=participant.id,
        fullName=participant.full_name,
        collegeId=participant.college_id,
        collegeName=participant.college_name,
        registeredAt=participant.created_at,
        updatedAt=participant.updated_at,
    )

    return RegistrationResponse(
        success=True,
        action=action_type,
        operator=operator_data,
    )
