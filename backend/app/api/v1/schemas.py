from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class VisualizeRequest(BaseModel):
    concept: str = Field(..., min_length=1, max_length=500, description="Product/website/concept to visualize")
    language: str = Field(default="en", pattern="^(en|zh|ja|de|fr|ko|es)$")


class SectionContent(BaseModel):
    title: str
    content: str


class VisualizeResponse(BaseModel):
    title: str
    year: int
    summary: str
    sections: dict[str, SectionContent]
    key_changes: List[str]
    is_free_trial: bool
    remaining_tokens: int


class TokenStatusResponse(BaseModel):
    device_id: str
    tokens_remaining: int
    tokens_purchased: int
    free_trial_used: bool
    free_trial_available: bool


class CheckoutRequest(BaseModel):
    product_sku: str
    device_id: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class CheckoutResponse(BaseModel):
    checkout_url: str
    checkout_id: str


class ErrorResponse(BaseModel):
    error: str
    code: str
    payment_required: bool = False
