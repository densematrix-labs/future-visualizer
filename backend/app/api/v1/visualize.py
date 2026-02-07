from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_db
from app.api.v1.schemas import VisualizeRequest, VisualizeResponse, ErrorResponse
from app.services.llm_service import generate_future_vision
from app.services.token_service import can_use_generation, use_generation
from app.metrics import (
    core_function_calls,
    tokens_consumed,
    free_trial_used,
    TOOL_NAME,
)

router = APIRouter()


@router.post(
    "/visualize",
    response_model=VisualizeResponse,
    responses={402: {"model": ErrorResponse}},
)
async def visualize_future(
    request: VisualizeRequest,
    x_device_id: Optional[str] = Header(None, alias="X-Device-Id"),
    db: AsyncSession = Depends(get_db),
):
    """Generate a vision of what a concept will look like in 10 years."""
    
    if not x_device_id:
        raise HTTPException(status_code=400, detail="X-Device-Id header required")
    
    # Check if can use generation
    can_use, is_free_trial, remaining = await can_use_generation(db, x_device_id)
    
    if not can_use:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "No tokens remaining. Please purchase more.",
                "code": "payment_required",
                "payment_required": True,
            },
        )
    
    # Consume token
    success, remaining = await use_generation(db, x_device_id)
    if not success:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Failed to consume token",
                "code": "payment_required",
                "payment_required": True,
            },
        )
    
    # Track metrics
    core_function_calls.labels(tool=TOOL_NAME).inc()
    if is_free_trial:
        free_trial_used.labels(tool=TOOL_NAME).inc()
    else:
        tokens_consumed.labels(tool=TOOL_NAME).inc()
    
    # Generate vision
    try:
        vision = await generate_future_vision(request.concept, request.language)
    except Exception as e:
        # Refund token on error
        from app.services.token_service import add_tokens
        await add_tokens(db, x_device_id, 1)
        raise HTTPException(status_code=500, detail=f"Failed to generate vision: {str(e)}")
    
    return VisualizeResponse(
        title=vision.get("title", f"The Future of {request.concept}"),
        year=vision.get("year", 2036),
        summary=vision.get("summary", ""),
        sections=vision.get("sections", {}),
        key_changes=vision.get("key_changes", []),
        is_free_trial=is_free_trial,
        remaining_tokens=remaining,
    )
