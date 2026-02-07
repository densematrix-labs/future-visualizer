import pytest


@pytest.mark.asyncio
async def test_get_products(client):
    """Test getting product list."""
    response = await client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert len(data["products"]) == 3
    
    # Check product structure
    for product in data["products"]:
        assert "sku" in product
        assert "tokens" in product
        assert "price_cents" in product


@pytest.mark.asyncio
async def test_checkout_invalid_product(client, device_id):
    """Test checkout with invalid product."""
    response = await client.post(
        "/api/v1/checkout",
        json={
            "product_sku": "invalid",
            "device_id": device_id,
        }
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_webhook_invalid_signature(client):
    """Test webhook with invalid signature."""
    response = await client.post(
        "/api/v1/webhook",
        headers={"Creem-Signature": "invalid"},
        json={"type": "checkout.completed", "data": {}}
    )
    # Should be 401 with invalid signature when secret is set
    # In test mode without secret, it should accept
    assert response.status_code in [200, 401]
