from datetime import datetime
from typing import Literal

from pydantic import Field, field_validator

from app.schemas.base import CamelModel


class RegisterRequest(CamelModel):
    firstname: str = Field(min_length=1, max_length=255)
    lastname: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=50)
    city: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255, pattern=r"^[^@\s]+@[^@\s]+$")
    password: str = Field(min_length=8, max_length=255)
    accept_tnc: Literal[True]

    @field_validator("firstname", "lastname", "phone", "city", mode="before")
    @classmethod
    def strip_text(cls, value: object) -> object:
        # min_length runs after this, so a field of only spaces is rejected
        if isinstance(value, str):
            return value.strip()
        return value


class RegisterResponse(CamelModel):
    nickname: str


class LoginRequest(CamelModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class TokenResponse(CamelModel):
    token: str


class UserRead(CamelModel):
    id: int
    email: str
    nickname: str = Field(validation_alias="username")
    firstname: str
    lastname: str
    phone: str
    city: str
    role: str
    seller_number: int | None
    tnc_accepted_at: datetime
