from backend.models.transaction import TransactionResponse


class TransactionRepository:
    def __init__(self) -> None:
        self._transactions: dict[int, TransactionResponse] = {}
        self._next_id = 1

    def list(self) -> list[TransactionResponse]:
        return list(self._transactions.values())

    def get(self, transaction_id: int) -> TransactionResponse | None:
        return self._transactions.get(transaction_id)

    def save(self, transaction: TransactionResponse) -> TransactionResponse:
        self._transactions[transaction.id] = transaction
        return transaction

    def next_id(self) -> int:
        transaction_id = self._next_id
        self._next_id += 1
        return transaction_id

    def delete(self, transaction_id: int) -> None:
        del self._transactions[transaction_id]
