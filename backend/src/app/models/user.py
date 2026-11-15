from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    username: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    firstname: Mapped[str] = mapped_column(String(255))
    lastname: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(50))
    city: Mapped[str] = mapped_column(String(255))
    tnc_accepted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    role: Mapped[str] = mapped_column(
        String(20), default="seller", server_default="seller"
    )
    seller_number: Mapped[int | None] = mapped_column(unique=True)

    lists: Mapped[list["List"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
