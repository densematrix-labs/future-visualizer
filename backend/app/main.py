import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import init_db
from app.api.v1 import visualize, tokens, payment
from app.metrics import (
    metrics_router,
    http_requests,
    http_request_duration,
    crawler_visits,
    TOOL_NAME,
)

settings = get_settings()

# Bot patterns for crawler detection
BOT_PATTERNS = [
    "Googlebot", "bingbot", "Baiduspider", "YandexBot", 
    "DuckDuckBot", "Slurp", "facebookexternalhit", "Twitterbot",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    await init_db()
    yield


app = FastAPI(
    title="Future Visualizer API",
    description="AI-powered tool to visualize what any concept will look like in 10 years",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    """Track HTTP metrics and detect crawlers."""
    start_time = time.time()
    
    # Detect crawlers
    ua = request.headers.get("user-agent", "")
    for bot in BOT_PATTERNS:
        if bot.lower() in ua.lower():
            crawler_visits.labels(tool=TOOL_NAME, bot=bot).inc()
            break
    
    response = await call_next(request)
    
    # Track metrics
    duration = time.time() - start_time
    endpoint = request.url.path
    method = request.method
    status = response.status_code
    
    http_requests.labels(
        tool=TOOL_NAME,
        endpoint=endpoint,
        method=method,
        status=status,
    ).inc()
    
    http_request_duration.labels(
        tool=TOOL_NAME,
        endpoint=endpoint,
        method=method,
    ).observe(duration)
    
    return response


# Routes
app.include_router(metrics_router)
app.include_router(visualize.router, prefix="/api/v1", tags=["visualize"])
app.include_router(tokens.router, prefix="/api/v1", tags=["tokens"])
app.include_router(payment.router, prefix="/api/v1", tags=["payment"])


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "tool": TOOL_NAME}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Future Visualizer API",
        "version": "1.0.0",
        "docs": "/docs",
    }
