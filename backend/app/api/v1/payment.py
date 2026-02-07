import hmac
import hashlib
import json
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
from typing import Optional

from app.database import get_db
from app.config import get_settings
from app.api.v1.schemas import CheckoutRequest, CheckoutResponse
from app.models.payment import PaymentTransaction
from app.services.token_service import add_tokens
from app.metrics import payment_success, payment_revenue, TOOL_NAME

router = APIRouter()
settings = get_settings()

# Product configuration
PRODUCTS = {
    "starter": {"tokens": 5, "price_cents": 499},
    "standard": {"tokens": 15, "price_cents": 999},
    "pro": {"tokens": 50, "price_cents": 2499},
}


def get_product_ids() -> dict:
    """Get Creem product IDs from config."""
    try:
        return json.loads(settings.creem_product_ids)
    except:
        return {}


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    request: CheckoutRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a Creem checkout session."""
    
    if request.product_sku not in PRODUCTS:
        raise HTTPException(status_code=400, detail=f"Invalid product: {request.product_sku}")
    
    product_ids = get_product_ids()
    if request.product_sku not in product_ids:
        raise HTTPException(status_code=400, detail="Product not configured in Creem")
    
    product = PRODUCTS[request.product_sku]
    creem_product_id = product_ids[request.product_sku]
    
    # Create checkout with Creem API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.creem.io/v1/checkouts",
            headers={
                "Authorization": f"Bearer {settings.creem_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "product_id": creem_product_id,
                "success_url": request.success_url or "https://future-visualizer.demo.densematrix.ai/payment/success",
                "cancel_url": request.cancel_url or "https://future-visualizer.demo.densematrix.ai/pricing",
                "metadata": {
                    "device_id": request.device_id,
                    "product_sku": request.product_sku,
                    "tokens": str(product["tokens"]),
                },
            },
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Creem API error: {response.text}")
        
        data = response.json()
    
    # Record transaction
    transaction = PaymentTransaction(
        checkout_id=data["id"],
        device_id=request.device_id,
        product_sku=request.product_sku,
        amount_cents=product["price_cents"],
        tokens_granted=product["tokens"],
        status="pending",
    )
    db.add(transaction)
    await db.commit()
    
    return CheckoutResponse(
        checkout_url=data["checkout_url"],
        checkout_id=data["id"],
    )


@router.post("/webhook")
async def handle_webhook(
    request: Request,
    creem_signature: Optional[str] = Header(None, alias="Creem-Signature"),
    db: AsyncSession = Depends(get_db),
):
    """Handle Creem webhook for payment completion."""
    
    body = await request.body()
    
    # Verify signature
    if settings.creem_webhook_secret:
        expected_sig = hmac.new(
            settings.creem_webhook_secret.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        
        if not creem_signature or not hmac.compare_digest(expected_sig, creem_signature):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    data = json.loads(body)
    event_type = data.get("type")
    
    if event_type == "checkout.completed":
        checkout = data.get("data", {})
        checkout_id = checkout.get("id")
        metadata = checkout.get("metadata", {})
        
        # Find transaction
        stmt = select(PaymentTransaction).where(PaymentTransaction.checkout_id == checkout_id)
        result = await db.execute(stmt)
        transaction = result.scalar_one_or_none()
        
        if transaction and transaction.status == "pending":
            # Update transaction
            transaction.status = "completed"
            from datetime import datetime
            transaction.completed_at = datetime.utcnow()
            
            # Add tokens
            device_id = metadata.get("device_id", transaction.device_id)
            tokens = int(metadata.get("tokens", transaction.tokens_granted))
            await add_tokens(db, device_id, tokens)
            
            await db.commit()
            
            # Track metrics
            payment_success.labels(tool=TOOL_NAME, product_sku=transaction.product_sku).inc()
            payment_revenue.labels(tool=TOOL_NAME).inc(transaction.amount_cents)
    
    return {"status": "ok"}


@router.get("/products")
async def get_products():
    """Get available products and pricing."""
    product_ids = get_product_ids()
    
    return {
        "products": [
            {
                "sku": sku,
                "tokens": info["tokens"],
                "price_cents": info["price_cents"],
                "available": sku in product_ids,
            }
            for sku, info in PRODUCTS.items()
        ]
    }
