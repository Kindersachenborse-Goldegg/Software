from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel


class RegisterRequest(CamelModel):
    firstname: str = Field(min_length=1, max_length=255)
    lastname: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=50)
    city: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255, pattern=r"^[^@\s]+@[^@\s]+$")
    password: str = Field(min_length=8, max_length=255)
    # the frontend sends this one in snake_case
    accept_tnc: Literal[True] = Field(alias="accept_tnc")


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
