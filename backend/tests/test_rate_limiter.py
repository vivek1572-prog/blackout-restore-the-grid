"""
BLACKOUT: RESTORE THE GRID
Rate Limiter Unit & Integration Tests (120 req/min/IP)
Sphinx @ MNIT Jaipur
"""

import pytest
from app.core.limiter import limiter


@pytest.fixture(autouse=True)
def reset_limiter_state():
    """Ensure rate limiter storage is fresh before each test."""
    limiter.reset()
    yield
    limiter.reset()


def test_requests_below_limit_succeed(client):
    """Verify that requests below the 120 req/min ceiling succeed normally."""
    for i in range(5):
        payload = {
            "fullName": f"Operator {i}",
            "collegeId": f"2024TEST{i:04d}",
            "collegeName": "MNIT Jaipur",
        }
        res = client.post("/api/v1/register", json=payload)
        assert res.status_code == 201
        assert res.json()["success"] is True


def test_fifty_students_sharing_campus_wifi_ip_succeed(client):
    """
    Verify that 50 legitimate students registering from the SAME campus Wi-Fi public IP
    can all successfully register without triggering any rate limit lockout.
    """
    campus_ip = "172.16.42.1"
    for i in range(50):
        payload = {
            "fullName": f"Student {i}",
            "collegeId": f"2024UMT{i:04d}",
            "collegeName": "MNIT Jaipur",
        }
        headers = {"X-Forwarded-For": campus_ip}
        res = client.post("/api/v1/register", json=payload, headers=headers)
        assert res.status_code == 201, f"Student {i} unexpectedly failed with status {res.status_code}"
        assert res.json()["success"] is True


def test_requests_exceeding_120_per_minute_receive_429(client):
    """
    Verify that sending more than 120 requests from a single IP within 1 minute
    triggers HTTP 429 Too Many Requests on the 121st request.
    """
    attacker_ip = "198.51.100.55"
    headers = {"X-Forwarded-For": attacker_ip}

    # Send exactly 120 requests
    for i in range(120):
        payload = {
            "fullName": f"Flood User {i}",
            "collegeId": f"2024FLOOD{i:04d}",
            "collegeName": "Testing Institute",
        }
        res = client.post("/api/v1/register", json=payload, headers=headers)
        assert res.status_code == 201, f"Request {i+1} failed before reaching limit"

    # 121st request MUST be rejected with HTTP 429
    blocked_payload = {
        "fullName": "Blocked User",
        "collegeId": "2024BLOCKED",
        "collegeName": "Testing Institute",
    }
    blocked_res = client.post("/api/v1/register", json=blocked_payload, headers=headers)
    assert blocked_res.status_code == 429

    # Verify standardized JSON error envelope
    data = blocked_res.json()
    assert "error" in data
    assert data["error"]["code"] == "RATE_LIMIT_EXCEEDED"
    assert "120 per 1 minute" in data["error"]["message"]
    assert blocked_res.headers.get("Retry-After") == "60"


def test_ip_isolation_different_ips_not_affected(client):
    """
    Verify that one IP hitting the rate limit does NOT block a different IP.
    """
    bad_ip = "192.0.2.1"
    good_ip = "192.0.2.2"

    bad_headers = {"X-Forwarded-For": bad_ip}
    good_headers = {"X-Forwarded-For": good_ip}

    # Exhaust bad_ip bucket (120 requests)
    for i in range(120):
        client.post(
            "/api/v1/register",
            json={"fullName": f"Bad {i}", "collegeId": f"2024BAD{i:04d}", "collegeName": "MNIT"},
            headers=bad_headers,
        )

    # Bad IP is throttled
    bad_res = client.post(
        "/api/v1/register",
        json={"fullName": "Bad 121", "collegeId": "2024BAD0121", "collegeName": "MNIT"},
        headers=bad_headers,
    )
    assert bad_res.status_code == 429

    # Good IP can still register without issue
    good_res = client.post(
        "/api/v1/register",
        json={"fullName": "Good Student", "collegeId": "2024GOOD0001", "collegeName": "MNIT"},
        headers=good_headers,
    )
    assert good_res.status_code == 201
    assert good_res.json()["success"] is True


def test_rapid_burst_traffic_allowed_within_ceiling(client):
    """
    Verify that an instantaneous burst of 25 rapid submissions from one IP
    is processed cleanly without dropping.
    """
    for i in range(25):
        res = client.post(
            "/api/v1/register",
            json={"fullName": f"Burst {i}", "collegeId": f"2024BURST{i:04d}", "collegeName": "MNIT"},
        )
        assert res.status_code == 201


def test_duplicate_college_id_not_blocked_by_per_id_limit(client):
    """
    Verify that repeated submissions of the same College ID (e.g. name corrections)
    succeed and are not artificially blocked by a per-ID rate limiter.
    """
    payload_1 = {"fullName": "Rahul Verma", "collegeId": "2024UMT1099", "collegeName": "MNIT"}
    res_1 = client.post("/api/v1/register", json=payload_1)
    assert res_1.status_code == 201

    payload_2 = {"fullName": "Rahul K. Verma", "collegeId": "2024UMT1099", "collegeName": "MNIT"}
    res_2 = client.post("/api/v1/register", json=payload_2)
    assert res_2.status_code == 200
    assert res_2.json()["action"] == "updated"


def test_health_and_leaderboard_endpoints_unmetered(client):
    """
    Verify that rate limiting applies strictly to registration;
    health and leaderboard channels remain unmetered.
    """
    # Exhaust registration bucket for default client IP
    for i in range(120):
        client.post(
            "/api/v1/register",
            json={"fullName": f"U {i}", "collegeId": f"2024UNM{i:04d}", "collegeName": "MNIT"},
        )

    # Next registration is 429
    res_reg = client.post(
        "/api/v1/register",
        json={"fullName": "Blocked", "collegeId": "2024BLOCKED", "collegeName": "MNIT"},
    )
    assert res_reg.status_code == 429

    # But health checks and leaderboards respond with 200 OK
    res_health = client.get("/api/v1/health")
    assert res_health.status_code == 200

    res_root_health = client.get("/health")
    assert res_root_health.status_code == 200

    res_lb = client.get("/api/v1/games/game-01/leaderboard")
    assert res_lb.status_code == 200
