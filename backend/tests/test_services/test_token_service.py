import pytest
from app.services.token_service import (
    get_or_create_token_record,
    can_use_generation,
    use_generation,
    add_tokens,
    get_token_status,
)


@pytest.mark.asyncio
async def test_get_or_create_token_record(db_session):
    """Test creating token record."""
    device_id = "test-device"
    token = await get_or_create_token_record(db_session, device_id)
    
    assert token is not None
    assert token.device_id == device_id
    assert token.tokens_remaining == 0
    assert token.free_trial_used is False


@pytest.mark.asyncio
async def test_can_use_generation_free_trial(db_session):
    """Test free trial availability."""
    device_id = "test-device"
    can_use, is_free_trial, remaining = await can_use_generation(db_session, device_id)
    
    assert can_use is True
    assert is_free_trial is True
    assert remaining == 0


@pytest.mark.asyncio
async def test_use_generation_consumes_free_trial(db_session):
    """Test that using generation consumes free trial."""
    device_id = "test-device"
    
    # Use free trial
    success, remaining = await use_generation(db_session, device_id)
    assert success is True
    
    # Check free trial is used
    can_use, is_free_trial, _ = await can_use_generation(db_session, device_id)
    assert can_use is False
    assert is_free_trial is False


@pytest.mark.asyncio
async def test_add_tokens(db_session):
    """Test adding tokens."""
    device_id = "test-device"
    
    # Add tokens
    new_total = await add_tokens(db_session, device_id, 10)
    assert new_total == 10
    
    # Check status
    status = await get_token_status(db_session, device_id)
    assert status["tokens_remaining"] == 10
    assert status["tokens_purchased"] == 10


@pytest.mark.asyncio
async def test_use_generation_with_tokens(db_session):
    """Test using generation with paid tokens."""
    device_id = "test-device"
    
    # Use free trial first
    await use_generation(db_session, device_id)
    
    # Add tokens
    await add_tokens(db_session, device_id, 5)
    
    # Use paid token
    success, remaining = await use_generation(db_session, device_id)
    assert success is True
    assert remaining == 4


@pytest.mark.asyncio
async def test_get_token_status(db_session):
    """Test getting token status."""
    device_id = "test-device"
    
    status = await get_token_status(db_session, device_id)
    
    assert status["device_id"] == device_id
    assert status["tokens_remaining"] == 0
    assert status["free_trial_available"] is True
