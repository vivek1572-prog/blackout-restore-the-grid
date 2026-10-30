"""
BLACKOUT: RESTORE THE GRID
Common API Schemas & Envelopes (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict


class ErrorDetail(BaseModel):
    """Specific field or parameter validation issue."""
    model_config = ConfigDict(extra="forbid")

    field: Optional[str] = None
    issue: str


class ErrorPayload(BaseModel):
    """Standardized error envelope payload."""
    model_config = ConfigDict(extra="forbid")

    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class StandardErrorResponse(BaseModel):
    """Top-level error response model."""
    model_config = ConfigDict(extra="forbid")

    error: ErrorPayload
