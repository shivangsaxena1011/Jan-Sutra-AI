from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator


class Settings(BaseSettings):
    app_name: str = "JAN-SUTRA AI API"
    environment: str = "development"
    database_url: str = "sqlite:///./jansutra.db"
    jwt_secret: str = "replace-this-development-secret-before-deploying-please"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,*"
    secure_cookies: bool = False
    model_path: str = "./artifacts/grievance_classifier.joblib"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode="after")
    def validate_production_secrets(self):
        if self.environment.lower() == "production" and (len(self.jwt_secret) < 32 or self.jwt_secret.startswith("replace-this")):
            raise ValueError("JWT_SECRET must be a unique secret of at least 32 characters in production")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
