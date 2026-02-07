import os
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import APIRouter
from fastapi.responses import Response

TOOL_NAME = os.getenv("TOOL_NAME", "future-visualizer")

# HTTP metrics
http_requests = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["tool", "endpoint", "method", "status"]
)

http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["tool", "endpoint", "method"]
)

# Payment metrics
payment_success = Counter(
    "payment_success_total",
    "Successful payments",
    ["tool", "product_sku"]
)

payment_revenue = Counter(
    "payment_revenue_cents_total",
    "Total revenue in cents",
    ["tool"]
)

# Token metrics
tokens_consumed = Counter(
    "tokens_consumed_total",
    "Tokens consumed",
    ["tool"]
)

free_trial_used = Counter(
    "free_trial_used_total",
    "Free trials used",
    ["tool"]
)

# Core function metrics
core_function_calls = Counter(
    "core_function_calls_total",
    "Core function (visualize) calls",
    ["tool"]
)

# SEO metrics
page_views = Counter(
    "page_views_total",
    "Page views",
    ["tool", "page"]
)

crawler_visits = Counter(
    "crawler_visits_total",
    "Crawler visits",
    ["tool", "bot"]
)

programmatic_pages = Gauge(
    "programmatic_pages_count",
    "Number of programmatic SEO pages",
    ["tool"]
)

# Router
metrics_router = APIRouter()


@metrics_router.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )
