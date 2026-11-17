from functools import lru_cache

from pydantic import PositiveInt
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # no default on purpose, the app should fail loudly if it's not configured
    database_url: str

    max_users: PositiveInt
    max_lists_per_seller: PositiveInt
    max_items_per_list: PositiveInt

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
