from decimal import Decimal

import pytest

from backend.models.transaction import (
    TransactionCreate,
    TransactionPatch,
    TransactionType,
    TransactionUpdate,
)
from backend.repositories.transaction_repository import TransactionRepository
from backend.services.transaction_service import TransactionNotFound, TransactionService


@pytest.fixture
def service() -> TransactionService:
    return TransactionService(TransactionRepository())


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


def test_create_assigns_an_id(service: TransactionService) -> None:
    transaction = service.create(create_data())

    assert transaction.id == 1
    assert transaction.description == "Mercado"


def test_list_can_filter_by_type(service: TransactionService) -> None:
    service.create(create_data())
    service.create(create_data("Salário", TransactionType.INCOME))

    transactions = service.list(TransactionType.INCOME)

    assert len(transactions) == 1
    assert transactions[0].description == "Salário"


def test_get_raises_when_transaction_does_not_exist(
    service: TransactionService,
) -> None:
    with pytest.raises(TransactionNotFound):
        service.get(99)


def test_replace_changes_all_fields(service: TransactionService) -> None:
    transaction = service.create(create_data())
    replacement = TransactionUpdate(
        description="Freelance",
        amount=Decimal("500.00"),
        type=TransactionType.INCOME,
        category="Trabalho",
    )

    updated = service.replace(transaction.id, replacement)

    assert updated.description == "Freelance"
    assert updated.type == TransactionType.INCOME


def test_patch_keeps_fields_not_sent(service: TransactionService) -> None:
    transaction = service.create(create_data())

    updated = service.update(
        transaction.id,
        TransactionPatch(amount=Decimal("95.00")),
    )

    assert updated.amount == Decimal("95.00")
    assert updated.description == "Mercado"


def test_delete_removes_transaction(service: TransactionService) -> None:
    transaction = service.create(create_data())

    service.delete(transaction.id)

    with pytest.raises(TransactionNotFound):
        service.get(transaction.id)
