from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.repositories.transaction_repository import TransactionRepository
from backend.services.transaction_service import TransactionService


def get_transaction_service(
    session: Annotated[Session, Depends(get_db)],
) -> TransactionService:
    return TransactionService(TransactionRepository(session))
