from functools import lru_cache

from pydantic import Field, PositiveInt
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str

    max_users: PositiveInt
    max_lists_per_seller: PositiveInt
    max_items_per_list: PositiveInt

    secret_key: str = Field(min_length=32)
    access_token_expire_minutes: PositiveInt

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
