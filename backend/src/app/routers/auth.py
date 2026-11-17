import secrets
from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select, text
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.core.deps import CurrentUser
from app.core.security import (
    DUMMY_HASH,
    create_access_token,
    hash_password,
    verify_password,
)
from app.models import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    UserRead,
)

router = APIRouter(tags=["auth"])

NICKNAME_WORDS = [
    "Apfel", "Birne", "Kirsche", "Traube", "Pflaume", "Banane", "Zitrone", "Melone",
    "Erdbeere", "Himbeere", "Igel", "Fuchs", "Dachs", "Eule", "Biber", "Hase",
    "Reh", "Otter", "Spatz", "Marder",
]  # fmt: skip

Db = Annotated[Session, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Db, settings: AppSettings) -> RegisterResponse:
    email = data.email.strip().lower()

    # one registration at a time, or two can both pass MAX_USERS or share a seller number
    db.execute(text("SELECT pg_advisory_xact_lock(1)"))

    if db.scalar(select(User.id).where(func.lower(User.email) == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "E-Mail wird bereits verwendet")

    seller_count = db.scalar(select(func.count()).where(User.role == "seller"))
    if seller_count >= settings.max_users:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "keine Plätze mehr frei")

    seller_number = (db.scalar(select(func.max(User.seller_number))) or 0) + 1
    nickname = f"{secrets.choice(NICKNAME_WORDS)}{seller_number}"

    db.add(
        User(
            email=email,
            username=nickname,
            password_hash=hash_password(data.password),
            firstname=data.firstname.strip(),
            lastname=data.lastname.strip(),
            phone=data.phone.strip(),
            city=data.city.strip(),
            tnc_accepted_at=datetime.now(UTC),
            seller_number=seller_number,
        )
    )
    db.commit()
    return RegisterResponse(nickname=nickname)


@router.post("/login")
def login(data: LoginRequest, db: Db) -> TokenResponse:
    username = data.username.strip()
    user = db.scalar(
        select(User).where(
            or_(func.lower(User.email) == username.lower(), User.username == username)
        )
    )

    # verify a hash even with no user, so timing doesn't reveal which accounts exist
    hashed = user.password_hash if user else DUMMY_HASH
    if not verify_password(data.password, hashed) or user is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Benutzername oder Passwort falsch"
        )

    return TokenResponse(token=create_access_token(user.id))


@router.get("/me")
def me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)
