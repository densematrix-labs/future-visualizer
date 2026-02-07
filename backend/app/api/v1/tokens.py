from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_db
from app.api.v1.schemas import TokenStatusResponse
from app.services.token_service import get_token_status

router = APIRouter()


@router.get("/tokens/status", response_model=TokenStatusResponse)
async def get_status(
    x_device_id: Optional[str] = Header(None, alias="X-Device-Id"),
    db: AsyncSession = Depends(get_db),
):
    """Get token status for a device."""
    if not x_device_id:
        raise HTTPException(status_code=400, detail="X-Device-Id header required")
    
    status = await get_token_status(db, x_device_id)
    return TokenStatusResponse(**status)
