"""baseline

Revision ID: 38c04a208540
Revises:
Create Date: 2026-11-03 18:01:52.750201

"""

from collections.abc import Sequence

revision: str = "38c04a208540"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
