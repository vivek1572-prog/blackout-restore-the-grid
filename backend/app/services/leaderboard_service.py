"""
BLACKOUT: RESTORE THE GRID
Leaderboard Service Layer (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from datetime import datetime, timezone
from typing import Dict, Optional
from sqlalchemy.orm import Session

from app.schemas.leaderboard import LeaderboardResponse

# Canonical Registry of the Five Confirmed Games (strictly matching js/games-config.js)
CONFIRMED_GAMES: Dict[str, Dict[str, str]] = {
    "game-01": {"slot": "01", "name": "Game 01"},
    "game-02": {"slot": "02", "name": "Game 02"},
    "game-03": {"slot": "03", "name": "Game 03"},
    "game-04": {"slot": "04", "name": "Game 04"},
    "game-05": {"slot": "05", "name": "Game 05"},
}


def get_game_leaderboard(game_id: str, db: Session) -> Optional[LeaderboardResponse]:
    """
    Fetch the dedicated leaderboard for one of the five confirmed game slots.

    Parameters:
        game_id: Identifier string (e.g. 'game-01' through 'game-05')
        db: Active database session (reserved for score querying once event commences)

    Returns:
        LeaderboardResponse in pre-event standby mode with empty standings,
        or None if game_id is not in the confirmed registry.
    """
    if not game_id:
        return None

    normalized_id = game_id.strip().lower()
    game_info = CONFIRMED_GAMES.get(normalized_id)

    if not game_info:
        return None

    return LeaderboardResponse(
        success=True,
        game_id=normalized_id,
        game_name=game_info["name"],
        status="standby",
        message="Standby. Event scoring has not commenced.",
        standings=[],
        updated_at=datetime.now(timezone.utc),
    )
