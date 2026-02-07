import pytest


@pytest.mark.asyncio
async def test_get_token_status(client, device_id):
    """Test getting token status."""
    response = await client.get(
        "/api/v1/tokens/status",
        headers={"X-Device-Id": device_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["device_id"] == device_id
    assert data["tokens_remaining"] == 0
    assert data["free_trial_available"] is True


@pytest.mark.asyncio
async def test_get_token_status_no_device_id(client):
    """Test getting token status without device ID."""
    response = await client.get("/api/v1/tokens/status")
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_token_status_persists(client, device_id):
    """Test that token status persists across requests."""
    # First request
    response1 = await client.get(
        "/api/v1/tokens/status",
        headers={"X-Device-Id": device_id}
    )
    assert response1.status_code == 200
    
    # Second request
    response2 = await client.get(
        "/api/v1/tokens/status",
        headers={"X-Device-Id": device_id}
    )
    assert response2.status_code == 200
    
    # Same data
    assert response1.json() == response2.json()
