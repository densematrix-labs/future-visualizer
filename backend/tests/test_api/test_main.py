import pytest


@pytest.mark.asyncio
async def test_health(client):
    """Test health endpoint."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "tool" in data


@pytest.mark.asyncio
async def test_root(client):
    """Test root endpoint."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Future Visualizer API"
    assert "version" in data


@pytest.mark.asyncio
async def test_metrics(client):
    """Test metrics endpoint."""
    response = await client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text
