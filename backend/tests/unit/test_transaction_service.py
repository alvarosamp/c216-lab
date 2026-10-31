from decimal import Decimal
from unittest.mock import Mock

import pytest

from backend.models.transaction import Transaction
from backend.repositories.transaction_repository import TransactionRepository
from backend.schemas.transaction import (
    TransactionCreate,
    TransactionPatch,
    TransactionType,
    TransactionUpdate,
)
from backend.services.transaction_service import TransactionNotFound, TransactionService


@pytest.fixture
def repository() -> Mock:
    repository = Mock(spec=TransactionRepository)
    repository.save.side_effect = lambda transaction: transaction
    return repository


@pytest.fixture
def service(repository: Mock) -> TransactionService:
    return TransactionService(repository)


def create_data(
    description: str = "Mercado",
    transaction_type: TransactionType = TransactionType.EXPENSE,
) -> TransactionCreate:
    return TransactionCreate(
        description=description,
        amount=Decimal("80.00"),
        type=transaction_type,
        category="Alimentação",
    )


def test_create_sends_transaction_to_repository(
    service: TransactionService, repository: Mock
) -> None:
    transaction = service.create(create_data())

    assert transaction.description == "Mercado"
    repository.save.assert_called_once_with(transaction)


def test_list_can_filter_by_type(service: TransactionService, repository: Mock) -> None:
    repository.list.return_value = [
        Transaction(id=1, **create_data().model_dump()),
        Transaction(
            id=2, **create_data("Salário", TransactionType.INCOME).model_dump()
        ),
    ]

    transactions = service.list(TransactionType.INCOME)

    assert len(transactions) == 1
    assert transactions[0].description == "Salário"


def test_get_raises_when_transaction_does_not_exist(
    service: TransactionService,
    repository: Mock,
) -> None:
    repository.get.return_value = None
    with pytest.raises(TransactionNotFound):
        service.get(99)


def test_replace_changes_all_fields(
    service: TransactionService, repository: Mock
) -> None:
    transaction = Transaction(id=1, **create_data().model_dump())
    repository.get.return_value = transaction
    replacement = TransactionUpdate(
        description="Freelance",
        amount=Decimal("500.00"),
        type=TransactionType.INCOME,
        category="Trabalho",
    )

    updated = service.replace(transaction.id, replacement)

    assert updated.description == "Freelance"
    assert updated.type == TransactionType.INCOME


def test_patch_keeps_fields_not_sent(
    service: TransactionService, repository: Mock
) -> None:
    transaction = Transaction(id=1, **create_data().model_dump())
    repository.get.return_value = transaction

    updated = service.update(
        transaction.id,
        TransactionPatch(amount=Decimal("95.00")),
    )

    assert updated.amount == Decimal("95.00")
    assert updated.description == "Mercado"


def test_delete_removes_transaction(
    service: TransactionService, repository: Mock
) -> None:
    transaction = Transaction(id=1, **create_data().model_dump())
    repository.get.return_value = transaction

    service.delete(transaction.id)

    repository.delete.assert_called_once_with(transaction.id)
