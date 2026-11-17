from datetime import datetime

from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.item import ItemRead


class ListCreate(CamelModel):
    name: str = Field(min_length=1, max_length=255)


class ListUpdate(CamelModel):
    name: str = Field(min_length=1, max_length=255)


class ListRead(CamelModel):
    id: int
    user_id: int
    name: str
    created_at: datetime
    items: list[ItemRead]
