"""
BLACKOUT: RESTORE THE GRID
Frontend Integration Simulation Tests (Phase 3B.4)
Sphinx @ MNIT Jaipur
"""

def test_frontend_registration_submission_flow(client):
    """
    Simulate the exact payload and response flow executed by register-view.js:
    - User fills Full Name, College ID, College Name
    - Frontend sends JSON with camelCase aliases
    - Receives HTTP 201 Created on first attempt
    - Receives HTTP 200 OK on duplicate attempt with updated details
    """
    # 1. New Operator Registration
    payload_1 = {
        "fullName": "Priya Sharma",
        "collegeId": "2024UEC1089",
        "collegeName": "MNIT Jaipur",
    }
    res_1 = client.post("/api/v1/register", json=payload_1)
    assert res_1.status_code == 201
    data_1 = res_1.json()
    assert data_1["success"] is True
    assert data_1["action"] == "created"
    assert data_1["operator"]["fullName"] == "Priya Sharma"
    assert data_1["operator"]["collegeId"] == "2024UEC1089"
    assert data_1["operator"]["collegeName"] == "MNIT Jaipur"

    # 2. Duplicate College ID Update (same operator updates name / department)
    payload_2 = {
        "fullName": "Priya Sharma (ECE)",
        "collegeId": "2024uec1089",  # lowercase sent from client
        "collegeName": "MNIT Jaipur Campus",
    }
    res_2 = client.post("/api/v1/register", json=payload_2)
    assert res_2.status_code == 200
    data_2 = res_2.json()
    assert data_2["success"] is True
    assert data_2["action"] == "updated"
    assert data_2["operator"]["fullName"] == "Priya Sharma (ECE)"
    assert data_2["operator"]["collegeId"] == "2024UEC1089"  # Preserved normalized uppercase
    assert data_2["operator"]["collegeName"] == "MNIT Jaipur Campus"
    assert data_2["operator"]["id"] == data_1["operator"]["id"]  # Preserved immutable UUID


def test_frontend_leaderboard_channels_flow(client):
    """
    Simulate the exact request executed by leaderboard-view.js when switching tabs:
    - Queries /api/v1/games/{game_id}/leaderboard for game-01 to game-05
    - Verifies pre-event standby response contract
    """
    for game_id in ["game-01", "game-02", "game-03", "game-04", "game-05"]:
        res = client.get(f"/api/v1/games/{game_id}/leaderboard")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["gameId"] == game_id
        assert data["status"] == "standby"
        assert data["standings"] == []
        assert "message" in data
