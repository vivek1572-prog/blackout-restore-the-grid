"""
BLACKOUT: RESTORE THE GRID
Pytest Test Fixtures & In-Memory Database Setup (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import get_db
from app.main import create_app
from app.models.base import Base


@pytest.fixture(scope="session")
def app():
    """Create a FastAPI application instance for testing."""
    return create_app()


@pytest.fixture
def db_session():
    """
    Create an isolated in-memory SQLite database session for each test.
    Uses StaticPool so that multiple connections share the same in-memory database.
    """
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
        expire_on_commit=False,
    )

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client(app, db_session):
    """
    Provide a TestClient with database session dependency overridden to the test database.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
