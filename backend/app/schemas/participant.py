"""
BLACKOUT: RESTORE THE GRID
Participant Validation & Response Schemas (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

import uuid
from datetime import datetime
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ParticipantCreate(BaseModel):
    """
    Participant Registration Request Schema.

    Enforces strictly the three confirmed user-facing fields:
      1. Full Name
      2. College ID (normalized to uppercase)
      3. College Name

    Rejects any unapproved or extra fields (e.g. email, phone, passwords).
    Accepts both camelCase (from frontend JSON) and snake_case.
    """
    model_config = ConfigDict(
        extra="forbid",
        populate_by_name=True,
        str_strip_whitespace=True,
    )

    full_name: Annotated[
        str,
        Field(
            min_length=2,
            max_length=100,
            validation_alias="fullName",
            serialization_alias="fullName",
            description="Participant's legal or student name",
        ),
    ]
    college_id: Annotated[
        str,
        Field(
            min_length=2,
            max_length=50,
            validation_alias="collegeId",
            serialization_alias="collegeId",
            description="Institutional student identification / roll number",
        ),
    ]
    college_name: Annotated[
        str,
        Field(
            min_length=2,
            max_length=150,
            validation_alias="collegeName",
            serialization_alias="collegeName",
            description="University or college institution name",
        ),
    ]

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Full name cannot be blank or whitespace-only.")
        return cleaned

    @field_validator("college_id")
    @classmethod
    def normalize_college_id(cls, v: str) -> str:
        """
        Normalize College ID:
        1. Strip leading and trailing whitespace.
        2. Convert to uppercase for consistent case-insensitive uniqueness and lookups.
        """
        cleaned = v.strip().upper()
        if not cleaned:
            raise ValueError("College ID cannot be blank or whitespace-only.")
        return cleaned

    @field_validator("college_name")
    @classmethod
    def validate_college_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("College name cannot be blank or whitespace-only.")
        return cleaned


class ParticipantRead(BaseModel):
    """Safe public representation of a registered participant."""
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: uuid.UUID
    full_name: Annotated[str, Field(validation_alias="fullName", serialization_alias="fullName")]
    college_id: Annotated[str, Field(validation_alias="collegeId", serialization_alias="collegeId")]
    college_name: Annotated[str, Field(validation_alias="collegeName", serialization_alias="collegeName")]
    registered_at: Annotated[datetime, Field(validation_alias="registeredAt", serialization_alias="registeredAt")]
    updated_at: Annotated[datetime, Field(validation_alias="updatedAt", serialization_alias="updatedAt")]


class RegistrationResponse(BaseModel):
    """Response returned upon successful registration or duplicate update."""
    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
    )

    success: bool = True
    action: Literal["created", "updated"]
    operator: ParticipantRead
