"""add users, lists and items

Revision ID: b8dcac6734d5
Revises: 38c04a208540
Create Date: 2026-11-12 14:48:11.016534

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b8dcac6734d5"
down_revision: Union[str, Sequence[str], None] = "38c04a208540"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("username", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.String(length=20),
            server_default=sa.text("'seller'"),
            nullable=False,
        ),
        sa.Column("seller_number", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_users")),
        sa.UniqueConstraint("email", name=op.f("uq_users_email")),
        sa.UniqueConstraint("seller_number", name=op.f("uq_users_seller_number")),
        sa.UniqueConstraint("username", name=op.f("uq_users_username")),
    )
    op.create_table(
        "lists",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_lists_user_id_users"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_lists")),
    )
    op.create_index(op.f("ix_lists_user_id"), "lists", ["user_id"], unique=False)
    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("list_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("size", sa.String(length=255), nullable=True),
        sa.Column("color", sa.String(length=255), nullable=True),
        sa.Column("barcode", sa.String(length=255), nullable=True),
        sa.Column("sold_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["list_id"],
            ["lists.id"],
            name=op.f("fk_items_list_id_lists"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_items")),
    )
    op.create_index(op.f("ix_items_barcode"), "items", ["barcode"], unique=True)
    op.create_index(op.f("ix_items_list_id"), "items", ["list_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_items_list_id"), table_name="items")
    op.drop_index(op.f("ix_items_barcode"), table_name="items")
    op.drop_table("items")
    op.drop_index(op.f("ix_lists_user_id"), table_name="lists")
    op.drop_table("lists")
    op.drop_table("users")
