from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel, Field, model_validator


class TransactionType(StrEnum):
    INCOME = "income"
    EXPENSE = "expense"


class TransactionBase(BaseModel):
    description: str = Field(min_length=3, max_length=100)
    amount: Decimal = Field(gt=0, decimal_places=2)
    type: TransactionType
    category: str | None = Field(default=None, max_length=50)


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class TransactionPatch(BaseModel):
    description: str | None = Field(default=None, min_length=3, max_length=100)
    amount: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    type: TransactionType | None = None
    category: str | None = Field(default=None, max_length=50)

    @model_validator(mode="after")
    def check_fields(self) -> "TransactionPatch":
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")
        return self


class TransactionResponse(TransactionBase):
    id: int
