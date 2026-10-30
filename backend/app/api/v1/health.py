"""
BLACKOUT: RESTORE THE GRID
Health Check API Controller (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.schemas.health import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])
settings = get_settings()


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Service Health & Database Probe",
    description="Probes API service availability and verifies live database connectivity.",
    responses={
        200: {"description": "Service and database are operational and healthy."},
        503: {"description": "Database connectivity probe failed or service degraded."},
    },
)
def check_health(
    response: Response,
    db: Session = Depends(get_db),
) -> HealthResponse:
    """
    Execute health check probe testing both application availability and database connectivity.
    """
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    now = datetime.now(timezone.utc)

    if db_connected:
        return HealthResponse(
            status="healthy",
            database="connected",
            version="1.0.0",
            environment=settings.environment,
            timestamp=now,
        )
    else:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return HealthResponse(
            status="degraded",
            database="disconnected",
            version="1.0.0",
            environment=settings.environment,
            timestamp=now,
        )
