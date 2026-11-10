from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

# create_engine doesn't connect yet, it only connects on first use
engine = create_engine(get_settings().database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: one session per request, always closed after."""
    with SessionLocal() as db:
        yield db
