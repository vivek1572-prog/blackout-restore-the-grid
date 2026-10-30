"""
BLACKOUT: RESTORE THE GRID
Participant Registration API Controller (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantRead,
    RegistrationResponse,
)
from app.services.participant_service import upsert_participant

router = APIRouter(prefix="/register", tags=["Registration"])


@router.post(
    "",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register participant or update existing registration by College ID",
    description=(
        "Registers a participant using strictly the three confirmed fields: Full Name, College ID, and College Name. "
        "If a record with the same College ID already exists, it updates that record (HTTP 200 OK) "
        "rather than creating a duplicate. New registrations return HTTP 201 Created."
    ),
    responses={
        201: {"description": "New participant registered successfully."},
        200: {"description": "Existing participant record updated successfully."},
        422: {"description": "Validation error (missing field, invalid length, or unexpected extra fields)."},
    },
)
def register_operator(
    payload: ParticipantCreate,
    response: Response,
    db: Session = Depends(get_db),
) -> RegistrationResponse:
    """
    Intake handler for participant registration.
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
