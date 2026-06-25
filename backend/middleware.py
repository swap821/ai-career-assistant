"""
middleware.py — Shared middleware and decorators for the AI Career Assistant API.

Provides reusable request/response handling utilities including
rate limiting helpers, CORS preflight handling, and request logging.
"""

import logging
import time
from functools import wraps
from flask import request, g

logger = logging.getLogger("career-api")


def log_requests(f):
    """
    Decorator to log incoming API requests with timing info.
    Logs method, endpoint, status code, and response time.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start = time.time()
        g.request_start = start

        response = f(*args, **kwargs)

        duration = (time.time() - start) * 1000  # ms
        status_code = response[1] if isinstance(response, tuple) else 200

        logger.info(
            "%s %s → %s (%.1fms)",
            request.method,
            request.path,
            status_code,
            duration,
        )
        return response

    return decorated_function


def validate_json(f):
    """
    Decorator to ensure request body is valid JSON.
    Returns 400 with error message if Content-Type is wrong or JSON is malformed.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method in ("POST", "PUT", "PATCH"):
            if not request.is_json:
                return {"error": "Content-Type must be application/json"}, 400
            if request.data and request.get_json(silent=True) is None:
                return {"error": "Invalid JSON in request body"}, 400
        return f(*args, **kwargs)

    return decorated_function


def handle_options(f):
    """
    Decorator to automatically respond to OPTIONS preflight requests.
    Useful for CORS-heavy endpoints.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == "OPTIONS":
            return "", 204
        return f(*args, **kwargs)

    return decorated_function
