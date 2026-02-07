import pytest
from unittest.mock import patch, AsyncMock


@pytest.mark.asyncio
async def test_visualize_requires_device_id(client):
    """Test that visualize requires device ID."""
    response = await client.post(
        "/api/v1/visualize",
        json={"concept": "iPhone", "language": "en"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_visualize_validates_language(client, device_id):
    """Test that visualize validates language."""
    response = await client.post(
        "/api/v1/visualize",
        headers={"X-Device-Id": device_id},
        json={"concept": "iPhone", "language": "invalid"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_visualize_validates_concept(client, device_id):
    """Test that visualize validates concept."""
    response = await client.post(
        "/api/v1/visualize",
        headers={"X-Device-Id": device_id},
        json={"concept": "", "language": "en"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_visualize_free_trial(client, device_id):
    """Test that free trial works."""
    mock_result = {
        "title": "The Future of iPhone",
        "year": 2036,
        "summary": "Test summary",
        "sections": {
            "technology": {"title": "Tech", "content": "Content"},
            "experience": {"title": "UX", "content": "Content"},
            "society": {"title": "Society", "content": "Content"},
            "wildcard": {"title": "Wildcard", "content": "Content"},
        },
        "key_changes": ["Change 1", "Change 2"],
    }
    
    with patch("app.api.v1.visualize.generate_future_vision", new_callable=AsyncMock) as mock:
        mock.return_value = mock_result
        
        response = await client.post(
            "/api/v1/visualize",
            headers={"X-Device-Id": device_id},
            json={"concept": "iPhone", "language": "en"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["is_free_trial"] is True
        assert data["title"] == "The Future of iPhone"


@pytest.mark.asyncio
async def test_visualize_second_request_requires_payment(client, device_id):
    """Test that second request requires payment."""
    mock_result = {
        "title": "Test",
        "year": 2036,
        "summary": "Test",
        "sections": {},
        "key_changes": [],
    }
    
    with patch("app.api.v1.visualize.generate_future_vision", new_callable=AsyncMock) as mock:
        mock.return_value = mock_result
        
        # First request (free trial)
        response1 = await client.post(
            "/api/v1/visualize",
            headers={"X-Device-Id": device_id},
            json={"concept": "iPhone", "language": "en"}
        )
        assert response1.status_code == 200
        
        # Second request (should require payment)
        response2 = await client.post(
            "/api/v1/visualize",
            headers={"X-Device-Id": device_id},
            json={"concept": "Twitter", "language": "en"}
        )
        assert response2.status_code == 402
