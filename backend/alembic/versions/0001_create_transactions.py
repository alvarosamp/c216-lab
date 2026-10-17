"""Cria a tabela de lançamentos financeiros."""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0001"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("description", sa.String(100), nullable=False),
        sa.Column("amount", sa.Numeric(), nullable=False),
        sa.Column("type", sa.String(7), nullable=False),
        sa.Column("category", sa.String(50), nullable=True),
        sa.CheckConstraint("amount > 0", name="ck_transactions_amount_positive"),
        sa.CheckConstraint(
            "type IN ('income', 'expense')", name="ck_transactions_type"
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("transactions")
