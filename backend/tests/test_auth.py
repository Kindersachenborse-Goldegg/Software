from collections.abc import Iterator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import engine, get_db
from app.core.deps import AdminUser
from app.main import app
from app.models import User

# AdminUser has no route on the app, so the 403 check uses its own app
admin_app = FastAPI()


@admin_app.get("/admin-only")
def admin_only(user: AdminUser) -> dict:
    return {"id": user.id}


@pytest.fixture
def db() -> Iterator[Session]:
    with engine.connect() as connection:
        transaction = connection.begin()
        session = Session(bind=connection, join_transaction_mode="create_savepoint")
        yield session
        session.close()
        transaction.rollback()


@pytest.fixture
def client(db: Session) -> Iterator[TestClient]:
    for target in (app, admin_app):
        target.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    for target in (app, admin_app):
        target.dependency_overrides.clear()


def register_payload(email: str = "anna@example.com", **overrides) -> dict:
    return {
        "firstname": "Anna",
        "lastname": "Huber",
        "phone": "0664 1234567",
        "city": "Goldegg",
        "email": email,
        "password": "geheim123",
        "accept_tnc": True,
    } | overrides


def register_and_login(client: TestClient) -> tuple[str, str]:
    nickname = client.post("/api/register", json=register_payload()).json()["nickname"]
    token = client.post(
        "/api/login", json={"username": nickname, "password": "geheim123"}
    ).json()["token"]
    return nickname, token


def test_register_returns_nickname_with_seller_number(client: TestClient, db: Session):
    response = client.post("/api/register", json=register_payload())

    assert response.status_code == 201
    nickname = response.json()["nickname"]
    user = db.scalar(select(User).where(User.username == nickname))
    assert nickname.endswith(str(user.seller_number))
    assert user.password_hash != "geheim123"
    assert user.tnc_accepted_at is not None


def test_register_duplicate_email_is_409(client: TestClient):
    client.post("/api/register", json=register_payload())

    response = client.post("/api/register", json=register_payload("ANNA@example.com"))

    assert response.status_code == 409


def test_register_without_tnc_is_rejected(client: TestClient):
    response = client.post("/api/register", json=register_payload(accept_tnc=False))

    assert response.status_code == 422


def test_register_when_full_is_403(client: TestClient, db: Session):
    sellers = db.scalar(select(func.count()).where(User.role == "seller"))
    full = get_settings().model_copy(update={"max_users": sellers + 1})
    app.dependency_overrides[get_settings] = lambda: full

    first = client.post("/api/register", json=register_payload("a@example.com"))
    second = client.post("/api/register", json=register_payload("b@example.com"))

    assert first.status_code == 201
    assert second.status_code == 403


@pytest.mark.parametrize("use_email", [True, False])
def test_login_with_email_or_nickname(client: TestClient, use_email: bool):
    nickname = client.post("/api/register", json=register_payload()).json()["nickname"]
    username = "anna@example.com" if use_email else nickname

    response = client.post(
        "/api/login", json={"username": username, "password": "geheim123"}
    )

    assert response.status_code == 200
    assert response.json()["token"]


@pytest.mark.parametrize("username", ["anna@example.com", "niemand@example.com"])
def test_login_with_wrong_credentials_is_401(client: TestClient, username: str):
    client.post("/api/register", json=register_payload())

    response = client.post(
        "/api/login", json={"username": username, "password": "falsch"}
    )

    assert response.status_code == 401


def test_me_needs_a_valid_token(client: TestClient):
    nickname, token = register_and_login(client)

    assert client.get("/api/me").status_code == 401
    bad = client.get("/api/me", headers={"Authorization": "Bearer kaputt"})
    assert bad.status_code == 401

    response = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["nickname"] == nickname
    assert "passwordHash" not in body


def test_admin_route_is_403_for_a_seller(client: TestClient):
    _, token = register_and_login(client)
    admin_client = TestClient(admin_app)

    response = admin_client.get(
        "/admin-only", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
