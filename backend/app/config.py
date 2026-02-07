from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""
    
    # App
    app_name: str = "Future Visualizer"
    debug: bool = False
    
    # LLM Proxy
    llm_proxy_url: str = "https://llm-proxy.densematrix.ai"
    llm_proxy_key: str = ""
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./data/app.db"
    
    # Creem Payment
    creem_api_key: str = ""
    creem_webhook_secret: str = ""
    creem_product_ids: str = "{}"  # JSON string
    
    # Tool name for metrics
    tool_name: str = "future-visualizer"
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
