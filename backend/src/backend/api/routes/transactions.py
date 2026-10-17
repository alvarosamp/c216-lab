from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from backend.api.dependencies import get_transaction_service
from backend.models.transaction import (
    TransactionCreate,
    TransactionPatch,
    TransactionResponse,
    TransactionType,
    TransactionUpdate,
)
from backend.services.transaction_service import TransactionNotFound, TransactionService

router = APIRouter(prefix="/transactions", tags=["transactions"])
Service = Annotated[TransactionService, Depends(get_transaction_service)]


def not_found(transaction_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Transaction {transaction_id} not found",
    )


@router.get("", response_model=list[TransactionResponse])
def list_transactions(
    service: Service,
    transaction_type: Annotated[TransactionType | None, Query(alias="type")] = None,
) -> list[TransactionResponse]:
    return service.list(transaction_type)


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, service: Service) -> TransactionResponse:
    try:
        return service.get(transaction_id)
    except TransactionNotFound as error:
        raise not_found(transaction_id) from error


@router.post(
    "",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    transaction: TransactionCreate, service: Service
) -> TransactionResponse:
    return service.create(transaction)


@router.put("/{transaction_id}", response_model=TransactionResponse)
def replace_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    service: Service,
) -> TransactionResponse:
    try:
        return service.replace(transaction_id, transaction)
    except TransactionNotFound as error:
        raise not_found(transaction_id) from error


@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction: TransactionPatch,
    service: Service,
) -> TransactionResponse:
    try:
        return service.update(transaction_id, transaction)
    except TransactionNotFound as error:
        raise not_found(transaction_id) from error


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, service: Service) -> Response:
    try:
        service.delete(transaction_id)
    except TransactionNotFound as error:
        raise not_found(transaction_id) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)
