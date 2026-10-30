# Blackout: Restore the Grid — Backend Service

> Backend API service for **Blackout: Restore the Grid**, engineered for **Sphinx** at **Malaviya National Institute of Technology (MNIT), Jaipur**.

---

## Architecture Overview

- **Framework:** FastAPI (Python 3.11 / 3.12 / 3.14 compatible)
- **Database:** Neon PostgreSQL (AWS Asia Pacific Singapore `ap-southeast-1`)
- **ORM:** SQLAlchemy 2.x
- **Configuration & Validation:** Pydantic v2 & `pydantic-settings`
- **Schema Migrations:** Alembic
- **Hosting Target:** Render (Web Service)

---

## Directory Layout

```
backend/
├── alembic/                          # Database migrations
│   ├── env.py                        # Migration environment
│   ├── script.py.mako                # Revision template
│   └── versions/                     # Versioned migration scripts
│       └── 0001_create_participants_table.py
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI entry point & factory
│   ├── config.py                     # Environment variables & Pydantic settings
│   ├── database.py                   # SQLAlchemy engine, pool, & sessionmaker
│   ├── api/                          # Route controllers
│   │   ├── __init__.py
│   │   └── v1/                       # API version 1 routers
│   │       ├── __init__.py
│   │       ├── api_router.py         # v1 aggregator
│   │       ├── health.py             # Health check & DB probe
│   │       ├── leaderboard.py        # Dedicated 5-channel leaderboards
│   │       └── register.py           # Participant registration & upsert
│   ├── models/                       # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── base.py                   # Declarative base
│   │   └── participant.py            # Participant model (strictly 3 intake fields)
│   ├── schemas/                      # Pydantic v2 schemas
│   │   ├── __init__.py
│   │   ├── common.py                 # Error envelopes
│   │   ├── health.py                 # Health probe response schema
│   │   ├── leaderboard.py            # Channel leaderboard schemas
│   │   └── participant.py            # Registration intake & read schemas
│   └── services/                     # Business logic layer
│       ├── __init__.py
│       ├── leaderboard_service.py    # Game channel registry & standby state
│       └── participant_service.py    # Atomic registration upsert logic
├── tests/                            # Automated test suite (25 tests)
│   ├── __init__.py
│   ├── conftest.py                   # In-memory SQLite fixtures & TestClient
│   ├── test_foundation.py            # Model metadata, AST, & config tests
│   ├── test_health.py                # Health & DB probe tests
│   ├── test_leaderboard.py           # 5-channel leaderboard & 404 tests
│   └── test_registration.py          # Atomic upsert, normalization, & validation tests
├── .env.example                      # Sample environment variables
├── .gitignore                        # Python & secret ignore rules
├── .python-version                   # Python 3.11.9 pin for Render
├── alembic.ini                       # Alembic configuration
├── requirements.txt                  # Production dependencies
└── requirements-dev.txt              # Test & dev dependencies
```

---

## API Endpoints (v1)

### 1. Health Probe (`GET /api/v1/health` & `GET /health`)
- Verifies system status, API version (`1.0.0`), environment, and runs a live database probe (`SELECT 1`).
- Returns `200 OK` (`status: "healthy"`, `database: "connected"`).
- Returns `503 Service Unavailable` (`status: "degraded"`, `database: "disconnected"`) if connectivity fails.

### 2. Participant Registration (`POST /api/v1/register`)
- Strictly 3 user-facing intake fields: `fullName`, `collegeId`, `collegeName`. Extra fields are forbidden (`extra="forbid"`).
- College IDs are case-insensitive and normalized to uppercase.
- Duplicate College ID submissions update the existing participant record rather than creating a duplicate row.
- New registration returns `HTTP 201 Created` (`action: "created"`).
- Existing registration update returns `HTTP 200 OK` (`action: "updated"`).

### 3. Game Channel Leaderboard (`GET /api/v1/games/{game_id}/leaderboard`)
- Strictly dedicated leaderboards for the five confirmed game slots (`game-01` through `game-05`).
- No stage-wise leaderboards exist.
- Pre-event standby status truthfully returns `status: "standby"` and empty standings `[]`.
- Unrecognized game IDs return `HTTP 404 Not Found`.

---

## Local Setup & Development Instructions

### 1. Virtual Environment Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
```

### 2. Running the API Locally
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Running Automated Tests
```bash
pytest backend/tests -v
```
All 25 automated unit and integration tests run in under 0.2 seconds against isolated in-memory test databases.
