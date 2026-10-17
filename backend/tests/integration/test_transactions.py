from decimal import Decimal
from http import HTTPStatus

from fastapi.testclient import TestClient


def transaction_payload(
    description: str = "Internet",
    amount: str = "120.50",
    transaction_type: str = "expense",
) -> dict[str, str]:
    return {
        "description": description,
        "amount": amount,
        "type": transaction_type,
        "category": "Contas",
    }


def create_transaction(client: TestClient, **values: str) -> dict:
    response = client.post("/transactions", json=transaction_payload(**values))
    assert response.status_code == HTTPStatus.CREATED
    return response.json()


def test_create_transaction(client: TestClient) -> None:
    transaction = create_transaction(client)

    assert transaction["id"] == 1
    assert transaction["description"] == "Internet"
    assert Decimal(transaction["amount"]) == Decimal("120.50")


def test_list_transactions_with_type_filter(client: TestClient) -> None:
    create_transaction(client)
    create_transaction(
        client,
        description="Salário",
        amount="3500.00",
        transaction_type="income",
    )

    response = client.get("/transactions", params={"type": "income"})

    assert response.status_code == HTTPStatus.OK
    assert len(response.json()) == 1
    assert response.json()[0]["description"] == "Salário"


def test_get_transaction_by_id(client: TestClient) -> None:
    transaction = create_transaction(client)

    response = client.get(f"/transactions/{transaction['id']}")

    assert response.status_code == HTTPStatus.OK
    assert response.json() == transaction


def test_get_unknown_transaction(client: TestClient) -> None:
    response = client.get("/transactions/999")

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()["detail"] == "Transaction 999 not found"


def test_replace_transaction(client: TestClient) -> None:
    transaction = create_transaction(client)
    payload = transaction_payload("Aluguel", "950.00")

    response = client.put(f"/transactions/{transaction['id']}", json=payload)

    assert response.status_code == HTTPStatus.OK
    assert response.json()["description"] == "Aluguel"
    assert Decimal(response.json()["amount"]) == Decimal("950.00")


def test_update_transaction(client: TestClient) -> None:
    transaction = create_transaction(client)

    response = client.patch(
        f"/transactions/{transaction['id']}",
        json={"category": "Serviços"},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json()["category"] == "Serviços"
    assert response.json()["description"] == "Internet"


def test_delete_transaction(client: TestClient) -> None:
    transaction = create_transaction(client)

    response = client.delete(f"/transactions/{transaction['id']}")

    assert response.status_code == HTTPStatus.NO_CONTENT
    assert client.get(f"/transactions/{transaction['id']}").status_code == 404


def test_rejects_invalid_transaction(client: TestClient) -> None:
    response = client.post(
        "/transactions",
        json=transaction_payload(amount="-10.00"),
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_rejects_empty_patch(client: TestClient) -> None:
    transaction = create_transaction(client)

    response = client.patch(f"/transactions/{transaction['id']}", json={})

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
