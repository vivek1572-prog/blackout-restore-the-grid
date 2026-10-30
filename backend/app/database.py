"""
BLACKOUT: RESTORE THE GRID
Database Engine & Session Management (Phase 3B.1)
Sphinx @ MNIT Jaipur
"""

from typing import Generator
from app.config import get_settings

try:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker, Session
    HAS_SQLALCHEMY = True
except ImportError:
    HAS_SQLALCHEMY = False
    Session = object  # type: ignore

settings = get_settings()

if HAS_SQLALCHEMY:
    # Configure connection arguments and pool parameters
    is_sqlite = settings.sync_database_url.startswith("sqlite")

    engine_kwargs = {}
    if is_sqlite:
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    else:
        # PostgreSQL (Neon) pool settings
        # pool_pre_ping detects disconnected connections after scale-to-zero or idle timeouts
        engine_kwargs["pool_pre_ping"] = True
        engine_kwargs["pool_recycle"] = 300
        engine_kwargs["pool_size"] = 5
        engine_kwargs["max_overflow"] = 10

    engine = create_engine(
        settings.sync_database_url,
        **engine_kwargs
    )

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
        expire_on_commit=False,
    )

    def get_db() -> Generator[Session, None, None]:
        """Provide a transactional database session scope for API route dependencies."""
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

else:
    engine = None
    SessionLocal = None

    def get_db():  # type: ignore
        raise RuntimeError("SQLAlchemy is not installed in the current environment.")
