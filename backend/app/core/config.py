from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "RAKSHA-AI Decision Intelligence Platform"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api"
    API_BASE_URL: str = "http://localhost:8000"
    
    # Database: Default to sqlite file for zero-setup local dev/tests, overridable via DATABASE_URL
    DATABASE_URL: str = "sqlite:///./raksha_ai_v2.db"
    
    # CORS Origins
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Demo / Synthetic Marker
    DEMO_MODE: bool = True
    DATA_CLASSIFICATION: str = "DEMO / SYNTHETIC DATA"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
