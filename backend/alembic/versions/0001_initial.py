"""Initial catalog and simulation schema.

Revision ID: 0001_initial
Revises:
"""

import sqlalchemy as sa

from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "market_series",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("symbol", sa.String(24), nullable=False, unique=True),
        sa.Column("description", sa.String(500), nullable=False),
    )
    op.create_table(
        "strategies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("kind", sa.String(20), nullable=False),
        sa.Column("initial_capital", sa.Numeric(18, 2), nullable=False),
        sa.Column("monthly_contribution", sa.Numeric(18, 2), nullable=False),
    )
    op.create_table(
        "price_points",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "series_id",
            sa.Integer(),
            sa.ForeignKey("market_series.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("price", sa.Numeric(18, 6), nullable=False),
        sa.UniqueConstraint("series_id", "day"),
    )
    op.create_table(
        "simulations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "series_id",
            sa.Integer(),
            sa.ForeignKey("market_series.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "strategy_id",
            sa.Integer(),
            sa.ForeignKey("strategies.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("invested", sa.Numeric(18, 2), nullable=False),
        sa.Column("final_value", sa.Numeric(18, 2), nullable=False),
        sa.Column("return_pct", sa.Numeric(12, 4), nullable=False),
        sa.Column("max_drawdown_pct", sa.Numeric(12, 4), nullable=False),
        sa.Column("volatility_pct", sa.Numeric(12, 4), nullable=False),
        sa.Column("curve", sa.JSON(), nullable=False),
    )


def downgrade():
    op.drop_table("simulations")
    op.drop_table("price_points")
    op.drop_table("strategies")
    op.drop_table("market_series")
