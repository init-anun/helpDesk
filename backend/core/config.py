from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):

    DATABASE_URL: str

    API_PREFIX: str = "/api"
    DEBUG: bool = False

    ALLOWED_ORIGINS: str = ""

    # OPENAI_API_KEY: str

    # GEMINI_API_KEY: str

    # GROQ_API_KEY: str
    
    # Auth
    SECRET_KEY: str = "change-this-to-a-long-random-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 1  #  1 out of 24 hours

    # model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) ->List[str]:
        return v.split(",") if v else []

    
settings = Settings()

print("DATABASE_URL:", settings.DATABASE_URL)