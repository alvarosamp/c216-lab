from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self) -> list[Transaction]:
        return list(self.session.scalars(select(Transaction).order_by(Transaction.id)))

    def get(self, transaction_id: int) -> Transaction | None:
        return self.session.get(Transaction, transaction_id)

    def save(self, transaction: Transaction) -> Transaction:
        self.session.add(transaction)
        try:
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise
        self.session.refresh(transaction)
        return transaction

    def delete(self, transaction_id: int) -> None:
        transaction = self.get(transaction_id)
        if transaction is not None:
            self.session.delete(transaction)
            try:
                self.session.commit()
            except Exception:
                self.session.rollback()
                raise
