"""
BLACKOUT: RESTORE THE GRID
Health Check API Tests (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from unittest.mock import MagicMock
from sqlalchemy.exc import OperationalError
from app.database import get_db


def test_api_v1_health_check_healthy(client):
    """Verify that /api/v1/health returns 200 OK and connected status when database probe succeeds."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert data["version"] == "1.0.0"
    assert data["environment"] == "development"
    assert "timestamp" in data


def test_root_health_check_healthy(client):
    """Verify that root /health probe returns 200 OK for hosting platform monitoring."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "healthy"
    assert data["database"] == "connected"


def test_health_check_returns_503_when_database_fails(app, client):
    """
    Verify that if the database probe raises an error, the endpoint
    returns HTTP 503 Service Unavailable with degraded status.
    """
    mock_db = MagicMock()
    mock_db.execute.side_effect = OperationalError("Database connection lost", params=None, orig=Exception())

    def override_failing_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_failing_db
    try:
        response = client.get("/api/v1/health")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "degraded"
        assert data["database"] == "disconnected"
    finally:
        app.dependency_overrides.clear()
