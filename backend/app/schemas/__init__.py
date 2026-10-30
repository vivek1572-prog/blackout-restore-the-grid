"""
BLACKOUT: RESTORE THE GRID
Schemas Package (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from app.schemas.common import ErrorDetail, ErrorPayload, StandardErrorResponse
from app.schemas.health import HealthResponse
from app.schemas.leaderboard import LeaderboardResponse, StandingEntry
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantRead,
    RegistrationResponse,
)

__all__ = [
    "ErrorDetail",
    "ErrorPayload",
    "StandardErrorResponse",
    "HealthResponse",
    "LeaderboardResponse",
    "StandingEntry",
    "ParticipantCreate",
    "ParticipantRead",
    "RegistrationResponse",
]
