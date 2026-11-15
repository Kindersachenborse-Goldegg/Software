from datetime import datetime

from pydantic import Field

from app.schemas.base import CamelModel, Price


class ItemCreate(CamelModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    price: Price
    size: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=255)


class ItemUpdate(CamelModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    price: Price | None = None
    size: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=255)
    deleted: bool | None = None


class ItemRead(CamelModel):
    id: int
    list_id: int
    name: str
    description: str | None
    price: Price
    size: str | None
    color: str | None
    barcode: str | None
    deleted: bool
    sold_at: datetime | None
    created_at: datetime
