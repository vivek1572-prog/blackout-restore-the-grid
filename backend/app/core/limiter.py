"""
BLACKOUT: RESTORE THE GRID
Rate Limiter Configuration & Factory
Sphinx @ MNIT Jaipur
"""

from fastapi import Request
from slowapi import Limiter


def get_client_ip(request: Request) -> str:
    """
    Extract client IP address for rate limiting.
    Resolves client IP from reverse-proxy headers (Render / Cloudflare)
    when present, falling back to direct connection socket host.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # In a proxy chain ("client, proxy1, proxy2"), the first entry is the client IP.
        # Render's edge proxy sets this header for all incoming web requests.
        ip = forwarded.split(",")[0].strip()
        if ip:
            return ip

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    if request.client and request.client.host:
        return request.client.host

    return "127.0.0.1"


# Centralized in-memory SlowAPI limiter
# Keyed on resolved client IP; uses in-process memory storage
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=[],
    headers_enabled=True,
    storage_uri="memory://",
)
