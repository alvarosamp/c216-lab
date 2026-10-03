from backend.models.transaction import (
    TransactionCreate,
    TransactionPatch,
    TransactionResponse,
    TransactionType,
    TransactionUpdate,
)
from backend.repositories.transaction_repository import TransactionRepository


class TransactionNotFound(Exception):
    pass


class TransactionService:
    def __init__(self, repository: TransactionRepository) -> None:
        self.repository = repository

    def list(
        self, transaction_type: TransactionType | None = None
    ) -> list[TransactionResponse]:
        transactions = self.repository.list()
        if transaction_type is None:
            return transactions
        return [item for item in transactions if item.type == transaction_type]

    def get(self, transaction_id: int) -> TransactionResponse:
        transaction = self.repository.get(transaction_id)
        if transaction is None:
            raise TransactionNotFound
        return transaction

    def create(self, data: TransactionCreate) -> TransactionResponse:
        transaction = TransactionResponse(
            id=self.repository.next_id(), **data.model_dump()
        )
        return self.repository.save(transaction)

    def replace(
        self, transaction_id: int, data: TransactionUpdate
    ) -> TransactionResponse:
        self.get(transaction_id)
        transaction = TransactionResponse(id=transaction_id, **data.model_dump())
        return self.repository.save(transaction)

    def update(
        self, transaction_id: int, data: TransactionPatch
    ) -> TransactionResponse:
        current = self.get(transaction_id)
        values = current.model_dump()
        values.update(data.model_dump(exclude_unset=True))
        transaction = TransactionResponse(**values)
        return self.repository.save(transaction)

    def delete(self, transaction_id: int) -> None:
        self.get(transaction_id)
        self.repository.delete(transaction_id)
