"""
BLACKOUT: RESTORE THE GRID
Backend Configuration Foundation (Phase 3B.1)
Sphinx @ MNIT Jaipur
"""

import os
from functools import lru_cache
from typing import List, Union

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    from pydantic import field_validator
    HAS_PYDANTIC = True
except ImportError:
    # Graceful fallback foundation for inspection/test environments without dependencies installed
    HAS_PYDANTIC = False
    BaseSettings = object  # type: ignore


if HAS_PYDANTIC:
    class Settings(BaseSettings):
        """Application configuration settings loaded from environment variables."""

        # Database Connection URL (Neon PostgreSQL in Singapore)
        # Default provided for local test environments only; overridden via DATABASE_URL env var
        database_url: str = "sqlite:///./test_local.db"

        # Application Environment
        environment: str = "development"

        # Application Metadata
        app_name: str = "Blackout: Restore the Grid API"
        api_v1_prefix: str = "/api/v1"
        # Rate Limiting Configuration
        rate_limit_register: str = "120/minute"

        # CORS Allowed Origins (Development origins; overridden via CORS_ORIGINS env var)
        cors_origins: Union[List[str], str] = [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
        ]

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=False,
        )

        @field_validator("cors_origins", mode="before")
        @classmethod
        def parse_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
            if isinstance(value, str):
                return [origin.strip() for origin in value.split(",") if origin.strip()]
            return value

        @property
        def sync_database_url(self) -> str:
            """
            Normalize database URL for SQLAlchemy sync driver.
            Converts 'postgres://' to 'postgresql://' if supplied by legacy cloud providers.
            """
            url = self.database_url
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url

else:
    # Minimal stand-in for environments where dependencies are not yet installed
    class Settings:  # type: ignore
        def __init__(self) -> None:
            self.database_url = os.getenv("DATABASE_URL", "sqlite:///./test_local.db")
            self.environment = os.getenv("ENVIRONMENT", "development")
            self.app_name = os.getenv("APP_NAME", "Blackout: Restore the Grid API")
            self.api_v1_prefix = os.getenv("API_V1_PREFIX", "/api/v1")
            self.rate_limit_register = os.getenv("RATE_LIMIT_REGISTER", "120/minute")
            raw_cors = os.getenv(
                "CORS_ORIGINS",
                "http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8080,http://127.0.0.1:8080"
            )
            self.cors_origins = [o.strip() for o in raw_cors.split(",") if o.strip()]

        @property
        def sync_database_url(self) -> str:
            url = self.database_url
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url


@lru_cache()
def get_settings() -> Settings:
    """Return a cached instance of application settings."""
    return Settings()
