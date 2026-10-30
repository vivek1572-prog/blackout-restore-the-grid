"""
BLACKOUT: RESTORE THE GRID
Leaderboard Schemas (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from datetime import datetime
from typing import Annotated, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class StandingEntry(BaseModel):
    """
    Public standing entry for a participant on a game's leaderboard.
    Note: Pre-event standings are empty as scoring rules are pending.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
    )

    rank: int = Field(ge=1, description="Leaderboard placement rank")
    college_id: Annotated[str, Field(validation_alias="collegeId", serialization_alias="collegeId")]
    full_name: Annotated[str, Field(validation_alias="fullName", serialization_alias="fullName")]
    college_name: Annotated[str, Field(validation_alias="collegeName", serialization_alias="collegeName")]
    score: Optional[float] = Field(default=None, description="Score achieved (unconfirmed until event commences)")
    recorded_at: Optional[datetime] = Field(
        default=None,
        validation_alias="recordedAt",
        serialization_alias="recordedAt",
        description="Timestamp of score achievement"
    )


class LeaderboardResponse(BaseModel):
    """
    Channel Leaderboard Response Schema for a specific game slot.
    Reflects pre-event standby status with empty standings.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
    )

    success: bool = True
    game_id: Annotated[str, Field(validation_alias="gameId", serialization_alias="gameId")]
    game_name: Annotated[str, Field(validation_alias="gameName", serialization_alias="gameName")]
    status: Literal["standby", "active", "concluded"] = Field(
        default="standby",
        description="Leaderboard status channel"
    )
    message: str = Field(
        default="Standby. Event scoring has not commenced.",
        description="Current operational announcement for this game leaderboard"
    )
    standings: List[StandingEntry] = Field(
        default_factory=list,
        description="Leaderboard rankings (empty during pre-event standby)"
    )
    updated_at: Annotated[datetime, Field(validation_alias="updatedAt", serialization_alias="updatedAt")]
