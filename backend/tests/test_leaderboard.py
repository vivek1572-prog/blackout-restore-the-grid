"""
BLACKOUT: RESTORE THE GRID
Game Leaderboard API Tests (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

import pytest


@pytest.mark.parametrize("slot_num, game_id, expected_name", [
    ("01", "game-01", "Game 01"),
    ("02", "game-02", "Game 02"),
    ("03", "game-03", "Game 03"),
    ("04", "game-04", "Game 04"),
    ("05", "game-05", "Game 05"),
])
def test_all_five_confirmed_games_return_standby_leaderboards(client, slot_num, game_id, expected_name):
    """
    Verify that all five confirmed game channels (game-01 to game-05) return dedicated
    standby leaderboards with empty standings and truthful pre-event status.
    """
    response = client.get(f"/api/v1/games/{game_id}/leaderboard")
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["gameId"] == game_id
    assert data["gameName"] == expected_name
    assert data["status"] == "standby"
    assert data["message"] == "Standby. Event scoring has not commenced."
    assert data["standings"] == []  # No fake scores; pre-event state truthfully represented
    assert "updatedAt" in data


def test_leaderboard_game_id_case_insensitivity(client):
    """Verify that game ID routing is case-insensitive (e.g. GAME-01 -> game-01)."""
    response = client.get("/api/v1/games/GAME-01/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert data["gameId"] == "game-01"

    response_mixed = client.get("/api/v1/games/Game-03/leaderboard")
    assert response_mixed.status_code == 200
    assert response_mixed.json()["gameId"] == "game-03"


def test_unconfirmed_game_ids_rejected_with_404(client):
    """
    Verify that unconfirmed game slots (e.g. game-06, unknown-game, or stage-wise queries)
    are strictly rejected with HTTP 404 Not Found.
    """
    # 6th unapproved game slot
    res_game6 = client.get("/api/v1/games/game-06/leaderboard")
    assert res_game6.status_code == 404
    assert "game-06" in res_game6.json()["detail"]
    assert "game-01" in res_game6.json()["detail"]

    # Random unknown game
    res_unknown = client.get("/api/v1/games/cyber-hack/leaderboard")
    assert res_unknown.status_code == 404

    # Stage-wise leaderboard query (strictly unapproved)
    res_stage = client.get("/api/v1/games/stage-01/leaderboard")
    assert res_stage.status_code == 404
