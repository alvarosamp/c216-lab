from decimal import Decimal

from sqlalchemy import CheckConstraint, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_transactions_amount_positive"),
        CheckConstraint("type IN ('income', 'expense')", name="ck_transactions_type"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(100))
    amount: Mapped[Decimal] = mapped_column(Numeric())
    type: Mapped[str] = mapped_column(String(7))
    category: Mapped[str | None] = mapped_column(String(50))
