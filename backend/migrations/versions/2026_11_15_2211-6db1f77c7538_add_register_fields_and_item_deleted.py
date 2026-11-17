"""add register fields and item deleted

Revision ID: 6db1f77c7538
Revises: b8dcac6734d5
Create Date: 2026-11-15 22:11:07.401967

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "6db1f77c7538"
down_revision: Union[str, Sequence[str], None] = "b8dcac6734d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "items",
        sa.Column(
            "deleted", sa.Boolean(), server_default=sa.text("false"), nullable=False
        ),
    )
    op.add_column(
        "users", sa.Column("firstname", sa.String(length=255), nullable=False)
    )
    op.add_column("users", sa.Column("lastname", sa.String(length=255), nullable=False))
    op.add_column("users", sa.Column("phone", sa.String(length=50), nullable=False))
    op.add_column("users", sa.Column("city", sa.String(length=255), nullable=False))
    op.add_column(
        "users",
        sa.Column("tnc_accepted_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_column("users", "tnc_accepted_at")
    op.drop_column("users", "city")
    op.drop_column("users", "phone")
    op.drop_column("users", "lastname")
    op.drop_column("users", "firstname")
    op.drop_column("items", "deleted")
