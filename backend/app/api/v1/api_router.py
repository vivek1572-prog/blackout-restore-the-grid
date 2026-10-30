"""
BLACKOUT: RESTORE THE GRID
API v1 Router Aggregator (Phase 3B.3)
Sphinx @ MNIT Jaipur
"""

from fastapi import APIRouter
from app.api.v1 import health, leaderboard, register

api_v1_router = APIRouter()

# Attach API v1 endpoints
api_v1_router.include_router(health.router)
api_v1_router.include_router(register.router)
api_v1_router.include_router(leaderboard.router)
