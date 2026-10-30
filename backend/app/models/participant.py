"""
BLACKOUT: RESTORE THE GRID
Participant Database Model (Phase 3B.1)
Sphinx @ MNIT Jaipur
"""

import uuid
from datetime import datetime, timezone
from app.models.base import Base

try:
    from sqlalchemy import String, DateTime, Uuid, func, UniqueConstraint
    from sqlalchemy.orm import Mapped, mapped_column
    HAS_SQLALCHEMY = True
except ImportError:
    HAS_SQLALCHEMY = False


if HAS_SQLALCHEMY:
    class Participant(Base):
        """
        Participant ORM Model.

        Represents an operator registered for Blackout: Restore the Grid.
        Stores strictly the three confirmed user-facing fields:
          1. Full Name (full_name)
          2. College ID (college_id, unique index)
          3. College Name (college_name)

        Primary Key Rationale:
          Uses a standard UUID (native uuid on PostgreSQL, CHAR(32) on SQLite).
          UUIDs are generated client/app-side via Python's standard `uuid.uuid4()`.
          This eliminates dependencies on PostgreSQL extensions (like pgcrypto),
          works consistently across local SQLite test setups and production Neon,
          and prevents sequential user-count enumeration attacks.
        """
        __tablename__ = "participants"

        # Internal primary key (UUID)
        id: Mapped[uuid.UUID] = mapped_column(
            Uuid(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4,
            nullable=False,
        )

        # Field 1: Full Name (Confirmed Requirement)
        full_name: Mapped[str] = mapped_column(
            String(100),
            nullable=False,
        )

        # Field 2: College ID (Confirmed Requirement, Unique)
        college_id: Mapped[str] = mapped_column(
            String(50),
            nullable=False,
            unique=True,
            index=True,
        )

        # Field 3: College Name (Confirmed Requirement)
        college_name: Mapped[str] = mapped_column(
            String(150),
            nullable=False,
        )

        # Timezone-aware audit timestamps
        created_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            default=lambda: datetime.now(timezone.utc),
            nullable=False,
        )

        updated_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            default=lambda: datetime.now(timezone.utc),
            nullable=False,
        )

        __table_args__ = (
            UniqueConstraint("college_id", name="uq_participants_college_id"),
        )

        def __repr__(self) -> str:
            return f"<Participant id={self.id} college_id='{self.college_id}'>"

else:
    # Stand-in representation for inspection without third-party dependencies installed
    class Participant(Base):  # type: ignore
        __tablename__ = "participants"
        id = "UUID (Primary Key)"
        full_name = "VARCHAR(100) NOT NULL"
        college_id = "VARCHAR(50) NOT NULL UNIQUE"
        college_name = "VARCHAR(150) NOT NULL"
        created_at = "TIMESTAMP WITH TIME ZONE NOT NULL"
        updated_at = "TIMESTAMP WITH TIME ZONE NOT NULL"
