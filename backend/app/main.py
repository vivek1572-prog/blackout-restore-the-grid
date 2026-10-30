"""
BLACKOUT: RESTORE THE GRID
FastAPI Application Entry Point & Foundation (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from app.config import get_settings

try:
    from fastapi import FastAPI, Depends, Response
    from fastapi.middleware.cors import CORSMiddleware
    from sqlalchemy.orm import Session
    from app.database import get_db
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

settings = get_settings()


def create_app() -> "FastAPI":
    """Application factory for Blackout: Restore the Grid API."""
    if not HAS_FASTAPI:
        raise RuntimeError("FastAPI is not installed in the current environment.")

    application = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        description="Backend API foundation for Blackout: Restore the Grid (Sphinx @ MNIT Jaipur).",
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    # Configure CORS (Development origins configured; production Vercel URL pending confirmation)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    @application.get("/", include_in_schema=False)
    def root_status():
        """Root status ping confirming API foundation is running."""
        return {
            "app": settings.app_name,
            "status": "online",
            "environment": settings.environment,
            "version": "1.0.0"
        }

    @application.get("/health", include_in_schema=False)
    def root_health(response: Response, db: Session = Depends(get_db)):
        """Root health probe for cloud monitoring (e.g. Render health checks)."""
        from app.api.v1.health import check_health
        return check_health(response, db)

    # Mount API v1 router
    from app.api.v1.api_router import api_v1_router
    application.include_router(api_v1_router, prefix=settings.api_v1_prefix)

    return application


if HAS_FASTAPI:
    app = create_app()
else:
    app = None
