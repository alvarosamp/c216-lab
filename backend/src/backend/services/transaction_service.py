from backend.models.transaction import Transaction
from backend.repositories.transaction_repository import TransactionRepository
from backend.schemas.transaction import (
    TransactionCreate,
    TransactionPatch,
    TransactionType,
    TransactionUpdate,
)


class TransactionNotFound(Exception):
    pass


class TransactionService:
    def __init__(self, repository: TransactionRepository) -> None:
        self.repository = repository

    def list(
        self, transaction_type: TransactionType | None = None
    ) -> list[Transaction]:
        transactions = self.repository.list()
        if transaction_type is None:
            return transactions
        return [item for item in transactions if item.type == transaction_type]

    def get(self, transaction_id: int) -> Transaction:
        transaction = self.repository.get(transaction_id)
        if transaction is None:
            raise TransactionNotFound
        return transaction

    def create(self, data: TransactionCreate) -> Transaction:
        transaction = Transaction(**data.model_dump())
        return self.repository.save(transaction)

    def replace(self, transaction_id: int, data: TransactionUpdate) -> Transaction:
        transaction = self.get(transaction_id)
        for field, value in data.model_dump().items():
            setattr(transaction, field, value)
        return self.repository.save(transaction)

    def update(self, transaction_id: int, data: TransactionPatch) -> Transaction:
        transaction = self.get(transaction_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(transaction, field, value)
        return self.repository.save(transaction)

    def delete(self, transaction_id: int) -> None:
        self.get(transaction_id)
        self.repository.delete(transaction_id)
