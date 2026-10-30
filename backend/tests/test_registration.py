"""
BLACKOUT: RESTORE THE GRID
Registration API & Atomic Upsert Tests (Phase 3B.2)
Sphinx @ MNIT Jaipur
"""

from sqlalchemy import select
from app.models.participant import Participant


def test_register_new_participant_success(client, db_session):
    """Verify that a valid submission registers a new participant with HTTP 201 Created."""
    payload = {
        "fullName": "Alex Sharma",
        "collegeId": "2024umt1042",
        "collegeName": "MNIT Jaipur",
    }
    response = client.post("/api/v1/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["action"] == "created"

    operator = data["operator"]
    assert operator["fullName"] == "Alex Sharma"
    assert operator["collegeId"] == "2024UMT1042"  # Normalized to uppercase
    assert operator["collegeName"] == "MNIT Jaipur"
    assert "id" in operator
    assert "registeredAt" in operator
    assert "updatedAt" in operator

    # Verify persisted in database
    participants = db_session.execute(select(Participant)).scalars().all()
    assert len(participants) == 1
    assert participants[0].college_id == "2024UMT1042"


def test_duplicate_college_id_updates_existing_record(client, db_session):
    """
    Verify the confirmed duplicate policy:
    If College ID already exists, update the record with HTTP 200 OK.
    Do not create a duplicate row.
    """
    initial_payload = {
        "fullName": "Alex Sharma",
        "collegeId": "2024UMT1042",
        "collegeName": "MNIT Jaipur",
    }
    first_resp = client.post("/api/v1/register", json=initial_payload)
    assert first_resp.status_code == 201
    initial_id = first_resp.json()["operator"]["id"]

    # Submit with same College ID in lowercase and updated details
    update_payload = {
        "fullName": "Alexander Sharma",
        "collegeId": "2024umt1042",  # lowercase should match normalized uppercase
        "collegeName": "MNIT Jaipur (ECE Department)",
    }
    second_resp = client.post("/api/v1/register", json=update_payload)

    assert second_resp.status_code == 200
    update_data = second_resp.json()
    assert update_data["success"] is True
    assert update_data["action"] == "updated"

    updated_operator = update_data["operator"]
    assert updated_operator["id"] == initial_id  # Same record ID preserved
    assert updated_operator["fullName"] == "Alexander Sharma"
    assert updated_operator["collegeName"] == "MNIT Jaipur (ECE Department)"
    assert updated_operator["collegeId"] == "2024UMT1042"

    # Verify strictly 1 row in the database
    participants = db_session.execute(select(Participant)).scalars().all()
    assert len(participants) == 1
    assert participants[0].id == participants[0].id
    assert participants[0].full_name == "Alexander Sharma"


def test_missing_required_fields_rejected(client):
    """Verify that omitting any of the strictly 3 required fields fails with 422."""
    # Missing collegeId
    res1 = client.post("/api/v1/register", json={"fullName": "Alex", "collegeName": "MNIT"})
    assert res1.status_code == 422

    # Missing fullName
    res2 = client.post("/api/v1/register", json={"collegeId": "2024UMT1042", "collegeName": "MNIT"})
    assert res2.status_code == 422

    # Missing collegeName
    res3 = client.post("/api/v1/register", json={"fullName": "Alex", "collegeId": "2024UMT1042"})
    assert res3.status_code == 422


def test_blank_or_whitespace_strings_rejected(client):
    """Verify that blank or whitespace-only strings fail validation with 422."""
    payload = {
        "fullName": "   ",
        "collegeId": "2024UMT1042",
        "collegeName": "MNIT Jaipur",
    }
    response = client.post("/api/v1/register", json=payload)
    assert response.status_code == 422


def test_extra_unapproved_fields_strictly_forbidden(client):
    """Verify that unapproved fields (e.g. email, password, phone, scores) are strictly rejected with 422."""
    payload_with_email = {
        "fullName": "Alex Sharma",
        "collegeId": "2024UMT1042",
        "collegeName": "MNIT Jaipur",
        "email": "alex@example.com",
    }
    res_email = client.post("/api/v1/register", json=payload_with_email)
    assert res_email.status_code == 422

    payload_with_password = {
        "fullName": "Alex Sharma",
        "collegeId": "2024UMT1042",
        "collegeName": "MNIT Jaipur",
        "password": "secretpassword",
    }
    res_pwd = client.post("/api/v1/register", json=payload_with_password)
    assert res_pwd.status_code == 422


def test_whitespace_is_automatically_trimmed(client):
    """Verify that leading and trailing whitespace are trimmed from all 3 fields."""
    payload = {
        "fullName": "  Alex Sharma  ",
        "collegeId": "  2024umt1042  ",
        "collegeName": "  MNIT Jaipur  ",
    }
    response = client.post("/api/v1/register", json=payload)
    assert response.status_code == 201
    operator = response.json()["operator"]
    assert operator["fullName"] == "Alex Sharma"
    assert operator["collegeId"] == "2024UMT1042"
    assert operator["collegeName"] == "MNIT Jaipur"
