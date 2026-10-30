"""
BLACKOUT: RESTORE THE GRID
SQLAlchemy Declarative Base Foundation (Phase 3B.1)
Sphinx @ MNIT Jaipur
"""

try:
    from sqlalchemy.orm import DeclarativeBase
    class Base(DeclarativeBase):
        """Base declarative class for all application models."""
        pass
except ImportError:
    # Minimal stand-in for syntax and static inspection without installed dependencies
    class Base:  # type: ignore
        metadata = None
