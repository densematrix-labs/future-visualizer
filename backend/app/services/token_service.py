from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.token import GenerationToken


async def get_or_create_token_record(db: AsyncSession, device_id: str) -> GenerationToken:
    """Get existing token record or create new one for device."""
    stmt = select(GenerationToken).where(GenerationToken.device_id == device_id)
    result = await db.execute(stmt)
    token = result.scalar_one_or_none()
    
    if not token:
        token = GenerationToken(device_id=device_id, tokens_remaining=0)
        db.add(token)
        await db.commit()
        await db.refresh(token)
    
    return token


async def can_use_generation(db: AsyncSession, device_id: str) -> tuple[bool, bool, int]:
    """
    Check if device can use a generation.
    
    Returns:
        tuple of (can_use, is_free_trial, remaining_tokens)
    """
    token = await get_or_create_token_record(db, device_id)
    
    # Check if free trial available
    if not token.free_trial_used:
        return True, True, token.tokens_remaining
    
    # Check if has paid tokens
    if token.tokens_remaining > 0:
        return True, False, token.tokens_remaining
    
    return False, False, 0


async def use_generation(db: AsyncSession, device_id: str) -> tuple[bool, int]:
    """
    Consume one generation token.
    
    Returns:
        tuple of (success, remaining_tokens)
    """
    token = await get_or_create_token_record(db, device_id)
    
    # Use free trial first
    if not token.free_trial_used:
        token.free_trial_used = True
        await db.commit()
        return True, token.tokens_remaining
    
    # Use paid tokens
    if token.tokens_remaining > 0:
        token.tokens_remaining -= 1
        await db.commit()
        return True, token.tokens_remaining
    
    return False, 0


async def add_tokens(db: AsyncSession, device_id: str, amount: int) -> int:
    """
    Add tokens to a device's account.
    
    Returns:
        New total tokens
    """
    token = await get_or_create_token_record(db, device_id)
    token.tokens_remaining += amount
    token.tokens_purchased += amount
    await db.commit()
    return token.tokens_remaining


async def get_token_status(db: AsyncSession, device_id: str) -> dict:
    """Get token status for a device."""
    token = await get_or_create_token_record(db, device_id)
    return {
        "device_id": device_id,
        "tokens_remaining": token.tokens_remaining,
        "tokens_purchased": token.tokens_purchased,
        "free_trial_used": token.free_trial_used,
        "free_trial_available": not token.free_trial_used,
    }
