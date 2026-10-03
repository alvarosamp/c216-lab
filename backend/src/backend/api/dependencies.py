from backend.repositories.transaction_repository import TransactionRepository
from backend.services.transaction_service import TransactionService

repository = TransactionRepository()
service = TransactionService(repository)


def get_transaction_service() -> TransactionService:
    return service
