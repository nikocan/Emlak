from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""

    # App
    APP_NAME: str = "Emlak API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://emlak:emlak123@postgres:5432/emlak"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Celery
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

    # Scraping
    SCRAPING_INTERVAL_HOURS: int = 6
    MAX_CONCURRENT_SCRAPERS: int = 5
    REQUEST_TIMEOUT: int = 30

    # Map
    DEFAULT_MAP_CENTER_LAT: float = 41.0082  # Istanbul
    DEFAULT_MAP_CENTER_LNG: float = 28.9784

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
