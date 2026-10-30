"""
BLACKOUT: RESTORE THE GRID
Health Check Response Schema (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    """System health check response status."""
    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
    )

    status: Literal["healthy", "degraded", "unhealthy"]
    database: Literal["connected", "disconnected"]
    version: str = "1.0.0"
    environment: str
    timestamp: datetime
