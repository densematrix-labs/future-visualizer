from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class GenerationToken(Base):
    __tablename__ = "generation_tokens"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String(255), nullable=False, index=True)
    tokens_remaining = Column(Integer, default=0)
    tokens_purchased = Column(Integer, default=0)
    free_trial_used = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
