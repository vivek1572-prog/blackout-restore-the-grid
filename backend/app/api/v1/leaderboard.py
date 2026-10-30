"""
BLACKOUT: RESTORE THE GRID
Game Leaderboard API Controller (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import get_game_leaderboard, CONFIRMED_GAMES

router = APIRouter(prefix="/games", tags=["Leaderboards"])


@router.get(
    "/{game_id}/leaderboard",
    response_model=LeaderboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Dedicated Leaderboard for Confirmed Game",
    description=(
        "Retrieves the dedicated leaderboard channel for one of the five confirmed game slots "
        "(game-01 through game-05). Pre-event standings are empty pending scoring rule confirmation. "
        "Returns 404 for unconfirmed or invalid game IDs."
    ),
    responses={
        200: {"description": "Leaderboard channel returned successfully."},
        404: {"description": "Game ID not recognized. Must be one of game-01 through game-05."},
    },
)
def get_leaderboard_for_game(
    game_id: str = Path(
        ...,
        description="Game slot identifier (e.g. 'game-01', 'game-02', etc.)",
        min_length=3,
        max_length=30,
        examples=["game-01"],
    ),
    db: Session = Depends(get_db),
) -> LeaderboardResponse:
    """
    Fetch dedicated leaderboard for the specified game slot.
    """
    leaderboard = get_game_leaderboard(game_id, db)
    if not leaderboard:
        valid_ids = ", ".join(sorted(CONFIRMED_GAMES.keys()))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game '{game_id}' not found. Valid game channels are: {valid_ids}.",
        )

    return leaderboard
