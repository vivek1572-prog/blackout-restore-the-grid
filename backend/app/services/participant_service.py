"""
BLACKOUT: RESTORE THE GRID
Participant Service & Atomic Upsert Logic (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

from datetime import datetime, timezone
from typing import Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate


def upsert_participant(db: Session, participant_in: ParticipantCreate) -> Tuple[Participant, bool]:
    """
    Register a participant or update an existing registration by College ID.

    Duplicate College ID Policy:
    If a registration already exists with the same College ID (case-normalized),
    update that participant's Full Name and College Name, updating `updated_at`.
    Do not create a duplicate record.

    Concurrency & Race Condition Handling:
    If two concurrent requests attempt to create the same new College ID simultaneously,
    the database uniqueness constraint raises an IntegrityError. The service catches
    the error, rolls back the sub-transaction, and performs the update on the newly
    committed record, guaranteeing safe concurrency.

    Returns:
        Tuple[Participant, bool]: (participant_instance, is_created)
        - is_created is True if a new record was created (HTTP 201 Created).
        - is_created is False if an existing record was updated (HTTP 200 OK).
    """
    normalized_id = participant_in.college_id  # Already normalized to uppercase by schema validator

    # Check for existing record
    stmt = select(Participant).where(Participant.college_id == normalized_id)
    existing = db.execute(stmt).scalar_one_or_none()

    if existing:
        existing.full_name = participant_in.full_name
        existing.college_name = participant_in.college_name
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing, False

    # Attempt to insert new record
    new_participant = Participant(
        full_name=participant_in.full_name,
        college_id=normalized_id,
        college_name=participant_in.college_name,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_participant)
    try:
        db.commit()
        db.refresh(new_participant)
        return new_participant, True
    except IntegrityError:
        # Race condition handling: Another worker inserted this college_id between our select and insert
        db.rollback()
        existing = db.execute(stmt).scalar_one()
        existing.full_name = participant_in.full_name
        existing.college_name = participant_in.college_name
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing, False
